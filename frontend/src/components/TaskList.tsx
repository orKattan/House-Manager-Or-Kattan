import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Task, User } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  users: User[];
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, users, onDeleteTask, onEditTask }) => {
  const tasksByCategory = tasks.reduce((acc, task) => {
    const category = task.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Box sx={{ mt: 4 }}>
        {Object.entries(tasksByCategory).map(([category, tasks]) => (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {tasks.map(task => (
                <TaskItem key={task.id} task={task} users={users} onDeleteTask={onDeleteTask} onEditTask={onEditTask} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default TaskList;