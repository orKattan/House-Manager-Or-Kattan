from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from bson.objectid import ObjectId
from routers import auth
from dotenv import load_dotenv
import os
from fastapi.security import OAuth2PasswordRequestForm
from typing import List

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo-db:27017")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default_secret_key")

if not JWT_SECRET_KEY:
    raise ValueError("No JWT_SECRET_KEY environment variable set")

app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost:3000",  # React frontend
    "http://localhost:8001",  # Auth service
    "http://localhost:8002",  # Task service
    "http://localhost:8003",  # Notification service
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(MONGO_URI)
db = client["house_manager"]
users_collection = db["users"]

app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Auth Service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
