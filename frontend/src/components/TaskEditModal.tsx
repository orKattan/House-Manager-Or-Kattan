import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskCategory, User } from '../types';
import { useTaskContext } from '../contexts/TaskContext';

interface TaskEditModalProps {
  task: Task;
  onClose: () => void;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ task, onClose }) => {
  const { updateTask } = useTaskContext();
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [category, setCategory] = useState<TaskCategory>(task.category);
  const [user, setUser] = useState(task.user || '');
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task.priority || 'low');
  const [participants, setParticipants] = useState(task.participants || []);
  const [due_date, setDueDate] = useState(task.due_date);
  const [startTime, setStartTime] = useState(task.start_time);
  const [end_time, setend_time] = useState(task.end_time);

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

  const handleSave = async () => {
    const updatedTask = {
      ...task,
      title,
      description,
      category,
      user,
      status,
      priority,
      participants,
      due_date,
      startTime,
      end_time,
    };
    await updateTask(task.id, updatedTask);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Task</h2>
        <form onSubmit={handleSave}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label>Due Date:</label>
            <input
              type="date"
              name="due_date"
              value={due_date}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label>End Time:</label>
            <input
              type="time"
              name="end_time"
              value={end_time}
              onChange={(e) => setend_time(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Participants:</label>
            <select
              name="participants"
              multiple
              value={participants}
              onChange={(e) => setParticipants(Array.from(e.target.selectedOptions, option => option.value))}
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{`${user.name} ${user.last_name}`}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Recurring:</label>
            <input
              type="checkbox"
              name="recurring"
              checked={task.recurring}
              onChange={(e) => setCategory(e.target.checked as unknown as TaskCategory)}
            />
          </div>
          <div>
            <label>Category:</label>
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              required
            >
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
            <select
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label>Status:</label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              required
            >
              <option value={TaskStatus.Pending}>Pending</option>
              <option value={TaskStatus.InProgress}>In Progress</option>
              <option value={TaskStatus.Completed}>Completed</option>
            </select>
          </div>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
