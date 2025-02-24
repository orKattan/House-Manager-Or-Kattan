from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = FastAPI()

class EmailNotification(BaseModel):
    subject: str
    recipients: List[EmailStr]
    body: str

def send_email(notification: EmailNotification):
    sender_email = "your-email@example.com"
    sender_password = "your-email-password"

    for recipient in notification.recipients:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient
        msg['Subject'] = notification.subject

        msg.attach(MIMEText(notification.body, 'plain'))

        try:
            server = smtplib.SMTP('smtp.example.com', 587)
            server.starttls()
            server.login(sender_email, sender_password)
            text = msg.as_string()
            server.sendmail(sender_email, recipient, text)
            server.quit()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Welcome to the notification Service"}

@app.post("/send-email/")
async def send_email_notification(notification: EmailNotification):
    send_email(notification)
    return {"message": "Email sent successfully"}
