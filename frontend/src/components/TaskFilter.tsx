import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import { useUserContext } from '../contexts/UserContext';
import { Container, TextField, Button, Typography, Box, Paper, MenuItem, Select, InputLabel, FormControl, Chip, SelectChangeEvent } from '@mui/material';
import { Task, TaskStatus, TaskCategory, User } from '../types';
import TaskEditModal from './TaskEditModal';
import TaskList from './TaskList';
import ParticipantSelector from './ParticipantSelector';

interface TaskFilterProps {
  onFilterChange: (filters: { category?: string; status?: TaskStatus; users?: string[]; participants?: string[]; due_date?: string }) => Promise<void>;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ onFilterChange }) => {
  const { fetchTasks, tasks, deleteTask, updateTask } = useTaskContext();
  const { fetchUsers, users } = useUserContext();
  const [filters, setFilters] = useState({
    title: '',
    category: '',
    status: '' as TaskStatus,
    users: [] as string[],
    participants: [] as string[],
    due_date: '',
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []); // Only call fetchUsers once when the component mounts

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const handleUsersChange = (event: SelectChangeEvent<string[]>) => {
    setFilters(prevFilters => ({ ...prevFilters, users: event.target.value as string[] }));
  };

  const handleParticipantsChange = (selectedParticipants: User[]) => {
    const participantIds = selectedParticipants.map(user => user.id);
    console.log('Selected Participants:', participantIds); // Log selected participants
    setFilters(prevFilters => ({ ...prevFilters, participants: participantIds }));
  };

  const handleFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onFilterChange(filters);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setError('Failed to fetch tasks');
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    fetchTasks(filters);
  };

  const handleSaveTask = async (updatedTask: Task) => {
    await updateTask(updatedTask.id, updatedTask);
    setSelectedTask(null);
    setIsModalOpen(false);
    fetchTasks(filters);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    const isUserMatch = filters.users.length === 0 || filters.users.some(userId => task.participants.includes(userId));
    const isDueDateMatch = !filters.due_date || new Date(task.due_date) <= new Date(filters.due_date);
    return isUserMatch && isDueDateMatch;
  });

  const getUserName = (userId: string) => {
    const user = users.find(user => user.id === userId);
    return user ? `${user.name} ${user.last_name}` : 'Unknown User';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Filter Tasks
          </Typography>
        </Box>
        <form onSubmit={handleFilter}>
          {error && <p>{error}</p>}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Category"
              variant="outlined"
              name="category"
              value={filters.category}
              onChange={handleChange}
              select
              fullWidth
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={TaskCategory.bathroom}>Bathroom</MenuItem>
              <MenuItem value={TaskCategory.bedroom}>Bedroom</MenuItem>
              <MenuItem value={TaskCategory.garden}>Garden</MenuItem>
              <MenuItem value={TaskCategory.kitchen}>Kitchen</MenuItem>
              <MenuItem value={TaskCategory.laundry}>Laundry</MenuItem>
              <MenuItem value={TaskCategory.livingRoom}>Living Room</MenuItem>
            </TextField>
            <TextField
              label="Status"
              variant="outlined"
              name="status"
              value={filters.status}
              onChange={handleChange}
              select
              fullWidth
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={TaskStatus.Pending}>Pending</MenuItem>
              <MenuItem value={TaskStatus.InProgress}>In Progress</MenuItem>
              <MenuItem value={TaskStatus.Completed}>Completed</MenuItem>
            </TextField>
            <FormControl fullWidth>
              <InputLabel>User</InputLabel>
              <Select
                multiple
                value={filters.users}
                onChange={handleUsersChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={getUserName(value)} />
                    ))}
                  </Box>
                )}
              >
                {users.map((user: User) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} {user.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Due Date"
              variant="outlined"
              name="due_date"
              type="date"
              value={filters.due_date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Filter Tasks
            </Button>
          </Box>
        </form>
      </Paper>
      <TaskList
        tasks={filteredTasks}
        users={users}
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditTask}
      />
      {selectedTask && (
        <TaskEditModal
          open={isModalOpen}
          task={selectedTask}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
          users={users} // Pass the users prop to TaskEditModal
        />
      )}
    </Container>
  );
};

export default TaskFilter;
