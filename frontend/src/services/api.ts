import type { Todo, CreateTodoInput, UpdateTodoInput, ApiResponse, TodoFilters } from '../types/todo';
import type { AuthData, LoginInput, RegisterInput } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('stellar_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();
  if (response.status === 401) {
    localStorage.removeItem('stellar_token');
    localStorage.removeItem('stellar_user');
    localStorage.removeItem('stellar_refresh_token');
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }
  return data.data;
}

// Auth
export async function loginUser(input: LoginInput): Promise<AuthData> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<AuthData>(response);
}

export async function registerUser(input: RegisterInput): Promise<AuthData> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<AuthData>(response);
}

// Todos
export interface TodosResult {
  todos: Todo[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

export async function getTodos(filters?: TodoFilters): Promise<TodosResult> {
  const params = new URLSearchParams();
  if (filters?.search) params.set('search', filters.search);
  if (filters?.priority) params.set('priority', filters.priority);
  if (filters?.completed !== undefined) params.set('completed', String(filters.completed));
  if (filters?.page) params.set('page', String(filters.page));
  if (filters?.limit) params.set('limit', String(filters.limit));

  const qs = params.toString();
  const url = `${API_URL}/todos${qs ? `?${qs}` : ''}`;
  const response = await fetch(url, { headers: getAuthHeader() });

  if (response.status === 401) {
    localStorage.removeItem('stellar_token');
    localStorage.removeItem('stellar_user');
    localStorage.removeItem('stellar_refresh_token');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  const data: ApiResponse<Todo[]> = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch todos');
  return {
    todos: data.data,
    pagination: data.pagination ?? { total: 0, page: 1, limit: 20, pages: 0 },
  };
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(input),
  });
  return handleResponse<Todo>(response);
}

export async function toggleTodo(id: string): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: getAuthHeader(),
  });
  return handleResponse<Todo>(response);
}

export async function updateTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(input),
  });
  return handleResponse<Todo>(response);
}

export async function deleteTodo(id: string): Promise<null> {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  return handleResponse<null>(response);
}

// Settings
export interface AppSettings {
  starBrightness: number;
  glowIntensity: number;
  connectionLines: boolean;
  nebulaEffects: boolean;
  animationSpeed: number;
}

export async function getSettings(): Promise<AppSettings> {
  const response = await fetch(`${API_URL}/settings`, { headers: getAuthHeader() });
  return handleResponse<AppSettings>(response);
}

export async function saveSettings(settings: AppSettings): Promise<AppSettings> {
  const response = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(settings),
  });
  return handleResponse<AppSettings>(response);
}
