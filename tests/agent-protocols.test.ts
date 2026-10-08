import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { AGENT_OPERATIONS, apiEndpoints, openApiDocument } from '../src/data/api';
import {
  discoveryDocumentPaths,
  discoveryDocuments,
  skillDocuments,
  skillFileContent,
} from '../src/data/discovery';
import { markdownPathFor, routes } from '../src/entry-server';

/**
 * The published OpenAPI document is the machine surface an agent reads before it
 * fetches anything. `scripts/prerender.mjs` writes it to `dist/openapi.json`, and
 * these tests hold the invariants that make it readable: every operation carries a
 * unique `operationId`, a `summary`, a `description` and a response schema, and the
 * document's own `openapi` field says 3.1.
 *
 * The spec is generated from `AGENT_OPERATIONS` (one list), and the endpoint tables
 * on /docs and /developers are generated from `apiEndpoints` (the same list), so the
 * only way the document and the pages can disagree is if one of these invariants
 * stops holding here.
 */
describe('Published OpenAPI document', () => {
  const paths = Object.entries(openApiDocument.paths) as Array<
    [string, { get: { operationId: string; summary: string; description: string; responses: Record<string, any> } }]
  >;

  it('declares itself as OpenAPI 3.1', () => {
    expect(openApiDocument.openapi).toBe('3.1.0');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('names itself, with a version, a summary and a description', () => {
    expect(openApiDocument.info.title).toBeTruthy();
    expect(openApiDocument.info.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(openApiDocument.info.summary.length).toBeGreaterThan(20);
    expect(openApiDocument.info.description.length).toBeGreaterThan(100);
    expect(openApiDocument.servers?.[0]?.url).toBe('https://ravicha2.github.io');
  });

  it('gives every operation a unique operationId', () => {
    const ids = paths.map(([, item]) => item.get.operationId);
    expect(ids.every((id) => typeof id === 'string' && id.length > 0)).toBe(true);
    expect(new Set(ids).size, `duplicate operationId in ${ids.join(', ')}`).toBe(ids.length);
  });

  it('gives every operation a summary and a description', () => {
    for (const [path, item] of paths) {
      expect(item.get.summary, `${path} has no summary`).toBeTruthy();
      expect(item.get.summary.length, `${path} summary is a stub`).toBeGreaterThan(5);
      expect(item.get.description, `${path} has no description`).toBeTruthy();
      expect(item.get.description.length, `${path} description is a stub`).toBeGreaterThan(20);
    }
  });

  it('documents a 200 response with a typed schema for every operation', () => {
    for (const [path, item] of paths) {
      const ok = item.get.responses['200'];
      expect(ok, `${path} has no 200 response`).toBeDefined();

      const media = Object.values(ok.content ?? {}) as Array<{ schema?: Record<string, unknown> }>;
      expect(media.length, `${path} 200 has no content`).toBeGreaterThan(0);
      for (const entry of media) {
        expect(entry.schema, `${path} 200 content has no schema`).toBeDefined();
        expect(entry.schema!.type, `${path} 200 schema has no type`).toBeTruthy();
      }

      // The 404 is documented too: it is the one failure an agent will hit, and it
      // is stated as the text/html page the origin really returns, not a fiction.
      expect(item.get.responses['404'], `${path} does not document its 404`).toBeDefined();
    }
  });

  it('describes every declared schema component', () => {
    const schemas = openApiDocument.components.schemas;
    const entries = Object.entries(schemas);
    expect(entries.length).toBeGreaterThan(0);
    for (const [name, schema] of entries) {
      expect((schema as { type?: string }).type, `${name} has no type`).toBeTruthy();
      expect((schema as { description?: string }).description, `${name} has no description`).toBeTruthy();
    }
  });

  it('derives the endpoint tables from the same operation list as the document', () => {
    expect(apiEndpoints.map((e) => e.operationId)).toEqual(
      AGENT_OPERATIONS.map((op) => op.operationId)
    );
    expect(apiEndpoints.map((e) => e.path)).toEqual(paths.map(([path]) => path));
    const tablePaths = apiEndpoints.map((e) => e.path);
    expect(new Set(tablePaths).size).toBe(tablePaths.length);
  });
});

/**
 * The /.well-known/ discovery surface. These documents are not pages — scripts/
 * prerender.mjs writes them straight to dist/ — so the contract worth pinning is
 * the JSON shape each protocol asks for, the honesty constraints that shape the
 * content, and the fact that every path a document points at is a path the build
 * produces. Nothing here reads dist/: the bytes tested are the bytes written, and
 * `npm run build` re-checks the digests against the files on disk.
 */
describe('Published discovery documents (/.well-known)', () => {
  const SITE = 'https://ravicha2.github.io';

  // The prerenderer hashes the strings it writes; this hashes the same source, so
  // the index under test is the index that ships.
  const digests = Object.fromEntries(
    Object.keys(skillDocuments).map((name) => [
      name,
      createHash('sha256').update(skillFileContent(name), 'utf8').digest('hex'),
    ])
  );
  const files = discoveryDocuments(digests);
  const jsonOf = (path: string) => JSON.parse(files[path]);

  it('writes every path it advertises, and nothing outside .well-known/', () => {
    expect(Object.keys(files).sort()).toEqual([...discoveryDocumentPaths()].sort());
    for (const path of discoveryDocumentPaths()) {
      expect(path.startsWith('.well-known/'), `${path} is not under .well-known/`).toBe(true);
      expect(typeof files[path], `${path} is not written as a string`).toBe('string');
    }
  });

  describe('MCP Server Card (SEP-2127)', () => {
    const card = jsonOf('.well-known/mcp/server-card.json');

    it('is served at both the audited path and the bare SEP-2127 namespace', () => {
      // SEP-2127's slash form makes `mcp` a namespace directory, so the card is the
      // file inside it and the bare path is the directory index. Both carry the same
      // bytes, and the index parses as the same JSON.
      expect(files['.well-known/mcp/server-card.json']).toBe(files['.well-known/mcp/index.html']);
      expect(jsonOf('.well-known/mcp/index.html')).toEqual(card);
    });

    it('carries the four required members, in the shape the schema mandates', () => {
      expect(card.$schema).toBe(
        'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json'
      );
      expect(card.name).toBe('io.github.Ravicha2/lit-review-council');
      // Reverse-DNS with exactly one slash between namespace and server name.
      expect(card.name).toMatch(/^[a-zA-Z0-9.-]+\/[a-zA-Z0-9._-]+$/);
      expect((card.name.match(/\//g) ?? []).length).toBe(1);
      expect(card.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(card.description.length).toBeGreaterThan(0);
      expect(card.description.length).toBeLessThanOrEqual(100);
    });

    it('lists no tools and names no address that does not answer', () => {
      expect(card).not.toHaveProperty('tools');
      expect(card).not.toHaveProperty('remotes');
      expect(card.transport).toMatchObject({
        type: 'stdio',
        command: 'uvx',
        args: ['lit-review-council'],
      });
      expect(card.transport).not.toHaveProperty('url');
      expect(card.serverInfo.version).toBe(card.version);
    });
  });

  describe('A2A agent card (v1.0)', () => {
    const card = jsonOf('.well-known/agent-card.json');
    const v1Keys = [
      'capabilities',
      'defaultInputModes',
      'defaultOutputModes',
      'description',
      'documentationUrl',
      'iconUrl',
      'name',
      'provider',
      'securityRequirements',
      'securitySchemes',
      'signatures',
      'skills',
      'supportedInterfaces',
      'version',
    ];

    it('uses only v1.0 keys — no top-level url, no top-level protocolVersion', () => {
      for (const key of Object.keys(card)) {
        expect(v1Keys, `${key} is not an A2A v1.0 AgentCard key`).toContain(key);
      }
      expect(card).not.toHaveProperty('url');
      expect(card).not.toHaveProperty('protocolVersion');
      for (const required of [
        'name',
        'description',
        'supportedInterfaces',
        'version',
        'capabilities',
        'defaultInputModes',
        'defaultOutputModes',
        'skills',
      ]) {
        expect(card, `${required} is missing`).toHaveProperty(required);
      }
    });

    it('claims no live interface, because a static origin cannot serve one', () => {
      expect(card.supportedInterfaces).toEqual([]);
      expect(card.capabilities).toEqual({});
      expect(card.description).toMatch(/no a2a interface is served/i);
    });

    it('describes real, distinct skills', () => {
      expect(card.skills.length).toBeGreaterThan(0);
      const ids = card.skills.map((skill: { id: string }) => skill.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const skill of card.skills) {
        expect(skill.name).toBeTruthy();
        expect(skill.description.length).toBeGreaterThan(20);
        expect(skill.tags.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Agent Skills index (v0.2.0)', () => {
    const index = jsonOf('.well-known/agent-skills/index.json');

    it('carries $schema and one entry per skill document', () => {
      expect(index.$schema).toBe('https://schemas.agentskills.io/discovery/0.2.0/schema.json');
      expect(index.skills).toHaveLength(Object.keys(skillDocuments).length);
    });

    it('digests each SKILL.md from the bytes the prerenderer writes', () => {
      for (const skill of index.skills) {
        const path = `.well-known/agent-skills/${skill.name}/SKILL.md`;
        expect(files[path], `${path} is advertised but not written`).toBeDefined();
        expect(skill.type).toBe('skill-md');
        expect(skill.url).toBe(`/.well-known/agent-skills/${skill.name}/SKILL.md`);
        expect(skill.digest).toMatch(/^sha256:[0-9a-f]{64}$/);
        expect(skill.digest).toBe(
          `sha256:${createHash('sha256').update(skillFileContent(skill.name), 'utf8').digest('hex')}`
        );
      }
    });
  });

  describe('API catalog (RFC 9727)', () => {
    const catalog = jsonOf('.well-known/api-catalog');

    it('is a linkset carrying item and service-desc/service-doc relations', () => {
      expect(Array.isArray(catalog.linkset)).toBe(true);
      const entry = catalog.linkset[0];
      expect(entry.anchor).toBe(`${SITE}/.well-known/api-catalog`);
      for (const relation of ['item', 'service-desc', 'service-doc']) {
        expect(entry[relation], `${relation} is missing`).toBeDefined();
        expect(entry[relation].length).toBeGreaterThan(0);
        for (const link of entry[relation]) {
          expect(link.href).toMatch(/^https:\/\/ravicha2\.github\.io\//);
        }
      }
    });
  });

  describe('OAuth metadata', () => {
    it('RFC 9728 names this origin and points at the prose that explains it', () => {
      const meta = jsonOf('.well-known/oauth-protected-resource');
      expect(meta.resource).toBe(SITE);
      expect(meta.resource_documentation).toBe(`${SITE}/auth.md`);
      for (const server of meta.authorization_servers ?? []) {
        // A named authorization server must be one whose metadata this origin serves.
        expect(server).toBe(SITE);
      }
    });

    it('RFC 8414 issues no credential the origin cannot honour', () => {
      const meta = jsonOf('.well-known/oauth-authorization-server');
      expect(meta.issuer).toBe(SITE);
      expect(meta).not.toHaveProperty('token_endpoint');
      expect(meta.token_endpoint_auth_methods_supported).toEqual(['none']);
      expect(meta.agent_auth.identity_types_supported).toEqual(['anonymous']);
      expect(meta.agent_auth.identity_endpoint).toBe(`${SITE}/auth.md`);
    });
  });

  describe('ARD catalogs', () => {
    it.each(['.well-known/ard.json', '.well-known/ai-catalog.json'])(
      '%s lists urn:air entries with a type and exactly one of url/data',
      (path) => {
        const doc = jsonOf(path);
        expect(doc.entries.length).toBeGreaterThan(0);
        for (const entry of doc.entries) {
          expect(entry.identifier).toMatch(/^urn:air:/);
          expect(typeof entry.type).toBe('string');
          expect(entry.type.length).toBeGreaterThan(0);
          const hasUrl = Object.prototype.hasOwnProperty.call(entry, 'url');
          const hasData = Object.prototype.hasOwnProperty.call(entry, 'data');
          expect(hasUrl !== hasData, `${entry.identifier} needs exactly one of url/data`).toBe(true);
        }
      }
    );

    it('publishes the same entries at both paths readers fetch', () => {
      expect(jsonOf('.well-known/ard.json').entries).toEqual(
        jsonOf('.well-known/ai-catalog.json').entries
      );
    });
  });

  describe('Web Bot Auth directory', () => {
    it('is empty and says why, rather than publishing a key that is not used', () => {
      const directory = jsonOf('.well-known/http-message-signatures-directory');
      expect(directory.keys).toEqual([]);
      expect(directory.comment).toMatch(/does not sign outbound requests/i);
    });
  });

  describe('Advertised references', () => {
    const normalise = (path: string) => (path === '/' ? '/' : path.replace(/\/$/, ''));

    // Every string that names this origin, whether it is an exact URL in a JSON
    // field or a URL written into a SKILL.md body. Bare relative paths are caught
    // when they are a whole JSON value; prose is read only for absolute URLs.
    const collect = (value: unknown): string[] => {
      if (typeof value === 'string') {
        const found = value.startsWith('/') ? [value] : [];
        for (const match of value.matchAll(/https:\/\/ravicha2\.github\.io(\/[^\s`)"'\]]*)?/g)) {
          found.push(match[1] ?? '/');
        }
        return found;
      }
      if (Array.isArray(value)) return value.flatMap(collect);
      if (value && typeof value === 'object') return Object.values(value).flatMap(collect);
      return [];
    };

    it('resolves every one to a file the build produces', () => {
      const produced = new Set(
        [
          // Both a file and, for a directory index, the bare path it answers for
          // (`/.well-known/mcp` is served from `/.well-known/mcp/index.html`).
          ...Object.keys(files).map((relative) => `/${relative}`),
          ...Object.keys(files)
            .filter((relative) => relative.endsWith('/index.html'))
            .map((relative) => `/${relative.slice(0, -'/index.html'.length)}`),
          ...routes(),
          ...routes().map(markdownPathFor),
          '/openapi.json',
          '/sitemap.xml',
          '/llms.txt',
          '/llms-full.txt',
          '/agents.md',
          '/auth.md',
          '/cv.pdf',
          '/robots.txt',
        ].map(normalise)
      );

      for (const [path, content] of Object.entries(files)) {
        const parsed = path.endsWith('.md') ? content : JSON.parse(content);
        for (const reference of collect(parsed)) {
          expect(
            produced.has(normalise(reference)),
            `${path} advertises ${reference}, which the build never writes`
          ).toBe(true);
        }
      }
    });

    it('resolves every path the OpenAPI document advertises', () => {
      const produced = new Set([
        ...Object.keys(files).map((relative) => `/${relative}`),
        ...Object.keys(files)
          .filter((relative) => relative.endsWith('/index.html'))
          .map((relative) => `/${relative.slice(0, -'/index.html'.length)}`),
        ...routes(),
        ...routes().map(markdownPathFor),
        '/openapi.json',
        '/sitemap.xml',
        '/llms.txt',
        '/llms-full.txt',
        '/agents.md',
        '/auth.md',
        '/cv.pdf',
        '/robots.txt',
      ]);

      for (const endpoint of apiEndpoints) {
        expect(
          produced.has(normalise(endpoint.path)),
          `the OpenAPI document advertises ${endpoint.path}, which the build never writes`
        ).toBe(true);
      }
    });
  });
});
