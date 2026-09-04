# ElevenLabs Editorial Monochrome Theme Design (Light Mode Only)

This specification defines the visual theme, design tokens, and aesthetic overhaul for the portfolio website inspired by [ElevenLabs](https://elevenlabs.io/), featuring an editorial monochromatic color palette, clean typography, refined surfaces, light-mode-only architecture, and strictly no status tag lines.

---

## 1. Design Philosophy & North Star

1. **Quietly Editorial & Monochromatic**: Drawing inspiration from high-end publications and ElevenLabs' clean web presence, the visual identity is built on high-contrast black ink (`#18181b`) against a warm off-white ivory canvas (`#f7f7f5`).
2. **Light Mode Only (Zero Dark Mode Ambiguity)**: Single-theme architecture. No dark mode switching, dark class overrides, or dual-theme maintenance. The entire application runs exclusively in a warm, crisp light editorial theme.
3. **Strictly No Status Tag Line**: Eliminate any status indicators, availability tag lines, or status pills across all views (e.g. no "Open to work", no availability status tag lines).
4. **Restrained Hairline Structure**: Separation and depth are achieved exclusively with 1px warm hairline borders (`#e8e6e1` subtle, `#d0ccc4` strong) and clean surface contrast (`#ffffff` panels against `#f7f7f5` canvas).
5. **High-Contrast Ink Actions ("Ink Pills")**: Primary CTAs and action buttons use solid deep ink (`bg-[#18181b] text-white hover:bg-neutral-800`), providing sharp visual hierarchy and tactile precision.

---

## 2. Design Tokens & Color Palette

### 2.1 CSS Custom Properties (`src/styles/tokens.css`)

All colors are unified into a single `:root` token set without `.dark` class overrides:

```css
:root {
  /* ElevenLabs Editorial Light Palette */
  --bg-canvas: #f7f7f5;          /* Warm ivory root background */
  --bg-surface: #ffffff;         /* Pure white card & panel surface */
  --bg-surface-hover: #f0eee9;   /* Subtle warm surface hover state */
  --border-subtle: #e8e6e1;      /* 1px hairline warm neutral border */
  --border-strong: #d0ccc4;      /* Active, focused, or hover border */
  --text-primary: #18181b;       /* Deep high-contrast ink for headlines */
  --text-secondary: #57534e;     /* Warm stone body copy */
  --text-muted: #78716c;         /* Subdued metadata, dates, labels */
  --accent-solid: #18181b;       /* Solid ink accent for buttons & key links */
  --accent-badge-bg: #f0eee9;    /* Neutral ink pill badge background */
  --accent-badge-text: #18181b;  /* Neutral ink pill badge text */
}
```

### 2.2 Token Mapping Table

| Token | Value | Visual Purpose |
|---|---|---|
| `--bg-canvas` | `#f7f7f5` | Page background, body background |
| `--bg-surface` | `#ffffff` | Bento cards, project cards, experience cards |
| `--bg-surface-hover` | `#f0eee9` | Hover states on interactive cards, buttons, pills |
| `--border-subtle` | `#e8e6e1` | 1px card borders, dividers, section headers |
| `--border-strong` | `#d0ccc4` | Focus rings, active borders, card hover borders |
| `--text-primary` | `#18181b` | Primary headings, author name, key titles |
| `--text-secondary` | `#57534e` | Narrative body text, summaries, descriptions |
| `--text-muted` | `#78716c` | Dates, timelines, tech stack labels, footer |
| `--accent-solid` | `#18181b` | Primary CTAs, active filter buttons, link arrows |
| `--accent-badge-bg` | `#f0eee9` | Category pills, active nav pills, badge backgrounds |
| `--accent-badge-text` | `#18181b` | Category pill text, badge labels |

---

## 3. Component & Layout Specifications

### 3.1 Global Header & Navigation (`src/components/layout/AppLayout.tsx`)
- **Header**: Sticky backdrop blur with `bg-canvas/90 backdrop-blur-md border-b border-border-subtle`.
- **Brand Name**: "Palm Suksawasdi" in `text-text-primary hover:text-accent-solid font-semibold`.
- **Active Navigation Pill**: Uses `bg-accent-badge-bg text-accent-badge-text font-semibold border border-border-subtle`.
- **Inactive Nav Links**: `text-text-secondary hover:text-text-primary hover:bg-surface-hover`.
- **Footer**: `border-t border-border-subtle text-text-muted hover:text-text-primary`.

### 3.2 Hero Narrative (`src/components/home/HeroNarrative.tsx`)
- **Top Label**: Clean uppercase mono name and title without any status badges: `Palm Suksawasdi · Applied AI & FullStack Development`.
- **Title Typing Effect**: Deep ink `#18181b` text with smooth token streaming.
- **Primary CTA**: "Explore Projects" button with solid ink `bg-accent-solid text-white hover:bg-neutral-800`.
- **Secondary Actions**: Monochromatic surface buttons (`bg-surface text-text-primary border border-border-subtle hover:bg-surface-hover`).
- **Profile Image**: Rounded circular portrait with warm border `border-border-subtle hover:border-border-strong`.
- **Status Tag Line Policy**: **Strictly no status tag line** (no availability badge, no "Open to work" tag).

### 3.3 Bento Grid & Featured Projects (`src/components/home/BentoGrid.tsx`)
- **Card Background**: Pure white `bg-surface` with `border border-border-subtle hover:border-border-strong hover:bg-surface-hover/30`.
- **Category & Timeline**: Category in `font-semibold text-accent-solid` and timeline in `text-text-muted`.
- **Metric Pill**: `bg-canvas border border-border-subtle text-text-secondary`.
- **Tech Stack Badges**: `bg-surface-hover text-text-muted border border-border-subtle`.
- **Case Study Link**: `text-accent-solid hover:underline` with animated arrow indicator.

### 3.4 Projects Catalog (`src/views/ProjectsView.tsx`)
- **Category Filter Pills**:
  - Selected / Active: `bg-accent-solid text-white border-accent-solid font-bold`. Count badge in `bg-white text-accent-solid`.
  - Unselected / Inactive: `bg-surface text-text-secondary border-border-subtle hover:text-text-primary hover:bg-surface-hover`.
- **Project Cards**: Clean white surfaces, subtle borders, high-contrast typography, and external link icons in `text-text-muted hover:text-text-primary`.

### 3.5 Experience Timeline (`src/views/ExperienceView.tsx`)
- **Timeline Rail**: `border-l border-border-subtle`.
- **Timeline Bullet Node**: `bg-accent-solid` for active role, `bg-text-muted` for past roles, both with `border-2 border-canvas`.
- **Tags & Highlights**: Warm neutral pills (`bg-accent-badge-bg text-accent-badge-text border border-border-subtle`).

### 3.6 Case Study Deep Dives (`src/views/CaseStudyView.tsx`)
- **Header**: Deep ink title, warm stone summary, mono metadata grid.
- **CLI Install Box**: `bg-surface border border-border-subtle font-mono text-text-primary`.
- **Section Cards**: `bg-surface border border-border-subtle`, insight boxes in `bg-canvas border border-border-subtle`.
- **Back Navigation**: Monochromatic back button `bg-accent-solid text-white hover:bg-neutral-800`.

---

## 4. Technical Architecture & File Changes

| File | Purpose of Change |
|---|---|
| `src/styles/tokens.css` | Update CSS variables to ElevenLabs Editorial palette; delete `.dark` class block. |
| `src/styles/index.css` | Ensure fallback background is `#f7f7f5` and text is `#18181b`. |
| `index.html` | Update `<meta name="theme-color" content="#f7f7f5" />`. |
| `src/components/home/HeroNarrative.tsx` | Remove `dark:text-zinc-950` classes; confirm absence of any status tag lines. |
| `src/views/HomeView.tsx` | Remove residual `dark:*` classes on CTAs. |
| `src/views/ProjectsView.tsx` | Remove residual `dark:*` classes on filter and CTA buttons. |
| `src/views/CaseStudyView.tsx` | Remove residual `dark:*` classes on error/back CTA buttons. |
| `DESIGN.md` | Update design specification to record ElevenLabs Editorial (Light Mode Only, strictly no status tag line). |

---

## 5. Verification & Testing Guardrails

1. **Automated Unit & Integration Tests**:
   - Run `npm test` across all 18 test files to ensure 100% test pass rate with no regressions.
2. **Visual Verification**:
   - Inspect build outputs and verify high-contrast contrast ratios against WCAG AAA standards for `#18181b` on `#f7f7f5` / `#ffffff`.
   - Ensure zero status tag lines are rendered.
3. **Build & Type Check**:
   - Run `npm run build` (`tsc && vite build`) to ensure clean compilation.
