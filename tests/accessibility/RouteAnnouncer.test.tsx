import { useRef } from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { RouteAnnouncer } from '../../src/accessibility/RouteAnnouncer';

function TestWrapper({ title = 'Overview' }: { title?: string }) {
  const mainRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  return (
    <div>
      <RouteAnnouncer pageTitle={title} mainRef={mainRef} />
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
      <MemoryRouter initialEntries={['/']}>
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
      <MemoryRouter initialEntries={['/']}>
        <TestWrapper />
      </MemoryRouter>
    );

    const navButton = screen.getByRole('button', { name: /go to projects/i });
    act(() => {
      navButton.click();
    });

    const announcer = screen.getByRole('status');
    expect(announcer.textContent).toContain('Navigated to Overview');
    expect(document.title).toContain('Overview | Palm Suksawasdi');
  });

  it('programmatically shifts focus to main element on navigation', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
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
