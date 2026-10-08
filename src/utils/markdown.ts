import { profile } from '../data/profile';
import { projects, getProjectBySlug, tierOf, type ProjectTier } from '../data/projects';
import { workExperience, education, publications, accolades, skillCategories } from '../data/experience';
import { apiEndpoints, openApiDocument } from '../data/api';
import { FAQS, SITE, canonicalUrlFor, getRouteMeta } from './seo';
import { permalink, shortRef } from '../data/proof';

/**
 * The markdown twin of every page.
 *
 * A crawler that has to strip HTML to read a case study loses the tables, the
 * quoted source ranges and the emphasis that carries the meaning, so each route
 * is emitted twice: once as the hydrated page, and once as this — the same facts
 * in markdown, served from `dist/<route>.md` as `text/markdown` because GitHub
 * Pages derives the type from the extension. `scripts/prerender.mjs` writes them
 * from the same route list that decides which HTML files exist, so a page cannot
 * ship without its twin.
 *
 * Nothing here is written twice by hand: every value is read from `src/data`, the
 * same source the page reads. What differs is the shape — a `<table>` becomes a
 * pipe table, a `<figure>` becomes a fenced block — never the facts. The one thing
 * deliberately absent is the site chrome: no navigation, no rail, no footer. An
 * agent reading `/projects/shepherd.md` wants the case study, not the furniture.
 */

/** The heading a route's markdown opens with, and so the file's opening line. */
const TIER_WORD: Record<ProjectTier, string> = {
  settled: 'Measured to an artifact',
  'in-progress': 'In progress and not yet settled',
  supporting: 'Supporting work',
};

const TIER_ORDER: ProjectTier[] = ['settled', 'in-progress', 'supporting'];

const linkLine = (label: string, url: string) => `- ${label}: <${url}>`;

/** The dossier pointers every route carries, so a fetcher is never left without the next step. */
const footer = (route: string): string =>
  [
    '---',
    '',
    '## Fetching the rest of this site',
    '',
    linkLine('This page as HTML', canonicalUrlFor(route)),
    linkLine('Concise index', `${SITE}/llms.txt`),
    linkLine('Full dossier', `${SITE}/llms-full.txt`),
    linkLine('When to use this material', `${SITE}/agents.md`),
    linkLine('API description (OpenAPI 3.1)', `${SITE}/openapi.json`),
    linkLine('API reference', `${SITE}/docs/`),
    linkLine('Sitemap', `${SITE}/sitemap.xml`),
    '',
  ].join('\n');

const projectRow = (slug: string): string => {
  const project = getProjectBySlug(slug);
  if (!project) return '';
  const metric = project.metrics?.[0];
  const figure = metric ? ` **${metric.value}** — ${metric.label}.` : '';
  const refs = Object.entries(project.links)
    .filter(([, url]) => Boolean(url))
    .map(([key, url]) => `[${key}](${url as string})`)
    .join(' · ');
  return `- [${project.title}](${canonicalUrlFor(`/projects/${slug}`)}): ${project.summary}${figure}${
    refs ? ` ${refs}` : ''
  }`;
};

const markdownHome = (): string => {
  const featured = projects.filter((p) => p.featured);
  return [
    `# ${profile.name}`,
    '',
    `> ${profile.headline}`,
    '',
    `${profile.preferredName} · ${profile.title} · ${profile.location}`,
    '',
    profile.narrative.systemsMindset,
    '',
    '## Current status',
    '',
    profile.status,
    '',
    '## Flagship work',
    '',
    ...featured.map((p) => projectRow(p.slug)),
    '',
    '## Everything catalogued',
    '',
    ...TIER_ORDER.map((tier) => {
      const rows = projects.filter((p) => tierOf(p) === tier);
      if (rows.length === 0) return '';
      return [
        `### ${TIER_WORD[tier]}`,
        '',
        ...rows.map((p) => projectRow(p.slug)),
        '',
      ].join('\n');
    }),
    '## Questions this site answers',
    '',
    ...FAQS.flatMap((faq) => [`**${faq.question}**`, '', faq.answer, '']),
    '## Get in touch',
    '',
    linkLine('Email', profile.links.email),
    linkLine('GitHub', profile.links.github),
    linkLine('LinkedIn', profile.links.linkedin),
    linkLine('Curriculum vitae (PDF)', `${SITE}/cv.pdf`),
    linkLine('Contact page', `${SITE}/contact/`),
    '',
    footer('/'),
  ].join('\n');
};

