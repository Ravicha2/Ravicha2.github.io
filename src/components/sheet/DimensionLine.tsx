import type React from 'react';
import { TransitionLink } from '../common/TransitionLink';

export interface DimensionInterval {
  to: string;
  /** The project slug, so the chain can mark where on it the visitor currently is. */
  slug: string;
  /** The datum reference for this interval, e.g. `P.01`. */
  ref: string;
  label: string;
  /** The measured value the interval is dimensioned to. */
  value: string;
  /** What that value measured, so the interval is never a bare figure. */
  note: string;
}

export interface DimensionLineProps {
  intervals: DimensionInterval[];
  /** The annotation that qualifies the chain, read at the left end of the line. */
  note: string;
  /** The interval the visitor is standing on, marked so the chain shows position. */
  currentSlug?: string;
  className?: string;
}

/**
 * One continuous chain across the sheet: the line, an extension rule at each
 * boundary, and each interval dimensioned to the value that measured it. Each
 * interval is a link, so the chain is also the route into the four case studies —
 * and because the same chain runs on every route, no route is an island.
 */
export const DimensionLine: React.FC<DimensionLineProps> = ({
  intervals,
  note,
  currentSlug,
  className = '',
}) => (
  <div className={className}>
    <p className="font-mono text-[10px] uppercase tracking-widest text-annotate mb-2">
      {note}
    </p>

    <div className="dimension plot" style={{ '--plot-delay': '260ms' } as React.CSSProperties} />

    <ol className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-ink border-b border-ink">
      {intervals.map((interval, i) => {
        const here = interval.slug === currentSlug;
        return (
          <li
            key={interval.to}
            className={`min-w-0 ${here ? 'border-t-[3px] border-ink -mt-[3px]' : ''}`}
          >
            <TransitionLink
              to={interval.to}
              aria-current={here ? 'page' : undefined}
              className={`block px-3 py-2.5 sm:py-3 h-full transition-colors ${
                here ? 'bg-panel' : 'hover:bg-panel'
              }`}
            >
              <span className="font-mono text-[10px] tracking-widest text-annotate block">
                {interval.ref}
              </span>
              <span className="block text-[13px] sm:text-sm font-medium leading-snug mt-0.5 text-pretty">
                {interval.label}
              </span>
              <span className="block font-mono text-[11px] leading-snug text-annotate mt-1.5">
                <span className="text-ink font-semibold">{interval.value}</span> {interval.note}
              </span>
              <span className="sr-only">
                {` — interval ${i + 1} of ${intervals.length}, open case study`}
              </span>
            </TransitionLink>
          </li>
        );
      })}
    </ol>
  </div>
);

export default DimensionLine;
