from fastapi.testclient import TestClient
from backend.main import app

test_client = TestClient(app)

def test_create_task():
    response = test_client.post("/tasks", json={
        "title": "Test Task",
        "description": "Testing API",
        "due_date": "2025-01-01T00:00:00",
        "priority": "high"
    })
    assert response.status_code == 200
    assert "task_id" in response.json()

def test_get_tasks():
    response = test_client.get("/tasks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
