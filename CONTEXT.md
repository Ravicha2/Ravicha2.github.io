# Personal Website Context & Design System

## Domain Glossary

### Architecture & Build Pipeline
- **Build Engine**: Vite + Vanilla JS / Web Components, emitting optimized static multi-page HTML/CSS/JS assets for GitHub Pages deployment.
- **Native Cross-Document & Component View Transitions**: Native CSS `@view-transition { navigation: auto; }` and `document.startViewTransition()` for component state transitions, using `pagereveal` and `pageswap` for cross-document lifecycle management.
- **Component Model**: Reusable, lightweight Vanilla Web Components / Custom Elements for modularity without heavy runtime framework overhead.
- **Performance & Asset Pipeline**: Self-hosted variable fonts (Geist / Geist Mono), AVIF/WebP image compression, hover-based speculative prefetching, and `<link rel="expect">` render anchors to eliminate timeout errors.

### Visual & Motion Language
- **No-Gradient Adaptive Minimalist**: Strict avoidance of CSS gradients. Solid backgrounds (Zinc-950 `#09090b` dark / Porcelain `#fafafa` light), 1px hairline borders (`border-zinc-800` / `border-zinc-200`), high-contrast typography, and single solid accent.
- **Picture-in-Picture & Shared-Element Morphing**: Dynamic Just-in-Time `view-transition-name` assignment in `pageswap`/`pagereveal` morphing thumbnails directly to detail heroes, anchoring persistent navigation, and applying `object-fit: cover` with custom cubic-bezier timing (`cubic-bezier(0.2, 0, 0, 1)`) to guarantee 0 warping and 0ms perceived latency.
- **Progressive Enhancement**: Seamless execution in Chrome/Safari 18.2+ with automatic graceful zero-delay fallback for older browsers and pure CSS `prefers-reduced-motion` compliance.

## Resolved Decisions
1. **Interaction Model**: Cross-document View Transitions with shared element picture-in-picture component morphing based on the modern `@view-transition` CSS standard.
2. **Tech Stack**: Vite + Vanilla JS / Web Components producing multi-page static output for GitHub Pages.
3. **Visual Aesthetic**: Adaptive High-Contrast Minimalist (Dark/Light mode) with pure solid colors, hairline borders, and zero gradients.
4. **Site Structure & Scope**: Focused purely on curated portfolio, engineering case studies, and resume (Home, Work/Projects, Experience/Resume, and Project Case Study detail pages; legacy quiz removed).
5. **Transition Choreography**: JIT `view-transition-name` on `pageswap`/`pagereveal` with anchored header/nav, aspect-ratio preserved image/card scaling, and effortless cross-fade for secondary content.
6. **Asset & Performance Engine**: Self-hosted Geist/Geist Mono fonts, optimized media, speculative prefetching, and render-blocking expectation anchors.
7. **Compatibility & Accessibility**: Progressive enhancement with native graceful degradation and CSS media query motion suppression.
