import { profile } from './profile';

/**
 * The machine surface this domain actually serves.
 *
 * The site is static, so there is no request handler to introspect: the OpenAPI
 * document has to be written by hand. What keeps it from rotting is that it is
 * written *here*, next to the pages that describe it, and emitted by
 * `scripts/prerender.mjs` — so the spec cannot advertise a URL the build does not
 * write. `tests/agent-protocols.test.ts` holds the other end: every operation has a
 * unique `operationId`, a `summary`, a `description` and a typed response schema, and
 * the endpoint tables on /docs and /developers are derived from the same list.
 *
 * Every operation below is a `GET` of a file that is really served, and each one
 * carries an `operationId` and a description because that is what an agent reads
 * to decide whether the call is worth making. Nothing is declared that the origin
 * does not do: there is no write surface, so there are no write operations, and
 * the 404 response is documented as the `text/html` page GitHub Pages really
 * returns rather than as the `application/problem+json` envelope that would be
 * nicer to have. `x-error-model` says exactly that, in the document, so the gap is
 * stated rather than hidden.
 */

export const SITE = 'https://ravicha2.github.io';

/** One row of the endpoint table on /docs and /developers, kept beside the spec so the page and the document cannot disagree. */
export interface AgentEndpoint {
  /** The path as it is requested. */
  path: string;
  operationId: string;
  summary: string;
  /** The media type the origin really sends. */
  contentType: string;
  /** What the agent gets, in one clause. */
  returns: string;
}

const problemSchema = {
  type: 'object',
  description:
    'RFC 9457 problem details. Not yet served: GitHub Pages answers an unmatched path with the 404.html document as text/html and offers no way to set a response header or override the body per media type.',
  required: ['type', 'title', 'status'],
  properties: {
    type: { type: 'string', format: 'uri', description: 'A URI identifying the problem type.' },
    title: { type: 'string', description: 'A short, human-readable summary.' },
    status: { type: 'integer', description: 'The HTTP status code.' },
    detail: { type: 'string', description: 'A human-readable explanation of this occurrence.' },
    instance: { type: 'string', format: 'uri', description: 'The URI of this occurrence.' },
    code: {
      type: 'string',
      description: 'A stable machine-readable code, so an agent can branch without parsing prose.',
    },
    hint: { type: 'string', description: 'What to do next.' },
  },
} as const;

