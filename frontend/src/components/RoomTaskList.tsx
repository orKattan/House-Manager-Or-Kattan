import React from 'react';
import { Task } from '../types';
import { Button, Box, Typography } from '@mui/material';

interface RoomTaskListProps {
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

const RoomTaskList: React.FC<RoomTaskListProps> = ({ tasks, onDeleteTask, onEditTask }) => {
  const handleEditClick = (task: Task) => {
    onEditTask(task);
  };

  const handleDeleteClick = (taskId: string) => {
    onDeleteTask(taskId);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {tasks.map(task => (
        <Box key={task.id} sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6">{task.title}</Typography>
          <Typography variant="body1">{task.description}</Typography>
          <Typography variant="body2">Due Date: {task.due_date}</Typography>
          <Typography variant="body2">Start Time: {task.start_time}</Typography>
          <Typography variant="body2">End Time: {task.end_time}</Typography>
          <Typography variant="body2">Category: {task.category}</Typography>
          <Typography variant="body2">Status: {task.status}</Typography>
          <Typography variant="body2">Participants: {task.participants.join(', ')}</Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button variant="contained" color="primary" onClick={() => handleEditClick(task)}>
              Edit
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(task.id)}>
              Delete
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default RoomTaskList;
