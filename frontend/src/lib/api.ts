import {
  Project,
  Task,
  AuthState,
  ApiResponse,
  ProjectDetails,
  NewTask,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

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
    const error: ApiResponse = await response.json().catch(() => ({
      message: "An unexpected error occurred",
      status: response.status,
    }));
    throw error;
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthState> => {
    return fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
};

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    return fetchApi("/projects");
  },

  getById: async (id: string): Promise<ProjectDetails> => {
    return fetchApi(`/projects/${id}`);
  },

  create: async (data: {
    title: string;
    description?: string;
  }): Promise<Project> => {
    return fetchApi("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    return fetchApi(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchApi(`/projects/${id}`, { method: "DELETE" });
  },
};

// Tasks API
export const tasksApi = {
  create: async (projectId: string, data: NewTask): Promise<Task> => {
    return fetchApi(`/tasks/${projectId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    projectId: string,
    taskId: string,
    data: Partial<Task>
  ): Promise<Task> => {
    return fetchApi(`/tasks/${projectId}/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  toggleComplete: async (projectId: string, taskId: string): Promise<Task> => {
    return fetchApi(`/tasks/${projectId}/${taskId}/toggle`, {
      method: "PATCH",
    });
  },

  delete: async (projectId: string, taskId: string): Promise<void> => {
    return fetchApi(`/tasks/${projectId}/${taskId}`, { method: "DELETE" });
  },
};
