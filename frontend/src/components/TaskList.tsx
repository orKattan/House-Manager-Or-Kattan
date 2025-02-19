import React from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import TaskItem from './TaskItem';
import { Task } from '../types';

const TaskList: React.FC = () => {
  const { tasks } = useTaskContext();
  console.log('Rendering TaskList with tasks:', tasks);

  return (
    <ul>
      {tasks.map((task: Task) => (
        <li key={task.id}>
          <TaskItem task={task} />
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
