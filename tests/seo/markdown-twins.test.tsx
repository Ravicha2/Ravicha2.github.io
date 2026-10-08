import { describe, it, expect } from 'vitest';
import { markdownPathFor, renderMarkdown, routes } from '../../src/entry-server';

/**
 * Every content route ships twice: once as HTML, once as a markdown twin written by
 * `scripts/prerender.mjs`. The twin is what an agent gets when it asks for
 * `text/markdown` without executing JavaScript, so it has to exist for every route
 * the site serves, open with a top-level heading, and carry real content rather than
 * a stub.
 *
 * `scripts/prerender.mjs` refuses to write a twin that does not open with `# `, so
 * this test and the build enforce the same rule from two sides: the build cannot
 * emit a bad twin, and no route can be added without one.
 */
describe('Markdown twins', () => {
  const allRoutes = routes();

  it('renders a non-empty markdown twin for every route, opening with a level-1 heading', () => {
    for (const route of allRoutes) {
      const markdown = renderMarkdown(route);
      expect(markdown, `${route} has no markdown twin`).not.toBeNull();
      expect(markdown!.startsWith('# '), `${route} twin does not open with "# "`).toBe(true);
      expect(markdown!.length, `${route} twin is a stub`).toBeGreaterThan(200);
    }
  });

  it('serves the homepage twin at /index.md and every other twin at <route>.md', () => {
    expect(markdownPathFor('/')).toBe('/index.md');

    const paths = allRoutes.map(markdownPathFor);
    for (let i = 0; i < allRoutes.length; i += 1) {
      const route = allRoutes[i];
      const path = paths[i];
      if (route !== '/') expect(path).toBe(`${route}.md`);
      expect(path.endsWith('.md'), `${route} twin is not a .md file`).toBe(true);
    }

    // One file per route, so two routes cannot clobber each other's twin.
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('answers null for a URL the site does not serve as a page', () => {
    // A twin for an unknown path would tell an agent the site covers something it does not.
    for (const unknown of ['/nope', '/projects/no-such-project', '/about/team']) {
      expect(renderMarkdown(unknown), `${unknown} should have no twin`).toBeNull();
    }
  });

  it('reads the trailing-slash form GitHub Pages serves as the same twin', () => {
    for (const route of allRoutes) {
      if (route === '/') continue;
      expect(renderMarkdown(`${route}/`)).toBe(renderMarkdown(route));
    }
  });
});
