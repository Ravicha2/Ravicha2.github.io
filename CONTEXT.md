# Personal Website Context & Design System

## Domain Glossary

### Architecture & Build Pipeline
- **Build Engine**: Vite + React 18/19 + TypeScript + Tailwind CSS, emitting an optimized Single-Page Application (SPA) for GitHub Pages deployment.
- **Client-Side Routing & Transitions**: React Router with native `document.startViewTransition()` for smooth client-side route changes and shared-element project morphs, with a `404.html` fallback script for direct deep-linking on GitHub Pages.
- **Component Model**: Reusable, type-safe React components with Lucide icons and Tailwind utility styling without heavy runtime bloat.
- **Performance & Asset Pipeline**: Self-hosted variable fonts (Geist / Geist Mono), optimized WebP/AVIF images, static `/public/llms.txt` and `/public/llms-full.txt` files for AI agent bots.

### Visual & Motion Language
- **No-Gradient Adaptive Minimalist**: Strict avoidance of CSS gradients. Solid backgrounds (Zinc-950 `#09090b` dark / Porcelain `#fafafa` light), 1px hairline borders (`border-zinc-800` / `border-zinc-200`), high-contrast typography, and single solid accent.
- **Shared-Element Morphing & Route Cross-Fades**: Client-side View Transitions assigning `view-transition-name` to thumbnails morphing smoothly into project detail heroes (`/projects/:slug`), with `object-fit: cover` and custom cubic-bezier timing (`cubic-bezier(0.2, 0, 1, 1)`).
- **Progressive Enhancement**: Smooth execution in modern browsers with graceful instantaneous fallback when `document.startViewTransition` is not supported, fully honoring `prefers-reduced-motion`.

## Resolved Decisions
1. **Tech Stack**: Vite + React + TypeScript + Tailwind CSS (SPA) deployed to GitHub Pages.
2. **Interaction & Routing Model**: Multi-Route React SPA (`/`, `/projects`, `/projects/:slug`, `/experience`) with native React View Transitions and SPA deep-link routing.
3. **Visual Aesthetic**: Adaptive High-Contrast Minimalist (Dark/Light mode) with pure solid colors, hairline borders, and zero gradients.
4. **Site Structure & Scope**: Focused purely on curated portfolio, engineering case studies, and resume (Home, Projects Catalog, Project Case Study detail pages, Experience/Resume).
5. **Asset & Performance Engine**: Self-hosted Geist/Geist Mono fonts, optimized media, static `/llms.txt` in `public/`.
6. **Compatibility & Accessibility**: Progressive enhancement with WCAG AAA contrast and CSS media query motion suppression.
