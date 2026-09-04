import type React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { featuredProjects } from '../../data/projects';
import { TransitionLink } from '../common/TransitionLink';
import { useActiveTransitionSlug } from '../../hooks/useViewTransitionNavigate';

export const BentoGrid: React.FC = () => {
  const activeSlug = useActiveTransitionSlug();

  return (
    <section aria-labelledby="bento-heading" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border-subtle pb-4">
        <div>
          <h2 id="bento-heading" className="text-2xl font-bold tracking-tight text-text-primary">
            Featured Case Studies
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Deep-dive architectures, failure mode mitigations, and verified outcomes.
          </p>
        </div>
        <TransitionLink
          to="/projects"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent-solid hover:underline focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded px-1 py-0.5 self-start sm:self-auto transition-colors"
        >
          <span>View all projects</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </TransitionLink>
      </div>

      <div data-testid="bento-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuredProjects.map((project) => (
          <article
            key={project.slug}
            data-testid={`bento-card-${project.slug}`}
            style={activeSlug === project.slug ? { viewTransitionName: `project-card-${project.slug}` } : undefined}
            className="group/card bg-surface border border-border-subtle rounded-lg p-6 flex flex-col justify-between hover:border-border-strong transition-all duration-150 md:col-span-1"
          >
            <div className="space-y-4">
              {/* Header metadata */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-md bg-accent-badge-bg text-accent-badge-text border border-border-subtle">
                  {project.categoryLabel}
                </span>
                <span className="text-xs font-mono text-text-muted">{project.timeline}</span>
              </div>

              {/* Title & Role */}
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-text-primary tracking-tight">
                  <TransitionLink
                    to={`/projects/${project.slug}`}
                    className="hover:text-accent-solid transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded"
                  >
                    {project.title}
                  </TransitionLink>
                </h3>
                <p className="text-xs font-mono font-medium text-text-muted">{project.role}</p>
              </div>

              {/* Technical Summary */}
              <p className="text-sm text-text-secondary leading-relaxed">
                {project.summary}
              </p>

              {/* Single Quantified Proof Metric */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="flex items-start gap-2 text-xs font-mono text-text-secondary pt-1">
                  <span className="text-accent-solid font-bold select-none">↓</span>
                  <span>{project.metrics[0]}</span>
                </div>
              )}

              {/* Curated Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-surface-hover text-text-secondary border border-border-subtle"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Actions Footer */}
            <div className="pt-4 mt-5 border-t border-border-subtle flex items-center justify-between">
              <TransitionLink
                to={`/projects/${project.slug}`}
                className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-accent-solid hover:underline focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded px-1 py-0.5"
              >
                <span>Read Case Study</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-link:hover:translate-x-0.5 group-link:hover:-translate-y-0.5" aria-hidden="true" />
              </TransitionLink>

              <span className="text-xs font-mono text-text-muted">
                System trace →
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BentoGrid;
