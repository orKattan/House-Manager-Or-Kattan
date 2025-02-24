
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