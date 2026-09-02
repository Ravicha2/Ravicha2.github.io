# Human Accessibility Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a complete, zero-dependency accessibility subsystem conforming to WCAG 2.2 AAA standards with semantic HTML5 landmarks, high-contrast solid tokens, keyboard focus management, live route announcements, and motion suppression.

**Architecture:** A modular accessibility system in `src/accessibility/` with reusable React primitives (`SkipLink`, `RouteAnnouncer`, `useReducedMotion`), a semantic layout wrapper (`AppLayout`), global CSS motion suppression & focus ring rules in `src/styles/accessibility.css`, and WCAG AAA color contrast tokens in Tailwind CSS.

**Tech Stack:** React 18/19, TypeScript, Tailwind CSS, Vite, Vitest, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`.

## Global Constraints

- Design Aesthetic: High-contrast Light Mode (Porcelain `#fafafa` canvas, `#ffffff` surface, `#09090b` text primary, zero gradients).
- Contrast Standard: Strict WCAG AAA compliance ($\ge 7.0:1$ for body/normal text, $\ge 4.5:1$ for large text).
- Focus Appearance: Visible 2px focus ring (`focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2`) only on keyboard navigation.
- Motion Control: Full suppression of transitions and View Transitions under `@media (prefers-reduced-motion: reduce)`.
- Live Regions: Screen reader route change announcements via `aria-live="polite"` with automatic focus shift to `<main id="main-content">`.

---

### Task 1: Environment Scaffolding & Test Harness Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`

**Interfaces:**
- Consumes: Node.js / npm environment
- Produces: Working test harness (`npm test`) and TypeScript compilation pipeline

- [ ] **Step 1: Create `package.json` with dependencies**

```json
{
  "name": "ravicha-portfolio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^1.16.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^22.10.2",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2",
    "vite": "^6.0.3",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create TypeScript and Vite/Vitest configs**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "tests"]
}
```

`vite.config.ts`:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
```

`tests/setup.ts`:
```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 3: Install dependencies and verify test runner**

Run: `npm install && npm test`
Expected: Passes with 0 test files (or empty test run)

- [ ] **Step 4: Commit**

```bash
git add package.json tsconfig.json tsconfig.node.json vite.config.ts vitest.config.ts tests/setup.ts
git commit -m "build: scaffold react, typescript, tailwind and vitest test harness"
```

---

### Task 2: WCAG AAA Design Tokens & Global Accessibility Styles

**Files:**
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `src/styles/accessibility.css`
- Create: `src/styles/index.css`
- Test: `tests/accessibility/tokens.test.ts`

**Interfaces:**
- Consumes: Tailwind CSS compiler
- Produces: CSS utility classes and design tokens guaranteeing WCAG AAA contrast and motion suppression

- [ ] **Step 1: Write test verifying token contrast ratios**

`tests/accessibility/tokens.test.ts`:
```ts
import { describe, it, expect } from 'vitest';

// Relative luminance calculation per WCAG 2.1 specifications
function getLuminance(hex: string): number {
  const rgb = hex
    .replace('#', '')
    .match(/.{2}/g)!
    .map((x) => parseInt(x, 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

describe('WCAG AAA Color Contrast Tokens', () => {
  const canvasBg = '#fafafa';
  const surfaceBg = '#ffffff';

  const textPrimary = '#09090b';
  const textSecondary = '#3f3f46';
  const textMuted = '#52525b';
  const accentBlue = '#1d4ed8';

  it('text-primary achieves WCAG AAA (>= 7.0:1) on canvas and surface', () => {
    expect(getContrastRatio(textPrimary, canvasBg)).toBeGreaterThanOrEqual(7.0);
    expect(getContrastRatio(textPrimary, surfaceBg)).toBeGreaterThanOrEqual(7.0);
  });

  it('text-secondary achieves WCAG AAA (>= 7.0:1) on canvas and surface', () => {
    expect(getContrastRatio(textSecondary, canvasBg)).toBeGreaterThanOrEqual(7.0);
    expect(getContrastRatio(textSecondary, surfaceBg)).toBeGreaterThanOrEqual(7.0);
  });

  it('text-muted achieves WCAG AAA (>= 7.0:1) on canvas', () => {
    expect(getContrastRatio(textMuted, canvasBg)).toBeGreaterThanOrEqual(7.0);
  });

  it('accent action blue achieves WCAG AAA (>= 7.0:1) on canvas and surface', () => {
    expect(getContrastRatio(accentBlue, canvasBg)).toBeGreaterThanOrEqual(7.0);
    expect(getContrastRatio(accentBlue, surfaceBg)).toBeGreaterThanOrEqual(7.0);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest run tests/accessibility/tokens.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 3: Create `tailwind.config.ts`, `postcss.config.js`, `src/styles/accessibility.css`, and `src/styles/index.css`**

`tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#fafafa',
        surface: '#ffffff',
        'surface-hover': '#f4f4f5',
        'border-subtle': '#e4e4e7',
        'border-strong': '#d4d4d8',
        'text-primary': '#09090b',
        'text-secondary': '#3f3f46',
        'text-muted': '#52525b',
        'accent-solid': '#1d4ed8',
        'accent-badge-bg': '#eff6ff',
        'accent-badge-text': '#1d4ed8',
      },
    },
  },
  plugins: [],
};

