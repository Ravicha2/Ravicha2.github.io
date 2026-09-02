// tests/pipeline/fonts.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Self-Hosted Fonts Pipeline', () => {
  const rootDir = process.cwd();

  it('contains self-hosted Geist Sans and Geist Mono WOFF2 font files in public/fonts', () => {
    const geistSansPath = path.join(rootDir, 'public', 'fonts', 'Geist-Variable.woff2');
    const geistMonoPath = path.join(rootDir, 'public', 'fonts', 'GeistMono-Variable.woff2');

    expect(fs.existsSync(geistSansPath), 'Geist-Variable.woff2 must exist').toBe(true);
    expect(fs.existsSync(geistMonoPath), 'GeistMono-Variable.woff2 must exist').toBe(true);
    expect(fs.statSync(geistSansPath).size).toBeGreaterThan(10000);
    expect(fs.statSync(geistMonoPath).size).toBeGreaterThan(10000);
  });

  it('defines @font-face rules with local relative URLs in fonts.css', () => {
    const fontsCssPath = path.join(rootDir, 'src', 'styles', 'fonts.css');
    expect(fs.existsSync(fontsCssPath), 'src/styles/fonts.css must exist').toBe(true);

    const content = fs.readFileSync(fontsCssPath, 'utf-8');
    expect(content).toContain("font-family: 'Geist Sans'");
    expect(content).toContain("font-family: 'Geist Mono'");
    expect(content).toContain('/fonts/Geist-Variable.woff2');
    expect(content).toContain('/fonts/GeistMono-Variable.woff2');
    expect(content).toContain('font-display: swap');
    expect(content).not.toContain('http://');
    expect(content).not.toContain('https://');
  });

  it('imports fonts.css in index.css', () => {
    const indexCssPath = path.join(rootDir, 'src', 'styles', 'index.css');
    const content = fs.readFileSync(indexCssPath, 'utf-8');
    expect(content).toContain("@import './fonts.css';");
  });
});
