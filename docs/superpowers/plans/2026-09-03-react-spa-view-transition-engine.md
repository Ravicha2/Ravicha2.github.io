# React SPA View Transition Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement client-side React View Transitions using `document.startViewTransition()` to execute smooth shared-element morphs from project cards to detail routes (`/projects/:slug`) and seamless root cross-fades between main routes (`/`, `/projects`, `/experience`), with complete reduced-motion suppression.

**Architecture:** A lightweight hook `useViewTransitionNavigate` and declarative `TransitionLink` component intercept route transitions to invoke `document.startViewTransition()`. Shared element styling (`viewTransitionName: project-card-${slug}`) connects thumbnail cards with case study hero headers with `object-fit: cover`. CSS keyframes handle root cross-fading and `@media (prefers-reduced-motion: reduce)` motion suppression.

**Tech Stack:** React 18, React Router 6.28, TypeScript, Tailwind CSS, Vite, Vitest, `@testing-library/react`.

## Global Constraints

- Do not introduce heavy third-party animation libraries (e.g. Framer Motion); use native browser View Transitions API and CSS keyframes.
- Ensure strict accessibility: `prefers-reduced-motion: reduce` must bypass `document.startViewTransition` and suppress all CSS transition animations.
- Every task ends with a passing Vitest test suite and a clean git commit.

---

### Task 1: Client-Side Navigation Hook & Helper Component (`useViewTransitionNavigate` & `TransitionLink`)

**Files:**
- Modify: `src/hooks/useViewTransitionNavigate.ts`
- Create: `src/components/common/TransitionLink.tsx`
- Modify: `src/components/common/index.ts` (or export)
- Test: `tests/pipeline/view-transition.test.tsx`

**Interfaces:**
- Consumes: `useNavigate`, `window.matchMedia('(prefers-reduced-motion: reduce)')`, `document.startViewTransition`
- Produces: `useViewTransitionNavigate()` hook and `<TransitionLink to="...">` component.

- [ ] **Step 1: Update the unit tests in `tests/pipeline/view-transition.test.tsx` to test `useViewTransitionNavigate` and `TransitionLink`**

```typescript
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useViewTransitionNavigate } from '../../src/hooks/useViewTransitionNavigate';
import { TransitionLink } from '../../src/components/common/TransitionLink';

const NavigationConsumer: React.FC<{ target: string }> = ({ target }) => {
  const navigate = useViewTransitionNavigate();
  const location = useLocation();

  return (
    <div>
      <span data-testid="current-location">{location.pathname}</span>
      <button onClick={() => navigate(target)}>Trigger Navigation</button>
      <TransitionLink to={target} data-testid="transition-link">Link Navigation</TransitionLink>
    </div>
  );
};

describe('useViewTransitionNavigate Hook & TransitionLink Component', () => {
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
```

- [ ] **Step 2: Create `src/components/common/TransitionLink.tsx` and refine `src/hooks/useViewTransitionNavigate.ts`**

Create `src/components/common/TransitionLink.tsx`:
```typescript
import React from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { useViewTransitionNavigate } from '../../hooks/useViewTransitionNavigate';

export interface TransitionLinkProps extends LinkProps {
  to: string;
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  to,
  onClick,
  children,
  ...props
}) => {
  const navigateWithTransition = useViewTransitionNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (onClick) {
      onClick(e);
    }
    // Only intercept primary left clicks without modifier keys or custom target
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !props.target
    ) {
      e.preventDefault();
      navigateWithTransition(to);
    }
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default TransitionLink;
```

- [ ] **Step 3: Run unit tests**

Run: `npm test tests/pipeline/view-transition.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useViewTransitionNavigate.ts src/components/common/TransitionLink.tsx tests/pipeline/view-transition.test.tsx
git commit -m "feat(transitions): implement useViewTransitionNavigate hook and TransitionLink component"
```

---

### Task 2: Shared-Element `view-transition-name` Matching & Root Cross-Fade Styling

**Files:**
- Modify: `src/components/home/BentoGrid.tsx`
- Modify: `src/views/ProjectsView.tsx`
- Modify: `src/views/CaseStudyView.tsx`
- Modify: `src/components/layout/AppLayout.tsx`
- Modify: `src/styles/index.css`
- Modify: `src/styles/accessibility.css`
- Test: `tests/pipeline/view-transition.test.tsx`

**Interfaces:**
- Connects: Project thumbnail card containers on `/` and `/projects` with case study hero header on `/projects/:slug` using `viewTransitionName: 'project-card-' + slug`.
- Wires: Top navigation bar and internal links to use `useViewTransitionNavigate` / `TransitionLink`.
- Styles: `::view-transition-old(project-card-*)` and `::view-transition-new(project-card-*)` with `object-fit: cover` and 250ms duration; root cross-fade 150ms/180ms.

