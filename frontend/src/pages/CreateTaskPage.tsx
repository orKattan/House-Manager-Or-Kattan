import React from 'react';
import TaskForm from '../components/TaskForm';
import Sidebar from '../components/Sidebar';
import './CreateTaskPage.css';

const CreateTaskPage: React.FC = () => {
  return (
    <div className="create-task-page">
      <div className="main-content">
        <h1>Create Task</h1>
        <TaskForm />
      </div>
    </div>
  );
};

export default CreateTaskPage;
