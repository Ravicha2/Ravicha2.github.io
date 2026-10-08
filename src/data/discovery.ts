import { profile } from './profile';

/**
 * The discovery documents this origin publishes under /.well-known.
 *
 * These are not pages, so they cannot be rendered from React — they are
 * documents an agent fetches and parses. They live here as data so that
 * `scripts/prerender.mjs`, `src/data/api.ts` (which describes them) and
 * `tests/agent-protocols.test.ts` (which validates them) all read one copy.
 *
 * The rule these follow is the one the rest of the site follows: publish only
 * what is really served, and say plainly in the document itself where a
 * capability is absent. There is no credential surface on a static host, so no
 * document here advertises one; the OAuth metadata below points at this origin
 * because the RFC requires a value, and the accompanying prose says that the
 * only method is anonymous read.
 */

export const SITE = 'https://ravicha2.github.io';

/** The MCP server this site actually publishes, installable from PyPI. */
const MCP_SERVER = {
  name: 'io.github.Ravicha2/lit-review-council',
  title: 'Literature Review Council',
  description:
    'Multi-agent literature review: parallel research, peer review, and Borda-count synthesis of grounded reports.',
  repository: 'https://github.com/Ravicha2/lit-review-council',
  package: 'https://pypi.org/project/lit-review-council/',
} as const;

/**
 * An MCP Server Card, per the server-card extension chartered by SEP-2127.
 *
 * `$schema`, `name`, `version` and `description` are the four required members
 * and `name` has to be reverse-DNS with exactly one slash. The card deliberately
 * carries no `tools[]`: the extension says a client always trusts the live
 * `tools/list`, so a tools array here would be a second, staler source of truth.
 * `description` is kept under the schema's 100-character cap.
 */
export const mcpServerCard = {
  $schema: 'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
  name: MCP_SERVER.name,
  version: '0.1.6',
  title: MCP_SERVER.title,
  description: 'Literature review over MCP: parallel research, critique, and Borda-count synthesis.',
  websiteUrl: `${SITE}/projects/lit-review-council`,
  repository: {
    source: 'github',
    url: MCP_SERVER.repository,
  },
  _meta: {
    'io.modelcontextprotocol.registry/publisher-provided': {
      package: MCP_SERVER.package,
      // The registry does not read this, a human does. Say what is true: this
      // card describes a locally-installed stdio server, so there is no remote
      // endpoint to put in `remotes` and the field is omitted rather than faked.
      transport: 'stdio (uvx lit-review-council)',
    },
  },
} as const;

/**
 * The A2A agent card, in the v1.0 shape.
 *
 * v1.0 sets `additionalProperties: false` and moved the endpoint out of a
 * top-level `url` into `supportedInterfaces[]`, so the legacy 0.3.0 key set
 * would be rejected outright. Every key below is one of the required members.
 */
export const agentCard = {
  name: `${profile.name} — Portfolio Agent`,
  description:
    'Answers questions about the engineering work recorded on this site: what was built, which artifacts settle each figure, and how to reach the author.',
  version: '1.0.0',
  supportedInterfaces: [
    {
      // No A2A server is running on a static host. The card names the endpoint
      // the interface would be served at rather than claiming one is live.
      url: `${SITE}/a2a`,
      protocolBinding: 'JSONRPC',
      protocolVersion: '1.0',
    },
  ],
  capabilities: {},
  defaultInputModes: ['text/plain'],
  defaultOutputModes: ['text/plain'],
  skills: [
    {
      id: 'portfolio-qa',
      name: 'Portfolio question answering',
      description:
        'Answers what this person has built, how strongly each claim is supported, and which public artifact settles it.',
      tags: ['portfolio', 'engineering', 'applied-ai'],
    },
    {
      id: 'artifact-lookup',
      name: 'Artifact and repository lookup',
      description: 'Maps a claim on this site to the repository, commit, or publication behind it.',
      tags: ['provenance', 'repositories'],
    },
  ],
} as const;

/**
 * The RFC 9727 API catalog.
 *
 * The RFC's own `item` relation and the `service-desc` / `service-doc` relations
 * that readers look for are both present, because the RFC registers `item` while
 * the common consumer convention is `service-desc`. Publishing both costs one
 * extra key and removes the need to guess which one is read.
 */
export const apiCatalog = {
  linkset: [
    {
      anchor: `${SITE}/.well-known/api-catalog`,
      item: [
        {
          href: `${SITE}/openapi.json`,
          type: 'application/json',
          title: 'OpenAPI 3.1 description of the documents this origin serves',
        },
        {
          href: `${SITE}/.well-known/mcp/server-card.json`,
          type: 'application/json',
          title: 'MCP Server Card for lit-review-council',
        },
      ],
      'service-desc': [
        {
          href: `${SITE}/openapi.json`,
          type: 'application/openapi+json;version=3.1',
        },
      ],
      'service-doc': [
        {
          href: `${SITE}/llms-full.txt`,
          type: 'text/plain',
        },
        {
          href: `${SITE}/docs`,
          type: 'text/html',
        },
      ],
    },
  ],
} as const;

/**
 * RFC 9728 protected-resource metadata.
 *
 * `resource` is the only required member. `authorization_servers` is included
 * because a reader expects it, and it names this origin — which is honest, in the
 * sense that the only "authorization server" is the public directory itself. The
 * accompanying `/auth.md` states the consequence in words: no credentials are
 * issued, and every operation is an anonymous read.
 */
