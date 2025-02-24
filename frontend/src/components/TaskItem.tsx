import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Task, User } from '../types';

interface TaskItemProps {
  task: Task;
  users: User[];
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, users, onDeleteTask, onEditTask }) => {
  const getUserName = (userId: string) => {
    const user = users.find(user => user.id === userId);
    return user ? `${user.name} ${user.last_name}` : 'Unknown User';
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
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button variant="contained" color="primary" onClick={() => onEditTask(task)}>
          Edit
        </Button>
        <Button variant="contained" color="secondary" onClick={() => onDeleteTask(task.id)}>
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default TaskItem;