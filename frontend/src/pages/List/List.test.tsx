import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { List } from './List';
import { useTodos } from '../../hooks/useTodos';
import type { Todo } from '../../types/todo';

vi.mock('../../hooks/useTodos');
vi.mock('../../components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>
}));
vi.mock('../../components/TaskCard', () => ({
  TaskCard: ({ todo, isActive, onToggle, onDelete }: { todo: Todo, isActive: boolean, onToggle: (id: string) => void, onDelete: (id: string) => void }) => (
    <div data-testid={`task-card-${todo._id}`} data-active={isActive}>
      <span>{todo.title}</span>
      <button onClick={() => onToggle(todo._id)}>Toggle</button>
      <button onClick={() => onDelete(todo._id)}>Delete</button>
    </div>
  )
}));

const mockTodos: Todo[] = [
  { _id: '1', title: 'Task 1', completed: false, priority: 'high', createdAt: '2023-01-01' },
  { _id: '2', title: 'Task 2', completed: true, priority: 'low', createdAt: '2023-01-02' },
  { _id: '3', title: 'Task 3', completed: false, priority: 'medium', createdAt: '2023-01-03' }
];

describe('List Page', () => {
  const mockToggleTodo = vi.fn();
  const mockDeleteTodo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTodos).mockReturnValue({
      todos: mockTodos,
      isLoading: false,
      error: null,
      toggleTodo: mockToggleTodo,
      deleteTodo: mockDeleteTodo,
      createTodo: vi.fn(),
      isCreating: false,
      isToggling: false,
      isDeleting: false
    });
  });

  it('renders loading state', () => {
    vi.mocked(useTodos).mockReturnValue({
      todos: [],
      isLoading: true,
      error: null,
      toggleTodo: vi.fn(),
      deleteTodo: vi.fn(),
      createTodo: vi.fn(),
      isCreating: false,
      isToggling: false,
      isDeleting: false
    });
    render(<List />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    vi.mocked(useTodos).mockReturnValue({
      todos: [],
      isLoading: false,
      error: new Error('Failed to fetch'),
      toggleTodo: vi.fn(),
      deleteTodo: vi.fn(),
      createTodo: vi.fn(),
      isCreating: false,
      isToggling: false,
      isDeleting: false
    });
    render(<List />);
    expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
  });

  it('renders empty state', () => {
    vi.mocked(useTodos).mockReturnValue({
      todos: [],
      isLoading: false,
      error: null,
      toggleTodo: vi.fn(),
      deleteTodo: vi.fn(),
      createTodo: vi.fn(),
      isCreating: false,
      isToggling: false,
      isDeleting: false
    });
    render(<List />);
    expect(screen.getByText(/No stars in your constellation yet/i)).toBeInTheDocument();
  });

  it('renders header and metrics correctly', () => {
    render(<List />);
    
    expect(screen.getByText('The Milky Way List')).toBeInTheDocument();
    expect(screen.getByText('Active Sector: ORION-B9')).toBeInTheDocument();
    
    expect(screen.getByText('Total Mass')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    
    expect(screen.getByText('Supernovas')).toBeInTheDocument();
    
    expect(screen.getByText('Active Orbits')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    
    expect(screen.getByText('Completed')).toBeInTheDocument();
    
    const ones = screen.getAllByText('1');
    expect(ones.length).toBeGreaterThan(1);
  });

  it('renders todos sorted by incomplete first and marks the first incomplete as active', () => {
    render(<List />);
    
    const task1 = screen.getByTestId('task-card-1');
    expect(task1).toHaveAttribute('data-active', 'true');
    
    const task3 = screen.getByTestId('task-card-3');
    expect(task3).toHaveAttribute('data-active', 'false');
    
    const task2 = screen.getByTestId('task-card-2');
    expect(task2).toHaveAttribute('data-active', 'false');

    const cards = screen.getAllByTestId(/task-card-/);
    expect(cards[0]).toHaveAttribute('data-testid', 'task-card-1');
    expect(cards[1]).toHaveAttribute('data-testid', 'task-card-3');
    expect(cards[2]).toHaveAttribute('data-testid', 'task-card-2');
  });

  it('calls handlers when interacting with task cards', () => {
    render(<List />);
    
    const task1 = screen.getByTestId('task-card-1');
    
    fireEvent.click(task1.querySelector('button:nth-of-type(1)')!);
    expect(mockToggleTodo).toHaveBeenCalledWith('1');
    
    fireEvent.click(task1.querySelector('button:nth-of-type(2)')!);
    expect(mockDeleteTodo).toHaveBeenCalledWith('1');
  });
});
