import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Alert, MenuItem } from '@mui/material';
import { Task, TaskStatus, TaskCategory, User } from '../types';
import { useTaskContext } from '../contexts/TaskContext';
import ParticipantSelector from './ParticipantSelector';

interface TaskEditModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  onSave: (updatedTask: Task) => void;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ open, onClose, task, onSave }) => {
  const { updateTask, deleteTask } = useTaskContext();
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    due_date: '',
    start_time: '',
    end_time: '',
    participants: [],
    category: TaskCategory.Bathroom,
    status: TaskStatus.Pending,
    user: '',
  });
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setFormData(task);
      setSelectedParticipants(task.participants.map(id => users.find(user => user.id === id)).filter(Boolean) as User[]);
    }
  }, [task, users]);

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
        if (!response.ok) throw new Error('Failed to fetch users');
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
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
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
    if (validateTask(formData) && task) {
      const updatedTask = { ...formData, id: task.id, participants: selectedParticipants.map(user => user.id) };
      try {
        await updateTask(task.id, updatedTask);
        onSave(updatedTask);
        onClose();
      } catch (error) {
        console.error('Error updating task:', error);
        setError('Failed to update task. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    if (task) {
      await deleteTask(task.id);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-task-modal-title" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography id="edit-task-modal-title" variant="h5" fontWeight="bold" gutterBottom>
          Edit Task
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Title" fullWidth margin="normal" name="title" value={formData.title} onChange={handleChange} required />
          <TextField label="Description" fullWidth margin="normal" name="description" value={formData.description} onChange={handleChange} multiline rows={3} />
          <TextField label="Due Date" fullWidth margin="normal" name="due_date" type="date" value={formData.due_date} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          <TextField label="Start Time" fullWidth margin="normal" name="start_time" type="time" value={formData.start_time} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          <TextField label="End Time" fullWidth margin="normal" name="end_time" type="time" value={formData.end_time} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          <TextField label="Category" fullWidth margin="normal" name="category" value={formData.category} onChange={handleChange} select required>
            {Object.values(TaskCategory).map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </TextField>
          <TextField label="Status" fullWidth margin="normal" name="status" value={formData.status} onChange={handleChange} select required>
            {Object.values(TaskStatus).map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </TextField>
          <ParticipantSelector users={users} selectedParticipants={selectedParticipants} setSelectedParticipants={setSelectedParticipants} />
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" color="secondary" onClick={handleDelete}>
              Delete
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default TaskEditModal;
