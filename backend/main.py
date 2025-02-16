from fastapi import FastAPI
from routers import auth, task

app = FastAPI()

app.include_router(auth.router, prefix="/auth")
app.include_router(task.router, prefix="/tasks")  # Ensure this line is correct

@app.get("/")
def read_root():
    return {"message": "Welcome to the House Manager API"}
