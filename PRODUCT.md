# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — recruiters and hiring managers** screening for Applied AI, agentic
systems, and backend engineering roles. Largely the Sydney/Australian market,
plus international remote. They arrive with a job description and a short
attention budget: they need role fit, verifiable proof, and a way to make
contact without hunting.

**Secondary — technical interviewers and engineering peers.** They read the
4-part case studies for depth and will test whether the systems claims survive
scrutiny. The depth has to be real, not decorative.

**Tertiary — machine readers.** AI agents and search crawlers are served
deliberately and separately (see Operating Context). They are not an audience to
persuade, but they are a discovery channel the content must stay honest to.

**Emerging — prospective clients.** Agency/client work is a stated direction,
not a live offer. No visitor currently arrives as a client; future work must not
design that path out.

## Product Purpose

A personal engineering portfolio that turns a verifiable record into a hiring
decision, and later into inbound client work. It exists because a résumé PDF
cannot demonstrate multi-file architectural reasoning or link a claim to a
running deployment. Success: a recruiter or engineer can confirm the applied-AI
systems-engineering claim from the site alone, without emailing first.

## Positioning

Systems-engineering provenance applied to non-deterministic AI. Palm came from
physical engineering — automotive design, then district-heating route and stress
design — and treats LLMs as untrusted components inside deterministic
architecture: durable state machines, graph-based compliance verification,
schema-safe pipelines, idempotent retries.

The mechanism a neighboring portfolio could not truthfully copy: claims are
settled by deterministic verification rather than prompt craft — Cypher
traversal over a unified AST + ADR graph to catch the multi-file layer-boundary
violations vector search misses, Inngest durable steps that resume mid-pipeline
without orphaning state, programmatic DOI/arXiv validation that rejects dangling
citations. The physical-engineering background is the second differentiator:
failure modes treated as absolute, not as edge cases.

## Operating Context

- **Job search timing.** Graduating Dec 2026 from a Master of IT at UNSW Sydney
  (WAM 83, Distinction). Actively targeting full-time Applied AI, agentic
  systems, and backend infrastructure roles.
- **Availability framing (confirmed).** Global remote, Sydney-based, 485
  post-study work visa eligible, Thai citizen. Searching beyond Australia, not
  Australia alone.
- **Employer IP boundary.** The Tendor internship ran Jul 2026 – 22 Sep 2026 and
  is complete. An IP agreement with Tendor restricts showing that work, and
  Tendor work materials must be removed from local machines. The employer name,
  role, and a description of the work shipped — the Google ADK document
  pipeline, the MCP-exposed signing service, and tender submission automation —
  may remain on the site, kept in step with `Ravicha_cv_AU.typ`. No Tendor
  artifacts, repos, or metrics.
- **Dual publication.** Content ships twice: human surfaces (React SPA) and
  static machine-readable files (`public/llms.txt`, `public/llms-full.txt`,
  `sitemap.xml`, `robots.txt`, JSON-LD). The two must stay in sync — the machine
  files are maintained by hand, not generated from the app.
- **Case study structure.** Flagship projects follow a fixed four-part shape:
  Intuition & Friction → Problem Encountered → Why Built This Way → Outcomes &
  Verification.
- **Research context.** Concurrent UNSW research on GraphRAG architectural
  compliance, plus open-source agent tooling.
- **Deployment.** GitHub Pages static SPA, with a `404.html` redirect handler so
  deep links like `/projects/shepherd` survive a hard reload.

## Capabilities and Constraints

- Four routes: `/` (overview), `/projects` (filterable catalog),
  `/projects/:slug` (case study), `/experience` (timeline, skills, education) —
  plus `/llms.txt` and `/llms-full.txt` served statically.
- Seven documented projects: four flagship (Shepherd, NL2REGEX, Document
  Ingestion Agent, Lit-Review-Council) and three supporting (node-api,
  robotic-arm-ultrasound, heal-a2a).
- Accessibility is a hard floor, not an enhancement: WCAG AAA contrast target,
  keyboard focus rings, skip link, screen-reader route announcements, and full
  `prefers-reduced-motion` suppression with an instant fallback when the View
  Transitions API is unavailable.
- **Undecided — agency/services surface.** Client work is a direction, not a
  live offer. No services page, offering, pricing, or engagement model exists,
  and none should be assumed. Recorded so later work does not foreclose it.
- **Undecided — where visa status appears.** The availability facts are
  confirmed; which surface states them, and in how much detail, is not.

## Brand Commitments

- **Name.** "Palm Suksawasdi" is the preferred public name. "Ravicha Suksawasdi
  Na Ayuthaya" is the full/legal name and appears on the IEEE publication.
- **Voice.** First-person, direct, plain, evidence-led. No hype adjectives, no
  marketing register. Claims carry links.
- **Real identities, fixed.** GitHub `Ravicha2`, LinkedIn,
  `palm.ravicha@outlook.com`, `ravicha2.github.io`, and the PyPI package
  `lit-review-council`.
- **The incumbent visual world is explicitly not binding.** The user confirmed
  the current ElevenLabs-derived editorial monochrome treatment may change.
  Treat it as revisable evidence, not as an identity constraint.

## Evidence on Hand

- Four flagship case studies with complete four-part narratives, stack lists,
  and metrics — in `src/data/projects.ts` and `public/llms-full.txt`.
- Verified outcomes: PyPI release (`uvx lit-review-council`); live deployment at
  `http://207.148.87.49`; live `https://heal.a2a.ing`; GitHub Commit Status Check
  integration for Shepherd; benchmarked 100% detection of multi-hop layer
  violations missed by vector baselines; a 1,000,000+ row stress test with zero
  worker memory spikes.
- IEEE TENCON 2023 publication, co-author and presenter
  (`https://ieeexplore.ieee.org/document/10349000`), image at `/assets/IEEE.png`.
- Hack2Heal Founder's Choice Award, image at `/assets/Hack2Heal.png`.
- Academic record: WAM 83 / Distinction average; coursework and research detail
  in `src/data/experience.ts`.
- Assets present: `/assets/Hero.jpeg`, self-hosted Geist variable fonts, and a
  Typst CV source at `Ravicha_cv.typ`.
- **Absences — must not be fabricated:** no testimonials or referee quotes, no
  client or employer logos, no Tendor work artifacts or metrics, no user or
  traffic numbers for the site itself, no rates or salary figures, and no team
  sizes beyond those recorded.

## Product Principles

1. **Evidence beats adjectives.** Every claim resolves to a repo, a deployment,
   a publication, or a measured result. If it cannot be verified, cut it or
   qualify it.
2. **Machine-readable parity.** Anything a human can learn here, a crawler can
   learn without executing JavaScript. When content changes, the static files
   change with it.
3. **Systems engineering is the through-line.** The differentiator is
   deterministic architecture wrapped around non-deterministic AI, not
   familiarity with AI tools.
4. **One identity, two conversion paths.** Hiring and, later, client work draw
   on the same credible record. The site never splits into two personas.
5. **Employer and IP boundaries outrank completeness.** Nothing is published
   about an employer beyond what is agreed, even where a fuller story would read
   better.

## Accessibility & Inclusion

WCAG AAA contrast is the stated target, with keyboard focus rings, a skip link,
and route-change announcements for screen readers. Motion is fully suppressed
under `prefers-reduced-motion`, and unsupported View Transitions degrade to an
instant navigation rather than a broken one.
