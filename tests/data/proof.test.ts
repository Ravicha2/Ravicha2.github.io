import { describe, it, expect } from 'vitest';
import { permalink, shortRef, parseMarkdownTable, parseTrace } from '../../src/data/proof';
import type { ProofArtifact } from '../../src/data/types';
import { projects } from '../../src/data/projects';

const SHA = 'e4d177fb173631f378010f416dc9ae18b3eb32ec';

const artifact: ProofArtifact = {
  kind: 'table',
  repo: 'Ravicha2/Shepherd',
  commit: SHA,
  path: 'benchmark/reports/AGGREGATE.md',
  from: 41,
  to: 48,
  settles: 'The detections hold on the full graph, not a sample.',
  quote: '| repository | exact |',
};

describe('permalink', () => {
  it('pins the line range to the commit SHA, never to a branch', () => {
    expect(permalink(artifact)).toBe(
      `https://github.com/Ravicha2/Shepherd/blob/${SHA}/benchmark/reports/AGGREGATE.md#L41-L48`
    );
  });

  it('collapses a single-line range to one line anchor', () => {
    expect(permalink({ ...artifact, to: 41 })).toContain('#L41');
  });

  it('writes a short reference that keeps the file and the lines', () => {
    expect(shortRef(artifact)).toBe('AGGREGATE.md#L41-L48');
  });
});

describe('every shipped artifact', () => {
  it('is a real 40-hex commit, a real path, and a resolvable line range', () => {
    const proofs = projects.map((p) => p.proof).filter(Boolean);

    expect(proofs.length).toBeGreaterThan(0);
    for (const proof of proofs) {
      expect(proof!.commit, `${proof!.repo} commit is not a SHA`).toMatch(/^[0-9a-f]{40}$/);
      expect(proof!.from).toBeGreaterThan(0);
      expect(proof!.to).toBeGreaterThanOrEqual(proof!.from);
      expect(proof!.quote.trim().length).toBeGreaterThan(0);
      expect(permalink(proof!)).toContain(`/blob/${proof!.commit}/`);
    }
  });
});

describe('parseMarkdownTable', () => {
  it('reads the separator as structure and drops it', () => {
    const parsed = parseMarkdownTable(
      [
        '| repository | exact | partial | miss |',
        '|---|---|---|---|',
        '| home-assistant | 17 | 0 | 4 |',
        '| **4-repo total** | **33** | **0** | **31** |',
      ].join('\n')
    );

    expect(parsed.head).toEqual(['repository', 'exact', 'partial', 'miss']);
    expect(parsed.rows).toHaveLength(2);
    expect(parsed.rows[0].map((c) => c.text)).toEqual(['home-assistant', '17', '0', '4']);
    expect(parsed.rows[1][0]).toEqual({ text: '4-repo total', strong: true });
    expect(parsed.rows[1][1].strong).toBe(true);
  });

  it('tolerates a table with no separator row', () => {
    const parsed = parseMarkdownTable('| a | b |\n| 1 | 2 |');
    expect(parsed.rows).toEqual([[{ text: '1', strong: false }, { text: '2', strong: false }]]);
  });

  it('unwraps a bolded header cell without leaving the asterisks in', () => {
    const parsed = parseMarkdownTable('| **metric** | value |\n|---|---|\n| x | 1 |');
    expect(parsed.head).toEqual(['metric', 'value']);
  });
});

describe('parseTrace', () => {
  it('orders the durable steps as they run, at their real line numbers', () => {
    const quote = [
      'const a = await step.run("extract-chunks", async () => {',
      '  return chunk();',
      '});',
      'await step.sendEvent("dispatch-parallel-jobs", events);',
      'const b = await step.run("embed", () => {});',
    ].join('\n');

    expect(parseTrace(quote, 24)).toEqual([
      { kind: 'run', name: 'extract-chunks', line: 24 },
      { kind: 'sendEvent', name: 'dispatch-parallel-jobs', line: 27 },
      { kind: 'run', name: 'embed', line: 28 },
    ]);
  });

  it('reads a step name written with backticks, and ignores non-step calls', () => {
    const quote = ['await fetch(url);', 'const r = await step.run(`tally`, fn);'].join('\n');
    expect(parseTrace(quote, 1)).toEqual([{ kind: 'run', name: 'tally', line: 2 }]);
  });

  it('finds every shipped trace step inside the range it was pinned to', () => {
    for (const project of projects) {
      const proof = project.proof;
      if (proof?.kind !== 'trace') continue;

      const steps = parseTrace(proof.quote, proof.from);
      expect(steps.length, `${project.slug} trace has no steps`).toBeGreaterThan(0);
      for (const step of steps) {
        expect(step.line).toBeGreaterThanOrEqual(proof.from);
        expect(step.line).toBeLessThanOrEqual(proof.to);
      }
    }
  });
});
