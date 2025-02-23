import React, { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Task } from '../types';
import TaskEditModal from './TaskEditModal';

const localizer = momentLocalizer(moment);

interface TaskCalendarProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, onEditTask }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: new Date(`${task.due_date}T${task.start_time}`),
    end: new Date(`${task.due_date}T${task.end_time}`),
    description: task.description,
  }));

  const handleSelectEvent = (event: any) => {
    const task = tasks.find(task => task.id === event.id);
    setSelectedTask(task || null);
  };

  const handleSaveTask = (task: Task) => {
    onEditTask(task);
    setSelectedTask(null);
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={[Views.MONTH, Views.WEEK]}
        defaultView={Views.MONTH}
        onSelectEvent={handleSelectEvent}
      />
      {selectedTask && (
        <TaskEditModal task={selectedTask} onClose={() => setSelectedTask(null)} onSave={handleSaveTask} />
      )}
    </div>
  );
};

export default TaskCalendar;
