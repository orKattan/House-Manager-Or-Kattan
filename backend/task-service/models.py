from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, time, datetime, timedelta

def default_due_date():
    return date.today()

def default_start_time():
    return datetime.now().time()

def default_end_time():
    return (datetime.now() + timedelta(hours=1)).time()

class Task(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    user: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[date] = Field(default_factory=default_due_date)
    start_time: Optional[time] = Field(default_factory=default_start_time)
    end_time: Optional[time] = Field(default_factory=default_end_time)
    participants: List[str] = []

    class Config:
        allow_population_by_field_name = True
