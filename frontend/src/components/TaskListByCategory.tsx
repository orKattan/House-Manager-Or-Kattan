import React, { useState, useEffect } from 'react';
import { Task, TaskCategory, TaskStatus } from '../types';
import TaskEditModal from './TaskEditModal';
import { Box, Typography } from '@mui/material';

interface TaskListByCategoryProps {
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

const categoryColors: Record<string, string> = {
  [TaskCategory.Bathroom]: '#d81b60',
  [TaskCategory.Bedroom]: '#1e88e5',
  [TaskCategory.Garden]: '#43a047',
  [TaskCategory.Kitchen]: '#fb8c00',
  [TaskCategory.Laundry]: '#8e24aa',
  [TaskCategory.LivingRoom]: '#fdd835',
};

const TaskListByCategory: React.FC<TaskListByCategoryProps> = ({ tasks, onDeleteTask, onEditTask }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tasksByCategory = tasks.reduce((acc, task) => {
    const category = task.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    onEditTask(task);
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const getTimeLeft = (task: Task) => {
    const now = new Date();
    const startTime = new Date(`${task.due_date}T${task.start_time}`);
    const endTime = new Date(`${task.due_date}T${task.end_time}`);

    if (task.status === TaskStatus.Pending) {
      const timeLeft = startTime.getTime() - now.getTime();
      return `Starts in ${Math.ceil(timeLeft / (1000 * 60 * 60 * 24))} days`;
    } else if (task.status === TaskStatus.InProgress) {
      const timeLeft = endTime.getTime() - now.getTime();
      return `Ends in ${Math.ceil(timeLeft / (1000 * 60 * 60 * 24))} days`;
    }
    return '';
  };

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {Object.entries(tasksByCategory).map(([category, tasks]) => (
        <div key={category} style={{ backgroundColor: categoryColors[category], padding: '20px', borderRadius: '10px', flex: '1 1 calc(33.333% - 20px)' }}>
          <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
          <ul>
            {tasks.map(task => (
              <li key={task.id} style={{ marginBottom: '10px', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px', cursor: 'pointer' }} onClick={() => handleTaskClick(task)}>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2">{getTimeLeft(task)}</Typography>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {selectedTask && (
        <TaskEditModal
          open={isModalOpen}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default TaskListByCategory;
