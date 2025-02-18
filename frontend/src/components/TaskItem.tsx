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

  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Due Date: {new Date(task.dueDate).toLocaleString()}</p>
      <p>Start Time: {new Date(task.startTime).toLocaleString()}</p>
      <p>End Time: {new Date(task.endTime).toLocaleString()}</p>
      <p>Participants: {task.participants ? task.participants.join(', ') : 'None'}</p>
      <p>Recurring: {task.recurring ? 'Yes' : 'No'}</p>
      <p>Category: {task.category}</p>
      <p>Priority: {task.priority}</p>
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
