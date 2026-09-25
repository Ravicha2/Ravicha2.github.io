import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Guards the failure mode behind issue #18: a utility class that looks correct in
 * the source and produces no CSS at all. Nothing else catches these — the build
 * succeeds, the tests pass, and the element silently renders wrong.
 *
 * Every rule below was confirmed against the built stylesheet before being
 * written down here; none of them is a style preference.
 */

const rootDir = process.cwd();

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(tsx|ts|css)$/.test(entry.name) ? [full] : [];
  });
}

const sources = sourceFiles(path.join(rootDir, 'src')).map((file) => ({
  file: path.relative(rootDir, file),
  lines: fs.readFileSync(file, 'utf-8').split('\n'),
}));

/** Fail with every offending file:line, so the message points at the fix. */
function expectAbsent(pattern: RegExp, why: string) {
  const hits = sources.flatMap(({ file, lines }) =>
    lines.flatMap((line, i) => (pattern.test(line) ? [`${file}:${i + 1}  ${line.trim()}`] : []))
  );
  expect(hits, `${why}\nFound:\n${hits.join('\n')}`).toEqual([]);
}

/** The token utilities resolve to `var(--…)`, not to a literal colour. */
const TOKEN_COLOUR =
  'canvas|surface|surface-hover|border-subtle|border-strong|text-primary|text-secondary|text-muted|accent-solid|accent-badge-bg|accent-badge-text';

describe('utilities that generate no CSS', () => {
  it('applies no alpha modifier to a var()-declared colour', () => {
    // Tailwind composes alpha as rgb(<colour> / var(--tw-bg-opacity)), which needs a
    // literal colour. On a `var(--…)` token it emits nothing at all.
    expectAbsent(
      new RegExp(`\\b(?:bg|text|border|from|to|via)-(?:${TOKEN_COLOUR})/\\d`),
      'An alpha modifier on a var()-declared colour generates no class.'
    );
  });

  it('uses no bg-opacity utility', () => {
    // The class is emitted, but only sets --tw-bg-opacity — which nothing reads,
    // because the colour is `var(--accent-solid)` rather than rgb(...). This is the
    // quiet one: it builds, it appears in the CSS, and it does nothing.
    expectAbsent(/\bbg-opacity-\d/, 'bg-opacity is inert on a var()-declared colour.');
  });

  it('uses no utility outside the Tailwind scale', () => {
    expectAbsent(/\btext-bold\b/, '`text-bold` is not a class; the weight utility is `font-bold`.');
    expectAbsent(
      /\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y|inset|top|right|bottom|left|w|h|size|translate-x|translate-y)-0\.2\b/,
      '0.2 is not a step in the Tailwind spacing scale.'
    );
  });
});

describe('the unreachable dark theme stays removed', () => {
  it('carries no dark: variant in src/', () => {
    // `darkMode` is unset, so a re-added dark: variant would now follow the OS
    // preference rather than the never-set class — silently shipping a second theme.
    expectAbsent(/\bdark:/, 'dark: variants are unreachable; the dark class is never set.');
  });

  it('configures no darkMode strategy', () => {
    const config = fs.readFileSync(path.join(rootDir, 'tailwind.config.ts'), 'utf-8');
    expect(config).not.toMatch(/darkMode/);
  });

  it('declares no .dark token block', () => {
    const tokens = fs.readFileSync(path.join(rootDir, 'src/styles/tokens.css'), 'utf-8');
    expect(tokens).not.toMatch(/\.dark\b/);
  });

  it('keeps a single :root palette', () => {
    const tokens = fs.readFileSync(path.join(rootDir, 'src/styles/tokens.css'), 'utf-8');
    expect(tokens.match(/:root\b/g)).toHaveLength(1);
  });
});
