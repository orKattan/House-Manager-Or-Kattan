from fastapi import APIRouter, Depends, HTTPException
from pymongo import MongoClient
from typing import List, Dict
import os
from dotenv import load_dotenv
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from passlib.context import CryptContext

load_dotenv()

router = APIRouter()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo-db:27017")
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default_secret_key")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    client = MongoClient(MONGO_URI)
    db = client["house_manager"]
    users_collection = db["users"]
    print("Connected to MongoDB")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

class User(BaseModel):
    id: str = Field(..., alias="_id")
    username: str
    name: str
    last_name: str
    email: str

class UpdatePasswordModel(BaseModel):
    old_password: str
    new_password: str

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

@router.get("/users/me", response_model=User)
async def get_current_user_profile(current_user: Dict = Depends(get_current_user)):
    current_user["_id"] = str(current_user["_id"])  # Convert ObjectId to string
    return current_user

@router.put("/users/me", response_model=User)
async def update_current_user_profile(updated_user: User, current_user: Dict = Depends(get_current_user)):
    try:
        result = users_collection.update_one({"_id": current_user["_id"]}, {"$set": updated_user.dict(by_alias=True)})
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="User not found or no changes made")
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/users/me/password", response_model=Dict[str, str])
async def update_password(update_password_model: UpdatePasswordModel, current_user: Dict = Depends(get_current_user)):
    try:
        user = users_collection.find_one({"_id": current_user["_id"]})
        if not user or not pwd_context.verify(update_password_model.old_password, user["password"]):
            raise HTTPException(status_code=400, detail="Old password is incorrect")
        
        hashed_password = pwd_context.hash(update_password_model.new_password)
        result = users_collection.update_one({"_id": current_user["_id"]}, {"$set": {"password": hashed_password}})
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="User not found or no changes made")
        return {"message": "Password updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/users", dependencies=[Depends(get_current_user)], response_model=List[Dict[str, str]])
async def get_users():
    users = users_collection.find({}, {"_id": 1, "name": 1, "last_name": 1})
    return [{"id": str(user["_id"]), "name": user["name"], "last_name": user["last_name"]} for user in users]
