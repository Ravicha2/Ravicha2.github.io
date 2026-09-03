import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Static Baseline HTML Meta & OpenGraph (index.html)', () => {
  const indexHtmlPath = path.resolve(__dirname, '../../index.html');

  it('verifies index.html has canonical, theme-color, OpenGraph, and Twitter tags', () => {
    const content = fs.readFileSync(indexHtmlPath, 'utf-8');

    // Canonical & Basic
    expect(content).toContain('<link rel="canonical" href="https://ravicha2.github.io/" />');
    expect(content).toContain('<meta name="theme-color" content="#09090b" />');
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
