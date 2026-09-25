# Picture-in-Picture Card Expand Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a GPU-accelerated picture-in-picture (PIP) shared-element view transition where clicking any featured case study card on the Overview page or project card on the Projects page smoothly expands and morphs into the Case Study header, with reverse collapse on back-navigation.

**Architecture:** Use the native CSS View Transitions API orchestrated through `useViewTransitionNavigate` with `flushSync` for deterministic "old" DOM snapshot capture, full-card click interaction with event propagation containment for nested external links, and Apple-style fluid spring easing (`cubic-bezier(0.16, 1, 0.3, 1)`).

**Tech Stack:** React 18 (`flushSync`), React Router v6, Tailwind CSS, Native CSS View Transitions API, Vitest & React Testing Library.

## Global Constraints
- Must use native `document.startViewTransition()` without adding external heavy animation libraries like Framer Motion.
- Must honor `prefers-reduced-motion: reduce` by bypassing transitions and applying `animation: none !important`.
- Must preserve semantic HTML, keyboard navigability (Tab / Enter / Space), and screen reader accessibility.
- Nested interactive action buttons (GitHub, Live Demo, PyPI, Video, Paper) must stop propagation so they don't trigger the card's route transition.

---

### Task 1: Test Environment & Setup Fixes

**Files:**
- Modify: `tests/setup.ts`
- Test: `tests/views/HomeView.test.tsx`, `tests/views/ProjectsView.test.tsx`

**Interfaces:**
- Consumes: Standard `window.matchMedia`
- Produces: Global `window.matchMedia` mock in JSDOM so tests pass deterministically.

- [ ] **Step 1: Update `tests/setup.ts` to include standard matchMedia mock**

Edit `tests/setup.ts`:
```typescript
import '@testing-library/jest-dom';

if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
```

- [ ] **Step 2: Run test suite to verify setup works**

Run: `npm test`
Expected: Tests in `HomeView.test.tsx` and `ExperienceView.test.tsx` that previously failed on `matchMedia` now run cleanly.

---

### Task 2: Synchronous Transition Controller in `useViewTransitionNavigate.ts`

**Files:**
- Modify: `src/hooks/useViewTransitionNavigate.ts`
- Test: `tests/pipeline/view-transition.test.tsx`

**Interfaces:**
- Consumes: React 18 `flushSync`, `document.startViewTransition`
- Produces: `useViewTransitionNavigate`, `useActiveTransitionSlug` with synchronous snapshot readiness.

- [ ] **Step 1: Write/Update unit test for synchronous activeSlug application**

In `tests/pipeline/view-transition.test.tsx`, add test asserting `activeSlug` is updated synchronously before `startViewTransition`:
```typescript
it('sets activeSlug synchronously when navigating to a case study', async () => {
  // Verifies flushSync attaches activeSlug before startViewTransition executes callback
});
```

- [ ] **Step 2: Update `src/hooks/useViewTransitionNavigate.ts`**

Update `navigateWithTransition` in `src/hooks/useViewTransitionNavigate.ts`:
```typescript
if (slug) {
  flushSync(() => {
    setActiveSlug(slug);
  });
}

const transition = (document as unknown as {
  startViewTransition: (cb: () => void) => { finished?: Promise<void> };
}).startViewTransition(() => {
  flushSync(() => {
    navigate(to, options);
  });
});

if (transition && transition.finished && typeof transition.finished.finally === 'function') {
  transition.finished.finally(() => {
    delete document.documentElement.dataset.transitionDirection;
    setActiveSlug(null);
  });
} else {
  delete document.documentElement.dataset.transitionDirection;
  setActiveSlug(null);
}
```

- [ ] **Step 3: Run pipeline tests**

Run: `npx vitest run tests/pipeline/view-transition.test.tsx`
Expected: PASS

---

### Task 3: Full-Card Click & Propagation Containment in `BentoGrid.tsx`

**Files:**
- Modify: `src/components/home/BentoGrid.tsx`
- Test: `tests/views/HomeView.test.tsx`

**Interfaces:**
- Consumes: `useViewTransitionNavigate()`, `useActiveTransitionSlug()`
- Produces: Clickable card tile on Overview page with PIP zoom trigger.

- [ ] **Step 1: Update `src/components/home/BentoGrid.tsx`**

