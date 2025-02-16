from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import task
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to the specific origins you want to allow
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add prefix to task routes
app.include_router(task.router, prefix="/tasks")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Task Service"}