- [ ] **Step 1: Add shared-element and CSS verification tests**

Extend `tests/pipeline/view-transition.test.tsx`:
```typescript
import * as fs from 'fs';
import * as path from 'path';
import { BentoGrid } from '../../src/components/home/BentoGrid';
import { ProjectsView } from '../../src/views/ProjectsView';
import { CaseStudyView } from '../../src/views/CaseStudyView';
import { AppLayout } from '../../src/components/layout/AppLayout';

describe('Shared-Element View Transitions & CSS Rules', () => {
  it('verifies BentoGrid cards have viewTransitionName style attributes matching project slug', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <BentoGrid />
      </MemoryRouter>
    );

    const shepherdCard = screen.getByTestId('bento-card-shepherd');
    expect(shepherdCard).toHaveStyle({ viewTransitionName: 'project-card-shepherd' });
  });

  it('verifies ProjectsView cards have viewTransitionName style attributes matching project slug', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ProjectsView />
      </MemoryRouter>
    );

    const shepherdCard = screen.getByTestId('project-card-shepherd');
    expect(shepherdCard).toHaveStyle({ viewTransitionName: 'project-card-shepherd' });
  });

  it('verifies CaseStudyView hero header has viewTransitionName matching project slug', () => {
    render(
      <MemoryRouter initialEntries={['/projects/shepherd']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/projects/:slug" element={<CaseStudyView />} />
        </Routes>
      </MemoryRouter>
    );

    const header = screen.getByRole('banner', { name: '' }) || document.querySelector('header');
    expect(header).toHaveStyle({ viewTransitionName: 'project-card-shepherd' });
  });

  it('verifies src/styles/index.css contains keyframes and pseudo-elements with object-fit: cover', () => {
    const cssPath = path.resolve(__dirname, '../../src/styles/index.css');
    const css = fs.readFileSync(cssPath, 'utf-8');

    expect(css).toContain('::view-transition-old(root)');
    expect(css).toContain('::view-transition-new(root)');
    expect(css).toContain('object-fit: cover');
    expect(css).toContain('project-card-shepherd');
  });

  it('verifies src/styles/accessibility.css suppresses view transitions on prefers-reduced-motion', () => {
    const cssPath = path.resolve(__dirname, '../../src/styles/accessibility.css');
    const css = fs.readFileSync(cssPath, 'utf-8');

    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('::view-transition-group(*)');
    expect(css).toContain('animation: none !important');
  });
});
```

- [ ] **Step 2: Update `BentoGrid.tsx`, `ProjectsView.tsx`, `CaseStudyView.tsx`, `AppLayout.tsx`, and `index.css`**

- In `BentoGrid.tsx`:
  - Use `TransitionLink` for `/projects` and `/projects/${project.slug}` links.
  - Set `style={{ viewTransitionName: `project-card-${project.slug}` }}` on article cards.

- In `ProjectsView.tsx`:
  - Use `TransitionLink` for `/projects/${project.slug}` links.
  - Set `style={{ viewTransitionName: `project-card-${project.slug}` }}` on article cards.

- In `CaseStudyView.tsx`:
  - Use `TransitionLink` for `/projects` back navigation links.
  - Set `style={{ viewTransitionName: `project-card-${project.slug}` }}` on the `<header>` element.

- In `AppLayout.tsx`:
  - Update top navigation links (`NavLink` / brand logo) with `useViewTransitionNavigate` click handler.

- In `src/styles/index.css`:
  - Define full `project-card-*` pseudo-element selectors with `object-fit: cover`, `250ms cubic-bezier(0.2, 0, 1, 1)`.
  - Maintain root cross-fade `fade-out` (150ms) and `fade-in` (180ms).

- [ ] **Step 3: Run all tests to verify 100% pass rate**

Run: `npm test`
Expected: All test files passing.

- [ ] **Step 4: Run production build**

Run: `npm run build`
Expected: Clean build to `dist/`.

- [ ] **Step 5: Commit**

```bash
git add src/ components/ views/ styles/ tests/
git commit -m "feat(transitions): wire shared-element route morphs and root cross-fade transitions"
```

---

### Task 3: Documentation & Issue Closure

**Files:**
- Modify: `ISSUES.md`

- [ ] **Step 1: Update `ISSUES.md` marking Issue #5 as Closed**
- [ ] **Step 2: Close Issue #5 on GitHub via `gh issue close 5`**
- [ ] **Step 3: Commit**

```bash
git add ISSUES.md
git commit -m "docs(issues): close issue #5 with completed React SPA view transition engine"
```

