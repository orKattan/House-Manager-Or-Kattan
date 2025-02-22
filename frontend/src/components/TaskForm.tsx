import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskCategory, User } from '../types';
import { useTaskContext } from '../contexts/TaskContext';
import { useUserContext } from '../contexts/UserContext';

const TaskForm: React.FC = () => {
  const { addTask } = useTaskContext();
  const { currentUser } = useUserContext();
  const [users, setUsers] = useState<User[]>([]);
  const defaultdue_date = new Date().toISOString().split('T')[0];
  const defaultstart_time = new Date().toISOString().split('T')[1].slice(0, 5);
  const defaultend_time = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().split('T')[1].slice(0, 5);
  const [task, setTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    due_date: defaultdue_date,
    start_time: defaultstart_time,
    end_time: defaultend_time,
    participants: [],
    recurring: false,
    category: TaskCategory.Bathroom,
    priority: 'low',
    status: TaskStatus.Pending,
    user: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setTask(prevTask => ({
        ...prevTask,
        user: `${currentUser.name} ${currentUser.last_name}`,
      }));
    }
  }, [currentUser]);

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
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "participants" && e.target instanceof HTMLSelectElement) {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setTask(prevTask => ({ ...prevTask, participants: selectedOptions }));
    } else {
        setTask(prevTask => ({ ...prevTask, [name]: value }));
    }
  };

  const validateTask = (task: Omit<Task, 'id'>): boolean => {
    if (!task.title || !task.due_date || !task.start_time || !task.end_time || !task.category || !task.priority || !task.status || !task.user) {
      setError('Please fill in all required fields.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateTask(task)) {
      try {
        await addTask(task);
        console.log("Task added successfully");
        setTask({
          title: '',
          description: '',
          due_date: defaultdue_date,
          start_time: defaultstart_time,
          end_time: defaultend_time,
          participants: [],
          recurring: false,
          category: TaskCategory.Bathroom,
          priority: 'low',
          status: TaskStatus.Pending,
          user: `${currentUser?.name} ${currentUser?.last_name}`,
        });
      } catch (error) {
        console.error('Failed to add task:', error);
        setError('Failed to add task');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}
      <div>
        <label>Title:</label>
        <input type="text" name="title" value={task.title} onChange={handleChange} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={task.description} onChange={handleChange} />
      </div>
      <div>
        <label>Due Date:</label>
        <input type="date" name="due_date" value={task.due_date} onChange={handleChange} required />
      </div>
      <div>
        <label>Start Time:</label>
        <input type="time" name="start_time" value={task.start_time} onChange={handleChange} required />
      </div>
      <div>
        <label>End Time:</label>
        <input type="time" name="end_time" value={task.end_time} onChange={handleChange} required />
      </div>
      <div>
        <label>Participants:</label>
        <select name="participants" multiple value={task.participants} onChange={handleChange}>
          {users.map(user => (
            <option key={user.id} value={user.id}>{`${user.name} ${user.last_name}`}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Recurring:</label>
        <input type="checkbox" name="recurring" checked={task.recurring} onChange={e => setTask(prevTask => ({ ...prevTask, recurring: e.target.checked }))} />
      </div>
      <div>
        <label>Category:</label>
        <select name="category" value={task.category} onChange={handleChange} required>
          <option value={TaskCategory.Bathroom}>Bathroom</option>
          <option value={TaskCategory.Bedroom}>Bedroom</option>
          <option value={TaskCategory.Garden}>Garden</option>
          <option value={TaskCategory.Kitchen}>Kitchen</option>
          <option value={TaskCategory.Laundry}>Laundry</option>
          <option value={TaskCategory.LivingRoom}>Living Room</option>
        </select>
      </div>
      <div>
        <label>Priority:</label>
        <select name="priority" value={task.priority} onChange={handleChange} required>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label>Status:</label>
        <select name="status" value={task.status} onChange={handleChange} required>
          <option value={TaskStatus.Pending}>Pending</option>
          <option value={TaskStatus.InProgress}>In Progress</option>
          <option value={TaskStatus.Completed}>Completed</option>
        </select>
      </div>
      <div>
        <label>User:</label>
        <input type="text" name="user" value={task.user} onChange={handleChange} required />
      </div>
      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;
