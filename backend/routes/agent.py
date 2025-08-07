from fastapi import APIRouter, HTTPException, Depends
from models import Agent
from database import agent_collection, users_collection
from auth import get_current_user
from bson import ObjectId

router = APIRouter()


@router.post("/create_agent")
async def create_agent(agent: Agent, user: dict = Depends(get_current_user)):
    # Ensure the authenticated user is the same as the provided user_id
    user_id = user["_id"]
    # Check if agent already exists
    existing_agent = await agent_collection.find_one({"email": agent.email})
    if existing_agent:
        raise HTTPException(status_code=400, detail="Agent already exists")

    # Insert new agent into database
    new_agent = agent.dict()
    new_agent["user_id"] = user_id
    result = await agent_collection.insert_one(new_agent)
    agent_id = str(result.inserted_id)

    # Update user's agent_ids array
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"agent_ids": agent_id}}
    )

    return {"id": agent_id, "message": "Agent created successfully"}



@router.get("/get_agent")
async def get_agent(user: dict = Depends(get_current_user)):
    user_id = user["_id"]  # Extract user ID from authenticated user

    # Find the user in the database
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Retrieve agent IDs
    agent_ids = user.get("agent_ids", [])
    agents = []
    
    # Fetch agent details for each agent_id
    for agent_id in agent_ids:
        agent = await agent_collection.find_one({"_id": ObjectId(agent_id)})
        if agent:
            agent["_id"] = str(agent["_id"])  # Convert ObjectId to string
            agents.append(agent)

    return agents

@router.delete("/delete_agent/{agent_id}")
async def delete_agent(agent_id: str, user: dict = Depends(get_current_user)):
    user_id = user["_id"]
    
    # Check if agent exists
    agent = await agent_collection.find_one({"_id": ObjectId(agent_id)})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Check if agent belongs to the authenticated user
    if agent["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized to delete agent")
    
    # Delete agent from agent_collection
    await agent_collection.delete_one({"_id": ObjectId(agent_id)})
    
    # Remove agent_id from user's agent_ids array
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$pull": {"agent_ids": agent_id}}
    )
    
    return {"message": "Agent deleted successfully"}

@router.put("/update_agent/{agent_id}")
async def update_agent(agent_id: str, updated_agent: Agent, user: dict = Depends(get_current_user)):
    user_id = user["_id"]
    
    # Check if agent exists
    agent = await agent_collection.find_one({"_id": ObjectId(agent_id)})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Check if agent belongs to the authenticated user
    if agent["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized to update agent")
    
    # Update agent details
    await agent_collection.update_one(
        {"_id": ObjectId(agent_id)},
        {"$set": updated_agent.dict()}
    )
    
    return {"message": "Agent updated successfully"}