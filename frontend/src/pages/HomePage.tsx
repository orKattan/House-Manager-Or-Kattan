import React, { useEffect, useState } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { TaskCategory } from '../types'; // Import TaskCategory

const HomePage: React.FC = () => {
  const { fetchTasks } = useTaskContext();
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    console.log('Fetching tasks on mount');
    fetchTasks();
  }, []); // Ensure this runs only once when the component mounts

  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Filtering tasks by category:', category);
    await fetchTasks(category ? { category } : undefined);
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
        <button type="submit">Filter</button>
      </form>
      <TaskList />
    </div>
  );
};

export default HomePage;
