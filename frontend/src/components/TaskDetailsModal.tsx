import React from 'react';
import { Task } from '../types';

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <p>Start Time: {task.start_time}</p>
        <p>End Time: {task.end_time}</p>
        <p>Due Date: {task.due_date}</p>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
