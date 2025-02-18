import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Due: {new Date(task.dueDate).toLocaleString()}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.status}</p>
      <p>Category: {task.category}</p>
    </div>
  );
};

export default TaskItem;
