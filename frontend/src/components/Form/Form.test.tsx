import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input, Button, Toggle, Slider, PrioritySelector } from './index';

describe('Form Components', () => {
  describe('Input', () => {
    it('renders correctly with given value', () => {
      render(<Input value="test value" onChange={() => {}} placeholder="Enter text" />);
      const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
      expect(input.value).toBe('test value');
    });

    it('calls onChange when typing', () => {
      const handleChange = vi.fn();
      render(<Input value="" onChange={handleChange} placeholder="Enter text" />);
      const input = screen.getByPlaceholderText('Enter text');
      fireEvent.change(input, { target: { value: 'new text' } });
      expect(handleChange).toHaveBeenCalledWith('new text');
    });

    it('displays error message when provided', () => {
      render(<Input value="" onChange={() => {}} error="Required field" />);
      expect(screen.getByText('Required field')).toBeDefined();
    });
  });

  describe('Button', () => {
    it('renders children correctly', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByText('Click Me')).toBeDefined();
    });

    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      fireEvent.click(screen.getByText('Click Me'));
      expect(handleClick).toHaveBeenCalled();
    });

    it('is disabled when disabled prop is true', () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      const button = screen.getByText('Disabled') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Toggle', () => {
    it('calls onChange when clicked', () => {
      const handleChange = vi.fn();
      render(<Toggle checked={false} onChange={handleChange} label="Enable Feature" />);
      fireEvent.click(screen.getByRole('switch') || screen.getByText('Enable Feature').parentElement!);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('displays label when provided', () => {
      render(<Toggle checked={false} onChange={() => {}} label="Enable Feature" />);
      expect(screen.getByText('Enable Feature')).toBeDefined();
    });
  });

  describe('Slider', () => {
    it('renders with correct value', () => {
      render(<Slider value={50} onChange={() => {}} min={0} max={100} label="Volume" />);
      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider.value).toBe('50');
    });

    it('calls onChange when value changes', () => {
      const handleChange = vi.fn();
      render(<Slider value={50} onChange={handleChange} />);
      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '75' } });
      expect(handleChange).toHaveBeenCalledWith(75);
    });
  });

  describe('PrioritySelector', () => {
    it('renders all priority options', () => {
      render(<PrioritySelector value="medium" onChange={() => {}} />);
      expect(screen.getByText('Low')).toBeDefined();
      expect(screen.getByText('Medium')).toBeDefined();
      expect(screen.getByText('High')).toBeDefined();
    });

    it('calls onChange with correct value when option clicked', () => {
      const handleChange = vi.fn();
      render(<PrioritySelector value="medium" onChange={handleChange} />);
      fireEvent.click(screen.getByText('High'));
      expect(handleChange).toHaveBeenCalledWith('high');
    });
  });
});
