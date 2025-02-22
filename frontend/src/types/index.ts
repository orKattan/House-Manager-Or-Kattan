export enum TaskStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed',
}

export enum TaskCategory {
  Bathroom = 'Bathroom',
  Kitchen = 'Kitchen',
  LivingRoom = 'LivingRoom',
  Bedroom = 'Bedroom',
  Garden = 'Garden',
  Laundry = 'Laundry',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string; // Ensure this is a string in ISO format
  startTime: string; // Ensure this is a string in ISO format
  endTime: string; // Ensure this is a string in ISO format
  participants: string[];
  recurring: boolean;
  priority: 'low' | 'medium' | 'high';
  status: TaskStatus;
  category: TaskCategory;
}
