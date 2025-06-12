import { render, screen } from '@testing-library/react';
import { Header } from '@/components/layout/Header';

describe('Header', () => {
  it('renders the ScrapYuk title', () => {
    render(<Header />);
    expect(screen.getByText('ScrapYuk')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Header />);
    expect(screen.getByText('3D Pop-up Scrapbook Creator')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });

  it('renders mode toggle buttons', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument();
  });
});