import { Project, CategoryOption } from './types';

export const projectCategories: CategoryOption[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'agentic-ai', label: 'Agentic AI & MCP' },
  { id: 'distributed-systems', label: 'Distributed Systems' },
  { id: 'graph-rag', label: 'Graph & Knowledge' },
  { id: 'robotics', label: 'Robotics' },
  { id: 'full-stack', label: 'Full-Stack' },
];

export const projects: Project[] = [
  {
    slug: 'shepherd',
    title: 'Shepherd: GraphRAG Compliance Engine',
    subtitle: 'GraphRAG-Enhanced Architectural Decision Graph & Compliance Engine',
    category: 'graph-rag',
    categoryLabel: 'Graph & Knowledge',
    featured: true,
    role: 'Lead Researcher (UNSW Sydney)',
    timeline: 'Jun 2026',
    tags: ['Python', 'FastAPI', 'Neo4j', 'Cypher', 'Docker', 'uv', 'GitHub Actions', 'GraphRAG'],
    links: {
      github: 'https://github.com/Ravicha2/Shepherd',
    },
    metrics: [
      'Zero AST-ADR rule drift',
      'Automated PR blocking status checks',
      'Deterministic Cypher graph traversal',
    ],
    summary:
      'End-to-end ADR violation detector for AI-generated code, ingesting source ASTs and architectural markdown documents into a Neo4j property graph to catch multi-file constraint conflicts.',
    caseStudy: {
      intuition: {
        spark:
          'As AI code generators produce code at unprecedented velocity, software engineering teams lose visibility over whether newly generated implementations adhere to historical Architectural Decision Records (ADRs) buried in repo markdown files.',
        naiveFailureMode:
          'Naive vector search (RAG) retrieves semantically similar markdown paragraphs, but completely fails to detect multi-file dependency hierarchies, transitive imports, and strict layer boundaries (e.g. Domain layer importing Infrastructure).',
        summary:
          'Bridge the gap between natural-language architectural specifications and AST-level code reality.',
      },
      problemEncountered: {
        edgeCases: [
          'Multi-layer circular dependencies across dynamically imported modules',
          'ADR specifications written in ambiguous natural language requiring structured constraint extraction',
          'False positive alerts on legitimate mock dependencies in test suites',
        ],
        constraints: [
          'Sub-second PR status check latency required to prevent blocking developer CI pipelines',
          'Zero false negative tolerance on critical security and layer boundary separation rules',
        ],
        summary:
          'Vector search cannot compute graph reachability or transitive import violations across code layers.',
      },
      whyBuiltThisWay: {
        architecturalInsight:
          'Representing both code AST structures and ADR constraints as a unified Neo4j property graph enables deterministic Cypher path queries to verify architectural boundaries mathematically.',
        tradeOffs: [
          {
            decision: 'Neo4j Property Graph vs Flat Vector Embeddings',
            rationale:
              'Vector similarity answers "is this conceptually related?", whereas Cypher queries answer "does module A depend on module B via path P?". Graph traversal eliminates vector hallucinations.',
            vsAlternative: 'Flat vector embeddings / RAG',
          },
          {
            decision: 'Tiered Violation Severity Engine',
            rationale:
              'Differentiates fatal architectural boundary violations (which hard-block PR merges via GitHub Status Checks) from advisory suggestions.',
            vsAlternative: 'Binary pass/fail checks',
          },
        ],
        guardrails: [
          'Automated AST parsing with robust syntax error handling and fallback modes',
          'Isolated Cypher query execution with query timeouts',
          'Strict GitHub Actions status check webhook verification',
        ],
        summary:
          'Unified AST and ADR property graphs paired with tiered CI status check blocking.',
      },
      outcomes: {
        verification: [
          'Integrated directly into GitHub Commit Status Checks to automatically evaluate pull requests before merge',
          'Benchmarked against standard RAG baselines, successfully detecting 100% of multi-hop layer boundary violations missed by vector search',
        ],
        impact: [
          'Automated architecture governance in AI-augmented codebases, ensuring AI-written code obeys human architectural decisions.',
          'Eliminated architectural erosion in rapidly evolving multi-agent repositories.',
        ],
        takeaway:
          'Non-deterministic AI code generation requires deterministic graph-based structural verification to maintain long-term software maintainability.',
        summary:
          'Deterministic architectural governance via graph verification integrated directly into CI/CD.',
      },
    },
  },
  {
    slug: 'nl2regex',
    title: 'NL2REGEX: Distributed Regex Engine',
    subtitle: 'Distributed Natural Language to Regex Engine for Large-Scale Datasets',
    category: 'distributed-systems',
    categoryLabel: 'Distributed Systems',
    featured: true,
    role: 'Creator / Full-Stack Engineer',
    timeline: '2026',
    tags: ['PySpark 3.5', 'Django 5', 'Celery', 'Redis', 'PostgreSQL', 'React 18', 'Docker Compose'],
    links: {
      github: 'https://github.com/Ravicha2/NL2REGEX',
      demo: 'http://207.148.87.49',
      video: 'https://youtu.be/mFec2jMgosg',
    },
    metrics: [
      '1,000,000+ rows processed',
      '5 documented ADRs',
      'Zero worker memory spikes',
      'Sub-second cached queries',
    ],
    summary:
      'Distributed natural language to regex engine that transforms complex tabular dataset patterns using plain English, backed by PySpark and Celery with schema-validated triage.',
    caseStudy: {
      intuition: {
        spark:
          'Non-technical analysts and data engineers need to sanitize and reformat massive tabular datasets using natural language without writing fragile regex patterns or uploading sensitive multi-gigabyte files to cloud LLM APIs.',
        naiveFailureMode:
          'Directly prompting an LLM with raw CSV rows causes catastrophic column hallucination, huge token costs, data leakage risks, and catastrophic backtracking (ReDoS) from unverified regex output.',
        summary:
          'Enable safe, scalable natural-language data transformation without transmitting raw dataset records to LLMs.',
      },
      problemEncountered: {
        edgeCases: [
          'LLMs inventing column names not present in uploaded CSV headers (Schema Hallucination)',
          'Generated regexes triggering catastrophic backtracking (ReDoS) and freezing Celery worker threads indefinitely',
          'Multi-gigabyte file uploads causing out-of-memory (OOM) crashes in pandas workers',
        ],
        constraints: [
          'Zero upload of dataset records to LLM APIs (privacy constraint)',
          'Worker stability under concurrent multi-user transformations on million-row datasets',
        ],
        summary:
          'Schema hallucination, ReDoS lockups, and memory exhaustion when scaling naive LLM data transformations.',
      },
      whyBuiltThisWay: {
        architecturalInsight:
          'A two-stage pipeline separates schema verification from regex generation, while canonical Parquet normalization enables PySpark distributed execution without worker memory blowups.',
        tradeOffs: [
          {
            decision: 'Two-Stage LLM Triage (ADR 0003)',
            rationale:
              'Stage 1 validates target columns and transformation intent against verified schema headers; Stage 2 generates and validates regex syntax. Eliminates hallucinated columns.',
            vsAlternative: 'Single-prompt end-to-end generation',
          },
          {
            decision: 'Canonical Parquet Normalization (ADR 0002)',
            rationale:
              'Uploaded CSVs are immediately converted to partitioned Parquet files, allowing PySpark to execute regex projections in parallel across partitions.',
            vsAlternative: 'In-memory Pandas DataFrames',
          },
          {
            decision: 'Local Singleton JVM Session (ADR 0004)',
            rationale:
              'Celery worker processes share a persistent PySpark JVM instance, eliminating multi-second SparkSession initialization latency.',
            vsAlternative: 'Per-task Spark session creation',
          },
        ],
        guardrails: [
          'Regex pre-compilation wrapped in POSIX signal.alarm timeout sandbox to prevent ReDoS',
          'SHA-256 prompt hash caching in Redis to prevent redundant LLM invocations',
          'Strict Pydantic payload validation on all Celery task inputs',
        ],
        summary:
          'Two-stage LLM schema validation, Parquet normalization, PySpark distributed execution, and ReDoS timeout sandboxing.',
      },
      outcomes: {
        verification: [
          'Stress-tested with 1,000,000+ row synthetic datasets across distributed partitions with zero worker memory spikes',
          'Validated regex execution safety against known ReDoS malicious payload benchmarks',
        ],
        impact: [
          'Enables non-technical users to transform million-row datasets with zero regex syntax errors or system crashes.',
          'Deployed live at http://207.148.87.49 with 5 documented architectural decision records (ADRs).',
        ],
        takeaway:
          'Separating intent extraction from data execution isolates LLM non-determinism from high-throughput distributed engines.',
        summary:
          'Fault-tolerant distributed regex processing verified on 1M+ rows with 5 documented ADRs.',
      },
    },
  },
  {
    slug: 'document-ingestion-agent',
    title: 'Fault-Tolerant Document Ingestion Agent',
    subtitle: 'Event-Driven AI Document Ingestion with Durable Orchestration',
    category: 'agentic-ai',
    categoryLabel: 'Agentic AI & MCP',
    featured: true,
    role: 'Backend Engineer Intern (NodesNow LLC)',
    timeline: 'Dec 2025 - Feb 2026',
    tags: ['Inngest', 'NestJS', 'Neo4j', 'pgvector', 'PostgreSQL', 'React', 'Docker', 'TypeScript'],
    links: {
      github: 'https://github.com/Ravicha2/document-ingestion-agent',
    },
    metrics: [
      'Zero manual intervention on failure',
      'Automatic step-level retry & backoff',
      'Hybrid Graph + Vector search',
    ],
    summary:
      'Production-grade event-driven AI ingestion engine using Inngest durable steps, NestJS, and dual pgvector/Neo4j storage to eliminate orphaned state during multi-stage document processing.',
    caseStudy: {
      intuition: {
        spark:
          'Enterprise knowledge bases require multi-stage document processing pipelines (text extraction, OCR, semantic chunking, vector embedding, knowledge graph entity extraction) that run asynchronously across high volumes of files.',
        naiveFailureMode:
          'When background job queues experience transient network blips or LLM rate limits halfway through a multi-stage pipeline, the entire job aborts or requires re-running from scratch, leaving orphaned records and duplicate embeddings.',
        summary:
          'Achieve fault-tolerant, resumable document processing where failure at any stage recovers automatically.',
      },
      problemEncountered: {
        edgeCases: [
          'API rate limiting during parallel embedding generation',
          'Partial writes leaving vector embeddings in pgvector without corresponding nodes in Neo4j',
          'Inconsistent state from concurrent uploads of identical document revisions',
        ],
        constraints: [
          'Zero manual database cleanup required after transient external API outages',
          'Full pipeline idempotency across all processing steps',
        ],
        summary:
          'Orphaned database state and high re-computation costs when long-running AI pipelines fail midway.',
      },
      whyBuiltThisWay: {
        architecturalInsight:
          'Decomposing the pipeline into Inngest durable steps guarantees that each step is idempotent and individually retryable with exponential backoff without re-running prior completed steps.',
        tradeOffs: [
          {
            decision: 'Inngest Durable Orchestration vs Traditional Message Queues',
            rationale:
              'Inngest preserves intermediate step state in persistent storage. If step 4 (Graph ingestion) fails, only step 4 is retried, saving expensive LLM API tokens already spent in steps 1-3.',
            vsAlternative: 'BullMQ / Celery standard queues',
          },
          {
            decision: 'Dual-Layer Persistence (pgvector + Neo4j)',
            rationale:
              'Vector embeddings enable fast semantic similarity search, while Neo4j property graphs enable relational reasoning across extracted entities.',
            vsAlternative: 'Vector-only storage',
          },
        ],
        guardrails: [
          'Idempotency keys on every ingestion job based on document content hash',
          'Exponential backoff with jitter on all LLM and vector store network calls',
          'Transactional rollback handlers for failed graph node insertions',
        ],
        summary:
          'Durable step execution with Inngest, step-level checkpointing, and dual-layer vector/graph storage.',
      },
      outcomes: {
        verification: [
          'Simulated network partition and API rate-limit faults during multi-gigabyte ingestion batches, confirming 100% automated step resumption without data corruption.',
          'Containerized full stack (NestJS, Inngest server, Neo4j, pgvector) with Docker Compose for automated CI test suites.',
        ],
        impact: [
          'Completely eliminated manual engineer intervention on ingestion pipeline failures.',
          'Enabled hybrid RAG search combining semantic vector similarity with multi-hop knowledge graph queries.',
        ],
        takeaway:
          'Long-running AI agent workflows must be architected as durable state machines where steps checkpoint state rather than monolithic background scripts.',
        summary:
          'Zero-touch fault tolerance and hybrid GraphRAG retrieval delivered for production document ingestion.',
      },
    },
  },
  {
    slug: 'lit-review-council',
    title: 'Lit-Review-Council MCP Server',
    subtitle: 'Multi-Agent Literature Review Council MCP Server',
    category: 'agentic-ai',
    categoryLabel: 'Agentic AI & MCP',
    featured: true,
    role: 'Author / Google × Kaggle AI Agents Intensive',
    timeline: 'Jun 2026',
    tags: ['Google ADK', 'Python', 'MCP', 'OpenAlex API', 'ArXiv API', 'uv', 'Claude Code'],
    links: {
      github: 'https://github.com/Ravicha2/lit-review-council',
      pypi: 'https://pypi.org/project/lit-review-council/',
    },
    metrics: [
      'Published on PyPI (uvx lit-review-council)',
      '3-reviewer Borda-count ensemble',
      'Zero dangling citations',
    ],
    summary:
      'Multi-agent research synthesis engine and Model Context Protocol (MCP) server that orchestrates parallel academic and practitioner research with Borda-count consensus.',
    caseStudy: {
      intuition: {
        spark:
          'Single-prompt LLM research summaries suffer from confirmation bias, fabricated citations, and an inability to balance theoretical academic papers with practical open-source production implementations.',
        naiveFailureMode:
          'Single-agent LLMs hallucinate non-existent academic references, accept unvalidated preprint claims, and lack diverse perspectives when assessing the feasibility of architectural patterns.',
        summary:
          'Deliver rigorous, multi-perspective literature synthesis with verifiable academic and open-source citations directly in developer IDEs.',
      },
      problemEncountered: {
        edgeCases: [
          'LLMs generating plausible-sounding but fictitious DOI and ArXiv identifiers',
          'Preprint source bias skewing recommendations toward unproven theoretical approaches',
          'IDE context window overflow when ingesting large volumes of paper abstracts',
        ],
        constraints: [
          'Strict Model Context Protocol (MCP) compliance for universal integration into Claude Code, VS Code, and Cursor',
          'Zero hallucinated or unreachable citations permitted in final synthesis output',
        ],
        summary:
          'Citation hallucination, single-prompt bias, and IDE context limits in automated research synthesis.',
      },
      whyBuiltThisWay: {
        architecturalInsight:
          'Dual-track parallel research waves paired with an independent 3-reviewer Borda-count scoring council and rigorous programmatic citation verification.',
        tradeOffs: [
          {
            decision: 'Dual-Track Research (Academic + Practitioner)',
            rationale:
              'Dispatches specialized agents to query ArXiv/OpenAlex for theoretical rigor while simultaneously querying GitHub/PyPI for production adoption and practical ergonomics.',
            vsAlternative: 'Single source search',
          },
          {
            decision: 'Borda-Count Consensus Ensemble',
            rationale:
              'Three distinct persona agents (Theorist, Pragmatist, Critic) independently evaluate candidate papers on novelty, methodology, and practicality before aggregating ranks via Borda voting.',
            vsAlternative: 'Single reviewer scoring',
          },
          {
            decision: 'MCP Protocol Server Distribution',
            rationale:
              'Packaging as an MCP server installable via uvx enables developers and AI coding agents to trigger comprehensive literature reviews from their command-line and IDEs.',
            vsAlternative: 'Web dashboard only',
          },
        ],
        guardrails: [
          'Programmatic API verification verifying that all cited DOIs and ArXiv IDs exist and match paper titles',
          'Dangling reference rejection filter pruning unvalidated citations from final reports',
          'Source-tier classification giving higher confidence weight to peer-reviewed publications',
        ],
        summary:
          'Dual-track research agents, 3-reviewer Borda ranking, programmatic citation validation, and MCP protocol distribution.',
      },
      outcomes: {
        verification: [
          'Published to PyPI (installable via uvx lit-review-council) and verified across Claude Code, Cursor, and VS Code MCP clients.',
          'Tested on 50+ diverse engineering topics with 100% citation verification accuracy and zero hallucinated references.',
        ],
        impact: [
          'Empowers researchers and engineers to generate verified multi-perspective literature reviews in seconds directly from their IDE.',
          'Demonstrated effective multi-agent consensus mechanisms for reducing LLM cognitive bias.',
        ],
        takeaway:
          'Multi-agent consensus coupled with programmatic deterministic validation solves the hallucination problem in complex research synthesis.',
        summary:
          'Distributed via PyPI and MCP, providing verified multi-agent literature syntheses directly in developer IDEs.',
      },
    },
  },
  {
    slug: 'tendor-procurement-pipeline',
    title: 'Tendor Agentic Procurement & E-Sign Engine',
    subtitle: 'Automated Document Classification & MCP E-Signing Service',
    category: 'agentic-ai',
    categoryLabel: 'Agentic AI & MCP',
    featured: false,
    role: 'Software Engineer Intern (Tendor)',
    timeline: 'Jul 2026 - Present',
    tags: ['Google ADK', 'MCP', 'Documenso', 'TypeScript', 'Node.js', 'AI Agents'],
    links: {},
    metrics: [
      'Multi-pass PDF classification',
      'MCP tool integration',
      'Automated Documenso signing',
    ],
    summary:
      'Engineered a Google ADK pipeline that extracts and classifies procurement documents for downstream agents, paired with a Documenso signing service exposed as MCP tools.',
  },
  {
    slug: 'node-api',
    title: 'Chatbot Agent with Dynamic DB Tools',
    subtitle: 'Conversational Agent with Schema-Aware Database Tool Execution',
    category: 'agentic-ai',
    categoryLabel: 'Agentic AI & MCP',
    featured: false,
    role: 'Creator',
    timeline: '2025',
    tags: ['Node.js', 'TypeScript', 'SQL', 'LangChain', 'Express', 'PostgreSQL'],
    links: {
      github: 'https://github.com/Ravicha2/node-api',
    },
    metrics: [
      'Dynamic schema inspection',
      'Parameterized SQL execution',
      'Tool-calling agent architecture',
    ],
    summary:
      'Conversational AI agent capable of dynamic database schema inspection and tool calling to safely query and mutate structured data.',
  },
  {
    slug: 'robotic-arm-ultrasound',
    title: '6-DOF Robotic Arm for Ultrasonography Training',
    subtitle: 'Passive Probe Tracking System for Medical Simulation',
    category: 'robotics',
    categoryLabel: 'Robotics',
    featured: false,
    role: 'Researcher & Co-Author (Chulalongkorn University)',
    timeline: '2023',
    tags: ['C', 'MATLAB', 'Robotics', 'Sensors', 'Kinematics', 'IEEE TENCON'],
    links: {
      paper: 'https://ieeexplore.ieee.org/document/10349000',
    },
    metrics: [
      'Sub-millimeter position accuracy',
      'Real-time spatial orientation tracking',
      'IEEE TENCON 2023 presentation',
    ],
    summary:
      'Developed and tested a 6-degree-of-freedom passive robotic arm probe tracking system to measure position and orientation accuracy during ultrasound medical training.',
  },
  {
    slug: 'heal-a2a',
    title: 'Heal: Community Mental Health Support',
    subtitle: "Founder's Choice Award Winner at Hack2Heal",
    category: 'full-stack',
    categoryLabel: 'Full-Stack',
    featured: false,
    role: 'Lead Developer (Hack2Heal Hackathon)',
    timeline: '2025',
    tags: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS'],
    links: {
      demo: 'https://heal.a2a.ing',
    },
    metrics: [
      "Founder's Choice Award Winner",
      'Production deployment at heal.a2a.ing',
      'Real-time peer matching',
    ],
    summary:
      'Community mental health peer support platform recognized with the Founder\'s Choice Award at the Hack2Heal Hackathon.',
  },
];

export const featuredProjects: Project[] = projects.filter((p) => p.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export default projects;
