from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import uuid

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    id: str
    title: str
    description: str
    dueDate: str
    startTime: str
    endTime: str
    participants: List[str]
    recurring: bool
    category: str
    priority: str
    status: str

tasks = []

@app.get("/tasks", response_model=List[Task])
async def get_tasks(category: Optional[str] = None, user: Optional[str] = None):
    filtered_tasks = tasks
    if category:
        filtered_tasks = [task for task in filtered_tasks if task.category == category]
    if user:
        filtered_tasks = [task for task in filtered_tasks if user in task.participants]
    return filtered_tasks

@app.post("/tasks", response_model=Task)
async def add_task(new_task: Task):
    new_task.id = str(uuid.uuid4())
    tasks.append(new_task)
    return new_task

@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, updated_task: Task):
    for task in tasks:
        if task.id == task_id:
            task.title = updated_task.title
            task.description = updated_task.description
            task.dueDate = updated_task.dueDate
            task.startTime = updated_task.startTime
            task.endTime = updated_task.endTime
            task.participants = updated_task.participants
            task.recurring = updated_task.recurring
            task.category = updated_task.category
            task.priority = updated_task.priority
            task.status = updated_task.status
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}", response_model=Task)
async def delete_task(task_id: str):
    for task in tasks:
        if task.id == task_id:
            tasks.remove(task)
            return task
    raise HTTPException(status_code=404, detail="Task not found")
