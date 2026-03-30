export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  userId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  pagination?: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CreateTodoInput {
  title: string;
  priority?: Priority;
}

export interface UpdateTodoInput {
  title?: string;
  priority?: Priority;
}

export interface TodoFilters {
  search?: string;
  priority?: Priority | '';
  completed?: boolean;
  page?: number;
  limit?: number;
}
