import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Task, User, EmailNotification } from '../types';
import { useUserContext } from '../contexts/UserContext';

interface TaskItemProps {
  task: Task;
  users: User[];
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, users, onDeleteTask, onEditTask }) => {
  const { sendNotification } = useUserContext();

  const getUserName = (userId: string) => {
    const user = users.find(user => user.id === userId);
    return user ? `${user.name} ${user.last_name}` : 'Unknown User';
  };

  const getUserEmail = (userId: string) => {
    const user = users.find(user => user.id === userId);
    return user ? user.email : '';
  };

  const handleSendNotification = async () => {
    const participantEmails = task.participants.map(participantId => getUserEmail(participantId)).filter(email => email !== '');

    console.log('Participant Emails:', participantEmails); // Log participant emails

    const notification: EmailNotification = {
      subject: `Task "${task.title}" Notification`,
      recipients: participantEmails,
      body: `The task "${task.title}" has been updated. Please check the details.`,
    };

    try {
      console.log('Notification:', notification); // Log the notification object
      await sendNotification(notification);
      alert('Notification sent successfully');
    } catch (error) {
      alert('Failed to send notification');
    }
  };

  return (
    <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2, boxShadow: 1, width: '100%' }}>
      <Typography variant="h6">{task.title}</Typography>
      <Typography variant="body1">{task.description}</Typography>
      <Typography variant="body2">Due Date: {task.due_date}</Typography>
      <Typography variant="body2">Start Time: {task.start_time}</Typography>
      <Typography variant="body2">End Time: {task.end_time}</Typography>
      <Typography variant="body2">Category: {task.category}</Typography>
      <Typography variant="body2">Status: {task.status}</Typography>
      <Typography variant="body2">
        Participants: {task.participants.map((p: string) => getUserName(p)).join(', ')}
      </Typography>
      <Typography variant="body2">
        Participant Emails: {task.participants.map((p: string) => getUserEmail(p)).join(', ')}
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button variant="contained" color="primary" onClick={() => onEditTask(task)}>
          Edit
        </Button>
        <Button variant="contained" color="secondary" onClick={() => onDeleteTask(task.id)}>
          Delete
        </Button>
        <Button variant="contained" color="info" onClick={handleSendNotification}>
          Send Notification
        </Button>
      </Box>
    </Box>
  );
};

export default TaskItem;