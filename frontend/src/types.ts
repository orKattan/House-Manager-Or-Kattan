export enum TaskCategory {
  Bathroom = 'Bathroom',
  Bedroom = 'Bedroom',
  EntireHome = 'EntireHome',
  Garden = 'Garden',
  Kitchen = 'Kitchen',
  Laundry = 'Laundry',
  LivingRoom = 'LivingRoom',
}

export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  startTime: string;
  endTime: string;
  participants: string[];
  recurring: boolean;
  category: TaskCategory;
  priority: 'low' | 'medium' | 'high';
  status: TaskStatus;
}
