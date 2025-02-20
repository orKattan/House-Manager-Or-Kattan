from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from pymongo import MongoClient
from bson.objectid import ObjectId
from typing import List, Optional
from datetime import datetime

router = APIRouter()
client = MongoClient("mongodb://mongo-db:27017")
db = client["house_manager"]
tasks_collection = db["tasks"]

class Task(BaseModel):
    title: str
    description: str
    due_date: datetime
    assigned_to: List[str] = []
    priority: str = "medium"
    category: str = "General"
    completed: bool = False

@router.post("/")
def create_task(task: Task):
    task_dict = task.dict()
    task_dict["createdAt"] = datetime.utcnow()
    result = tasks_collection.insert_one(task_dict)
    return {"task_id": str(result.inserted_id)}

@router.get("/")
def get_tasks(priority: Optional[str] = None, category: Optional[str] = None):
    query = {}
    if priority:
        query["priority"] = priority
    if category:
        query["category"] = category
    tasks = list(tasks_collection.find(query))
    for task in tasks:
        task["_id"] = str(task["_id"])
    return tasks
