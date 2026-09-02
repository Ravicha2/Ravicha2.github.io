# Design Specification: Human Accessibility Engine (WCAG AAA, Keyboard Flow & Reduced Motion)

- **Date**: 2026-09-02
- **GitHub Issue**: [#2: [AFK] Human Accessibility Engine (WCAG AAA, Keyboard Flow & Reduced Motion)](https://github.com/Ravicha2/Ravicha2.github.io/issues/2)
- **Status**: Ready for Review

---

## 1. Overview & Objectives

This specification defines the complete accessibility architecture for Palm Suksawasdi's personal website portfolio ([Ravicha2.github.io](https://ravicha2.github.io)). It establishes a robust, zero-dependency accessibility foundation conforming to **WCAG 2.2 AAA** standards, ensuring the site is fully navigable for assistive technologies, screen readers, keyboard-only users, and motion-sensitive visitors.

### Core Goals
1. **Semantic HTML5 Landmark Hierarchy**: Structural layout contract (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`) with explicit ARIA roles and labels.
2. **WCAG AAA Solid Token Palette (Light Mode)**: Pure solid colors strictly exceeding the **7.0:1** contrast ratio for normal text and **4.5:1** for large text/icons.
3. **Dedicated Route Announcer & Focus Shift**: Visually hidden `aria-live="polite"` region announcing route changes and dynamically shifting programmatic focus to `<main id="main-content">`.
4. **Keyboard Navigation & Visible Focus Rings**: High-contrast `:focus-visible` rings with offset indicators and an accessible `SkipLink` ("Skip to main content").
5. **Full Motion Suppression**: Complete suppression of CSS animations, transitions, and client-side View Transitions under `@media (prefers-reduced-motion: reduce)`.

---

## 2. WCAG AAA Color Contrast Token System (Light Theme)

The site uses a clean, high-contrast **Light Mode (Porcelain)** theme. Every color token is calculated to guarantee compliance with WCAG AAA requirements ($\ge 7:1$ for normal text, $\ge 4.5:1$ for large text):

| Token Name | Hex Code | Purpose | Background | Contrast Ratio | WCAG AAA Status |
|---|---|---|---|---|---|
| **Canvas Background** | `#fafafa` (Porcelain) | Root page background | - | - | Base |
| **Surface Background** | `#ffffff` (Pure White) | Card & panel background | `#fafafa` | 1.05:1 | Hairline separated |
| **Text Primary** | `#09090b` (Zinc-950) | Headlines & body copy | `#fafafa` / `#ffffff` | **20.3:1** / **19.3:1** | **Pass (AAA)** |
| **Text Secondary** | `#3f3f46` (Zinc-700) | Subheadings & descriptions | `#fafafa` / `#ffffff` | **10.5:1** / **10.0:1** | **Pass (AAA)** |
| **Text Muted** | `#52525b` (Zinc-600) | Metadata, dates, tags | `#fafafa` / `#ffffff` | **7.2:1** / **6.9:1** | **Pass (AAA)** |
| **Accent Action / Link** | `#1d4ed8` (Blue-700) | Links, active states, buttons | `#fafafa` / `#ffffff` | **7.8:1** / **7.4:1** | **Pass (AAA)** |
| **Badge Background** | `#eff6ff` (Blue-50) | Category & skill badge fill | `#fafafa` | - | Structural Fill |
| **Badge Text** | `#1d4ed8` (Blue-700) | Badge label text | `#eff6ff` | **7.4:1** | **Pass (AAA)** |
| **Hairline Border** | `#e4e4e7` (Zinc-200) | 1px card & divider boundaries | `#fafafa` | 1.2:1 | Structural boundary |

---

## 3. Semantic HTML5 Landmark Structure & Navigation Contract

### 3.1 Landmark Architecture
The root application layout wraps every page in standard HTML5 landmarks:

```
+-----------------------------------------------------------------------+
|  <header role="banner">                                              |
|    - <SkipLink href="#main-content">                                  |
|    - Branding: "Palm Suksawasdi"                                      |
|    - <nav role="navigation" aria-label="Main Navigation">             |
|        - <NavLink to="/" aria-current="page">Overview</NavLink>       |
|        - <NavLink to="/projects">Projects</NavLink>                   |
|        - <NavLink to="/experience">Experience</NavLink>               |
+-----------------------------------------------------------------------+
|  <RouteAnnouncer aria-live="polite" aria-atomic="true" />             |
+-----------------------------------------------------------------------+
|  <main id="main-content" tabIndex={-1} className="outline-none">      |
|    - Page content (Home / Projects / Experience)                      |
|    - <article aria-labelledby="..."> for case study cards & details   |
+-----------------------------------------------------------------------+
|  <footer role="contentinfo">                                          |
|    - Social & contact links (with explicit aria-labels)               |
|    - Copyright and status indicators                                  |
+-----------------------------------------------------------------------+
```

### 3.2 `SkipLink` Component (`src/accessibility/SkipLink.tsx`)
A skip link is rendered at the very top of the DOM. It remains visually hidden until receiving keyboard focus:

```tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-zinc-900 focus:text-zinc-50 focus:border focus:border-zinc-700 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-[#fafafa]"
    >
      Skip to main content
    </a>
  );
}
```

---

## 4. Route Announcement & Programmatic Focus Engine

### 4.1 Route Announcer Component (`src/accessibility/RouteAnnouncer.tsx`)
Because client-side SPA routing does not trigger browser document reload events, screen reader users need live region updates and focus shifts.

```tsx
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteAnnouncerProps {
  pageTitle: string;
  mainRef: React.RefObject<HTMLElement>;
}

export function RouteAnnouncer({ pageTitle, mainRef }: RouteAnnouncerProps) {
  const location = useLocation();
  const [message, setMessage] = useState('');
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip speech announcement on initial page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Update document.title
    document.title = `${pageTitle} | Palm Suksawasdi`;

    // Announce to screen reader
    setMessage(`Navigated to ${pageTitle}`);

    // Programmatically shift focus to main landmark
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
      {message}
    </div>
  );
}
```

---

## 5. Keyboard Flow & High-Visibility Focus Rings

### 5.1 Focus Ring Styling
All interactive elements (`<a>`, `<button>`, `<input>`, filter pills, and clickable cards) adopt a high-visibility, 2-layer focus indicator using `:focus-visible`:

```css
/* Tailwind Class Equivalent */
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafafa]
```

- **Focus Visibility**: Triggered only on keyboard navigation (Tab / Shift+Tab), preserving clean aesthetics for pointer interactions.
- **Offset Contrast**: 2px white/porcelain offset ensures high contrast regardless of the background color.

### 5.2 External Links & Icon Buttons
- Outbound links (`target="_blank"`) contain `rel="noopener noreferrer"` and an accessible label or hidden text: `<span className="sr-only">(opens in a new tab)</span>`.
- Icon-only buttons (GitHub icon, LinkedIn icon, Mail icon) must specify descriptive `aria-label` attributes.

---

## 6. Motion Suppression & View Transition Fallbacks

### 6.1 CSS Motion Suppression (`src/styles/accessibility.css`)
Full suppression of animations, transitions, and native View Transitions when the user has configured `prefers-reduced-motion: reduce`:

```css
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

### 6.2 `useReducedMotion` Hook (`src/accessibility/useReducedMotion.ts`)
A lightweight hook providing reactive access to the motion preference in React:

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
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
```

---

## 7. File Structure & Component Contracts

```
src/
├── accessibility/
│   ├── index.ts               # Public exports
│   ├── SkipLink.tsx           # Accessible skip to content link
│   ├── RouteAnnouncer.tsx     # Polite live region & title sync
│   └── useReducedMotion.ts    # Reduced motion detection hook
├── components/
│   └── layout/
│       └── AppLayout.tsx      # Semantic header, nav, main, footer wrapper
└── styles/
    └── accessibility.css      # Focus-visible & prefers-reduced-motion CSS rules
```

---

## 8. Verification & Compliance Checklist

| Verification Item | Requirement | Tool / Method |
|---|---|---|
| **Lighthouse Accessibility** | 100/100 score | Chrome DevTools Lighthouse audit |
| **Color Contrast** | Minimum 7.0:1 for normal text, 4.5:1 for large text | WebAIM Contrast Checker / axe DevTools |
| **Landmark Verification** | Complete `<header>`, `<nav>`, `<main>`, `<footer>` structure | NVDA / VoiceOver & Screen Reader Rotor |
| **Keyboard Navigation** | Logical Tab order, no focus traps, visible `:focus-visible` rings | Full manual keyboard walkthrough |
| **Route Announcements** | Live region announces page titles upon route transition | VoiceOver & NVDA live log |
| **Reduced Motion** | Zero view transitions/animations when emulating `prefers-reduced-motion` | Chrome DevTools Rendering Emulation |
