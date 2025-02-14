from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo-db:27017")

client = MongoClient(MONGO_URI)
db = client["house_manager"]
tasks_collection = db["tasks"]

class Task(BaseModel):
    name: str
    description: str
    due_date: datetime
    start_time: datetime
    end_time: datetime
    participants: list
    recurring: bool
    category: str

@router.post("/tasks")
def create_task(task: Task):
    task_dict = task.dict()
    task_dict["created_at"] = datetime.utcnow()
    tasks_collection.insert_one(task_dict)
    return {"message": "Task created successfully"}

@router.get("/tasks")
def get_tasks():
    tasks = list(tasks_collection.find())
    for task in tasks:
        task["_id"] = str(task["_id"])
    return tasks

@router.get("/tasks/{task_id}")
def get_task(task_id: str):
    task = tasks_collection.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task["_id"] = str(task["_id"])
    return task

@router.put("/tasks/{task_id}")
def update_task(task_id: str, task: Task):
    result = tasks_collection.update_one({"_id": ObjectId(task_id)}, {"$set": task.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task updated successfully"}

@router.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}
