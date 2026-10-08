import { profile, projects, getProjectBySlug, tierOf, type Project } from '../data';
import { permalink } from '../data/proof';
import { SITE, canonicalUrlFor } from '../utils/seo';
import type { ModelContextTool, ToolAnnotations, ToolResponse } from './types';

/**
 * The tools a browser agent can call once the page has loaded. Every handler reads
 * `src/data` — the same source the views render from — so a tool answer and the page
 * can never describe the portfolio differently. Nothing here is writable, and nothing
 * leaves the page: registering a tool is not a claim that it is callable remotely.
 */

/** Read-only in the agent's terms: these read published content and change nothing. */
const READ_ONLY: ToolAnnotations = { readOnlyHint: true, untrustedContentHint: false };

const text = (value: string): ToolResponse => ({ content: [{ type: 'text', text: value }] });

/** The schema-typed input the draft requires; `input` is untrusted, so it is coerced. */
const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

// --- search-projects ---------------------------------------------------------

/** Every string a project declares, flattened and lower-cased, for keyword matching. */
function caseStudyText(project: Project): string {
  const cs = project.caseStudy;
  if (!cs) return '';
  return [
    cs.intuition.spark,
    cs.intuition.naiveFailureMode,
    cs.intuition.summary,
    cs.problemEncountered.summary,
    ...cs.problemEncountered.edgeCases,
    ...cs.problemEncountered.constraints,
    cs.whyBuiltThisWay.architecturalInsight,
    cs.whyBuiltThisWay.summary,
    ...cs.whyBuiltThisWay.tradeOffs.flatMap((t) => [t.decision, t.rationale, t.vsAlternative ?? '']),
    ...(cs.whyBuiltThisWay.guardrails ?? []),
    ...cs.outcomes.verification,
    ...cs.outcomes.impact,
    cs.outcomes.takeaway,
    cs.outcomes.summary,
  ].join(' ');
}

/**
 * The fields a keyword is matched against, each with the weight a hit earns. Title and
 * tags outweigh body prose, so searching "regex" ranks NL2REGEX above a project that
 * merely mentions one.
 */
function fieldsOf(project: Project): Array<{ text: string; weight: number }> {
  return [
    { text: project.title, weight: 8 },
    { text: project.subtitle, weight: 6 },
    { text: project.slug.replace(/-/g, ' '), weight: 5 },
    { text: project.categoryLabel, weight: 4 },
    { text: project.category, weight: 3 },
    { text: project.tags.join(' '), weight: 4 },
    { text: project.summary, weight: 2 },
    { text: [project.role, project.timeline].join(' '), weight: 1 },
    { text: (project.metrics ?? []).flatMap((m) => [m.value, m.label]).join(' '), weight: 2 },
    { text: project.proof?.settles ?? '', weight: 1 },
    { text: project.proofLine ?? '', weight: 1 },
    { text: caseStudyText(project), weight: 1 },
  ];
}

/** Count non-overlapping occurrences of `term` in `haystack`. */
function countOccurrences(haystack: string, term: string): number {
  let count = 0;
  let index = haystack.indexOf(term);
  while (index !== -1) {
    count += 1;
    index = haystack.indexOf(term, index + term.length);
  }
  return count;
}

/**
 * The query-to-project mapping: projects that mention every whitespace-separated term,
 * best match first. Pure and deterministic, so a test can assert both that a hit is a
 * real project and that it is the one the catalog renders.
 */
export function searchProjects(query: string): Project[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return projects
    .map((project) => {
      const fields = fieldsOf(project).map((field) => ({
        text: field.text.toLowerCase(),
        weight: field.weight,
      }));
      let score = 0;
      for (const term of terms) {
        let termScore = 0;
        for (const field of fields) termScore += countOccurrences(field.text, term) * field.weight;
        // Every term must appear somewhere, or the project is not a match.
        if (termScore === 0) return { project, score: -1 };
        score += termScore;
      }
      return { project, score };
    })
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score)
    .map(({ project }) => project);
}

/** How a matched project's figure is settled, read off the same artifact the page shows. */
function evidenceLine(project: Project): string {
  if (project.proof) {
    return `Settled by an artifact: ${project.proof.settles} (${permalink(project.proof)})`;
  }
  if (project.proofLine) {
    return `Figure carried without a public artifact: ${project.proofLine}`;
  }
  return 'No measured figure is claimed for this project.';
}

/** The text block `search-projects` answers with. */
export function formatSearchResults(query: string, matches: Project[]): string {
  if (matches.length === 0) {
    return [
      `No project matches "${query}".`,
      `Published projects: ${projects.map((p) => `${p.slug} — ${p.title}`).join('; ')}.`,
    ].join('\n');
  }

  const lines = [`${matches.length} project(s) matching "${query}":`, ''];
  matches.forEach((project, index) => {
    if (index > 0) lines.push('');
    lines.push(`${project.title} [${project.slug}]`);
    lines.push(`${canonicalUrlFor(`/projects/${project.slug}`)} · ${project.categoryLabel}`);
    lines.push(project.summary);
    lines.push(evidenceLine(project));
  });
  return lines.join('\n');
}

