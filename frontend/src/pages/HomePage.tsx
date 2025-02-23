import React, { useState, useEffect, useRef } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskFilter from '../components/TaskFilter';
import { Task } from '../types';

const HomePage: React.FC = () => {
  const { fetchTasks, tasks } = useTaskContext();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const initialLoad = useRef(true);

  useEffect(() => {
    if (initialLoad.current) {
      const loadTasks = async () => {
        await fetchTasks();
        setFilteredTasks(tasks);
      };

      loadTasks();
      initialLoad.current = false;
    }
  }, [fetchTasks]);

  const handleFilterChange = async (filters: { category?: string; user?: string; status?: string }) => {
    await fetchTasks(filters);
  };

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm />
      <TaskFilter onFilterChange={handleFilterChange} />
      <TaskList tasks={filteredTasks} />
    </div>
  );
};

export default HomePage;
