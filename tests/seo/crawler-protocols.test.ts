import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Crawler Protocols (robots.txt & sitemap.xml)', () => {
  const publicDir = path.resolve(__dirname, '../../public');
  const robotsTxtPath = path.join(publicDir, 'robots.txt');
  const sitemapXmlPath = path.join(publicDir, 'sitemap.xml');

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

  it('verifies public/sitemap.xml is valid XML and contains all canonical routes', () => {
    expect(fs.existsSync(sitemapXmlPath)).toBe(true);
    const content = fs.readFileSync(sitemapXmlPath, 'utf-8');

    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    const expectedUrls = [
      'https://ravicha2.github.io/',
      'https://ravicha2.github.io/projects',
      'https://ravicha2.github.io/projects/shepherd',
      'https://ravicha2.github.io/projects/nl2regex',
      'https://ravicha2.github.io/projects/document-ingestion-agent',
      'https://ravicha2.github.io/projects/lit-review-council',
      'https://ravicha2.github.io/projects/node-api',
      'https://ravicha2.github.io/projects/robotic-arm-ultrasound',
      'https://ravicha2.github.io/projects/heal-a2a',
      'https://ravicha2.github.io/experience',
    ];

    expectedUrls.forEach((url) => {
      expect(content).toContain(`<loc>${url}</loc>`);
    });
  });
});
