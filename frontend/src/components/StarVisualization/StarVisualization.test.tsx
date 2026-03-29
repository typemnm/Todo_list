import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarVisualization } from './StarVisualization';
import type { Todo } from '../../types/todo';

const mockTodos: Todo[] = [
  {
    _id: '1',
    title: 'Alpha Centauri Task',
    completed: false,
    priority: 'high',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Sirius B Bug',
    completed: true,
    priority: 'low',
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    title: 'Vega Feature',
    completed: false,
    priority: 'medium',
    createdAt: new Date().toISOString()
  }
];

describe('StarVisualization', () => {
  it('renders an empty state when no todos are provided', () => {
    render(<StarVisualization todos={[]} />);
    expect(screen.getByText(/the cosmos is quiet/i)).toBeInTheDocument();
  });

  it('renders the correct number of stars', () => {
    render(<StarVisualization todos={mockTodos} />);
    expect(screen.getByText('Alpha Centauri Task')).toBeInTheDocument();
    expect(screen.getByText('Sirius B Bug')).toBeInTheDocument();
    expect(screen.getByText('Vega Feature')).toBeInTheDocument();
  });

  it('assigns correct sizes based on priority', () => {
    const { container } = render(<StarVisualization todos={mockTodos} />);
    const highPriorityStar = container.querySelector('[data-priority="high"]');
    const mediumPriorityStar = container.querySelector('[data-priority="medium"]');
    const lowPriorityStar = container.querySelector('[data-priority="low"]');
    
    expect(highPriorityStar).toHaveClass('w-5', 'h-5');
    expect(mediumPriorityStar).toHaveClass('w-4', 'h-4');
    expect(lowPriorityStar).toHaveClass('w-3', 'h-3');
  });

  it('applies active styling to the active todo', () => {
    const { container } = render(<StarVisualization todos={mockTodos} activeTodoId="1" />);
    const activeStar = container.querySelector('[data-id="1"]');
    expect(activeStar).toHaveClass('bg-primary', 'star-glow');
  });

  it('applies completed styling to completed todos', () => {
    const { container } = render(<StarVisualization todos={mockTodos} />);
    const completedContainer = container.querySelector('[data-todo-id="2"]');
    expect(completedContainer).toHaveClass('opacity-60');
  });

  it('calls onStarClick with the correct ID when a star is clicked', () => {
    const handleStarClick = vi.fn();
    const { container } = render(<StarVisualization todos={mockTodos} onStarClick={handleStarClick} />);
    
    const firstStar = container.querySelector('[data-todo-id="1"]') as HTMLElement;
    fireEvent.click(firstStar);
    
    expect(handleStarClick).toHaveBeenCalledWith('1');
    expect(handleStarClick).toHaveBeenCalledTimes(1);
  });
});
