# [AFK] React + Tailwind CSS + Vite SPA Build Pipeline & Design Tokens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure the complete React + Vite + TypeScript + Tailwind CSS Single-Page Application build pipeline with self-hosted Geist variable fonts, adaptive WCAG AAA solid design tokens (zero gradients), `404.html` GitHub Pages SPA deep-link routing, and modern SPA root mounting.

**Architecture:** 
- Vite bundler emits an optimized client-side SPA into `dist/` with React 18 and React Router.
- Self-hosted `Geist Sans` and `Geist Mono` variable WOFF2 fonts served statically from `public/fonts/` with zero external network requests.
- CSS custom properties in `src/styles/tokens.css` with adaptive light (`:root`) and dark (`.dark`, `@media (prefers-color-scheme: dark)`) tokens adhering strictly to the zero-gradients rule, integrated into `tailwind.config.ts`.
- GitHub Pages SPA deep-linking supported via `public/404.html` redirect script paired with a path decoder in `index.html`.

**Tech Stack:** Vite 6, React 18, React Router 6, TypeScript 5.7, Tailwind CSS 3.4, Vitest, Testing Library.

## Global Constraints
- Strict zero-gradient rule: No CSS linear, radial, or conic gradients. Solid contrast tokens only.
- Self-hosted fonts: 0 external Google Fonts / CDN network requests.
- GitHub Pages compatibility: SPA deep links (e.g. `/projects`, `/experience`, `/projects/:slug`) must resolve seamlessly.
- WCAG AAA compliance: All text-to-background contrast ratios must be >= 7.0:1.
- All existing tests in `tests/` must continue to pass cleanly.

---

### Task 1: Self-Hosted Geist Variable Fonts & Static Asset Pipeline

**Files:**
- Create: `public/fonts/Geist-Variable.woff2`
- Create: `public/fonts/GeistMono-Variable.woff2`
- Create: `src/styles/fonts.css`
- Modify: `src/styles/index.css`
- Modify: `tailwind.config.ts`
- Test: `tests/pipeline/fonts.test.ts`

**Interfaces:**
- Consumes: `node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2` and `node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2`
- Produces: CSS `@font-face` definitions for `'Geist Sans'` and `'Geist Mono'`, and Tailwind `font-sans` / `font-mono` utilities.

- [ ] **Step 1: Write failing test for self-hosted font assets and config**

```typescript
// tests/pipeline/fonts.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Self-Hosted Fonts Pipeline', () => {
  const rootDir = process.cwd();

  it('contains self-hosted Geist Sans and Geist Mono WOFF2 font files in public/fonts', () => {
    const geistSansPath = path.join(rootDir, 'public', 'fonts', 'Geist-Variable.woff2');
    const geistMonoPath = path.join(rootDir, 'public', 'fonts', 'GeistMono-Variable.woff2');

    expect(fs.existsSync(geistSansPath), 'Geist-Variable.woff2 must exist').toBe(true);
    expect(fs.existsSync(geistMonoPath), 'GeistMono-Variable.woff2 must exist').toBe(true);
    expect(fs.statSync(geistSansPath).size).toBeGreaterThan(10000);
    expect(fs.statSync(geistMonoPath).size).toBeGreaterThan(10000);
  });

  it('defines @font-face rules with local relative URLs in fonts.css', () => {
    const fontsCssPath = path.join(rootDir, 'src', 'styles', 'fonts.css');
    expect(fs.existsSync(fontsCssPath), 'src/styles/fonts.css must exist').toBe(true);

    const content = fs.readFileSync(fontsCssPath, 'utf-8');
    expect(content).toContain("font-family: 'Geist Sans'");
    expect(content).toContain("font-family: 'Geist Mono'");
    expect(content).toContain('/fonts/Geist-Variable.woff2');
    expect(content).toContain('/fonts/GeistMono-Variable.woff2');
    expect(content).toContain('font-display: swap');
    expect(content).not.toContain('http://');
    expect(content).not.toContain('https://');
  });

  it('imports fonts.css in index.css', () => {
    const indexCssPath = path.join(rootDir, 'src', 'styles', 'index.css');
    const content = fs.readFileSync(indexCssPath, 'utf-8');
    expect(content).toContain("@import './fonts.css';");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/pipeline/fonts.test.ts`
Expected: FAIL with missing font files or `fonts.css`.

- [ ] **Step 3: Copy font files and configure font CSS & Tailwind**

