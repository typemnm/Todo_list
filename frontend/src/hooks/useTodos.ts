import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodos, createTodo, toggleTodo, deleteTodo } from '../services/api';
import type { Todo, Priority, CreateTodoInput } from '../types/todo';

interface UseTodosReturn {
  todos: Todo[];
  isLoading: boolean;
  error: Error | null;
  createTodo: (title: string, priority: Priority) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  isCreating: boolean;
  isToggling: boolean;
  isDeleting: boolean;
}

export function useTodos(): UseTodosReturn {
  const queryClient = useQueryClient();

  const {
    data: todos = [],
    isLoading,
    error,
  } = useQuery<Todo[], Error>({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  const createMutation = useMutation<
    Todo,
    Error,
    CreateTodoInput,
    { previousTodos: Todo[] | undefined }
  >({
    mutationFn: createTodo,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      const optimisticTodo: Todo = {
        _id: `temp-${Date.now()}`,
        title: newTodo.title,
        completed: false,
        priority: newTodo.priority || 'medium',
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Todo[]>(['todos'], (old) => [
        ...(old || []),
        optimisticTodo,
      ]);

      return { previousTodos };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const toggleMutation = useMutation<
    Todo,
    Error,
    string,
    { previousTodos: Todo[] | undefined }
  >({
    mutationFn: toggleTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.map((todo) =>
          todo._id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );

      return { previousTodos };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteMutation = useMutation<
    null,
    Error,
    string,
    { previousTodos: Todo[] | undefined }
  >({
    mutationFn: deleteTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.filter((todo) => todo._id !== id)
      );

      return { previousTodos };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return {
    todos,
    isLoading,
    error,
    createTodo: async (title: string, priority: Priority) => {
      await createMutation.mutateAsync({ title, priority });
    },
    toggleTodo: async (id: string) => {
      await toggleMutation.mutateAsync(id);
    },
    deleteTodo: async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    isCreating: createMutation.isPending,
    isToggling: toggleMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
