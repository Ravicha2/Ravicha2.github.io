import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useViewTransitionNavigate } from '../../src/hooks/useViewTransitionNavigate';

const NavigationConsumer: React.FC<{ target: string }> = ({ target }) => {
  const navigate = useViewTransitionNavigate();
  const location = useLocation();

  return (
    <div>
      <span data-testid="current-location">{location.pathname}</span>
      <button onClick={() => navigate(target)}>Trigger Navigation</button>
    </div>
  );
};

describe('useViewTransitionNavigate Hook', () => {
  let originalStartViewTransition: any;

  beforeEach(() => {
    originalStartViewTransition = (document as any).startViewTransition;
  });

  afterEach(() => {
    (document as any).startViewTransition = originalStartViewTransition;
    vi.restoreAllMocks();
  });

  it('navigates cleanly when document.startViewTransition is not available', async () => {
    delete (document as any).startViewTransition;
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<NavigationConsumer target="/projects" />} />
          <Route path="/projects" element={<div>Projects Destination</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('current-location')).toHaveTextContent('/');
    await user.click(screen.getByRole('button', { name: /trigger navigation/i }));
    expect(screen.getByText('Projects Destination')).toBeInTheDocument();
  });

  it('uses document.startViewTransition when available and reduced motion is false', async () => {
    const user = userEvent.setup();
    const mockStartViewTransition = vi.fn((cb: () => void) => {
      cb();
    });
    (document as any).startViewTransition = mockStartViewTransition;

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<NavigationConsumer target="/experience" />} />
          <Route path="/experience" element={<div>Experience Destination</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /trigger navigation/i }));
    expect(mockStartViewTransition).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Experience Destination')).toBeInTheDocument();
  });

  it('bypasses document.startViewTransition when prefers-reduced-motion is true', async () => {
    const user = userEvent.setup();
    const mockStartViewTransition = vi.fn((cb: () => void) => {
      cb();
    });
    (document as any).startViewTransition = mockStartViewTransition;

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<NavigationConsumer target="/projects/shepherd" />} />
          <Route path="/projects/shepherd" element={<div>Shepherd Case Study Destination</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /trigger navigation/i }));
    expect(mockStartViewTransition).not.toHaveBeenCalled();
    expect(screen.getByText('Shepherd Case Study Destination')).toBeInTheDocument();
  });
});