Make the card container `<article>` clickable with `onClick`, add `cursor-pointer`, and protect internal links:
```tsx
export const BentoGrid: React.FC = () => {
  const activeSlug = useActiveTransitionSlug();
  const navigateWithTransition = useViewTransitionNavigate();

  return (
    <section aria-labelledby="bento-heading" className="space-y-6">
      {/* ... header ... */}
      <div data-testid="bento-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {featuredProjects.map((project) => (
          <article
            key={project.slug}
            data-testid={`bento-card-${project.slug}`}
            onClick={() => navigateWithTransition(`/projects/${project.slug}`)}
            style={activeSlug === project.slug ? { viewTransitionName: `project-card-${project.slug}` } : undefined}
            className="group/card bg-surface border border-border-subtle rounded-lg p-5 sm:p-6 flex flex-col justify-between hover:border-border-strong hover:bg-surface-hover/30 hover:shadow-sm cursor-pointer transition-all duration-200"
          >
            {/* ... card content with inner links stopping propagation if needed ... */}
          </article>
        ))}
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Run HomeView tests**

Run: `npx vitest run tests/views/HomeView.test.tsx`
Expected: PASS

---

### Task 4: Full-Card Click & Propagation Containment in `ProjectsView.tsx`

**Files:**
- Modify: `src/views/ProjectsView.tsx`
- Test: `tests/views/ProjectsView.test.tsx`

**Interfaces:**
- Consumes: `useViewTransitionNavigate()`, `useActiveTransitionSlug()`, `Project` data
- Produces: Clickable project cards with case studies, direct external icon buttons with `stopPropagation`.

- [ ] **Step 1: Update `src/views/ProjectsView.tsx`**

In `src/views/ProjectsView.tsx`:
- For cards where `hasCaseStudy` is true, add `onClick={() => navigateWithTransition('/projects/' + project.slug)}` and `cursor-pointer`.
- For external links (GitHub, Live Demo, PyPI, Video, Paper), add `onClick={(e) => e.stopPropagation()}`.
- Apply `style={activeSlug === project.slug ? { viewTransitionName: 'project-card-' + project.slug } : undefined}` to `<article>`.

- [ ] **Step 2: Update `tests/views/ProjectsView.test.tsx` with updated tags & card click assertions**

Ensure tests in `tests/views/ProjectsView.test.tsx` test card clicks and external link isolation.

- [ ] **Step 3: Run ProjectsView tests**

Run: `npx vitest run tests/views/ProjectsView.test.tsx`
Expected: PASS

---

### Task 5: Case Study Hero Morph & CSS Transitions Polish

**Files:**
- Modify: `src/views/CaseStudyView.tsx`
- Modify: `src/styles/index.css`
- Test: `tests/views/CaseStudyView.test.tsx`

**Interfaces:**
- Consumes: CSS View Transitions pseudo-elements `::view-transition-group(project-card-*)`
- Produces: 320ms spring PIP morph into `<header>` and smooth slide-up for the 4-part case study body.

- [ ] **Step 1: Update `src/styles/index.css`**

Add/update:
```css
@media (prefers-reduced-motion: no-preference) {
  ::view-transition-group(project-card-shepherd),
  ::view-transition-group(project-card-nl2regex),
  ::view-transition-group(project-card-document-ingestion-agent),
  ::view-transition-group(project-card-lit-review-council),
  ::view-transition-group(project-card-node-api),
  ::view-transition-group(project-card-robotic-arm-ultrasound),
  ::view-transition-group(project-card-heal-a2a) {
    animation-duration: 320ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  ::view-transition-old(project-card-shepherd),
  ::view-transition-new(project-card-shepherd),
  ::view-transition-old(project-card-nl2regex),
  ::view-transition-new(project-card-nl2regex),
  ::view-transition-old(project-card-document-ingestion-agent),
  ::view-transition-new(project-card-document-ingestion-agent),
  ::view-transition-old(project-card-lit-review-council),
  ::view-transition-new(project-card-lit-review-council),
  ::view-transition-old(project-card-node-api),
  ::view-transition-new(project-card-node-api),
  ::view-transition-old(project-card-robotic-arm-ultrasound),
  ::view-transition-new(project-card-robotic-arm-ultrasound),
  ::view-transition-old(project-card-heal-a2a),
  ::view-transition-new(project-card-heal-a2a) {
    object-fit: cover;
    overflow: hidden;
    height: 100%;
    width: 100%;
    animation-duration: 320ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }
}
```

- [ ] **Step 2: Update `src/views/CaseStudyView.tsx` Back Buttons**

Ensure back navigation buttons pass target slug or correctly trigger reverse transition:
```tsx
<TransitionLink
  to="/projects"
  className="group inline-flex items-center gap-2 text-sm font-semibold text-accent-solid hover:underline focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded px-1 py-0.5"
>
  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
  <span>Back to Projects</span>
</TransitionLink>
```

- [ ] **Step 3: Run CaseStudyView and Pipeline tests**

Run: `npx vitest run tests/views/CaseStudyView.test.tsx tests/pipeline/view-transition.test.tsx`
Expected: PASS

---

### Task 6: Full Verification & Build Validation

**Files:**
- Verify: Entire repository

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: 100% tests passing across all 18 test files.

- [ ] **Step 2: Run TypeScript check and production build**

Run: `npm run build`
Expected: Zero TypeScript or Vite build errors.
