import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTaskContext } from '../contexts/TaskContext';
import { useUserContext } from '../contexts/UserContext';
import { Task } from '../types';
import TaskEditModal from './TaskEditModal';

const localizer = momentLocalizer(moment);

interface TaskCalendarProps {
  tasks: Task[];
  onEditTask: (task: Task) => Promise<void>;
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, onEditTask }) => {
  const { fetchTasks } = useTaskContext();
  const { users, fetchUsers } = useUserContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [fetchTasks, fetchUsers]);

  const handleSelectEvent = (task: Task) => {
    setSelectedTask(task);
    console.log('Selected Task:', task); // Log the selected task
    setIsModalOpen(true);
  };

  const handleSaveTask = async (updatedTask: Task) => {
    await onEditTask(updatedTask);
    setIsModalOpen(false);
    setSelectedTask(null);
    fetchTasks();
  };


  const events = tasks.map(task => {
    const start = moment(`${task.due_date}T${task.start_time}`).toDate();
    const end = moment(`${task.due_date}T${task.end_time}`).toDate();
    return {
      id: task.id,
      title: task.title,
      due_date: task.due_date,
      start_time: task.start_time,
      end_time: task.end_time,
      description: task.description,
      participants: task.participants,
      status: task.status,
      category: task.category,
      start,
      end,
    };
  });

  // Log the events array
  console.log('Events:', events);

  const eventPropGetter = (event: any) => {
    const backgroundColor = event.color;
    return { style: { backgroundColor } };
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent}
      />
      {selectedTask && (
        <TaskEditModal
          open={isModalOpen}
          task={selectedTask}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
          users={users} // Pass the users prop to TaskEditModal
        />
      )}
    </div>
  );
};

export default TaskCalendar;
