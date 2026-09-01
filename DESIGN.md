# Design Specification & North Star (DESIGN.md)

This document defines the foundational design principles, visual tokens, interaction models, and performance guardrails for the personal website. It serves as the single source of truth and North Star for all interface and architecture decisions.

---

## 1. North Star & Core Philosophy

1. **Instantaneous & Effortless**: Navigations and interactions must feel instantaneous (sub-100ms render, zero layout stutter). The site feels like a high-performance native application rather than a heavy web document.
2. **Strictly Zero Gradients**: Pure solid colors, sharp contrast, and structural definition. No linear, radial, or conic gradients anywhere on the site. Depth and separation are achieved exclusively through solid background contrasts, 1px hairline borders, and clean typography.
3. **Dual-Tier Transition Hierarchy (Picture-in-Picture + Smooth Cross-Fade)**:
   - **Tier 1 (Shared Elements / PiP)**: When a corresponding component pair exists (e.g. project thumbnail to case study hero, active card), execute a hardware-accelerated shared-element morph.
   - **Tier 2 (General Page Cross-Fade)**: When PiP is not applicable (general page switching, direct link navigation, back/forward traverses without shared cards), execute a clean, seamless root cross-fade (`opacity` transition with zero layout jump).
4. **Zero Framework Bloat**: Clean static HTML and lightweight Web Components without runtime JavaScript framework overhead.

---

## 2. Visual Design System & Tokens

### 2.1 Color Palette

Strictly solid colors with high visual contrast. Adaptive support for Dark (default) and Light themes.

| Token | Dark Mode (`dark`) | Light Mode (`light`) | Purpose |
|---|---|---|---|
| `--bg-canvas` | `#09090b` (Zinc-950) | `#fafafa` (Porcelain) | Root background |
| `--bg-surface` | `#121215` (Solid Dark Surface) | `#ffffff` (Pure White) | Card / Panel background |
| `--bg-surface-hover` | `#18181b` (Zinc-900) | `#f4f4f5` (Zinc-100) | Interactive hover surface |
| `--border-subtle` | `#27272a` (Zinc-800) | `#e4e4e7` (Zinc-200) | 1px hairline card borders |
| `--border-strong` | `#3f3f46` (Zinc-700) | `#d4d4d8` (Zinc-300) | Focused / active borders |
| `--text-primary` | `#fafafa` (Pure White) | `#09090b` (Deep Charcoal) | Headlines, primary text |
| `--text-secondary` | `#a1a1aa` (Zinc-400) | `#71717a` (Zinc-500) | Subheadings, body copy |
| `--text-muted` | `#71717a` (Zinc-500) | `#a1a1aa` (Zinc-400) | Metadata, dates, labels |
| `--accent-solid` | `#2563eb` (Solid Cobalt) | `#1d4ed8` (Deep Blue) | Primary focus/action point |
| `--accent-badge-bg` | `#1e293b` (Slate-800) | `#eff6ff` (Blue-50) | Tag / pill background |
| `--accent-badge-text` | `#93c5fd` (Blue-300) | `#1d4ed8` (Blue-700) | Tag / pill label |

### 2.2 Typography

- **Primary Sans (Headlines & Body)**: `Geist Sans`, `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
  - Font weights: `400` (Regular), `500` (Medium), `600` (Semi-bold), `700` (Bold)
- **Monospace (Dates, Tags, Code, Metrics)**: `Geist Mono`, `JetBrains Mono`, `ui-monospace`, `monospace`
  - Font weights: `400` (Regular), `500` (Medium)

### 2.3 Structural Spacing & Border Radii

- **Grid Spacing**: 4px baseline scale (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`)
- **Hairline Borders**: `1px solid var(--border-subtle)`
- **Border Radii**:
  - Small / Badges: `4px`
  - Cards / Panels: `8px`
  - Floating Docks / Buttons: `12px` or `9999px` (full pill)

---

## 3. Motion & Page Transition Specifications

### 3.1 Native Cross-Document View Transitions

All page navigations leverage the native CSS `@view-transition` specification:

```css
@media (prefers-reduced-motion: no-preference) {
  @view-transition {
    navigation: auto;
  }
}
```

### 3.2 Dual-Tier Transition Mechanics

#### Tier 1: Shared-Element / Picture-in-Picture Morph
Applied to matching card-to-hero components:
```css
::view-transition-old(active-hero),
::view-transition-new(active-hero),
::view-transition-old(active-card),
::view-transition-new(active-card) {
  object-fit: cover;
  overflow: hidden;
  height: 100%;
  width: 100%;
  animation-duration: 300ms;
  animation-timing-function: cubic-bezier(0.2, 0, 0, 1);
}
```

