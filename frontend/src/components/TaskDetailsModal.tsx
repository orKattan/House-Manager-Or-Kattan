import React, { useState } from 'react';
import { Task } from '../types';

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose, onSave }) => {
  const [editedTask, setEditedTask] = useState<Task>(task);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Edit Task</h2>
        <label>
          Title:
          <input type="text" name="title" value={editedTask.title} onChange={handleChange} />
        </label>
        <label>
          Status:
          <select name="status" value={editedTask.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label>
          Description:
          <textarea name="description" value={editedTask.description} onChange={handleChange} />
        </label>
        <label>
          Start Time:
          <input type="time" name="start_time" value={editedTask.start_time} onChange={handleChange} />
        </label>
        <label>
          End Time:
          <input type="time" name="end_time" value={editedTask.end_time} onChange={handleChange} />
        </label>
        <label>
          Due Date:
          <input type="date" name="due_date" value={editedTask.due_date} onChange={handleChange} />
        </label>
        <div className="modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
