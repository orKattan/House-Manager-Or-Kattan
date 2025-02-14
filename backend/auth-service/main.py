from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from bson.objectid import ObjectId
from routers import auth
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend's URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient("mongodb://new_mongo_container:27017/")
db = client["house_manager"]
users_collection = db["users"]

class User(BaseModel):
    username: str
    password: str
    name: str
    last_name: str
    email: EmailStr

app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Auth Service"}
