import React, { createContext, useState } from 'react';
import { TaskStatus, TaskCategory } from '../types';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: TaskStatus;
  category: TaskCategory;
}

interface TaskContextProps {
  tasks: Task[];
  addTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const TaskContext = createContext<TaskContextProps>({
  tasks: [],
  addTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
});

export const TaskProvider: React.FC = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = async (task: Task) => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    console.log('Token:', token); // Debugging: Check if token is retrieved

    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    try {
      const response = await fetch('http://localhost:8002/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create task: ${errorText}`);
      }

      const result = await response.json();
      console.log('Task created successfully:', result);
      setTasks([...tasks, task]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    console.log('Token:', token); // Debugging: Check if token is retrieved

    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8002/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update task: ${errorText}`);
      }

      const result = await response.json();
      console.log('Task updated successfully:', result);
      setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    console.log('Token:', token); // Debugging: Check if token is retrieved

    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8002/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete task: ${errorText}`);
      }

      const result = await response.json();
      console.log('Task deleted successfully:', result);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};
