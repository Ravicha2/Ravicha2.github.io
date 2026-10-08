#!/usr/bin/env node
// Writes the real page into the deployed HTML, one file per route.
//
// Without this, the crawled page is `<div id="root"></div>`: every word of the bio,
// the project catalog and the experience record is mounted by JavaScript, and GitHub
// Pages answers /projects and /experience with a 404, so sitemap.xml advertised ten
// dead URLs. Rendering the routes here fixes both — the markup is in the file, and
// each route gets its own directory with a real index.html behind it.
//
// The per-route <head> cannot come from the app: SEOHead (src/components/seo/
// SEOHead.tsx) does all of its work in useEffect, which never fires under
// renderToStaticMarkup, so every route would ship the home page's title and JSON-LD.
// src/entry-server.tsx hands back getRouteMeta() and generateJsonLdForRoute() with the
// markup — the same functions the app uses at runtime — and they are written here.
//
// ponytail: regex over the built template instead of templating index.html, which the
// tests pin (tests/pipeline/spa-routing.test.ts, tests/seo/index-html-meta.test.ts) and
// which is the one file Vite owns. Every pattern asserts its match, so renaming a tag
// fails the build rather than quietly advertising the home page on all ten routes.
//
// Reads dist/index.html (run after `vite build`) and .ssr/entry-server.js (run after
// `vite build --ssr`). Both are wired into `npm run build`.
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = path.join(root, 'dist');
const ssr = path.join(root, '.ssr');

const { render, routes, sitemap, renderMarkdown, markdownPathFor, openApiJson } = await import(
  path.join(ssr, 'entry-server.js')
);

const attr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Swap exactly what is in the template, or fail the build. */
function swap(html, pattern, replacement, what) {
  if (!pattern.test(html)) throw new Error(`prerender: ${what} not found in dist/index.html`);
  return html.replace(pattern, replacement);
}

const metaTag = (name, content) => `<meta name="${name}" content="${attr(content)}" />`;
const ogTag = (property, content) => `<meta property="${property}" content="${attr(content)}" />`;

function withHead(html, meta, jsonLd, route) {
  html = swap(html, /<title>[^<]*<\/title>/, `<title>${attr(meta.title)}</title>`, '<title>');
  html = swap(
    html,
    /<meta name="description" content="[^"]*" \/>/,
    metaTag('description', meta.description),
    'description'
  );
  // The marker tells the client entry whether this file was rendered for the URL it
  // was served at, so it can hydrate instead of guessing from an empty container.
  html = swap(
    html,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${attr(meta.canonicalUrl)}" />\n    ` +
      metaTag('prerendered-route', route),
    'canonical link'
  );
  html = swap(html, /<meta property="og:url" content="[^"]*" \/>/, ogTag('og:url', meta.canonicalUrl), 'og:url');
  html = swap(html, /<meta property="og:type" content="[^"]*" \/>/, ogTag('og:type', meta.ogType), 'og:type');
  html = swap(html, /<meta property="og:title" content="[^"]*" \/>/, ogTag('og:title', meta.title), 'og:title');
  html = swap(
    html,
    /<meta property="og:description" content="[^"]*" \/>/,
    ogTag('og:description', meta.description),
    'og:description'
  );
  html = swap(
    html,
    /<meta name="twitter:title" content="[^"]*" \/>/,
    metaTag('twitter:title', meta.title),
    'twitter:title'
  );
  html = swap(
    html,
    /<meta name="twitter:description" content="[^"]*" \/>/,
    metaTag('twitter:description', meta.description),
    'twitter:description'
  );
  // The markdown twin, pointed at the right file for this route. Left unswapped it
  // would advertise the home page's twin on all nineteen routes.
  html = swap(
    html,
    /<link rel="alternate" type="text\/markdown" href="[^"]*" title="This page as markdown" \/>/,
    `<link rel="alternate" type="text/markdown" href="${attr(markdownPathFor(route))}" title="This page as markdown" />`,
    'markdown alternate link'
  );
  // The baseline block in index.html is the first ld+json on the page, and this
  // replaces it with the route's own graph.
  return swap(
    html,
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n    </script>`,
    'JSON-LD block'
  );
}

const withBody = (html, markup) =>
  swap(html, /<div id="root"><\/div>/, `<div id="root">${markup}</div>`, '#root div');

const template = await readFile(path.join(dist, 'index.html'), 'utf8');

for (const route of routes()) {
  const { html, meta, jsonLd } = render(route);
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, withBody(withHead(template, meta, jsonLd, route), html));
  console.log(`wrote ${path.relative(root, file)}`);
}

// The markdown twin of each route, at the path the page advertises. GitHub Pages
// derives the content type from the extension, so `<route>.md` is served as
// text/markdown while `<route>/index.html` is served as text/html. Written from
// the same route list as the HTML, so a page cannot ship without its twin.
for (const route of routes()) {
  const markdown = renderMarkdown(route);
  if (!markdown) throw new Error(`prerender: no markdown twin for ${route}`);
  if (!markdown.startsWith('# ')) {
    throw new Error(`prerender: ${route} markdown does not open with a top-level heading`);
  }
  const file = path.join(dist, markdownPathFor(route).slice(1));
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, markdown.endsWith('\n') ? markdown : `${markdown}\n`);
  console.log(`wrote ${path.relative(root, file)}`);
}

// The OpenAPI document. Generated from src/data/api.ts rather than committed as a
// file under public/, so the spec and the pages that render it cannot drift.
await writeFile(path.join(dist, 'openapi.json'), openApiJson());
console.log('wrote dist/openapi.json');

// When the words last changed, taken from git rather than from the clock. A build
// date would stamp today on all ten URLs on every deploy, including the deploys that
// only touched CSS, and an always-today lastmod is one Google learns to ignore.
//
// Every route's content comes out of src/data, so one date answers for all of them;
// a date per route would mean tracking which data file each view reads, for ten
// pages. Scoping to the whole directory errs towards "changed", which is the safe
// direction. Omitted rather than guessed if git cannot answer — a date is optional
// in the sitemap, a wrong one is not.
//
// ponytail: real dates need full history (deploy.yml checks out with fetch-depth: 0);
// a shallow clone collapses this to the pushed commit.
const lastmod = (() => {
  try {
    return (
      execFileSync('git', ['log', '-1', '--format=%cs', '--', 'src/data'], {
        cwd: root,
        encoding: 'utf8',
      }).trim() || undefined
    );
  } catch {
    return undefined;
  }
})();

// Written from the same route list the loop above rendered, so the two cannot drift.
// public/sitemap.xml is gone: a file that has to be remembered has to be remembered
// wrong eventually.
await writeFile(path.join(dist, 'sitemap.xml'), sitemap(lastmod));
console.log(`wrote dist/sitemap.xml (lastmod ${lastmod ?? 'omitted'})`);

await rm(ssr, { recursive: true, force: true });
