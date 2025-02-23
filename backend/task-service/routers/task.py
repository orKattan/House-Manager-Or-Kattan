from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime, date, time
from typing import List, Optional
import os
from dotenv import load_dotenv
from jose import JWTError, jwt
from models import Task

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

@router.get("", response_model=List[Task], dependencies=[Depends(get_current_user)])
async def get_tasks(
    category: Optional[str] = Query(None),
    user: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
):
    query = {}
    if category:
        query["category"] = category
    if user:
        query["user"] = user
    if status:
        query["status"] = status

    tasks = list(tasks_collection.find(query))
    for task in tasks:
        task["_id"] = str(task["_id"])  # Convert ObjectId to string
        if "due_date" in task and isinstance(task["due_date"], str):
            task["due_date"] = datetime.strptime(task["due_date"], "%Y-%m-%d").date().isoformat()
        if "start_time" in task and isinstance(task["start_time"], str):
            task["start_time"] = task["start_time"]
        if "end_time" in task and isinstance(task["end_time"], str):
            task["end_time"] = task["end_time"]
    return tasks

@router.post("", response_model=Task, dependencies=[Depends(get_current_user)])
async def create_task(task: Task):
    try:
        task_dict = task.dict()
        task_dict["createdAt"] = datetime.utcnow()
        if isinstance(task_dict["due_date"], date):
            task_dict["due_date"] = task_dict["due_date"].isoformat()
        if isinstance(task_dict["start_time"], time):
            task_dict["start_time"] = task_dict["start_time"].isoformat()
        if isinstance(task_dict["end_time"], time):
            task_dict["end_time"] = task_dict["end_time"].isoformat()
        result = tasks_collection.insert_one(task_dict)
        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="Failed to insert task")
        task_dict["_id"] = str(result.inserted_id)
        return task_dict
    except Exception as e:
        print(f"Error creating task: {e}")  # Add logging for errors
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{task_id}", response_model=Task, dependencies=[Depends(get_current_user)])
async def update_task(task_id: str, task: Task):
    try:
        if not ObjectId.is_valid(task_id):
            raise HTTPException(status_code=400, detail="Invalid task ID")
        existing_task = tasks_collection.find_one({"_id": ObjectId(task_id)})
        if not existing_task:
            raise HTTPException(status_code=404, detail="Task not found")
        task_dict = task.dict()
        if isinstance(task_dict["due_date"], date):
            task_dict["due_date"] = task_dict["due_date"].isoformat()
        if isinstance(task_dict["start_time"], time):
            task_dict["start_time"] = task_dict["start_time"].isoformat()
        if isinstance(task_dict["end_time"], time):
            task_dict["end_time"] = task_dict["end_time"].isoformat()
        result = tasks_collection.update_one({"_id": ObjectId(task_id)}, {"$set": task_dict})
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Task not found or no changes made")
        task_dict["_id"] = task_id
        return task_dict
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/distinct/{field}", dependencies=[Depends(get_current_user)])
async def get_distinct_values(field: str):
    if field not in ["category", "user", "status"]:
        raise HTTPException(status_code=400, detail="Invalid field")
    values = tasks_collection.distinct(field)
    return values

@router.delete("/{task_id}", dependencies=[Depends(get_current_user)])
def delete_task(task_id: str):
    try:
        if not ObjectId.is_valid(task_id):
            raise HTTPException(status_code=400, detail="Invalid task ID")
        result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"message": "Task deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

