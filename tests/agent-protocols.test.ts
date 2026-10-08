import { describe, it, expect } from 'vitest';
import { AGENT_OPERATIONS, apiEndpoints, openApiDocument } from '../src/data/api';

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
