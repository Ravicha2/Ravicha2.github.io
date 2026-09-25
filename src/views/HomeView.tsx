import type React from 'react';
import { getProjectBySlug, projects } from '../data/projects';
import { permalink, shortRef } from '../data/proof';
import { profile } from '../data/profile';
import { workExperience, education } from '../data/experience';
import { FeatureControlFrame } from '../components/sheet/FeatureControlFrame';
import { SheetChain } from '../components/sheet/SheetChain';
import { TransitionLink } from '../components/common/TransitionLink';

/** The key to the sheet's line vocabulary. Stated once, on the overview. */
const LEGEND = [
  {
    rule: 'rule-verified',
    weight: 'Solid',
    meaning: 'Verified — the artifact is in the repository at the pinned commit.',
  },
  {
    rule: 'rule-asserted',
    weight: 'Dashed',
    meaning: 'Asserted — stated, and not yet measured.',
  },
  {
    rule: 'rule-failed',
    weight: 'Heavy double',
    meaning: 'Failed — measured, and does not conform.',
  },
];

export const HomeView: React.FC = () => {
  // The first viewport already carries one live permalink to real bytes. Shepherd's
  // benchmark is the strongest measured claim on the sheet, so the hero's datum
  // resolves to the table that produced it.
  const shepherd = getProjectBySlug('shepherd');
  const datum = shepherd?.proof;

  const currentWork = workExperience.find((w) => w.isCurrent) ?? workExperience[0];
  const currentWorkLabel = currentWork?.isCurrent ? 'Active' : 'Most recent';
  const primaryEducation = education[0];

  return (
    <div className="space-y-12">
      {/* First viewport: the claim, the tolerance it holds, and its datum. */}
      <section aria-labelledby="hero-claim">
        <p className="font-mono text-[10px] uppercase tracking-widest text-annotate">
          {profile.name}
          <span aria-hidden="true"> · </span>
          Sheet 01 of 04
          <span aria-hidden="true"> · </span>
          {profile.location}
        </p>

        <FeatureControlFrame
          as="h1"
          id="hero-claim"
          className="mt-4"
          nominal="Fault-tolerant agentic systems, measured."
          tolerance={
            <>
              17 of 21 gold violations detected exactly on the home-assistant graph ·
              88,508 nodes · 4-repo false positives 66 → 33
            </>
          }
          datum={
            datum ? (
              <>
                Shepherd benchmark.{' '}
                <a
                  href={permalink(datum)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open the Shepherd benchmark table at ${datum.commit.slice(0, 7)} (opens in a new tab)`}
                  className="underline underline-offset-4 decoration-1 hover:decoration-2 rounded"
                >
                  {shortRef(datum)} @ {datum.commit.slice(0, 7)}
                </a>
              </>
            ) : (
              'Shepherd benchmark'
            )
          }
        />

        <p className="measure mt-5 text-sm sm:text-base leading-relaxed text-pretty">
          {profile.headline}
        </p>

        <p className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <TransitionLink
            to="/projects"
            className="font-mono text-[11px] uppercase tracking-widest text-ink underline underline-offset-4 decoration-1 hover:decoration-2 rounded"
          >
            Explore projects
          </TransitionLink>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Palm's GitHub profile (opens in a new tab)"
            className="font-mono text-[11px] uppercase tracking-widest text-annotate underline underline-offset-4 decoration-1 decoration-annotate hover:text-ink hover:decoration-ink rounded"
          >
            GitHub
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Palm's LinkedIn profile (opens in a new tab)"
            className="font-mono text-[11px] uppercase tracking-widest text-annotate underline underline-offset-4 decoration-1 decoration-annotate hover:text-ink hover:decoration-ink rounded"
          >
            LinkedIn
          </a>
          <a
            href={profile.links.email}
            aria-label="Send email to Palm"
            className="font-mono text-[11px] uppercase tracking-widest text-annotate underline underline-offset-4 decoration-1 decoration-annotate hover:text-ink hover:decoration-ink rounded"
          >
            Email
          </a>
        </p>

        <p className="measure mt-4 text-sm leading-relaxed text-annotate">
          {profile.title}
          <span aria-hidden="true"> · </span>
          {profile.status}
        </p>

        <SheetChain className="mt-9" />
      </section>

      {/* The key to the notation. Without it the sheet is a drawing nobody can read. */}
      <section aria-labelledby="legend-heading" className="rule-verified pt-4">
        <h2
          id="legend-heading"
          className="font-mono text-[10px] uppercase tracking-widest text-annotate"
        >
          How a claim is marked
        </h2>
        <dl className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-3">
          {LEGEND.map((entry) => (
            <div key={entry.weight}>
              <dt className="flex items-center gap-3">
                <span className={`block w-14 ${entry.rule}`} aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink">
                  {entry.weight}
                </span>
              </dt>
              <dd className="measure mt-1.5 text-[13px] leading-relaxed text-annotate">
                {entry.meaning}
              </dd>
            </div>
          ))}
        </dl>
        <p className="measure mt-4 font-mono text-[11px] leading-relaxed text-annotate">
          Line weight and style carry the verdict. The one hue on this sheet is inspection
          red, and it appears only on a claim that failed.
        </p>
      </section>

      {/* System context, as ruled entries rather than a pair of cards. */}
      <section aria-labelledby="context-heading">
        <h2
          id="context-heading"
          className="rule-verified pt-3 font-mono text-[10px] uppercase tracking-widest text-annotate"
        >
          System context
        </h2>

        <dl className="mt-4 divide-y divide-ink border-b border-ink">
          {currentWork && (
            <div className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="font-mono text-[11px] uppercase tracking-widest text-annotate">
                {currentWorkLabel}
              </dt>
              <dd className="min-w-0">
                <span className="block text-[15px] font-semibold">{currentWork.role}</span>
                <span className="block font-mono text-[11px] text-annotate mt-0.5">
                  {currentWork.company}
                  <span aria-hidden="true"> · </span>
                  {currentWork.period}
                </span>
                <span className="measure block mt-2 text-sm leading-relaxed">
                  {currentWork.description[0]}
                </span>
              </dd>
            </div>
          )}

          {primaryEducation && (
            <div className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="font-mono text-[11px] uppercase tracking-widest text-annotate">
                Formation
              </dt>
              <dd className="min-w-0">
                <span className="block text-[15px] font-semibold">{primaryEducation.degree}</span>
                <span className="block font-mono text-[11px] text-annotate mt-0.5">
                  {primaryEducation.institution}
                  {primaryEducation.grade && (
                    <>
                      <span aria-hidden="true"> · </span>
                      {primaryEducation.grade}
                    </>
                  )}
                </span>
                <span className="measure block mt-2 text-sm leading-relaxed">
                  {primaryEducation.details[2] || primaryEducation.details[0]}
                </span>
              </dd>
            </div>
          )}
        </dl>

        <p className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <TransitionLink
            to="/projects"
            className="font-mono text-[11px] uppercase tracking-widest text-ink underline underline-offset-4 decoration-1 hover:decoration-2 rounded"
          >
            All {projects.length} projects
          </TransitionLink>
          <TransitionLink
            to="/experience"
            className="font-mono text-[11px] uppercase tracking-widest text-ink underline underline-offset-4 decoration-1 hover:decoration-2 rounded"
          >
            Full experience
          </TransitionLink>
        </p>
      </section>
    </div>
  );
};

export default HomeView;
