import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf-8');

const sheetCss = read('src/styles/sheet.css');
const accessibilityCss = read('src/styles/accessibility.css');

const keyframes = (name: string) =>
  sheetCss.match(new RegExp(`@keyframes\\s+${name}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? '';

describe('Sheet motion (scroll timelines and the one plotter pass)', () => {
  it('never fades text: opacity in a keyframe drops the reading band below 7:1', () => {
    // Measured on the built site: a mid-range opacity of 0.67 takes --annotate to
    // 3.59:1 on the sheet — and mid-range is exactly where the reading band is.
    for (const name of ['reveal-on-scroll', 'emphasis-on-scroll']) {
      expect(keyframes(name), `@keyframes ${name} not found in sheet.css`).not.toBe('');
      expect(keyframes(name), `${name} animates opacity`).not.toMatch(/opacity/);
    }
  });

  it('runs every animation once, and only under no-preference', () => {
    expect(sheetCss).not.toContain('infinite');
    expect(sheetCss).not.toMatch(/animation-iteration-count\s*:/);

    // Both motion blocks sit behind the no-preference query, so reduced motion
    // gets the finished document rather than a shortened animation.
    const gates = sheetCss.match(/@media \(prefers-reduced-motion: no-preference\)/g) ?? [];
    expect(gates.length).toBeGreaterThanOrEqual(2);
  });

  it('drives scrolling with native timelines, never a scroll listener', () => {
    expect(sheetCss).toContain('animation-timeline: view()');
    // Firefox falls back to a 0s duration and skips the animation entirely.
    expect(sheetCss.match(/animation-duration: 1ms/g)?.length).toBeGreaterThanOrEqual(1);

    const sources = fs
      .readdirSync(path.join(process.cwd(), 'src'), { recursive: true, encoding: 'utf-8' })
      .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'));
    const offenders = sources.filter((f) => /addEventListener\(\s*'scroll'/.test(read(path.join('src', f))));
    expect(offenders).toEqual([]);
  });

  it('suppresses motion, including view transitions, under prefers-reduced-motion', () => {
    expect(accessibilityCss).toContain('animation-timeline: none !important');
    expect(accessibilityCss).toContain('::view-transition-group(*)');
    expect(accessibilityCss).toContain('animation: none !important');
  });
});
