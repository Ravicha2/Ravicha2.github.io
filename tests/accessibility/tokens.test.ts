import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

function getLuminance(hex: string): number {
  const rgb = hex
    .replace('#', '')
    .match(/.{2}/g)!
    .map((x) => parseInt(x, 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

describe('WCAG AAA Color Contrast Tokens', () => {
  describe('Light Theme Tokens', () => {
    const canvasBg = '#fafafa';
    const surfaceBg = '#ffffff';
    const textPrimary = '#09090b';
    const textSecondary = '#3f3f46';
    const textMuted = '#52525b';
    const accentBlue = '#1e40af';

    it('text-primary achieves WCAG AAA (>= 7.0:1) on canvas and surface', () => {
      expect(getContrastRatio(textPrimary, canvasBg)).toBeGreaterThanOrEqual(7.0);
      expect(getContrastRatio(textPrimary, surfaceBg)).toBeGreaterThanOrEqual(7.0);
    });

    it('text-secondary achieves WCAG AAA (>= 7.0:1) on canvas and surface', () => {
      expect(getContrastRatio(textSecondary, canvasBg)).toBeGreaterThanOrEqual(7.0);
      expect(getContrastRatio(textSecondary, surfaceBg)).toBeGreaterThanOrEqual(7.0);
    });

    it('text-muted achieves WCAG AAA (>= 7.0:1) on canvas', () => {
      expect(getContrastRatio(textMuted, canvasBg)).toBeGreaterThanOrEqual(7.0);
    });

    it('accent action blue achieves WCAG AAA (>= 7.0:1) on canvas and surface', () => {
      expect(getContrastRatio(accentBlue, canvasBg)).toBeGreaterThanOrEqual(7.0);
      expect(getContrastRatio(accentBlue, surfaceBg)).toBeGreaterThanOrEqual(7.0);
    });
  });

  describe('Dark Theme Tokens', () => {
    const canvasBg = '#09090b';
    const surfaceBg = '#121215';
    const textPrimary = '#fafafa';
    const textSecondary = '#d4d4d8';
    const textMuted = '#a1a1aa';
    const accentBlue = '#93c5fd';

    it('text-primary achieves WCAG AAA (>= 7.0:1) on canvas and surface', () => {
      expect(getContrastRatio(textPrimary, canvasBg)).toBeGreaterThanOrEqual(7.0);
      expect(getContrastRatio(textPrimary, surfaceBg)).toBeGreaterThanOrEqual(7.0);
    });

    it('text-secondary achieves WCAG AAA (>= 7.0:1) on canvas and surface', () => {
      expect(getContrastRatio(textSecondary, canvasBg)).toBeGreaterThanOrEqual(7.0);
      expect(getContrastRatio(textSecondary, surfaceBg)).toBeGreaterThanOrEqual(7.0);
    });

    it('text-muted achieves WCAG AAA (>= 7.0:1) on canvas and surface', () => {
      expect(getContrastRatio(textMuted, canvasBg)).toBeGreaterThanOrEqual(7.0);
      expect(getContrastRatio(textMuted, surfaceBg)).toBeGreaterThanOrEqual(7.0);
    });

    it('accent text achieves WCAG AAA (>= 7.0:1) on canvas and surface', () => {
      expect(getContrastRatio(accentBlue, canvasBg)).toBeGreaterThanOrEqual(7.0);
      expect(getContrastRatio(accentBlue, surfaceBg)).toBeGreaterThanOrEqual(7.0);
    });
  });

  describe('tokens.css Structure', () => {
    it('defines all CSS variables for :root and .dark without gradients', () => {
      const tokensCssPath = path.join(process.cwd(), 'src', 'styles', 'tokens.css');
      expect(fs.existsSync(tokensCssPath)).toBe(true);

      const content = fs.readFileSync(tokensCssPath, 'utf-8');
      expect(content).not.toContain('gradient');
      expect(content).toContain('--bg-canvas');
      expect(content).toContain('--bg-surface');
      expect(content).toContain('--bg-surface-hover');
      expect(content).toContain('--border-subtle');
      expect(content).toContain('--border-strong');
      expect(content).toContain('--text-primary');
      expect(content).toContain('--text-secondary');
      expect(content).toContain('--text-muted');
      expect(content).toContain('--accent-solid');
      expect(content).toContain('--accent-badge-bg');
      expect(content).toContain('--accent-badge-text');
    });
  });
});
