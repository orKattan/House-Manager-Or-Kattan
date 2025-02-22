import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface UserContextProps {
  user: User | null;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (updatedUser: User) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from local storage or API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch the current user from the backend or local storage
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:8002/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error(await response.text());
        const user = await response.json();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (username: string, password: string) => {
    // Call API to authenticate user
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.access_token);
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:8002/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const updateUserProfile = async (updatedUser: User) => {
    try {
      const response = await fetch('http://localhost:8002/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const response = await fetch('http://localhost:8002/users/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });
      if (!response.ok) throw new Error(await response.text());
      alert('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    }
  };

  return (
    <UserContext.Provider value={{ user, fetchUserProfile, updateUserProfile, updatePassword, login, logout, currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
