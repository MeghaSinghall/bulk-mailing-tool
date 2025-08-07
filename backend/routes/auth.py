from fastapi import APIRouter, HTTPException, Depends
from models import UserLogin, User
from auth import verify_password, create_access_token, hash_password, get_current_user
from database import users_collection, agent_collection
from datetime import timedelta

router = APIRouter()

@router.post("/register/")
async def register_user(user: User):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user.password = hash_password(user.password)  # Hash the password
    await users_collection.insert_one(user.dict())
    return {"message": "User registered successfully"}

@router.post("/login/")
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token({"sub": user.email}, timedelta(minutes=30))
    return {"token": token, "token_type": "bearer"}


@router.post("/verify_login/")
async def check_login(user: dict = Depends(get_current_user)):
    return {"message": "done"}
    # This is a dummy function to check if the token is valid
    