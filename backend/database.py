from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb+srv://jatinmahawar08:XcPo5NnHnj48fxk7@cluster0.978xu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = AsyncIOMotorClient(MONGO_URI)
db = client["mydatabase"]
users_collection = db["users"]
agent_collection = db["agents"]
mail_collection = db["mails"]
batch_collection = db["batches"]