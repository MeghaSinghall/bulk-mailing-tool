from fastapi import APIRouter, HTTPException, Depends
from models import Agent, User, EmailSchema, MailHistory
from database import agent_collection, users_collection, mail_collection
from auth import get_current_user
from bson import ObjectId
from typing import List, Optional
from datetime import datetime
from starlette.responses import JSONResponse
from zoneinfo import ZoneInfo

router = APIRouter()

@router.get("/mail_histories")
async def list_mail_histories(
    skip: int = 0,
    limit: int = 10,
    user: dict = Depends(get_current_user)
):
    query = {"user_id": str(user["_id"])}
    # Use skip(), limit(), and to_list() to fetch the data
    mail_histories = await mail_collection.find(query).skip(skip).limit(limit).to_list(length=limit)
    # sort according to the created_at field
    mail_histories.sort(key=lambda x: x["created_at"], reverse=True)
    # Optional: Convert MongoDB ObjectId to strings for JSON compatibility
    for mail in mail_histories:
        mail["_id"] = str(mail["_id"])
    # change the UTC time to IST
    for mail in mail_histories:
        dt = mail["created_at"]
        # If dt is naïve, assume it is in UTC:
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=ZoneInfo("UTC"))
        # Convert to IST:
        mail["created_at"] = dt.astimezone(ZoneInfo("Asia/Kolkata")).strftime("%Y-%m-%d %H:%M:%S")
    return mail_histories