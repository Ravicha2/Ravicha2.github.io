# Design Specification: React SPA View Transition Engine (Route Morphs & Cross-Fade)

- **Date**: 2026-09-03
- **GitHub Issue**: [#5: [AFK] React SPA View Transition Engine (Route Morphs & Cross-Fade)](https://github.com/Ravicha2/Ravicha2.github.io/issues/5)
- **Status**: Approved

---

## 1. Overview & Objectives

This specification defines the client-side React Single-Page Application (SPA) View Transition architecture for Palm Suksawasdi's portfolio ([Ravicha2.github.io](https://ravicha2.github.io)).

The objective is to deliver a native app-like visual experience with sub-100ms perceived latency, high visual stability (zero layout stutter), and progressive enhancement:
1. **Tier 1 (Shared-Element Route Morphs)**: Smooth geometric expansion and retraction between project thumbnail cards (`/` and `/projects`) and case study hero headers (`/projects/:slug`) via matching CSS `view-transition-name`.
2. **Tier 2 (Seamless Root Cross-Fades)**: Clean, zero-jump root cross-fades when switching between top-level routes (`/`, `/projects`, `/experience`).
3. **Accessibility First (Reduced Motion)**: Complete motion suppression honoring `prefers-reduced-motion: reduce` across both JavaScript dispatch logic and CSS animation stylesheets.
4. **Resilient Fallback**: Instantaneous client navigation for browsers without native `document.startViewTransition()` support.

---

## 2. Architecture & Motion Hierarchy

```
                               ┌──────────────────────────────────────────────┐
                               │           User Navigation Trigger            │
                               └──────────────────────┬───────────────────────┘
                                                      │
                                           prefers-reduced-motion?
                                           ┌──────────┴──────────┐
                                      Yes  │                     │  No
                                           ▼                     ▼
                               ┌──────────────────────┐  ┌──────────────────────────────────────┐
                               │ Instantaneous Switch │  │ document.startViewTransition()       │
                               │ (Zero Animation)     │  │ (Hardware-Accelerated Compositor)    │
                               └──────────────────────┘  └──────────────────┬───────────────────┘
                                                                            │
                                                        ┌───────────────────┴───────────────────┐
                                                        │                                       │
                                           Tier 1: Shared Element                  Tier 2: Root Cross-Fade
                                           (view-transition-name match)            (Route Switches)
                                                        │                                       │
                                                        ▼                                       ▼
                                           ┌────────────────────────┐              ┌────────────────────────┐
                                           │ project-card-${slug}   │              │ ::view-transition-old  │
                                           │ object-fit: cover      │              │ (root) 150ms fade-out  │
                                           │ 250ms cubic-bezier     │              │ ::view-transition-new  │
                                           │ geometry morph         │              │ (root) 180ms fade-in   │
                                           └────────────────────────┘              └────────────────────────┘
```

---

## 3. Detailed Technical Specifications

### 3.1 Client-Side Navigation Hook & Helper (`useViewTransitionNavigate` & `TransitionLink`)

1. **`useViewTransitionNavigate` Hook (`src/hooks/useViewTransitionNavigate.ts`)**:
   - Wraps React Router's `navigate(to, options)` inside `document.startViewTransition(callback)`.
   - Actively checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
   - If reduced motion is requested or `document.startViewTransition` is unavailable, executes direct `navigate(to, options)` synchronously.
   - Handles server/test environments cleanly (`typeof window !== 'undefined'` and `typeof document !== 'undefined'`).

2. **`TransitionLink` Component (`src/components/common/TransitionLink.tsx`)**:
   - Reusable accessible wrapper around `react-router-dom`'s `<Link>`.
   - Intercepts primary left-clicks (without modifier keys `Cmd`, `Ctrl`, `Alt`, `Shift` and without `target="_blank"`) to invoke `useViewTransitionNavigate`.
   - Preserves custom `onClick` handlers and standard accessibility attributes (`aria-*`, `focus-visible`).

### 3.2 Shared-Element `view-transition-name` Matching (Tier 1)

1. **Project Card Containers (`BentoGrid.tsx` & `ProjectsView.tsx`)**:
   - Every featured bento card and project catalog card article assigns an explicit `style={{ viewTransitionName: `project-card-${project.slug}` }}`.
2. **Case Study Hero Header (`CaseStudyView.tsx`)**:
   - The case study `<header>` element assigns matching `style={{ viewTransitionName: `project-card-${project.slug}` }}`.
3. **Transition Mechanics & Aspect Ratio Preservation (`src/styles/index.css`)**:
   - Targets `::view-transition-old(project-card-*)` and `::view-transition-new(project-card-*)` with:
     ```css
     object-fit: cover;
     overflow: hidden;
     height: 100%;
     width: 100%;
     animation-duration: 250ms;
     animation-timing-function: cubic-bezier(0.2, 0, 1, 1);
     ```
   - Eliminates image warping, layout shifts, or letterboxing during geometric interpolation.

### 3.3 Root Cross-Fade Keyframes & Mechanics (Tier 2)

1. **Primary Navigation Transitions**:
   - Header navigation links in `AppLayout.tsx` (`Overview`, `Projects`, `Experience`, and brand logo) utilize `useViewTransitionNavigate`.
2. **CSS Keyframes**:
   - `fade-out`: opacity `1 -> 0` (150ms `cubic-bezier(0.2, 0, 1, 1)`).
   - `fade-in`: opacity `0 -> 1` (180ms `cubic-bezier(0.2, 0, 1, 1)`).
3. **Zero Layout Shift**:
   - Applied directly to `::view-transition-old(root)` and `::view-transition-new(root)`.

### 3.4 Accessibility & Motion Suppression (WCAG AAA)

1. **CSS Motion Suppression (`src/styles/accessibility.css`)**:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
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
2. **JS Runtime Guard**:
   - `useViewTransitionNavigate` skips `document.startViewTransition()` entirely when reduced motion is detected, preventing any compositor animation overhead.

---

## 4. Verification & Testing Strategy

1. **Unit & Hook Tests (`tests/pipeline/view-transition.test.tsx`)**:
   - Standard navigation without `startViewTransition` fallback.
   - Successful `document.startViewTransition` invocation when supported.
   - Bypassing `document.startViewTransition` under `prefers-reduced-motion: reduce`.
   - `TransitionLink` keyboard and mouse event handling (modifier keys, right clicks, custom handlers).
2. **DOM Style & Shared Element Matching Tests**:
   - Verifying `viewTransitionName` matches between `BentoGrid`, `ProjectsView`, and `CaseStudyView`.
3. **CSS Integrity Tests**:
   - Verifying keyframes and pseudo-element rules in `src/styles/index.css` and `src/styles/accessibility.css`.
4. **Full Test Suite & Build Verification**:
   - Run `npm test` and `npm run build` to confirm 100% test pass rate and clean compilation.

