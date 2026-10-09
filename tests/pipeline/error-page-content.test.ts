import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * `public/404.html` is copied verbatim to `dist/404.html` and served by GitHub
 * Pages for every unmatched address. It used to be an empty `<body>` with only
 * the SPA redirect shim, so any client that does not run JavaScript — a large
 * share of agents, crawlers and link-checkers, and a human whose redirect fails
 * — got a blank white page with nothing to read and nowhere to go.
 *
 * These tests pin the fix against the bytes of the file that actually ships.
 * They deliberately do not describe the page as a markdown or JSON body:
 * GitHub Pages ignores `Accept` and returns this HTML for every request. See
 * docs/adr/0004-accept-html-404s-on-static-hosting.md.
 */
describe('public/404.html has a real body', () => {
  const file = path.resolve(__dirname, '../../public/404.html');
  const html = fs.readFileSync(file, 'utf-8');

  /** Visible text: drop script and style blocks, then strip every remaining tag. */
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  it('renders non-trivial visible text with JavaScript disabled', () => {
    // The old body was empty, so this is the whole point of the change.
    expect(visibleText.length).toBeGreaterThanOrEqual(20);
    expect(visibleText).toMatch(/not found/i);
  });

  it('says plainly which page the visitor asked for is missing', () => {
    expect(visibleText).toMatch(/not here|not found|does not exist/i);
  });

  it('links back to the homepage', () => {
    expect(html).toMatch(/<a\s[^>]*href="\/"/);
  });

  it('links to the machine-readable index and the sitemap', () => {
    expect(html).toMatch(/<a\s[^>]*href="\/llms\.txt"/);
    expect(html).toMatch(/<a\s[^>]*href="\/sitemap\.xml"/);
  });

  it('keeps the SPA redirect script intact and executing', () => {
    const script = html.match(/<script[\s\S]*?<\/script>/i)?.[0] ?? '';
    expect(script).toContain('location.replace');
    expect(script).toContain('pathSegmentsToKeep');
    // The shim has to run before the body is parsed, not after.
    expect(html).toMatch(/<head>[\s\S]*location\.replace[\s\S]*<\/head>/i);
  });

  it('carries no form elements', () => {
    expect(html).not.toMatch(/<(form|input|select|textarea)\b/i);
  });
});
