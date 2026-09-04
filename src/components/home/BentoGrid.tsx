import type React from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
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
            Production systems, GraphRAG architectures, and verified outcomes.
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

      <div data-testid="bento-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {featuredProjects.map((project) => (
          <article
            key={project.slug}
            data-testid={`bento-card-${project.slug}`}
            style={activeSlug === project.slug ? { viewTransitionName: `project-card-${project.slug}` } : undefined}
            className="group/card bg-surface border border-border-subtle rounded-lg p-5 sm:p-6 flex flex-col justify-between hover:border-border-strong hover:bg-surface-hover/30 transition-all duration-150"
          >
            <div className="space-y-3.5">
              {/* Header: Category & Timeline */}
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <span className="font-semibold text-accent-solid">
                  {project.categoryLabel}
                </span>
                <span className="text-text-muted">{project.timeline}</span>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                <TransitionLink
                  to={`/projects/${project.slug}`}
                  className="hover:text-accent-solid transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded"
                >
                  {project.title}
                </TransitionLink>
              </h3>

              {/* Single High-Signal Problem & Solution Line */}
              <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                {project.summary}
              </p>

              {/* Single Quantified ROI Metric */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="inline-flex items-center gap-2 px-2.5 py-1 text-xs text-bold rounded bg-canvas border border-border-subtle font-mono text-text-secondary">
                  <span className="font-medium text-text-primary">{project.metrics[0]}</span>
                </div>
              )}
            </div>

            {/* Card Footer: Tech Stack Pills & Action */}
            <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-hover text-text-muted border border-border-subtle"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <TransitionLink
                to={`/projects/${project.slug}`}
                className="group/link inline-flex items-center gap-1 text-xs font-mono font-semibold text-accent-solid hover:underline focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded px-1 py-0.5 flex-shrink-0"
              >
                <span>Case Study</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-link:hover:translate-x-0.5" aria-hidden="true" />
              </TransitionLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BentoGrid;
