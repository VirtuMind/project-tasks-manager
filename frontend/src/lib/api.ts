import { User, Project, Task, ProjectProgress, ApiError, AuthState } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5062/api';

// Helper to get auth token
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      message: 'An unexpected error occurred',
      status: response.status,
    }));
    throw error;
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthState> => {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    return fetchApi('/projects');
  },

  getById: async (id: string): Promise<Project> => {
    return fetchApi(`/projects/${id}`);
  },

  create: async (data: { title: string; description?: string }): Promise<Project> => {
    return fetchApi('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    return fetchApi(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchApi(`/projects/${id}`, { method: 'DELETE' });
  },

  getProgress: async (id: string): Promise<ProjectProgress> => {
    return fetchApi(`/projects/${id}/progress`);
  },
};

// Tasks API
export const tasksApi = {
  getByProject: async (projectId: string): Promise<Task[]> => {
    return fetchApi(`/projects/${projectId}/tasks`);
  },

  create: async (
    projectId: string,
    data: { title: string; description: string; dueDate: string }
  ): Promise<Task> => {
    return fetchApi(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (taskId: string, data: Partial<Task>): Promise<Task> => {
    return fetchApi(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  toggleComplete: async (taskId: string): Promise<Task> => {
    return fetchApi(`/tasks/${taskId}/toggle`, { method: 'PATCH' });
  },

  delete: async (taskId: string): Promise<void> => {
    return fetchApi(`/tasks/${taskId}`, { method: 'DELETE' });
  },
};
