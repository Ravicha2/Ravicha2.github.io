import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import * as fs from 'fs';
import * as path from 'path';

import { useViewTransitionNavigate } from '../../src/hooks/useViewTransitionNavigate';
import { TransitionLink } from '../../src/components/common/TransitionLink';
import { BentoGrid } from '../../src/components/home/BentoGrid';
import { ProjectsView } from '../../src/views/ProjectsView';
import { CaseStudyView } from '../../src/views/CaseStudyView';

const NavigationConsumer: React.FC<{ target: string }> = ({ target }) => {
  const navigate = useViewTransitionNavigate();
  const location = useLocation();

  return (
    <div>
      <span data-testid="current-location">{location.pathname}</span>
      <button onClick={() => navigate(target)}>Trigger Navigation</button>
      <TransitionLink to={target} data-testid="transition-link">
        Transition Link Navigation
      </TransitionLink>
    </div>
  );
};

describe('useViewTransitionNavigate Hook & TransitionLink Component', () => {
  let originalStartViewTransition: any;

  beforeEach(() => {
    originalStartViewTransition = (document as any).startViewTransition;
    delete document.documentElement.dataset.transitionDirection;
  });

  afterEach(() => {
    (document as any).startViewTransition = originalStartViewTransition;
    delete document.documentElement.dataset.transitionDirection;
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

  it('TransitionLink triggers navigation with view transition on standard click', async () => {
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
          <Route path="/" element={<NavigationConsumer target="/projects" />} />
          <Route path="/projects" element={<div>Projects Destination</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByTestId('transition-link'));
    expect(mockStartViewTransition).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Projects Destination')).toBeInTheDocument();
  });
});

describe('Navbar Directional Slide Transitions (Horizontal Slide Rules)', () => {
  let originalStartViewTransition: any;

  beforeEach(() => {
    originalStartViewTransition = (document as any).startViewTransition;
    delete document.documentElement.dataset.transitionDirection;
  });

  afterEach(() => {
    (document as any).startViewTransition = originalStartViewTransition;
    delete document.documentElement.dataset.transitionDirection;
    vi.restoreAllMocks();
  });

  const setupMockMatchMedia = () => {
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
  };

  it('sets slide-left when navigating from Overview (/) to Projects (/projects)', async () => {
    setupMockMatchMedia();
    const user = userEvent.setup();
    let capturedDirection: string | undefined;

    (document as any).startViewTransition = vi.fn((cb: () => void) => {
      capturedDirection = document.documentElement.dataset.transitionDirection;
      cb();
    });

    render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<NavigationConsumer target="/projects" />} />
          <Route path="/projects" element={<div>Projects</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /trigger navigation/i }));
    expect(capturedDirection).toBe('slide-left');
  });

  it('sets slide-left when navigating from Overview (/) to Experience (/experience)', async () => {
    setupMockMatchMedia();
    const user = userEvent.setup();
    let capturedDirection: string | undefined;

    (document as any).startViewTransition = vi.fn((cb: () => void) => {
      capturedDirection = document.documentElement.dataset.transitionDirection;
      cb();
    });

    render(
      <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<NavigationConsumer target="/experience" />} />
          <Route path="/experience" element={<div>Experience</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /trigger navigation/i }));
    expect(capturedDirection).toBe('slide-left');
  });

  it('sets slide-right when navigating from Projects (/projects) to Overview (/)', async () => {
    setupMockMatchMedia();
    const user = userEvent.setup();
    let capturedDirection: string | undefined;

    (document as any).startViewTransition = vi.fn((cb: () => void) => {
      capturedDirection = document.documentElement.dataset.transitionDirection;
      cb();
    });

    render(
      <MemoryRouter initialEntries={['/projects']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/projects" element={<NavigationConsumer target="/" />} />
          <Route path="/" element={<div>Overview</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /trigger navigation/i }));
    expect(capturedDirection).toBe('slide-right');
  });

  it('sets slide-left when navigating from Projects (/projects) to Experience (/experience)', async () => {
    setupMockMatchMedia();
    const user = userEvent.setup();
    let capturedDirection: string | undefined;

    (document as any).startViewTransition = vi.fn((cb: () => void) => {
      capturedDirection = document.documentElement.dataset.transitionDirection;
      cb();
    });

    render(
      <MemoryRouter initialEntries={['/projects']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/projects" element={<NavigationConsumer target="/experience" />} />
          <Route path="/experience" element={<div>Experience</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /trigger navigation/i }));
    expect(capturedDirection).toBe('slide-left');
  });

  it('sets slide-right when navigating from Experience (/experience) to Overview (/)', async () => {
    setupMockMatchMedia();
    const user = userEvent.setup();
    let capturedDirection: string | undefined;

    (document as any).startViewTransition = vi.fn((cb: () => void) => {
      capturedDirection = document.documentElement.dataset.transitionDirection;
      cb();
    });

    render(
      <MemoryRouter initialEntries={['/experience']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/experience" element={<NavigationConsumer target="/" />} />
          <Route path="/" element={<div>Overview</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /trigger navigation/i }));
    expect(capturedDirection).toBe('slide-right');
  });

  it('sets slide-right when navigating from Experience (/experience) to Projects (/projects)', async () => {
    setupMockMatchMedia();
    const user = userEvent.setup();
    let capturedDirection: string | undefined;

    (document as any).startViewTransition = vi.fn((cb: () => void) => {
      capturedDirection = document.documentElement.dataset.transitionDirection;
      cb();
    });

    render(
      <MemoryRouter initialEntries={['/experience']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/experience" element={<NavigationConsumer target="/projects" />} />
          <Route path="/projects" element={<div>Projects</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /trigger navigation/i }));
    expect(capturedDirection).toBe('slide-right');
  });
});

