#set page(
  paper: "a4",
  margin: (x: 1.6cm, y: 1.6cm),
)
#set text(font: "New Computer Modern", size: 10pt, lang: "en")
#set par(leading: 0.7em, justify: false)

#show heading.where(level: 1): it => {
  v(0.6em)
  text(size: 11pt, weight: "bold", tracking: 0.5pt)[#it.body]
  v(-0.4em)
  line(stroke: 0.5pt + black, length: 100%)
}

#align(center)[
  #text(size: 20pt, weight: "bold")[RAVICHA SUKSAWASDI NA AYUTHAYA]
  #text(size: 9pt)[
    palm.ravicha\@outlook.com, 0426 290 882,
    #link("https://www.linkedin.com/in/ravicha-suksawasdi-na-ayuthaya/")[linkedin.com/in/ravicha-suksawasdi-na-ayuthaya] \
    #link("https://ravicha2.github.io/")[ravicha2.github.io]
  ]
]

= Summary

Master of IT student at UNSW (WAM 83, graduating Dec 2026). Focusing on agentic AI and backend systems. IEEE-published research, hands-on experience shipping multi-agent pipelines, graph databases, and event-driven architectures across internship and research contexts.

= Education

*Master of Information Technology* - UNSW Sydney, Australia \
Feb 2025 - Dec 2026 (expected), WAM 83 (Distinction average) \
Relevant coursework in Computer Science, Software Engineering, and AI.

*Exchange Study - Master of Science in Information Technology* - IMT Atlantique, Rennes, France \
Sep 2022 - Jan 2023, Specialisation in Architecture and Engineering in IoT.

*Bachelor of Automotive Design and Manufacturing Engineering* - Chulalongkorn University, Bangkok, Thailand \
Aug 2019 - Aug 2023, Mechanical Engineering, Electrical Engineering, and Project Management.

= Work Experience

*Software Engineer Intern, Tendor, Australia*, Jul 2026 - Sep 2026
- Built a Google ADK pipeline that extracts and classifies procurement documents in production, feeding insights into downstream agent workflows and the memory system.
- Designed and deployed an MCP-exposed Documenso signing service, giving agents autonomous document-signing capability.
- Automated end-to-end tender submission through MCP tools, replacing a manual multi-step process for agents.

*Backend Engineer Intern, NodesNow LLC, Thailand*, Dec 2025 - Feb 2026
- Engineered a fault-tolerant AI agent orchestration system using Inngest to manage document ingestion workflows, handling automated retries and fan-in/fan-out concurrency, eliminating manual failure intervention.
- Persisted ingested data into pgvector and Neo4j to support downstream RAG features.
- Containerized the full stack (backend services, Inngest server, and databases), enabling reproducible local development and smooth infrastructure migration.
- Implemented end-to-end with NestJS (backend) and React (frontend).
- #link("https://github.com/Ravicha2/document-ingestion-agent")[github.com/Ravicha2/document-ingestion-agent]

*District Heating Designer, 3D Technical Design, Thailand*, Aug 2023 - Jan 2025
- Designed 2D and 3D route arrangements with stress calculations for heat distribution across 10+ UK sites.
- Identified operational hazards for contractors in construction and handover phases.
- Mentored an intern and colleagues on construction design workflows.

= Projects

*GraphRAG-Enhanced Memory Management for Intelligent Agents* - Research, UNSW, June 2026
- Built an end-to-end ADR violation detector for AI-generated code, ingesting source files and ADR documents into an Architectural Decision Graph and traversing it to surface constraint conflicts.
- Implemented tiered conflict resolution, and integrated violation reporting into GitHub commit status checks.
- Benchmarked against baseline across 5 open source repositories: 62% lower token cost, 27% faster review time, and nearly 2x precision.
- Stack: Python, FastAPI, Neo4j, Docker, uv
- #link("https://github.com/Ravicha2/Shepherd")[github.com/Ravicha2/Shepherd]

*Lit-Review-Council* - Kaggle × Google: 5-Day AI Agents Intensive Course, June 2026
- Designed a tiered multi-agent orchestration pipeline using Google ADK with parallel/sequential wave execution, dual-track research agents (academic via ArXiv/OpenAlex, practitioner via GitHub), and a 3-reviewer Borda-count ensemble.
- Shipped as a MCP server on PyPI, installable via `uvx lit-review-council`; compatible with Claude Code, VS Code, and Cursor.
- Implemented guardrails: citation validation, dangling-reference rejection, source-tier classification, and automated retry logic.
- #link("https://github.com/Ravicha2/lit-review-council")[github.com/Ravicha2/lit-review-council]

= Technical Skills

*Languages:* Python, TypeScript, JavaScript, SQL, C++, C, Bash, HTML/CSS \
*Frameworks & Libraries:* FastAPI, NestJS, React, LangGraph, Inngest, TensorFlow, Keras \
*Data & Databases:* PostgreSQL, Neo4j, Apache AGE, pgvector, Apache Spark, Hadoop \
*Cloud & DevOps:* Docker, AWS (S3, EC2), Vercel, Supabase, Git

= Publication

*Position Accuracy of a 6-DOF Passive Robotic Arm for Ultrasonography Training* \
IEEE Region 10 Technical Conference (TENCON 2023) - Co-author and presenter
- Presented ultrasound probe tracking system (position and orientation) to foster sonography training, implemented in C and MATLAB.
- Advisor: Assoc. Prof. Ronnapee Chaichaowarat, PhD.

= Extracurricular

*Leadership Foundation Program* - UNSW Sydney, May 2025 \
3-day workshop covering leadership, DEI in workplaces, and communication.

*Professional Development Program* - UNSW Sydney, Sep 2025 \
3-day intensive training in communication, personal branding, and networking.