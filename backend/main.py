from fastapi import FastAPI
from routers import auth, task

app = FastAPI()

app.include_router(auth.router, prefix="/auth")
app.include_router(task.router, prefix="/tasks")
