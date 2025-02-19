import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskContext } from '../contexts/TaskContext';
import { Task } from '../types';

const TaskDetails: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { tasks, fetchTasks } = useTaskContext();
  const task = tasks.find(task => task.id === taskId);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Due Date: {new Date(task.dueDate).toLocaleString()}</p>
      <p>Start Time: {new Date(task.startTime).toLocaleString()}</p>
      <p>End Time: {new Date(task.endTime).toLocaleString()}</p>
      <p>Participants: {task.participants ? task.participants.join(', ') : 'None'}</p>
      <p>Recurring: {task.recurring ? 'Yes' : 'No'}</p>
      <p>Category: {task.category}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.status}</p>
    </div>
  );
};

export default TaskDetails;
