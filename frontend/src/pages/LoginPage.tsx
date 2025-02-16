import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8001/login', { // Ensure this points to the auth-service
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to login: ${errorText}`);
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);

      // Add bearer token to headers for subsequent requests
      const token = data.access_token;
      const protectedResponse = await fetch('http://localhost:8002/tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!protectedResponse.ok) {
        const errorText = await protectedResponse.text();
        throw new Error(`Failed to fetch tasks: ${errorText}`);
      }

      const protectedData = await protectedResponse.json();

      history.push('/home'); // Redirect to dashboard or another page
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
