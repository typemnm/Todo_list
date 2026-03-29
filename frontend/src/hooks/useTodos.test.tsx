import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTodos } from './useTodos';
import * as api from '../services/api';
import type { Todo } from '../types/todo';

// Mock the API
vi.mock('../services/api', () => ({
  getTodos: vi.fn(),
  createTodo: vi.fn(),
  toggleTodo: vi.fn(),
  deleteTodo: vi.fn(),
}));

const mockTodos: Todo[] = [
  {
    _id: '1',
    title: 'Test Todo 1',
    completed: false,
    priority: 'high',
    createdAt: '2026-03-29T10:00:00.000Z',
  },
  {
    _id: '2',
    title: 'Test Todo 2',
    completed: true,
    priority: 'medium',
    createdAt: '2026-03-29T11:00:00.000Z',
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTodos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetching todos', () => {
    it('should fetch and return todos', async () => {
      vi.mocked(api.getTodos).mockResolvedValue(mockTodos);

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.todos).toEqual(mockTodos);
      expect(result.current.error).toBe(null);
      expect(api.getTodos).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch errors', async () => {
      const errorMessage = 'Failed to fetch todos';
      vi.mocked(api.getTodos).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toBe(errorMessage);
      expect(result.current.todos).toEqual([]);
    });
  });

  describe('creating todos', () => {
    it('should create a new todo', async () => {
      const newTodo: Todo = {
        _id: '3',
        title: 'New Todo',
        completed: false,
        priority: 'low',
        createdAt: '2026-03-29T12:00:00.000Z',
      };

      vi.mocked(api.getTodos).mockResolvedValue(mockTodos);
      vi.mocked(api.createTodo).mockResolvedValue(newTodo);

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isCreating).toBe(false);

      await result.current.createTodo('New Todo', 'low');

      await waitFor(() => {
        expect(result.current.isCreating).toBe(false);
      });

      expect(api.createTodo).toHaveBeenCalledWith(
        {
          title: 'New Todo',
          priority: 'low',
        },
        expect.any(Object)
      );
    });

    it('should handle create errors', async () => {
      const errorMessage = 'Failed to create todo';
      vi.mocked(api.getTodos).mockResolvedValue(mockTodos);
      vi.mocked(api.createTodo).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        result.current.createTodo('New Todo', 'low')
      ).rejects.toThrow(errorMessage);
    });

    it('should optimistically update cache when creating', async () => {
      const newTodo: Todo = {
        _id: '3',
        title: 'New Todo',
        completed: false,
        priority: 'low',
        createdAt: '2026-03-29T12:00:00.000Z',
      };

      vi.mocked(api.getTodos).mockResolvedValue(mockTodos);
      vi.mocked(api.createTodo).mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(newTodo), 100);
        });
      });

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialLength = result.current.todos.length;
      result.current.createTodo('New Todo', 'low');

      // Should optimistically add to cache
      await waitFor(() => {
        expect(result.current.todos.length).toBeGreaterThan(initialLength);
      });
    });
  });

  describe('toggling todos', () => {
    it('should toggle a todo', async () => {
      const toggledTodo: Todo = {
        ...mockTodos[0],
        completed: true,
      };

      vi.mocked(api.getTodos).mockResolvedValue(mockTodos);
      vi.mocked(api.toggleTodo).mockResolvedValue(toggledTodo);

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isToggling).toBe(false);

      await result.current.toggleTodo('1');

      await waitFor(() => {
        expect(result.current.isToggling).toBe(false);
      });

      expect(api.toggleTodo).toHaveBeenCalledWith('1', expect.any(Object));
    });

    it('should optimistically update todo status', async () => {
      const toggledTodo: Todo = {
        ...mockTodos[0],
        completed: true,
      };

      vi.mocked(api.getTodos).mockResolvedValue(mockTodos);
      vi.mocked(api.toggleTodo).mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(toggledTodo), 100);
        });
      });

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialCompleted = result.current.todos.find(
        (t: Todo) => t._id === '1'
      )?.completed;

      result.current.toggleTodo('1');

      await waitFor(() => {
        const todo = result.current.todos.find((t: Todo) => t._id === '1');
        expect(todo?.completed).toBe(!initialCompleted);
      });
    });

    it('should rollback on toggle error', async () => {
      const errorMessage = 'Failed to toggle todo';
      vi.mocked(api.getTodos).mockResolvedValue(mockTodos);
      vi.mocked(api.toggleTodo).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialCompleted = result.current.todos.find(
        (t: Todo) => t._id === '1'
      )?.completed;

      await expect(result.current.toggleTodo('1')).rejects.toThrow(
        errorMessage
      );

      await waitFor(() => {
        const todo = result.current.todos.find((t: Todo) => t._id === '1');
        expect(todo?.completed).toBe(initialCompleted);
      });
    });
  });

  describe('deleting todos', () => {
    it('should delete a todo', async () => {
      vi.mocked(api.getTodos).mockResolvedValue(mockTodos);
      vi.mocked(api.deleteTodo).mockResolvedValue(null);

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isDeleting).toBe(false);

      await result.current.deleteTodo('1');

      await waitFor(() => {
        expect(result.current.isDeleting).toBe(false);
      });

      expect(api.deleteTodo).toHaveBeenCalledWith('1', expect.any(Object));
    });

    it('should optimistically remove todo from cache', async () => {
      vi.mocked(api.getTodos).mockResolvedValue(mockTodos);
      vi.mocked(api.deleteTodo).mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(null), 100);
        });
      });

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialLength = result.current.todos.length;

      result.current.deleteTodo('1');

      await waitFor(() => {
        expect(result.current.todos.length).toBeLessThan(initialLength);
        expect(result.current.todos.find((t: Todo) => t._id === '1')).toBeUndefined();
      });
    });

    it('should rollback on delete error', async () => {
      const errorMessage = 'Failed to delete todo';
      vi.mocked(api.getTodos).mockResolvedValue(mockTodos);
      vi.mocked(api.deleteTodo).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialLength = result.current.todos.length;

      await expect(result.current.deleteTodo('1')).rejects.toThrow(
        errorMessage
      );

      await waitFor(() => {
        expect(result.current.todos.length).toBe(initialLength);
        expect(result.current.todos.find((t: Todo) => t._id === '1')).toBeDefined();
      });
    });
  });

  describe('loading states', () => {
    it('should track individual mutation loading states', async () => {
      const newTodo: Todo = {
        _id: '3',
        title: 'New Todo',
        completed: false,
        priority: 'low',
        createdAt: '2026-03-29T12:00:00.000Z',
      };

      vi.mocked(api.getTodos).mockResolvedValue(mockTodos);
      vi.mocked(api.createTodo).mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(newTodo), 100);
        });
      });

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isCreating).toBe(false);
      expect(result.current.isToggling).toBe(false);
      expect(result.current.isDeleting).toBe(false);

      result.current.createTodo('New Todo', 'low');

      await waitFor(() => {
        expect(result.current.isCreating).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.isCreating).toBe(false);
      });
    });
  });
});
