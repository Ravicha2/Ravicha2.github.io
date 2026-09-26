import { Project, CategoryOption, ProjectCategory } from './types';

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
    role: 'Researcher & Developer (UNSW Sydney)',
    timeline: 'Jun 2026',
    tags: ['Python', 'Neo4j', 'Cypher', 'Docker', 'uv', 'GitHub Actions', 'GraphRAG'],
    links: {
      github: 'https://github.com/Ravicha2/Shepherd',
    },
    metrics: [
      { value: '17/21', label: 'gold violations detected on the home-assistant full graph (Shepherd eval.md)' },
      { value: '88,508 nodes', label: 'Architectural Decision Graph parsed from that repository' },
      { value: '5 repos / 63 units', label: 'benchmark gold set behind those detections' },
    ],
    proof: {
      kind: 'table',
      repo: 'Ravicha2/Shepherd',
      commit: 'e4d177fb173631f378010f416dc9ae18b3eb32ec',
      path: 'benchmark/reports/2026-09-17T20-09-41/AGGREGATE.md',
      from: 13,
      to: 19,
      settles:
        'False positives fall from 66 to 33 across the four-repo benchmark while detection holds at 17 exact units.',
      quote: `| repo | base FP (zero/has) | new r1 | new r2 | worst (zero/has) | excl. tooling edges | detection violation e/p/m |
|---|---|---|---|---|---|---|
| python-tuf | 4 (3/1) | 1 (1/0) | 4 (4/0) | 4 (4/0) | 0 | 6/0/0 (base 6/0/0) |
| flowkit | 45 (43/2) | 14 (12/2) | 15 (12/3) | **15 (12/3)** | 32 / 40 | r1 6/0/6, r2 9/0/3 (base 9/0/3) |
| experimenter | 10 (8/2) | 14 (12/2) | 13 (12/1) | **14 (12/2)** | 1 / 0 | 1/0/17 (base 0/0/18) |
| structurizr-python | 7 (7/0) | 0 (0/0) | 0 (0/0) | **0 (0/0)** | 13 / 13 | 4/0/2 (base 4/0/2) |
| **total** | **66 (61/5)** | | | **33 (28/5)** | | **17/0/25** (base 19/0/23) |`,
    },
    proofLine: '4-repo benchmark · FP 66 → 33 · detection 17 exact / 0 partial / 25 miss',
    image: '/assets/captures/shepherd.png',
    imageAlt: 'The Shepherd project mark: a German shepherd’s head.',
    imageWidth: 689,
    imageHeight: 362,
    imageCaption:
      'The Shepherd mark, supplied by the author — it names the project rather than settling a claim. The 17/21 detection is settled by benchmark/reports/2026-09-17T20-09-41/AGGREGATE.md at e4d177f.',
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
          'ADR specifications written in ambiguous natural language requiring structured constraint extraction',
          'False positive alerts on legitimate mock dependencies in test suites',
        ],
        constraints: [
          'lean token consumption on architectural dependencies review',
          'high precision and recall on AI code review.',
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
              'Differentiates fatal architectural boundary violations from advisory suggestions, resolved in order by explicit supersession, specificity, recency, then human review.',
            vsAlternative: 'Binary pass/fail checks',
          },
        ],
        guardrails: [
          'Automated AST parsing with robust syntax error handling and fallback modes',
          'Isolated Cypher query execution with query timeouts',
          'Violation lifecycle persistence, so a dismissed false positive stays dismissed across runs',
        ],
        summary:
          'Unified AST and ADR property graphs paired with tiered violation resolution.',
      },
      outcomes: {
        verification: [
          'cpt detect --json emits machine-readable violations for CI scripts and PR checks',
          'Scored 17 of 21 gold detection units on the home-assistant full graph (88,508 nodes), with every miss traced to a recorded resolver edge choice',
        ],
        impact: [
          'Automated architecture governance in AI-augmented codebases, ensuring AI-written code obeys human architectural decisions.',
          'Eliminated architectural erosion in rapidly evolving multi-agent repositories.',
        ],
        takeaway:
          'Non-deterministic AI code generation requires deterministic graph-based structural verification to maintain long-term software maintainability.',
        summary:
          'Deterministic architectural governance via graph verification, with JSON detection output for CI.',
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
      video: 'https://youtu.be/mFec2jMgosg',
    },
    metrics: [
      { value: '172', label: 'backend tests over the API, Spark projection, Parquet normalization, and ReDoS safety' },
      { value: '3–5 s', label: 'Spark JVM startup per task avoided by the singleton session (ADR 0004)' },
      { value: '5', label: 'documented architectural decision records (0001–0005)' },
    ],
    proof: {
      kind: 'capture',
      repo: 'Ravicha2/NL2REGEX',
      commit: '9c9fe8a506b03c9df43aa7a09b663b465f62ccff',
      path: 'backend/tests/jobs/tests_regex_safety.py',
      from: 16,
      to: 26,
      settles:
        'The ReDoS sandbox is load-bearing, not decorative: both catastrophic-backtracking patterns raise instead of hanging the worker.',
      quote: `    def test_catastrophic_backtracking_regex_times_out(self):
        # (a+)+b on all-'a' string forces exponential backtracking (no 'b' to match)
        pattern = r"(a+)+b"
        with self.assertRaises(RegexSafetyError):
            LLMRegexService.validate_regex_safety(pattern)

    def test_nested_quantifier_backtracking(self):
        # Another pathological pattern: (a|a)* on repeated 'a's
        pattern = r"(a|a)*b"
        with self.assertRaises(RegexSafetyError):
            LLMRegexService.validate_regex_safety(pattern)`,
    },
    proofLine: '172 backend tests · ADR 0004 pays JVM startup once per worker, not per task',
    image: '/assets/captures/NL2REGEX.png',
    imageAlt:
      'The NL2REGEX workspace: the uploaded file list, its parsed table, and the natural-language prompt box.',
    imageWidth: 2848,
    imageHeight: 1338,
    imageCaption:
      'The NL2REGEX workspace running from the repository at 9c9fe8a — the uploaded file, its parsed table, and the prompt that drives the job.',
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
          'Worker stability under concurrent multi-user transformations on large datasets',
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
          '172-test backend suite covering the API surface, Spark projection, Parquet normalization, pagination, and ReDoS-safety cases',
          'Validated regex execution safety against known ReDoS malicious payload benchmarks',
        ],
        impact: [
          'Lets non-technical users transform large tabular datasets without writing regex or moving records to a cloud LLM.',
          'Documented in 5 architectural decision records (ADRs) covering LLM triage, Parquet normalization, and the PySpark session strategy.',
        ],
        takeaway:
          'Separating intent extraction from data execution isolates LLM non-determinism from high-throughput distributed engines.',
        summary:
          'Fault-tolerant distributed regex processing documented in 5 ADRs and a 172-test backend suite.',
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
      { value: '8', label: 'durable Inngest steps across 4 worker functions, each retryable on its own' },
      { value: '2 stores', label: 'pgvector embeddings and Neo4j graph entities, written per step' },
    ],
    proof: {
      kind: "trace",
      repo: 'Ravicha2/document-ingestion-agent',
      commit: 'a698cbf6840da87341e68e86fb5593847555e525',
      path: 'backend/src/inngest/functions/ingestion.ts',
      from: 24,
      to: 70,
      settles:
        "Every stage is its own durable step, so a failure at one resumes there rather than restarting the run.",
      quote: `            const extractionResult = await step.run("extract-chunks", async () => {
                await publish({
                    channel: channelName,
                    topic: "progress",
                    data: { status: "PROCESSING", action: "SPLITTING",message: "Parsing PDF...", percent: 10 }
                });
                
                return await agentService.run(filePath);
            });

            const rawChunks = extractionResult.chunks || [];
            if (rawChunks.length === 0) {
                 return { success: false, message: "No text found in PDF" };
            }

            // 2. Save Initial Chunks to DB (Text only, Embedding is NULL)
            const chunkIds = await step.run("save-initial-chunks", async () => {
                const ids = await toolsService.saveInitChunks(rawChunks, runId, filePath);
                return ids;
            });

            // 3. Create Batches
            const BATCH_SIZE = 10; 
            const idBatches = batchArray(chunkIds, BATCH_SIZE);

            const events = idBatches.flatMap((batchOfIds, index) => {
                const payload = {
                  runId, 
                  chunkIds: batchOfIds, 
                  batchIndex: index,
                  totalBatches: idBatches.length,
                  channelName 
                };
              
                return [
                  {
                    name: "app/rag.process_vector_batch",
                    data: payload
                  },
                  {
                    name: "app/rag.process_graph_batch",
                    data: payload
                  }
                ];
              });
            // 5. Notify Client of "Queued" Status
            await step.sendEvent("dispatch-parallel-jobs", events);`,
    },
    proofLine: '8 durable steps / 4 worker functions · each stage retries alone',
    image: '/assets/captures/gh-doc-ingestion.png',
    imageWidth: 1428,
    imageHeight: 705,
    imageCaption:
      "github.com/Ravicha2/document-ingestion-agent — captured at the current default branch.",
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
          'Eight durable steps across four Inngest worker functions, each checkpointed and retryable with exponential backoff, so a failure resumes at the failed step rather than the start.',
          'Containerized full stack (NestJS, Inngest server, Neo4j, pgvector) with Docker Compose for automated CI test suites.',
        ],
        impact: [
          'Removes manual engineer intervention on ingestion pipeline failures.',
          'Enabled hybrid RAG search combining semantic vector similarity with multi-hop knowledge graph queries.',
        ],
        takeaway:
          'Long-running AI agent workflows must be architected as durable state machines where steps checkpoint state rather than monolithic background scripts.',
        summary:
          'Fault-tolerant durable orchestration and hybrid GraphRAG retrieval for document ingestion.',
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
      { value: 'PyPI', label: 'published, install via uvx lit-review-council; listed on the MCP Registry' },
      { value: '3', label: 'independent reviewer agents ranked by Borda count' },
      { value: '2', label: 'research tracks per topic: academic (ArXiv/OpenAlex) and practitioner (GitHub)' },
    ],
    proof: {
      kind: "capture",
      repo: 'Ravicha2/lit-review-council',
      commit: '40c4c19711067bd182a6465184585697e5723403',
      path: 'src/scoring.py',
      from: 12,
      to: 35,
      settles:
        "Consensus is a counted Borda tally over named reviewers, not a model asked to agree with itself.",
      quote: `def tally_ensemble_rankings(rankings: List[Optional[Any]]) -> Tuple[str, List[str]]:
    """
    Applies Borda count (2 pts for 1st, 1 pt for 2nd) and returns the winning label 
    and the list of rationale strings.
    """
    scores = {"A": 0, "B": 0}
    reasons = []
    
    reviewers = ["Researcher", "Engineer", "Architect"]
    
    for i, r_obj in enumerate(rankings):
        reviewer_name = reviewers[i] if i < len(reviewers) else f"Reviewer_{i}"
        
        if r_obj:
            lst = r_obj.ranking if hasattr(r_obj, "ranking") else r_obj.get("ranking", [])
            rat = r_obj.rationale if hasattr(r_obj, "rationale") else r_obj.get("rationale", "")
            if lst and len(lst) >= 1:
                # 1st place gets 2 points, 2nd gets 1 point
                if lst[0] in scores: scores[lst[0]] += 2
                if len(lst) > 1 and lst[1] in scores: scores[lst[1]] += 1
            reasons.append(f"{reviewer_name} rationale: {rat}")

    top_label = "A" if scores["A"] >= scores["B"] else "B"
    return top_label, reasons`,
    },
    proofLine: '3 reviewers · Borda 2/1 tally · winner returned with every rationale',
    image: '/assets/captures/pypi-litreview.png',
    imageWidth: 1440,
    imageHeight: 683,
    imageCaption:
      "pypi.org/project/lit-review-council — published, not just committed.",
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
              'Three independent reviewers (Researcher, Engineer, Neutral) evaluate anonymized reports on novelty, methodology, and practicality before aggregating ranks via Borda voting.',
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
          'Published to PyPI (installable via uvx lit-review-council) and listed on the MCP Registry, with documented install paths for Claude Code and VS Code.',
          'Every URL in a finished report must appear in the source references or the synthesis step retries, so dangling citations are rejected before output rather than reviewed after it.',
        ],
        impact: [
          'Lets researchers and engineers run a multi-perspective literature review from their IDE.',
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
      { value: '3 tables / 5 operations', label: 'SQL surface exposed to the agent as typed tools' },
      { value: '1,536-dim', label: 'pgvector embeddings with cosine-similarity search' },
      { value: '3 tools', label: 'web search, database CRUD, and candidate RAG search in one graph' },
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
      { value: '2023', label: 'IEEE TENCON publication and conference presentation' },
      { value: '6-DOF', label: 'passive probe-tracking arm, implemented in C and MATLAB' },
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
      { value: 'Live', label: 'deployed at heal.a2a.ing' },
      { value: '2025', label: "Founder's Choice Award winner, Hack2Heal" },
    ],
    image: '/assets/captures/heal-desktop.png',
    imageWidth: 1440,
    imageHeight: 683,
    imageCaption:
      "heal.a2a.ing — the product, live, as deployed.",
    summary:
      'Community mental health peer support platform recognized with the Founder\'s Choice Award at the Hack2Heal Hackathon.',
  },
];

export const featuredProjects: Project[] = projects.filter((p) => p.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsByCategory(category: ProjectCategory | 'all'): Project[] {
  if (category === 'all') {
    return projects;
  }
  return projects.filter((p) => p.category === category);
}

export default projects;
