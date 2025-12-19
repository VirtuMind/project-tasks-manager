export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  projectId: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: string;
}

export interface ProjectProgress {
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface ApiError {
  message: string;
  StatusCode?: number;
}
