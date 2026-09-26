import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf-8');

function luminance(hex: string): number {
  const rgb = hex
    .replace('#', '')
    .match(/.{2}/g)!
    .map((x) => parseInt(x, 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrast(hex1: string, hex2: string): number {
  const [a, b] = [luminance(hex1), luminance(hex2)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

const tokenValue = (name: string): string => {
  const match = read('src/styles/tokens.css').match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`token --${name} not found`);
  return match[1];
};

describe('Focus indicator (WCAG 2.4.13)', () => {
  const accessibilityCss = read('src/styles/accessibility.css');
  const focusRule = accessibilityCss.match(/:focus-visible\s*\{([^}]*)\}/)?.[1] ?? '';

  it('declares the ring with the ink token, never a hue', () => {
    expect(focusRule).toContain('var(--ink)');
    expect(focusRule).not.toContain('var(--nonconform)');
  });

  it('separates the ring from the control with a substrate offset', () => {
    expect(focusRule).toMatch(/outline-offset:\s*2px/);
    expect(focusRule).toMatch(/outline:\s*2px solid/);
  });

  it('carries >= 3:1 against the surface behind it and against an ink-filled control', () => {
    // The ring sits on the bench; the offset gap is the bench showing through.
    expect(contrast(tokenValue('ink'), tokenValue('bench'))).toBeGreaterThanOrEqual(3);
    // An ink-filled control carries bench text, and the gap around it is bench too.
    expect(contrast(tokenValue('bench'), tokenValue('ink'))).toBeGreaterThanOrEqual(3);
  });

  it('is declared in exactly one place — no per-element ring utilities', () => {
    const sources = fs
      .readdirSync(path.join(process.cwd(), 'src'), { recursive: true, encoding: 'utf-8' })
      .filter((f) => f.endsWith('.tsx'));
    const offenders = sources.filter((f) => /\bring-/.test(read(path.join('src', f))));
    expect(offenders).toEqual([]);
  });

  it('keeps its offset — no component overrides outline-offset', () => {
    // A negative offset on a `overflow-hidden` frame put the ring outside the
    // clip box, so the offset that carries the contrast was never painted.
    const sources = fs
      .readdirSync(path.join(process.cwd(), 'src'), { recursive: true, encoding: 'utf-8' })
      .filter((f) => f.endsWith('.tsx') || f.endsWith('.css'))
      .filter((f) => f !== path.join('styles', 'accessibility.css'));
    const offenders = sources.filter((f) => /outline-offset/.test(read(path.join('src', f))));
    expect(offenders).toEqual([]);
  });
});
