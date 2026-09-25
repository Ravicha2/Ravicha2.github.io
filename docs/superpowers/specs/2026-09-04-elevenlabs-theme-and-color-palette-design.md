# ElevenLabs Editorial Monochrome Theme Design (Light Mode Only)

> **SUPERSEDED.** This specification is a historical record. The palette, the
> typography, and the layout-invariance rule it defines were replaced by the
> Tolerance Frame world (`.impeccable/surfaces/index-html.md`). The live design
> authority is [DESIGN.md](../../../DESIGN.md); the shipped tokens are
> `src/styles/tokens.css`. Nothing here should be implemented again.

This specification defines the visual theme, design tokens, and aesthetic overhaul for the portfolio website inspired by [ElevenLabs](https://elevenlabs.io/), featuring an editorial monochromatic color palette, clean typography, refined surfaces, light-mode-only architecture, strictly no status tag lines, and absolute layout invariance.

---

## 1. Design Philosophy & North Star

1. **Quietly Editorial & Monochromatic**: Drawing inspiration from high-end publications and ElevenLabs' clean web presence, the visual identity is built on high-contrast black ink (`#18181b`) against a warm off-white ivory canvas (`#f7f7f5`).
2. **Light Mode Only (Zero Dark Mode Ambiguity)**: Single-theme architecture. No dark mode switching, dark class overrides, or dual-theme maintenance. The entire application runs exclusively in a warm, crisp light editorial theme.
3. **Strictly No Status Chrome**: No status pills, availability badges, presence dots, or decorative status chrome anywhere (e.g. no green "available" dot, no "Open to work" pill). One **factual prose line** stating availability is permitted — it is information a recruiter needs, and it is rendered from `profile.status`. A pill is decoration; a sentence is information. This distinction is what allows the closing conversion block to state availability without reintroducing status chrome.
4. **Strict Layout Invariance (Zero Layout Changes)**: All existing grid structures, responsive layouts, spacing scales, DOM element hierarchies, view transition names, and card dimensions must remain 100% unchanged. Only color tokens, borders, and thematic styling are updated.
5. **Restrained Hairline Structure**: Separation and depth are achieved with 1px warm hairline borders (`#d5d0c7` subtle, `#aca69c` strong). Note the constraint this creates: a white panel (`#ffffff`) against the ivory canvas (`#f7f7f5`) separates at only **1.073:1**, so surface contrast alone is imperceptible and the hairline is load-bearing — the original `#e8e6e1` (1.16:1 against canvas) left cards with no perceptible boundary at all. Hairlines here are *decorative grouping*, not UI state: the 3:1 non-text threshold (WCAG 1.4.11) applies to the focus indicator and to borders that convey interactive state, and the focus indicator is carried by the ink accent (16.52:1). `--border-strong` at `#aca69c` measures 2.25:1, deliberately below 3:1 — it is a supplementary hover cue and conveys no required information. A stricter reading would require roughly `#8f887c` (3.27:1), which reads as a heavy rule rather than a hairline.
6. **High-Contrast Ink Actions ("Ink Pills")**: Primary CTAs and action buttons use solid deep ink (`bg-[#18181b] text-white hover:bg-neutral-800`), providing sharp visual hierarchy and tactile precision.

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
  --border-subtle: #d5d0c7;      /* 1px hairline warm neutral border */
  --border-strong: #aca69c;      /* Active, focused, or hover border */
  --text-primary: #18181b;       /* Deep high-contrast ink for headlines */
  --text-secondary: #4a443f;     /* Warm stone body copy */
  --text-muted: #524b45;         /* Subdued metadata, dates, labels */
  --accent-solid: #18181b;       /* Solid ink accent for buttons & key links */
  --accent-badge-bg: #f0eee9;    /* Neutral ink pill badge background */
  --accent-badge-text: #18181b;  /* Neutral ink pill badge text */
}
```

Every text value above clears the AAA floor (7:1) against **all three** surfaces it is ever rendered on — canvas, white panel, and hover/badge (`#f0eee9`) — not just against the canvas. That distinction matters: `--text-muted` is used at 11px inside tag pills whose background is `--bg-surface-hover`, so a value that only clears 7:1 on the canvas would still fail where it is actually used.

### 2.2 Token Mapping Table

| Token | Value | Contrast (canvas / surface / hover) | Visual Purpose |
|---|---|---|---|
| `--bg-canvas` | `#f7f7f5` | — | Page background, body background |
| `--bg-surface` | `#ffffff` | 1.07 vs canvas | Bento cards, project cards, experience cards |
| `--bg-surface-hover` | `#f0eee9` | 1.08 vs canvas | Hover states on interactive cards, buttons, pills |
| `--border-subtle` | `#d5d0c7` | 1.43 / 1.54 / 1.32 | 1px card borders, dividers, section headers |
| `--border-strong` | `#aca69c` | 2.25 / 2.42 / 2.08 | Active borders, card hover borders |
| `--text-primary` | `#18181b` | 16.52 / 17.72 / 15.28 | Primary headings, author name, key titles |
| `--text-secondary` | `#4a443f` | 8.94 / 9.59 / 8.27 | Narrative body text, summaries, descriptions |
| `--text-muted` | `#524b45` | 7.99 / 8.57 / 7.39 | Dates, timelines, tech stack labels, footer |
| `--accent-solid` | `#18181b` | 16.52 | Primary CTAs, active filter buttons, link arrows |
| `--accent-badge-bg` | `#f0eee9` | 1.08 vs canvas | Category pills, active nav pills, badge backgrounds |
| `--accent-badge-text` | `#18181b` | 15.28 on badge bg | Category pill text, badge labels |

