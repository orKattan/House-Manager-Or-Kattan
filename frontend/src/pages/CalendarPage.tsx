import React from 'react';
import TaskCalendar from '../components/TaskCalendar';
import { useTaskContext } from '../contexts/TaskContext';
import { Task } from '../types'; // Import the Task type

const CalendarPage: React.FC = () => {
  const { tasks, updateTask } = useTaskContext();

  const handleEditTask = async (task: Task) => {
    await updateTask(task.id, task);
  };

  return (
    <div>
      <h1>Calendar</h1>
      <TaskCalendar tasks={tasks} onEditTask={handleEditTask} />
    </div>
  );
};

export default CalendarPage;
