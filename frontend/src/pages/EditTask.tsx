import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTaskContext } from '../contexts/TaskContext';
import { Task, TaskCategory, TaskStatus } from '../types';

const EditTask: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { tasks, updateTask, fetchTasks } = useTaskContext();
  const history = useHistory();
  const task = tasks.find(task => task.id === taskId) || {
    id: '',
    title: '',
    description: '',
    due_date: '',
    start_time: '',
    end_time: '',
    participants: [],
    recurring: false,
    category: TaskCategory.EntireHome,
    priority: 'low',
    status: TaskStatus.Pending,
    user: '',
  };

  const [formData, setFormData] = useState<Task>(task);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setFormData(task);
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTask(taskId, formData);
    history.push('/tasks');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} />
      </div>
      <div>
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div>
        <label>Due Date</label>
        <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} />
      </div>
      <div>
        <label>Start Time</label>
        <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} />
      </div>
      <div>
        <label>End Time</label>
        <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} />
      </div>
      <div>
        <label>Participants</label>
        <input type="text" name="participants" value={formData.participants.join(', ')} onChange={handleChange} />
      </div>
      <div>
        <label>Category</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value={TaskCategory.EntireHome}>Entire Home</option>
          <option value={TaskCategory.Kitchen}>Kitchen</option>
          <option value={TaskCategory.Bathroom}>Bathroom</option>
          <option value={TaskCategory.LivingRoom}>Living Room</option>
          <option value={TaskCategory.Bedroom}>Bedroom</option>
        </select>
      </div>
      <div>
        <label>Priority</label>
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value={TaskStatus.Pending}>Pending</option>
          <option value={TaskStatus.InProgress}>In Progress</option>
          <option value={TaskStatus.Completed}>Completed</option>
        </select>
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default EditTask;
