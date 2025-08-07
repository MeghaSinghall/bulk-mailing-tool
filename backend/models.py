from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class User(BaseModel):
    name: str
    email: EmailStr
    password: str
    agent_ids: list = []
    is_active: bool = True
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class Agent(BaseModel):
    name: str
    email: EmailStr
    app_password: str
    user_id: str = ""
    

class EmailSchema(BaseModel):
    agent_id: str
    recipient: List[EmailStr]
    subject: str
    body: str
    cc: Optional[List[EmailStr]] = []
    bcc: Optional[List[EmailStr]] = []

class MailHistory(BaseModel):
    user_id: str  # New field to link mail history to a user
    agent_id: str
    recipient: str
    subject: str
    body: str
    batch_id: Optional[str] = None
    cc: Optional[List[str]] = []
    bcc: Optional[List[str]] = []
    attachments: Optional[List[str]] = []
    status: str = "sent"
    error: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
