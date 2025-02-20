import React, { createContext, useState, useContext, useEffect } from 'react';
import { TaskStatus, TaskCategory, Task } from '../types';

interface TaskContextProps {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (taskId: string, task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  fetchTasks: (filters?: { category?: string; user?: string; status?: string; priority?: string }) => Promise<void>;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const API_URL = 'http://localhost:8002/tasks'; // Ensure the correct endpoint

  const getAuthHeaders = (): HeadersInit => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchTasks = async (filters?: { category?: string; user?: string; status?: string; priority?: string }) => {
    try {
      const queryParams = filters ? new URLSearchParams(filters as any).toString() : '';
      const url = queryParams ? `${API_URL}?${queryParams}` : API_URL;
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      const tasksWithIds = data.map((task: any) => ({ ...task, id: task._id }));
      setTasks(tasksWithIds);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    async function getTasks() {
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        if (JSON.stringify(data) !== JSON.stringify(tasks)) {
          setTasks(data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
    getTasks();
  }, []); // Runs only once on mount

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error(await response.text());
      const newTask = await response.json();
      setTasks(prevTasks => [...prevTasks, { ...task, id: newTask.task_id }]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (taskId: string, task: Task) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error(await response.text());
      const updatedTask = await response.json();
      setTasks(prevTasks => prevTasks.map(t => (t.id === taskId ? updatedTask : t)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error(await response.text());
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
