import React, { useEffect } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import TaskCalendar from '../components/TaskCalendar';
import { Task } from '../types';

const CalendarPage: React.FC = () => {
  const { fetchTasks, tasks, updateTask } = useTaskContext();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