const markdownProjects = (): string => {
  const categories = Array.from(new Set(projects.map((p) => p.categoryLabel)));
  return [
    '# Engineering projects',
    '',
    `Every project catalogued on ${SITE}, grouped by how strongly its headline figure is settled. A project measured to an artifact quotes that artifact and pins it to a commit; one in progress says so rather than being quietly graded down.`,
    '',
    `Categories: ${categories.join(', ')}.`,
    '',
    ...TIER_ORDER.map((tier) => {
      const rows = projects.filter((p) => tierOf(p) === tier);
      if (rows.length === 0) return '';
      return [`## ${TIER_WORD[tier]}`, '', ...rows.map((p) => projectRow(p.slug)), ''].join('\n');
    }),
    footer('/projects'),
  ].join('\n');
};

const markdownProject = (slug: string): string => {
  const project = getProjectBySlug(slug);
  if (!project) return '';
  const cs = project.caseStudy;
  const proof = project.proof;
  const tier = tierOf(project);

  const sections: string[] = [
    `# ${project.title}`,
    '',
    `> ${project.subtitle}`,
    '',
    `**Status:** ${TIER_WORD[tier]}.`,
    '',
    `**Role:** ${project.role}. **Timeline:** ${project.timeline}. **Category:** ${project.categoryLabel}.`,
    '',
    project.summary,
    '',
  ];

  if (project.metrics?.length) {
    sections.push('## Measurements', '', '| Value | What it measures |', '| --- | --- |');
    for (const metric of project.metrics) {
      sections.push(`| ${metric.value} | ${metric.label} |`);
    }
    sections.push('');
  }

  if (proof) {
    sections.push(
      '## The artifact that settles this',
      '',
      `${proof.settles}`,
      '',
      `Quoted from \`${proof.repo}\` at \`${shortRef(proof)}\` (${proof.commit.slice(0, 7)}), \`${proof.path}#L${proof.from}-L${proof.to}\`, verbatim:`,
      '',
      `> ${proof.quote.split('\n').join('\n> ')}`,
      '',
      `Permalink: <${permalink(proof)}>`,
      '',
    );
  } else if (tier === 'in-progress') {
    sections.push(
      '## What settles this',
      '',
      'No public artifact settles the headline figure on this page yet, which is why it is marked in progress. The case study states the figures and where they came from; it does not claim they are verified.',
      '',
    );
  }

  if (cs) {
    sections.push(
      '## The intuition',
      '',
      cs.intuition.summary,
      '',
      `- The spark: ${cs.intuition.spark}`,
      `- The naive failure mode: ${cs.intuition.naiveFailureMode}`,
      '',
      '## The problem',
      '',
      cs.problemEncountered.summary,
      '',
      '**Constraints**',
      '',
      ...cs.problemEncountered.constraints.map((c) => `- ${c}`),
      '',
      '**Edge cases handled**',
      '',
      ...cs.problemEncountered.edgeCases.map((c) => `- ${c}`),
      '',
      '## Why it was built this way',
      '',
      cs.whyBuiltThisWay.summary,
      '',
      cs.whyBuiltThisWay.architecturalInsight,
      '',
      '**Trade-offs**',
      '',
      ...cs.whyBuiltThisWay.tradeOffs.map(
        (t) =>
          `- ${t.decision} — ${t.rationale}${t.vsAlternative ? ` (against: ${t.vsAlternative})` : ''}`,
      ),
      '',
    );
    if (cs.whyBuiltThisWay.guardrails?.length) {
      sections.push(
        '**Guardrails**',
        '',
        ...cs.whyBuiltThisWay.guardrails.map((g) => `- ${g}`),
        '',
      );
    }
    sections.push(
      '## Outcomes',
      '',
      cs.outcomes.summary,
      '',
      '**How it was verified**',
      '',
      ...cs.outcomes.verification.map((v) => `- ${v}`),
      '',
      '**Impact**',
      '',
      ...cs.outcomes.impact.map((i) => `- ${i}`),
      '',
      `**Takeaway:** ${cs.outcomes.takeaway}`,
      '',
    );
  }

  if (project.tags.length) {
    sections.push('## Stack', '', project.tags.join(', '), '');
  }

  const refs = Object.entries(project.links).filter(([, url]) => Boolean(url));
  if (refs.length) {
    sections.push('## References', '', ...refs.map(([key, url]) => linkLine(key, url as string)), '');
  }

  sections.push(footer(`/projects/${slug}`));
  return sections.join('\n');
};