// --- get-project -------------------------------------------------------------

/** The text block `get-project` answers with: one project's trade-offs and verification. */
export function projectDetail(slug: string): string {
  const project = getProjectBySlug(slug);
  if (!project) {
    return [
      `No project is published under the slug "${slug}".`,
      `Published slugs: ${projects.map((p) => p.slug).join(', ')}.`,
    ].join('\n');
  }

  const lines = [
    `${project.title} [${project.slug}]`,
    `${canonicalUrlFor(`/projects/${project.slug}`)} · ${tierOf(project)} · ${project.categoryLabel}`,
    `Role: ${project.role} · Timeline: ${project.timeline}`,
    project.summary,
    evidenceLine(project),
  ];

  const cs = project.caseStudy;
  if (!cs) {
    lines.push('', 'No case study is published for this project; the summary above is all of it.');
    return lines.join('\n');
  }

  lines.push('', 'Trade-offs:');
  cs.whyBuiltThisWay.tradeOffs.forEach((tradeOff) => {
    const versus = tradeOff.vsAlternative ? ` (vs ${tradeOff.vsAlternative})` : '';
    lines.push(`- ${tradeOff.decision}${versus}: ${tradeOff.rationale}`);
  });

  if (cs.whyBuiltThisWay.guardrails && cs.whyBuiltThisWay.guardrails.length > 0) {
    lines.push('', 'Guardrails:');
    cs.whyBuiltThisWay.guardrails.forEach((guardrail) => lines.push(`- ${guardrail}`));
  }

  lines.push('', 'Verification:');
  cs.outcomes.verification.forEach((item) => lines.push(`- ${item}`));
  lines.push('', `Takeaway: ${cs.outcomes.takeaway}`);

  return lines.join('\n');
}

// --- describe-site -----------------------------------------------------------

/** The text block `describe-site` answers with: what the site publishes, and where. */
export function describeSite(): string {
  const lines = [
    `${profile.name} (${profile.preferredName}) — ${profile.title}`,
    profile.status,
    `${profile.email} · ${profile.links.github} · ${profile.links.linkedin}`,
    '',
    'Pages:',
    `- Overview — ${canonicalUrlFor('/')} — bio, featured work, and current status.`,
    `- Projects catalog — ${canonicalUrlFor('/projects')} — ${projects.length} projects with the artifact settling each figure.`,
    ...projects.map(
      (project) => `- Case study: ${project.title} — ${canonicalUrlFor(`/projects/${project.slug}`)} — ${project.subtitle}`,
    ),
    `- Experience — ${canonicalUrlFor('/experience')} — work history, education, publications, awards, and skills.`,
    '',
    'Machine-readable files:',
    `- ${SITE}/llms.txt — the same content as an index for agents.`,
    `- ${SITE}/llms-full.txt — the full case-study dossier.`,
    `- ${SITE}/robots.txt and ${SITE}/sitemap.xml — crawler permissions and the list of routes.`,
    `- ${SITE}/cv.pdf — the CV as a PDF.`,
  ];
  return lines.join('\n');
}

// --- Descriptors -------------------------------------------------------------

/**
 * The three read-only tools, in the order the draft lists them. `inputSchema` is
 * optional in the spec but required here: a typed schema is the point of the exercise.
 */
export const webMcpTools: ModelContextTool[] = [
  {
    name: 'search-projects',
    title: 'Search projects',
    description:
      'Search the engineering portfolio by keyword and return matching projects, each with the artifact that settles its headline figure.',
    inputSchema: {
      type: 'object',
      properties: {
        q: {
          type: 'string',
          description:
            'Keyword(s) to match against project titles, summaries, technologies, and case-study text.',
        },
      },
      required: ['q'],
      additionalProperties: false,
    },
    annotations: READ_ONLY,
    execute: async (input) => {
      const query = asString(input.q);
      return text(formatSearchResults(query, searchProjects(query)));
    },
  },
  {
    name: 'get-project',
    title: 'Read one project',
    description:
      "Read one engineering project's trade-offs and verification detail by slug, from the same case study its page renders.",
    inputSchema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'The project slug, e.g. "shepherd". Returned by search-projects.',
        },
      },
      required: ['slug'],
      additionalProperties: false,
    },
    annotations: READ_ONLY,
    execute: async (input) => text(projectDetail(asString(input.slug))),
  },
  {
    name: 'describe-site',
    title: 'Describe this site',
    description:
      'Describe what this site publishes — the person, the pages, and the machine-readable files — and give the URL where each document lives.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    annotations: READ_ONLY,
    execute: async () => text(describeSite()),
  },
];
