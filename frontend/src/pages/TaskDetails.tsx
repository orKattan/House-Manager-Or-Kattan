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
  }, []);

  if (!task) {
    return <div>Loading...</div>;
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Due Date: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</p>
      <p>Start Time: {task.start_time ? formatTime(task.start_time) : 'N/A'}</p>
      <p>End Time: {task.end_time ? formatTime(task.end_time) : 'N/A'}</p>
      <p>Participants: {task.participants && task.participants.length > 0 ? task.participants.join(', ') : 'None'}</p>
      <p>Category: {task.category}</p>
      <p>Status: {task.status}</p>
    </div>
  );
};

export default TaskDetails;
