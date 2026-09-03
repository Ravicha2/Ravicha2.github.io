# Design Specification: AI Agent & Bot Accessibility Protocol (llms.txt, JSON-LD, SEO & Structured Data)

- **Date**: 2026-09-03
- **GitHub Issue**: [#4: [AFK] AI Agent & Bot Accessibility Protocol (llms.txt, JSON-LD, SEO & Structured Data)](https://github.com/Ravicha2/Ravicha2.github.io/issues/4)
- **Status**: Approved

---

## 1. Overview & Objectives

This specification defines the machine-readable accessibility protocols and semantic structured data implementation for Palm Suksawasdi's portfolio ([Ravicha2.github.io](https://ravicha2.github.io)).

The goal is to enable AI agents (such as ChatGPT, Claude Code, Perplexity, Cursor, and custom agentic MCP clients) and search engine web crawlers to discover, ingest, and accurately reason over Palm's engineering background, 4-part case studies, technical competencies, and project repositories.

---

## 2. Deliverables & Technical Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │             AI Agent & Bot Access            │
                               └──────────────────────┬───────────────────────┘
                                                      │
                       ┌──────────────────────────────┼──────────────────────────────┐
                       │                              │                              │
         ┌─────────────▼─────────────┐  ┌─────────────▼─────────────┐  ┌─────────────▼─────────────┐
         │      AI Protocols         │  │     Crawler Protocols     │  │   SEO & Structured Data   │
         │  (/public/llms.txt)       │  │  (/public/robots.txt)     │  │  (index.html + SEOHead)   │
         │  (/public/llms-full.txt)  │  │  (/public/sitemap.xml)    │  │  (JSON-LD / OpenGraph)    │
         └───────────────────────────┘  └───────────────────────────┘  └───────────────────────────┘
```

---

## 3. Detailed Specifications

### 3.1 AI Protocols: `/public/llms.txt` & `/public/llms-full.txt`

#### 3.1.1 `/public/llms.txt` (llmstxt.org Standard Summary Index)
- **Header**: `# Palm Suksawasdi - Portfolio & Systems Engineering`
- **Blockquote**: One-line role summary: `Applied AI & Backend Systems Engineer specializing in fault-tolerant multi-agent pipelines, GraphRAG architectural compliance, and distributed data engines.`
- **Quick Links**: Direct links to `/llms-full.txt`, GitHub (`https://github.com/Ravicha2`), LinkedIn (`https://www.linkedin.com/in/ravicha-suksawasdi-na-ayuthaya/`), PyPI (`https://pypi.org/project/lit-review-council/`), and Email (`mailto:rsuksawasdi@gmail.com`).
- **Core Projects Index**:
  - `Shepherd`: GraphRAG Architectural Decision Graph compliance detector (FastAPI, Neo4j, Cypher, GitHub Actions).
  - `NL2REGEX`: Distributed PySpark + Celery/Redis engine for million-row natural-language regex transformations with 2-stage LLM triage.
  - `Document Ingestion Agent`: Durable event-driven document ingestion using Inngest step functions and dual pgvector/Neo4j storage.
  - `Lit-Review-Council`: Multi-agent consensus literature review MCP server with 3-reviewer Borda-count voting.
  - `Supporting Projects`: Dynamic DB Chatbot Agent, 6-DOF Robotic Probe Tracking (IEEE TENCON 2023), Heal Community Platform (Hack2Heal Founder's Choice Award).
- **Categorized Skills Snapshot**: Languages, Frameworks, Databases, and Infrastructure.
- **Site Navigation Map**: Standard markdown link index pointing to all site routes (`/`, `/projects`, `/projects/:slug`, `/experience`).

#### 3.1.2 `/public/llms-full.txt` (Complete Technical Dossier)
- **Comprehensive Profile Narrative**:
  - Educational foundation: Master of IT at UNSW Sydney (WAM 83 / Distinction, graduating Dec 2026), B.Eng. Automotive Design & Manufacturing Engineering at Chulalongkorn, IoT exchange at IMT Atlantique (France).
  - Systems-first engineering mindset: Treating non-deterministic AI models as untrusted components within deterministic software architectures (explicit state machines, graph verification, durable retry loops).
- **Full 4-Part Case Studies**:
  - Complete deep-dives for *Shepherd*, *NL2REGEX*, *Document Ingestion Agent*, and *Lit-Review-Council*.
  - Every case study contains:
    1. *The Core Intuition & Spark*: Underlying hypothesis and real-world friction.
    2. *The Naive Failure Mode & Breaking Problems*: Hallucinated schemas, ReDoS lockups, orphaned DB state, vector retrieval blindspots.
    3. *Why Built This Way*: Architectural choices (ADR references, trade-offs, defensive guardrails, timeouts, idempotency keys).
    4. *Outcomes & Verification*: Automated benchmarks, CI integration, PyPI deployment, and key engineering takeaways.
- **Full Work Experience History**:
  - Tendor (Software Engineer Intern, Jul 2026 – Present)
  - NodesNow LLC (Backend Engineer Intern, Dec 2025 – Feb 2026)
  - 3D Technical Design (District Heating Designer, Aug 2023 – Jan 2025)
  - Jardine Schindler Group (Systems Engineering Intern, Jun 2022 – Aug 2022)
- **Publications, Accolades & Complete Skill Matrix**.

---

### 3.2 Search Engine & Crawler Protocols

#### 3.2.1 `/public/robots.txt`
- Clear crawling policy allowing all lawful crawlers (`User-agent: *`).
- Explicit welcoming rules for AI crawlers: `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, `cohere-ai`.
- Sitemap declaration: `Sitemap: https://ravicha2.github.io/sitemap.xml`.
- Discovery pointer: `# LLM Agent context: https://ravicha2.github.io/llms.txt`.

#### 3.2.2 `/public/sitemap.xml`
- Standard UTF-8 XML sitemap conforming to sitemaps.org schema (`http://www.sitemaps.org/schemas/sitemap/0.9`).
- Canonical entries for all 10 site routes:
  - `https://ravicha2.github.io/` (priority 1.0, changefreq monthly)
  - `https://ravicha2.github.io/projects` (priority 0.9, changefreq monthly)
  - `https://ravicha2.github.io/projects/shepherd` (priority 0.8, changefreq monthly)
  - `https://ravicha2.github.io/projects/nl2regex` (priority 0.8, changefreq monthly)
  - `https://ravicha2.github.io/projects/document-ingestion-agent` (priority 0.8, changefreq monthly)
  - `https://ravicha2.github.io/projects/lit-review-council` (priority 0.8, changefreq monthly)
  - `https://ravicha2.github.io/projects/node-api` (priority 0.7, changefreq monthly)
  - `https://ravicha2.github.io/projects/robotic-arm-ultrasound` (priority 0.7, changefreq monthly)
  - `https://ravicha2.github.io/projects/heal-a2a` (priority 0.7, changefreq monthly)
  - `https://ravicha2.github.io/experience` (priority 0.9, changefreq monthly)

---

### 3.3 Static Baseline & OpenGraph (`index.html`)

- **Standard Metadata**:
  - Charset `UTF-8`, Viewport `width=device-width, initial-scale=1.0`.
  - Primary title: `Palm Suksawasdi | Portfolio & Systems Engineering`.
  - Meta description: `Applied AI & Backend Systems Engineer specializing in fault-tolerant multi-agent pipelines, GraphRAG architectural compliance, and distributed data engines.`
  - Canonical link: `<link rel="canonical" href="https://ravicha2.github.io/" />`.
  - Author, keywords, and theme-color meta tags (`#09090b`).
- **OpenGraph Tags**:
  - `og:title`, `og:description`, `og:type` (`profile`), `og:url` (`https://ravicha2.github.io/`), `og:site_name`, `og:locale` (`en_US`).
- **Twitter Card Tags**:
  - `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`.
- **Static Baseline JSON-LD**:
  - Pre-rendered `schema.org/Person` and `schema.org/ProfilePage` in `<head>` so headless crawlers without JS receive complete identity schemas.

---

### 3.4 Dynamic JSON-LD & Client-Side Route Metadata (`SEOHead.tsx`)

A reactive component / hook `src/components/seo/SEOHead.tsx` (or `src/utils/seo.ts`) synchronizes route changes with document metadata and JSON-LD schema graphs:

1. **Document Title & Meta Description**:
   - Updates `document.title` and `<meta name="description">` to match the active view and project.
2. **Dynamic OpenGraph URL & Canonical Sync**:
   - Updates `<meta property="og:url">` and `<link rel="canonical">` to the active URL.
3. **Dynamic Schema Injection (`#dynamic-jsonld`)**:
   - **Home (`/`)**:
     - `schema.org/Person`: Name, alternateName, jobTitle, description, email, alumniOf (UNSW Sydney, Chulalongkorn University, IMT Atlantique), sameAs links.
     - `schema.org/ProfilePage`: Main entity pointing to Person.
   - **Project Detail (`/projects/:slug`)**:
     - `schema.org/SoftwareSourceCode` / `schema.org/TechArticle`: Project title, description, keywords, programmingLanguage, runtimePlatform, codeRepository, author (Person reference).
   - **Projects Catalog (`/projects`)**:
     - `schema.org/CollectionPage`: ItemList linking all projects.
   - **Experience (`/experience`)**:
     - `schema.org/AboutPage`: Comprehensive resume details and `schema.org/ScholarlyArticle` for the IEEE TENCON 2023 publication.

---

## 4. Verification & Testing Plan

1. **Static Protocol Verification**:
   - Verify `/public/llms.txt` and `/public/llms-full.txt` exist and are accessible at root path.
   - Validate `/public/robots.txt` formatting and sitemap directive.
   - Validate `/public/sitemap.xml` with standard XML linting and verify all 10 URLs.
2. **JSON-LD Schema Verification**:
   - Test JSON-LD outputs against Google Rich Results Test / Schema.org Validator structures for valid syntax and standard attributes.
3. **SPA Route Navigation & Meta Sync**:
   - Navigate across `/`, `/projects`, `/projects/:slug`, and `/experience`.
   - Verify document title, meta description, canonical link, and dynamic `#dynamic-jsonld` update cleanly on route transitions.
4. **Vite Production Build & Test**:
   - Run `npm run build` and `npm run test` to guarantee clean compilation without regressions.
