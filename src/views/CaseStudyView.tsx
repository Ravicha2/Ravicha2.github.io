import React from 'react';
import { useParams } from 'react-router-dom';
import type { ProjectLinks } from '../data/types';
import { getProjectBySlug } from '../data/projects';
import { permalink, shortRef } from '../data/proof';
import { TransitionLink } from '../components/common/TransitionLink';
import { ContactBlock } from '../components/common/ContactBlock';
import { Reading } from '../components/bench/Reading';
import { Capture } from '../components/bench/Capture';
import { ProofArtifactView } from '../components/bench/ProofArtifact';
import { ChannelStrip } from '../components/bench/ChannelStrip';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

const REF_LABELS: Array<{ key: keyof ProjectLinks; label: string; name: (title: string) => string }> =
  [
    { key: 'demo', label: 'Live', name: (t) => `${t} live demo (opens in a new tab)` },
    { key: 'pypi', label: 'PyPI', name: (t) => `${t} PyPI package (opens in a new tab)` },
    { key: 'video', label: 'Video', name: (t) => `${t} video walkthrough (opens in a new tab)` },
    { key: 'paper', label: 'IEEE paper', name: (t) => `${t} published IEEE paper (opens in a new tab)` },
  ];

const refLink =
  'font-mono text-[11px] text-annotate underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-signal';

const primaryRef =
  'font-mono text-[11px] text-ink underline decoration-signal underline-offset-4 transition-colors hover:decoration-[3px]';

/** One part of the case study: a ruled block. */
const Claim: React.FC<{
  id: string;
  heading: string;
  annotation?: string;
  children: React.ReactNode;
}> = ({ id, heading, annotation, children }) => (
  <section aria-labelledby={id} className="mark-thin pt-6">
    <h2 id={id} className="text-xl sm:text-2xl font-semibold tracking-[-0.015em] text-pretty">
      {heading}
    </h2>
    {annotation && (
      <p className="measure mt-2 text-[13px] leading-relaxed text-annotate">{annotation}</p>
    )}
    <div className="mt-5 space-y-6">{children}</div>
  </section>
);

/** Two ruled columns: what was claimed on the left, what that rests on on the right. */
const Pair: React.FC<{ left: React.ReactNode; right: React.ReactNode }> = ({ left, right }) => (
  <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
    {left}
    {right}
  </div>
);

const Note: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mark-thin pt-3">
    <h3 className="font-mono text-[11px] text-annotate">{title}</h3>
    <div className="measure mt-2 text-sm leading-relaxed">{children}</div>
  </div>
);

