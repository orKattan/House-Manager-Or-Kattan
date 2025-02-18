import React, { useState } from 'react';
import { Task, TaskStatus, TaskCategory } from '../types'; // Import Task type
import { useTaskContext } from '../contexts/TaskContext';

const TaskForm: React.FC = () => {
  const { addTask } = useTaskContext();
  const [task, setTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    dueDate: '',
    startTime: '',
    endTime: '',
    participants: [],
    recurring: false,
    category: TaskCategory.Bathroom,
    priority: 'low',
    status: TaskStatus.Pending,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'participants') {
      setTask(prevTask => ({ ...prevTask, participants: value.split(',').map(participant => participant.trim()) }));
    } else {
      setTask(prevTask => ({ ...prevTask, [name]: value }));
    }
  };

  const validateTask = (task: Omit<Task, 'id'>): boolean => {
    if (!task.title || !task.dueDate || !task.startTime || !task.endTime || !task.category || !task.priority || !task.status) {
      alert('Please fill in all required fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting task:", task);
    if (validateTask(task)) {
      await addTask(task);
      setTask({
        title: '',
        description: '',
        dueDate: '',
        startTime: '',
        endTime: '',
        participants: [],
        recurring: false,
        category: TaskCategory.Bathroom,
        priority: 'low',
        status: TaskStatus.Pending,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <input type="datetime-local" name="dueDate" value={task.dueDate} onChange={handleChange} required />
      </div>
      <div>
        <label>Start Time:</label>
        <input type="datetime-local" name="startTime" value={task.startTime} onChange={handleChange} required />
      </div>
      <div>
        <label>End Time:</label>
        <input type="datetime-local" name="endTime" value={task.endTime} onChange={handleChange} required />
      </div>
      <div>
        <label>Participants:</label>
        <input type="text" name="participants" value={task.participants.join(', ')} onChange={handleChange} />
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
      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;