describe('Shared-Element View Transitions & Stylesheet Rules', () => {
  it('verifies BentoGrid featured cards assign matching viewTransitionName styles', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BentoGrid />
      </MemoryRouter>
    );

    const shepherdCard = screen.getByTestId('bento-card-shepherd');
    expect(shepherdCard).toHaveStyle({ viewTransitionName: 'project-card-shepherd' });

    const nl2regexCard = screen.getByTestId('bento-card-nl2regex');
    expect(nl2regexCard).toHaveStyle({ viewTransitionName: 'project-card-nl2regex' });
  });

  it('verifies ProjectsView cards assign matching viewTransitionName styles', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ProjectsView />
      </MemoryRouter>
    );

    const shepherdCard = screen.getByTestId('project-card-shepherd');
    expect(shepherdCard).toHaveStyle({ viewTransitionName: 'project-card-shepherd' });

    const ingestionCard = screen.getByTestId('project-card-document-ingestion-agent');
    expect(ingestionCard).toHaveStyle({ viewTransitionName: 'project-card-document-ingestion-agent' });
  });

  it('verifies CaseStudyView hero header assigns matching viewTransitionName style', () => {
    render(
      <MemoryRouter initialEntries={['/projects/shepherd']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/projects/:slug" element={<CaseStudyView />} />
        </Routes>
      </MemoryRouter>
    );

    const header = document.querySelector('header');
    expect(header).not.toBeNull();
    expect(header).toHaveStyle({ viewTransitionName: 'project-card-shepherd' });
  });

  it('verifies src/styles/index.css defines keyframes, directional slide rules, and persistent header', () => {
    const cssPath = path.resolve(__dirname, '../../src/styles/index.css');
    const css = fs.readFileSync(cssPath, 'utf-8');

    expect(css).toContain('@keyframes fade-out');
    expect(css).toContain('@keyframes fade-in');
    expect(css).toContain('@keyframes slide-out-to-left');
    expect(css).toContain('@keyframes slide-in-from-right');
    expect(css).toContain('@keyframes slide-out-to-right');
    expect(css).toContain('@keyframes slide-in-from-left');
    expect(css).toContain('view-transition-name: app-header');
    expect(css).toContain('data-transition-direction="slide-left"');
    expect(css).toContain('data-transition-direction="slide-right"');
    expect(css).toContain('object-fit: cover');
    expect(css).toContain('project-card-shepherd');
    expect(css).toContain('project-card-nl2regex');
  });

  it('verifies src/styles/accessibility.css suppresses view transition animations under reduced motion', () => {
    const cssPath = path.resolve(__dirname, '../../src/styles/accessibility.css');
    const css = fs.readFileSync(cssPath, 'utf-8');

    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('::view-transition-group(*)');
    expect(css).toContain('::view-transition-old(*)');
    expect(css).toContain('::view-transition-new(*)');
    expect(css).toContain('animation: none !important');
  });
});
