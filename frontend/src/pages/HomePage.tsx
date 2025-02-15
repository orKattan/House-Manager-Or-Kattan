import React from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <TaskForm />
      <TaskList />
    </div>
  );
};

export default HomePage;
