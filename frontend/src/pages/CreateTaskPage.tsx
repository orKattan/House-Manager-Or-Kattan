import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import { useUserContext } from '../contexts/UserContext';
import ParticipantSelector from '../components/ParticipantSelector';
import { Container, TextField, Button, Typography, Box, Paper, MenuItem } from '@mui/material';
import { Task, TaskStatus, TaskCategory, User } from '../types';

const CreateTaskPage: React.FC = () => {
  const { addTask } = useTaskContext();
  const { currentUser } = useUserContext();
  const [users, setUsers] = useState<User[]>([]);
  const defaultdue_date = new Date().toISOString().split('T')[0];
  const defaultstart_time = new Date().toISOString().split('T')[1].slice(0, 5);
  const defaultend_time = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().split('T')[1].slice(0, 5);
  const [task, setTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    due_date: defaultdue_date,
    start_time: defaultstart_time,
    end_time: defaultend_time,
    participants: [],
    category: TaskCategory.bathroom,
    status: TaskStatus.Pending,
    user: `${currentUser?.name} ${currentUser?.last_name}`,
  });
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setTask(prevTask => ({
        ...prevTask,
        user: `${currentUser.name} ${currentUser.last_name}`,
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8002/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const validateTask = (task: Omit<Task, 'id'>): boolean => {
    if (!task.title || !task.due_date || !task.start_time || !task.end_time || !task.category || !task.status || !task.user) {
      setError('Please fill in all required fields.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateTask(task)) {
      try {
        await addTask({ ...task, participants: selectedParticipants.map(user => user.id) });
        console.log("Task added successfully");
        setTask({
          title: '',
          description: '',
          due_date: defaultdue_date,
          start_time: defaultstart_time,
          end_time: defaultend_time,
          participants: [],
          category: TaskCategory.bathroom,
          status: TaskStatus.Pending,
          user: `${currentUser?.name} ${currentUser?.last_name}`,
        });
        setSelectedParticipants([]);
      } catch (error) {
        console.error('Failed to add task:', error);
        setError('Failed to add task');
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Create Task
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          {error && <p>{error}</p>}
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            name="description"
            value={task.description}
            onChange={handleChange}
            multiline
            rows={4}
          />
          <TextField
            label="Due Date"
            variant="outlined"
            fullWidth
            margin="normal"
            name="due_date"
            type="date"
            value={task.due_date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            label="Start Time"
            variant="outlined"
            fullWidth
            margin="normal"
            name="start_time"
            type="time"
            value={task.start_time}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            label="End Time"
            variant="outlined"
            fullWidth
            margin="normal"
            name="end_time"
            type="time"
            value={task.end_time}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            margin="normal"
            name="category"
            value={task.category}
            onChange={handleChange}
            select
            required
          >
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
            fullWidth
            margin="normal"
            name="status"
            value={task.status}
            onChange={handleChange}
            select
            required
          >
            <MenuItem value={TaskStatus.Pending}>Pending</MenuItem>
            <MenuItem value={TaskStatus.InProgress}>In Progress</MenuItem>
            <MenuItem value={TaskStatus.Completed}>Completed</MenuItem>
          </TextField>
          <ParticipantSelector
            users={users}
            selectedParticipants={selectedParticipants}
            setSelectedParticipants={setSelectedParticipants}
          />
          <Box sx={{ mt: 2 }}>
            <TextField
              label="User"
              variant="outlined"
              value={task.user}
              onChange={(e) => setTask(prevTask => ({ ...prevTask, user: e.target.value }))}
              fullWidth
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Task
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateTaskPage;
