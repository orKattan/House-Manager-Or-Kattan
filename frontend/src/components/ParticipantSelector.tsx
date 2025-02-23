import React, { useState } from 'react';
import { User } from '../types';
import { TextField, Box, Chip, MenuItem } from '@mui/material';

interface ParticipantSelectorProps {
  users: User[];
  selectedParticipants: User[];
  setSelectedParticipants: (selectedParticipants: User[]) => void;
}

const ParticipantSelector: React.FC<ParticipantSelectorProps> = ({ users, selectedParticipants, setSelectedParticipants }) => {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(
    user =>
      (user.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
      (user.last_name && user.last_name.toLowerCase().includes(search.toLowerCase()))
  );

  const addParticipant = (user: User) => {
    if (!selectedParticipants.some(participant => participant.id === user.id)) {
      setSelectedParticipants([...selectedParticipants, user]);
    }
    setSearch(''); // Clear search input after selection
  };

  const removeParticipant = (userId: string) => {
    setSelectedParticipants(selectedParticipants.filter(user => user.id !== userId));
  };

  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        label="Search users"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {selectedParticipants.map(user => (
          <Chip
            key={user.id}
            label={`${user.name} ${user.last_name}`}
            onDelete={() => removeParticipant(user.id)}
          />
        ))}
      </Box>
      {search && (
        <Box sx={{ mt: 1, maxHeight: 200, overflowY: 'auto' }}>
          {filteredUsers.map(user => (
            <MenuItem key={user.id} onClick={() => addParticipant(user)}>
              {user.name} {user.last_name}
            </MenuItem>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ParticipantSelector;
