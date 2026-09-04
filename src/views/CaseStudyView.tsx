import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Activity,
  Terminal,
  FileText,
  Video,
  Lightbulb,
  AlertTriangle,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Cpu,
  Copy,
  Check,
} from 'lucide-react';
import { getProjectBySlug } from '../data/projects';
import { TransitionLink } from '../components/common/TransitionLink';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const CaseStudyView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const [copiedCli, setCopiedCli] = useState(false);

  const handleCopyCli = () => {
    navigator.clipboard.writeText('uvx lit-review-council');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  if (!project) {
    return (
      <div className="space-y-6 py-16 text-center max-w-lg mx-auto">
        <div className="inline-flex p-3.5 rounded-lg bg-surface border border-border-subtle text-text-muted">
          <AlertTriangle className="w-8 h-8 text-accent-solid" aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          Project Not Found
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          The project you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4">
          <TransitionLink
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-accent-solid text-white dark:text-zinc-950 text-sm font-semibold hover:bg-opacity-90 active:scale-[0.99] transition-all focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Projects</span>
          </TransitionLink>
        </div>
      </div>
    );
  }

  const cs = project.caseStudy;

  return (
    <article className="space-y-12">
      {/* Top Breadcrumbs & Back Navigation */}
      <nav aria-label="Breadcrumb">
        <TransitionLink
          to="/projects"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-accent-solid hover:underline focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded px-1 py-0.5"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          <span>Back to Projects</span>
        </TransitionLink>
      </nav>

      {/* Case Study Header / Hero */}
      <header
        style={{ viewTransitionName: `project-card-${project.slug}` }}
        className="space-y-6 border-b border-border-subtle pb-8"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-accent-badge-bg text-accent-badge-text border border-border-subtle">
            {project.categoryLabel}
          </span>
          <span className="text-xs font-mono text-text-muted">{project.timeline}</span>
          {project.featured && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-surface-hover text-text-muted border border-border-subtle font-medium">
              Flagship Deep Dive
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-tight">
            {project.title}
          </h1>
          <p className="text-lg sm:text-xl text-accent-solid font-semibold">
            {project.subtitle}
          </p>
        </div>

        <p className="text-base sm:text-lg text-text-secondary max-w-3xl leading-relaxed">
          {project.summary}
        </p>

        {/* PyPI Quick Install Command Box (if applicable) */}
        {project.slug === 'lit-review-council' && (
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-lg bg-surface border border-border-subtle font-mono text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-accent-solid" aria-hidden="true" />
              <span className="text-text-muted select-none">$</span>
              <span className="text-text-primary font-semibold">uvx lit-review-council</span>
            </div>
            <button
              type="button"
              onClick={handleCopyCli}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-canvas border border-border-subtle text-text-secondary hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              aria-label="Copy CLI command to clipboard"
            >
              {copiedCli ? (
                <>
                  <Check className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                  <span className="text-accent-solid">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Metadata Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-lg bg-surface border border-border-subtle">
          <div>
            <span className="text-[11px] font-mono font-medium text-text-muted block">
              Role & Context
            </span>
            <span className="text-xs font-semibold text-text-primary mt-1 block">
              {project.role}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono font-medium text-text-muted block">
              Timeline
            </span>
            <span className="text-xs font-mono text-text-primary mt-1 block">
              {project.timeline}
            </span>
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <span className="text-[11px] font-mono font-medium text-text-muted block">
              Key Artifacts & Links
            </span>
            <div className="flex items-center gap-2 flex-wrap mt-1.5">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-canvas border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-canvas border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </a>
              )}
              {project.links.pypi && (
                <a
                  href={project.links.pypi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-canvas border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>PyPI Package</span>
                </a>
              )}
              {project.links.video && (
                <a
                  href={project.links.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-canvas border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Demo</span>
                </a>
              )}
              {project.links.paper && (
                <a
                  href={project.links.paper}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-canvas border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>IEEE Paper</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tech Stack Pills */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-medium text-text-muted block">
            Technology Stack & Tools
          </span>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-surface text-text-secondary border border-border-subtle"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Highlight Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-medium text-text-muted block">
              Key Metrics & Milestones
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {project.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-md bg-canvas border border-border-subtle text-xs font-mono text-text-secondary"
                >
                  <Activity className="w-3.5 h-3.5 text-accent-solid flex-shrink-0" aria-hidden="true" />
                  <span>{metric}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* 4-Part Case Study Content */}
      {cs ? (
        <div className="space-y-12">
          {/* Part 1: Core Intuition & Friction */}
          <section
            aria-labelledby="section-intuition"
            className="space-y-4 border-b border-border-subtle pb-8"
          >
            <h2
              id="section-intuition"
              className="text-2xl font-bold tracking-tight text-text-primary"
            >
              Core Intuition & Friction
            </h2>
            {cs.intuition.summary && (
              <p className="text-sm font-medium text-text-muted italic leading-relaxed">
                "{cs.intuition.summary}"
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* The Spark */}
              <div className="p-5 rounded-lg bg-surface border border-border-subtle space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono text-text-primary">
                  <Lightbulb className="w-4 h-4 text-accent-solid" aria-hidden="true" />
                  <span className="font-semibold">The Spark & Initial Hypothesis</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {cs.intuition.spark}
                </p>
              </div>

              {/* The Naive Failure Mode */}
              <div className="p-5 rounded-lg bg-surface border border-border-subtle space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono text-text-primary">
                  <AlertTriangle className="w-4 h-4 text-accent-solid" aria-hidden="true" />
                  <span className="font-semibold">The Naive Failure Mode</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {cs.intuition.naiveFailureMode}
                </p>
              </div>
            </div>
          </section>

          {/* Part 2: The Root Problem Encountered */}
          <section
            aria-labelledby="section-problem"
            className="space-y-4 border-b border-border-subtle pb-8"
          >
            <h2
              id="section-problem"
              className="text-2xl font-bold tracking-tight text-text-primary"
            >
              The Root Problem Encountered
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl">
              {cs.problemEncountered.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Edge Cases & Failure Points */}
              <div className="p-5 rounded-lg bg-surface border border-border-subtle space-y-3">
                <h3 className="text-xs font-mono font-semibold text-text-primary flex items-center gap-2 border-b border-border-subtle pb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                  <span>Edge Cases & Failure Points</span>
                </h3>
                <ul className="space-y-2">
                  {cs.problemEncountered.edgeCases.map((edgeCase, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-mono text-text-secondary leading-relaxed">
                      <span className="text-accent-solid font-bold select-none">›</span>
                      <span>{edgeCase}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hard Constraints */}
              <div className="p-5 rounded-lg bg-surface border border-border-subtle space-y-3">
                <h3 className="text-xs font-mono font-semibold text-text-primary flex items-center gap-2 border-b border-border-subtle pb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                  <span>Hard Technical Constraints</span>
                </h3>
                <ul className="space-y-2">
                  {cs.problemEncountered.constraints.map((constraint, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-mono text-text-secondary leading-relaxed">
                      <span className="text-accent-solid font-bold select-none">›</span>
                      <span>{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Part 3: Why Built This Way (Architectural Decisions & Trade-offs) */}
          <section
            aria-labelledby="section-architecture"
            className="space-y-6 border-b border-border-subtle pb-8"
          >
            <h2
              id="section-architecture"
              className="text-2xl font-bold tracking-tight text-text-primary"
            >
              Why Built This Way (Architectural Decisions & Trade-offs)
            </h2>

            {/* Architectural Insight */}
            <div className="p-5 rounded-lg bg-canvas border border-border-subtle space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-accent-solid">
                <Cpu className="w-4 h-4" aria-hidden="true" />
                <span className="font-semibold">Key Architectural Insight</span>
              </div>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                {cs.whyBuiltThisWay.architecturalInsight}
              </p>
            </div>

            {/* Trade-Off Analysis */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-semibold text-text-muted flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                <span>Trade-Off Analysis (Why X over Y)</span>
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {cs.whyBuiltThisWay.tradeOffs.map((tradeOff, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-lg bg-surface border border-border-subtle space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border-subtle pb-2">
                      <h4 className="text-sm font-bold text-text-primary">
                        {tradeOff.decision}
                      </h4>
                      {tradeOff.vsAlternative && (
                        <span className="text-[11px] font-mono text-text-muted bg-surface-hover px-2 py-0.5 rounded-md border border-border-subtle self-start sm:self-auto">
                          vs. {tradeOff.vsAlternative}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {tradeOff.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Guardrails & Defensive Design */}
            {cs.whyBuiltThisWay.guardrails && cs.whyBuiltThisWay.guardrails.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-semibold text-text-muted flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                  <span>Guardrails & Defensive Design</span>
                </h3>
                <div className="p-4 rounded-lg bg-surface border border-border-subtle">
                  <ul className="space-y-2">
                    {cs.whyBuiltThisWay.guardrails.map((guardrail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-mono text-text-secondary leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent-solid flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{guardrail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Part 4: Outcomes, Verification & Key Takeaways */}
          <section
            aria-labelledby="section-outcomes"
            className="space-y-6 pb-4"
          >
            <h2
              id="section-outcomes"
              className="text-2xl font-bold tracking-tight text-text-primary"
            >
              Outcomes, Verification & Key Takeaways
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Verification Benchmarks */}
              <div className="p-5 rounded-lg bg-surface border border-border-subtle space-y-3">
                <h3 className="text-xs font-mono font-semibold text-text-primary flex items-center gap-2 border-b border-border-subtle pb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                  <span>Verification Benchmarks</span>
                </h3>
                <ul className="space-y-2">
                  {cs.outcomes.verification.map((verif, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-mono text-text-secondary leading-relaxed">
                      <span className="text-accent-solid font-bold select-none">›</span>
                      <span>{verif}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Real-World Impact */}
              <div className="p-5 rounded-lg bg-surface border border-border-subtle space-y-3">
                <h3 className="text-xs font-mono font-semibold text-text-primary flex items-center gap-2 border-b border-border-subtle pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                  <span>Real-World Impact</span>
                </h3>
                <ul className="space-y-2">
                  {cs.outcomes.impact.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-mono text-text-secondary leading-relaxed">
                      <span className="text-accent-solid font-bold select-none">›</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Engineering Takeaway Box */}
            <div className="p-5 rounded-lg bg-canvas border border-border-subtle space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-accent-solid">
                <Lightbulb className="w-4 h-4" aria-hidden="true" />
                <span className="font-semibold">Core Engineering Takeaway</span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-text-primary leading-relaxed">
                {cs.outcomes.takeaway}
              </p>
            </div>
          </section>
        </div>
      ) : (
        <div className="p-6 rounded-lg bg-surface border border-border-subtle space-y-4">
          <h2 className="text-lg font-bold text-text-primary">Direct Technical Summary</h2>
          <p className="text-sm text-text-secondary leading-relaxed">{project.summary}</p>
        </div>
      )}

      {/* Bottom Navigation CTA */}
      <footer className="pt-6 border-t border-border-subtle flex items-center justify-between">
        <TransitionLink
          to="/projects"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-accent-solid hover:underline focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded px-1 py-0.5"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          <span>Back to all projects</span>
        </TransitionLink>
      </footer>
    </article>
  );
};

export default CaseStudyView;
