# ElevenLabs Editorial Monochrome Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the ElevenLabs-inspired Editorial Monochrome theme (Light Mode Only, strictly no status tag lines, strict layout invariance) across design tokens, global styles, and component views.

**Architecture:** Update CSS custom properties in `tokens.css` to match the warm ivory/obsidian ink palette, purge `.dark` class overrides to enforce single-mode light theme, clean up residual `dark:*` Tailwind classes from buttons/pills across all views, and ensure zero layout changes.

**Tech Stack:** React 18, TypeScript, Tailwind CSS 3.4, Vite, Vitest, Testing Library.

## Global Constraints

- **Theme Palette**: Base canvas `#f7f7f5`, surface `#ffffff`, surface-hover `#f0eee9`, border-subtle `#e8e6e1`, border-strong `#d0ccc4`, text-primary `#18181b`, text-secondary `#57534e`, text-muted `#78716c`, accent-solid `#18181b`, accent-badge-bg `#f0eee9`, accent-badge-text `#18181b`.
- **Light Mode Only**: Zero `.dark` overrides or dual-theme classes.
- **Strictly No Status Tag Line**: Hero and all views must contain zero status indicators or availability tag lines.
- **Strict Layout Invariance**: Zero modifications to DOM layout hierarchies, grid structures, flex containers, padding, margins, or view transition names.

---

### Task 1: Update Core Design Tokens and Base Theme CSS

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/index.css:9-17`
- Modify: `index.html:9`
- Create/Test: `tests/pipeline/design-tokens.test.ts`

**Interfaces:**
- Produces: Updated CSS custom properties (`--bg-canvas`, `--bg-surface`, `--bg-surface-hover`, `--border-subtle`, `--border-strong`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent-solid`, `--accent-badge-bg`, `--accent-badge-text`) in `:root` and removed `.dark` block.

- [ ] **Step 1: Write failing test for ElevenLabs design tokens**

Create `tests/pipeline/design-tokens.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('ElevenLabs Editorial Design Tokens', () => {
  const tokensPath = path.resolve(__dirname, '../../src/styles/tokens.css');
  const tokensContent = fs.readFileSync(tokensPath, 'utf-8');

  it('defines the warm ivory canvas and pure white surface', () => {
    expect(tokensContent).toContain('--bg-canvas: #f7f7f5;');
    expect(tokensContent).toContain('--bg-surface: #ffffff;');
    expect(tokensContent).toContain('--bg-surface-hover: #f0eee9;');
  });

  it('defines warm hairline borders and high-contrast ink typography', () => {
    expect(tokensContent).toContain('--border-subtle: #e8e6e1;');
    expect(tokensContent).toContain('--border-strong: #d0ccc4;');
    expect(tokensContent).toContain('--text-primary: #18181b;');
    expect(tokensContent).toContain('--text-secondary: #57534e;');
    expect(tokensContent).toContain('--text-muted: #78716c;');
  });

  it('defines monochromatic ink accents and neutral badge pills', () => {
    expect(tokensContent).toContain('--accent-solid: #18181b;');
    expect(tokensContent).toContain('--accent-badge-bg: #f0eee9;');
    expect(tokensContent).toContain('--accent-badge-text: #18181b;');
  });

  it('strictly contains no dark mode class overrides', () => {
    expect(tokensContent).not.toContain('.dark {');
    expect(tokensContent).not.toContain('--bg-canvas: #09090b;');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/pipeline/design-tokens.test.ts`
Expected: FAIL (tokens do not match new values).

- [ ] **Step 3: Implement ElevenLabs design tokens in `tokens.css`, `index.css`, and `index.html`**

Update `src/styles/tokens.css`:
```css
:root {
  /* ElevenLabs Editorial Light Palette */
  --bg-canvas: #f7f7f5;
  --bg-surface: #ffffff;
  --bg-surface-hover: #f0eee9;
  --border-subtle: #e8e6e1;
  --border-strong: #d0ccc4;
  --text-primary: #18181b;
  --text-secondary: #57534e;
  --text-muted: #78716c;
  --accent-solid: #18181b;
  --accent-badge-bg: #f0eee9;
  --accent-badge-text: #18181b;
}
```

