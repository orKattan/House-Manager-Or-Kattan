import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { TaskCategory } from '../types';

const HomePage: React.FC = () => {
  const { fetchTasks, tasks } = useTaskContext();
  const [category, setCategory] = useState<string>('');
  const [user, setUser] = useState<string>('');

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
    };

    loadTasks();
  }, []); // Ensure this runs only once when the component mounts

  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchTasks({ category, user });
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm />
      <form onSubmit={handleFilterSubmit}>
        <div>
          <label>Filter by Category:</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All</option>
            <option value={TaskCategory.Bathroom}>Bathroom</option>
            <option value={TaskCategory.Bedroom}>Bedroom</option>
            <option value={TaskCategory.Garden}>Garden</option>
            <option value={TaskCategory.Kitchen}>Kitchen</option>
            <option value={TaskCategory.Laundry}>Laundry</option>
            <option value={TaskCategory.LivingRoom}>Living Room</option>
          </select>
        </div>
        <div>
          <label>Filter by User:</label>
          <input type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="Enter username" />
        </div>
        <button type="submit">Filter</button>
      </form>
      <TaskList tasks={tasks} />
    </div>
  );
};

export default HomePage;
