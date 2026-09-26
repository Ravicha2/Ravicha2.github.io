import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * The floor the issue sets is 7:1 — AAA for body text — measured on the built
 * site. The literals are read out of the stylesheet rather than restated here, so
 * this fails the moment a token moves, instead of quietly checking a frozen copy
 * of a palette that no longer ships.
 */

const tokensCss = fs.readFileSync(
  path.join(process.cwd(), 'src', 'styles', 'tokens.css'),
  'utf-8'
);

function tokenValue(name: string): string {
  const match = tokensCss.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`--${name} not declared in src/styles/tokens.css`);
  return match[1];
}

function getLuminance(hex: string): number {
  const rgb = hex
    .replace('#', '')
    .match(/.{2}/g)!
    .map((x) => parseInt(x, 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function getContrastRatio(hex1: string, hex2: string): number {
  const [brightest, darkest] = [getLuminance(hex1), getLuminance(hex2)].sort((a, b) => b - a);
  return (brightest + 0.05) / (darkest + 0.05);
}

describe('Bench palette contrast (WCAG AAA)', () => {
  // Every colour a glyph can take, against every surface it can sit on. The
  // failed verdict is included: "does not hold" is text, so it answers to the
  // text floor, not to the non-text one.
  const TEXT_TOKENS = ['ink', 'annotate', 'signal', 'nonconform'];
  const SURFACES = ['bench', 'well', 'panel'];

  for (const text of TEXT_TOKENS) {
    it(`--${text} clears 7:1 on every surface it is used on`, () => {
      for (const surface of SURFACES) {
        const ratio = getContrastRatio(tokenValue(text), tokenValue(surface));
        expect(ratio, `--${text} on --${surface} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(
          7.0
        );
      }
    });
  }

  it('clears the 3:1 non-text floor for the rule on every surface', () => {
    for (const surface of SURFACES) {
      const ratio = getContrastRatio(tokenValue('rule'), tokenValue(surface));
      expect(ratio, `--rule on --${surface} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(3.0);
    }
  });

  describe('tokens.css structure', () => {
    it('declares the bench palette and nothing gradient-based', () => {
      expect(tokensCss).not.toContain('gradient');
      for (const name of [
        'bench',
        'well',
        'panel',
        'ink',
        'annotate',
        'signal',
        'nonconform',
        'rule',
      ]) {
        expect(tokensCss, `--${name} must be declared`).toContain(`--${name}:`);
      }
    });

    // The room carries no colour of its own: the substrate, the panels and every
    // value that is merely read out are warm but desaturated, and the only two
    // saturated values are the live signal (brass) and the failed reading (coral).
    // The gap between the two bounds is deliberately empty, so a token that drifts
    // toward coloured lands in neither class and fails loudly.
    it('keeps the room desaturated and spends colour on exactly two meanings', () => {
      const chroma = (hex: string) => {
        const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
        return Math.max(r, g, b) - Math.min(r, g, b);
      };

      for (const name of ['bench', 'well', 'panel', 'ink', 'annotate']) {
        expect(chroma(tokenValue(name)), `--${name} is not desaturated`).toBeLessThan(40);
      }
      expect(chroma(tokenValue('signal')), '--signal must be a hue').toBeGreaterThan(60);
      expect(chroma(tokenValue('nonconform')), '--nonconform must be a hue').toBeGreaterThan(60);
    });
  });
});
