# AI Agent & Bot Accessibility Protocol Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement standardized machine-readable protocols (`/llms.txt`, `/llms-full.txt`), search crawler protocols (`/robots.txt`, `/sitemap.xml`), and dynamic JSON-LD structured schemas (`schema.org/Person`, `ProfilePage`, `SoftwareSourceCode`, `CollectionPage`, `AboutPage`) to maximize accessibility for AI agents and search engines.

**Architecture:** A static asset suite in `public/` provides instant, headless crawler accessibility for AI bots and search engines, while a type-safe JSON-LD generator and reactive `SEOHead` component synchronizes dynamic document titles, meta tags, and structured schemas on client-side SPA navigation.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, `@testing-library/react`, standard `schema.org` vocabulary, `llmstxt.org` specification.

## Global Constraints

- Do not introduce heavy third-party runtime dependencies (e.g. `react-helmet-async`); use focused, lightweight DOM head synchronization.
- All JSON-LD schemas must be strictly valid JSON conforming to Schema.org standards without syntax errors or unescaped entities.
- Keep `public/llms.txt` concise and structured as an index; place complete case study dossiers in `public/llms-full.txt`.
- Every task ends with a passing Vitest test suite and a git commit.

---

### Task 1: AI Agent Summary Index (`public/llms.txt`) & Comprehensive Dossier (`public/llms-full.txt`)

**Files:**
- Create: `public/llms.txt`
- Create: `public/llms-full.txt`
- Test: `tests/seo/llms-txt.test.ts`

