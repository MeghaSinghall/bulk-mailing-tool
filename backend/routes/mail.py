from fastapi import APIRouter, HTTPException, Depends, Form, UploadFile, File
from models import MailHistory
from auth import get_current_user
from bson import ObjectId
from typing import List, Optional
from starlette.responses import JSONResponse
from database import agent_collection, mail_collection, batch_collection
import smtplib
from email.message import EmailMessage
from datetime import datetime
import json
import asyncio
from scheduler import scheduler  # Import the scheduler from main.py
from zoneinfo import ZoneInfo
router = APIRouter()

# Function to send an email using SMTP
def send_email(name, sender, password, receiver, subject, html_body=None, cc=None, bcc=None, attachments=None, smtp_server='smtp.gmail.com', smtp_port=587):
    msg = EmailMessage()
    msg['From'] = f"{name} <{sender}>"
    msg['To'] = receiver
    msg['Subject'] = subject
    msg['Cc'] = ', '.join(cc) if cc else ''
    
    recipients = [receiver] + (cc if cc else []) + (bcc if bcc else [])
    
    msg.set_content(html_body or '')
    if html_body:
        msg.add_alternative(html_body, subtype='html')
    
    if attachments:
        for attachment in attachments:
            msg.add_attachment(attachment["content"], maintype='application', subtype='octet-stream', filename=attachment["filename"])
    
    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender, password)
            server.sendmail(sender, recipients, msg.as_string())
        return True, None
    except Exception as e:
        return False, str(e)

# Function to customize email templates with recipient data
def customize_message(template: str, data: dict) -> str:
    for key, value in data.items():
        placeholder = f"{{{{{key}}}}}"
        template = template.replace(placeholder, str(value) or '')
    return template

# Asynchronous function to process and send a batch of emails
async def send_batch(batch_id: str):
    batch = await batch_collection.find_one({"_id": ObjectId(batch_id)})
    if not batch:
        print(f"Batch {batch_id} not found")
        return

    await batch_collection.update_one({"_id": ObjectId(batch_id)}, {"$set": {"status": "sending", "updated_at": datetime.utcnow()}})

    agent = await agent_collection.find_one({"_id": ObjectId(batch["agent_id"])})
    if not agent:
        print(f"Agent {batch['agent_id']} not found")
        await batch_collection.update_one({"_id": ObjectId(batch_id)}, {"$set": {"status": "failed", "updated_at": datetime.utcnow()}})
        return

    for recipient in batch["recipients"]:
        customized_subject = customize_message(batch["subject"], recipient)
        customized_message = customize_message(batch["message"], recipient)

        success, error = send_email(
            name=agent.get("name"),
            sender=agent.get("email"),
            password=agent.get("app_password"),
            receiver=recipient["email"],
            subject=customized_subject,
            html_body=customized_message,
            cc=batch["cc"],
            bcc=batch["bcc"],
            attachments=batch["attachments"],
        )

        mail_history = MailHistory(
            user_id=batch["user_id"],
            agent_id=batch["agent_id"],
            recipient=recipient["email"],
            subject=customized_subject,
            body=customized_message,
            batch_id=batch["batch_name"],
            cc=batch["cc"],
            bcc=batch["bcc"],
            attachments=[file["filename"] for file in batch["attachments"]],
            status="sent" if success else "failed",
            error=error if not success else None,
            createdAt=datetime.utcnow().isoformat(),
            updatedAt=datetime.utcnow().isoformat(),
        )
        mail_history_dict = mail_history.dict(by_alias=True)
        await mail_collection.insert_one(mail_history_dict)

        await asyncio.sleep(1)  # Add a 1-second delay between emails

    await batch_collection.update_one({"_id": ObjectId(batch_id)}, {"$set": {"status": "completed", "updated_at": datetime.utcnow()}})

# Endpoint to send an immediate email
@router.post("/send_mail")
async def send_mail(
    agent_id: str = Form(...),
    to: str = Form(...),
    subject: str = Form(...),
    cc: Optional[str] = Form(None),
    bcc: Optional[str] = Form(None),
    message: str = Form(...),
    files: List[UploadFile] = File([]),
    user: dict = Depends(get_current_user),
    batch_id: str = Form(None)
):
    agent = await agent_collection.find_one({"_id": ObjectId(agent_id)})
    if not agent:
        return JSONResponse(status_code=400, content={"message": "Agent not found"})
    if agent["user_id"] != user["_id"]:
        return JSONResponse(status_code=403, content={"message": "Unauthorized"})

    file_data = []
    for file in files:
        content = await file.read()
        file_data.append({"filename": file.filename, "content": content})

    success, error = send_email(
        name=agent.get("name"),
        sender=agent.get("email"),
        password=agent.get("app_password"),
        receiver=to,
        subject=subject,
        html_body=message,
        cc=cc.split(',') if cc else [],
        bcc=bcc.split(',') if bcc else [],
        attachments=file_data
    )

    mail_history = MailHistory(
        user_id=user["_id"],
        agent_id=agent_id,
        recipient=to,
        subject=subject,
        body=message,
        batch_id=batch_id,
        cc=cc.split(',') if cc else [],
        bcc=bcc.split(',') if bcc else [],
        attachments=[file["filename"] for file in file_data],
        status="sent" if success else "failed",
        error=error if not success else None,
        createdAt=datetime.utcnow().isoformat(),
        updatedAt=datetime.utcnow().isoformat(),
    )
    mail_history_dict = mail_history.dict(by_alias=True)
    result = await mail_collection.insert_one(mail_history_dict)
    mail_history_dict["_id"] = str(result.inserted_id)

    return {"message": "Email sending attempted", "mail_history": mail_history_dict}