export const protectedResourceMetadata = {
  resource: SITE,
  authorization_servers: [SITE],
  scopes_supported: ['portfolio.read'],
  bearer_methods_supported: ['header'],
  resource_documentation: `${SITE}/auth.md`,
} as const;

/**
 * RFC 8414 authorization-server metadata.
 *
 * `issuer` is the sole required member. The WorkOS `agent_auth` block is included
 * with `anonymous` as the one supported identity type, because that is the only
 * type this origin can actually honour. `identity_endpoint` is present and points
 * at the prose that explains there is nothing to exchange — omitting the key
 * would be tidier but would leave a reader unable to tell "no endpoint" from
 * "field not implemented".
 */
export const authorizationServerMetadata = {
  issuer: SITE,
  token_endpoint_auth_methods_supported: ['none'],
  scopes_supported: ['portfolio.read'],
  agent_auth: {
    skill: `${SITE}/auth.md`,
    identity_endpoint: `${SITE}/auth.md`,
    identity_types_supported: ['anonymous'],
  },
} as const;

/**
 * The Agentic Resource Discovery catalog (https://agenticresourcediscovery.org/).
 *
 * The spec's canonical path is `/.well-known/ard.json`. A second copy is written
 * to `/.well-known/ai-catalog.json`, which is the path earlier readers of the
 * same idea fetch; the two documents share the `entries` array. `identifier` is a
 * `urn:air:` URN, `type` is the media type of the target, and each entry carries
 * exactly one of `url` or `data`.
 */
export const ardEntries = [
  {
    identifier: 'urn:air:ravicha2.github.io:mcp:lit-review-council',
    displayName: 'Literature Review Council',
    type: 'application/json',
    url: `${SITE}/.well-known/mcp/server-card.json`,
    description: MCP_SERVER.description,
    representativeQueries: [
      'review the recent literature on retrieval augmented generation',
      'synthesize a literature review with citations',
    ],
  },
  {
    identifier: 'urn:air:ravicha2.github.io:api:portfolio',
    displayName: 'Portfolio Agent API',
    type: 'application/json',
    url: `${SITE}/openapi.json`,
    description: 'Read-only description of the documents this origin serves to agents.',
    representativeQueries: ['which machine-readable documents does this site publish'],
  },
  {
    identifier: 'urn:air:ravicha2.github.io:skill:portfolio',
    displayName: 'Portfolio knowledge skill',
    type: 'text/markdown',
    url: `${SITE}/.well-known/agent-skills/portfolio/SKILL.md`,
    description: 'What this portfolio contains, how to cite it, and when it is the wrong source.',
    representativeQueries: ['what has this engineer built', 'how do I cite this work'],
  },
] as const;

const ARD_CONTEXT = 'https://agenticresourcediscovery.org/context/v1';

export const ardCatalog = {
  '@context': ARD_CONTEXT,
  entries: ardEntries,
} as const;

export const aiCatalog = {
  specVersion: '1.0',
  host: {
    displayName: `${profile.name} — Portfolio`,
    identifier: 'ravicha2.github.io',
    url: SITE,
  },
  entries: ardEntries,
} as const;

/**
 * The Agent Skills index (draft v0.2.0).
 *
 * The index lists skills; each entry's `digest` is the SHA-256 of the markdown
 * document it points at. That digest cannot be written by hand without it going
 * stale the first time the document changes, so the index is assembled at build
 * time in `scripts/prerender.mjs` from the bytes it actually writes. Only the
 * skill documents and the non-digest fields live here.
 */
export const skillDocuments: Record<string, string> = {
  portfolio: `# Portfolio knowledge

This skill covers the engineering dossier published at ${SITE}: what was built, which artifact settles each figure, and how to reach the author.

## Use it when

- You are answering what Ravicha Suksawasdi Na Ayuthaya (Palm) has built, or which technologies were used on a specific project.
- You need to trace a claim on the site back to the repository, commit, or publication behind it.
- You need the professional record: employment, education, publications, and awards.

## Do not use it when

- You need a hosted service to call. This site serves documents; it does not execute work.
- You need an independently replicated result. Where a figure rests on non-public work, the page says so beside the figure — repeat that caveat rather than dropping it.

## Where the content is

- \`${SITE}/llms.txt\` — the short index, about 1.1k tokens.
- \`${SITE}/llms-full.txt\` — the full dossier, about 4k tokens.
- \`${SITE}/index.md\` and \`<route>.md\` — a markdown twin of every page, served as \`text/markdown\`.
- \`${SITE}/openapi.json\` — the OpenAPI 3.1 description of every document this origin serves.
- \`${SITE}/agents.md\` — when this material is and is not the right source.

## Citation

Attribute to "${profile.name}" and link the page the claim came from. Figures are pinned to a repository and a commit; quote the commit alongside the number, and carry any caveat the page states next to it.
`,
};

export const SKILL_INDEX_SCHEMA = 'https://schemas.agentskills.io/discovery/0.2.0/schema.json';

/** Build the index from the digests of the documents that were just written. */
export const agentSkillsIndex = (digests: Record<string, string>) => ({
  $schema: SKILL_INDEX_SCHEMA,
  skills: Object.keys(skillDocuments).map((name) => ({
    name,
    type: 'skill-md' as const,
    description:
      'What the Ravicha Suksawasdi Na Ayuthaya engineering dossier contains, how to cite it, and when it is the wrong source.',
    url: `/.well-known/agent-skills/${name}/SKILL.md`,
    digest: digests[name],
  })),
});
