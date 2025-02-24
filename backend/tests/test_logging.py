from fastapi.testclient import TestClient
from backend.calendar_service.main import app

client = TestClient(app)

def test_logging():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Calendar Service"}
