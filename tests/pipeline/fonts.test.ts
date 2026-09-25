// tests/pipeline/fonts.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * The sheet's lettering: Barlow states the claim, Iosevka carries every measured
 * value, dimension and permalink. Both are self-hosted and subset — a webfont
 * request to a third party is a request the visitor's browser makes about them,
 * and the licence has to permit the subsetting (see public/fonts/PROVENANCE.md).
 */
describe('Self-Hosted Fonts Pipeline', () => {
  const rootDir = process.cwd();

  const FACES = [
    'Barlow-400.woff2',
    'Barlow-500.woff2',
    'Barlow-600.woff2',
    'Barlow-700.woff2',
    'Iosevka-400.woff2',
    'Iosevka-500.woff2',
    'Iosevka-700.woff2',
  ];

  it('ships every subsetted face locally, none of them empty', () => {
    for (const face of FACES) {
      const file = path.join(rootDir, 'public', 'fonts', face);
      expect(fs.existsSync(file), `${face} must exist`).toBe(true);
      expect(fs.statSync(file).size, `${face} looks like a stub`).toBeGreaterThan(2000);
    }
  });

  it('defines @font-face rules with local relative URLs in fonts.css', () => {
    const fontsCssPath = path.join(rootDir, 'src', 'styles', 'fonts.css');
    expect(fs.existsSync(fontsCssPath), 'src/styles/fonts.css must exist').toBe(true);

    const content = fs.readFileSync(fontsCssPath, 'utf-8');
    expect(content).toContain("font-family: 'Barlow'");
    expect(content).toContain("font-family: 'Iosevka'");
    for (const face of FACES) {
      expect(content).toContain(`/fonts/${face}`);
    }
    expect(content).toContain('font-display: swap');
    expect(content).not.toContain('http://');
    expect(content).not.toContain('https://');
  });

  it('imports fonts.css in index.css and binds both families in Tailwind', () => {
    expect(read('src/styles/index.css')).toContain("@import './fonts.css';");

    const config = read('tailwind.config.ts');
    expect(config).toContain("'Barlow'");
    expect(config).toContain("'Iosevka'");
  });

  function read(p: string): string {
    return fs.readFileSync(path.join(rootDir, p), 'utf-8');
  }
});
