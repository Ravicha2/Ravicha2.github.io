import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { AGENT_OPERATIONS, apiEndpoints, openApiDocument } from '../src/data/api';
import {
  ardEntries,
  discoveryDocumentPaths,
  discoveryDocuments,
  discoveryExceptions,
  skillDocuments,
  skillFileContent,
} from '../src/data/discovery';
import { markdownPathFor, render, renderMarkdown, routes } from '../src/entry-server';
import { describeSite, webMcpTools } from '../src/webmcp/tools';

/**
 * The media type GitHub Pages really sends, derived from the path rather than
 * read back from the declaration it is meant to check. Pages sets Content-Type
 * from the file name, so the extension of the last path segment decides, and a
 * segment with no extension at all gets the opaque fallback (ADR 0005, decision
 * 5). Deriving the expectation here means a declared type that drifts from the
 * shape of its own path fails the test instead of agreeing with a table that
 * drifted beside it. A shape this cannot map returns undefined, which fails the
 * assertion rather than being skipped.
 */
const servedTypeFor = (servedPath: string): string | undefined => {
  const lastSegment = servedPath.slice(servedPath.lastIndexOf('/') + 1);
  const dot = lastSegment.lastIndexOf('.');
  if (dot === -1) return 'application/octet-stream';
  const byExtension: Record<string, string> = {
    '.json': 'application/json',
    '.md': 'text/markdown',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.xml': 'application/xml',
  };
  return byExtension[lastSegment.slice(dot).toLowerCase()];
};

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

  it("declares the media type its path's shape really produces, for every operation", () => {
    // Every operation is one row of the table, so walking AGENT_OPERATIONS covers
    // the whole surface — including the extensionless discovery paths, which the
    // origin serves as application/octet-stream, and the .txt and .xml documents
    // whose shapes fall outside the four the issue names.
    for (const op of AGENT_OPERATIONS) {
      const servedAt = apiEndpoints.find((endpoint) => endpoint.operationId === op.operationId);
      expect(servedAt, `${op.operationId} is not in the endpoint table`).toBeDefined();
      const expected = servedTypeFor(servedAt!.path);
      expect(expected, `${servedAt!.path} has a shape this test cannot map`).toBeDefined();
      expect(
        op.contentType,
        `${servedAt!.path} (${op.operationId}) declares a type its path shape does not produce`
      ).toBe(expected);
    }
  });

  it('names that served type as the 200 content type in the published document', () => {
    // The document is what reaches dist/openapi.json, so this is the end of the
    // line for the declared type: the 200 response names exactly the one type the
    // path shape produces, and no second type an agent could be misled by.
    for (const [path, item] of paths) {
      const expected = servedTypeFor(path);
      expect(expected, `${path} has a shape this test cannot map`).toBeDefined();
      expect(
        Object.keys(item.get.responses['200'].content ?? {}),
        `${path} 200 content does not name the served type`
      ).toEqual([expected]);
    }
  });

  it('explains, in the two affected descriptions, the type the specification asks for and why this origin cannot send it', () => {
    // The type a specification asks for moves out of the declared content type and
    // into prose for the two extensionless paths. This holds the prose to naming
    // both types, so the gap is stated rather than the type simply being dropped.
    const affected: Array<[string, string]> = [
      ['getApiCatalog', 'application/linkset+json'],
      ['getProtectedResourceMetadata', 'application/json'],
    ];
    for (const [operationId, specType] of affected) {
      const op = AGENT_OPERATIONS.find((candidate) => candidate.operationId === operationId);
      expect(op, `${operationId} is missing`).toBeDefined();
      expect(op!.description, `${operationId} no longer names the type the spec asks for`).toContain(
        specType
      );
      expect(op!.description, `${operationId} does not name the served type`).toContain(
        'application/octet-stream'
      );
      expect(op!.description, `${operationId} does not say the origin cannot send it`).toMatch(
        /cannot send/
      );
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

    // The in-page tools are described in one entry carried as inline `data`, since
    // there is no URL at which a reader could call them. These tests hold that entry
    // to the tools the page really registers: the descriptors are projected from
    // webMcpTools here, independently of the projection that builds the document, so
    // a descriptor that drifts from the tool fails here rather than agreeing with a
    // copy that drifted beside it.
    const toolsEntry = (path = '.well-known/ard.json') => {
      const entry = jsonOf(path).entries.find(
        (candidate: { identifier: string }) =>
          candidate.identifier === 'urn:air:ravicha2.github.io:tools:portfolio'
      );
      expect(entry, `${path} has no in-page tools entry`).toBeDefined();
      return entry;
    };

    it('describes the in-page tools as one inline-data entry, projected from webMcpTools', () => {
      const projected = webMcpTools.map((tool) => ({
        name: tool.name,
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }));
      for (const path of ['.well-known/ard.json', '.well-known/ai-catalog.json']) {
        const entry = toolsEntry(path);
        expect(entry, `${path} points the tools at a url`).not.toHaveProperty('url');
        expect(entry).toHaveProperty('data');
        expect(entry.identifier).toMatch(/^urn:air:/);
        expect(entry.type).toBe('application/json');
        expect(entry.data.tools, `${path} tool descriptors drifted from webMcpTools`).toEqual(
          projected
        );
      }
    });

    it('carries only the four descriptor fields per tool, never a handler', () => {
      const entry = toolsEntry();
      const descriptorKeys = ['description', 'inputSchema', 'name', 'title'];
      expect(entry.data.tools).toHaveLength(webMcpTools.length);
      for (const tool of entry.data.tools) {
        expect(Object.keys(tool).sort(), `${tool.name} carries more than its descriptor`).toEqual(
          descriptorKeys
        );
      }
      for (const path of ['.well-known/ard.json', '.well-known/ai-catalog.json']) {
        expect(files[path], `${path} leaks a tool handler`).not.toContain('execute');
      }
    });

    it('says the tools are browser-mediated and names only static equivalents the build writes', () => {
      const entry = toolsEntry();
      expect(entry.description).toMatch(/document\.modelContext/);
      expect(entry.description).toMatch(/no HTTP client can invoke a tool/);
      expect(entry.description).toMatch(/cannot run one/);
      for (const named of [
        `${SITE}/llms.txt`,
        `${SITE}/projects.md`,
        `${SITE}/openapi.json`,
        `${SITE}/sitemap.xml`,
      ]) {
        expect(entry.description, `the entry does not name ${named}`).toContain(named);
      }

      // Every origin URL the entry names is a document the build really writes. The
      // check is derived, not a hand-list: the produced set is built from the same
      // route list the prerenderer and the sitemap use.
      const produced = new Set([
        ...routes(),
        ...routes().map(markdownPathFor),
        ...discoveryDocumentPaths().map((relative) => `/${relative}`),
        '/llms.txt',
        '/llms-full.txt',
        '/openapi.json',
        '/sitemap.xml',
        '/agents.md',
        '/auth.md',
        '/cv.pdf',
        '/robots.txt',
      ]);
      const named = [
        ...entry.description.matchAll(/https:\/\/ravicha2\.github\.io(\/[A-Za-z0-9._/-]*)?/g),
      ].map((match) => match[1] ?? '/');
      expect(named.length, 'the entry names no static equivalent').toBeGreaterThan(0);
      for (const url of named) {
        expect(produced.has(url), `the entry names ${url}, which the build never writes`).toBe(true);
      }
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

/**
 * The /.well-known surface is a census: every document the build publishes there is
 * either described by an operation in the OpenAPI document or named as a declared
 * exception with a written reason. The tests above prove advertised to served;
 * these prove served to described, so a document cannot go live and stay invisible
 * to the spec (ADR 0005, decision 6).
 */
describe('The /.well-known census', () => {
  // The two spellings differ by one character, and that is the whole bridge: the
  // discovery module writes paths relative to dist/ (`.well-known/...`) while an
  // operation is served at an absolute path (`/.well-known/...`). Comparing the
  // raw strings would compare nothing, so each operation is reduced to the form
  // the discovery module uses before the two lists meet. Only the operations on
  // the discovery surface are in scope; the pages, the sitemap and the CV are
  // served outside /.well-known and belong to no census of it.
  const described = apiEndpoints
    .map((endpoint) => endpoint.path)
    .filter((path) => path.startsWith('/.well-known/'))
    .map((path) => path.replace(/^\//, ''));
  const excepted = discoveryExceptions.map((exception) => exception.path);

  it('covers every published path exactly once, as an operation or a declared exception', () => {
    expect(described.length, 'no discovery operation is described at all').toBeGreaterThan(0);
    const covered = [...described, ...excepted];
    expect(new Set(covered).size, `a published path is covered twice: ${covered.join(', ')}`).toBe(
      covered.length
    );
    // The whole census in one line: what the build publishes is exactly what the
    // document describes plus what the exception list accounts for. A document
    // added to discoveryDocumentPaths() and nowhere else fails here, which is the
    // point — it cannot go live until it is described or excepted.
    expect(covered.sort()).toEqual([...discoveryDocumentPaths()].sort());
  });

  it('gives every exception a real reason and a path the build really publishes', () => {
    const published = new Set(discoveryDocumentPaths());
    for (const exception of discoveryExceptions) {
      expect(exception.reason.length, `${exception.path} has no reason`).toBeGreaterThan(20);
      expect(
        published.has(exception.path),
        `${exception.path} is declared an exception but is not published`
      ).toBe(true);
      expect(
        described,
        `${exception.path} is both excepted and described by an operation`
      ).not.toContain(exception.path);
    }
  });
});

/**
 * Issue #37 chose Option 1: accept the GitHub Pages limitation and state it, rather
 * than add an edge layer. These tests hold the honesty rather than the implementation:
 * the real 404 is HTML, the JSON envelope is named as *not served*, no promissory
 * language ("not served yet", "when this origin can send it") creeps back in, and no
 * agent-facing document claims a markdown or JSON error body.
 */
describe('The error model states the limitation instead of promising a fix', () => {
  const paths = Object.entries(openApiDocument.paths) as Array<
    [string, { get: { responses: Record<string, { content?: Record<string, unknown> }> } }]
  >;
  const model = openApiDocument['x-error-model'] as unknown as {
    status: string;
    decision: string;
    note: string;
    served: Record<string, { content: Record<string, { schema: { type: string } }> }>;
    unsupported: Record<string, string>;
  };

  it('documents the real 404 body as text/html', () => {
    expect(Object.keys(model.served['404'].content)).toEqual(['text/html']);
    expect(model.served['404'].content['text/html'].schema.type).toBe('string');
  });

  it('records a settled decision, not a plan', () => {
    expect(model.status).toBe('not-supported');
    expect(model.status).not.toBe('planned');
  });

  it('names the JSON envelope and Vary: Accept as unsupported', () => {
    expect(model.unsupported['application/problem+json']).toBeTruthy();
    expect(model.unsupported.vary).toMatch(/Accept/);
  });

  it("keeps every operation's documented 404 an HTML response", () => {
    for (const [path, item] of paths) {
      const notFound = item.get.responses['404'];
      expect(Object.keys(notFound.content ?? {}), `${path} 404 is not text/html`).toEqual([
        'text/html',
      ]);
    }
  });

  it('uses no language that promises the capability later', () => {
    const text = [model.decision, model.note, ...Object.values(model.unsupported)].join(' ');
    expect(text).not.toMatch(/not served yet|not yet served|will not need changing|would send/i);
  });

  it('describes the envelope as not served on /developers and in its markdown twin', () => {
    for (const [label, text] of [
      ['/developers HTML', render('/developers').html],
      ['/developers.md', renderMarkdown('/developers') ?? ''],
    ] as const) {
      expect(text, `${label} stopped naming the envelope`).toContain('components.schemas.Problem');
      expect(text, `${label} stopped saying it is not served`).toMatch(/is not served/);
      expect(text, `${label} promises it will be served later`).not.toMatch(
        /will not need changing|when this origin can send/i
      );
    }
  });

  it('has no agent-facing document claiming a markdown or JSON error body, or Vary: Accept', () => {
    const publicDir = path.resolve(__dirname, '../public');
    const documents = ['llms.txt', 'agents.md', '404.html'].map((name) => ({
      name,
      text: fs.readFileSync(path.join(publicDir, name), 'utf-8'),
    }));
    documents.push(
      { name: '/docs.md', text: renderMarkdown('/docs') ?? '' },
      { name: '/developers.md', text: renderMarkdown('/developers') ?? '' }
    );

    for (const { name, text } of documents) {
      expect(text, `${name} claims the error body is markdown or JSON`).not.toMatch(
        /error (body|response)[^.\n]{0,20}(markdown|json)/i
      );
      expect(text, `${name} claims a Vary: Accept header`).not.toMatch(/Vary:\s*Accept/i);
      expect(text, `${name} promises the envelope later`).not.toMatch(
        /not served yet|not yet served|when this origin can send|will not need changing/i
      );
    }
  });
});

/**
 * The in-page tools live only in the page's JavaScript, so a reader that never runs
 * it — a crawler, a fetcher of a markdown twin, an agent reading the skill document —
 * learns the surface exists only from these hand-maintained sentences. A test pins
 * them: every published surface must name all three tools, carry the browser caveat,
 * and point at the static equivalents ADR 0005 decision 3 names for each tool. The
 * tool names are read from `webMcpTools` and the equivalents from the build's own
 * tables, so a rename or a dropped document fails here instead of letting a stale
 * name or a missing path ship on six documents at once. The ARD entry #53 publishes
 * is held to the same standard.
 */
describe('Every published surface names the in-page tools', () => {
  const publicDir = path.resolve(__dirname, '../public');

  // The one entry the ARD catalogs carry for the tools, found by the identifier it
  // declares rather than by position, so reordering the catalog cannot hide it.
  const ardToolsEntry = ardEntries.find(
    (entry) => entry.identifier === 'urn:air:ravicha2.github.io:tools:portfolio'
  );

  // Decision 3 names the document that answers each tool. The tool names come from
  // webMcpTools; the documents are read from the build's own tables and reduced to
  // their base name, so a surface may write `/openapi.json`, `${SITE}/openapi.json`
  // or `openapi.json` and still match. `projects.md` is the markdown twin of the
  // catalog, which markdownPathFor produces for /projects.
  const docNameOf = (servedPath: string) => servedPath.split('/').pop() ?? '';
  const pathOfOperation = (operationId: string): string => {
    const endpoint = apiEndpoints.find((candidate) => candidate.operationId === operationId);
    expect(endpoint, `${operationId} is not in the endpoint table`).toBeDefined();
    return endpoint!.path;
  };
  const llmsTxt = docNameOf(pathOfOperation('getLlmsTxt'));
  const equivalentDocuments = [
    llmsTxt,
    docNameOf(markdownPathFor('/projects')),
    docNameOf(pathOfOperation('getOpenApiDocument')),
    docNameOf(pathOfOperation('getSitemap')),
  ];

  it('names every in-page tool, the browser caveat and the static equivalents on every published surface', () => {
    // The names come from the tools the page really registers; none of the surfaces
    // below hard-codes them, so this test tracks webMcpTools rather than a copy of it.
    const names = webMcpTools.map((tool) => tool.name);
    expect(names, 'webMcpTools no longer declares three tools').toHaveLength(3);
    expect(ardToolsEntry, 'the ARD catalogs carry no in-page tools entry').toBeDefined();

    const surfaces: Array<[string, string]> = [
      ['/developers (HTML)', render('/developers').html],
      ['/developers.md', renderMarkdown('/developers') ?? ''],
      ['public/llms.txt', fs.readFileSync(path.join(publicDir, 'llms.txt'), 'utf-8')],
      ['public/agents.md', fs.readFileSync(path.join(publicDir, 'agents.md'), 'utf-8')],
      ['the portfolio SKILL.md', skillDocuments.portfolio],
      ['describe-site output', describeSite()],
      ['the ARD in-page tools entry', ardToolsEntry!.description],
    ];

    for (const [label, text] of surfaces) {
      for (const name of names) {
        expect(text, `${label} does not name the tool ${name}`).toContain(name);
      }
      // The caveat is two claims, and both have to survive: the tools need a browser
      // that exposes the API, and a reader that has one is still not being offered
      // something it can call. Pinning only the token would let a surface drop the
      // second half and still pass.
      expect(text, `${label} does not name document.modelContext`).toContain(
        'document.modelContext'
      );
      expect(text, `${label} does not say no HTTP client can call the tools`).toMatch(
        /no HTTP client can (call|invoke)/
      );

      for (const document of equivalentDocuments) {
        // /llms.txt is itself one of the equivalents, so that surface may name itself
        // as "this file" rather than repeating its own name; every other surface must
        // write the document out.
        const named =
          text.includes(document) ||
          (label === 'public/llms.txt' && document === llmsTxt && text.includes('this file'));
        expect(named, `${label} does not point at ${document}`).toBe(true);
      }

      // get-project's equivalent is the markdown twin of a project page: prose on
      // most surfaces, the `/projects/<slug>.md` template on /agents.md.
      expect(
        text.includes('markdown twin') || text.includes('projects/<slug>.md'),
        `${label} does not point at the markdown twin of a project page`
      ).toBe(true);
    }
  });
});
