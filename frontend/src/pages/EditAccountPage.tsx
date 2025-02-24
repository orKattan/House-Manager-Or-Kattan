import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useUserContext } from '../contexts/UserContext';
import { User } from '../types';

const EditAccountPage: React.FC = () => {
  const { currentUser, updateUserProfile } = useUserContext();
  const [user, setUser] = useState<User | null>(currentUser);

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (user) {
      setUser({ ...user, [name]: value });
    }
  };

  const handleSaveProfile = async () => {
    if (user) {
      await updateUserProfile(user);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, mt: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Edit Account
          </Typography>
        </Box>
        {user && (
          <>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleSaveProfile} fullWidth>
                Save Profile
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default EditAccountPage;