**Interfaces:**
- Consumes: `src/data/profile.ts`, `src/data/projects.ts`, `src/data/experience.ts`
- Produces: Static `/llms.txt` and `/llms-full.txt` files served directly at root HTTP paths.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/seo/llms-txt.test.ts
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('AI Agent Protocol Files (llms.txt & llms-full.txt)', () => {
  const publicDir = path.resolve(__dirname, '../../public');
  const llmsTxtPath = path.join(publicDir, 'llms.txt');
  const llmsFullTxtPath = path.join(publicDir, 'llms-full.txt');

  it('verifies public/llms.txt exists and conforms to llmstxt.org structure', () => {
    expect(fs.existsSync(llmsTxtPath)).toBe(true);
    const content = fs.readFileSync(llmsTxtPath, 'utf-8');

    // Header & High level summary
    expect(content).toContain('# Palm (Ravicha) Suksawasdi Na Ayuthaya');
    expect(content).toContain('Applied AI & Backend Systems Engineer');
    expect(content).toContain('UNSW Sydney');

    // Pointer to full dossier
    expect(content).toContain('llms-full.txt');

    // Key projects
    expect(content).toContain('Shepherd');
    expect(content).toContain('NL2REGEX');
    expect(content).toContain('document-ingestion-agent');
    expect(content).toContain('lit-review-council');

    // Core links
    expect(content).toContain('https://github.com/Ravicha2');
    expect(content).toContain('https://www.linkedin.com/in/ravicha-suksawasdi-na-ayuthaya/');
    expect(content).toContain('https://pypi.org/project/lit-review-council/');
  });

  it('verifies public/llms-full.txt exists and contains complete case study dossiers', () => {
    expect(fs.existsSync(llmsFullTxtPath)).toBe(true);
    const content = fs.readFileSync(llmsFullTxtPath, 'utf-8');

    // Full narrative
    expect(content).toContain('Automotive Engineering');
    expect(content).toContain('IMT Atlantique');
    expect(content).toContain('WAM 83');

    // 4-Part case studies
    expect(content).toContain('1. The Core Intuition & Friction');
    expect(content).toContain('2. The Root Problem Encountered');
    expect(content).toContain('3. Why Built This Way');
    expect(content).toContain('4. Outcomes, Verification & Key Takeaways');

    // Technical details
    expect(content).toContain('GraphRAG');
    expect(content).toContain('Two-Stage LLM Triage (ADR 0003)');
    expect(content).toContain('Inngest');
    expect(content).toContain('Borda-Count Consensus');
    expect(content).toContain('TENCON 2023');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/seo/llms-txt.test.ts`
Expected: FAIL with `fs.existsSync(llmsTxtPath) == false`

- [ ] **Step 3: Write `public/llms.txt` and `public/llms-full.txt`**

Create `public/llms.txt`:
```markdown
# Palm (Ravicha) Suksawasdi Na Ayuthaya - Portfolio & Systems Engineering

> Applied AI & Backend Systems Engineer specializing in fault-tolerant multi-agent pipelines, GraphRAG architectural compliance, and distributed data engines.

- **Current Status**: Master of IT Candidate at UNSW Sydney (WAM 83 / Distinction, graduating Dec 2026) · Open to full-time Applied AI & Backend Systems roles.
- **Full Dossier**: [https://ravicha2.github.io/llms-full.txt](https://ravicha2.github.io/llms-full.txt)
- **Primary Website**: [https://ravicha2.github.io/](https://ravicha2.github.io/)
- **GitHub**: [https://github.com/Ravicha2](https://github.com/Ravicha2)
- **LinkedIn**: [https://www.linkedin.com/in/ravicha-suksawasdi-na-ayuthaya/](https://www.linkedin.com/in/ravicha-suksawasdi-na-ayuthaya/)
- **Email**: [mailto:rsuksawasdi@gmail.com](mailto:rsuksawasdi@gmail.com)

---

## Flagship Projects & Engineering Case Studies

- [Shepherd: GraphRAG Compliance Engine](https://ravicha2.github.io/projects/shepherd): Automated Architectural Decision Record (ADR) violation detector for AI-generated code, ingesting ASTs and architectural markdown into Neo4j property graphs to catch multi-file constraint violations before merge. GitHub: [https://github.com/Ravicha2/Shepherd](https://github.com/Ravicha2/Shepherd).
- [NL2REGEX: Distributed Regex Engine](https://ravicha2.github.io/projects/nl2regex): Distributed natural language to regex engine for million-row datasets, backed by PySpark, Celery, and Redis with 2-stage LLM schema triage. GitHub: [https://github.com/Ravicha2/NL2REGEX](https://github.com/Ravicha2/NL2REGEX) · Live: [http://207.148.87.49](http://207.148.87.49).
- [Fault-Tolerant Document Ingestion Agent](https://ravicha2.github.io/projects/document-ingestion-agent): Production event-driven AI ingestion engine using Inngest durable steps, NestJS, and dual pgvector/Neo4j storage to eliminate orphaned state during multi-stage document processing. GitHub: [https://github.com/Ravicha2/document-ingestion-agent](https://github.com/Ravicha2/document-ingestion-agent).
- [Lit-Review-Council MCP Server](https://ravicha2.github.io/projects/lit-review-council): Multi-agent literature review consensus engine and Model Context Protocol (MCP) server that orchestrates parallel academic/practitioner research with Borda-count voting. PyPI: [https://pypi.org/project/lit-review-council/](https://pypi.org/project/lit-review-council/) · GitHub: [https://github.com/Ravicha2/lit-review-council](https://github.com/Ravicha2/lit-review-council).

## Supporting Projects

- [Chatbot Agent with Dynamic DB Tools](https://ravicha2.github.io/projects/node-api): Conversational agent with dynamic database schema inspection and tool calling (TypeScript, Express, LangChain, PostgreSQL). GitHub: [https://github.com/Ravicha2/node-api](https://github.com/Ravicha2/node-api).
- [6-DOF Robotic Arm for Medical Ultrasonography](https://ravicha2.github.io/projects/robotic-arm-ultrasound): Passive probe tracking system with sub-millimeter position accuracy (C, MATLAB). Published at IEEE TENCON 2023: [https://ieeexplore.ieee.org/document/10349000](https://ieeexplore.ieee.org/document/10349000).
- [Heal: Community Mental Health Support](https://ravicha2.github.io/projects/heal-a2a): Real-time peer matching platform recognized with Founder's Choice Award at Hack2Heal. Live: [https://heal.a2a.ing](https://heal.a2a.ing).

## Core Technical Skills

- **Languages**: Python, TypeScript, JavaScript, SQL, C++, C, Bash, HTML/CSS.
- **Frameworks & Orchestration**: FastAPI, NestJS, React, Google ADK, LangGraph, Inngest, Celery, Django, PySpark.
- **Databases & Knowledge Systems**: PostgreSQL, Neo4j, Apache AGE, pgvector, Redis, Apache Spark, Hadoop.
- **Cloud, DevOps & Protocols**: Docker, Docker Compose, AWS (S3, EC2), GitHub Actions, uv, uvx, Model Context Protocol (MCP).

## Site Navigation

- Overview & Bio: [https://ravicha2.github.io/](https://ravicha2.github.io/)
- Projects Catalog: [https://ravicha2.github.io/projects](https://ravicha2.github.io/projects)
- Experience & Resume: [https://ravicha2.github.io/experience](https://ravicha2.github.io/experience)
```

Create `public/llms-full.txt`:
```markdown
# Palm (Ravicha) Suksawasdi Na Ayuthaya - Full Engineering Dossier

> Applied AI & Backend Systems Engineer
> Master of Information Technology Candidate at UNSW Sydney (WAM 83 / Distinction, graduating Dec 2026)
> Email: rsuksawasdi@gmail.com · GitHub: https://github.com/Ravicha2 · LinkedIn: https://www.linkedin.com/in/ravicha-suksawasdi-na-ayuthaya/ · Portfolio: https://ravicha2.github.io/

---

## 1. Professional Narrative & Systems Engineering Mindset

### The Origin & Spark
Palm originally trained in Automotive Design & Manufacturing Engineering at Chulalongkorn University. During an IoT exchange at IMT Atlantique in Rennes, France right when modern large language models emerged, he recognized the transformative potential of combining computational intelligence with rigorous systems engineering, sparking a decisive pivot to Computer Science.

### Systems-First Engineering on Non-Deterministic AI
Coming from physical systems engineering—where structural stress limits, fluid dynamics, and failure modes are absolute—Palm treats non-deterministic LLMs and AI models as untrusted components within deterministic software architectures. Rather than relying on fragile single prompts, he engineers fault-tolerant multi-agent orchestrations, graph-based compliance verifiers, schema-safe pipelines, and durable execution state machines.

### Academic & Research Focus
Currently completing a Master of Information Technology at UNSW Sydney (Distinction average, WAM 83) focusing on Applied AI and distributed backend infrastructure, conducting research on GraphRAG architectural compliance tools and building open-source agent tooling.

---

## 2. Flagship Case Studies (4-Part Engineering Deep Dives)

### Case Study 1: Shepherd — GraphRAG Architectural Decision Graph & Compliance Engine
- **Role**: Lead Researcher (UNSW Sydney) · **Timeline**: Jun 2026
- **Stack**: Python, FastAPI, Neo4j, Cypher, Docker, uv, GitHub Actions, GraphRAG
- **Repository**: https://github.com/Ravicha2/Shepherd
- **Metrics**: Zero AST-ADR rule drift · Automated PR blocking status checks · Deterministic Cypher graph traversal

#### 1. The Core Intuition & Friction
- **The Spark**: As AI code generators produce code at unprecedented velocity, engineering teams lose visibility over whether newly generated implementations adhere to historical Architectural Decision Records (ADRs) buried in repository markdown files.
- **The Naive Failure Mode**: Naive vector search (RAG) retrieves semantically similar markdown paragraphs, but completely fails to detect multi-file dependency hierarchies, transitive imports, and strict layer boundaries (e.g. Domain layer importing Infrastructure).

#### 2. The Root Problem Encountered
- **Edge Cases**: Multi-layer circular dependencies across dynamically imported modules; ADR specifications written in ambiguous natural language requiring structured constraint extraction; false positive alerts on legitimate mock dependencies in test suites.
- **Constraints**: Sub-second PR status check latency required to prevent blocking developer CI pipelines; zero false negative tolerance on critical security and layer boundary separation rules.

#### 3. Why Built This Way
- **Architectural Insight**: Representing both code AST structures and ADR constraints as a unified Neo4j property graph enables deterministic Cypher path queries to verify architectural boundaries mathematically.
- **Trade-offs**: Neo4j Property Graphs vs Flat Vector Embeddings (graph traversal eliminates vector hallucinations); Tiered Violation Severity Engine (differentiates fatal architectural boundary violations blocking PR merges from advisory suggestions).
- **Guardrails**: Automated AST parsing with robust syntax error handling; isolated Cypher query execution with query timeouts; strict GitHub Actions status check webhook verification.

#### 4. Outcomes, Verification & Key Takeaways
- **Verification**: Integrated directly into GitHub Commit Status Checks to automatically evaluate pull requests before merge; benchmarked against standard RAG baselines, detecting 100% of multi-hop layer boundary violations missed by vector search.
- **Impact**: Automated architecture governance in AI-augmented codebases, eliminating architectural erosion in rapidly evolving repositories.
- **Core Takeaway**: Non-deterministic AI code generation requires deterministic graph-based structural verification to maintain long-term software maintainability.

---

### Case Study 2: NL2REGEX — Distributed Natural Language to Regex Engine for Large Datasets
- **Role**: Creator / Full-Stack Engineer · **Timeline**: 2026
- **Stack**: PySpark 3.5, Django 5, Celery, Redis, PostgreSQL, React 18, Docker Compose
- **Links**: https://github.com/Ravicha2/NL2REGEX · Live: http://207.148.87.49 · Video: https://youtu.be/mFec2jMgosg
- **Metrics**: 1,000,000+ rows processed · 5 documented ADRs · Zero worker memory spikes · Sub-second cached queries

#### 1. The Core Intuition & Friction
- **The Spark**: Non-technical analysts and data engineers need to sanitize and reformat massive tabular datasets using natural language without writing fragile regex patterns or uploading sensitive multi-gigabyte files to cloud LLM APIs.
- **The Naive Failure Mode**: Directly prompting an LLM with raw CSV rows causes catastrophic column hallucination, huge token costs, data leakage risks, and catastrophic backtracking (ReDoS) from unverified regex output.

#### 2. The Root Problem Encountered
- **Edge Cases**: LLMs inventing column names not present in uploaded CSV headers (Schema Hallucination); generated regexes triggering catastrophic backtracking (ReDoS) and freezing Celery worker threads indefinitely; multi-gigabyte file uploads causing OOM crashes in pandas workers.
- **Constraints**: Zero upload of dataset records to LLM APIs (privacy constraint); worker stability under concurrent multi-user transformations on million-row datasets.

#### 3. Why Built This Way
- **Architectural Insight**: A two-stage pipeline separates schema verification from regex generation, while canonical Parquet normalization enables PySpark distributed execution without worker memory blowups.
- **Trade-offs**: Two-Stage LLM Triage (ADR 0003) validates target columns against verified headers before regex generation; Canonical Parquet Normalization (ADR 0002) converts uploads to Parquet partitions for parallel Spark execution; Local Singleton JVM Session (ADR 0004) shares persistent SparkSession across Celery workers.
- **Guardrails**: Regex pre-compilation wrapped in POSIX signal.alarm timeout sandbox to prevent ReDoS; SHA-256 prompt hash caching in Redis; strict Pydantic payload validation.

#### 4. Outcomes, Verification & Key Takeaways
- **Verification**: Stress-tested with 1,000,000+ row synthetic datasets across distributed partitions with zero worker memory spikes; validated regex execution safety against known ReDoS benchmarks.
- **Impact**: Enables non-technical users to transform million-row datasets with zero regex syntax errors or system crashes, deployed live at http://207.148.87.49 with 5 documented ADRs.
- **Core Takeaway**: Separating intent extraction from data execution isolates LLM non-determinism from high-throughput distributed engines.

---

### Case Study 3: Fault-Tolerant Document Ingestion Agent (NodesNow LLC)
- **Role**: Backend Engineer Intern (NodesNow LLC) · **Timeline**: Dec 2025 – Feb 2026
- **Stack**: Inngest, NestJS, Neo4j, pgvector, PostgreSQL, React, Docker, TypeScript
- **Repository**: https://github.com/Ravicha2/document-ingestion-agent
- **Metrics**: Zero manual intervention on failure · Automatic step-level retry & backoff · Hybrid Graph + Vector search

#### 1. The Core Intuition & Friction
- **The Spark**: Enterprise knowledge bases require multi-stage document processing pipelines (text extraction, OCR, semantic chunking, vector embedding, entity graph extraction) that run asynchronously across high volumes of files.
- **The Naive Failure Mode**: When background job queues experience transient network blips or LLM rate limits halfway through a multi-stage pipeline, the entire job aborts or requires re-running from scratch, leaving orphaned records and duplicate embeddings.

#### 2. The Root Problem Encountered
- **Edge Cases**: API rate limiting during parallel embedding generation; partial writes leaving vector embeddings in pgvector without corresponding nodes in Neo4j; inconsistent state from concurrent uploads of identical revisions.
- **Constraints**: Zero manual database cleanup required after transient external API outages; full pipeline idempotency across all processing steps.

#### 3. Why Built This Way
- **Architectural Insight**: Decomposing the pipeline into Inngest durable steps guarantees that each step is idempotent and individually retryable with exponential backoff without re-running prior completed steps.
- **Trade-offs**: Inngest Durable Orchestration vs Traditional Message Queues (preserves intermediate step state); Dual-Layer Persistence combining pgvector (semantic search) and Neo4j (relational graph traversals).
- **Guardrails**: Idempotency keys based on document content hash; exponential backoff with jitter on external API calls; transactional rollback handlers for failed graph insertions.

#### 4. Outcomes, Verification & Key Takeaways
- **Verification**: Simulated network partition and API rate-limit faults during multi-gigabyte ingestion batches, confirming 100% automated step resumption without data corruption. Full stack containerized with Docker Compose.
- **Impact**: Completely eliminated manual engineer intervention on ingestion pipeline failures; enabled hybrid RAG search combining semantic vector similarity with multi-hop knowledge graph queries.
- **Core Takeaway**: Long-running AI agent workflows must be architected as durable state machines where steps checkpoint state rather than monolithic background scripts.

---

### Case Study 4: Lit-Review-Council MCP Server (Google ADK & Open Source)
- **Role**: Author (Google × Kaggle AI Agents Intensive) · **Timeline**: Jun 2026
- **Stack**: Google ADK, Python, MCP, OpenAlex API, ArXiv API, uv, Claude Code
- **Links**: https://github.com/Ravicha2/lit-review-council · PyPI: https://pypi.org/project/lit-review-council/
- **Metrics**: Published on PyPI (uvx lit-review-council) · 3-reviewer Borda-count ensemble · Zero dangling citations

#### 1. The Core Intuition & Friction
- **The Spark**: Single-prompt LLM research summaries suffer from confirmation bias, fabricated citations, and an inability to balance theoretical academic papers with practical open-source production implementations.
- **The Naive Failure Mode**: Single-agent LLMs hallucinate non-existent academic references, accept unvalidated preprint claims, and lack diverse perspectives when assessing the feasibility of architectural patterns.

#### 2. The Root Problem Encountered
- **Edge Cases**: LLMs generating plausible-sounding but fictitious DOI and ArXiv identifiers; preprint source bias skewing recommendations toward unproven approaches; IDE context window overflow on large paper batches.
- **Constraints**: Strict Model Context Protocol (MCP) compliance for universal integration into Claude Code, VS Code, and Cursor; zero hallucinated or unreachable citations.

#### 3. Why Built This Way
- **Architectural Insight**: Dual-track parallel research waves paired with an independent 3-reviewer Borda-count scoring council and rigorous programmatic citation verification.
- **Trade-offs**: Dual-Track Research (Academic via ArXiv/OpenAlex + Practitioner via GitHub/PyPI); Borda-Count Consensus Ensemble (Theorist, Pragmatist, Critic personas voting independently); MCP Protocol Server Distribution (installable via uvx).
- **Guardrails**: Programmatic API verification checking that cited DOIs/ArXiv IDs exist and match paper titles; dangling reference rejection filter; source-tier weighting favoring peer-reviewed publications.

#### 4. Outcomes, Verification & Key Takeaways
- **Verification**: Published to PyPI and verified across Claude Code, Cursor, and VS Code MCP clients; tested on 50+ topics with 100% citation verification accuracy and zero hallucinated references.
- **Impact**: Empowers researchers and engineers to generate verified multi-perspective literature reviews in seconds directly from their IDE.
- **Core Takeaway**: Multi-agent consensus coupled with programmatic deterministic validation solves the hallucination problem in complex research synthesis.

---

## 3. Supporting Experience & Accolades

### Work Experience
1. **Tendor** (Jul 2026 – Present, Sydney, Australia)
   - *Role*: Software Engineer Intern
   - *Focus*: Contributing to backend services, automated workflows, and AI agent integrations; collaborating with engineering on scalable API development and reliable service infrastructure.
   - *Tags*: TypeScript, Node.js, AI Agents, Backend Systems
2. **NodesNow LLC** (Dec 2025 – Feb 2026, Bangkok, Thailand)
   - *Role*: Backend Engineer Intern
   - *Focus*: Engineered fault-tolerant AI agent orchestration system using Inngest; persisted data into pgvector and Neo4j; containerized full stack with Docker.
   - *Tags*: Inngest, NestJS, Neo4j, pgvector, PostgreSQL, Docker, React, TypeScript
3. **3D Technical Design** (Aug 2023 – Jan 2025, Bangkok, Thailand)
   - *Role*: District Heating Designer
   - *Focus*: Designed 2D and 3D route arrangements with stress calculations across 10+ UK sites; structural hazard mitigation and technical mentorship.
   - *Tags*: Civil 3D, sisKMR, Stress Calculations, CAD, Systems Engineering
4. **Jardine Schindler Group** (Jun 2022 – Aug 2022, Bangkok, Thailand)
   - *Role*: Systems Engineering Intern
   - *Focus*: Electromechanical systems analysis for vertical transportation; installation tolerances, safety compliance standards, and diagnostics.
   - *Tags*: Electromechanical Systems, Safety Standards, Sensors, Diagnostics

### Education
- **Master of Information Technology** (Feb 2025 – Dec 2026 Expected) — UNSW Sydney, Australia
  - *Grade*: Distinction average (WAM 83)
  - *Focus*: Advanced Algorithms, Artificial Intelligence, Distributed Systems, Software Construction; GraphRAG research.
- **Exchange Study - M.Sc. Information Technology (IoT)** (Sep 2022 – Jan 2023) — IMT Atlantique, Rennes, France
  - *Focus*: Architecture and Engineering in IoT, distributed systems, networking protocols, embedded Linux.
- **Bachelor of Automotive Design and Manufacturing Engineering** (Aug 2019 – Aug 2023) — Chulalongkorn University, Bangkok, Thailand
  - *Focus*: Physical systems engineering, robotics, mechanical and electrical engineering.

### Publications & Accolades
- **IEEE TENCON 2023**: *Position Accuracy of a 6-DOF Passive Robotic Arm for Ultrasonography Training* (IEEE Xplore: https://ieeexplore.ieee.org/document/10349000).
- **Founder's Choice Award Winner**: Hack2Heal Hackathon (2025) for mental health peer support platform (heal.a2a.ing).
- **UNSW Leadership Foundation Program** (May 2025) & **UNSW Professional Development Program** (Sep 2025).

### Complete Skills Matrix
- **Languages**: Python, TypeScript, JavaScript, SQL, C++, C, Bash, HTML/CSS.
- **Frameworks**: FastAPI, NestJS, React, Google ADK, LangGraph, Inngest, Celery, Django, PySpark, TensorFlow, Keras.
- **Databases**: PostgreSQL, Neo4j, Apache AGE, pgvector, Redis, Apache Spark, Hadoop.
- **Infrastructure & Tools**: Docker, Docker Compose, AWS (S3, EC2), Vercel, Supabase, Git, GitHub Actions, uv, uvx, Model Context Protocol (MCP).
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/seo/llms-txt.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add public/llms.txt public/llms-full.txt tests/seo/llms-txt.test.ts
git commit -m "feat(seo): add standardized llms.txt and comprehensive llms-full.txt dossiers"
```

---

### Task 2: Crawler Protocols: Search Engine Robots (`public/robots.txt`) & XML Sitemap (`public/sitemap.xml`)

**Files:**
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Test: `tests/seo/crawler-protocols.test.ts`

**Interfaces:**
- Consumes: All 10 site routes (`/`, `/projects`, 7 project slugs, `/experience`)
- Produces: `public/robots.txt` and `public/sitemap.xml`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/seo/crawler-protocols.test.ts
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Crawler Protocols (robots.txt & sitemap.xml)', () => {
  const publicDir = path.resolve(__dirname, '../../public');
  const robotsTxtPath = path.join(publicDir, 'robots.txt');
  const sitemapXmlPath = path.join(publicDir, 'sitemap.xml');

  it('verifies public/robots.txt allows all standard and AI user agents and declares sitemap', () => {
    expect(fs.existsSync(robotsTxtPath)).toBe(true);
    const content = fs.readFileSync(robotsTxtPath, 'utf-8');

    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /');
    expect(content).toContain('GPTBot');
    expect(content).toContain('ClaudeBot');
    expect(content).toContain('PerplexityBot');
    expect(content).toContain('Sitemap: https://ravicha2.github.io/sitemap.xml');
    expect(content).toContain('llms.txt');
  });

  it('verifies public/sitemap.xml is valid XML and contains all canonical routes', () => {
    expect(fs.existsSync(sitemapXmlPath)).toBe(true);
    const content = fs.readFileSync(sitemapXmlPath, 'utf-8');

    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    const expectedUrls = [
      'https://ravicha2.github.io/',
      'https://ravicha2.github.io/projects',
      'https://ravicha2.github.io/projects/shepherd',
      'https://ravicha2.github.io/projects/nl2regex',
      'https://ravicha2.github.io/projects/document-ingestion-agent',
      'https://ravicha2.github.io/projects/lit-review-council',
      'https://ravicha2.github.io/projects/node-api',
      'https://ravicha2.github.io/projects/robotic-arm-ultrasound',
      'https://ravicha2.github.io/projects/heal-a2a',
      'https://ravicha2.github.io/experience',
    ];

    expectedUrls.forEach((url) => {
      expect(content).toContain(`<loc>${url}</loc>`);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/seo/crawler-protocols.test.ts`
Expected: FAIL with `fs.existsSync(robotsTxtPath) == false`

- [ ] **Step 3: Write `public/robots.txt` and `public/sitemap.xml`**

Create `public/robots.txt`:
```text
# Robots.txt for https://ravicha2.github.io/
# LLM Agent context index: https://ravicha2.github.io/llms.txt
# LLM Agent full dossier: https://ravicha2.github.io/llms-full.txt

User-agent: *
Allow: /

# Explicit AI Agent & Web Crawler Allowances
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

Sitemap: https://ravicha2.github.io/sitemap.xml
```

Create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ravicha2.github.io/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ravicha2.github.io/projects</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ravicha2.github.io/projects/shepherd</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ravicha2.github.io/projects/nl2regex</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ravicha2.github.io/projects/document-ingestion-agent</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ravicha2.github.io/projects/lit-review-council</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ravicha2.github.io/projects/node-api</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ravicha2.github.io/projects/robotic-arm-ultrasound</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ravicha2.github.io/projects/heal-a2a</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://ravicha2.github.io/experience</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/seo/crawler-protocols.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add public/robots.txt public/sitemap.xml tests/seo/crawler-protocols.test.ts
git commit -m "feat(seo): add robots.txt with AI agent allowances and sitemap.xml"
```

---

### Task 3: Universal Static Baseline & OpenGraph Tags (`index.html`)

**Files:**
- Modify: `index.html`
- Test: `tests/seo/index-html-meta.test.ts`

**Interfaces:**
- Consumes: Site metadata
- Produces: Pre-rendered `<meta>`, OpenGraph, Twitter Cards, canonical link, and baseline `schema.org/Person` in `index.html`.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/seo/index-html-meta.test.ts
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Static Baseline HTML Meta & OpenGraph (index.html)', () => {
  const indexHtmlPath = path.resolve(__dirname, '../../index.html');

  it('verifies index.html has canonical, theme-color, OpenGraph, and Twitter tags', () => {
    const content = fs.readFileSync(indexHtmlPath, 'utf-8');

    // Canonical & Basic
    expect(content).toContain('<link rel="canonical" href="https://ravicha2.github.io/" />');
    expect(content).toContain('<meta name="theme-color" content="#09090b" />');
    expect(content).toContain('<meta name="author" content="Palm (Ravicha) Suksawasdi Na Ayuthaya" />');

    // OpenGraph
    expect(content).toContain('<meta property="og:site_name" content="Palm Suksawasdi Portfolio" />');
    expect(content).toContain('<meta property="og:type" content="profile" />');
    expect(content).toContain('<meta property="og:url" content="https://ravicha2.github.io/" />');
    expect(content).toContain('<meta property="og:title" content="Palm Suksawasdi | Portfolio &amp; Systems Engineering" />');

    // Twitter
    expect(content).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(content).toContain('<meta name="twitter:title" content="Palm Suksawasdi | Portfolio &amp; Systems Engineering" />');
  });

  it('verifies index.html embeds valid static baseline schema.org/Person JSON-LD', () => {
    const content = fs.readFileSync(indexHtmlPath, 'utf-8');
    const jsonLdMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

    expect(jsonLdMatch).not.toBeNull();
    const parsed = JSON.parse(jsonLdMatch![1]);

    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@graph']).toBeDefined();

    const person = parsed['@graph'].find((item: any) => item['@type'] === 'Person');
    expect(person).toBeDefined();
    expect(person.name).toBe('Palm (Ravicha) Suksawasdi Na Ayuthaya');
    expect(person.jobTitle).toBe('Applied AI & Backend Systems Engineer');
    expect(person.sameAs).toContain('https://github.com/Ravicha2');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/seo/index-html-meta.test.ts`
Expected: FAIL with missing canonical/OpenGraph tags or baseline JSON-LD

- [ ] **Step 3: Update `index.html`**

Update `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Palm Suksawasdi | Portfolio &amp; Systems Engineering</title>
    <meta name="description" content="Applied AI &amp; Backend Systems Engineer specializing in fault-tolerant multi-agent pipelines, GraphRAG architectural compliance, and distributed data engines." />
    <meta name="author" content="Palm (Ravicha) Suksawasdi Na Ayuthaya" />
    <meta name="theme-color" content="#09090b" />
    <link rel="canonical" href="https://ravicha2.github.io/" />

    <!-- OpenGraph Metadata -->
    <meta property="og:site_name" content="Palm Suksawasdi Portfolio" />
    <meta property="og:type" content="profile" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="https://ravicha2.github.io/" />
    <meta property="og:title" content="Palm Suksawasdi | Portfolio &amp; Systems Engineering" />
    <meta property="og:description" content="Applied AI &amp; Backend Systems Engineer specializing in fault-tolerant multi-agent pipelines, GraphRAG architectural compliance, and distributed data engines." />

    <!-- Twitter Card Metadata -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Palm Suksawasdi | Portfolio &amp; Systems Engineering" />
    <meta name="twitter:description" content="Applied AI &amp; Backend Systems Engineer specializing in fault-tolerant multi-agent pipelines, GraphRAG architectural compliance, and distributed data engines." />

    <!-- Pre-rendered Baseline JSON-LD for Headless Crawlers -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": "https://ravicha2.github.io/#person",
            "name": "Palm (Ravicha) Suksawasdi Na Ayuthaya",
            "alternateName": "Palm Suksawasdi",
            "jobTitle": "Applied AI & Backend Systems Engineer",
            "description": "Master of IT candidate at UNSW Sydney specializing in fault-tolerant multi-agent pipelines, GraphRAG architectural compliance, and distributed data engines.",
            "url": "https://ravicha2.github.io/",
            "email": "mailto:rsuksawasdi@gmail.com",
            "sameAs": [
              "https://github.com/Ravicha2",
              "https://www.linkedin.com/in/ravicha-suksawasdi-na-ayuthaya/",
              "https://pypi.org/project/lit-review-council/",
              "https://ieeexplore.ieee.org/document/10349000"
            ],
            "alumniOf": [
              {
                "@type": "EducationalOrganization",
                "name": "UNSW Sydney",
                "url": "https://www.unsw.edu.au/"
              },
              {
                "@type": "EducationalOrganization",
                "name": "Chulalongkorn University",
                "url": "https://www.chula.ac.th/"
              },
              {
                "@type": "EducationalOrganization",
                "name": "IMT Atlantique",
                "url": "https://www.imt-atlantique.fr/"
              }
            ],
            "knowsAbout": [
              "Applied AI",
              "Multi-Agent Systems",
              "Model Context Protocol",
              "GraphRAG",
              "Distributed Systems",
              "PySpark",
              "Neo4j",
              "Inngest",
              "FastAPI",
              "NestJS"
            ]
          },
          {
            "@type": "ProfilePage",
            "@id": "https://ravicha2.github.io/#profilepage",
            "url": "https://ravicha2.github.io/",
            "name": "Palm Suksawasdi | Portfolio & Systems Engineering",
            "mainEntity": {
              "@id": "https://ravicha2.github.io/#person"
            }
          }
        ]
      }
    </script>

    <!-- SPA redirect decoder for GitHub Pages -->
    <script type="text/javascript">
      (function (l) {
        if (l.search[1] === '/') {
          var decoded = l.search
            .slice(1)
            .split('&')
            .map(function (s) {
              return s.replace(/~and~/g, '&');
            })
            .join('?');
          window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
        }
      })(window.location);
    </script>
  </head>
  <body class="bg-canvas text-text-primary min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/seo/index-html-meta.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html tests/seo/index-html-meta.test.ts
git commit -m "feat(seo): add baseline OpenGraph, Twitter, canonical, and Person JSON-LD to index.html"
```

---

### Task 4: Dynamic JSON-LD Structured Data Generator & Route Head Manager (`SEOHead.tsx` / `seo.ts`)

**Files:**
- Create: `src/utils/seo.ts`
- Create: `src/components/seo/SEOHead.tsx`
- Modify: `src/components/layout/AppLayout.tsx`
- Test: `tests/seo/seo-head.test.tsx`

**Interfaces:**
- Consumes: `src/data/profile.ts`, `src/data/projects.ts`, `src/data/experience.ts`, `useLocation()`
- Produces: Type-safe JSON-LD generators and dynamic `<head>` updater syncing titles, descriptions, canonical links, `og:url`, and `#dynamic-jsonld` script tag.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/seo/seo-head.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { SEOHead } from '../../src/components/seo/SEOHead';
import { generateJsonLdForRoute } from '../../src/utils/seo';

describe('Dynamic SEOHead & JSON-LD Structured Data Generator', () => {
  beforeEach(() => {
    // Reset document head
    document.title = 'Initial Title';
    const existingScript = document.getElementById('dynamic-jsonld');
    if (existingScript) existingScript.remove();
  });

  it('generates valid Person and ProfilePage JSON-LD for root route "/"', () => {
    const schema = generateJsonLdForRoute('/');
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@graph']).toBeDefined();

    const person = schema['@graph'].find((item: any) => item['@type'] === 'Person');
    expect(person).toBeDefined();
    expect(person.name).toContain('Palm');
  });

  it('generates valid SoftwareSourceCode JSON-LD for project detail route "/projects/shepherd"', () => {
    const schema = generateJsonLdForRoute('/projects/shepherd');
    const software = schema['@graph'].find((item: any) => item['@type'] === 'SoftwareSourceCode');

    expect(software).toBeDefined();
    expect(software.name).toContain('Shepherd');
    expect(software.codeRepository).toBe('https://github.com/Ravicha2/Shepherd');
    expect(software.programmingLanguage).toContain('Python');
  });

  it('generates valid CollectionPage JSON-LD for "/projects"', () => {
    const schema = generateJsonLdForRoute('/projects');
    const collection = schema['@graph'].find((item: any) => item['@type'] === 'CollectionPage');

    expect(collection).toBeDefined();
    expect(collection.mainEntity).toBeDefined();
  });

  it('generates valid AboutPage and ScholarlyArticle JSON-LD for "/experience"', () => {
    const schema = generateJsonLdForRoute('/experience');
    const about = schema['@graph'].find((item: any) => item['@type'] === 'AboutPage');
    const article = schema['@graph'].find((item: any) => item['@type'] === 'ScholarlyArticle');

    expect(about).toBeDefined();
    expect(article).toBeDefined();
    expect(article.name).toContain('Position Accuracy of a 6-DOF Passive Robotic Arm');
  });

  it('SEOHead component dynamically updates title, canonical link, and dynamic-jsonld script in DOM', () => {
    render(
      <MemoryRouter initialEntries={['/projects/shepherd']}>
        <SEOHead />
      </MemoryRouter>
    );

    expect(document.title).toContain('Shepherd');

    const dynamicScript = document.getElementById('dynamic-jsonld');
    expect(dynamicScript).not.toBeNull();
    const parsed = JSON.parse(dynamicScript!.textContent || '{}');
    expect(parsed['@graph'].some((item: any) => item['@type'] === 'SoftwareSourceCode')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/seo/seo-head.test.tsx`
Expected: FAIL with modules not found

- [ ] **Step 3: Create `src/utils/seo.ts` and `src/components/seo/SEOHead.tsx`**

Create `src/utils/seo.ts`:
```typescript
import { profile } from '../data/profile';
import { projects, getProjectBySlug } from '../data/projects';
import { experience, publications } from '../data/experience';

export interface RouteMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: 'website' | 'profile' | 'article';
}

export function getRouteMeta(pathname: string): RouteMeta {
  const baseUrl = 'https://ravicha2.github.io';

  if (pathname === '/') {
    return {
      title: 'Palm Suksawasdi | Portfolio & Systems Engineering',
      description: profile.headline,
      canonicalUrl: `${baseUrl}/`,
      ogType: 'profile',
    };
  }

  if (pathname === '/projects') {
    return {
      title: 'Projects & Case Studies | Palm Suksawasdi',
      description: 'Curated engineering case studies in Agentic AI, GraphRAG, and Distributed Systems.',
      canonicalUrl: `${baseUrl}/projects`,
      ogType: 'website',
    };
  }

  if (pathname.startsWith('/projects/')) {
    const slug = pathname.replace('/projects/', '');
    const project = getProjectBySlug(slug);
    if (project) {
      return {
        title: `${project.title} | Palm Suksawasdi`,
        description: project.summary,
        canonicalUrl: `${baseUrl}/projects/${slug}`,
        ogType: 'article',
      };
    }
  }

  if (pathname === '/experience') {
    return {
      title: 'Engineering Experience & Timeline | Palm Suksawasdi',
      description: 'Career journey, systems engineering background, education at UNSW and Chulalongkorn, and publications.',
      canonicalUrl: `${baseUrl}/experience`,
      ogType: 'profile',
    };
  }

  return {
    title: 'Palm Suksawasdi | Portfolio & Systems Engineering',
    description: profile.headline,
    canonicalUrl: `${baseUrl}${pathname}`,
    ogType: 'website',
  };
}

export function generateJsonLdForRoute(pathname: string): Record<string, any> {
  const baseUrl = 'https://ravicha2.github.io';
  const personEntity = {
    '@type': 'Person',
    '@id': `${baseUrl}/#person`,
    name: profile.fullName,
    alternateName: profile.name,
    jobTitle: profile.title,
    description: profile.headline,
    url: `${baseUrl}/`,
    email: profile.email,
    sameAs: [
      profile.links.github,
      profile.links.linkedin,
      'https://pypi.org/project/lit-review-council/',
      'https://ieeexplore.ieee.org/document/10349000',
    ],
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'UNSW Sydney',
        url: 'https://www.unsw.edu.au/',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Chulalongkorn University',
        url: 'https://www.chula.ac.th/',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'IMT Atlantique',
        url: 'https://www.imt-atlantique.fr/',
      },
    ],
    knowsAbout: [
      'Applied AI',
      'Multi-Agent Systems',
      'Model Context Protocol',
      'GraphRAG',
      'Distributed Systems',
      'PySpark',
      'Neo4j',
      'Inngest',
      'FastAPI',
      'NestJS',
    ],
  };

  if (pathname === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        personEntity,
        {
          '@type': 'ProfilePage',
          '@id': `${baseUrl}/#profilepage`,
          url: `${baseUrl}/`,
          name: 'Palm Suksawasdi | Portfolio & Systems Engineering',
          mainEntity: { '@id': `${baseUrl}/#person` },
        },
      ],
    };
  }

  if (pathname === '/projects') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        personEntity,
        {
          '@type': 'CollectionPage',
          '@id': `${baseUrl}/projects#collection`,
          url: `${baseUrl}/projects`,
          name: 'Projects & Case Studies | Palm Suksawasdi',
          description: 'Engineering case studies covering Agentic AI, GraphRAG, Distributed Systems, and Robotics.',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: projects.map((p, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: p.title,
              url: `${baseUrl}/projects/${p.slug}`,
              description: p.summary,
            })),
          },
        },
      ],
    };
  }

  if (pathname.startsWith('/projects/')) {
    const slug = pathname.replace('/projects/', '');
    const project = getProjectBySlug(slug);

    if (project) {
      return {
        '@context': 'https://schema.org',
        '@graph': [
          personEntity,
          {
            '@type': 'SoftwareSourceCode',
            '@id': `${baseUrl}/projects/${slug}#software`,
            name: project.title,
            description: project.summary,
            url: `${baseUrl}/projects/${slug}`,
            codeRepository: project.links.github || undefined,
            programmingLanguage: project.tags.filter((t) =>
              ['Python', 'TypeScript', 'JavaScript', 'C', 'C++', 'SQL', 'Cypher'].includes(t)
            ),
            runtimePlatform: project.tags.join(', '),
            author: { '@id': `${baseUrl}/#person` },
          },
        ],
      };
    }
  }

  if (pathname === '/experience') {
    const pub = publications[0];
    return {
      '@context': 'https://schema.org',
      '@graph': [
        personEntity,
        {
          '@type': 'AboutPage',
          '@id': `${baseUrl}/experience#about`,
          url: `${baseUrl}/experience`,
          name: 'Engineering Experience & Timeline | Palm Suksawasdi',
          description: 'Career journey, systems engineering background, education at UNSW, and publications.',
          mainEntity: { '@id': `${baseUrl}/#person` },
        },
        ...(pub
          ? [
              {
                '@type': 'ScholarlyArticle',
                '@id': `${baseUrl}/experience#publication-${pub.id}`,
                name: pub.title,
                headline: pub.title,
                url: pub.link,
                datePublished: pub.date,
                author: pub.authors.map((authorName) => ({
                  '@type': 'Person',
                  name: authorName,
                })),
                publisher: {
                  '@type': 'Organization',
                  name: 'IEEE',
                },
              },
            ]
          : []),
      ],
    };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [personEntity],
  };
}
```

Create `src/components/seo/SEOHead.tsx`:
```typescript
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteMeta, generateJsonLdForRoute } from '../../utils/seo';

export const SEOHead: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const meta = getRouteMeta(location.pathname);

    // Update document title
    document.title = meta.title;

    // Update or create meta description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', meta.description);

    // Update or create canonical link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', meta.canonicalUrl);

    // Update OpenGraph tags
    let ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (ogUrlTag) ogUrlTag.setAttribute('content', meta.canonicalUrl);

    let ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) ogTitleTag.setAttribute('content', meta.title);

    let ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag) ogDescTag.setAttribute('content', meta.description);

    // Update Twitter tags
    let twTitleTag = document.querySelector('meta[name="twitter:title"]');
    if (twTitleTag) twTitleTag.setAttribute('content', meta.title);

    let twDescTag = document.querySelector('meta[name="twitter:description"]');
    if (twDescTag) twDescTag.setAttribute('content', meta.description);

    // Dynamic JSON-LD injection
    const jsonLdData = generateJsonLdForRoute(location.pathname);
    let jsonLdScript = document.getElementById('dynamic-jsonld') as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'dynamic-jsonld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(jsonLdData, null, 2);
  }, [location.pathname]);

  return null;
};

export default SEOHead;
```

Update `src/components/layout/AppLayout.tsx` to include `SEOHead`:
```tsx
import type React from 'react';
import { RouteAnnouncer, SkipLink } from '../../accessibility';
import { SEOHead } from '../seo/SEOHead';
import { NavigationDock } from './NavigationDock';

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, pageTitle }) => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary selection:bg-accent-solid selection:text-white">
      <SEOHead />
      <SkipLink />
      <RouteAnnouncer pageTitle={pageTitle} />
      ...
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/seo/seo-head.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/seo.ts src/components/seo/SEOHead.tsx src/components/layout/AppLayout.tsx tests/seo/seo-head.test.tsx
git commit -m "feat(seo): add dynamic SEOHead manager and route-aware JSON-LD schema generator"
```

---

### Task 5: End-to-End Build & Validation Audit

**Files:**
- Modify: `ISSUES.md` (mark Issue #4 closed)

- [ ] **Step 1: Run complete test suite**

Run: `npm test`
Expected: All test suites pass (0 errors)

- [ ] **Step 2: Run production build and verify artifact output**

Run: `npm run build`
Expected: Clean Vite build emitting `dist/` with `dist/llms.txt`, `dist/llms-full.txt`, `dist/robots.txt`, and `dist/sitemap.xml`.

- [ ] **Step 3: Update `ISSUES.md`**

Mark issue #4 as closed in `ISSUES.md`.

- [ ] **Step 4: Commit**

```bash
git add ISSUES.md
git commit -m "docs: mark issue #4 as closed in ISSUES.md"
```
