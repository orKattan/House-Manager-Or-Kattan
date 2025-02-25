from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, ValidationError
from pymongo import MongoClient
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import List, Dict
import os
from dotenv import load_dotenv

# Ensure load_dotenv() is called before accessing environment variables
load_dotenv()

router = APIRouter()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo-db:27017")
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default_secret_key")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Ensure MongoDB connection
try:
    client = MongoClient(MONGO_URI)
    db = client["house_manager"]
    users_collection = db["users"]
    print("Connected to MongoDB")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

class User(BaseModel):
    id: str
    username: str
    password: str
    name: str
    last_name: str
    email: EmailStr

class UserResponse(BaseModel):
    id: str
    username: str
    name: str
    last_name: str
    email: EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    username: str
    password: str

class UpdatePasswordModel(BaseModel):
    old_password: str
    new_password: str


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    """Decode the JWT token, return the user record from DB."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token is invalid or expired")

    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

@router.post("/register")
async def register_user(request: Request):
    try:
        payload = await request.json()
        print(f"Received payload: {payload}")

        try:
            user_data = User(**payload)
        except ValidationError as e:
            print(f"Validation error: {e}")
            raise HTTPException(status_code=422, detail=e.errors())

        existing_user_email = users_collection.find_one({"email": user_data.email})
        if existing_user_email:
            print("Email already registered")
            raise HTTPException(status_code=400, detail="Email already registered")

        existing_user_username = users_collection.find_one({"username": user_data.username})
        if existing_user_username:
            print("Username already taken")
            raise HTTPException(status_code=400, detail="Username already taken")

        hashed_password = get_password_hash(user_data.password)
        new_user = {
            "username": user_data.username,
            "password": hashed_password,
            "name": user_data.name,
            "last_name": user_data.last_name,
            "email": user_data.email
        }
        users_collection.insert_one(new_user)
        print("User registered successfully")
        return {"message": "User registered successfully"}
    except HTTPException as e:
        print(f"HTTPException during registration: {e.detail}")
        raise e
    except Exception as e:
        print(f"Error during registration: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/login", response_model=Token)
async def login(request: Request):
    try:
        payload = await request.json()
        print(f"Received payload: {payload}")

        try:
            user_data = UserLogin(**payload)
        except ValidationError as e:
            print(f"Validation error: {e}")
            raise HTTPException(status_code=422, detail=e.errors())

        user = users_collection.find_one({"username": user_data.username})
        if not user:
            raise HTTPException(status_code=400, detail="Login failed. Please check your credentials and try again.")

        if not verify_password(user_data.password, user["password"]):
            raise HTTPException(status_code=400, detail="Login failed. Please check your credentials and try again.")

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["email"]},
            expires_delta=access_token_expires
        )
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/users/me", response_model=UserResponse)
async def get_current_user_profile(current_user: Dict = Depends(get_current_user)):
    current_user["_id"] = str(current_user["_id"])  # Convert ObjectId to string
    return current_user

@router.put("/users/me", response_model=UserResponse)
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

@router.get("/users", dependencies=[Depends(get_current_user)], response_model=List[UserResponse])
async def get_users():
    users = []
    for user in users_collection.find():
        users.append(UserResponse(
            id=str(user["_id"]),
            username=user["username"],
            name=user["name"],
            last_name=user["last_name"],
            email=user["email"]
        ))
    return users

# Mock current user for demonstration purposes
@router.get("/users/me", response_model=UserResponse)
async def get_current_user():
    current_user = users_collection.find_one({"username": "current_user"})
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=str(current_user["_id"]),
        username=current_user["username"],
        name=current_user["name"],
        last_name=current_user["last_name"],
        email=current_user["email"]
    )
