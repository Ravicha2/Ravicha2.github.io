# ADR 0002: React + Tailwind CSS Single-Page Application (SPA) Architecture

## Context
The website was originally conceptualized as a multi-page static HTML build with vanilla web components. However, to support rich interactive components (project category filters, deep-linkable case study routing, dynamic theme state, and modern UI transitions) with clean developer velocity and maintainable styling, a modern client-side framework is desired.

## Decision
We adopt a **Single-Page Application (SPA)** architecture powered by:
- **Build Tool**: Vite + TypeScript
- **UI Framework**: React 18 / 19
- **Styling**: Tailwind CSS (strictly configured for high-contrast, zero-gradient solid design tokens)
- **Routing**: React Router with deep-linkable routes (`/`, `/projects`, `/projects/:slug`, `/experience`)
- **Transitions**: Native React View Transitions (`document.startViewTransition()`) for shared-element morphs and route cross-fades
- **GitHub Pages Routing**: A lightweight `404.html` SPA redirect handler in `public/` to support direct deep-linking on static hosts.
- **AI Agent Protocol**: Static `/public/llms.txt` and `/public/llms-full.txt` served directly for bots without client JS execution.

## Consequences
### Positive
- **Component Modularity**: Reusable, type-safe React components for project cards, case studies, and timeline entries.
- **Velocity & Consistency**: Utility-first styling via Tailwind CSS enforces the strict solid zinc/porcelain token palette effortlessly.
- **Deep-Linkable Case Studies**: Direct URLs for individual case studies (e.g. `/projects/shepherd`, `/projects/nl2regex`).
- **Instantaneous Client Navigation**: Zero full-page refreshes during browsing.

### Negative / Trade-offs
- Requires client-side JavaScript execution for human browsing (mitigated for AI bots/crawlers by serving pure static markdown via `/llms.txt` and `/llms-full.txt`).
- Requires a `404.html` redirect script for direct deep-link reloads on GitHub Pages.