# Endpoint to schedule a batch of emails
@router.post("/schedule_batch")
async def schedule_batch(
    agent_id: str = Form(...),
    batch_name: str = Form(...),
    subject: str = Form(...),
    message: str = Form(...),
    cc: Optional[str] = Form(None),
    bcc: Optional[str] = Form(None),
    recipients: str = Form(...),
    scheduled_time: str = Form(...),
    files: List[UploadFile] = File([]),
    user: dict = Depends(get_current_user),
):
    try:
        recipients_list = json.loads(recipients)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid recipients JSON")

    try:
        scheduled_dt = datetime.fromisoformat(scheduled_time)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid scheduled_time format")

    now = datetime.now(ZoneInfo("UTC"))
    if scheduled_dt <= now:
        raise HTTPException(status_code=400, detail="Scheduled time must be in the future")
    agent = await agent_collection.find_one({"_id": ObjectId(agent_id)})
    if not agent:
        raise HTTPException(status_code=400, detail="Agent not found")
    if agent["user_id"] != user["_id"]:
        raise HTTPException(status_code=403, detail="Unauthorized")

    attachments = []
    for file in files:
        content = await file.read()
        attachments.append({"filename": file.filename, "content": content})

    batch = {
        "user_id": user["_id"],
        "agent_id": agent_id,
        "batch_name": batch_name,
        "subject": subject,
        "message": message,
        "cc": cc.split(',') if cc else [],
        "bcc": bcc.split(',') if bcc else [],
        "attachments": attachments,
        "recipients": recipients_list,
        "scheduled_time": scheduled_dt,
        "status": "pending",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await batch_collection.insert_one(batch)
    batch_id = str(result.inserted_id)

    scheduler.add_job(
        send_batch,
        'date',
        run_date=scheduled_dt,
        args=[batch_id],
        id=batch_id,
    )

    return {"message": "Batch scheduled successfully", "batch_id": batch_id}


async def send_scheduled_mail(scheduled_mail_id: str):
    scheduled_mail = await mail_collection.find_one({"_id": ObjectId(scheduled_mail_id)})
    if not scheduled_mail:
        print(f"Scheduled mail {scheduled_mail_id} not found")
        return

    agent = await agent_collection.find_one({"_id": ObjectId(scheduled_mail["agent_id"])})
    if not agent:
        print(f"Agent {scheduled_mail['agent_id']} not found")
        await mail_collection.update_one(
            {"_id": ObjectId(scheduled_mail_id)},
            {"$set": {"status": "failed", "updated_at": datetime.utcnow()}}
        )
        return

    success, error = send_email(
        name=agent.get("name"),
        sender=agent.get("email"),
        password=agent.get("app_password"),
        receiver=scheduled_mail["to"],
        subject=scheduled_mail["subject"],
        html_body=scheduled_mail["message"],
        cc=scheduled_mail["cc"],
        bcc=scheduled_mail["bcc"],
        attachments=scheduled_mail["attachments"],
    )

    mail_history = MailHistory(
        user_id=scheduled_mail["user_id"],
        agent_id=scheduled_mail["agent_id"],
        recipient=scheduled_mail["to"],
        subject=scheduled_mail["subject"],
        body=scheduled_mail["message"],
        batch_id=scheduled_mail.get("batch_id"),
        cc=scheduled_mail["cc"],
        bcc=scheduled_mail["bcc"],
        attachments=[file["filename"] for file in scheduled_mail["attachments"]],
        status="sent" if success else "failed",
        error=error if not success else None,
        createdAt=scheduled_mail["created_at"].isoformat(),
        updatedAt=datetime.utcnow().isoformat(),
    )
    mail_history_dict = mail_history.dict(by_alias=True)
    await mail_collection.insert_one(mail_history_dict)

    await mail_collection.update_one(
        {"_id": ObjectId(scheduled_mail_id)},
        {"$set": {"status": "sent" if success else "failed", "updated_at": datetime.utcnow()}}
    )

# New endpoint to schedule a single email
@router.post("/schedule_mail")
async def schedule_mail(
    agent_id: str = Form(...),
    to: str = Form(...),
    subject: str = Form(...),
    cc: Optional[str] = Form(None),
    bcc: Optional[str] = Form(None),
    message: str = Form(...),
    scheduled_time: str = Form(...),
    files: List[UploadFile] = File([]),
    user: dict = Depends(get_current_user),
    batch_id: Optional[str] = Form(None)
):
    try:
        scheduled_dt = datetime.fromisoformat(scheduled_time)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid scheduled_time format")

    now = datetime.now(ZoneInfo("UTC"))
    if scheduled_dt <= now:
        raise HTTPException(status_code=400, detail="Scheduled time must be in the future")
    agent = await agent_collection.find_one({"_id": ObjectId(agent_id)})
    if not agent:
        raise HTTPException(status_code=400, detail="Agent not found")
    if agent["user_id"] != user["_id"]:
        raise HTTPException(status_code=403, detail="Unauthorized")

    attachments = []
    for file in files:
        content = await file.read()
        attachments.append({"filename": file.filename, "content": content})

    scheduled_mail = {
        "user_id": user["_id"],
        "agent_id": agent_id,
        "to": to,
        "subject": subject,
        "message": message,
        "cc": cc.split(',') if cc else [],
        "bcc": bcc.split(',') if bcc else [],
        "attachments": attachments,
        "batch_id": batch_id,
        "scheduled_time": scheduled_dt,
        "status": "pending",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await mail_collection.insert_one(scheduled_mail)
    scheduled_mail_id = str(result.inserted_id)

    scheduler.add_job(
        send_scheduled_mail,
        'date',
        run_date=scheduled_dt,
        args=[scheduled_mail_id],
        id=scheduled_mail_id,
    )

    return {"message": "Mail scheduled successfully", "scheduled_mail_id": scheduled_mail_id}