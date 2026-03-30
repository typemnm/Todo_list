import type { Todo, CreateTodoInput, ApiResponse } from '../types/todo';

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }
  return data.data;
}

export async function getTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_URL}/todos`);
  return handleResponse<Todo[]>(response);
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  return handleResponse<Todo>(response);
}

export async function toggleTodo(id: string): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PATCH',
  });
  return handleResponse<Todo>(response);
}

export async function deleteTodo(id: string): Promise<null> {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<null>(response);
}