const Items: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="mark-thin pt-3 space-y-2">
    {items.map((item, i) => (
      <li key={i} className="measure flex gap-3 text-sm leading-relaxed">
        <span className="mt-[0.5em] w-[5px] h-[5px] shrink-0 bg-rule" aria-hidden="true" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export const CaseStudyView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const { state: cliCopyState, copy: copyCli } = useCopyToClipboard();

  if (!project) {
    return (
      <div className="space-y-6 py-16">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">
          Project not found
        </h1>
        <p className="measure text-sm leading-relaxed text-annotate">
          The project you are looking for does not exist or has been moved.
        </p>
        <p className="pt-2">
          <TransitionLink to="/projects" className={primaryRef}>
            Back to projects
          </TransitionLink>
        </p>
      </div>
    );
  }

  const cs = project.caseStudy;
  const proof = project.proof;

  return (
    <article className="space-y-12">
      <nav aria-label="Breadcrumb">
        <TransitionLink to="/projects" className={refLink}>
          Back to projects
        </TransitionLink>
      </nav>

      <header style={{ viewTransitionName: `project-card-${project.slug}` }} className="space-y-8">
        <Reading
          as="h1"
          id="case-heading"
          verdict={proof ? 'clean' : 'claimed'}
          measured={project.title}
          value={project.proofLine ?? project.metrics?.[0]?.label ?? project.timeline}
          datum={
            proof ? (
              <>
                {proof.repo}.{' '}
                <a
                  href={permalink(proof)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open the artifact settling ${project.title}: ${shortRef(proof)} at ${proof.commit.slice(0, 7)} (opens in a new tab)`}
                  className="text-signal underline decoration-rule underline-offset-4 transition-colors hover:decoration-signal"
                >
                  {shortRef(proof)} @ {proof.commit.slice(0, 7)}
                </a>
              </>
            ) : (
              `${project.role}, ${project.timeline}`
            )
          }
        />

        <p className="measure text-base sm:text-lg leading-relaxed text-pretty">
          {project.subtitle}
        </p>

        <p className="measure text-sm leading-relaxed text-annotate text-pretty">
          {project.summary}
        </p>

        {/* The header's own measurement row: who, when, and what it resolves to. */}
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-3 mark-thin pt-4">
          <div>
            <dt className="font-mono text-[11px] text-annotate">Role</dt>
            <dd className="mt-1 text-sm font-medium">{project.role}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] text-annotate">Timeline</dt>
            <dd className="mt-1 font-mono text-[13px]">{project.timeline}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] text-annotate">Subject</dt>
            <dd className="mt-1 font-mono text-[13px]">{project.categoryLabel}</dd>
          </div>
        </dl>

        <p className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={primaryRef}
              aria-label={`${project.title} GitHub repository (opens in a new tab)`}
            >
              {project.links.github.replace('https://github.com/', '')}
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

        {project.slug === 'lit-review-council' && (
          <div className="mark-thin pt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="font-mono text-[11px] text-annotate">Install</span>
            <span className="font-mono text-[13px] text-ink select-all">uvx lit-review-council</span>
            <button
              type="button"
              onClick={() => copyCli('uvx lit-review-council')}
              className={refLink}
            >
              <span aria-live="polite">
                {cliCopyState === 'copied'
                  ? 'Copied'
                  : cliCopyState === 'error'
                    ? 'Copy failed'
                    : 'Copy'}
              </span>
            </button>
          </div>
        )}

        {project.metrics && project.metrics.length > 0 && (
          <dl className="border-y border-rule divide-y divide-rule">
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="flex flex-wrap items-baseline gap-x-4 py-2.5">
                <dt className="font-mono text-[15px] font-semibold text-signal shrink-0 w-40">
                  {metric.value}
                </dt>
                <dd className="measure text-sm leading-relaxed">{metric.label}</dd>
              </div>
            ))}
          </dl>
        )}

        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag} className="chip font-mono text-[11px]">
              {tag}
            </li>
          ))}
        </ul>
      </header>

      {/* The artifact itself, before the prose: a real capture of the thing as it
          exists, then the bytes that settle the claim. */}
      {project.image && (
        <Capture
          src={project.image}
          width={project.imageWidth ?? 1440}
          height={project.imageHeight ?? 683}
          develop
          alt={project.imageAlt ?? `${project.title}, captured at its live state.`}
          source={project.imageCaption ?? project.title}
          readout={`${project.slug} · ${project.imageAlt ? 'mark' : 'captured'}`}
          href={project.links.github}
          linkLabel={`Open ${project.title} (opens in a new tab)`}
        />
      )}

      {proof && <ProofArtifactView artifact={proof} />}

      {cs ? (
        <div className="space-y-10">
          <Claim
            id="section-intuition"
            heading="Core intuition & friction"
            annotation={cs.intuition.summary}
          >
            <Pair
              left={<Note title="The spark and the initial hypothesis">{cs.intuition.spark}</Note>}
              right={<Note title="The naive failure mode">{cs.intuition.naiveFailureMode}</Note>}
            />
          </Claim>

          <Claim
            id="section-problem"
            heading="The root problem encountered"
            annotation={cs.problemEncountered.summary}
          >
            <Pair
              left={<Items items={cs.problemEncountered.edgeCases} />}
              right={<Items items={cs.problemEncountered.constraints} />}
            />
          </Claim>

          <Claim
            id="section-architecture"
            heading="Why built this way (architectural decisions & trade-offs)"
          >
            <Note title="Key architectural insight">
              {cs.whyBuiltThisWay.architecturalInsight}
            </Note>

            <div>
              {cs.whyBuiltThisWay.tradeOffs.map((tradeOff, idx) => (
                <div key={idx} className="mark-thin pt-3 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-6 gap-y-1">
                    <h3 className="text-[15px] font-semibold">{tradeOff.decision}</h3>
                    {tradeOff.vsAlternative && (
                      <span className="font-mono text-[11px] text-annotate shrink-0">
                        vs {tradeOff.vsAlternative}
                      </span>
                    )}
                  </div>
                  <p className="measure mt-2 text-sm leading-relaxed">{tradeOff.rationale}</p>
                </div>
              ))}
            </div>

            {cs.whyBuiltThisWay.guardrails && cs.whyBuiltThisWay.guardrails.length > 0 && (
              <div>
                <h3 className="font-mono text-[11px] text-annotate">
                  Guardrails and defensive design
                </h3>
                <Items items={cs.whyBuiltThisWay.guardrails} />
              </div>
            )}
          </Claim>

          <Claim id="section-outcomes" heading="Outcomes, verification & key takeaways">
            <Pair
              left={
                <div>
                  <h3 className="font-mono text-[11px] text-annotate">
                    Verification benchmarks
                  </h3>
                  <Items items={cs.outcomes.verification} />
                </div>
              }
              right={
                <div>
                  <h3 className="font-mono text-[11px] text-annotate">Real-world impact</h3>
                  <Items items={cs.outcomes.impact} />
                </div>
              }
            />

            <Note title="Core engineering takeaway">
              <span className="font-semibold">{cs.outcomes.takeaway}</span>
            </Note>
          </Claim>
        </div>
      ) : (
        <section className="mark-thin pt-6">
          <h2 className="font-mono text-[11px] text-annotate">Direct technical summary</h2>
          <p className="measure mt-2 text-sm leading-relaxed">{project.summary}</p>
        </section>
      )}

      <ChannelStrip currentSlug={project.slug} />

      <ContactBlock />
    </article>
  );
};

export default CaseStudyView;
