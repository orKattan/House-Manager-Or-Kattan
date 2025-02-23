import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import TaskFilter from '../components/TaskFilter';
import TaskListByCategory from '../components/TaskListByCategory';
import Sidebar from '../components/Sidebar';
import { Task } from '../types';
import './FilterTasksPage.css';

const FilterTasksPage: React.FC = () => {
  const { fetchTasks, tasks, deleteTask, updateTask } = useTaskContext();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();
      setFilteredTasks(tasks);
    };

    loadTasks();
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
    <div className="filter-tasks-page">
      <div className="main-content">
        <h1>Filter Tasks</h1>
        <div className="task-filter">
          <TaskFilter onFilterChange={handleFilterChange} />
        </div>
        <div className="task-list">
          <TaskListByCategory tasks={filteredTasks} onDeleteTask={handleDeleteTask} onEditTask={handleEditTask} />
        </div>
      </div>
    </div>
  );
};

export default FilterTasksPage;
