import type { ProofArtifact } from './types';

/**
 * A permalink to the exact bytes quoted, pinned to the commit they were read at.
 * `#L41` alone is not a permalink: on a branch it resolves to whatever that file
 * says today, which is not what the claim was measured against.
 */
export function permalink({ repo, commit, path, from, to }: ProofArtifact): string {
  const range = from === to ? `L${from}` : `L${from}-L${to}`;
  return `https://github.com/${repo}/blob/${commit}/${path}#${range}`;
}

/** The same reference, written short enough to sit in a margin: `path#L16-L26`. */
export function shortRef({ path, from, to }: ProofArtifact): string {
  const file = path.split('/').pop() ?? path;
  return from === to ? `${file}#L${from}` : `${file}#L${from}-L${to}`;
}

export interface TableCell {
  text: string;
  /** `**bold**` in the source: the aggregate row, or a row's worst case. */
  strong: boolean;
}

export interface MarkdownTable {
  head: string[];
  rows: TableCell[][];
}

const cell = (raw: string): TableCell => {
  const text = raw.trim();
  const strong = /^\*\*.+\*\*$/.test(text);
  return { text: strong ? text.slice(2, -2) : text, strong };
};

/**
 * A quoted markdown table rendered as a real table. Reads the `|---|` separator
 * as structure and drops it; leaves every other row exactly as quoted.
 */
export function parseMarkdownTable(quote: string): MarkdownTable {
  const lines = quote
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const split = (line: string) =>
    line
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim());

  const [header, ...rest] = lines;
  const rows = /^\|?[\s:|-]+\|?$/.test(rest[0] ?? '') ? rest.slice(1) : rest;

  return {
    head: split(header).map((h) => h.replace(/^\*\*|\*\*$/g, '')),
    rows: rows.map((line) => split(line).map(cell)),
  };
}

export interface TraceStep {
  /** `run` is a durable step; `sendEvent` fans work out to the next function. */
  kind: 'run' | 'sendEvent';
  name: string;
  /** 1-based line of this call in the file the artifact is pinned to. */
  line: number;
}

const STEP_CALL = /step\.(run|sendEvent)\(\s*[`'"]([^`'"]+)[`'"]/g;

/**
 * An ordered run of the durable steps a quoted excerpt actually calls, with each
 * call's real line number in the pinned file. Ordered by appearance, so the trace
 * reads as the run does.
 */
export function parseTrace(quote: string, from: number): TraceStep[] {
  const steps: TraceStep[] = [];
  quote.split('\n').forEach((text, index) => {
    STEP_CALL.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = STEP_CALL.exec(text)) !== null) {
      steps.push({
        kind: m[1] as TraceStep['kind'],
        name: m[2],
        line: from + index,
      });
    }
  });
  return steps;
}
