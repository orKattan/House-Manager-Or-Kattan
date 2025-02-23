import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskContext } from '../contexts/TaskContext';
import TaskListByCategory from './TaskListByCategory';
import { Task } from '../types';
import './RoomTasks.css';

const RoomTasks: React.FC = () => {
  const { room } = useParams<{ room: string }>();
  const { fetchTasks, tasks, deleteTask, updateTask } = useTaskContext();
  const [roomTasks, setRoomTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks({ category: room });
      setRoomTasks(tasks);
    };

    loadTasks();
  }, [fetchTasks, room, tasks]);

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleEditTask = async (task: Task) => {
    await updateTask(task.id, task);
  };

  return (
    <div className="room-tasks">
      <h1>{room.charAt(0).toUpperCase() + room.slice(1)} Tasks</h1>
      <div className="task-list">
        <TaskListByCategory tasks={roomTasks} onDeleteTask={handleDeleteTask} onEditTask={handleEditTask} />
      </div>
    </div>
  );
};

export default RoomTasks;
