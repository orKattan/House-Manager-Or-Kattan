import React, { useState } from 'react';
import { Task } from '../types';
import TaskEditModal from './TaskEditModal';

interface TaskListByCategoryProps {
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

const categoryColors: Record<string, string> = {
  work: 'lightblue',
  personal: 'lightgreen',
  other: 'lightcoral',
};

const TaskListByCategory: React.FC<TaskListByCategoryProps> = ({ tasks, onDeleteTask, onEditTask }) => {
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const tasksByCategory = tasks.reduce((acc, task) => {
    const category = task.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const handleMouseEnter = (taskId: string) => {
    setHoveredTaskId(taskId);
  };

  const handleMouseLeave = () => {
    setHoveredTaskId(null);
  };

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleDeleteClick = (taskId: string) => {
    onDeleteTask(taskId);
  };

  const handleSaveTask = (task: Task) => {
    onEditTask(task);
    setSelectedTask(null);
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {Object.entries(tasksByCategory).map(([category, tasks]) => (
        <div key={category} style={{ backgroundColor: categoryColors[category], padding: '10px', borderRadius: '5px' }}>
          <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
          <ul>
            {tasks.map(task => (
              <li
                key={task.id}
                onMouseEnter={() => handleMouseEnter(task.id)}
                onMouseLeave={handleMouseLeave}
                style={{ position: 'relative' }}
              >
                <strong>{task.title}</strong> - {task.status}
                {hoveredTaskId === task.id && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <p>{task.description}</p>
                    <p>Start Time: {task.start_time}</p>
                    <p>End Time: {task.end_time}</p>
                    <p>Due Date: {task.due_date}</p>
                    <button onClick={() => handleEditClick(task)}>Edit</button>
                    <button onClick={() => handleDeleteClick(task.id)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {selectedTask && (
        <TaskEditModal task={selectedTask} onClose={() => setSelectedTask(null)} onSave={handleSaveTask} />
      )}
    </div>
  );
};

export default TaskListByCategory;
