import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/create-task">Create Task</Link></li>
        <li><Link to="/filter-tasks">Filter Tasks</Link></li>
      </ul>
      <h2>Rooms</h2>
      <ul>
        <li><Link to="/tasks/bathroom">Bathroom Tasks</Link></li>
        <li><Link to="/tasks/bedroom">Bedroom Tasks</Link></li>
        <li><Link to="/tasks/garden">Garden Tasks</Link></li>
        <li><Link to="/tasks/kitchen">Kitchen Tasks</Link></li>
        <li><Link to="/tasks/laundry">Laundry Tasks</Link></li>
        <li><Link to="/tasks/livingRoom">Living Room Tasks</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
