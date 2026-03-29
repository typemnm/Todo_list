import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Layout from './Layout';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Layout', () => {
  it('renders children content', () => {
    renderWithRouter(
      <Layout>
        <div data-testid="child">Child Content</div>
      </Layout>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders sidebar on desktop', () => {
    renderWithRouter(<Layout><div /></Layout>);
    expect(screen.getByRole('complementary', { name: /sidebar/i })).toBeInTheDocument();
  });

  it('renders bottom navigation on mobile', () => {
    renderWithRouter(<Layout><div /></Layout>);
    expect(screen.getByRole('navigation', { name: /bottom/i })).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithRouter(<Layout><div /></Layout>);
    expect(screen.getAllByRole('link', { name: /home|map/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /list/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /settings/i })[0]).toBeInTheDocument();
  });
});