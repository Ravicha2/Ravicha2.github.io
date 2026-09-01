# Design Specification: Profile Narrative Arc, Storytelling & Case Study Framework

- **Date**: 2026-09-01
- **GitHub Issue**: [#1: [HITL] Profile Narrative Arc, Storytelling & Case Study Framework](https://github.com/Ravicha2/Ravicha2.github.io/issues/1)
- **Status**: Ready for Review

---

## 1. Overview & Objectives

This specification defines the unified developer narrative, storytelling structure, and 4-part project case study framework for Palm Suksawasdi's portfolio website ([Ravicha2.github.io](https://ravicha2.github.io)).

### Core Goals
1. **Establish a High-Signal Applied AI Narrative**: Position Palm as an Applied AI & Backend Systems Engineer who brings an engineer's rigor (systems thinking, constraints, fault tolerance) to non-deterministic AI pipelines, graph systems, and distributed backends.
2. **Standardize the 4-Part Case Study Schema**: Provide a consistent, architectural deep-dive format (*Problem & Context → System Architecture → Technical Decisions → Outcomes & Verification*) that highlights engineering substance over generic bullet points.
3. **Curate Flagship Engineering Projects**: Structure detailed case study breakdowns for high-impact projects including **Shepherd**, **NL2REGEX**, **NodesNow Document Ingestion Agent**, and **Lit-Review-Council**.

---

## 2. Profile Narrative Arc & Positioning

### 2.1 Hero Header & Tagline
* **Role**: `Applied AI & Backend Systems Engineer`
* **Headline / Short Hook**: *"Building fault-tolerant multi-agent pipelines, GraphRAG memory systems, and distributed data engines."*
* **Status**: Master of IT Candidate at UNSW Sydney (WAM 83 / Distinction, graduating Dec 2026) · Open to full-time Applied AI & Backend Systems roles.
* **Core Links**: GitHub (`github.com/ravicha2`), LinkedIn (`linkedin.com/in/ravicha-suksawasdi-na-ayuthaya`), Email (`palm.ravicha@outlook.com`).

### 2.2 About Me & Story Arc
1. **The Focus**: Master of Information Technology student at UNSW Sydney specializing in agentic AI architectures, knowledge graph management (Neo4j), and event-driven backend systems (Inngest, Celery/Redis, PySpark, FastAPI, NestJS).
2. **The Origin & Spark**: Originally trained in Automotive Design & Manufacturing Engineering at Chulalongkorn University. During an IoT exchange program at IMT Atlantique in France right when modern LLMs took off, made a decisive pivot to Computer Science and Applied AI.
3. **The Engineering Edge**: Approaching AI with an engineering mindset—treating non-deterministic LLMs as components within deterministic, constraint-aware systems with explicit state machines, schema validation, automated retries, and graph verification.
4. **Execution Track Record**:
   - **Shepherd** (UNSW Research): Built an Architectural Decision Graph compliance engine with Neo4j and GitHub commit checks.
   - **NL2REGEX**: Built a distributed natural-language-to-regex data processing platform capable of transforming million-row datasets via PySpark and Celery.
   - **NodesNow**: Engineered a durable AI document ingestion system using Inngest step functions and Neo4j/pgvector.
   - **Lit-Review-Council**: Created a multi-agent consensus MCP server published to PyPI (`uvx lit-review-council`).
   - **Tendor**: Built Google ADK procurement document extraction pipelines and Documenso MCP signing tools.
5. **Next Step**: Graduating in December 2026; actively seeking full-time roles in Applied AI, Agentic Systems, and Backend Infrastructure.

---

## 3. The 4-Part Case Study Framework Schema

All featured project deep dives adhere to this standard 4-part schema:

```markdown
# [Project Name]: [One-Line Technical Hook]

| Metadata | Specification |
|---|---|
| **Role & Context** | e.g., Research Engineer (UNSW) / Backend Intern (NodesNow) / Open Source Author |
| **Timeline** | e.g., Jun 2026 |
| **Stack** | List of core technologies (e.g., Python, Neo4j, PySpark, Inngest, Docker) |
| **Links** | GitHub Repository, Live Demo, PyPI Package, Video Demo, Research Paper |

---

### Part 1: Problem & Context
- **Operational Bottleneck**: The concrete limitation, failure mode, or inefficiency in existing methods.
- **System Constraints**: Latency boundaries, dataset scale, schema enforcement, or durability requirements.

### Part 2: System Architecture & Data Flow
- **End-to-End Pipeline**: High-level flow from ingestion/trigger to processing and persistence.
- **Topology Diagram**: ASCII or visual architectural diagram showing services, message queues, state machines, and data layers.
- **Component Breakdown**: Specific responsibilities of the Web/API layer, Orchestration/Worker layer, and Storage/Retrieval layer.

### Part 3: Technical Decisions & Trade-offs
- **Architectural Decisions (Why X over Y)**: Explaining deliberate trade-offs (e.g. Parquet normalization vs. raw CSV parsing, Inngest durable steps vs. raw message queues, 2-stage LLM triage vs. single prompt).
- **Safety & Error Boundaries**: Guardrails against non-determinism, catastrophic backtracking, schema drift, or API rate limits.

### Part 4: Outcomes, Verification & Key Takeaways
- **Verification & Deployment**: CI/CD integration, automated test suites, Dockerized environments, or public package distribution.
- **Demonstrated Results**: Million-row throughput, automated self-recovery, zero state corruption, or open-source compatibility.
- **Core Lesson Learned**: Practical engineering insight gained from building and running the system.
```

---

## 4. Curated Flagship Case Studies

### 4.1 Case Study 1: Shepherd (UNSW Research)
* **Title**: *GraphRAG-Enhanced Architectural Decision Graph & Compliance Engine*
* **Role & Timeline**: Lead Researcher, UNSW Sydney (Jun 2026)
* **Stack**: `Python` · `FastAPI` · `Neo4j` · `Cypher` · `Docker` · `uv` · `GitHub Actions`
* **Links**: [github.com/Ravicha2/Shepherd](https://github.com/Ravicha2/Shepherd)
* **Part 1 (Problem & Context)**: AI coding assistants often introduce silent architectural drift by generating code that violates Architectural Decision Records (ADRs) buried across markdown files in large repositories.
* **Part 2 (Architecture)**: 
  - Code AST parser extracts modules, dependencies, and call hierarchies.
  - Markdown ADR ingestor maps decision boundaries and constraints into a Neo4j property graph.
  - Graph traversal engine evaluates code modifications against graph rules using Cypher queries.
* **Part 3 (Technical Decisions)**:
  - *Graph vs. Flat Vector Retrieval*: Neo4j property graph enables multi-hop relational pathfinding and explicit constraint checking where simple vector similarity fails.
  - *Tiered Conflict Resolution*: Distinguishes hard architectural blockers (e.g. layer violations) from soft advisory warnings.
* **Part 4 (Outcomes & Verification)**:
  - Integrated directly into GitHub Commit Status Checks to review pull requests automatically before merge.
  - Reproducible development environment managed via `uv` and Docker.

---

### 4.2 Case Study 2: NL2REGEX (Distributed Data Processing Platform)
* **Title**: *Distributed Natural Language to Regex Engine for Large-Scale Datasets*
* **Role & Timeline**: Creator / Full-Stack Engineer (2026)
* **Stack**: `PySpark 3.5` · `Django 5` · `Celery` · `Redis` · `PostgreSQL` · `React 18` · `Docker Compose`
* **Links**: [github.com/Ravicha2/NL2REGEX](https://github.com/Ravicha2/NL2REGEX) · [Live Demo](http://207.148.87.49) · [YouTube Walkthrough](https://youtu.be/mFec2jMgosg)
* **Part 1 (Problem & Context)**: Transforming tabular data with millions of rows using natural language regex descriptions usually causes worker timeouts, catastrophic regex backtracking (`ReDoS`), memory exhaustion, and hallucinated column names.
* **Part 2 (Architecture)**:
  - *Web Layer*: Django API with immediate 202 async response returning `job_id`.
  - *Task & Cache Layer*: Celery workers backed by Redis for task brokering, result backend, and SHA-256 LLM response caching.
  - *Processing Engine*: PySpark running projection transformations on partitioned Parquet datasets.
  - *Storage Layer*: PostgreSQL for relational metadata; filesystem for partitioned Parquet part files and 100-row preview pagination.
* **Part 3 (Technical Decisions)**:
  - *Two-Stage LLM Pipeline*: A schema-validated triage call parses user intent into `(column, nl_pattern, replacement)` tuples before regex generation, preventing column hallucination (ADR 0003).
  - *Canonical Parquet Normalization*: All uploads are immediately converted to Parquet; Spark never processes raw CSV/Excel directly (ADR 0002).
  - *Regex Safety Guardrails*: Compilation validation + `signal.alarm` timeout protection against catastrophic backtracking.
  - *Singleton JVM Worker Factory*: Reuses Spark JVM sessions per Celery worker to eliminate JVM boot overhead (ADR 0004).
* **Part 4 (Outcomes & Verification)**:
  - Benchmarked on 1,000,000+ row datasets with zero memory bloat.
  - 5 Architecture Decision Records (ADRs) documented.
  - Deployed live at `http://207.148.87.49` with interactive React UI and video demonstration.

---

### 4.3 Case Study 3: Fault-Tolerant Document Ingestion Agent (NodesNow LLC)
* **Title**: *Event-Driven AI Document Ingestion with Durable Orchestration*
* **Role & Timeline**: Backend Engineer Intern, NodesNow LLC (Dec 2025 – Feb 2026)
* **Stack**: `Inngest` · `NestJS` · `Neo4j` · `pgvector` · `PostgreSQL` · `React` · `Docker` · `TypeScript`
* **Links**: [github.com/Ravicha2/document-ingestion-agent](https://github.com/Ravicha2/document-ingestion-agent)
* **Part 1 (Problem & Context)**: Multi-stage AI document processing (extraction, chunking, embedding, entity extraction) is highly vulnerable to transient LLM rate-limits and network drops, resulting in broken pipelines and orphaned database states.
* **Part 2 (Architecture)**:
  - Inngest event-driven workflow engine orchestrating discrete NestJS step functions.
  - Dynamic fan-in/fan-out batch concurrency for multi-document ingestion.
  - Dual persistence layer: vector embeddings into `pgvector` and structured knowledge graphs into `Neo4j`.
* **Part 3 (Technical Decisions)**:
  - *Durable Step Functions vs. Custom Queues*: Inngest handles durable state, step-level idempotency, and automatic exponential backoff retries without maintaining custom Redis queue recovery logic.
  - *Hybrid RAG Indexing*: Combining semantic search (vector) with relational graph traversals (Neo4j) for high-accuracy downstream retrieval.
* **Part 4 (Outcomes & Verification)**:
  - Eliminated manual engineer intervention on failed ingestion steps through automatic backoff and step recovery.
  - Fully containerized full-stack architecture (Inngest server, NestJS API, Neo4j, PostgreSQL) for 100% reproducible local DX.

---

### 4.4 Case Study 4: Lit-Review-Council (Google ADK & Open Source)
* **Title**: *Multi-Agent Literature Review Council MCP Server*
* **Role & Timeline**: Author (Google × Kaggle AI Agents Intensive, Jun 2026)
* **Stack**: `Google ADK` · `Python` · `MCP (Model Context Protocol)` · `OpenAlex API` · `ArXiv API` · `uv`
* **Links**: [github.com/Ravicha2/lit-review-council](https://github.com/Ravicha2/lit-review-council) · [PyPI: lit-review-council](https://pypi.org/project/lit-review-council/)
* **Part 1 (Problem & Context)**: Single-agent literature synthesis is prone to single-model bias, hallucinated citations, missing practitioner implementations, and lack of critical peer review.
* **Part 2 (Architecture)**:
  - Parallel wave execution of dual-track research agents: Academic agents (querying ArXiv / OpenAlex) and Practitioner agents (querying GitHub repositories).
  - Multi-agent review council: 3 distinct reviewer personas scoring and ranking findings via Borda-count consensus.
  - Packaged as a standard Model Context Protocol (MCP) server for instant IDE integration.
* **Part 3 (Technical Decisions)**:
  - *Borda-Count Ranking*: Aggregates candidate papers across multiple reviewer criteria to prevent single-agent evaluation bias.
  - *Automated Guardrails*: Citation verification, source-tier classification, and dangling-reference rejection before output synthesis.
* **Part 4 (Outcomes & Verification)**:
  - Shipped to PyPI, runnable with a single command (`uvx lit-review-council`).
  - Seamlessly interoperable with Claude Code, Cursor, and VS Code MCP clients.

---

## 5. Supporting Projects, Accolades & Foundation

### 5.1 Additional Applied AI Projects
* **Tendor (Software Engineer Intern, Jul 2026 – Present)**:
  - Developed Google ADK document extraction and classification pipelines for complex public procurement tenders.
  - Built an automated Documenso e-signing integration exposed as an MCP tool for autonomous agent execution.
* **Chatbot Agent with DB Tools**: LangChain/Node.js conversational agent with dynamic tool invocation and database management ([github.com/Ravicha2/node-api](https://github.com/Ravicha2/node-api)).

### 5.2 Honors & Accolades
* **Hack2Heal Hackathon (Founder's Choice Award Winner)**: Built and deployed community mental health support platform (`heal.a2a.ing`).
* **IEEE TENCON 2023 Publication & Presentation**: Co-author & presenter for *"Position Accuracy of a 6-DOF Passive Robotic Arm for Ultrasonography Training"* (C, MATLAB).

### 5.3 Engineering Foundation (Experience Timeline)
* **3D Technical Design (District Heating Network Designer, 2023–2025)**:
  - 2D/3D route arrangements and stress calculations using Autodesk Civil 3D and sisKMR across 10+ UK infrastructure sites.
  - Identified construction hazards, performed thermal expansion calculations, and mentored colleagues.
* **Jardine Schindler (Engineering Trainee)**:
  - Supported electromechanical installation, safety protocols, and software configuration for commercial elevator/escalator systems.

---

## 6. Information Architecture Mapping

| Page | Content & Role in Narrative |
|---|---|
| **`index.html` (Home)** | Hero section with core Applied AI positioning; Bento deck featuring the 4 flagship case studies (Shepherd, NL2REGEX, NodesNow, Lit-Review-Council); snapshot of recent roles; contact footer. |
| **`projects.html` (Catalog)** | Comprehensive project catalog with category filters (`Agentic AI`, `Distributed Systems`, `Graph & RAG`, `Physical & Robotics`); full 4-part case studies expandable via View Transitions. |
| **`experience.html` (Timeline)** | Chronological career timeline showcasing the progression from physical systems engineering (3D Technical Design, Schindler) to Applied AI & Software (NodesNow, Tendor, UNSW Research), with technical skill matrices and education. |
| **`llms.txt` & `llms-full.txt`** | Machine-readable markdown dossier containing this structured narrative, technical skills, and 4-part case study summaries for AI agents. |

---

## 7. Next Steps

1. Review and approve this design document.
2. Commit the design specification to `docs/superpowers/specs/2026-09-01-profile-narrative-and-case-studies-design.md`.
3. Transition to implementation planning using the `writing-plans` skill to update the website content, data models, and markdown files.
