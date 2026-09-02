import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { AppLayout } from '../../src/components/layout/AppLayout';

describe('AppLayout Landmark Hierarchy', () => {
  it('renders all required HTML5 landmarks', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/']}>
        <AppLayout pageTitle="Overview">
          <div>Page Body Content</div>
        </AppLayout>
      </MemoryRouter>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument(); // <header>
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument(); // <nav>
    expect(screen.getByRole('main')).toBeInTheDocument(); // <main>
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // <footer>
  });

  it('marks the active navigation route with aria-current="page"', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/projects']}>
        <AppLayout pageTitle="Projects">
          <div>Projects Content</div>
        </AppLayout>
      </MemoryRouter>
    );

    const activeLink = screen.getByRole('link', { name: /projects/i });
    expect(activeLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders skip link targeting main-content', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/']}>
        <AppLayout pageTitle="Overview">
          <div>Overview Content</div>
        </AppLayout>
      </MemoryRouter>
    );

    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});
