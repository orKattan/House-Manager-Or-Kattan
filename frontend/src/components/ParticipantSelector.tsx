import React, { useState } from 'react';
import { User } from '../types';

interface ParticipantSelectorProps {
  users: User[];
  selectedParticipants: User[];
  setSelectedParticipants: React.Dispatch<React.SetStateAction<User[]>>;
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
      setSelectedParticipants(prevParticipants => [...prevParticipants, user]);
    }
    setSearch(''); // Clear search input after selection
  };

  const removeParticipant = (userId: string) => {
    setSelectedParticipants(prevParticipants => prevParticipants.filter(user => user.id !== userId));
  };

  const handleSelect = (user: User) => {
    if (selectedParticipants.some(participant => participant.id === user.id)) {
      setSelectedParticipants(prev => prev.filter(participant => participant.id !== user.id));
    } else {
      setSelectedParticipants(prev => [...prev, user]);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 w-96">
      <div className="flex items-center gap-4 w-full">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
        {selectedParticipants.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedParticipants.map(user => (
              <button
                key={user.id}
                onClick={() => removeParticipant(user.id)}
                className="border px-2 py-1 text-sm"
              >
                {user.name} {user.last_name} ✖
              </button>
            ))}
          </div>
        )}
      </div>
      {search && (
        <div className="border rounded-md shadow-md bg-white w-full max-h-40 overflow-y-auto">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => addParticipant(user)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {user.name} {user.last_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipantSelector;
