import { describe, it, expect } from 'vitest';
import { generateJsonLdForRoute, getRouteMeta, SITE } from '../../src/utils/seo';
import { routes } from '../../src/entry-server';

/**
 * The five pages added for agents and trust: /about, /contact, /privacy, /developers
 * and /docs. Each is prerendered with its own head (see scripts/prerender.mjs), so an
 * agent that fetches a URL without running JavaScript gets a title and a JSON-LD graph
 * that describe that page rather than the home page.
 *
 * These tests read the same `getRouteMeta` / `generateJsonLdForRoute` the prerenderer
 * writes into `dist/`, so what is asserted here is what ships.
 */
describe('Agent-facing routes', () => {
  const agentRoutes = ['/about', '/contact', '/privacy', '/developers', '/docs'] as const;

  it.each(agentRoutes)('%s has its own meta, not the not-found fallback', (route) => {
    const meta = getRouteMeta(route);
    expect(meta.title).not.toMatch(/page not found/i);
    expect(meta.description.length).toBeGreaterThan(40);
    expect(meta.description).not.toMatch(/page not found/i);
    expect(meta.canonicalUrl).toBe(`${SITE}${route}/`);
  });

  it('gives every route a distinct title', () => {
    const titles = routes().map((route) => getRouteMeta(route).title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it.each(agentRoutes)('%s carries a page node and a breadcrumb in its JSON-LD', (route) => {
    const graph = generateJsonLdForRoute(route)['@graph'] as Array<Record<string, any>>;
    expect(graph.some((node) => node['@type'] === 'Person')).toBe(true);

    const page = graph.find((node) => typeof node['@id'] === 'string' && node['@id'].startsWith(`${SITE}${route}`));
    expect(page, `${route} has no page node`).toBeDefined();
    expect(page!.url).toBe(`${SITE}${route}/`);
    expect(page!.description).toBeTruthy();

    const crumb = graph.find((node) => node['@type'] === 'BreadcrumbList');
    expect(crumb, `${route} has no breadcrumb`).toBeDefined();
    expect(crumb!.itemListElement).toHaveLength(2);
  });

  it.each(agentRoutes)('%s reads the trailing-slash form as the same route', (route) => {
    expect(getRouteMeta(`${route}/`)).toEqual(getRouteMeta(route));
    expect(generateJsonLdForRoute(`${route}/`)).toEqual(generateJsonLdForRoute(route));
  });
});