export default config;
```

`postcss.config.js`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

`src/styles/accessibility.css`:
```css
/* Focus-visible utilities and Motion suppression */

:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #fafafa, 0 0 0 4px #1d4ed8;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

`src/styles/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import './accessibility.css';

body {
  background-color: #fafafa;
  color: #09090b;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts postcss.config.js src/styles/accessibility.css src/styles/index.css tests/accessibility/tokens.test.ts
git commit -m "feat: add WCAG AAA tokens and accessibility stylesheet"
```

---

### Task 3: `SkipLink` Component

**Files:**
- Create: `src/accessibility/SkipLink.tsx`
- Test: `tests/accessibility/SkipLink.test.tsx`

**Interfaces:**
- Consumes: None (renders skip link targeting `#main-content`)
- Produces: `<SkipLink />` React component

- [ ] **Step 1: Write the failing test**

`tests/accessibility/SkipLink.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkipLink } from '../../src/accessibility/SkipLink';

describe('SkipLink Component', () => {
  it('renders an accessible anchor pointing to #main-content', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('is visually hidden by default with sr-only class and visible on focus', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link.className).toContain('sr-only');
    expect(link.className).toContain('focus:not-sr-only');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/accessibility/SkipLink.test.tsx`
Expected: FAIL (Cannot find module `../../src/accessibility/SkipLink`)

- [ ] **Step 3: Implement `src/accessibility/SkipLink.tsx`**

`src/accessibility/SkipLink.tsx`:
```tsx
import React from 'react';

export interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  label = 'Skip to main content',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-zinc-900 focus:text-zinc-50 focus:border focus:border-zinc-700 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 focus:ring-offset-[#fafafa]"
    >
      {label}
    </a>
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/accessibility/SkipLink.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/accessibility/SkipLink.tsx tests/accessibility/SkipLink.test.tsx
git commit -m "feat: implement accessible SkipLink component"
```

---

### Task 4: `useReducedMotion` React Hook

**Files:**
- Create: `src/accessibility/useReducedMotion.ts`
- Test: `tests/accessibility/useReducedMotion.test.ts`

**Interfaces:**
- Consumes: `window.matchMedia('(prefers-reduced-motion: reduce)')`
- Produces: `useReducedMotion(): boolean`

- [ ] **Step 1: Write the failing test**

`tests/accessibility/useReducedMotion.test.ts`:
```ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useReducedMotion } from '../../src/accessibility/useReducedMotion';

describe('useReducedMotion Hook', () => {
  let listeners: Array<(event: { matches: boolean }) => void> = [];

  beforeEach(() => {
    listeners = [];
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? false : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn((event: string, callback: (e: { matches: boolean }) => void) => {
        if (event === 'change') listeners.push(callback);
      }),
      removeEventListener: vi.fn((event: string, callback: (e: { matches: boolean }) => void) => {
        listeners = listeners.filter((l) => l !== callback);
      }),
    })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false when prefers-reduced-motion is not set', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('reacts dynamically to changes in matchMedia', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      listeners.forEach((listener) => listener({ matches: true }));
    });

    expect(result.current).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/accessibility/useReducedMotion.test.ts`
Expected: FAIL (Cannot find module `../../src/accessibility/useReducedMotion`)

- [ ] **Step 3: Implement `src/accessibility/useReducedMotion.ts`**

`src/accessibility/useReducedMotion.ts`:
```ts
import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (event: MediaQueryListEvent | { matches: boolean }) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange as (e: Event) => void);
    return () => {
      mediaQuery.removeEventListener('change', handleChange as (e: Event) => void);
    };
  }, []);

  return prefersReducedMotion;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/accessibility/useReducedMotion.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/accessibility/useReducedMotion.ts tests/accessibility/useReducedMotion.test.ts
git commit -m "feat: implement useReducedMotion hook"
```

---

### Task 5: `RouteAnnouncer` Component

**Files:**
- Create: `src/accessibility/RouteAnnouncer.tsx`
- Test: `tests/accessibility/RouteAnnouncer.test.tsx`

**Interfaces:**
- Consumes: React Router `useLocation()`, `pageTitle: string`, `mainRef: React.RefObject<HTMLElement>`
- Produces: `<RouteAnnouncer />` polite live region with title sync & programmatic focus

- [ ] **Step 1: Write the failing test**

