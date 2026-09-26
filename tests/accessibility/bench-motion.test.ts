import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf-8');

const benchCss = read('src/styles/bench.css');
const accessibilityCss = read('src/styles/accessibility.css');
const indexCss = read('src/styles/index.css');

const keyframes = (name: string) =>
  benchCss.match(new RegExp(`@keyframes\\s+${name}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? '';

describe('Bench motion (the one sweep, the develop reveal, and nothing else)', () => {
  it('holds exactly two authored moments, so motion cannot scatter', () => {
    const names = Array.from(benchCss.matchAll(/@keyframes\s+([a-z-]+)/g)).map((m) => m[1]);
    expect(names.sort()).toEqual(['develop', 'sweep']);
  });

  it('never fades text: the develop reveal clips, it does not dissolve', () => {
    // Measured on the built site: a mid-range opacity of 0.67 takes --annotate to
    // 3.61:1 on the bench — and mid-range is exactly where the reading band is.
    // The reveal is a clip-path on real captures only, so prose is never animated.
    expect(keyframes('develop'), '@keyframes develop not found in bench.css').not.toBe('');
    expect(keyframes('develop'), 'develop animates opacity').not.toMatch(/opacity/);
    expect(benchCss, 'the reveal is applied to images only').toContain('.develop');
  });

  it('animates nothing in index.css except the view-transition crossfade', () => {
    // The ban is on animated content: headings and prose are simply present. The
    // one exception is the view-transition snapshots, which accessibility.css
    // suppresses wholesale under reduced motion. index.css is read here because
    // the old .case-study-content rule animated opacity and a translate over
    // page content, and the keyframe check above — bench.css only — never saw it.
    const animated = Array.from(indexCss.matchAll(/([^{}]+)\{([^{}]*animation:[^{}]*)\}/g), (m) =>
      m[1].trim().split('\n').pop()!.trim(),
    );
    expect(animated.filter((selector) => !selector.includes('::view-transition'))).toEqual([]);
  });

  it('runs every animation once, and only under no-preference', () => {    expect(benchCss).not.toContain('infinite');
    expect(benchCss).not.toMatch(/animation-iteration-count\s*:/);

    // Both motion blocks sit behind the no-preference query, so reduced motion
    // gets the finished document rather than a shortened animation.
    const gates = benchCss.match(/@media \(prefers-reduced-motion: no-preference\)/g) ?? [];
    expect(gates.length).toBeGreaterThanOrEqual(2);
  });

  it('drives scrolling with native timelines, never a scroll listener', () => {
    expect(benchCss).toContain('animation-timeline: view()');
    // Firefox falls back to a 0s duration and skips the animation entirely.
    expect(benchCss.match(/animation-duration: 1ms/g)?.length).toBeGreaterThanOrEqual(1);
    // The sweep is transform-only, so nothing reflows while it runs.
    expect(keyframes('sweep')).toMatch(/transform:/);

    const sources = fs
      .readdirSync(path.join(process.cwd(), 'src'), { recursive: true, encoding: 'utf-8' })
      .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'));
    const offenders = sources.filter((f) => /addEventListener\(\s*'scroll'/.test(read(path.join('src', f))));
    expect(offenders).toEqual([]);
  });

  it('themes the browser surfaces the page did not draw', () => {
    expect(benchCss).toContain('::selection');
    expect(benchCss).toContain('caret-color');
    expect(benchCss).toContain('scrollbar-color');
    expect(benchCss).toContain('::-webkit-scrollbar-thumb');
  });

  it('suppresses motion, including view transitions, under prefers-reduced-motion', () => {
    expect(accessibilityCss).toContain('animation-timeline: none !important');
    expect(accessibilityCss).toContain('::view-transition-group(*)');
    expect(accessibilityCss).toContain('animation: none !important');
  });
});