#### Tier 2: Universal Fallback Cross-Fade
Applied to the root document when no shared PiP element exists:
```css
::view-transition-old(root) {
  animation: 180ms cubic-bezier(0.2, 0, 0, 1) both fade-out;
}

::view-transition-new(root) {
  animation: 220ms cubic-bezier(0.2, 0, 0, 1) both fade-in;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 3.3 Just-in-Time (JIT) Transition Lifecycle

- **`pageswap` (Outgoing Page)**: Checks if a clicked target element has a shared transition destination. If yes, dynamically assigns `view-transition-name: active-card/active-hero`. If no, leaves `view-transition-name` unassigned so the root clean cross-fade executes.
- **`pagereveal` (Incoming Page)**: Matches the corresponding incoming element if present.
- **Navigation Dock & Header**: Always keeps persistent `view-transition-name: site-header;` to stay locked in place across all page transitions.

---

## 4. Information Architecture & Page Blueprints

### 4.1 Site Map
```
/
├── index.html            ← Home: Hero, Core Bio, Featured Projects, Key Experience, Contact
├── projects.html         ← Projects Archive: Full engineering catalog & case studies
├── experience.html       ← Experience & Resume: Detailed timeline, skill breakdown, metrics
├── llms.txt              ← AI Agent Brief: Markdown resume & project index for LLMs
├── llms-full.txt         ← AI Agent Full Dossier: In-depth technical context for AI
└── docs/adr/             ← Architectural Decision Records
```

### 4.2 Page Components & Hierarchy

1. **Persistent Header & Navigation Dock**:
   - Brand identification ("Palm Suksawasdi")
   - Navigation links: `Overview`, `Projects`, `Experience`
   - Dark/Light mode theme toggle
   - Persistent across all pages via anchored view transition

2. **Home (`index.html`)**:
   - **Hero Section**: Crisp intro, role summary (Automation, Cloud, AI Orchestration, Systems Design), direct contact links (GitHub, LinkedIn, Email).
   - **Featured Work**: Grid of top engineering projects with interactive thumbnail cards configured for shared-element PiP transitions.
   - **Experience Snapshot**: Most recent engineering roles with expandable technical depth.

3. **Projects (`projects.html`)**:
   - Comprehensive filterable list / grid of technical projects.
   - Detailed project metadata: Tech stack badges, architecture highlights, live links, and GitHub repositories.
   - Instant PiP expansion into full case study views.

4. **Experience (`experience.html`)**:
   - Chronological engineering timeline (NodesNow AI orchestration, 3D Technical Design Civil 3D network engineering, Jardine Schindler engineering).
   - Bulleted technical impact statements and tooling proficiencies.

---

## 5. Accessibility for Humans, Bots, and AI

1. **Human Accessibility (a11y)**:
   - Semantic HTML5 landmarks (`<main>`, `<nav>`, `<article>`).
   - High-contrast ratio with solid tokens (WCAG AAA compliant).
   - Visible keyboard focus rings (`:focus-visible`) and screen reader announcement tags.
   - `prefers-reduced-motion` suppresses all transitions and animations.

2. **Bot & Search Engine Accessibility**:
   - Comprehensive JSON-LD structured data (`schema.org/Person`, `ProfilePage`, `SoftwareSourceCode`).
   - Semantic OpenGraph and Twitter card metadata.
   - Clean `robots.txt` and `sitemap.xml`.

3. **AI Agent / LLM Accessibility**:
   - Standard `/llms.txt` and `/llms-full.txt` files providing structured markdown summaries of background, technical stack, architecture philosophy, and project case studies for AI agents visiting the site.
   - Direct text readability with zero client-side JavaScript required for content extraction.

---

## 6. Performance Guardrails & Pitfall Mitigations

1. **4-Second View Transition Timeout Defense**:
   - All fonts (Geist & Geist Mono) are **self-hosted variable fonts** to eliminate external network blocking.
   - Critical DOM elements use `<link rel="expect" href="#main-content" blocking="render">` to coordinate render readiness cleanly.
   - Internal links feature speculative prefetching on hover to ensure sub-50ms Time-to-First-Byte (TTFB).

2. **Progressive Enhancement**:
   - Browsers supporting CSS `@view-transition` (Chromium 126+, Safari 18.2+) receive the full shared-element morphing & cross-fade experience.
   - Unsupported browsers receive clean, instant standard multi-page navigations with zero JavaScript errors.
