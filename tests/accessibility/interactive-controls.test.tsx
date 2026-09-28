import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../../src/components/layout/AppLayout';
import { ContactBlock } from '../../src/components/common/ContactBlock';
import { CaseStudyView } from '../../src/views/CaseStudyView';
import { ProofArtifactView } from '../../src/components/bench/ProofArtifact';
import { projects } from '../../src/data/projects';
import type { ProofArtifact } from '../../src/data/types';

/**
 * Two ways an affordance can ignore the device it is on: a box that scrolls but
 * cannot be reached or announced, and a control too small to hit with a thumb.
 *
 * jsdom has no layout engine, so this cannot measure a rendered box — nothing
 * here proves a control *is* 44px, only that it carries the class that makes it
 * so, that the class is not overridden, and that the class still declares 44px.
 * The rendered figure is measured in a real browser against the built `dist/`.
 */

const sourceFiles = (): string[] =>
  fs
    .readdirSync(path.join(process.cwd(), 'src'), { recursive: true, encoding: 'utf-8' })
    .filter((f) => f.endsWith('.tsx'));

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf-8');

const renderLayout = () =>
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      initialEntries={['/']}
    >
      <AppLayout pageTitle="Overview">
        <ContactBlock />
      </AppLayout>
    </MemoryRouter>
  );

describe('Touch targets (WCAG 2.5.5)', () => {
  it('declares a 44px floor on the shared utility', () => {
    const rule =
      read('src/styles/accessibility.css').match(/\.touch-target\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(rule).toMatch(/min-height:\s*44px/);
    expect(rule).toMatch(/min-width:\s*44px/);
  });

  it('leaves the floor in exactly one place — no competing utility on the same element', () => {
    // `.touch-target` sits before `@tailwind utilities`, so a `min-h-*` utility on
    // the same element would silently win and shrink the control back down. The
    // scan is line-scoped, which is where every one of these classNames lives.
    const offenders: string[] = [];
    for (const f of sourceFiles()) {
      for (const line of read(path.join('src', f)).split('\n')) {
        if (!line.includes('touch-target')) continue;
        if (/\bmin-(h|w)-/.test(line)) offenders.push(`${f}: ${line.trim()}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('carries it on every mobile nav item', () => {
    renderLayout();
    const mobileNav = screen.getByRole('navigation', { name: 'Main' });
    const items = within(mobileNav).getAllByRole('link');
    expect(items).toHaveLength(3);
    for (const item of items) expect(item).toHaveClass('touch-target');
  });

  it('carries it on every copy button', () => {
    const { unmount } = renderLayout();
    const inLayout = screen.getAllByRole('button', { name: /^(copy|copy failed|copied)$/i });
    expect(inLayout.length).toBeGreaterThan(0);
    for (const button of inLayout) expect(button).toHaveClass('touch-target');

    // The case study's install block has one too — it is the same class of control
    // and the same finger, so it does not get to be missed by a layout-scoped test.
    unmount();
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        initialEntries={['/projects/lit-review-council']}
      >
        <Routes>
          <Route path="/projects/:slug" element={<CaseStudyView />} />
        </Routes>
      </MemoryRouter>
    );
    const onCaseStudy = screen.getAllByRole('button', { name: /^copy$/i });
    expect(onCaseStudy.length).toBeGreaterThan(0);
    for (const button of onCaseStudy) expect(button).toHaveClass('touch-target');
  });
});

describe('Scrollable proof blocks (WCAG 2.1.1, 4.1.2)', () => {
  const capture = projects.find((p) => p.proof?.kind === 'capture')!.proof!;

  const table: ProofArtifact = {
    ...capture,
    kind: 'table',
    quote: '| arm | precision |\n| --- | --- |\n| baseline | 23.3% |\n| verified | 43.8% |',
  };
  const trace: ProofArtifact = {
    ...capture,
    kind: 'trace',
    quote: 'await step.run("load", () => load());\nawait step.sendEvent("fan-out", e);',
  };

  for (const [kind, artifact] of [
    ['table', table],
    ['trace', trace],
    ['capture', capture],
  ] as const) {
    it(`makes every sideways scroller in a ${kind} reachable and named`, () => {
      // Traces do not scroll today; the loop is what keeps a later one honest.
      const { container } = render(<ProofArtifactView artifact={artifact} />);
      const scrollers = [...container.querySelectorAll('.overflow-x-auto')];

      for (const el of scrollers) {
        expect(el.getAttribute('tabindex')).toBe('0');
        expect(el.getAttribute('role')).toBe('region');
        // A region without a name is not announced as anything.
        expect(el.getAttribute('aria-label')).toBeTruthy();
      }
      if (kind !== 'trace') {
        expect(scrollers.length).toBeGreaterThan(0);
        expect(screen.getByRole('region', { name: /scrollable/i })).toBeInTheDocument();
      }
    });
  }
});
