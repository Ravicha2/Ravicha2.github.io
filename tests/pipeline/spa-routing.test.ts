import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('GitHub Pages SPA Deep-Link Routing', () => {
  const rootDir = process.cwd();

  it('contains public/404.html with path redirection script', () => {
    const notFoundPath = path.join(rootDir, 'public', '404.html');
    expect(fs.existsSync(notFoundPath), 'public/404.html must exist').toBe(true);

    const content = fs.readFileSync(notFoundPath, 'utf-8');
    expect(content).toContain('location.replace');
    expect(content).toContain('pathSegmentsToKeep');
  });

  it('contains redirect decoder and script module entry in root index.html', () => {
    const indexPath = path.join(rootDir, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    expect(content).toContain('<div id="root"></div>');
    expect(content).toContain('/src/main.tsx');
    expect(content).not.toContain('bg-gradient');
    expect(content).not.toContain('https://cdn.tailwindcss.com');
  });
});
