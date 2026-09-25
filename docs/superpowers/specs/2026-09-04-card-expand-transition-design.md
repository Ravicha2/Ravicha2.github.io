# Design Specification: Picture-in-Picture Card Expand Transition

**Date:** 2026-09-04  
**Status:** Approved  
**Topic:** Shared-element picture-in-picture zoom/expand transition from Overview & Projects cards into Case Study deep dives.

---

## 1. Overview & Objectives

When a user selects any featured case study card on the **Overview** page (Bento Grid) or any project card with a case study on the **Projects** page, the UI executes a smooth, GPU-accelerated picture-in-picture (PIP) expansion. The card smoothly morphs and zooms into the Case Study hero/header, while the deep-dive technical sections fade in beneath. Navigating backwards reverses this animation, collapsing the view back into the origin card.

### Key Success Criteria
1. **Full-Card Clickability**: Clicking anywhere on the card initiates the case study expansion, while nested action links (GitHub, Demo, PyPI, etc.) operate independently via event stop-propagation.
2. **Synchronous Snapshot Attachment**: The active slug is set synchronously using `flushSync` before `document.startViewTransition()` takes the old DOM snapshot, guaranteeing proper shared-element pairing.
3. **Fluid Motion Curve**: 320ms duration with `cubic-bezier(0.16, 1, 0.3, 1)` spring-like easing.
4. **Accessible & Responsive**: Clean keyboard navigation, screen reader support, and immediate fallback under `prefers-reduced-motion: reduce`.

---

## 2. Architecture & Data Flow

```
[ Overview / BentoGrid ]  --click card / flushSync(activeSlug)-->  [ document.startViewTransition ]
         |                                                                      |
    [ Old Snapshot ]                                                       [ New Snapshot ]
  view-transition-name:                                                  view-transition-name:
project-card-${slug} (Card)                                            project-card-${slug} (Hero)
         \                                                                      /
          ---------------------> GPU Morph & Zoom Interpolation <---------------
                                                |
                                      [ CaseStudyView Mounted ]
```

### 2.1 ViewTransition Hook Updates (`src/hooks/useViewTransitionNavigate.ts`)
* Ensure `setActiveSlug(slug)` executes inside `flushSync` prior to invoking `document.startViewTransition`.
* When navigating back from `/projects/:slug` to `/projects` or `/`, extract the source `slug` and retain `activeSlug` throughout the transition lifecycle, clearing it upon transition completion or abort.

### 2.2 Shared Element CSS Pairing (`src/styles/index.css`)
* Match transition names dynamically for all project slugs:
  - `project-card-shepherd`
  - `project-card-nl2regex`
  - `project-card-document-ingestion-agent`
  - `project-card-lit-review-council`
  - `project-card-node-api`
  - `project-card-robotic-arm-ultrasound`
  - `project-card-heal-a2a`
* Set transition duration to `320ms` and timing curve `cubic-bezier(0.16, 1, 0.3, 1)`.
* Apply `object-fit: cover` and `overflow: hidden` to prevent layout tearing during aspect-ratio interpolation.

---

## 3. Component Details

### 3.1 `BentoGrid.tsx` (Overview Page)
* Wrap each card in an accessible, clickable container with `cursor-pointer` and hover styling.
* Clicking card navigates to `/projects/${project.slug}` with `navigateWithTransition`.
* Nested external links and secondary actions use `onClick={(e) => e.stopPropagation()}`.
* Card applies `style={activeSlug === project.slug ? { viewTransitionName: `project-card-${project.slug}` } : undefined}`.

### 3.2 `ProjectsView.tsx` (Projects Catalog)
* For cards with `caseStudy`, the card container is clickable (`cursor-pointer`) and triggers navigation with the view transition.
* Cards without case studies remain static informational tiles.
* External repository, PyPI, Demo, Video, and Paper icon buttons stop propagation on click.
* Card applies `style={activeSlug === project.slug ? { viewTransitionName: `project-card-${project.slug}` } : undefined}`.

### 3.3 `CaseStudyView.tsx` (Case Study Page)
* The `<header>` element receives `style={{ viewTransitionName: `project-card-${project.slug}` }}`.
* Breadcrumb / Back button calls `navigateWithTransition('/projects')` with target slug preserved for reverse morph.
* The 4-section body (`#section-intuition`, `#section-problem`, `#section-architecture`, `#section-outcomes`) animates in with a gentle slide-and-fade.

---

## 4. Verification & Testing

1. **Unit & Integration Tests**:
   - Verify `startViewTransition` captures active slug on card click.
   - Verify full-card click triggers navigation for case study cards.
   - Verify nested links (GitHub, Demo) stop propagation and do not trigger route navigation.
   - Verify reverse navigation back to `/projects` preserves active slug pairing.
   - Verify `prefers-reduced-motion` bypasses transition.
2. **Visual & Cross-Browser Verification**:
   - Verify smooth card expand and shrink back on modern Chromium and Safari.
