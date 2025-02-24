import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskContext } from '../contexts/TaskContext';
import { Box, Typography } from '@mui/material';
import TaskItem from '../components/TaskItem';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

const RoomTasksPage: React.FC = () => {
  const { room } = useParams<{ room: string }>();
  const { fetchTasks, tasks, deleteTask, updateTask } = useTaskContext();

  useEffect(() => {
    fetchTasks({ category: room });
  }, [room, fetchTasks]);

  const filteredTasks = tasks.filter(task => task.category === room);

  const handleEditTask = (task: Task) => {
    updateTask(task.id, task);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {room.charAt(0).toUpperCase() + room.slice(1)} Tasks
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {filteredTasks.map(task => (
          <TaskItem key={task.id} task={task} users={[]} onDeleteTask={deleteTask} onEditTask={handleEditTask} />
        ))}
      </Box>
    </Box>
  );
};

export default RoomTasksPage;