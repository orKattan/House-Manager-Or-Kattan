from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
from typing import List, Optional
import os
from dotenv import load_dotenv
from jose import JWTError, jwt

load_dotenv()

router = APIRouter()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo-db:27017")
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default_secret_key")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

try:
    client = MongoClient(MONGO_URI)
    db = client["house_manager"]
    tasks_collection = db["tasks"]
    print("Connected to MongoDB")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

class Task(BaseModel):
    title: str
    description: str
    dueDate: datetime
    startTime: datetime
    endTime: datetime
    participants: List[str]
    recurring: bool
    category: str
    priority: str
    status: str

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token is invalid or expired")

    user = db["users"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

@router.post("/", dependencies=[Depends(get_current_user)])
def create_task(task: Task):
    try:
        print("Creating task with data:", task.dict())  # Add logging to verify task data
        task_dict = task.dict()
        task_dict["createdAt"] = datetime.utcnow()
        result = tasks_collection.insert_one(task_dict)
        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="Failed to insert task")
        return {"message": "Task created successfully", "task_id": str(result.inserted_id)}
    except Exception as e:
        print(f"Error creating task: {e}")  # Add logging for errors
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", dependencies=[Depends(get_current_user)])
def get_tasks():
    tasks = list(tasks_collection.find())
    for task in tasks:
        task["_id"] = str(task["_id"])
    return tasks

@router.get("/{task_id}", dependencies=[Depends(get_current_user)])
def get_task(task_id: str):
    try:
        print("Received Task ID:", task_id)  # Debugging print
        if not ObjectId.is_valid(task_id):
            raise HTTPException(status_code=400, detail="Invalid task ID")
        task = tasks_collection.find_one({"_id": ObjectId(task_id)})
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        task["_id"] = str(task["_id"])  # Convert ObjectId to string
        print("Returning Task:", task)  # Debugging print
        return task
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{task_id}", dependencies=[Depends(get_current_user)])
def update_task(task_id: str, task: Task):
    try:
        print("Received Task ID for update:", task_id)  # Add logging to verify task ID
        print("Received Task Data for update:", task.dict())  # Add logging to verify task data
        if not ObjectId.is_valid(task_id):
            raise HTTPException(status_code=400, detail="Invalid task ID")
        existing_task = tasks_collection.find_one({"_id": ObjectId(task_id)})
        if not existing_task:
            raise HTTPException(status_code=404, detail="Task not found")
        result = tasks_collection.update_one({"_id": ObjectId(task_id)}, {"$set": task.dict()})
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Task not found or no changes made")
        return {"message": "Task updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{task_id}", dependencies=[Depends(get_current_user)])
def delete_task(task_id: str):
    try:
        print("Received Task ID for deletion:", task_id)  # Add logging to verify task ID
        if not ObjectId.is_valid(task_id):
            raise HTTPException(status_code=400, detail="Invalid task ID")
        result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"message": "Task deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
