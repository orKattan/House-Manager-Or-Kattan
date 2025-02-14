from fastapi import FastAPI
from routers import task
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.include_router(task.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Task Service"}