Update `src/styles/index.css` (lines 9-17):
```css
body {
  background-color: var(--bg-canvas, #f7f7f5);
  color: var(--text-primary, #18181b);
  font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

Update `index.html` (line 9):
```html
    <meta name="theme-color" content="#f7f7f5" />
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/pipeline/design-tokens.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/pipeline/design-tokens.test.ts src/styles/tokens.css src/styles/index.css index.html
git commit -m "style: update design tokens to ElevenLabs editorial light theme"
```

---

### Task 2: Clean up Dark Mode Classes and Enforce Monochromatic Buttons Across Views

**Files:**
- Modify: `src/components/home/HeroNarrative.tsx:120-126`
- Modify: `src/views/HomeView.tsx:83-89`
- Modify: `src/views/ProjectsView.tsx:89-106`
- Modify: `src/views/CaseStudyView.tsx:63-69`
- Test: `tests/views/HomeView.test.tsx`, `tests/views/ProjectsView.test.tsx`, `tests/views/CaseStudyView.test.tsx`

**Interfaces:**
- Consumes: `--accent-solid`, `--accent-badge-bg`, `--accent-badge-text`, `--bg-surface`, `--bg-canvas` from `tokens.css`.
- Produces: Cleaned component classes without `dark:*` fragments and verified absence of status tag lines.

- [ ] **Step 1: Check existing view tests to verify current pass state**

Run: `npx vitest run tests/views/HomeView.test.tsx tests/views/ProjectsView.test.tsx tests/views/CaseStudyView.test.tsx`
Expected: PASS.

- [ ] **Step 2: Update `HeroNarrative.tsx` to remove `dark:text-zinc-950` on button and verify no status tag line**

In `src/components/home/HeroNarrative.tsx` (around line 122):
Replace:
```tsx
            <TransitionLink
              to="/projects"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-md bg-accent-solid text-white dark:text-zinc-950 hover:bg-opacity-90 active:scale-[0.99] transition-all focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas shadow-sm"
            >
```
With:
```tsx
            <TransitionLink
              to="/projects"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-md bg-accent-solid text-white hover:bg-neutral-800 active:scale-[0.99] transition-all focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas shadow-sm"
            >
```

- [ ] **Step 3: Update `HomeView.tsx` to remove `dark:text-zinc-950`**

In `src/views/HomeView.tsx` (around line 85):
Replace:
```tsx
            <TransitionLink
              to="/experience"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-md bg-accent-solid text-white dark:text-zinc-950 hover:bg-opacity-90 active:scale-[0.99] transition-all focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
```
With:
```tsx
            <TransitionLink
              to="/experience"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-md bg-accent-solid text-white hover:bg-neutral-800 active:scale-[0.99] transition-all focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
```

- [ ] **Step 4: Update `ProjectsView.tsx` to clean up filter button classes**

In `src/views/ProjectsView.tsx` (around lines 90-103):
Replace:
```tsx
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-md text-xs font-mono font-semibold transition-all duration-150 border focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
                    isSelected
                      ? 'bg-accent-solid text-white dark:text-zinc-950 border-accent-solid font-bold'
                      : 'bg-surface text-text-secondary border-border-subtle hover:text-text-primary hover:bg-surface-hover hover:border-border-strong'
                  }`}
                >
                  <span>{category.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isSelected
                        ? 'bg-white dark:bg-zinc-950 text-accent-solid'
                        : 'bg-canvas text-text-muted border border-border-subtle'
                    }`}
                  >
```
With:
```tsx
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-md text-xs font-mono font-semibold transition-all duration-150 border focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
                    isSelected
                      ? 'bg-accent-solid text-white border-accent-solid font-bold'
                      : 'bg-surface text-text-secondary border-border-subtle hover:text-text-primary hover:bg-surface-hover hover:border-border-strong'
                  }`}
                >
                  <span>{category.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isSelected
                        ? 'bg-white text-accent-solid'
                        : 'bg-canvas text-text-muted border border-border-subtle'
                    }`}
                  >
```

- [ ] **Step 5: Update `CaseStudyView.tsx` to clean up back button classes**

In `src/views/CaseStudyView.tsx` (around line 65):
Replace:
```tsx
          <TransitionLink
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-accent-solid text-white dark:text-zinc-950 text-sm font-semibold hover:bg-opacity-90 active:scale-[0.99] transition-all focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas shadow-sm"
          >
```
With:
```tsx
          <TransitionLink
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-accent-solid text-white text-sm font-semibold hover:bg-neutral-800 active:scale-[0.99] transition-all focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas shadow-sm"
          >
```

- [ ] **Step 6: Run view tests to verify clean execution**

Run: `npx vitest run tests/views/HomeView.test.tsx tests/views/ProjectsView.test.tsx tests/views/CaseStudyView.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/home/HeroNarrative.tsx src/views/HomeView.tsx src/views/ProjectsView.tsx src/views/CaseStudyView.tsx
git commit -m "refactor: remove residual dark mode classes and harmonize monochromatic button styles"
```

---

### Task 3: Update Design Documentation and Verify Full Suite

**Files:**
- Modify: `DESIGN.md`

- [ ] **Step 1: Update `DESIGN.md` with ElevenLabs Editorial design tokens & layout invariance rule**

In `DESIGN.md`:
- Update §1 (North Star & Core Philosophy) to document the ElevenLabs Editorial single-theme light mode, monochromatic ink actions, strict layout invariance, and zero status tag line rule.
- Update §2.1 (Color Palette & Theme Tokens) with the `#f7f7f5` warm ivory palette table.

- [ ] **Step 2: Run entire test suite**

Run: `npm test`
Expected: 19 test files passed (115+ tests), 0 failures.

- [ ] **Step 3: Run full TypeScript and Vite production build**

Run: `npm run build`
Expected: Clean compilation with 0 TypeScript or bundling errors.

- [ ] **Step 4: Commit**

```bash
git add DESIGN.md
git commit -m "docs: update DESIGN.md with ElevenLabs editorial theme specifications"
```
