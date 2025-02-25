import smtplib
import logging
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from a .env file

app = FastAPI()

# Enable CORS
origins = [
    "http://localhost:3000",  # React frontend
    "http://localhost:8001",  # Auth service
    "http://localhost:8002",  # Task service
    "http://localhost:8003",  # Notification service
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supported SMTP servers based on email domain
SMTP_SERVERS = {
    "gmail.com": {"server": "smtp.gmail.com", "port": 587},
    "outlook.com": {"server": "smtp.office365.com", "port": 587},
    "hotmail.com": {"server": "smtp.office365.com", "port": 587},
    "yahoo.com": {"server": "smtp.mail.yahoo.com", "port": 465},
    "aol.com": {"server": "smtp.aol.com", "port": 465},
    "zoho.com": {"server": "smtp.zoho.com", "port": 587},
    "icloud.com": {"server": "smtp.mail.me.com", "port": 587},
}

# Email request model
class EmailNotification(BaseModel):
    subject: str
    recipients: List[EmailStr]
    body: str

# Function to determine SMTP settings dynamically
def get_smtp_settings(email: str):
    domain = email.split("@")[-1].lower()
    if domain in SMTP_SERVERS:
        return SMTP_SERVERS[domain]["server"], SMTP_SERVERS[domain]["port"]
    raise HTTPException(status_code=400, detail=f"Unsupported email provider: {domain}")

# Function to send emails dynamically
def send_email(notification: EmailNotification):
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")

    # Log the environment variables
    logging.info(f"SENDER_EMAIL: {sender_email}")
    logging.info(f"SENDER_PASSWORD: {sender_password}")

    if not sender_email or not sender_password:
        raise HTTPException(status_code=500, detail="Email configuration is missing")

    smtp_server, smtp_port = get_smtp_settings(sender_email)

    for recipient in notification.recipients:
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = recipient
        msg["Subject"] = notification.subject
        msg.attach(MIMEText(notification.body, "plain"))

        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient, msg.as_string())
            server.quit()
        except Exception as e:
            logging.error(f"Error sending email to {recipient}: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/send-email/")
async def send_email_notification(notification: EmailNotification, request: Request):
    request_body = await request.json()
    logging.info(f"Request body: {request_body}")
    try:
        send_email(notification)
        return {"message": "Email sent successfully"}
    except Exception as e:
        logging.error(f"Error sending email: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")
