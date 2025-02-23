import React, { useState, useEffect, useRef } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import TaskForm from '../components/TaskForm';
import TaskListByCategory from '../components/TaskListByCategory';
import TaskFilter from '../components/TaskFilter';
import { Task } from '../types';

const HomePage: React.FC = () => {
  const { fetchTasks, tasks, deleteTask, updateTask } = useTaskContext();
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

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleEditTask = async (task: Task) => {
    await updateTask(task.id, task);
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm />
      <TaskFilter onFilterChange={handleFilterChange} />
      <TaskListByCategory tasks={filteredTasks} onDeleteTask={handleDeleteTask} onEditTask={handleEditTask} />
    </div>
  );
};

export default HomePage;
