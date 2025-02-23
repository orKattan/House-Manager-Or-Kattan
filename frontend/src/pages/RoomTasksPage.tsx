import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskContext } from '../contexts/TaskContext';
import TaskListByCategory from '../components/TaskListByCategory';
import Sidebar from '../components/Sidebar';
import { Task } from '../types';
import './RoomTasksPage.css';

const RoomTasksPage: React.FC = () => {
  const { room } = useParams<{ room: string }>();
  const { fetchTasks, tasks, deleteTask, updateTask } = useTaskContext();
  const [roomTasks, setRoomTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks({ category: room });
    };

    loadTasks();
  }, [fetchTasks, room]);

  useEffect(() => {
    setRoomTasks(tasks.filter(task => task.category === room));
  }, [tasks, room]);

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleEditTask = async (task: Task) => {
    await updateTask(task.id, task);
  };

  return (
    <div className="room-tasks-page">
      <div className="main-content">
        <h1>{room.charAt(0).toUpperCase() + room.slice(1)} Tasks</h1>
        <div className="task-list">
          <TaskListByCategory tasks={roomTasks} onDeleteTask={handleDeleteTask} onEditTask={handleEditTask} />
        </div>
      </div>
    </div>
  );
};

export default RoomTasksPage;
