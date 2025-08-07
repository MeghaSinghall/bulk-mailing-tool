from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.users import router as user_router
from routes.auth import router as auth_router
from routes.agent import router as agent_router
from routes.mail import router as mail_router
from routes.history import router as history_router
from scheduler import scheduler  # Import from scheduler.py instead

# Initialize FastAPI app
app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes
app.include_router(user_router)
app.include_router(agent_router)
app.include_router(auth_router)
app.include_router(mail_router)
app.include_router(history_router)

# Startup event to start the scheduler
@app.on_event("startup")
async def startup_event():
    scheduler.start()
    print("Scheduler started successfully")

# Shutdown event to stop the scheduler
@app.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()
    print("Scheduler shut down successfully")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))  # Get port from environment variable or default to 8000
    uvicorn.run(app, host="0.0.0.0", port=port)