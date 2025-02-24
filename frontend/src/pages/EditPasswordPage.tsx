import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';
import { useUserContext } from '../contexts/UserContext';

const EditPasswordPage: React.FC = () => {
  const { updatePassword } = useUserContext();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }
    await updatePassword(oldPassword, newPassword);
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setError('');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, mt: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Change Password
          </Typography>
        </Box>
        <TextField
          label="Old Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          name="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <TextField
          label="New Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <TextField
          label="Confirm New Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          name="confirmNewPassword"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleChangePassword} fullWidth>
            Change Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditPasswordPage;