`tests/accessibility/RouteAnnouncer.test.tsx`:
```tsx
import React, { useRef } from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { RouteAnnouncer } from '../../src/accessibility/RouteAnnouncer';

function TestWrapper({ initialPath = '/', title = 'Overview' }: { initialPath?: string; title?: string }) {
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/accessibility/RouteAnnouncer.test.tsx`
Expected: FAIL (Cannot find module `../../src/accessibility/RouteAnnouncer`)

- [ ] **Step 3: Implement `src/accessibility/RouteAnnouncer.tsx`**

`src/accessibility/RouteAnnouncer.tsx`:
```tsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export interface RouteAnnouncerProps {
  pageTitle: string;
  mainRef: React.RefObject<HTMLElement | null>;
}

export const RouteAnnouncer: React.FC<RouteAnnouncerProps> = ({ pageTitle, mainRef }) => {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('');
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      document.title = `${pageTitle} | Palm Suksawasdi`;
      return;
    }

    document.title = `${pageTitle} | Palm Suksawasdi`;
    setAnnouncement(`Navigated to ${pageTitle}`);

    if (mainRef.current) {
      mainRef.current.focus({ preventScroll: true });
    }
  }, [location.pathname, pageTitle, mainRef]);

  return (
    <div
      id="route-announcer"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/accessibility/RouteAnnouncer.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/accessibility/RouteAnnouncer.tsx tests/accessibility/RouteAnnouncer.test.tsx
git commit -m "feat: implement RouteAnnouncer component with live region and focus management"
```

---

### Task 6: Semantic `AppLayout` Landmark Wrapper & Public Exports

**Files:**
- Create: `src/accessibility/index.ts`
- Create: `src/components/layout/AppLayout.tsx`
- Test: `tests/accessibility/AppLayout.test.tsx`

**Interfaces:**
- Consumes: `SkipLink`, `RouteAnnouncer`
- Produces: `<AppLayout />` providing full `<header>`, `<nav>`, `<main>`, `<footer>` landmark contract with `aria-current="page"`

- [ ] **Step 1: Write the failing test**

`tests/accessibility/AppLayout.test.tsx`:
```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { AppLayout } from '../../src/components/layout/AppLayout';

describe('AppLayout Landmark Hierarchy', () => {
  it('renders all required HTML5 landmarks', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
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
      <MemoryRouter initialEntries={['/projects']}>
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
      <MemoryRouter initialEntries={['/']}>
        <AppLayout pageTitle="Overview">
          <div>Overview Content</div>
        </AppLayout>
      </MemoryRouter>
    );

    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/accessibility/AppLayout.test.tsx`
Expected: FAIL (Cannot find module `../../src/components/layout/AppLayout`)

- [ ] **Step 3: Create `src/accessibility/index.ts` and `src/components/layout/AppLayout.tsx`**

`src/accessibility/index.ts`:
```ts
export * from './SkipLink';
export * from './RouteAnnouncer';
export * from './useReducedMotion';
```

`src/components/layout/AppLayout.tsx`:
```tsx
import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { SkipLink, RouteAnnouncer } from '../../accessibility';

export interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, pageTitle }) => {
  const mainRef = useRef<HTMLElement>(null);

  const navItems = [
    { to: '/', label: 'Overview' },
    { to: '/projects', label: 'Projects' },
    { to: '/experience', label: 'Experience' },
  ];

  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col antialiased">
      <SkipLink />
      <RouteAnnouncer pageTitle={pageTitle} mainRef={mainRef} />

      <header role="banner" className="sticky top-0 z-40 bg-canvas/80 backdrop-blur border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <NavLink
            to="/"
            className="font-medium tracking-tight text-text-primary hover:text-accent-solid focus-visible:ring-2 focus-visible:ring-accent-solid rounded px-1"
          >
            Palm Suksawasdi
          </NavLink>

          <nav role="navigation" aria-label="Main Navigation" className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid ${
                    isActive
                      ? 'bg-accent-badge-bg text-accent-badge-text font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        role="main"
        className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 outline-none"
      >
        {children}
      </main>

      <footer role="contentinfo" className="border-t border-border-subtle py-8 text-sm text-text-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Palm Suksawasdi. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Ravicha2"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary focus-visible:ring-2 focus-visible:ring-accent-solid rounded px-1"
              aria-label="Palm's GitHub profile (opens in a new tab)"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/ravicha-suksawasdi-na-ayuthaya"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary focus-visible:ring-2 focus-visible:ring-accent-solid rounded px-1"
              aria-label="Palm's LinkedIn profile (opens in a new tab)"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/accessibility/AppLayout.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Run complete test suite**

Run: `npm test`
Expected: All tests pass across the entire suite (11+ tests)

- [ ] **Step 6: Commit**

```bash
git add src/accessibility/index.ts src/components/layout/AppLayout.tsx tests/accessibility/AppLayout.test.tsx
git commit -m "feat: implement semantic AppLayout landmark wrapper"
```
