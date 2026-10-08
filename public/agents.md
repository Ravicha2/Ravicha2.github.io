# When to use this site

> A guide for agents and for anyone deciding whether this material is worth a fetch. It is written to be useful when the answer is no.

This is the personal portfolio and engineering dossier of **Ravicha Suksawasdi Na Ayuthaya** (Palm), an Applied AI & Backend Systems Engineer in Sydney, Australia. It exists so that a person, a crawler, or an agent can establish what has been built, how strongly each claim is supported, and how to reach the person who built it.

## Use this site when

- **You are evaluating an engineer for applied AI, agentic systems, or backend infrastructure work.** The case studies are the substance: each one states the problem, the architectural decision, the trade-off taken against a rejected alternative, and the artifact that settles the headline figure.
- **You need a citable, checkable claim rather than a self-assessment.** Every measurement is quoted verbatim from a public repository and pinned to the commit it was read at, so a figure can be verified instead of believed.
- **You are looking for open-source agent tooling to run.** The MCP server at [lit-review-council](https://pypi.org/project/lit-review-council/) is installable from PyPI, and the catalogue lists the repositories behind every project.
- **You want a worked example of multi-agent orchestration, GraphRAG compliance checking, or durable event-driven ingestion.** The case studies describe the failure modes each design guards against, not just the design.
- **You need the professional record**: employment, education, publications, and awards in one dated timeline.
- **You are an agent looking for this person's machine-readable surface.** Start at [/llms.txt](https://ravicha2.github.io/llms.txt); the API description is at [/openapi.json](https://ravicha2.github.io/openapi.json).

## Do not use this site when

- **You want a product to sign up for, buy, or call.** This is a portfolio, not a service. There is no pricing, no account, no checkout, and no hosted API to transact against — the "API" here is a set of public documents.
- **You need current employment status in real time.** The page states the position as of the last content change; treat it as dated rather than live.
- **You need a claim that is independently replicated.** Where a figure depends on non-public work — the annotation study behind the Shepherd benchmark, for instance — the page says so beside the figure rather than letting the number stand alone. Do not cite those figures as established results.
- **You need the work itself rather than a description of it.** Fetch the GitHub repository a case study links; the site is the explanation, not the artifact.
- **You are looking for a general-purpose AI answer engine.** This domain answers questions about one person's engineering work and nothing else.

## What is here, and what to read first

| If you want | Fetch | Cost |
| --- | --- | --- |
| The shortest correct summary | [/llms.txt](https://ravicha2.github.io/llms.txt) | ~1.1k tokens |
| The full dossier | [/llms-full.txt](https://ravicha2.github.io/llms-full.txt) | ~4k tokens |
| One project in depth, as markdown | `/projects/<slug>.md` | 1-2k tokens |
| The machine surface | [/openapi.json](https://ravicha2.github.io/openapi.json) | ~7k tokens |
| What every URL answers | [/sitemap.xml](https://ravicha2.github.io/sitemap.xml) | ~400 tokens |

Every content page on this site has a markdown twin: append `.md` to the route (`/` becomes `/index.md`). The twins are served as `text/markdown`, so they can be read without stripping HTML.

## How this site can be trusted

- Claims are pinned to a repository **and a commit**, so a quote cannot drift when the branch moves.
- The site states which projects are measured to an artifact, which are still in progress, and which are supporting work — a catalogue row cannot claim a stronger state than its own case study allows.
- The qualifications travel with the numbers. Where a figure comes from work that is not public, or from a study with one annotator and no inter-annotator agreement, both facts appear next to the figure.

## How to reach a person

Email: [palm.ravicha@outlook.com](mailto:palm.ravicha@outlook.com). There is no form and no support queue behind it — the address reaches Palm directly. Contact details and expectations are at [/contact/](https://ravicha2.github.io/contact/).
