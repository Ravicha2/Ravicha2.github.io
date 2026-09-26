import type React from 'react';
import type { Project, ProjectLinks } from '../../data/types';
import { tierOf, type ProjectTier } from '../../data/projects';
import { permalink, shortRef } from '../../data/proof';
import { TransitionLink } from '../common/TransitionLink';

/** The row's rule, and the verdict it states: settled 2 px solid, in progress
 *  dashed, no reading at all a thin boundary. Matches `Reading`'s `mark` map. */
const TIER_MARK: Record<ProjectTier, string> = {
  settled: 'mark-clean',
  'in-progress': 'mark-claimed',
  supporting: 'mark-thin',
};

const REF_LABELS: Array<{ key: keyof ProjectLinks; label: string; name: (title: string) => string }> =
  [
    {
      key: 'demo',
      label: 'Live',
      name: (title) => `${title} live demo (opens in a new tab)`,
    },
    {
      key: 'pypi',
      label: 'PyPI',
      name: (title) => `${title} PyPI package (opens in a new tab)`,
    },
    {
      key: 'paper',
      label: 'IEEE paper',
      name: (title) => `${title} published IEEE paper (opens in a new tab)`,
    },
  ];

export interface BenchEntryProps {
  project: Project;
  /** The chain reference, e.g. `P.03`, so the catalog and the chain name it alike. */
  catalogRef: string;
  /** viewTransitionName, set only on the entry being navigated into. */
  viewTransitionName?: string;
}

/**
 * One catalog row. The tiers are told apart by what is present, not by a badge: a
 * settled row is ruled at full weight and carries one monochrome line of real
 * output plus the permalink that settles it; an in-progress row carries the same
 * line but takes the dashed claimed rule, because its figure is real and nothing
 * public settles it; a supporting row is a thin rule and stops at its own evidence.
 *
 * The row itself carries no handler — a real anchor stretched over it does the work,
 * which is what gives the row a keyboard equivalent.
 */
export const BenchEntry: React.FC<BenchEntryProps> = ({
  project,
  catalogRef,
  viewTransitionName,
}) => {
  const proof = project.proof;
  // The tier is the reading, not the link: a figure carried from a study with no
  // public artifact is still a real reading — it is just not settled, so the row
  // is dashed and the heading above it says so.
  const tier = tierOf(project);
  // A row carries a reading — and so a proof line — whenever it is not supporting.
  const carriesReading = tier !== 'supporting';

  const refLink =
    'relative font-mono text-[11px] text-annotate underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-signal';

  const primaryLink =
    'relative font-mono text-[11px] text-ink underline decoration-signal underline-offset-4 transition-colors hover:decoration-[3px]';

  return (
    <article
      data-testid={`project-card-${project.slug}`}
      data-tier={tier}
      style={viewTransitionName ? { viewTransitionName } : undefined}
      className={`relative cursor-pointer ${TIER_MARK[tier]} grid gap-x-5 gap-y-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] lg:grid-cols-[3rem_minmax(0,1fr)_19rem]`}
    >
      <p className="font-mono text-[11px] tracking-widest text-annotate pt-1">{catalogRef}</p>

      <div className="min-w-0 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-6 gap-y-1">
          <h2 className="text-lg sm:text-xl font-semibold tracking-[-0.01em] text-pretty">
            <TransitionLink
              to={`/projects/${project.slug}`}
              className="underline decoration-rule underline-offset-4 transition-colors hover:decoration-signal after:absolute after:inset-0 after:content-['']"
            >
              {project.title}
            </TransitionLink>
          </h2>
          <p className="font-mono text-[11px] text-annotate shrink-0">
            {project.categoryLabel}
            <span aria-hidden="true"> · </span>
            {project.timeline}
          </p>
        </div>

        <p className="measure text-sm leading-relaxed text-pretty">{project.summary}</p>

        <p className="font-mono text-[11px] text-annotate">{project.role}</p>

        <p className="pt-1 flex flex-wrap items-baseline gap-x-5 gap-y-1.5">
          <TransitionLink
            to={`/projects/${project.slug}`}
            className={primaryLink}
          >
            Read case study
          </TransitionLink>
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={refLink}
              aria-label={`${project.title} GitHub repository (opens in a new tab)`}
            >
              GitHub
            </a>
          )}
          {REF_LABELS.map(({ key, label, name }) =>
            project.links[key] ? (
              <a
                key={key}
                href={project.links[key]}
                target="_blank"
                rel="noopener noreferrer"
                className={refLink}
                aria-label={name(project.title)}
              >
                {label}
              </a>
            ) : null
          )}
        </p>

        <ul className="flex flex-wrap gap-x-3 gap-y-1 pt-0.5">
          {project.tags.map((tag) => (
            <li key={tag} className="font-mono text-[11px] text-annotate">
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {/* The measured column. Every value shows the label that makes it checkable. */}
      <div className="min-w-0 lg:pl-3 space-y-2">
        {project.metrics && project.metrics.length > 0 && (
          <dl className="space-y-1.5">
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="flex flex-wrap items-baseline gap-x-2">
                <dt className="font-mono text-[13px] font-semibold text-ink shrink-0">
                  {metric.value}
                </dt>
                <dd className="font-mono text-[11px] leading-snug text-annotate">
                  {metric.label}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {carriesReading && (
          <div className="pt-2 border-t border-rule space-y-1">
            <p className="font-mono text-[11px] leading-snug text-ink">{project.proofLine}</p>
            {proof && (
              <a
                href={permalink(proof)}
                target="_blank"
                rel="noopener noreferrer"
                className={refLink}
                aria-label={`Open the artifact settling ${project.title}: ${shortRef(proof)} at ${proof.commit.slice(0, 7)} (opens in a new tab)`}
              >
                {shortRef(proof)} @ {proof.commit.slice(0, 7)}
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default BenchEntry;
