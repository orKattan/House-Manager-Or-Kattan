import React, { useState, useEffect } from 'react';
import { Task, User } from '../types';
import { useTaskContext } from '../contexts/TaskContext';
import TaskEditModal from './TaskEditModal';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { deleteTask, updateTask } = useTaskContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [participantNames, setParticipantNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8002/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const names = task.participants.map(participantId => {
      const user = users.find(user => user.id === participantId);
      return user ? `${user.name} ${user.last_name}` : participantId;
    });
    setParticipantNames(names);
  }, [task.participants, users]);

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = () => {
    console.log("Editing task with ID:", task.id);
    setIsEditModalOpen(true);
  };

  const handleSaveTask = async (updatedTask: Task) => {
    await updateTask(updatedTask.id, updatedTask);
    setIsEditModalOpen(false);
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
      <p>Participants: {participantNames.length > 0 ? participantNames.join(', ') : 'None'}</p>
      <p>Category: {task.category}</p>
      <p>Status: {task.status}</p>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
      {isEditModalOpen && (
        <TaskEditModal task={task} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveTask} />
      )}
    </div>
  );
};

export default TaskItem;
