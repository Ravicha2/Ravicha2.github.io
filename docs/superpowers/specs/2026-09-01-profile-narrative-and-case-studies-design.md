# Design Specification: Profile Narrative Arc, Storytelling & Case Study Framework

- **Date**: 2026-09-01
- **GitHub Issue**: [#1: [HITL] Profile Narrative Arc, Storytelling & Case Study Framework](https://github.com/Ravicha2/Ravicha2.github.io/issues/1)
- **Status**: Ready for Review

---

## 1. Overview & Objectives

This specification defines the unified developer narrative, storytelling structure, and intuitive case study framework for Palm Suksawasdi's portfolio website ([Ravicha2.github.io](https://ravicha2.github.io)).

### Core Shift: "Intuition & Why" over "Feature Listing"
Rather than merely describing features, the storytelling centers on **Engineering Rationale**:
* **The Spark & Core Intuition**: What was the initial hypothesis or real-world friction?
* **The Breaking Problem Encountered**: What broke when trying the naive approach (e.g., hallucinated schemas, catastrophic backtracking, broken multi-stage state, vector search blindspots)?
* **Why Built This Way**: The architectural insight and deliberate trade-offs made to solve the root problem.
* **The Concrete Outcome**: How the system holds up under real conditions and verification.

---

## 2. Profile Narrative Arc & Positioning

### 2.1 Hero Header & Tagline
* **Role**: `Applied AI & Backend Systems Engineer`
* **Headline / Short Hook**: *"Building fault-tolerant multi-agent pipelines, GraphRAG memory systems, and distributed data engines."*
* **Status**: Master of IT Candidate at UNSW Sydney (WAM 83 / Distinction, graduating Dec 2026) · Open to full-time Applied AI & Backend Systems roles.
* **Core Links**: GitHub (`github.com/ravicha2`), LinkedIn (`linkedin.com/in/ravicha-suksawasdi-na-ayuthaya`), Email (`palm.ravicha@outlook.com`).

### 2.2 About Me & Story Arc
1. **The Origin & The Spark**: Originally trained in Automotive Design & Manufacturing Engineering at Chulalongkorn University. During an IoT exchange at IMT Atlantique in France right when modern LLMs took off, saw the potential of combining software intelligence with systems engineering and made a decisive pivot to Computer Science.
2. **The Systems Mindset in AI**: Coming from physical engineering (where stress limits, fluid routing, and failure modes are absolute), Palm treats non-deterministic AI models as components within deterministic, constraint-aware software systems—enforcing explicit state machines, schema validation, graph-based verification, and automatic failure recovery.
3. **Applied AI Focus**: Currently completing a Master of Information Technology at UNSW Sydney (Distinction, WAM 83) while conducting research on Graph-based architectural compliance tools and building open-source agent tooling.
4. **Target**: Graduating December 2026; actively seeking full-time roles in Applied AI, Agentic Systems, and Backend Infrastructure.

---

## 3. The "Intuition-First" 4-Part Case Study Framework

Every case study is structured to reveal the engineer's problem-solving process:

```markdown
# [Project Name]: [One-Line Technical Hook]

| Metadata | Specification |
|---|---|
| **Role & Context** | e.g., Research Engineer (UNSW) / Backend Intern (NodesNow) / Creator |
| **Timeline** | e.g., Jun 2026 |
| **Stack** | `Python` · `Neo4j` · `PySpark` · `Inngest` · `Docker` |
| **Links** | [GitHub Repo ↗] · [Live Demo ↗] · [PyPI ↗] · [Video Walkthrough ↗] |

---

### 1. The Core Intuition & Friction
* **The Spark**: Why start this project? What was the underlying hypothesis?
* **The Naive Failure Mode**: What happens when developers try the standard/naive approach? (e.g. single-prompt scripts, unindexed vector chunks, fragile in-memory queues).

### 2. The Root Problem Encountered
* **Edge Cases & Failure Points**: Specific real-world bottlenecks hit during development (e.g., column hallucination on dirty CSVs, ReDoS regex lockups, partial state corruption on network drop, ADR rule drift in multi-repo codebases).
* **Constraints**: Hard technical limits (e.g., million-row dataset memory limits, sub-second PR review latency, zero manual failure intervention).

### 3. Why It Was Built This Way (Architectural Decisions & Trade-offs)
* **The Key Architectural Insight**: The specific structural choice that eliminated the failure mode.
* **Trade-off Analysis (Why X over Y)**:
  * Decision A: Why this pattern/tool was chosen over the common alternative (e.g., 2-stage LLM triage vs single prompt; Inngest durable steps vs raw message queues; Neo4j property graphs vs flat vector search).
  * Guardrails & Defense: How the architecture handles non-determinism, timeouts, and edge cases.

### 4. Outcomes, Verification & Key Takeaways
* **Verification**: How the system was tested and validated (e.g., GitHub Commit Status Checks, 1M-row synthetic benchmarks, PyPI installation via `uvx`).
* **Real-World Impact**: What changed for users or downstream developers (e.g., automated error recovery, zero memory spikes, PR blocking before merge).
* **Engineering Takeaway**: The main architectural lesson learned.
```

---

## 4. Flagship Case Studies (Intuition & Rationale Deep Dives)

### 4.1 Case Study 1: Shepherd (UNSW Research)
* **Title**: *GraphRAG-Enhanced Architectural Decision Graph & Compliance Engine*
* **Context**: Lead Researcher, UNSW Sydney (Jun 2026) · [github.com/Ravicha2/Shepherd](https://github.com/Ravicha2/Shepherd)
* **Stack**: `Python` · `FastAPI` · `Neo4j` · `Cypher` · `Docker` · `uv` · `GitHub Actions`
* **1. The Intuition**: As AI code generators produce more code faster, teams lose visibility over whether new code obeys historical Architectural Decision Records (ADRs) buried in repo markdown files.
* **2. The Problem Found**: 
  - Naive vector search (RAG) retrieves semantically similar markdown paragraphs, but completely misses multi-file dependency hierarchies, transitive imports, and strict layer boundaries (e.g., "Domain layer must never import Infrastructure").
* **3. Why Built This Way**:
  - *Knowledge Graph over Flat Vectors*: Mapped both code AST structures and ADR rules into a **Neo4j property graph**. This allows deterministic Cypher graph traversals to follow call chains and dependency edges across modules.
  - *Tiered Conflict Engine*: Differentiates fatal architectural violations (blocking PR status checks) from advisory suggestions.
* **4. Outcomes & Verification**:
  - Integrated directly into GitHub Commit Status Checks to automatically evaluate pull requests before merge.
  - Demonstrated that graph-traversed architectural constraints catch structural violations that standard embedding search misses.

---

### 4.2 Case Study 2: NL2REGEX (Distributed Data Processing Platform)
* **Title**: *Distributed Natural Language to Regex Engine for Large-Scale Datasets*
* **Context**: Creator / Full-Stack Engineer (2026) · [github.com/Ravicha2/NL2REGEX](https://github.com/Ravicha2/NL2REGEX) · [Live Demo](http://207.148.87.49) · [Video](https://youtu.be/mFec2jMgosg)
* **Stack**: `PySpark 3.5` · `Django 5` · `Celery` · `Redis` · `PostgreSQL` · `React 18` · `Docker Compose`
* **1. The Intuition**: Non-technical analysts need to transform complex column patterns in massive tabular datasets using plain English, without writing fragile regex by hand or uploading sensitive full datasets to LLM APIs.
* **2. The Problem Found**:
  - *Schema Hallucination*: Prompting an LLM directly to "replace phone numbers in column X" frequently resulted in the LLM hallucinating column names that did not exist in the file.
  - *ReDoS & Timeout Lockups*: Generated regexes could trigger catastrophic backtracking (`ReDoS`), hanging worker threads indefinitely.
  - *Memory Exhaustion*: Ingesting multi-gigabyte CSVs into pandas caused out-of-memory crashes on worker nodes.
* **3. Why Built This Way**:
  - *Two-Stage LLM Pipeline (ADR 0003)*: A dedicated schema-validated triage call extracts structured `(column, nl_pattern, replacement)` tuples against verified dataset headers before regex generation begins, eliminating column hallucination.
  - *Canonical Parquet Normalization (ADR 0002)*: Uploads are immediately normalized into Parquet partitions so PySpark applies regex projections in parallel without loading the full CSV into memory.
  - *Regex Safety Guardrails*: Regexes are compiled and wrapped in `signal.alarm` timeout checks before execution; prompt hashes are cached in Redis to skip duplicate LLM queries.
  - *Local Singleton JVM Session (ADR 0004)*: Celery workers share a long-lived PySpark JVM session to eliminate startup latency while remaining pointable to a remote cluster via `SPARK_MASTER`.
* **4. Outcomes & Verification**:
  - Successfully transformed synthetic datasets with 1,000,000+ rows across partitions with zero worker memory spikes.
  - Deployed live at `http://207.148.87.49` with 5 documented ADRs and full Docker Compose reproducibility.

---

### 4.3 Case Study 3: Fault-Tolerant Document Ingestion Agent (NodesNow LLC)
* **Title**: *Event-Driven AI Document Ingestion with Durable Orchestration*
* **Context**: Backend Engineer Intern, NodesNow LLC (Dec 2025 – Feb 2026) · [github.com/Ravicha2/document-ingestion-agent](https://github.com/Ravicha2/document-ingestion-agent)
* **Stack**: `Inngest` · `NestJS` · `Neo4j` · `pgvector` · `PostgreSQL` · `React` · `Docker` · `TypeScript`
* **1. The Intuition**: Enterprise document ingestion requires a multi-stage pipeline (extraction, OCR, semantic chunking, vector embedding, entity graph generation) that must run asynchronously across hundreds of files without failing silently.
* **2. The Problem Found**:
  - When steps fail halfway through (e.g. rate-limit on embedding API or network timeout on graph write), naive background workers leave orphaned rows, duplicate embeddings, and inconsistent graph nodes, requiring manual database cleanup.
* **3. Why Built This Way**:
  - *Durable Step Functions (Inngest)*: Decomposed the workflow into discrete, idempotent steps managed by Inngest. If step 4 (Graph Write) fails, Inngest automatically retries only step 4 with exponential backoff, without re-running expensive LLM extractions (steps 1–3).
  - *Dual-Layer Retrieval*: Ingested entities are persisted into both `pgvector` (for vector semantic search) and `Neo4j` (for entity-relationship traversals), supporting hybrid RAG downstream.
* **4. Outcomes & Verification**:
  - Eliminated manual intervention on transient failures through automatic step-level recovery.
  - Containerized full stack (NestJS, Inngest server, Neo4j, pgvector) enabling clean local development and predictable deployments.

---

### 4.4 Case Study 4: Lit-Review-Council (Google ADK & Open Source)
* **Title**: *Multi-Agent Literature Review Council MCP Server*
* **Context**: Open Source Author (Google × Kaggle AI Agents Intensive, Jun 2026) · [github.com/Ravicha2/lit-review-council](https://github.com/Ravicha2/lit-review-council) · [PyPI](https://pypi.org/project/lit-review-council/)
* **Stack**: `Google ADK` · `Python` · `MCP (Model Context Protocol)` · `OpenAlex API` · `ArXiv API` · `uv`
* **1. The Intuition**: Automated literature reviews conducted by a single LLM prompt suffer from confirmation bias, hallucinated citations, and an inability to balance theoretical academic research with practical open-source implementations.
* **2. The Problem Found**:
  - LLMs frequently cite non-existent papers or invent claims when synthesizing research. Furthermore, single-agent scoring heavily reflects the biases of a single prompt persona.
* **3. Why Built This Way**:
  - *Dual-Track Parallel Research*: Dispatches parallel waves of specialized agents—Academic agents (ArXiv / OpenAlex) and Practitioner agents (GitHub codebases).
  - *Borda-Count Consensus Council*: 3 distinct reviewer agents independently evaluate and rank candidate papers across novelty, methodology, and practical applicability, combining scores via Borda-count voting.
  - *Strict Verification Guardrails*: Enforces automated citation validation, source-tier weighting, and dangling reference rejection before final report generation.
  - *MCP Protocol Distribution*: Implemented as a Model Context Protocol server so any MCP-compatible client (Claude Code, Cursor, VS Code) can trigger the review council directly from their IDE.
* **4. Outcomes & Verification**:
  - Published to PyPI (`uvx lit-review-council`), allowing any engineer to run multi-agent literature syntheses with zero setup.
  - Validated deterministic consensus across diverse research queries with zero hallucinated paper references.

---

## 5. Supporting Experience & Accolades

### 5.1 Additional Applied AI Projects
* **Tendor (Software Engineer Intern, Jul 2026 – Present)**:
  - *Problem*: Procurement documents are complex, non-standard PDFs requiring multi-pass extraction and human sign-off.
  - *Solution*: Google ADK extraction pipeline + Documenso e-signing service exposed as MCP tools for agent workflows.
* **Chatbot Agent with DB Tools ([github.com/Ravicha2/node-api](https://github.com/Ravicha2/node-api))**: Conversational agent with dynamic tool invocation and database management.

### 5.2 Accolades & Foundational Timeline
* **Hack2Heal Hackathon (Founder's Choice Award Winner)**: Built and deployed community mental health support platform (`heal.a2a.ing`).
* **IEEE TENCON 2023 Publication & Presentation**: Co-author & presenter for *"Position Accuracy of a 6-DOF Passive Robotic Arm for Ultrasonography Training"* (C, MATLAB).
* **3D Technical Design & Schindler**: Foundational systems engineering—district heating CAD modeling across 10+ UK sites (Civil 3D, sisKMR) and electromechanical systems.

---

## 6. Information Architecture Mapping

| Target Document | Narrative & Case Study Integration |
|---|---|
| **`index.html` (Home)** | Hero section with Applied AI narrative; Bento deck showcasing the 4 flagship case studies focusing on *The Intuition & Why Built This Way*; quick experience snapshot; footer contact. |
| **`projects.html` (Catalog)** | Comprehensive filterable project catalog (`Agentic AI`, `Distributed Systems`, `Graph & RAG`, `Robotics`); full 4-part case studies with interactive deep-dives. |
| **`experience.html` (Timeline)** | Chronological career journey from systems/civil engineering to applied AI, featuring technical decision highlights, skills taxonomy, and education. |
| **`llms.txt` & `llms-full.txt`** | Complete markdown dossier for AI agents visiting the site, structuring all project intuitions, problems solved, and architecture decisions. |

---

## 7. Next Steps

1. Commit the revised design specification to `docs/superpowers/specs/2026-09-01-profile-narrative-and-case-studies-design.md`.
2. Transition to implementation planning using the `writing-plans` skill to update site templates, project schemas, and content.
