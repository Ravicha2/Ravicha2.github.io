import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { profile } from '../../src/data/profile';

const root = path.resolve(__dirname, '../..');
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf-8');

/** PNG intrinsic size straight out of the IHDR chunk — no image library needed. */
function pngSize(file: string): { width: number; height: number } {
  const buf = fs.readFileSync(path.join(root, file));
  expect(buf.subarray(1, 4).toString('ascii'), `${file} is not a PNG`).toBe('PNG');
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/**
 * A token's literal, read from the stylesheet. Asserting against the literal a
 * palette change would move is the point: issue #22 replaces these values, and a
 * frozen copy in the head or in an asset would then be silently wrong.
 */
function token(name: string): string {
  const match = read('src/styles/tokens.css').match(new RegExp(`--${name}:\\s*([^;]+);`));
  expect(match, `--${name} not declared in src/styles/tokens.css`).not.toBeNull();
  return match![1].trim();
}

describe('Static Baseline HTML Meta & OpenGraph (index.html)', () => {
  const indexHtmlPath = path.resolve(__dirname, '../../index.html');

  it('verifies index.html has canonical, theme-color, OpenGraph, and Twitter tags', () => {
    const content = fs.readFileSync(indexHtmlPath, 'utf-8');

    // Canonical & Basic
    expect(content).toContain('<link rel="canonical" href="https://ravicha2.github.io/" />');
    expect(content).toContain('<meta name="author" content="Palm (Ravicha) Suksawasdi Na Ayuthaya" />');

    // OpenGraph
    expect(content).toContain('<meta property="og:site_name" content="Palm Suksawasdi Portfolio" />');
    expect(content).toContain('<meta property="og:type" content="profile" />');
    expect(content).toContain('<meta property="og:url" content="https://ravicha2.github.io/" />');
    expect(content).toContain('<meta property="og:title" content="Palm Suksawasdi | Portfolio &amp; Systems Engineering" />');

    // Twitter
    expect(content).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(content).toContain('<meta name="twitter:title" content="Palm Suksawasdi | Portfolio &amp; Systems Engineering" />');
  });

  it('keeps theme-color bound to --bench rather than to a literal', () => {
    // The bench is the substrate every route is drawn on, so it is the colour the
    // browser chrome abuts.
    const themeColor = read('index.html').match(/<meta name="theme-color" content="([^"]+)" \/>/);
    expect(themeColor, 'no theme-color meta tag in index.html').not.toBeNull();
    expect(themeColor![1]).toBe(token('bench'));
  });

  it('points og:image and twitter:image at the committed card, with its dimensions and alt text', () => {
    const content = read('index.html');
    const url = 'https://ravicha2.github.io/og-image.png';

    expect(content).toContain(`<meta property="og:image" content="${url}" />`);
    expect(content).toContain(`<meta name="twitter:image" content="${url}" />`);
    expect(content).toContain('<meta property="og:image:width" content="1200" />');
    expect(content).toContain('<meta property="og:image:height" content="630" />');

    const alt = content.match(/<meta property="og:image:alt" content="([^"]+)" \/>/);
    expect(alt, 'no og:image:alt in index.html').not.toBeNull();
    expect(alt![1]).toContain(profile.headline);

    // A relative URL is a valid tag that no scraper will ever fetch.
    expect(content).not.toContain('content="/og-image.png"');
  });

  it('links the favicon and the apple-touch-icon', () => {
    const content = read('index.html');
    expect(content).toContain('<link rel="icon" href="/favicon.svg" type="image/svg+xml" />');
    expect(content).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png" />');
  });

  it('ships the social assets at their declared dimensions', () => {
    expect(pngSize('public/og-image.png')).toEqual({ width: 1200, height: 630 });
    expect(pngSize('public/apple-touch-icon.png')).toEqual({ width: 180, height: 180 });
    expect(fs.existsSync(path.join(root, 'public/favicon.svg'))).toBe(true);
  });

  it('says the same thing as the SPA: og/meta description is profile.headline', () => {
    const content = read('index.html');
    expect(content).toContain(`<meta name="description" content="${profile.headline}" />`);
    expect(content).toContain(`<meta property="og:description" content="${profile.headline}" />`);
    expect(content).toContain(`<meta name="twitter:description" content="${profile.headline}" />`);
  });

  it('keeps the card source in step with profile, and the favicon in step with the tokens', () => {
    // Whitespace-collapsed: the headline is wrapped across lines in the HTML source.
    const card = read('scripts/og-card.html').replace(/\s+/g, ' ');
    expect(card).toContain(profile.headline);
    expect(card).toContain(profile.name);

    // An SVG favicon cannot read CSS custom properties, so its two hexes are the
    // one place the palette is necessarily duplicated — pin them to the tokens.
    const favicon = read('public/favicon.svg');
    expect(favicon).toContain(token('ink'));
    expect(favicon).toContain(token('bench'));
  });

  it('verifies index.html embeds valid static baseline schema.org/Person JSON-LD', () => {
    const content = fs.readFileSync(indexHtmlPath, 'utf-8');
    const jsonLdMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

    expect(jsonLdMatch).not.toBeNull();
    const parsed = JSON.parse(jsonLdMatch![1]);

    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@graph']).toBeDefined();

    const person = parsed['@graph'].find((item: any) => item['@type'] === 'Person');
    expect(person).toBeDefined();
    expect(person.name).toBe('Palm (Ravicha) Suksawasdi Na Ayuthaya');
    expect(person.jobTitle).toBe('Applied AI & Backend Systems Engineer');
    expect(person.sameAs).toContain('https://github.com/Ravicha2');
  });
});
