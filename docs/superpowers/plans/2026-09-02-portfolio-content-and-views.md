# Portfolio Content & Full Views Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Populate complete personal narrative, structured data models, rich HomeView Bento showcase, filterable Projects catalog with 4-part case study deep-dives, and comprehensive Experience timeline with education, publications, and skills from `elevator-pitch.md`, `Ravicha_cv.typ`, and `index.html`.

**Architecture:**
- **Typed Data Layer (`src/data/`)**: Centralized, type-safe data modules for `profile.ts`, `projects.ts`, and `experience.ts`.
- **Component & View Architecture (`src/views/` & `src/components/`)**:
  - `HomeView`: Hero with narrative arc ("Automotive to AI"), status badge, 4 featured Bento case study cards, and quick career snapshot.
  - `ProjectsView`: Filterable grid with category pills (`All`, `Agentic AI & MCP`, `Distributed Systems`, `Graph & Knowledge`, `Robotics`).
  - `CaseStudyView`: Full 4-part case study deep dive (*1. Intuition & Friction → 2. Problem Encountered → 3. Why Built This Way → 4. Outcomes & Verification*) with technical metrics and links.
  - `ExperienceView`: Career timeline (Tendor, NodesNow, 3D Technical Design, Schindler), education milestones (UNSW, IMT Atlantique, Chulalongkorn), IEEE publication, Hack2Heal award, and skills matrix.

**Tech Stack:** React 18, React Router 6, TypeScript 5.7, Tailwind CSS 3.4, Lucide React icons, Vitest, Testing Library.

## Global Constraints
- Strict zero-gradient rule: Pure solid background contrast tokens (`canvas`, `surface`, `border-subtle`, `accent-solid`).
- Self-hosted variable Geist fonts.
- WCAG AAA color contrast compliance ($\ge 7.0:1$).
- High information density, narrative depth, and engineering rationale without fluff.

---

### Task 1: Type-Safe Data Layer (`profile.ts`, `projects.ts`, `experience.ts`)

**Files:**
- Create: `src/data/types.ts`
- Create: `src/data/profile.ts`
- Create: `src/data/projects.ts`
- Create: `src/data/experience.ts`
- Test: `tests/data/data-integrity.test.ts`

- [ ] **Step 1: Write data integrity test**
Validate that all project slugs are unique, all 4 flagship projects contain the 4-part case study fields, all experience items contain valid dates and descriptions, and profile links are complete.

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test -- tests/data/data-integrity.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement data models and content**
Fill in complete data from `elevator-pitch.md`, `Ravicha_cv.typ`, and `docs/superpowers/specs/2026-09-01-profile-narrative-and-case-studies-design.md`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test -- tests/data/data-integrity.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
`git commit -m "feat(data): add comprehensive typed data models for profile, projects, and experience"`

---

### Task 2: Home Page & Bento Showcase (`HomeView.tsx`)

**Files:**
- Create: `src/views/HomeView.tsx`
- Create: `src/components/home/HeroNarrative.tsx`
- Create: `src/components/home/BentoGrid.tsx`
- Modify: `src/App.tsx`
- Test: `tests/views/HomeView.test.tsx`

- [ ] **Step 1: Write test for HomeView component**
Verify hero text, narrative pivot ("Automotive to AI"), status badge, and 4 Bento case study cards.

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test -- tests/views/HomeView.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement HomeView, HeroNarrative, and BentoGrid**
Build accessible, solid-contrast Bento grid with high visual hierarchy.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test -- tests/views/HomeView.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
`git commit -m "feat(home): implement HomeView with hero narrative and bento case study cards"`

---

### Task 3: Filterable Projects Catalog & 4-Part Case Study Views (`ProjectsView.tsx`, `CaseStudyView.tsx`)

**Files:**
- Create: `src/views/ProjectsView.tsx`
- Create: `src/views/CaseStudyView.tsx`
- Modify: `src/App.tsx`
- Test: `tests/views/ProjectsView.test.tsx`
- Test: `tests/views/CaseStudyView.test.tsx`

- [ ] **Step 1: Write test for ProjectsView and CaseStudyView**
Verify category filtering, project cards, 4-part case study section rendering, and 404 fallback for invalid slugs.

- [ ] **Step 2: Run tests to verify they fail**
Run: `npm test -- tests/views/ProjectsView.test.tsx tests/views/CaseStudyView.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement ProjectsView and CaseStudyView**
Implement category filtering tabs and comprehensive 4-part case study layout (*Intuition → Root Problem → Why Built This Way → Outcomes*).

- [ ] **Step 4: Run tests to verify they pass**
Run: `npm test -- tests/views/ProjectsView.test.tsx tests/views/CaseStudyView.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
`git commit -m "feat(projects): implement filterable ProjectsView and 4-part CaseStudyView"`

---

### Task 4: Engineering Experience, Education & Accolades Timeline (`ExperienceView.tsx`)

**Files:**
- Create: `src/views/ExperienceView.tsx`
- Modify: `src/App.tsx`
- Test: `tests/views/ExperienceView.test.tsx`

- [ ] **Step 1: Write test for ExperienceView**
Verify rendering of work experience timeline (Tendor, NodesNow, 3D Technical Design, Schindler), education (UNSW, IMT Atlantique, Chulalongkorn), IEEE publication, Hack2Heal accolade, and categorized skills matrix.

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test -- tests/views/ExperienceView.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement ExperienceView**
Build clean timeline components with hairline borders and skill tag chips.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm test -- tests/views/ExperienceView.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
`git commit -m "feat(experience): implement ExperienceView with career timeline, education, publication, and skills matrix"`

---

### Task 5: End-to-End Test Suite & Clean Production Build

**Files:**
- Run: `npm test`
- Build: `npm run build`
- Verify with `ego-browser`

- [ ] **Step 1: Run full test suite**
Run: `npm test`
Expected: All tests pass.

- [ ] **Step 2: Run production build**
Run: `npm run build`
Expected: Clean build to `dist/`.

- [ ] **Step 3: Commit and verify via ego-browser**
`git commit -m "chore: final content and view integration verification"`
