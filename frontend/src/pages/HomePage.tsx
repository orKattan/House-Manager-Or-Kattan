import React, { useEffect, useState } from 'react';

interface Task {
  _id: string;
  name: string;
  description: string;
  due_date: string;
  start_time: string;
  end_time: string;
  participants: string[];
  recurring: boolean;
  category: string;
}

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:8002/tasks');
      const data = await response.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  const categories = ['Bathroom', 'Bedroom', 'Entire Home', 'Garden', 'Kitchen', 'Laundry', 'Living Room'];

  return (
    <div>
      <h1>Home Page</h1>
      <h2>Task Categories</h2>
      {categories.map((category) => (
        <div key={category}>
          <h3>{category}</h3>
          <ul>
            {tasks
              .filter((task) => task.category === category)
              .map((task) => (
                <li key={task._id}>{task.name}</li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
