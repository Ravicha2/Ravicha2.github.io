# ADR 0001: Native Cross-Document View Transitions with Vite & Web Components

## Context
The goal is to build an instantaneous, seamless personal website with a clean, no-gradient aesthetic and shared-element ("picture-in-picture") transitions between components and pages.

Traditionally, smooth page transitions require heavy Single-Page Application (SPA) client-side routers (e.g. Next.js, React Router, Framer Motion) which introduce JavaScript runtime overhead, hydration delays, and bundle bloat.

## Decision
We adopt **Native Multi-Page Cross-Document View Transitions** (`@view-transition { navigation: auto; }`) powered by a lightweight **Vite + Vanilla Web Components** static build pipeline.
- We utilize the CSS `@view-transition` standard with `pageswap` and `pagereveal` lifecycle events for Just-In-Time `view-transition-name` element matching.
- We strictly target pseudo-elements (`::view-transition-old` / `::view-transition-new`) with `object-fit: cover` to eliminate aspect-ratio warping.
- We safeguard against the native 4-second timeout by using self-hosted fonts, pre-rendered static HTML, optimized local assets, and `<link rel="expect">` anchors.

## Consequences
### Positive
- **0kb JS Framework Overhead**: Fast Time-To-Interactive (TTI) and First Contentful Paint (FCP).
- **Native GPU Acceleration**: Browser compositor executes animations smoothly on dedicated threads.
- **Progressive Enhancement**: Browsers without `@view-transition` support seamlessly execute instant MPA page loads without breakage.
- **Clean Separation of Concerns**: Multi-page HTML files hosted cleanly on GitHub Pages.

### Negative / Trade-offs
- Requires modern Chromium or Safari 18.2+ for active transition effects (unsupported browsers gracefully fall back to standard instant MPA navigation).
- Dynamic transition naming requires coordination via `pageswap` / `pagereveal` scripts across HTML documents.
