import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, useNavigate, useLocation } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { RouteAnnouncer } from '../../src/accessibility/RouteAnnouncer';

function TestWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/projects':
        return 'Projects';
      case '/experience':
        return 'Experience';
      case '/':
      default:
        return 'Overview';
    }
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div>
      <RouteAnnouncer pageTitle={pageTitle} />
      <button onClick={() => navigate('/projects')}>Go to Projects</button>
      <main id="main-content" tabIndex={-1}>
        Main Content
      </main>
    </div>
  );
}

describe('RouteAnnouncer Component', () => {
  it('renders a polite aria-live status container', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/']}>
        <TestWrapper />
      </MemoryRouter>
    );

    const announcer = screen.getByRole('status');
    expect(announcer).toBeInTheDocument();
    expect(announcer).toHaveAttribute('aria-live', 'polite');
    expect(announcer).toHaveAttribute('aria-atomic', 'true');
    expect(announcer).toHaveClass('sr-only');
  });

  it('updates document title and announces new page on navigation', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/']}>
        <TestWrapper />
      </MemoryRouter>
    );

    const navButton = screen.getByRole('button', { name: /go to projects/i });
    act(() => {
      navButton.click();
    });

    const announcer = screen.getByRole('status');
    expect(announcer.textContent).toContain('Navigated to Projects');
    expect(document.title).toContain('Projects | Palm Suksawasdi');
  });

  it('does not steal focus into main on the initial mount', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/']}>
        <TestWrapper />
      </MemoryRouter>
    );

    expect(screen.getByRole('status').textContent).toBe('');
    expect(document.activeElement).not.toBe(screen.getByRole('main'));
  });

  it('resets focus to the document start on navigation so forward Tab re-enters at the skip link', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/']}>
        <TestWrapper />
      </MemoryRouter>
    );

    const navButton = screen.getByRole('button', { name: /go to projects/i });
    navButton.focus();
    expect(document.activeElement).toBe(navButton);

    act(() => {
      navButton.click();
    });

    // Focusing `main` (which sits after the skip link and header nav in DOM order)
    // is what made the skip link unreachable forwards; focus must go nowhere instead.
    expect(document.activeElement).toBe(document.body);
    expect(screen.getByRole('status').textContent).toContain('Navigated to Projects');
  });
});
