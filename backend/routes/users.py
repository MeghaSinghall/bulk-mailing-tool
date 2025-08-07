from fastapi import APIRouter, HTTPException
from models import User
from database import users_collection

router = APIRouter()

@router.post("/users/")
async def create_user(user: User):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    new_user = user.dict()
    result = await users_collection.insert_one(new_user)
    return {"id": str(result.inserted_id), "message": "User created successfully"}

@router.get("/users/{email}")
async def get_user(email: str):
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user["_id"] = str(user["_id"])  # Convert ObjectId to string
    return user


