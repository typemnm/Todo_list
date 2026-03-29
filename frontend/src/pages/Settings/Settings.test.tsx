// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Settings } from './Settings';

vi.mock('../../components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-layout">{children}</div>,
}));

describe('Settings Page', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the hero header correctly', () => {
    render(<Settings />);
    expect(screen.getByText(/Constellation/i)).toBeInTheDocument();
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Personalize your celestial viewport/i)).toBeInTheDocument();
  });

  it('renders visual previews', () => {
    render(<Settings />);
    expect(screen.getByText('White Dwarf')).toBeInTheDocument();
    expect(screen.getByText('Blue Giant')).toBeInTheDocument();
    expect(screen.getByText('Supernova')).toBeInTheDocument();
  });

  it('renders atmospheric controls and default star profile sections', () => {
    render(<Settings />);
    
    expect(screen.getByText('Star Brightness')).toBeInTheDocument();
    expect(screen.getByText('Glow Intensity')).toBeInTheDocument();
    
    expect(screen.getByText('Connection Lines')).toBeInTheDocument();
    expect(screen.getByText('Nebula Effects')).toBeInTheDocument();
    expect(screen.getByText('Animation Speed')).toBeInTheDocument();
  });

  it('allows changing sliders and toggles', () => {
    render(<Settings />);
    
    const connectionLinesToggle = screen.getByRole('switch', { name: /Connection Lines/i });
    expect(connectionLinesToggle).toHaveAttribute('aria-checked', 'true');
    
    fireEvent.click(connectionLinesToggle);
    expect(connectionLinesToggle).toHaveAttribute('aria-checked', 'false');
  });

  it('resets to galactic defaults when the reset button is clicked', () => {
    render(<Settings />);
    
    const connectionLinesToggle = screen.getByRole('switch', { name: /Connection Lines/i });
    fireEvent.click(connectionLinesToggle);
    expect(connectionLinesToggle).toHaveAttribute('aria-checked', 'false');
    
    const resetBtn = screen.getByRole('button', { name: /Reset to Galactic Defaults/i });
    fireEvent.click(resetBtn);
    
    expect(connectionLinesToggle).toHaveAttribute('aria-checked', 'true');
  });

  it('renders apply button', () => {
    render(<Settings />);
    expect(screen.getByRole('button', { name: /Apply Configurations/i })).toBeInTheDocument();
  });
});
