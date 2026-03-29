import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { TaskCard } from './TaskCard';
import type { Todo } from '../../types/todo';

const mockTodo: Todo = {
  _id: '1',
  title: 'Test Todo Item',
  completed: false,
  priority: 'high',
  createdAt: new Date().toISOString()
};

const mockOnToggle = vi.fn();
const mockOnDelete = vi.fn();

describe('TaskCard', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the regular state correctly', () => {
    render(
      <TaskCard 
        todo={mockTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('Test Todo Item')).toBeInTheDocument();
    
    const icon = screen.getByText('auto_awesome');
    expect(icon).toBeInTheDocument();
    
    const container = screen.getByText('Test Todo Item').closest('.group');
    expect(container).toHaveClass('bg-surface-container-low/30');
  });

  it('renders the active state correctly', () => {
    render(
      <TaskCard 
        todo={mockTodo} 
        isActive={true} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    
    const container = screen.getByText('Test Todo Item').closest('.group');
    expect(container).toHaveClass('bg-surface-container-high/60');
    expect(container).toHaveClass('shadow-[0_0_30px_rgba(204,198,180,0.05)]');
  });

  it('renders the completed state correctly', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(
      <TaskCard 
        todo={completedTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    const title = screen.getByText('Test Todo Item');
    expect(title).toHaveClass('line-through');
    
    const icon = screen.getByText('check_circle');
    expect(icon).toBeInTheDocument();
    
    const container = screen.getByText('Test Todo Item').closest('.group');
    expect(container).toHaveClass('bg-surface-container-lowest/20');
    expect(container).toHaveClass('opacity-40');
  });

  it('calls onToggle when clicking the main area', () => {
    render(
      <TaskCard 
        todo={mockTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    const container = screen.getByText('Test Todo Item').closest('.group');
    fireEvent.click(container!);
    
    expect(mockOnToggle).toHaveBeenCalledWith('1');
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when clicking the delete button', () => {
    render(
      <TaskCard 
        todo={mockTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );
    
    const deleteButton = screen.getByLabelText('Delete task');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith('1');
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    
    expect(mockOnToggle).not.toHaveBeenCalled();
  });
});