Border values are deliberately below the 3:1 non-text threshold and are *not* focus indicators — see §1.5. Focus indicators use the ink accent at 16.52:1 and must be verified separately. `--accent-solid` is not listed as a focus ring: an ink ring on an ink button is invisible, which is the exact defect this palette must not reproduce.

---

## 3. Component & Layout Specifications

### 3.1 Global Header & Navigation (`src/components/layout/AppLayout.tsx`)
- **Layout**: Unchanged.
- **Header**: Sticky backdrop blur with `bg-canvas/90 backdrop-blur-md border-b border-border-subtle`.
- **Brand Name**: "Palm Suksawasdi" in `text-text-primary hover:text-accent-solid font-semibold`.
- **Active Navigation Pill**: Uses `bg-accent-badge-bg text-accent-badge-text font-semibold border border-border-subtle`.
- **Inactive Nav Links**: `text-text-secondary hover:text-text-primary hover:bg-surface-hover`.
- **Footer**: `border-t border-border-subtle text-text-muted hover:text-text-primary`.

### 3.2 Hero Narrative (`src/components/home/HeroNarrative.tsx`)
- **Layout**: Unchanged.
- **Top Label**: Clean uppercase mono name and title without any status badges: `Palm Suksawasdi · Applied AI & FullStack Development`.
- **Title Typing Effect**: Deep ink `#18181b` text with smooth token streaming.
- **Primary CTA**: "Explore Projects" button with solid ink `bg-accent-solid text-white hover:bg-neutral-800`.
- **Secondary Actions**: Monochromatic surface buttons (`bg-surface text-text-primary border border-border-subtle hover:bg-surface-hover`).
- **Profile Image**: Rounded circular portrait with warm border `border-border-subtle hover:border-border-strong`.
- **Status Tag Line Policy**: **Strictly no status tag line** (no availability badge, no "Open to work" tag).

### 3.3 Bento Grid & Featured Projects (`src/components/home/BentoGrid.tsx`)
- **Layout**: Unchanged 2-column bento card grid.
- **Card Background**: Pure white `bg-surface` with `border border-border-subtle hover:border-border-strong hover:bg-surface-hover/30`.
- **Category & Timeline**: Category in `font-semibold text-accent-solid` and timeline in `text-text-muted`.
- **Metric Pill**: `bg-canvas border border-border-subtle text-text-secondary`.
- **Tech Stack Badges**: `bg-surface-hover text-text-muted border border-border-subtle`.
- **Case Study Link**: `text-accent-solid hover:underline` with animated arrow indicator.

### 3.4 Projects Catalog (`src/views/ProjectsView.tsx`)
- **Layout**: Unchanged header and 2-column catalog grid.
- **Category Filter Pills**:
  - Selected / Active: `bg-accent-solid text-white border-accent-solid font-bold`. Count badge in `bg-white text-accent-solid`.
  - Unselected / Inactive: `bg-surface text-text-secondary border-border-subtle hover:text-text-primary hover:bg-surface-hover`.
- **Project Cards**: Clean white surfaces, subtle borders, high-contrast typography, and external link icons in `text-text-muted hover:text-text-primary`.

### 3.5 Experience Timeline (`src/views/ExperienceView.tsx`)
- **Layout**: Unchanged chronological timeline & categorized skills grid.
- **Timeline Rail**: `border-l border-border-subtle`.
- **Timeline Bullet Node**: `bg-accent-solid` for active role, `bg-text-muted` for past roles, both with `border-2 border-canvas`.
- **Tags & Highlights**: Warm neutral pills (`bg-accent-badge-bg text-accent-badge-text border border-border-subtle`).

### 3.6 Case Study Deep Dives (`src/views/CaseStudyView.tsx`)
- **Layout**: Unchanged 4-part case study section layout.
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
| `DESIGN.md` | Update design specification to record ElevenLabs Editorial (Light Mode Only, strictly no status tag line, strict layout invariance). |

---

## 5. Verification & Testing Guardrails

1. **Automated Unit & Integration Tests**:
   - Run `npm test` across all test files to ensure a 100% pass rate with no regressions.
2. **Contrast Verification** — measured on the **built** site, not from this document:
   - Every text token (`--text-primary`, `--text-secondary`, `--text-muted`, `--accent-badge-text`) must clear **7:1 against every surface it is actually rendered on** — canvas, white panel, and hover/badge background. Checking only against the canvas is insufficient; `--text-muted` at 11px inside tag pills sits on `--bg-surface-hover`.
   - The **focus indicator** must clear 3:1 against the control it sits on (WCAG 1.4.11 / 2.4.13). Verify by measuring computed styles on a keyboard-focused accent button — an ink ring on an ink button measures 1:1 and is invisible.
   - `--border-subtle` and `--border-strong` are decorative grouping and are exempt from 3:1 by §1.5; verify instead that they are *perceptible* (≥1.4:1) and that no card relies on them alone for a boundary a user must see.
3. **Status Chrome**:
   - Ensure zero status pills, badges, or availability dots are rendered. One factual prose availability line rendered from `profile.status` is expected and permitted per §1.3.
4. **Layout Invariance**:
   - Verify zero layout delta across all 4 routes (`/`, `/projects`, `/projects/:slug`, `/experience`) — compare element geometry or screenshot-diff against pre-change captures, since §1.4 makes this a hard constraint.
5. **Build & Type Check**:
   - Run `npm run build` (`tsc && vite build`) to ensure clean compilation.
