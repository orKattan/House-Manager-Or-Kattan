import React from 'react';
import TaskFilter from '../components/TaskFilter';
import { useTaskContext } from '../contexts/TaskContext';

const FilterTasksPage: React.FC = () => {
  const { fetchTasks } = useTaskContext();

  return <TaskFilter onFilterChange={fetchTasks} />;
};

export default FilterTasksPage;