const mcpServerCardSchema = {
  type: 'object',
  description: 'An MCP Server Card, per the server-card extension chartered by SEP-2127.',
  required: ['$schema', 'name', 'version', 'description'],
  properties: {
    $schema: { type: 'string', format: 'uri' },
    name: {
      type: 'string',
      description: 'Reverse-DNS identity, exactly one slash between namespace and server name.',
      pattern: '^[a-zA-Z0-9.-]+/[a-zA-Z0-9._-]+$',
    },
    title: { type: 'string' },
    description: { type: 'string', maxLength: 100 },
    version: { type: 'string' },
    websiteUrl: { type: 'string', format: 'uri' },
    repository: {
      type: 'object',
      required: ['source', 'url'],
      properties: {
        source: { type: 'string' },
        url: { type: 'string', format: 'uri' },
        subfolder: { type: 'string' },
      },
    },
    remotes: {
      type: 'array',
      description: 'Where the server can be reached. Each entry names its transport.',
      items: {
        type: 'object',
        required: ['type', 'url'],
        properties: {
          type: { type: 'string', enum: ['sse', 'streamable-http'] },
          url: { type: 'string' },
          supportedProtocolVersions: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
} as const;

const linksetSchema = {
  type: 'object',
  description: 'An RFC 9264 linkset, as profiled for API discovery by RFC 9727.',
  required: ['linkset'],
  properties: {
    linkset: {
      type: 'array',
      items: {
        type: 'object',
        required: ['anchor', 'item'],
        properties: {
          anchor: { type: 'string', format: 'uri', description: 'The context these links describe.' },
          item: {
            type: 'array',
            items: {
              type: 'object',
              required: ['href'],
              properties: {
                href: { type: 'string', format: 'uri' },
                type: { type: 'string', description: 'The media type of the target.' },
                title: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
} as const;

const skillIndexSchema = {
  type: 'object',
  description: 'An Agent Skills index: what this origin can be asked for, in the order to ask for it.',
  required: ['version', 'name', 'skills'],
  properties: {
    version: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    skills: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'description'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          url: { type: 'string', format: 'uri' },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
} as const;

const agentCardSchema = {
  type: 'object',
  description: 'An Agent2Agent agent card (A2A protocol).',
  required: ['name', 'description', 'url', 'version', 'capabilities', 'defaultInputModes', 'defaultOutputModes', 'skills'],
  properties: {
    protocolVersion: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    url: { type: 'string', format: 'uri' },
    version: { type: 'string' },
    provider: {
      type: 'object',
      properties: { organization: { type: 'string' }, url: { type: 'string', format: 'uri' } },
    },
    capabilities: {
      type: 'object',
      properties: {
        streaming: { type: 'boolean' },
        pushNotifications: { type: 'boolean' },
        stateTransitionHistory: { type: 'boolean' },
      },
    },
    defaultInputModes: { type: 'array', items: { type: 'string' } },
    defaultOutputModes: { type: 'array', items: { type: 'string' } },
    skills: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'name', 'description', 'tags'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
} as const;

const protectedResourceSchema = {
  type: 'object',
  description: 'RFC 9728 OAuth 2.0 protected resource metadata.',
  required: ['resource'],
  properties: {
    resource: { type: 'string', format: 'uri' },
    authorization_servers: { type: 'array', items: { type: 'string', format: 'uri' } },
    scopes_supported: { type: 'array', items: { type: 'string' } },
    bearer_methods_supported: { type: 'array', items: { type: 'string' } },
  },
} as const;

const textDocument = (contentType: string, description: string) =>
  ({
    type: 'string',
    description,
    'x-content-type': contentType,
  }) as const;

/**
 * A GET that every path on the origin shares: success is the document itself, and a
 * miss is the site's HTML 404. Declared once so forty operations cannot describe
 * failure forty different ways.
 */
const getResponses = (description: string, schema: Record<string, unknown>, contentType: string) => ({
  200: {
    description,
    content: { [contentType]: { schema } },
  },
  404: {
    description:
      'No such document. GitHub Pages answers with the site 404 document as text/html; the request also lands in the SPA, which renders the same message.',
    content: { 'text/html': { schema: { type: 'string' } } },
  },
});

interface OperationSpec {
  tags: string[];
  operationId: string;
  summary: string;
  description: string;
  schema: Record<string, unknown>;
  contentType: string;
  returns: string;
}

/** Every operation, in one list. `paths` and the rendered tables are both derived from it. */
export const AGENT_OPERATIONS: OperationSpec[] = [
  {
    tags: ['meta'],
    operationId: 'getOpenApiDocument',
    summary: 'The OpenAPI document for this API',
    description:
      'Returns this document. An agent that has found it can enumerate every other operation without fetching anything else.',
    schema: { type: 'object', description: 'This OpenAPI 3.1 document.' },
    contentType: 'application/json',
    returns: 'This document, as JSON.',
  },
  {
    tags: ['discovery'],
    operationId: 'getMcpServerCard',
    summary: 'MCP Server Card for the published MCP server',
    description:
      'A Server Card describing how to reach the first-party MCP server, per the server-card extension chartered by SEP-2127. Contains no tools: agents read those from the server itself with tools/list.',
    schema: mcpServerCardSchema,
    contentType: 'application/json',
    returns: 'A Server Card.',
  },
  {
    tags: ['discovery'],
    operationId: 'getAgentSkillsIndex',
    summary: 'Agent Skills index',
    description:
      'Lists the skills this origin can be asked for, each with a name, a description, and the URL that serves it.',
    schema: skillIndexSchema,
    contentType: 'application/json',
    returns: 'The skills index.',
  },
  {
    tags: ['discovery'],
    operationId: 'getAgentCard',
    summary: 'A2A agent card',
    description:
      'The Agent2Agent card: who this is, and the tasks an agent can delegate. Every skill is read-only research over published material.',
    schema: agentCardSchema,
    contentType: 'application/json',
    returns: 'The agent card.',
  },
  {
    tags: ['discovery'],
    operationId: 'getApiCatalog',
    summary: 'RFC 9727 API catalog',
    description:
      'An RFC 9264 linkset, profiled by RFC 9727, pointing at this document and the other machine-readable service descriptions on the origin. Served as application/linkset+json.',
    schema: linksetSchema,
    contentType: 'application/linkset+json',
    returns: 'A linkset with one item per service description.',
  },
  {
    tags: ['discovery'],
    operationId: 'getProtectedResourceMetadata',
    summary: 'OAuth 2.0 protected resource metadata',
    description:
      'RFC 9728 metadata for this resource. It is public and read-only, so no authorization server is advertised and no scope is required.',
    schema: protectedResourceSchema,
    contentType: 'application/json',
    returns: 'Protected resource metadata.',
  },
  {
    tags: ['discovery'],
    operationId: 'getArdCatalog',
    summary: 'Agentic Resource Discovery catalog',
    description:
      'The ARD catalog, listing the agentic resources this origin publishes — its MCP server, its skill index, and its API description — each with a URN identity.',
    schema: { type: 'object', description: 'An ARD catalog document.' },
    contentType: 'application/json',
    returns: 'The ARD catalog.',
  },
  {
    tags: ['context'],
    operationId: 'getLlmsTxt',
    summary: 'Concise agent guide',
    description:
      'The llmstxt.org index: who this is, what they have built, and when to use the material. The shortest correct answer to "what is this site".',
    schema: textDocument('text/plain', 'The llms.txt index.'),
    contentType: 'text/plain',
    returns: 'A plain-text markdown index.',
  },
  {
    tags: ['context'],
    operationId: 'getLlmsFullTxt',
    summary: 'Full agent dossier',
    description:
      'The long-form dossier behind llms.txt: complete project histories, trade-offs, and verification detail in one document.',
    schema: textDocument('text/plain', 'The full dossier.'),
    contentType: 'text/plain',
    returns: 'A plain-text markdown dossier.',
  },
  {
    tags: ['context'],
    operationId: 'getAgentsMd',
    summary: 'When to use this site, and how',
    description:
      'The use-case guide: the jobs this material is right for, the jobs it is wrong for, and the order to read it in. Read this before llms.txt if you are deciding whether to use it at all.',
    schema: textDocument('text/markdown', 'The agent use-case guide.'),
    contentType: 'text/markdown',
    returns: 'A markdown guide.',
  },
  {
    tags: ['context'],
    operationId: 'getAuthMd',
    summary: 'How to authenticate, as prose',
    description:
      'A markdown walkthrough of the auth situation written to the WorkOS auth.md shape. The surface is public and read-only, so the walkthrough concludes that no credential is needed — which is the answer an agent needs before it starts hunting for one.',
    schema: textDocument('text/markdown', 'The auth walkthrough.'),
    contentType: 'text/markdown',
    returns: 'A markdown walkthrough.',
  },
  {
    tags: ['context'],
    operationId: 'getMarkdownHome',
    summary: 'The homepage as markdown',
    description:
      'The site root in markdown, so an agent that lands on the homepage can fetch the same page without parsing HTML. Every content route has a twin at the same path with .md appended.',
    schema: textDocument('text/markdown', 'The homepage as markdown.'),
    contentType: 'text/markdown',
    returns: 'A markdown rendering of the homepage.',
  },
  {
    tags: ['context'],
    operationId: 'getSitemap',
    summary: 'Sitemap',
    description: 'Every URL the site answers, with the date its content last changed.',
    schema: { type: 'string', description: 'A sitemap XML document.' },
    contentType: 'application/xml',
    returns: 'A sitemap.',
  },
  {
    tags: ['context'],
    operationId: 'getCurriculumVitae',
    summary: 'Curriculum vitae as PDF',
    description: 'The CV in its printable form, for a caller that wants a file rather than a page.',
    schema: { type: 'string', format: 'binary', description: 'A PDF document.' },
    contentType: 'application/pdf',
    returns: 'A PDF.',
  },
];

/** The path each operation is served at. Derived, so a path cannot be listed without its operation. */
const PATH_OF_OPERATION: Record<string, string> = {
  getOpenApiDocument: '/openapi.json',
  getMcpServerCard: '/.well-known/mcp',
  getAgentSkillsIndex: '/.well-known/agent-skills/index.json',
  getAgentCard: '/.well-known/agent-card.json',
  getApiCatalog: '/.well-known/api-catalog',
  getProtectedResourceMetadata: '/.well-known/oauth-protected-resource',
  getArdCatalog: '/.well-known/ard.json',
  getLlmsTxt: '/llms.txt',
  getLlmsFullTxt: '/llms-full.txt',
  getAgentsMd: '/agents.md',
  getAuthMd: '/auth.md',
  getMarkdownHome: '/index.md',
  getSitemap: '/sitemap.xml',
  getCurriculumVitae: '/cv.pdf',
};

/** The endpoint table on /docs and /developers, in the order an agent should read it. */
export const apiEndpoints: AgentEndpoint[] = AGENT_OPERATIONS.map((op) => ({
  path: PATH_OF_OPERATION[op.operationId],
  operationId: op.operationId,
  summary: op.summary,
  contentType: op.contentType,
  returns: op.returns,
}));

/**
 * The published document. 3.1 rather than 3.0: it is a strict superset, and the
 * tooling that reads a spec for function calling has handled it for years.
 */
export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'Ravicha Suksawasdi Na Ayuthaya — Portfolio Agent API',
    version: '1.0.0',
    summary: 'The machine-readable surface of a systems-engineering portfolio: discovery, context, and identity documents.',
    description: [
      'A read-only, publicly reachable collection of documents for agents, served as static files from GitHub Pages.',
      '',
      `Everything here belongs to ${profile.name} (${profile.preferredName}), an applied AI and backend systems engineer. The API answers three questions: what this site is (discovery), what the work is (context), and who made it (identity).`,
      '',
      '**There is no authentication and no write surface.** Nothing here mutates state, so there is nothing to protect and no key to issue. `POST`, `PUT`, `PATCH` and `DELETE` are not implemented on any path and the origin answers them the same way it answers any unknown request.',
      '',
      '**Versioning.** The document carries a semantic `info.version`. The paths are stable; a breaking change to a documented shape increments the major version and is announced in `/llms.txt`, which is the changelog agents are told to watch.',
      '',
      '**Errors.** Every operation documents the 404 it really returns: the site 404 document as `text/html`. See the `x-error-model` extension below for the `application/problem+json` envelope this API would send from an origin that could set response headers, and which static hosting cannot.',
    ].join('\n'),
    contact: { name: profile.name, email: profile.email, url: `${SITE}/contact/` },
    license: { name: 'Content published for reference and citation.', identifier: 'CC-BY-4.0' },
  },
  servers: [
    {
      url: SITE,
      description: 'Production. Static files on GitHub Pages; every operation is a GET of a real document.',
    },
  ],
  tags: [
    { name: 'discovery', description: 'Documents that tell an agent what is here.' },
    { name: 'context', description: 'Documents that tell an agent what the work is.' },
    { name: 'meta', description: 'The API description itself.' },
  ],
  paths: Object.fromEntries(
    AGENT_OPERATIONS.map((op) => [
      PATH_OF_OPERATION[op.operationId],
      {
        get: {
          tags: op.tags,
          operationId: op.operationId,
          summary: op.summary,
          description: op.description,
          responses: getResponses(op.returns, op.schema, op.contentType),
        },
      },
    ]),
  ),
  components: {
    schemas: {
      Problem: problemSchema,
      McpServerCard: mcpServerCardSchema,
      Linkset: linksetSchema,
      AgentSkillsIndex: skillIndexSchema,
      AgentCard: agentCardSchema,
      ProtectedResourceMetadata: protectedResourceSchema,
    },
  },
  'x-error-model': {
    status: 'planned',
    note: 'The 404 documented on each operation is the text/html page GitHub Pages serves for an unmatched path. RFC 9457 application/problem+json is the intended shape and is described by components.schemas.Problem, but a static host cannot set a response content type or vary a body by Accept, so it is not served yet.',
    schema: '#/components/schemas/Problem',
  },
  'x-authentication': {
    required: false,
    schemes: [],
    note: 'Public and read-only. See /auth.md for the walkthrough.',
  },
} as const;

export type OpenApiDocument = typeof openApiDocument;