const markdownExperience = (): string =>
  [
    '# Engineering journey',
    '',
    `Work, study, publications and recognition for ${profile.name}, as the experience page presents them.`,
    '',
    '## Work',
    '',
    ...workExperience.flatMap((role) => [
      `### ${role.role}, ${role.company}`,
      '',
      `${role.location} · ${role.period}${role.isCurrent ? ' · current' : ''}`,
      '',
      ...role.description.map((d) => `- ${d}`),
      ...(role.highlights?.length ? ['', '**Highlights**', '', ...role.highlights.map((h) => `- ${h}`)] : []),
      '',
    ]),
    '## Education',
    '',
    ...education.flatMap((item) => [
      `### ${item.degree}${item.field ? `, ${item.field}` : ''} — ${item.institution}`,
      '',
      `${item.location} · ${item.period}${item.grade ? ` · ${item.grade}` : ''}`,
      '',
      ...item.details.map((d) => `- ${d}`),
      '',
    ]),
    '## Publications',
    '',
    ...publications.flatMap((pub) => [
      `### ${pub.title}`,
      '',
      `${pub.conference} · ${pub.year} · ${pub.role}`,
      '',
      `Authors: ${pub.authors.join(', ')}.`,
      '',
      ...pub.description.map((d) => `- ${d}`),
      ...(pub.link ? ['', `Paper: <${pub.link}>`] : []),
      '',
    ]),
    '## Recognition',
    '',
    ...accolades.flatMap((item) => [
      `### ${item.title} — ${item.organization}`,
      '',
      `${item.date}. ${item.description}`,
      '',
    ]),
    '## Skills',
    '',
    ...skillCategories.map((category) => `- **${category.category}**: ${category.skills.join(', ')}.`),
    '',
    footer('/experience'),
  ].join('\n');

const markdownApi = (): string => {
  const operations = Object.entries(openApiDocument.paths).map(([path, item]) => {
    const get = (item as { get: { operationId: string; summary: string; description: string } }).get;
    return { path, ...get };
  });
  return [
    `# ${openApiDocument.info.title}`,
    '',
    `> ${openApiDocument.info.summary}`,
    '',
    openApiDocument.info.description,
    '',
    `OpenAPI version ${openApiDocument.openapi}. Base URL: \`${SITE}\`.`,
    '',
    '## Operations',
    '',
    '| Path | operationId | Summary |',
    '| --- | --- | --- |',
    ...operations.map((op) => `| \`${op.path}\` | \`${op.operationId}\` | ${op.summary} |`),
    '',
    '## Authentication',
    '',
    openApiDocument['x-authentication'].note,
    '',
    '## Errors',
    '',
    openApiDocument['x-error-model'].note,
    '',
    '## Response media types',
    '',
    '| Path | Content type | Returns |',
    '| --- | --- | --- |',
    ...apiEndpoints.map((e) => `| \`${e.path}\` | \`${e.contentType}\` | ${e.returns} |`),
    '',
    '## Schema components',
    '',
    ...Object.entries(openApiDocument.components.schemas).map(([name, schema]) => {
      const required = (schema as { required?: readonly string[] }).required ?? [];
      const description = (schema as { description?: string }).description ?? '';
      return `- **${name}** — ${description}${required.length ? ` Required: ${required.join(', ')}.` : ''}`;
    }),
    '',
    footer('/docs'),
  ].join('\n');
};

