import type React from 'react';

/**
 * A reading: what was measured, the value it came back with, and the datum it was
 * read at. The mark's weight and style encode the verdict, but the verdict is
 * also written in words, so the state never rides on a visual channel alone.
 */
export type Verdict = 'clean' | 'claimed' | 'in-progress' | 'failed';

const VERDICT: Record<Verdict, { mark: string; word: string; value: string }> = {
  clean: { mark: 'mark-clean', word: 'Measured · holds', value: 'text-signal' },
  claimed: { mark: 'mark-claimed', word: 'Claimed · not yet measured', value: 'text-ink' },
  // Measured and still moving: the reading is real, the work is not finished, and
  // no public artifact settles it yet. Distinct from `claimed` (not measured at
  // all) and from `clean` (settled by an artifact anyone can open).
  'in-progress': { mark: 'mark-claimed', word: 'In progress · not yet settled', value: 'text-ink' },
  failed: { mark: 'mark-failed', word: 'Measured · does not hold', value: 'text-nonconform' },
};

export interface ReadingProps {
  /** What was measured. */
  measured: React.ReactNode;
  /** The number, or the state, that came back. */
  value: React.ReactNode;
  /** Where the reading was taken: the artifact, and the commit it was read at. */
  datum: React.ReactNode;
  verdict?: Verdict;
  /** Heading level, so a reading can carry a page's h1. */
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
}

export const Reading: React.FC<ReadingProps> = ({
  measured,
  value,
  datum,
  verdict = 'clean',
  as: Heading = 'h2',
  id,
  className = '',
}) => {
  const state = VERDICT[verdict];

  return (
    <div
      className={`${state.mark} ${className} pt-3 grid gap-x-8 gap-y-3 lg:grid-cols-[minmax(0,1fr)_20rem]`}
      data-verdict={verdict}
    >
      <Heading id={id} className="text-xl sm:text-2xl font-semibold tracking-[-0.015em] text-pretty">
        {measured}
      </Heading>

      <dl className="min-w-0 space-y-1.5">
        <div>
          <dt className="sr-only">Reading</dt>
          <dd className={`font-mono text-[13px] sm:text-sm leading-snug ${state.value}`}>
            {value}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Datum</dt>
          <dd className="font-mono text-[11px] leading-snug text-annotate">{datum}</dd>
        </div>
        <div>
          <dt className="sr-only">Verdict</dt>
          <dd className="font-mono text-[10px] uppercase tracking-[0.14em] text-annotate">
            {state.word}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default Reading;
