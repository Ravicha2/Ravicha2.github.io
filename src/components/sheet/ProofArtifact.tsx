import type React from 'react';
import type { ProofArtifact as Artifact } from '../../data/types';
import { permalink, parseMarkdownTable, parseTrace, shortRef } from '../../data/proof';

const KIND_LABEL: Record<Artifact['kind'], string> = {
  table: 'Measured table',
  trace: 'Durable run, in order',
  capture: 'Source, as quoted',
};

/**
 * The mechanism itself, page-width and unboxed. Its shape follows its proof type:
 * a table is a real table, a trace renders as the run it describes, a capture is
 * the bytes verbatim. The reference above it is pinned to a commit, so the claim
 * and the thing that settles it cannot drift apart.
 */
export const ProofArtifactView: React.FC<{ artifact: Artifact; className?: string }> = ({
  artifact,
  className = '',
}) => {
  const { repo, commit, from, to, settles, quote, kind } = artifact;
  const href = permalink(artifact);

  return (
    <section aria-labelledby="proof-heading" className={`${className}`}>
      <div className="rule-verified pt-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
        <h2 id="proof-heading" className="font-mono text-[11px] uppercase tracking-widest text-ink">
          {KIND_LABEL[kind]}
        </h2>
        <p className="font-mono text-[11px] text-annotate">
          <span>{repo}</span>
          <span aria-hidden="true"> · </span>
          <span>{commit.slice(0, 7)}</span>
          <span aria-hidden="true"> · </span>
          <span>L{from}–L{to}</span>
        </p>
      </div>

      <p className="mt-3 text-sm sm:text-[15px] leading-relaxed max-w-[62ch]">{settles}</p>

      {kind === 'table' && <ProofTable quote={quote} caption={settles} />}
      {kind === 'trace' && <ProofTrace quote={quote} from={from} repo={repo} />}
      {kind === 'capture' && <ProofCapture quote={quote} />}

      <p className="mt-2.5">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${shortRef(artifact)} at ${commit.slice(0, 7)} on GitHub (opens in a new tab)`}
          className="font-mono text-xs text-ink underline underline-offset-4 decoration-1 hover:decoration-2"
        >
          {shortRef(artifact)} @ {commit.slice(0, 7)}
        </a>
      </p>
    </section>
  );
};

const ProofTable: React.FC<{ quote: string; caption: string }> = ({ quote, caption }) => {
  const { head, rows } = parseMarkdownTable(quote);

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-left font-mono text-[11px] sm:text-xs">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="rule-thin">
            {head.map((h, i) => (
              <th
                key={i}
                scope="col"
                className="py-2 pr-4 align-bottom font-medium text-annotate whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-t border-annotate">
              {row.map((c, i) => (
                <td
                  key={i}
                  className={`py-1.5 pr-4 align-top text-ink ${c.strong ? 'font-semibold' : ''}`}
                >
                  {c.text}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProofTrace: React.FC<{ quote: string; from: number; repo: string }> = ({
  quote,
  from,
  repo,
}) => {
  const steps = parseTrace(quote, from);

  return (
    <ol className="mt-4 border-t border-annotate">
      {steps.map((step, i) => (
        <li
          key={`${step.name}-${step.line}`}
          className="flex items-baseline gap-3 py-2 border-b border-annotate"
        >
          <span className="font-mono text-[11px] text-annotate w-7 shrink-0 tabular-nums">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="font-mono text-xs sm:text-[13px] text-ink break-all">
            {step.kind === 'sendEvent' ? `${step.name} ⇢` : step.name}
          </span>
          <span className="ml-auto font-mono text-[11px] text-annotate shrink-0">
            {repo.split('/')[1]}#L{step.line}
          </span>
        </li>
      ))}
    </ol>
  );
};

const ProofCapture: React.FC<{ quote: string }> = ({ quote }) => (
  <pre className="mt-4 overflow-x-auto py-3 border-y border-annotate font-mono text-[11px] sm:text-xs leading-relaxed text-ink">
    <code>{quote}</code>
  </pre>
);

export default ProofArtifactView;
