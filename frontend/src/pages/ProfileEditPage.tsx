import React, { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { User } from '../types';
import '../App.css';

const ProfileEditPage: React.FC = () => {
  const { user, updateUserProfile, updatePassword } = useUserContext();
  const [formData, setFormData] = useState<User>({
    id: '',
    username: '',
    name: '',
    last_name: '',
    email: '',
  });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'oldPassword') {
      setOldPassword(value);
    } else {
      setNewPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePassword(oldPassword, newPassword);
      setOldPassword('');
      setNewPassword('');
      alert('Password updated successfully');
    } catch (error) {
      console.error('Failed to update password:', error);
      alert('Failed to update password');
    }
  };

  return (
    <div className="profile-edit-page">
      <div className="form-container">
        <h1 className="form-header">Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>First Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <button type="submit">Update Profile</button>
        </form>
        <h2 className="form-header">Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label>Old Password:</label>
            <input type="password" name="oldPassword" value={oldPassword} onChange={handlePasswordChange} required />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input type="password" name="newPassword" value={newPassword} onChange={handlePasswordChange} required />
          </div>
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
