import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Task } from '../types';

interface TaskContextProps {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (taskId: string, task: Omit<Task, 'id'>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  fetchTasks: (filters?: { category?: string; user?: string; status?: string }) => Promise<void>;
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

  const fetchTasks = useCallback(async (filters?: { category?: string; user?: string; status?: string }) => {
    try {
      const queryParams = filters ? new URLSearchParams(filters as any).toString() : '';
      const url = queryParams ? `${API_URL}?${queryParams}` : API_URL;
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      const tasksWithIds = data.map((task: any) => ({
        ...task,
        id: task._id,
        due_date: task.due_date ? task.due_date.split("T")[0] : "", // Extract only the date
        startTime: task.start_time || "", // Ensure empty string if undefined
        endTime: task.end_time || "", // Ensure empty string if undefined
      }));
      setTasks(tasksWithIds);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // Runs only once on mount

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error(await response.text());
      await fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (taskId: string, task: Omit<Task, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error(await response.text());
      await fetchTasks();
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
      await fetchTasks();
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
