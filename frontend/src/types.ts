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
  due_date: string;
  start_time: string;
  end_time: string;
  participants: string[];
  category: TaskCategory;
  status: TaskStatus;
  user: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  last_name: string;
  email: string;
}
