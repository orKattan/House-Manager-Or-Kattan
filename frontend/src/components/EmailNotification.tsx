import React from 'react';
import { useUserContext } from '../contexts/UserContext';
import { Button } from '@mui/material';
import { cyan } from '@mui/material/colors';
import { EmailNotification as EmailNotificationType } from '../types';

interface EmailNotificationProps {
  subject: string;
  recipients: string[];
  body: string;
}

const EmailNotification: React.FC<EmailNotificationProps> = ({ subject, recipients, body }) => {
  const { sendNotification } = useUserContext();
  const color = cyan[500];

  const handleSendNotification = async () => {
    const notification: EmailNotificationType = {
      subject,
      recipients,
      body,
    };

    try {
      await sendNotification(notification);
      alert('Notification sent successfully');
    } catch (error) {
      alert('Failed to send notification');
    }
  };

  return (
    <div>
      <Button variant="contained" style={{ backgroundColor: color }} onClick={handleSendNotification}>
        Send Notification
      </Button>
    </div>
  );
};

export default EmailNotification;
