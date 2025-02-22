import React, { useState } from 'react';
import { Task } from '../types';
import { useTaskContext } from '../contexts/TaskContext';
import TaskEditModal from './TaskEditModal';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { deleteTask } = useTaskContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      if (task.id) {
        console.log("Deleting task with ID:", task.id);
        await deleteTask(task.id);
      } else {
        console.error('Task ID is undefined');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = () => {
    console.log("Editing task with ID:", task.id);
    setIsEditModalOpen(true);
  };

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
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Due Date: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</p>
      <p>Start Time: {task.start_time ? formatTime(task.start_time) : 'N/A'}</p>
      <p>End Time: {task.end_time ? formatTime(task.end_time) : 'N/A'}</p>
      <p>Participants: {task.participants && task.participants.length > 0 ? task.participants.join(', ') : 'None'}</p>
      <p>Category: {task.category}</p>
      <p>Status: {task.status}</p>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
      {isEditModalOpen && (
        <TaskEditModal task={task} onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
};

export default TaskItem;
