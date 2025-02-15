import React from 'react';

interface PrioritySelectProps {
  value: 'low' | 'medium' | 'high';
  onChange: (newValue: 'low' | 'medium' | 'high') => void;
}

const PrioritySelect: React.FC<PrioritySelectProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (['low', 'medium', 'high'].includes(e.target.value)) {
      onChange(e.target.value as 'low' | 'medium' | 'high');
    }
  };

  return (
    <div>
      <label htmlFor="priority">Select Priority:</label>
      <select id="priority" value={value} onChange={handleChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
};

export default PrioritySelect;
