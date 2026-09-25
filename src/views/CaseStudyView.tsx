import React from 'react';
import { useParams } from 'react-router-dom';
import type { ProjectLinks } from '../data/types';
import { getProjectBySlug } from '../data/projects';
import { permalink, shortRef } from '../data/proof';
import { TransitionLink } from '../components/common/TransitionLink';
import { ContactBlock } from '../components/common/ContactBlock';
import { FeatureControlFrame } from '../components/sheet/FeatureControlFrame';
import { ProofArtifactView } from '../components/sheet/ProofArtifact';
import { SheetChain } from '../components/sheet/SheetChain';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

const REF_LABELS: Array<{ key: keyof ProjectLinks; label: string; name: (title: string) => string }> =
  [
    { key: 'demo', label: 'Live', name: (t) => `${t} live demo (opens in a new tab)` },
    { key: 'pypi', label: 'PyPI package', name: (t) => `${t} PyPI package (opens in a new tab)` },
    { key: 'video', label: 'Video demo', name: (t) => `${t} video walkthrough (opens in a new tab)` },
    { key: 'paper', label: 'IEEE paper', name: (t) => `${t} published IEEE paper (opens in a new tab)` },
  ];

const refLink =
  'font-mono text-[11px] uppercase tracking-widest text-annotate underline underline-offset-4 decoration-1 decoration-annotate hover:text-ink hover:decoration-ink rounded';

/** One part of the case study: a ruled block that the scroll pass brings forward. */
const Claim: React.FC<{
  id: string;
  heading: string;
  annotation?: string;
  children: React.ReactNode;
}> = ({ id, heading, annotation, children }) => (
  <section aria-labelledby={id} className="reveal relative pt-6">
    <span className="claim-rule" aria-hidden="true" />
    <h2
      id={id}
      className="text-xl sm:text-2xl font-semibold tracking-[-0.01em] text-pretty"
    >
      {heading}
    </h2>
    {annotation && (
      <p className="measure mt-2 font-mono text-[11px] leading-relaxed text-annotate">
        {annotation}
      </p>
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
  <div className="rule-thin pt-3">
    <h3 className="font-mono text-[10px] uppercase tracking-widest text-annotate">{title}</h3>
    <div className="measure mt-2 text-sm leading-relaxed">{children}</div>
  </div>
);

const Items: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="rule-thin pt-3 space-y-2">
    {items.map((item, i) => (
      <li key={i} className="measure flex gap-3 text-sm leading-relaxed">
        <span className="font-mono text-[11px] text-annotate shrink-0 pt-0.5" aria-hidden="true">
          {String(i + 1).padStart(2, '0')}
        </span>
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
      <div className="space-y-6 py-16 max-w-[52ch]">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.01em]">
          Project not found
        </h1>
        <p className="measure text-sm leading-relaxed">
          The project you are looking for does not exist or has been moved.
        </p>
        <p className="pt-2">
          <TransitionLink
            to="/projects"
            className="font-mono text-[11px] uppercase tracking-widest text-ink underline underline-offset-4 decoration-1 hover:decoration-2 rounded"
          >
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
        <TransitionLink
          to="/projects"
          className="font-mono text-[11px] uppercase tracking-widest text-annotate underline underline-offset-4 decoration-1 decoration-annotate hover:text-ink hover:decoration-ink rounded"
        >
          Back to projects
        </TransitionLink>
      </nav>

      <header
        style={{ viewTransitionName: `project-card-${project.slug}` }}
        className="space-y-6"
      >
        <FeatureControlFrame
          as="h1"
          nominal={project.title}
          tolerance={project.proofLine ?? project.metrics?.[0]?.label ?? project.timeline}
          datum={
            proof ? (
              <>
                {proof.repo}.{' '}
                <a
                  href={permalink(proof)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-1 hover:decoration-2 rounded"
                >
                  {shortRef(proof)} @ {proof.commit.slice(0, 7)}
                </a>
              </>
            ) : (
              `${project.role}, ${project.timeline}`
            )
          }
          conformance={proof ? 'verified' : 'asserted'}
        />

        <p className="measure text-base sm:text-lg leading-relaxed text-pretty">
          {project.subtitle}
        </p>

        {/* The header's own measurement row: who, when, and what it resolves to. */}
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-3 rule-thin pt-4">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-annotate">Role</dt>
            <dd className="mt-1 text-sm font-medium">{project.role}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-annotate">
              Timeline
            </dt>
            <dd className="mt-1 font-mono text-[13px]">{project.timeline}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-annotate">
              Subject
            </dt>
            <dd className="mt-1 font-mono text-[13px]">{project.categoryLabel}</dd>
          </div>
        </dl>

        {project.links.github && (
          <p>
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={refLink}
              aria-label={`${project.title} GitHub repository (opens in a new tab)`}
            >
              {project.links.github.replace('https://github.com/', '')}
            </a>
          </p>
        )}

        <p className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
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
          <div className="rule-thin pt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-annotate">
              Install
            </span>
            <span className="font-mono text-[13px] text-ink select-all">uvx lit-review-council</span>
            <button
              type="button"
              onClick={() => copyCli('uvx lit-review-council')}
              className="font-mono text-[11px] uppercase tracking-widest text-annotate underline underline-offset-4 decoration-1 hover:text-ink hover:decoration-ink rounded"
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
          <dl className="border-y border-ink divide-y divide-annotate">
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="flex flex-wrap items-baseline gap-x-4 py-2">
                <dt className="font-mono text-[15px] font-semibold shrink-0 w-40">
                  {metric.value}
                </dt>
                <dd className="measure text-sm leading-relaxed">{metric.label}</dd>
              </div>
            ))}
          </dl>
        )}

        <ul className="flex flex-wrap gap-x-3 gap-y-1">
          {project.tags.map((tag) => (
            <li key={tag} className="font-mono text-[11px] text-annotate">
              {tag}
            </li>
          ))}
        </ul>
      </header>

      {/* The artifact, at the sheet's full width, in the shape its proof type takes. */}
      {proof && <ProofArtifactView artifact={proof} className="pt-2" />}

      {cs ? (
        <div className="space-y-10">
          <Claim
            id="section-intuition"
            heading="Core intuition & friction"
            annotation={cs.intuition.summary}
          >
            <Pair
              left={
                <Note title="The spark and the initial hypothesis">{cs.intuition.spark}</Note>
              }
              right={
                <Note title="The naive failure mode">{cs.intuition.naiveFailureMode}</Note>
              }
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

          <Claim id="section-architecture" heading="Why built this way (architectural decisions & trade-offs)">
            <Note title="Key architectural insight">
              {cs.whyBuiltThisWay.architecturalInsight}
            </Note>

            <div className="space-y-0">
              {cs.whyBuiltThisWay.tradeOffs.map((tradeOff, idx) => (
                <div key={idx} className="rule-thin pt-3 pb-4">
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
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-annotate">
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
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-annotate">
                    Verification benchmarks
                  </h3>
                  <Items items={cs.outcomes.verification} />
                </div>
              }
              right={
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-annotate">
                    Real-world impact
                  </h3>
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
        <section className="rule-verified pt-4">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-annotate">
            Direct technical summary
          </h2>
          <p className="measure mt-2 text-sm leading-relaxed">{project.summary}</p>
        </section>
      )}

      <SheetChain
        currentSlug={project.slug}
        note="Your position on the chain"
        className="pt-2"
      />

      <ContactBlock />
    </article>
  );
};

export default CaseStudyView;