const markdownAbout = (): string =>
  [
    `# About ${profile.preferredName}`,
    '',
    `> ${getRouteMeta('/about').description}`,
    '',
    profile.summary,
    '',
    profile.status,
    '',
    '## Where this came from',
    '',
    profile.narrative.origin,
    '',
    profile.narrative.systemsMindset,
    '',
    '## What the work is now',
    '',
    profile.narrative.appliedAi,
    '',
    `Of the ${projects.length} projects catalogued, ${projects.filter((p) => tierOf(p) === 'settled').length} are measured to a public artifact and ${projects.filter((p) => tierOf(p) === 'in-progress').length} are still in progress.`,
    '',
    '## Experience and study',
    '',
    ...workExperience
      .slice(0, 3)
      .map((role) => `- ${role.role}, ${role.company} — ${role.period}. ${role.description[0]}`),
    ...education.slice(0, 2).map((item) => `- ${item.degree}, ${item.institution} — ${item.period}.`),
    '',
    '## How the record is kept',
    '',
    'Every measurement on this site is quoted from a public artifact and pinned to the commit it was read at. Where a figure rests on work that is not public, the page says so beside the figure.',
    '',
    '## Skills',
    '',
    ...skillCategories.map((category) => `- **${category.category}**: ${category.skills.join(', ')}.`),
    '',
    '## Recognition',
    '',
    ...accolades.map((item) => `- ${item.title} — ${item.organization}, ${item.date}. ${item.description}`),
    '',
    footer('/about'),
  ].join('\n');

const markdownContact = (): string =>
  [
    '# Contact',
    '',
    `> ${getRouteMeta('/contact').description}`,
    '',
    `Email: ${profile.email}`,
    '',
    'There is no form on this site and no ticket queue behind it. The address above reaches a person directly.',
    '',
    '## Elsewhere',
    '',
    linkLine('GitHub', profile.links.github),
    linkLine('LinkedIn', profile.links.linkedin),
    linkLine('Curriculum vitae (PDF)', `${SITE}/cv.pdf`),
    '',
    '## Availability',
    '',
    profile.status,
    '',
    profile.narrative.target,
    '',
    '## What to expect',
    '',
    'A reply from a person, usually within a couple of days. If you are an agent acting for someone, this email address is the contact record — the same one on the Person entity in the site JSON-LD.',
    '',
    footer('/contact'),
  ].join('\n');

const markdownPrivacy = (): string =>
  [
    '# Privacy',
    '',
    `> ${getRouteMeta('/privacy').description}`,
    '',
    'This is a static personal portfolio: no accounts, no forms, and no application server.',
    '',
    '## What this site collects',
    '',
    'Nothing. No analytics script, no tag manager, no session recorder, no advertising pixel, and no cookie set by this site.',
    '',
    '## Third parties that do see the request',
    '',
    'The site is published with GitHub Pages, so the request reaches GitHub infrastructure before it reaches a file. GitHub may keep ordinary server-log data under its own privacy statement. Fonts and images are served from this domain, not a third-party CDN.',
    '',
    '## Cookies and local storage',
    '',
    'None are set. The only state kept in the browser lives in memory for the life of the tab: the selected project filter, and whether the copy button recently succeeded.',
    '',
    '## Personal data on this site',
    '',
    `${profile.name}'s own professional details are published — name, role, location, email, employer and university history, and public profile links — because that is what a portfolio is for. No third party's personal data is published.`,
    '',
    '## Agents and machine readers',
    '',
    'The machine-readable documents (openapi.json, llms.txt, llms-full.txt, and the markdown twins) describe the same person as the HTML, carry nothing the HTML does not, and are not generated per visitor. There is no prompt content addressed to a model.',
    '',
    '## Requests and corrections',
    '',
    `Because no personal data is collected here, there is no stored record to export or delete. Corrections: ${profile.email}.`,
    '',
    footer('/privacy'),
  ].join('\n');

