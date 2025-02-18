from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel, Field
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo-db:27017")

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

# @router.post("/")
# def create_task(task: Task):
#     task_dict = task.dict()
#     task_dict["createdAt"] = datetime.utcnow()
#     tasks_collection.insert_one(task_dict)
#     return {"message": "Task created successfully"}

@router.post("/")
def create_task(task: Task):
    try:
        task_dict = task.model_dump()  # מעודכן לגרסת Pydantic החדשה
        task_dict["createdAt"] = datetime.utcnow()
        result = tasks_collection.insert_one(task_dict)

        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="Failed to insert task")

        return {"message": "Task created successfully", "task_id": str(result.inserted_id)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
def get_tasks():
    tasks = list(tasks_collection.find())
    for task in tasks:
        task["_id"] = str(task["_id"])
    return tasks

@router.get("/{task_id}")
def get_task(task_id: str):
    try:
        task = tasks_collection.find_one({"_id": ObjectId(task_id)})
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        task["_id"] = str(task["_id"])
        return task
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{task_id}")
def update_task(task_id: str, task: Task):
    try:
        result = tasks_collection.update_one({"_id": ObjectId(task_id)}, {"$set": task.dict()})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"message": "Task updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{task_id}")
def delete_task(task_id: str):
    try:
        result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"message": "Task deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/filter")
def filter_tasks(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None)
):
    query = {}
    if category:
        query["category"] = category
    if status:
        query["status"] = status
    if priority:
        query["priority"] = priority

    tasks = list(tasks_collection.find(query))
    for task in tasks:
        task["_id"] = str(task["_id"])
    return tasks
