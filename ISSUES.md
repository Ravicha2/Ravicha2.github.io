# GitHub Issues & Vertical Slices (Tracer Bullets)

All issues have been created in the repository [Ravicha2/Ravicha2.github.io](https://github.com/Ravicha2/Ravicha2.github.io/issues).

---

### [#1: [HITL] Profile Narrative Arc, Storytelling & Case Study Framework](https://github.com/Ravicha2/Ravicha2.github.io/issues/1) ✅ CLOSED
- **Type**: `HITL`
- **Scope**: Define developer narrative, 4-part case study framework (*Intuition → Problem Encountered → Why Built This Way → Outcomes*), and curated project roster.

### [#2: [AFK] Human Accessibility Engine (WCAG AAA, Keyboard Flow & Reduced Motion)](https://github.com/Ravicha2/Ravicha2.github.io/issues/2) ✅ CLOSED
- **Type**: `AFK`
- **Blocked by**: None (Can start immediately)
- **Scope**: Semantic React HTML landmarks, high-contrast solid tokens (WCAG AAA), `focus-visible` keyboard rings, and `prefers-reduced-motion` motion suppression.

### [#3: [AFK] React + Tailwind CSS + Vite SPA Build Pipeline & Design Tokens](https://github.com/Ravicha2/Ravicha2.github.io/issues/3) ✅ CLOSED
- **Type**: `AFK`
- **Blocked by**: None (Can start immediately)
- **Scope**: Vite + React + TypeScript + Tailwind CSS setup for GitHub Pages, self-hosted `Geist Sans`/`Geist Mono` fonts, solid dark/light design tokens (zero gradients), and `404.html` SPA routing script.

### [#4: [AFK] AI Agent & Bot Accessibility Protocol (llms.txt, JSON-LD, SEO & Structured Data)](https://github.com/Ravicha2/Ravicha2.github.io/issues/4)
- **Type**: `AFK`
- **Blocked by**: None (Unblocked by #1)
- **Scope**: Implement static `/public/llms.txt`, `/public/llms-full.txt`, JSON-LD structured schemas (`schema.org/Person`, `ProfilePage`, `SoftwareSourceCode`), OpenGraph meta, and `sitemap.xml`.

### [#5: [AFK] React SPA View Transition Engine (Route Morphs & Cross-Fade)](https://github.com/Ravicha2/Ravicha2.github.io/issues/5)
- **Type**: `AFK`
- **Blocked by**: [#3](https://github.com/Ravicha2/Ravicha2.github.io/issues/3)
- **Scope**: React client-side `document.startViewTransition()` wrapper for route changes, thumbnail-to-case-study shared element morphs with `view-transition-name`, and root cross-fade fallback.

### [#6: [AFK] Home Page & Shared-Element Bento Deck Component (HomeView)](https://github.com/Ravicha2/Ravicha2.github.io/issues/6) ✅ CLOSED
- **Type**: `AFK`
- **Blocked by**: [#1](https://github.com/Ravicha2/Ravicha2.github.io/issues/1), [#3](https://github.com/Ravicha2/Ravicha2.github.io/issues/3), [#5](https://github.com/Ravicha2/Ravicha2.github.io/issues/5)
- **Scope**: Home view React component (`/`) with hero narrative, status badge, persistent navigation dock, and 4 featured Bento case study cards.

### [#7: [AFK] Projects Catalog & Case Study Detail Views (ProjectsView & CaseStudyView)](https://github.com/Ravicha2/Ravicha2.github.io/issues/7) ✅ CLOSED
- **Type**: `AFK`
- **Blocked by**: [#1](https://github.com/Ravicha2/Ravicha2.github.io/issues/1), [#5](https://github.com/Ravicha2/Ravicha2.github.io/issues/5), [#6](https://github.com/Ravicha2/Ravicha2.github.io/issues/6)
- **Scope**: Filterable React project catalog (`/projects`) and deep-dive case study routes (`/projects/:slug`) adhering to the 4-part framework.

### [#8: [AFK] Engineering Experience Timeline Component (ExperienceView)](https://github.com/Ravicha2/Ravicha2.github.io/issues/8) ✅ CLOSED
- **Type**: `AFK`
- **Blocked by**: [#1](https://github.com/Ravicha2/Ravicha2.github.io/issues/1), [#3](https://github.com/Ravicha2/Ravicha2.github.io/issues/3), [#5](https://github.com/Ravicha2/Ravicha2.github.io/issues/5)
- **Scope**: Chronological experience timeline component (`/experience`), technical metric badges, and categorized skills matrix.

### [#9: [HITL] End-to-End Quality Audit & GitHub Pages Verification](https://github.com/Ravicha2/Ravicha2.github.io/issues/9)
- **Type**: `HITL`
- **Blocked by**: [#2](https://github.com/Ravicha2/Ravicha2.github.io/issues/2), [#4](https://github.com/Ravicha2/Ravicha2.github.io/issues/4), [#6](https://github.com/Ravicha2/Ravicha2.github.io/issues/6), [#7](https://github.com/Ravicha2/Ravicha2.github.io/issues/7), [#8](https://github.com/Ravicha2/Ravicha2.github.io/issues/8)
- **Scope**: Lighthouse audit, SPA deep-link routing test on GitHub Pages, View Transition verification, `llms.txt` curl check, and live verification.
