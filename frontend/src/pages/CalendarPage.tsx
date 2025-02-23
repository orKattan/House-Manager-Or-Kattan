import React, { useEffect } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import TaskCalendar from '../components/TaskCalendar';

const CalendarPage: React.FC = () => {
  const { fetchTasks, tasks } = useTaskContext();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div>
      <h1>Calendar</h1>
      <TaskCalendar tasks={tasks} />
    </div>
  );
};

export default CalendarPage;
