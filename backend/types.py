from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

# Define an Enum for the categories
class Category(str, Enum):
    bathroom = "bathroom"
    bedroom = "bedroom"
    garden = "garden"
    kitchen = "kitchen"
    laundry = "laundry"
    livingroom = "livingroom"

# Pydantic models
class Task(BaseModel):
    title: str
    description: str = ""
    completed: bool = False
    category: Category
    due_date: Optional[datetime] = Field(default=None, example="2023-10-10T10:00:00")
