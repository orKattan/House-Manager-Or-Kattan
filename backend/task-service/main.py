from fastapi import FastAPI, APIRouter, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo import MongoClient
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from routers import task, user
from dotenv import load_dotenv
from typing import List, Optional
from models import Task
import os

load_dotenv()

app = FastAPI()

client = MongoClient("mongodb://mongo-db:27017")
db = client["house_manager"]
tasks_collection = db["tasks"]

SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend's URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the task and user routers
app.include_router(task.router, prefix="/tasks")
app.include_router(user.router, prefix="")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Task Service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
