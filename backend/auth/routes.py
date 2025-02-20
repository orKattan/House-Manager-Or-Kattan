from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from pymongo import MongoClient
from jose import JWTError, jwt
import os

router = APIRouter()
client = MongoClient("mongodb://mongo-db:27017")
db = client["house_manager"]
users_collection = db["users"]
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"

class User(BaseModel):
    email: str
    password: str
    is_admin: bool = False

@router.post("/register")
def register_user(user: User):
    users_collection.insert_one(user.dict())
    return {"message": "User registered"}

@router.post("/login")
def login_user(user: User):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"sub": user.email}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token}
