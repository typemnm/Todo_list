/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { useTodos } from '../../hooks/useTodos';
import type { Todo } from '../../types/todo';

vi.mock('../../hooks/useTodos', () => ({
  useTodos: vi.fn(),
}));

vi.mock('../../components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

vi.mock('../../components/StarVisualization', () => ({
  StarVisualization: ({ todos }: { todos: Todo[] }) => <div data-testid="star-visualization">Stars: {todos.length}</div>,
}));

const mockTodos: Todo[] = [
  { _id: '1', title: 'Task 1', completed: true, priority: 'high', createdAt: '2023-01-01' },
  { _id: '2', title: 'Task 2', completed: false, priority: 'medium', createdAt: '2023-01-02' },
  { _id: '3', title: 'Task 3', completed: false, priority: 'low', createdAt: '2023-01-03' },
];

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders loading state correctly', () => {
    vi.mocked(useTodos).mockReturnValue({
      todos: [],
      isLoading: true,
      error: null,
      createTodo: vi.fn(),
      toggleTodo: vi.fn(),
      deleteTodo: vi.fn(),
      isCreating: false,
      isToggling: false,
      isDeleting: false,
    });

    renderWithRouter(<Dashboard />);
    expect(screen.getByTestId('loading-spinner')).toBeDefined();
  });

  it('renders error state correctly', () => {
    vi.mocked(useTodos).mockReturnValue({
      todos: [],
      isLoading: false,
      error: new Error('Failed to fetch'),
      createTodo: vi.fn(),
      toggleTodo: vi.fn(),
      deleteTodo: vi.fn(),
      isCreating: false,
      isToggling: false,
      isDeleting: false,
    });

    renderWithRouter(<Dashboard />);
    expect(screen.getByText(/Failed to fetch/i)).toBeDefined();
  });

  it('renders empty state correctly', () => {
    vi.mocked(useTodos).mockReturnValue({
      todos: [],
      isLoading: false,
      error: null,
      createTodo: vi.fn(),
      toggleTodo: vi.fn(),
      deleteTodo: vi.fn(),
      isCreating: false,
      isToggling: false,
      isDeleting: false,
    });

    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Your Stellar Map')).toBeDefined();
    expect(screen.getByTestId('star-visualization').textContent).toContain('Stars: 0');
    expect(screen.getByText('Total Stars')).toBeDefined();
    expect(screen.getByText('Completed')).toBeDefined();
    expect(screen.getByText('Pending')).toBeDefined();
  });

  it('renders metrics with data correctly', () => {
    vi.mocked(useTodos).mockReturnValue({
      todos: mockTodos,
      isLoading: false,
      error: null,
      createTodo: vi.fn(),
      toggleTodo: vi.fn(),
      deleteTodo: vi.fn(),
      isCreating: false,
      isToggling: false,
      isDeleting: false,
    });

    renderWithRouter(<Dashboard />);
    
    expect(screen.getByText('Your Stellar Map')).toBeDefined();
    expect(screen.getByTestId('star-visualization').textContent).toContain('Stars: 3');

    expect(screen.getByText('Total Stars')).toBeDefined();
    expect(screen.getAllByText('3')[0]).toBeDefined(); // Total

    expect(screen.getByText('Completed')).toBeDefined();
    expect(screen.getAllByText('1')[0]).toBeDefined(); // Completed

    expect(screen.getByText('Pending')).toBeDefined();
    expect(screen.getAllByText('2')[0]).toBeDefined(); // Pending

    expect(screen.getByText('Celestial Events')).toBeDefined();
    
    const fab = screen.getByRole('link', { name: /add/i });
    expect(fab.getAttribute('href')).toBe('/add');
  });
});
