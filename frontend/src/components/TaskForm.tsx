import React, { useState, useContext } from 'react';
import { TaskContext } from '../contexts/TaskContext';
import { TaskStatus, TaskCategory } from '../types';
import PrioritySelect from './PrioritySelect';
import CategorySelect from './CategorySelect';

const TaskForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.Bathroom);
  const { addTask } = useContext(TaskContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      dueDate,
      priority,
      status: TaskStatus.Pending,
      category,
    };
    await addTask(newTask);  // Ensure this is awaited
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('low');
    setCategory(TaskCategory.Bathroom);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <PrioritySelect value={priority} onChange={setPriority} />
      <CategorySelect value={category} onChange={setCategory} />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
