export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface CreateTodoInput {
  title: string;
  priority?: Priority;
}
