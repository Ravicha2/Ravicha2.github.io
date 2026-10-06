import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { routes, sitemap, SITE } from '../../src/entry-server';

describe('Crawler Protocols (robots.txt & sitemap.xml)', () => {
  const publicDir = path.resolve(__dirname, '../../public');
  const robotsTxtPath = path.join(publicDir, 'robots.txt');

  it('verifies public/robots.txt allows all standard and AI user agents and declares sitemap', () => {
    expect(fs.existsSync(robotsTxtPath)).toBe(true);
    const content = fs.readFileSync(robotsTxtPath, 'utf-8');

    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /');
    expect(content).toContain('GPTBot');
    expect(content).toContain('ClaudeBot');
    expect(content).toContain('PerplexityBot');
    expect(content).toContain('Sitemap: https://ravicha2.github.io/sitemap.xml');
    expect(content).toContain('llms.txt');
  });

  // sitemap.xml is generated from routes() and written into dist/ by
  // scripts/prerender.mjs, so it cannot advertise a URL the site does not render and
  // no route can ship unlisted. What is left to break is the file being a sitemap.
  it('generates a well-formed sitemap listing every rendered route, once each', () => {
    const xml = sitemap();

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);

    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locs).toEqual(routes().map((route) => `${SITE}${route}`));
    expect(new Set(locs).size).toBe(locs.length);
  });

  it('stamps lastmod on every URL when it has a date, and none when it does not', () => {
    // The date comes from git at build time; without one, a URL is still valid.
    expect(sitemap()).not.toContain('<lastmod>');

    const dated = sitemap('2026-10-07');
    expect(dated.match(/<lastmod>2026-10-07<\/lastmod>/g)).toHaveLength(routes().length);
  });
});
