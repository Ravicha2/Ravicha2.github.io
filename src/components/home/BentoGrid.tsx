import type React from 'react';
import { ArrowUpRight, ExternalLink, Activity, Terminal } from 'lucide-react';
import { featuredProjects } from '../../data/projects';
import { TransitionLink } from '../common/TransitionLink';

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

export const BentoGrid: React.FC = () => {
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
            style={{ viewTransitionName: `project-card-${project.slug}` }}
            className="group/card bg-surface border border-border-subtle rounded-lg p-6 flex flex-col justify-between hover:border-border-strong transition-all duration-150 shadow-sm md:col-span-1"
          >
            <div className="space-y-4">
              {/* Header metadata */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded bg-accent-badge-bg text-accent-badge-text border border-border-subtle">
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

              {/* Metrics / Key Highlights */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="bg-canvas border border-border-subtle rounded-md p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-text-muted">
                    <Activity className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                    <span>Key Highlights</span>
                  </div>
                  <ul className="text-xs font-mono text-text-secondary space-y-1.5">
                    {project.metrics.slice(0, 3).map((metric, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-accent-solid font-bold select-none">›</span>
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-hover text-text-secondary border border-border-subtle"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Actions Footer */}
            <div className="pt-5 mt-6 border-t border-border-subtle flex items-center justify-between gap-3">
              <TransitionLink
                to={`/projects/${project.slug}`}
                className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-accent-solid hover:underline focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded px-1 py-0.5"
              >
                <span>Read Case Study</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-link:hover:translate-x-0.5 group-link:hover:-translate-y-0.5" aria-hidden="true" />
              </TransitionLink>

              <div className="flex items-center space-x-1.5">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-text-muted hover:text-text-primary rounded-md hover:bg-surface-hover transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                    aria-label={`${project.title} GitHub repository (opens in a new tab)`}
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-text-muted hover:text-text-primary rounded-md hover:bg-surface-hover transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                    aria-label={`${project.title} live demo (opens in a new tab)`}
                  >
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                )}
                {project.links.pypi && (
                  <a
                    href={project.links.pypi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-text-muted hover:text-text-primary rounded-md hover:bg-surface-hover transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                    aria-label={`${project.title} PyPI package (opens in a new tab)`}
                  >
                    <Terminal className="w-4 h-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BentoGrid;
