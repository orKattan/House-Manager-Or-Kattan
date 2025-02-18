import React, { useState } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import TaskItem from './TaskItem';
import { Task, TaskCategory } from '../types';

const TaskList: React.FC = () => {
  const { tasks, fetchTasks } = useTaskContext();
  const [category, setCategory] = useState<string>('');

  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchTasks(category ? { category } : undefined);
  };

  return (
    <div>
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
      <ul>
        {tasks.map((task: Task) => (
          <li key={task.id}>
            <TaskItem task={task} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
