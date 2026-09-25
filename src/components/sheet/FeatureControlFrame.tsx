import type React from 'react';

/**
 * The claim grammar: a nominal, the tolerance it must hold, and the datum it was
 * measured against. The frame's rule weight and style encode the verdict, but the
 * verdict is also written in words inside the frame, so the state never rides on a
 * visual channel alone.
 */
export type Conformance = 'verified' | 'asserted' | 'failed';

const STATE: Record<Conformance, { rule: string; word: string }> = {
  verified: { rule: 'rule-verified', word: 'CONFORMS' },
  asserted: { rule: 'rule-asserted', word: 'ASSERTED' },
  failed: { rule: 'rule-failed', word: 'NONCONFORMING' },
};

export interface FeatureControlFrameProps {
  /** What is being claimed. The nominal. */
  nominal: React.ReactNode;
  /** The tolerance it must hold, and the measurement that decides it. */
  tolerance: React.ReactNode;
  /** The datum it was measured against: where the measurement came from. */
  datum: React.ReactNode;
  conformance?: Conformance;
  /** Heading level for the nominal, so the frame can carry a page's h1. */
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
}

export const FeatureControlFrame: React.FC<FeatureControlFrameProps> = ({
  nominal,
  tolerance,
  datum,
  conformance = 'verified',
  as: Heading = 'h2',
  id,
  className = '',
}) => {
  const state = STATE[conformance];

  return (
    <div className={`${state.rule} ${className}`} data-conformance={conformance}>
      <div className="flex flex-col sm:flex-row sm:items-stretch divide-y sm:divide-y-0 sm:divide-x divide-ink">
        <Heading
          id={id}
          className="flex-1 px-3 py-2.5 sm:py-3 text-lg sm:text-2xl font-semibold tracking-[-0.01em] text-pretty"
        >
          {nominal}
        </Heading>

        <div className="px-3 py-2.5 sm:w-[15rem] sm:shrink-0 flex flex-col justify-center gap-0.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-annotate">
            Tolerance
          </span>
          <span className="font-mono text-xs sm:text-[13px] leading-snug text-ink">
            {tolerance}
          </span>
        </div>

        <div className="px-3 py-2.5 sm:w-[13rem] sm:shrink-0 flex flex-col justify-center gap-0.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-annotate">
            Datum
          </span>
          <span className="font-mono text-xs sm:text-[13px] leading-snug text-ink">
            {datum}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-annotate mt-0.5">
            {state.word}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeatureControlFrame;
