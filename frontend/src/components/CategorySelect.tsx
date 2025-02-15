import React from 'react';
import { TaskCategory } from '../types';

interface CategorySelectProps {
  value: TaskCategory;
  onChange: (newValue: TaskCategory) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as TaskCategory);
  };

  return (
    <div>
      <label htmlFor="category">Select Category:</label>
      <select id="category" value={value} onChange={handleChange}>
        {Object.values(TaskCategory).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;
