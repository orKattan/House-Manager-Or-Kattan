import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome</h1>
      <p>
        <Link to="/register">Register</Link>
      </p>
      <p>
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default WelcomePage;
