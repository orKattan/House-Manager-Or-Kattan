import React from 'react';
import { TaskStatus, TaskCategory } from '../types';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    status: TaskStatus;
    category: TaskCategory;
  };
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Due: {task.dueDate}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.status}</p>
      <p>Category: {task.category}</p>
    </div>
  );
};

export default TaskItem;
