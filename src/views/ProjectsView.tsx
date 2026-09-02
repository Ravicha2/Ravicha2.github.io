import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ExternalLink,
  Activity,
  Terminal,
  FileText,
  Video,
  Sparkles,
} from 'lucide-react';
import { projects, projectCategories, getProjectsByCategory } from '../data/projects';
import { ProjectCategory, Project } from '../data/types';

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

export const ProjectsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');

  const filteredProjects = getProjectsByCategory(selectedCategory);

  const getCategoryCount = (categoryId: ProjectCategory | 'all'): number => {
    if (categoryId === 'all') return projects.length;
    return projects.filter((p) => p.category === categoryId).length;
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <header className="space-y-4 border-b border-border-subtle pb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent-badge-bg border border-border-subtle text-accent-badge-text text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Technical Portfolio & Case Studies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          Projects
        </h1>
        <p className="text-base text-text-secondary max-w-3xl leading-relaxed">
          Curated engineering projects and technical case studies across Agentic AI, Distributed Systems, Graph Knowledge Systems, and Medical Robotics.
        </p>

        {/* Category Filters */}
        <div className="pt-4">
          <div
            role="group"
            aria-label="Filter projects by category"
            className="flex flex-wrap gap-2"
          >
            {projectCategories.map((category) => {
              const isSelected = selectedCategory === category.id;
              const count = getCategoryCount(category.id);

              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors border focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
                    isSelected
                      ? 'bg-accent-solid text-accent-contrast border-accent-solid shadow-sm'
                      : 'bg-surface text-text-secondary border-border-subtle hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  <span>{category.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? 'bg-canvas text-accent-solid font-bold'
                        : 'bg-canvas text-text-muted border border-border-subtle'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <section aria-label="Projects catalog" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project: Project) => {
            const hasCaseStudy = Boolean(project.caseStudy);

            return (
              <article
                key={project.slug}
                data-testid={`project-card-${project.slug}`}
                className="bg-surface border border-border-subtle rounded-lg p-6 flex flex-col justify-between hover:border-border-strong transition-colors"
              >
                <div className="space-y-4">
                  {/* Category, Badge & Timeline */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent-badge-bg text-accent-badge-text border border-border-subtle">
                        {project.categoryLabel}
                      </span>
                      {hasCaseStudy && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-hover text-text-muted border border-border-subtle">
                          Case Study
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-text-muted">{project.timeline}</span>
                  </div>

                  {/* Title & Role */}
                  <div>
                    <h2 className="text-xl font-bold text-text-primary tracking-tight">
                      {hasCaseStudy ? (
                        <Link
                          to={`/projects/${project.slug}`}
                          className="hover:text-accent-solid transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded"
                        >
                          {project.title}
                        </Link>
                      ) : (
                        <span>{project.title}</span>
                      )}
                    </h2>
                    <p className="text-xs font-medium text-text-muted mt-1">{project.role}</p>
                  </div>

                  {/* Technical Summary */}
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Highlights / Metrics */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="bg-canvas border border-border-subtle rounded p-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-text-muted">
                        <Activity className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                        <span>Key Highlights</span>
                      </div>
                      <ul className="text-xs font-mono text-text-secondary space-y-1">
                        {project.metrics.map((metric, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-accent-solid select-none">›</span>
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
                <div className="pt-6 mt-6 border-t border-border-subtle flex items-center justify-between gap-3">
                  {hasCaseStudy ? (
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-solid hover:underline focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded px-1"
                    >
                      <span>Read Case Study</span>
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  ) : (
                    <span className="text-xs font-mono text-text-muted">
                      Direct Repository & Live Artifacts
                    </span>
                  )}

                  <div className="flex items-center space-x-2">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-text-muted hover:text-text-primary rounded hover:bg-surface-hover transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
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
                        className="p-1.5 text-text-muted hover:text-text-primary rounded hover:bg-surface-hover transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
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
                        className="p-1.5 text-text-muted hover:text-text-primary rounded hover:bg-surface-hover transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                        aria-label={`${project.title} PyPI package (opens in a new tab)`}
                      >
                        <Terminal className="w-4 h-4" aria-hidden="true" />
                      </a>
                    )}
                    {project.links.video && (
                      <a
                        href={project.links.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-text-muted hover:text-text-primary rounded hover:bg-surface-hover transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                        aria-label={`${project.title} video walkthrough (opens in a new tab)`}
                      >
                        <Video className="w-4 h-4" aria-hidden="true" />
                      </a>
                    )}
                    {project.links.paper && (
                      <a
                        href={project.links.paper}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-text-muted hover:text-text-primary rounded hover:bg-surface-hover transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                        aria-label={`${project.title} published IEEE paper (opens in a new tab)`}
                      >
                        <FileText className="w-4 h-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ProjectsView;
