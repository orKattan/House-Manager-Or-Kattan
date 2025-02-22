import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTaskContext } from '../contexts/TaskContext';
import { Task, TaskCategory, TaskStatus } from '../types';

const EditTask: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { tasks, updateTask, fetchTasks } = useTaskContext();
  const [task, setTask] = useState<Task>({
    id: '',
    title: '',
    description: '',
    dueDate: '',
    startTime: '',
    endTime: '',
    participants: [],
    recurring: false,
    category: TaskCategory.EntireHome,
    priority: 'low',
    status: TaskStatus.Pending,
    user: '', // Add the user property here
  });
  const history = useHistory();

  useEffect(() => {
    const fetchTask = async () => {
      await fetchTasks();
      const taskToEdit = tasks.find(t => t.id === taskId);
      if (taskToEdit) {
        setTask(taskToEdit);
      }
    };
    fetchTask();
  }, [taskId, tasks, fetchTasks]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'participants') {
      setTask(prevTask => ({ ...prevTask, participants: value.split(',').map(participant => participant.trim()) }));
    } else {
      setTask(prevTask => ({ ...prevTask, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setTask(prevTask => ({ ...prevTask, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTask(task.id, task);
    history.push('/HomePage');
  };

  return (
    <div>
      <h2>Edit Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input type="text" name="title" value={task.title} onChange={handleChange} />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={task.description} onChange={handleChange} />
        </div>
        <div>
          <label>Due Date</label>
          <input type="date" name="dueDate" value={task.dueDate} onChange={handleChange} />
        </div>
        <div>
          <label>Start Time</label>
          <input type="time" name="startTime" value={task.startTime} onChange={handleChange} />
        </div>
        <div>
          <label>End Time</label>
          <input type="time" name="endTime" value={task.endTime} onChange={handleChange} />
        </div>
        <div>
          <label>Participants</label>
          <input type="text" name="participants" value={task.participants.join(', ')} onChange={handleChange} />
        </div>
        <div>
          <label>Recurring</label>
          <input type="checkbox" name="recurring" checked={task.recurring} onChange={handleCheckboxChange} />
        </div>
        <div>
          <label>Category</label>
          <select name="category" value={task.category} onChange={handleChange}>
            {Object.values(TaskCategory).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Priority</label>
          <select name="priority" value={task.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label>Status</label>
          <select name="status" value={task.status} onChange={handleChange}>
            {Object.values(TaskStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label>User</label>
          <input type="text" name="user" value={task.user} onChange={handleChange} />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditTask;
