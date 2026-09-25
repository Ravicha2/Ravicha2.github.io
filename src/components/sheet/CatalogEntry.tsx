import type React from 'react';
import type { Project, ProjectLinks } from '../../data/types';
import { permalink, shortRef } from '../../data/proof';
import { TransitionLink } from '../common/TransitionLink';

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
      key: 'video',
      label: 'Video',
      name: (title) => `${title} video walkthrough (opens in a new tab)`,
    },
    {
      key: 'paper',
      label: 'IEEE paper',
      name: (title) => `${title} published IEEE paper (opens in a new tab)`,
    },
  ];

export interface CatalogEntryProps {
  project: Project;
  /** The chain reference, e.g. `P.03`, so the catalog and the chain name it alike. */
  sheetRef: string;
  /** viewTransitionName, set only on the entry being navigated into. */
  viewTransitionName?: string;
}

/**
 * One catalog row. The two tiers are told apart by what is present, not by a badge:
 * a flagship row is ruled at full weight and carries one monochrome line of real
 * output with the permalink that settles it; a supporting row is a thin rule and
 * stops at its repository.
 *
 * The row itself carries no handler — a real anchor stretched over it does the work,
 * which is what gives the row a keyboard equivalent.
 */
export const CatalogEntry: React.FC<CatalogEntryProps> = ({
  project,
  sheetRef,
  viewTransitionName,
}) => {
  const proof = project.proof;
  const flagship = Boolean(proof && project.proofLine);

  const refLink =
    'relative font-mono text-[11px] uppercase tracking-widest text-annotate underline underline-offset-4 decoration-1 decoration-annotate hover:text-ink hover:decoration-ink rounded';

  return (
    <article
      data-testid={`project-card-${project.slug}`}
      data-tier={flagship ? 'flagship' : 'supporting'}
      style={viewTransitionName ? { viewTransitionName } : undefined}
      className={`relative cursor-pointer ${flagship ? 'rule-verified' : 'rule-thin'} grid gap-x-5 gap-y-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] lg:grid-cols-[3rem_minmax(0,1fr)_19rem]`}
    >
      <p className="font-mono text-[11px] tracking-widest text-annotate pt-1">{sheetRef}</p>

      <div className="min-w-0 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-6 gap-y-1">
          <h2 className="text-lg sm:text-xl font-semibold tracking-[-0.01em] text-pretty">
            <TransitionLink
              to={`/projects/${project.slug}`}
              className="rounded underline underline-offset-4 decoration-1 hover:decoration-2 transition-[text-decoration-thickness] after:absolute after:inset-0 after:content-['']"
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
            className="relative font-mono text-[11px] uppercase tracking-widest text-ink underline underline-offset-4 decoration-1 hover:decoration-2 rounded"
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

        {flagship && proof && (
          <div className="pt-2 border-t border-annotate space-y-1">
            <p className="font-mono text-[11px] leading-snug text-ink">{project.proofLine}</p>
            <a
              href={permalink(proof)}
              target="_blank"
              rel="noopener noreferrer"
              className={refLink}
              aria-label={`Open the artifact settling ${project.title}: ${shortRef(proof)} at ${proof.commit.slice(0, 7)} (opens in a new tab)`}
            >
              {shortRef(proof)} @ {proof.commit.slice(0, 7)}
            </a>
          </div>
        )}
      </div>
    </article>
  );
};

export default CatalogEntry;
