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
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
}

export type TaskStatus = "all" | "pending" | "completed";

export interface NewTask {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  stats: ProjectProgress;
}

export interface ProjectProgress {
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

export interface ProjectDetails extends Project {
  tasks: Task[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface ApiResponse {
  message: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}
