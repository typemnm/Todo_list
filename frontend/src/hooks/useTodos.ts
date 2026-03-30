import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodos, createTodo, toggleTodo, updateTodo, deleteTodo } from '../services/api';
import type { Todo, Priority, CreateTodoInput, UpdateTodoInput, TodoFilters } from '../types/todo';

interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface UseTodosReturn {
  todos: Todo[];
  pagination: PaginationResult;
  isLoading: boolean;
  error: Error | null;
  createTodo: (title: string, priority: Priority) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, input: UpdateTodoInput) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  isCreating: boolean;
  isToggling: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

type QueryData = { todos: Todo[]; pagination: PaginationResult };
const DEFAULT_PAGINATION: PaginationResult = { total: 0, page: 1, limit: 20, pages: 0 };

export function useTodos(filters?: TodoFilters): UseTodosReturn {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<QueryData, Error>({
    queryKey: ['todos', filters],
    queryFn: () => getTodos(filters),
  });

  const todos = data?.todos ?? [];
  const pagination = data?.pagination ?? DEFAULT_PAGINATION;

  const createMutation = useMutation<Todo, Error, CreateTodoInput, { prev: QueryData | undefined }>({
    mutationFn: createTodo,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const prev = queryClient.getQueryData<QueryData>(['todos', filters]);
      const optimistic: Todo = {
        _id: `temp-${Date.now()}`,
        title: newTodo.title,
        completed: false,
        priority: newTodo.priority || 'medium',
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<QueryData>(['todos', filters], (old) =>
        old ? { ...old, todos: [...old.todos, optimistic] } : old
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['todos', filters], ctx.prev);
    },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ['todos'] }); },
  });

  const toggleMutation = useMutation<Todo, Error, string, { prev: QueryData | undefined }>({
    mutationFn: toggleTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const prev = queryClient.getQueryData<QueryData>(['todos', filters]);
      queryClient.setQueryData<QueryData>(['todos', filters], (old) =>
        old ? { ...old, todos: old.todos.map(t => t._id === id ? { ...t, completed: !t.completed } : t) } : old
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['todos', filters], ctx.prev);
    },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ['todos'] }); },
  });

  const updateMutation = useMutation<
    Todo, Error, { id: string; input: UpdateTodoInput }, { prev: QueryData | undefined }
  >({
    mutationFn: ({ id, input }) => updateTodo(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const prev = queryClient.getQueryData<QueryData>(['todos', filters]);
      queryClient.setQueryData<QueryData>(['todos', filters], (old) =>
        old ? { ...old, todos: old.todos.map(t => t._id === id ? { ...t, ...input } : t) } : old
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['todos', filters], ctx.prev);
    },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ['todos'] }); },
  });

  const deleteMutation = useMutation<null, Error, string, { prev: QueryData | undefined }>({
    mutationFn: deleteTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const prev = queryClient.getQueryData<QueryData>(['todos', filters]);
      queryClient.setQueryData<QueryData>(['todos', filters], (old) =>
        old ? { ...old, todos: old.todos.filter(t => t._id !== id) } : old
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['todos', filters], ctx.prev);
    },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ['todos'] }); },
  });

  return {
    todos,
    pagination,
    isLoading,
    error,
    createTodo: (title, priority) => createMutation.mutateAsync({ title, priority }),
    toggleTodo: (id) => toggleMutation.mutateAsync(id),
    updateTodo: (id, input) => updateMutation.mutateAsync({ id, input }),
    deleteTodo: (id) => deleteMutation.mutateAsync(id),
    isCreating: createMutation.isPending,
    isToggling: toggleMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
