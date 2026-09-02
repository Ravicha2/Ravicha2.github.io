import { useRef } from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, useNavigate, useLocation } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { RouteAnnouncer } from '../../src/accessibility/RouteAnnouncer';

function TestWrapper() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
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
      <RouteAnnouncer pageTitle={pageTitle} mainRef={mainRef} />
      <button onClick={() => navigate('/projects')}>Go to Projects</button>
      <main ref={mainRef} id="main-content" tabIndex={-1}>
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

  it('programmatically shifts focus to main element on navigation', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/']}>
        <TestWrapper />
      </MemoryRouter>
    );

    const navButton = screen.getByRole('button', { name: /go to projects/i });
    act(() => {
      navButton.click();
    });

    const mainElement = screen.getByRole('main');
    expect(document.activeElement).toBe(mainElement);
  });
});
