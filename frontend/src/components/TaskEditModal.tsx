import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import { Task, TaskStatus, TaskCategory, User } from '../types';
import ParticipantSelector from './ParticipantSelector';

interface TaskEditModalProps {
  open: boolean;
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
  users: User[];
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ open, task, onClose, onSave, users }) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);

  useEffect(() => {
    setEditedTask(task);
    setSelectedParticipants(users.filter(user => task.participants.includes(user.id)));
  }, [task, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const handleSave = () => {
    onSave({ ...editedTask, participants: selectedParticipants.map(user => user.id) });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" gutterBottom>
          Edit Task
        </Typography>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          name="title"
          value={editedTask.title}
          onChange={handleChange}
          required
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          name="description"
          value={editedTask.description}
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
          value={editedTask.due_date}
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
          value={editedTask.start_time}
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
          value={editedTask.end_time}
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
          value={editedTask.category}
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
          value={editedTask.status}
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
          <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default TaskEditModal;
