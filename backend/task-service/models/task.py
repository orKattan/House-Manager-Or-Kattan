from pydantic import BaseModel
from typing import Literal, List
from datetime import datetime

class Task(BaseModel):
    id: str
    title: str
    description: str
    due_date: datetime
    participants: List[str]
    status: Literal['pending', 'in_progress', 'completed']
    category: Literal['Bathroom', 'Kitchen', 'LivingRoom', 'Bedroom']
