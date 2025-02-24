export enum TaskStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed',
}

export enum TaskCategory {
  bathroom = 'bathroom',
  kitchen = 'kitchen',
  bedroom = 'bedroom',
  livingRoom = 'livingRoom',
  garden = 'garden',
  laundry = 'laundry',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string; // Ensure this is a string in ISO format
  startTime: string; // Ensure this is a string in ISO format
  endTime: string; // Ensure this is a string in ISO format
  participants: string[];
  status: TaskStatus;
  category: TaskCategory;
}
