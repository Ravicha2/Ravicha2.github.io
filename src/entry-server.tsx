import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { App } from './App';
import { projects } from './data/projects';
import { openApiDocument } from './data/api';
import { canonicalUrlFor, generateJsonLdForRoute, getRouteMeta, type RouteMeta } from './utils/seo';
import { markdownPathFor, renderMarkdown } from './utils/markdown';

/**
 * The build-time half of the site. `scripts/prerender.mjs` runs this over every
 * route after `vite build` so the deployed HTML carries the actual page rather
 * than an empty `#root`, and so each route has a real file behind it instead of
 * GitHub Pages' 404 redirect.
 */
export interface PrerenderedRoute {
  html: string;
  meta: RouteMeta;
  jsonLd: Record<string, unknown>;
}

export { markdownPathFor, renderMarkdown };

// The `/.well-known/` documents. They are not pages, so they are not rendered: the
// prerenderer writes the map straight to `dist/`, and the paths in the map are the
// only paths the site advertises as its machine surface. Re-exported here because
// scripts/prerender.mjs loads this bundle, not the TypeScript sources.
export {
  discoveryDocuments,
  discoveryDocumentPaths,
  skillDocuments,
  skillFileContent,
} from './data/discovery';

/** The published OpenAPI document, serialised. Written to dist/openapi.json by the prerenderer. */
export const openApiJson = (): string => `${JSON.stringify(openApiDocument, null, 2)}\n`;

/** Every URL the site answers. The one list the prerenderer and the sitemap share. */
export const routes = (): string[] => [
  '/',
  '/projects',
  ...projects.map((project) => `/projects/${project.slug}`),
  '/experience',
  '/about',
  '/contact',
  '/privacy',
  '/developers',
  '/docs',
];

/**
 * sitemap.xml, built from the same list that decides which files get rendered — so a
 * URL cannot be advertised without a page behind it, or ship a page without being
 * listed. Each `<loc>` is the route's canonical URL, the form the site is actually
 * served at, so a crawler is not sent through a 301 it could have been spared.
 * `<loc>` only, plus `<lastmod>` when the caller can say when the content last
 * changed: Google ignores `<priority>` and `<changefreq>`, so ranking each route would
 * be hand-maintained precision that nothing reads.
 */
export const sitemap = (lastmod?: string): string =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes().map((route) =>
      [
        '  <url>',
        `    <loc>${canonicalUrlFor(route)}</loc>`,
        ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
        '  </url>',
      ].join('\n')
    ),
    '</urlset>',
    '',
  ].join('\n');

export function render(path: string): PrerenderedRoute {
  return {
    html: renderToStaticMarkup(
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    ),
    // Both are pure and read only from src/data, but they live here rather than in
    // the script because the app already derives its own head from them at runtime
    // (src/components/seo/SEOHead.tsx). One source, so the static page and the
    // hydrated one cannot describe the person differently.
    meta: getRouteMeta(path),
    jsonLd: generateJsonLdForRoute(path),
  };
}