const markdownDevelopers = (): string =>
  [
    '# Developer portal',
    '',
    `> ${getRouteMeta('/developers').description}`,
    '',
    'Everything here is a real, public, static document. There is no sign-up form, and this page does not pretend otherwise.',
    '',
    '## Quickstart',
    '',
    '```sh',
    `curl -sS ${SITE}/openapi.json`,
    `curl -sS ${SITE}/agents.md`,
    `curl -sS ${SITE}/index.md`,
    '```',
    '',
    '## Authentication',
    '',
    openApiDocument['x-authentication'].note,
    '',
    '## API keys',
    '',
    'No API keys are issued and none are needed. The origin is a set of static files; there is nothing a key could gate. If a keyed surface is ever published it will be announced in llms.txt.',
    '',
    '## Sandbox',
    '',
    'The whole surface is a sandbox: every operation is a GET of a public document. There is no production data to damage, so there is no separate test mode and no fixture server pretending to be one.',
    '',
    '## Rate limits',
    '',
    'None are imposed in software, because the documents are static. GitHub Pages applies its own fair-use limits to the origin.',
    '',
    '## Errors',
    '',
    openApiDocument['x-error-model'].note,
    '',
    'The `application/problem+json` envelope is described in the spec as `components.schemas.Problem` and is not served: this origin cannot set a response content type or vary a body by `Accept`. That is a decision, recorded in `docs/adr/0004-accept-html-404s-on-static-hosting.md`.',
    '',
    '## Endpoints',
    '',
    '| Path | operationId | Returns | Content type |',
    '| --- | --- | --- | --- |',
    ...apiEndpoints.map(
      (e) => `| \`${e.path}\` | \`${e.operationId}\` | ${e.returns} | \`${e.contentType}\` |`,
    ),
    '',
    '## MCP server',
    '',
    'The first-party Model Context Protocol server published with the lit-review-council project advertises its transport in a Server Card at /.well-known/mcp. The Python distribution is https://pypi.org/project/lit-review-council/.',
    '',
    footer('/developers'),
  ].join('\n');

/**
 * The markdown for one route, or `null` for a path this site does not serve as a
 * page. `null` rather than a fallback document: a twin that answers for a URL the
 * site has no page for would tell an agent the site covers something it does not.
 */
export function renderMarkdown(pathname: string): string | null {
  const bare = pathname.replace(/\/+$/, '') || '/';

  if (bare === '/') return markdownHome();
  if (bare === '/projects') return markdownProjects();
  // A slug that resolves to no project is served by the not-found view, not a page,
  // so it has no twin. `null` keeps that contract with the rest of this function and
  // the prerenderer, which refuses to write a twin that is empty or headingless.
  if (bare.startsWith('/projects/')) return markdownProject(bare.replace('/projects/', '')) || null;
  if (bare === '/experience') return markdownExperience();
  if (bare === '/docs') return markdownApi();
  if (bare === '/developers') return markdownDevelopers();
  if (bare === '/about') return markdownAbout();
  if (bare === '/contact') return markdownContact();
  if (bare === '/privacy') return markdownPrivacy();
  return null;
}

/** Where a route's markdown twin is served. `/` is the one route whose twin is not `<route>.md`. */
export const markdownPathFor = (route: string): string =>
  route === '/' ? '/index.md' : `${route}.md`;
