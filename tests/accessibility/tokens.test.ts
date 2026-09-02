import { describe, it, expect } from 'vitest';

// Relative luminance calculation per WCAG 2.1 specifications
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
