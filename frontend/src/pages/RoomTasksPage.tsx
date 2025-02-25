import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskContext } from '../contexts/TaskContext';
import { useUserContext } from '../contexts/UserContext';
import { Box, Typography } from '@mui/material';
import TaskItem from '../components/TaskItem';
import TaskEditModal from '../components/TaskEditModal';
import { Task } from '../types';

const RoomTasksPage: React.FC = () => {
  const { room } = useParams<{ room: string }>();
  const { tasks, fetchTasks, deleteTask, updateTask } = useTaskContext();
  const { users, fetchUsers } = useUserContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks({ category: room });
    fetchUsers();
  }, []);

  const filteredTasks = tasks.filter(task => task.category === room);

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (updatedTask: Task) => {
    await updateTask(updatedTask.id, updatedTask);
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {room.charAt(0).toUpperCase() + room.slice(1)} Tasks
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {filteredTasks.map(task => (
          <TaskItem key={task.id} task={task} users={users} onDeleteTask={deleteTask} onEditTask={handleEditTask} />
        ))}
      </Box>
      {selectedTask && (
        <TaskEditModal
          open={isModalOpen}
          task={selectedTask}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
          users={users}
        />
      )}
    </Box>
  );
};

export default RoomTasksPage;