import React, { useState } from 'react';
import { Task, TaskStatus, TaskCategory } from '../types';
import { useTaskContext } from '../contexts/TaskContext';

interface TaskEditModalProps {
  task: Task;
  onClose: () => void;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ task, onClose }) => {
  const { updateTask } = useTaskContext();
  const [editedTask, setEditedTask] = useState<Task>(task);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'participants') {
      setEditedTask(prevTask => ({ ...prevTask, participants: value.split(',').map(participant => participant.trim()) }));
    } else {
      setEditedTask(prevTask => ({ ...prevTask, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating task with ID:", editedTask.id);
    await updateTask(editedTask.id, editedTask);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input type="text" name="title" value={editedTask.title} onChange={handleChange} required />
          </div>
          <div>
            <label>Description:</label>
            <textarea name="description" value={editedTask.description} onChange={handleChange} />
          </div>
          <div>
            <label>Due Date:</label>
            <input type="datetime-local" name="dueDate" value={editedTask.dueDate} onChange={handleChange} required />
          </div>
          <div>
            <label>Start Time:</label>
            <input type="datetime-local" name="startTime" value={editedTask.startTime} onChange={handleChange} required />
          </div>
          <div>
            <label>End Time:</label>
            <input type="datetime-local" name="endTime" value={editedTask.endTime} onChange={handleChange} required />
          </div>
          <div>
            <label>Participants:</label>
            <input type="text" name="participants" value={editedTask.participants.join(', ')} onChange={handleChange} />
          </div>
          <div>
            <label>Recurring:</label>
            <input type="checkbox" name="recurring" checked={editedTask.recurring} onChange={e => setEditedTask(prevTask => ({ ...prevTask, recurring: e.target.checked }))} />
          </div>
          <div>
            <label>Category:</label>
            <select name="category" value={editedTask.category} onChange={handleChange} required>
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
            <select name="priority" value={editedTask.priority} onChange={handleChange} required>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label>Status:</label>
            <select name="status" value={editedTask.status} onChange={handleChange} required>
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
