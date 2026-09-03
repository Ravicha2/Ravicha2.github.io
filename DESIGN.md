# Design Specification & North Star (DESIGN.md)

This document defines the foundational design principles, visual tokens, interaction models, and performance guardrails for the personal website. It serves as the single source of truth and North Star for all interface and architecture decisions.

---

## 1. North Star & Core Philosophy

1. **Instantaneous & Effortless**: Navigations and interactions must feel instantaneous (sub-100ms render, zero layout stutter). The site feels like a high-performance native application.
2. **Strictly Zero Gradients**: Pure solid colors, sharp contrast, and structural definition. No linear, radial, or conic gradients anywhere on the site. Depth and separation are achieved exclusively through solid background contrasts (`zinc-950` / `zinc-900` / `#fafafa`), 1px hairline borders (`border-zinc-800` / `border-zinc-200`), and clean typography.
3. **React Single-Page Application (SPA)**: Powered by Vite, React 18/19, TypeScript, and Tailwind CSS.
4. **Dual-Tier Transition Hierarchy (Shared-Element Morph + Smooth Cross-Fade)**:
   - **Tier 1 (Shared Elements / Route Morphs)**: When navigating from a project thumbnail on Home or Catalog into `/projects/:slug`, trigger a client-side View Transition (`document.startViewTransition()`) with matching `view-transition-name`.
   - **Tier 2 (General Route Cross-Fade)**: When navigating between primary routes (`/`, `/projects`, `/experience`), execute a seamless root cross-fade (`opacity` transition with zero layout jump).

---

## 2. Visual Design System & Tailwind Tokens

### 2.1 Color Palette & Theme Tokens

Strictly solid colors with high visual contrast. Adaptive support for Dark (default) and Light themes using Tailwind CSS classes.

| Token | Dark Mode (`dark`) | Light Mode (`light`) | Tailwind Class / Variable | Purpose |
|---|---|---|---|---|
| `--bg-canvas` | `#09090b` (Zinc-950) | `#fafafa` (Porcelain) | `bg-zinc-950` / `bg-[#fafafa]` | Root background |
| `--bg-surface` | `#121215` (Dark Surface) | `#ffffff` (Pure White) | `bg-[#121215]` / `bg-white` | Card / Panel surface |
| `--bg-surface-hover` | `#18181b` (Zinc-900) | `#f4f4f5` (Zinc-100) | `bg-zinc-900` / `bg-zinc-100` | Interactive hover state |
| `--border-subtle` | `#27272a` (Zinc-800) | `#e4e4e7` (Zinc-200) | `border-zinc-800` / `border-zinc-200` | 1px hairline card borders |
| `--border-strong` | `#3f3f46` (Zinc-700) | `#d4d4d8` (Zinc-300) | `border-zinc-700` / `border-zinc-300` | Active / focused borders |
| `--text-primary` | `#fafafa` (Zinc-50) | `#09090b` (Zinc-950) | `text-zinc-50` / `text-zinc-950` | Headlines, primary text |
| `--text-secondary` | `#a1a1aa` (Zinc-400) | `#71717a` (Zinc-500) | `text-zinc-400` / `text-zinc-500` | Subheadings, body copy |
| `--text-muted` | `#71717a` (Zinc-500) | `#a1a1aa` (Zinc-400) | `text-zinc-500` / `text-zinc-400` | Metadata, dates, labels |
| `--accent-solid` | `#2563eb` (Blue-600) | `#1d4ed8` (Blue-700) | `bg-blue-600` / `text-blue-600` | Primary accent / actions |
| `--accent-badge-bg` | `#1e293b` (Slate-800) | `#eff6ff` (Blue-50) | `bg-slate-800` / `bg-blue-50` | Tag / pill background |
| `--accent-badge-text` | `#93c5fd` (Blue-300) | `#1d4ed8` (Blue-700) | `text-blue-300` / `text-blue-700` | Tag / pill label |

### 2.2 Typography
- **Primary Sans (Headlines & Body)**: `Geist Sans`, `Inter`, `-apple-system`, `sans-serif`
  - Font weights: `400` (Regular), `500` (Medium), `600` (Semi-bold), `700` (Bold)
- **Monospace (Dates, Tags, Code, Metrics)**: `Geist Mono`, `JetBrains Mono`, `monospace`
  - Font weights: `400` (Regular), `500` (Medium)