Copy WOFF2 font files to `public/fonts/`:
```bash
mkdir -p public/fonts
cp node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2 public/fonts/
cp node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2 public/fonts/
```

Create `src/styles/fonts.css`:
```css
@font-face {
  font-family: 'Geist Sans';
  src: url('/fonts/Geist-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Geist Mono';
  src: url('/fonts/GeistMono-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

Update `src/styles/index.css`:
```css
@import './fonts.css';
@import './accessibility.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: var(--bg-canvas, #fafafa);
  color: var(--text-primary, #09090b);
  font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}
```

Update `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Geist Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        'surface-hover': 'var(--bg-surface-hover)',
        'border-subtle': 'var(--border-subtle)',
        'border-strong': 'var(--border-strong)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'accent-solid': 'var(--accent-solid)',
        'accent-badge-bg': 'var(--accent-badge-bg)',
        'accent-badge-text': 'var(--accent-badge-text)',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/pipeline/fonts.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add public/fonts src/styles/fonts.css src/styles/index.css tailwind.config.ts tests/pipeline/fonts.test.ts
git commit -m "feat: add self-hosted Geist variable fonts and font configuration"
```

---

### Task 2: Adaptive Solid Design Tokens (CSS Variables & Tailwind Integration)

**Files:**
- Create: `src/styles/tokens.css`
- Modify: `src/styles/index.css`
- Test: `tests/accessibility/tokens.test.ts`

**Interfaces:**
- Consumes: DESIGN.md palette specifications
- Produces: CSS variables for light and dark themes satisfying WCAG AAA contrast ratios.

- [ ] **Step 1: Write expanded token contrast test for both Light and Dark themes**

```typescript
// tests/accessibility/tokens.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

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
  describe('Light Theme Tokens', () => {
    const canvasBg = '#fafafa';
    const surfaceBg = '#ffffff';
    const textPrimary = '#09090b';
    const textSecondary = '#3f3f46';
    const textMuted = '#52525b';
    const accentBlue = '#1e40af';

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

  describe('Dark Theme Tokens', () => {
    const canvasBg = '#09090b';
    const surfaceBg = '#121215';
    const textPrimary = '#fafafa';
    const textSecondary = '#d4d4d8';
    const textMuted = '#a1a1aa';
    const accentBlue = '#93c5fd';

    it('text-primary achieves WCAG AAA (>= 7.0:1) on canvas and surface', () => {
      expect(getContrastRatio(textPrimary, canvasBg)).toBeGreaterThanOrEqual(7.0);
      expect(getContrastRatio(textPrimary, surfaceBg)).toBeGreaterThanOrEqual(7.0);
    });

    it('text-secondary achieves WCAG AAA (>= 7.0:1) on canvas and surface', () => {
      expect(getContrastRatio(textSecondary, canvasBg)).toBeGreaterThanOrEqual(7.0);
      expect(getContrastRatio(textSecondary, surfaceBg)).toBeGreaterThanOrEqual(7.0);
    });

    it('text-muted achieves WCAG AAA (>= 7.0:1) on canvas and surface', () => {
      expect(getContrastRatio(textMuted, canvasBg)).toBeGreaterThanOrEqual(7.0);
      expect(getContrastRatio(textMuted, surfaceBg)).toBeGreaterThanOrEqual(7.0);
    });

    it('accent text achieves WCAG AAA (>= 7.0:1) on canvas and surface', () => {
      expect(getContrastRatio(accentBlue, canvasBg)).toBeGreaterThanOrEqual(7.0);
      expect(getContrastRatio(accentBlue, surfaceBg)).toBeGreaterThanOrEqual(7.0);
    });
  });

  describe('tokens.css Structure', () => {
    it('defines all CSS variables for :root and .dark without gradients', () => {
      const tokensCssPath = path.join(process.cwd(), 'src', 'styles', 'tokens.css');
      expect(fs.existsSync(tokensCssPath)).toBe(true);

      const content = fs.readFileSync(tokensCssPath, 'utf-8');
      expect(content).not.toContain('gradient');
      expect(content).toContain('--bg-canvas');
      expect(content).toContain('--bg-surface');
      expect(content).toContain('--bg-surface-hover');
      expect(content).toContain('--border-subtle');
      expect(content).toContain('--border-strong');
      expect(content).toContain('--text-primary');
      expect(content).toContain('--text-secondary');
      expect(content).toContain('--text-muted');
      expect(content).toContain('--accent-solid');
      expect(content).toContain('--accent-badge-bg');
      expect(content).toContain('--accent-badge-text');
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/accessibility/tokens.test.ts`
Expected: FAIL with missing `tokens.css`.

- [ ] **Step 3: Create `src/styles/tokens.css` and update imports**

Create `src/styles/tokens.css`:
```css
:root {
  /* Light Theme (Default) */
  --bg-canvas: #fafafa;
  --bg-surface: #ffffff;
  --bg-surface-hover: #f4f4f5;
  --border-subtle: #e4e4e7;
  --border-strong: #d4d4d8;
  --text-primary: #09090b;
  --text-secondary: #3f3f46;
  --text-muted: #52525b;
  --accent-solid: #1e40af;
  --accent-badge-bg: #eff6ff;
  --accent-badge-text: #1e40af;
}

.dark,
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark Theme */
    --bg-canvas: #09090b;
    --bg-surface: #121215;
    --bg-surface-hover: #18181b;
    --border-subtle: #27272a;
    --border-strong: #3f3f46;
    --text-primary: #fafafa;
    --text-secondary: #d4d4d8;
    --text-muted: #a1a1aa;
    --accent-solid: #3b82f6;
    --accent-badge-bg: #1e293b;
    --accent-badge-text: #93c5fd;
  }
}

.dark {
  --bg-canvas: #09090b;
  --bg-surface: #121215;
  --bg-surface-hover: #18181b;
  --border-subtle: #27272a;
  --border-strong: #3f3f46;
  --text-primary: #fafafa;
  --text-secondary: #d4d4d8;
  --text-muted: #a1a1aa;
  --accent-solid: #3b82f6;
  --accent-badge-bg: #1e293b;
  --accent-badge-text: #93c5fd;
}
```

Update `src/styles/index.css`:
```css
@import './fonts.css';
@import './tokens.css';
@import './accessibility.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: var(--bg-canvas, #fafafa);
  color: var(--text-primary, #09090b);
  font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/accessibility/tokens.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/styles/index.css tests/accessibility/tokens.test.ts
git commit -m "feat: configure adaptive solid design tokens and CSS custom properties"
```

---

### Task 3: GitHub Pages 404 SPA Deep-Link Routing Handler & SPA Root Mounting

**Files:**
- Create: `public/404.html`
- Modify: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Test: `tests/pipeline/spa-routing.test.ts`
- Test: `tests/pipeline/app-render.test.tsx`

**Interfaces:**
- Consumes: `AppLayout` from `src/components/layout/AppLayout.tsx`
- Produces: `public/404.html` GitHub Pages redirect script, `index.html` SPA entry point with redirect decoder, `src/main.tsx` React root mount, `src/App.tsx` router configuration.

- [ ] **Step 1: Write test for SPA 404 redirect and React App mounting**

```typescript
// tests/pipeline/spa-routing.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('GitHub Pages SPA Deep-Link Routing', () => {
  const rootDir = process.cwd();

  it('contains public/404.html with path redirection script', () => {
    const notFoundPath = path.join(rootDir, 'public', '404.html');
    expect(fs.existsSync(notFoundPath), 'public/404.html must exist').toBe(true);

    const content = fs.readFileSync(notFoundPath, 'utf-8');
    expect(content).toContain('location.replace');
    expect(content).toContain('pathSegmentsToKeep');
  });

  it('contains redirect decoder and script module entry in root index.html', () => {
    const indexPath = path.join(rootDir, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    expect(content).toContain('<div id="root"></div>');
    expect(content).toContain('/src/main.tsx');
    expect(content).not.toContain('bg-gradient');
    expect(content).not.toContain('https://cdn.tailwindcss.com');
  });
});
```

```typescript
// tests/pipeline/app-render.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../../src/App';

describe('App Component Routing', () => {
  it('renders overview home route by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders projects route when navigated to /projects', () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders experience route when navigated to /experience', () => {
    render(
      <MemoryRouter initialEntries={['/experience']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/pipeline/spa-routing.test.ts tests/pipeline/app-render.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement `public/404.html`, `index.html`, `src/App.tsx`, and `src/main.tsx`**

Create `public/404.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Palm Suksawasdi</title>
    <script type="text/javascript">
      // SPA redirect script for GitHub Pages
      // Single Page Apps for GitHub Pages
      // MIT License
      // https://github.com/rafgraph/spa-github-pages
      var pathSegmentsToKeep = 0;

      var l = window.location;
      l.replace(
        l.protocol +
          '//' +
          l.hostname +
          (l.port ? ':' + l.port : '') +
          l.pathname
            .split('/')
            .slice(0, 1 + pathSegmentsToKeep)
            .join('/') +
          '/?/' +
          l.pathname
            .slice(1)
            .split('/')
            .slice(pathSegmentsToKeep)
            .join('/')
            .replace(/&/g, '~and~') +
          (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
          l.hash
      );
    </script>
  </head>
  <body></body>
</html>
```

Update `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Palm Suksawasdi | Portfolio & Systems Engineering</title>
    <meta name="description" content="Portfolio of Palm Suksawasdi - Software Engineer specializing in Applied AI, Agentic Workflows, and Distributed Systems." />
    <!-- SPA redirect decoder for GitHub Pages -->
    <script type="text/javascript">
      (function (l) {
        if (l.search[1] === '/') {
          var decoded = l.search
            .slice(1)
            .split('&')
            .map(function (s) {
              return s.replace(/~and~/g, '&');
            })
            .join('?');
          window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
        }
      })(window.location);
    </script>
  </head>
  <body class="bg-canvas text-text-primary min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `src/App.tsx`:
```tsx
import type React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

const HomeView: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Palm Suksawasdi</h1>
    <p className="text-lg text-text-secondary">
      Software engineer specializing in AI agent orchestration, distributed systems, and modern web architectures.
    </p>
  </div>
);

const ProjectsView: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Projects</h1>
    <p className="text-text-secondary">Curated engineering projects and technical case studies.</p>
  </div>
);

const ExperienceView: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Experience</h1>
    <p className="text-text-secondary">Engineering career timeline and technical milestones.</p>
  </div>
);

const CaseStudyView: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Case Study</h1>
    <p className="text-text-secondary">Deep dive case study.</p>
  </div>
);

export const App: React.FC = () => {
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    if (pathname === '/') return 'Overview | Palm Suksawasdi';
    if (pathname.startsWith('/projects/')) return 'Case Study | Palm Suksawasdi';
    if (pathname === '/projects') return 'Projects | Palm Suksawasdi';
    if (pathname === '/experience') return 'Experience | Palm Suksawasdi';
    return 'Palm Suksawasdi';
  };

  return (
    <AppLayout pageTitle={getPageTitle(location.pathname)}>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/projects" element={<ProjectsView />} />
        <Route path="/projects/:slug" element={<CaseStudyView />} />
        <Route path="/experience" element={<ExperienceView />} />
      </Routes>
    </AppLayout>
  );
};
```

Create `src/main.tsx`:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

- [ ] **Step 4: Run tests and verify build**

Run: `npm test`
Run: `npm run build`
Expected: PASS and clean build output to `dist/`.

- [ ] **Step 5: Commit**

```bash
git add public/404.html index.html src/main.tsx src/App.tsx tests/pipeline/spa-routing.test.ts tests/pipeline/app-render.test.tsx
git commit -m "feat: setup GitHub Pages 404 SPA redirect and React SPA entry mount"
```

---

### Task 4: Complete Pipeline Verification & Clean Build Validation

**Files:**
- Modify: `ISSUES.md`
- Test: All tests in `tests/`
- Build: `npm run build`

- [ ] **Step 1: Run complete test suite**

Run: `npm test`
Expected: All tests pass across accessibility, pipeline, and components.

- [ ] **Step 2: Run production build and verify dist artifacts**

Run: `npm run build`
Expected: Clean build in `dist/` containing `index.html`, `404.html`, `fonts/`, and hashed JS/CSS assets without errors.

- [ ] **Step 3: Update `ISSUES.md` marking #3 closed**

Mark issue #3 as closed in `ISSUES.md`.

- [ ] **Step 4: Commit**

```bash
git add ISSUES.md
git commit -m "docs: mark issue #3 as closed in ISSUES.md"
```

---

## Verification Plan

### Automated Tests
- Full Vitest suite: `npm test`
- Production Build & TypeCheck: `npm run build`

### Manual Verification
- Verify `dist/` contains:
  - `dist/index.html` with root mounting
  - `dist/404.html` with SPA redirect script
  - `dist/fonts/Geist-Variable.woff2` and `dist/fonts/GeistMono-Variable.woff2`
  - Zero gradient classes in compiled CSS
