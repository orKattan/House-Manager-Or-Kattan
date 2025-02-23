import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskCategory, User } from '../types';
import { useTaskContext } from '../contexts/TaskContext';
import ParticipantSelector from './ParticipantSelector';

interface TaskEditModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void; // Add the onSave prop
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ task, onClose, onSave }) => {
  const { updateTask } = useTaskContext();
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<Task>({
    ...task,
    participants: task.participants || [],
  });
  const [selectedParticipants, setSelectedParticipants] = useState<User[]>([]);

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

  useEffect(() => {
    setSelectedParticipants(users.filter(user => formData.participants.includes(user.id)));
  }, [formData, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTask(task.id, { ...formData, participants: selectedParticipants.map(user => user.id) });
    onSave({ ...formData, participants: selectedParticipants.map(user => user.id) }); // Call onSave with the updated task
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title:</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date:</label>
            <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time:</label>
            <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time:</label>
            <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Participants:</label>
            <ParticipantSelector
              users={users}
              selectedParticipants={selectedParticipants}
              setSelectedParticipants={setSelectedParticipants}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category:</label>
            <select name="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              <option value={TaskCategory.Bathroom}>Bathroom</option>
              <option value={TaskCategory.Bedroom}>Bedroom</option>
              <option value={TaskCategory.Garden}>Garden</option>
              <option value={TaskCategory.Kitchen}>Kitchen</option>
              <option value={TaskCategory.Laundry}>Laundry</option>
              <option value={TaskCategory.LivingRoom}>Living Room</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status:</label>
            <select name="status" value={formData.status} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              <option value={TaskStatus.Pending}>Pending</option>
              <option value={TaskStatus.InProgress}>In Progress</option>
              <option value={TaskStatus.Completed}>Completed</option>
            </select>
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md">Save</button>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
