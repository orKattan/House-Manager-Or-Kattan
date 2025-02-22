import React, { useState, useEffect } from 'react';
import { TaskCategory, TaskStatus, User } from '../types';
import { useUserContext } from '../contexts/UserContext';

interface TaskFilterProps {
  onFilterChange: (filters: { category?: string; user?: string; status?: string; priority?: string }) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ onFilterChange }) => {
  const [category, setCategory] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');

  const [users, setUsers] = useState<User[]>([]);
  const { currentUser } = useUserContext();

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

  useEffect(() => {
    if (currentUser) {
      setUsers(prevUsers => [currentUser, ...prevUsers]);
    }
  }, [currentUser]);

  const handleFilterChange = () => {
    onFilterChange({ category, user, status, priority });
  };

  return (
    <div>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Category</option>
        <option value={TaskCategory.Bathroom}>Bathroom</option>
        <option value={TaskCategory.Bedroom}>Bedroom</option>
        <option value={TaskCategory.Garden}>Garden</option>
        <option value={TaskCategory.Kitchen}>Kitchen</option>
        <option value={TaskCategory.Laundry}>Laundry</option>
        <option value={TaskCategory.LivingRoom}>Living Room</option>
      </select>
      <select value={user} onChange={(e) => setUser(e.target.value)}>
        <option value="">All Users</option>
        {users.map((usr) => (
          <option key={usr.id} value={usr.id}>{`${usr.name} ${usr.last_name}`}</option>
        ))}
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Status</option>
        <option value={TaskStatus.Pending}>Pending</option>
        <option value={TaskStatus.InProgress}>In Progress</option>
        <option value={TaskStatus.Completed}>Completed</option>
      </select>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button onClick={handleFilterChange}>Apply Filters</button>
    </div>
  );
};

export default TaskFilter;
