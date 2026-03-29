import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AddTodo } from './AddTodo';
import { useTodos } from '../../hooks/useTodos';
import { useNavigate } from 'react-router-dom';

vi.mock('../../hooks/useTodos');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('AddTodo', () => {
  const mockCreateTodo = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTodos as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      createTodo: mockCreateTodo,
    });
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  });

  const renderAddTodo = () => {
    return render(
      <MemoryRouter>
        <AddTodo />
      </MemoryRouter>
    );
  };

  it('renders correctly', () => {
    renderAddTodo();
    expect(screen.getByText('Place a New Star')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Designate Task Name...')).toBeInTheDocument();
    expect(screen.getByText('Ignite Star')).toBeInTheDocument();
    expect(screen.getByText('Abort Sequence')).toBeInTheDocument();
  });

  it('validates empty title on submit', async () => {
    renderAddTodo();
    
    const submitButton = screen.getByText('Ignite Star');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(mockCreateTodo).not.toHaveBeenCalled();
  });

  it('validates max length of title on submit', async () => {
    renderAddTodo();
    
    const input = screen.getByPlaceholderText('Designate Task Name...');
    const longTitle = 'a'.repeat(201);
    
    fireEvent.change(input, { target: { value: longTitle } });
    
    const submitButton = screen.getByText('Ignite Star');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Title must be 200 characters or less')).toBeInTheDocument();
    expect(mockCreateTodo).not.toHaveBeenCalled();
  });

  it('calls createTodo and navigates on successful submit', async () => {
    renderAddTodo();
    
    const input = screen.getByPlaceholderText('Designate Task Name...');
    fireEvent.change(input, { target: { value: 'New Test Todo' } });
    
    const submitButton = screen.getByText('Ignite Star');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith('New Test Todo', 'medium');
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/list');
  });

  it('allows changing priority', async () => {
    renderAddTodo();
    
    const input = screen.getByPlaceholderText('Designate Task Name...');
    fireEvent.change(input, { target: { value: 'High Priority Todo' } });
    
    const highButton = screen.getByText('High').closest('button');
    fireEvent.click(highButton!);
    
    const submitButton = screen.getByText('Ignite Star');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith('High Priority Todo', 'high');
    });
  });
  
  it('navigates back to list when clicking Abort Sequence', () => {
    renderAddTodo();
    const abortButton = screen.getByText('Abort Sequence');
    fireEvent.click(abortButton);
    expect(mockNavigate).toHaveBeenCalledWith('/list');
  });
});
