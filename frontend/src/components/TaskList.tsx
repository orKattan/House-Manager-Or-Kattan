import React, { useContext } from 'react';
import { TaskContext } from '../contexts/TaskContext';
import TaskItem from './TaskItem';

const TaskList: React.FC = () => {
  const { tasks } = useContext(TaskContext);

  return (
    <div>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
