from pydantic import BaseModel, Field
from typing import Optional

class Task(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    user: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