### 2.3 Structural Spacing & Border Radii
- **Grid Spacing**: 4px baseline scale (`p-1`, `p-2`, `p-3`, `p-4`, `p-6`, `p-8`, `p-12`, `p-16`)
- **Hairline Borders**: `border border-zinc-800 dark:border-zinc-800`
- **Border Radii**:
  - Small / Badges: `rounded` (`4px`)
  - Cards / Panels: `rounded-lg` (`8px`)
  - Floating Docks / Buttons: `rounded-xl` (`12px`) or `rounded-full`

---

## 3. Motion & Single-Page Route Transitions

### 3.1 React Client-Side View Transitions
Route changes wrap client navigations inside `document.startViewTransition()`:

```typescript
// Custom transition hook or React Router viewTransition helper
function navigateWithTransition(to: string) {
  if (!document.startViewTransition) {
    navigate(to);
    return;
  }
  document.startViewTransition(() => {
    navigate(to);
  });
}
```

### 3.2 Transition Mechanics

```css
@media (prefers-reduced-motion: no-preference) {
  ::view-transition-old(active-hero),
  ::view-transition-new(active-hero),
  ::view-transition-old(active-card),
  ::view-transition-new(active-card) {
    object-fit: cover;
    overflow: hidden;
    height: 100%;
    width: 100%;
    animation-duration: 250ms;
    animation-timing-function: cubic-bezier(0.2, 0, 1, 1);
  }

  ::view-transition-old(root) {
    animation: 150ms cubic-bezier(0.2, 0, 1, 1) both fade-out;
  }

  ::view-transition-new(root) {
    animation: 180ms cubic-bezier(0.2, 0, 1, 1) both fade-in;
  }
}
```

---

## 4. Information Architecture & Routing

### 4.1 Route Map
```
/                         ← Home: Hero, Bio, Featured Bento Deck, Quick Experience, Contact
/projects                 ← Projects Catalog: Filterable project archive & tags
/projects/:slug           ← Deep-Dive Case Study (e.g. /projects/shepherd, /projects/nl2regex)
/experience               ← Experience & Resume: Chronological timeline, skills matrix, education
/llms.txt                 ← AI Agent Brief (Static file in public/)
/llms-full.txt            ← AI Agent Full Dossier (Static file in public/)
```

### 4.2 Core React Components
1. **`Navbar` / Floating Navigation Dock**:
   - Brand identification ("Palm Suksawasdi")
   - Nav links: `Overview` (`/`), `Projects` (`/projects`), `Experience` (`/experience`)
   - Dark/Light mode theme toggle
   - Persistent across all route transitions
2. **`HomeView` (`/`)**:
   - Hero section with Applied AI narrative, status badge, direct contact links.
   - Featured Bento Grid showcasing the 4 flagship case studies with shared-element view transition triggers.
   - Quick career overview snapshot.
3. **`ProjectsView` (`/projects`)**:
   - Category filter pills (`All`, `Agentic AI & MCP`, `Distributed Systems`, `Graph & Knowledge`, `Robotics`).
   - Grid of project cards linking directly to `/projects/:slug`.
4. **`CaseStudyView` (`/projects/:slug`)**:
   - 4-Part Case Study deep dive (*1. Intuition & Friction → 2. Problem Encountered → 3. Why Built This Way → 4. Outcomes & Verification*).
   - Interactive code/architecture snippets, live demo links, and GitHub links.
5. **`ExperienceView` (`/experience`)**:
   - Chronological engineering career timeline (NodesNow, 3D Technical Design, Schindler).
   - Categorized skills matrix and education milestones.

---

## 5. Accessibility & Performance Guardrails

1. **Accessibility (WCAG AAA)**:
   - High contrast solid color ratios (`zinc-950` / `zinc-50`).
   - Strict keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-blue-500`).
   - `prefers-reduced-motion` suppresses all animations and view transitions.
2. **GitHub Pages SPA Fallback**:
   - `public/404.html` SPA redirect handler so direct links (`/projects/shepherd`) reload seamlessly without 404 errors.
3. **Bot & AI Agent Readiness**:
   - Static `/public/llms.txt` and `/public/llms-full.txt` served directly for AI crawlers without requiring JavaScript execution.
   - JSON-LD structured data embedded in root `index.html`.
