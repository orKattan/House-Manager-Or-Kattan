import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Task } from '../types';

const TaskDetails: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        console.log("Fetching task with ID:", taskId);
        const response = await fetch(`http://localhost:8002/tasks/${taskId}`);
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        console.log("Received Task Data:", data);
        setTask(data);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [taskId]);

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{task.title}</h2>
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
