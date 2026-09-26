import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { projects, projectCategories, getProjectsByCategory } from '../data/projects';
import { ProjectCategory, Project } from '../data/types';
import { useActiveTransitionSlug } from '../hooks/useViewTransitionNavigate';
import { BenchEntry } from '../components/bench/BenchEntry';
import { ChannelStrip } from '../components/bench/ChannelStrip';

const isFlagship = (project: Project) => Boolean(project.proofLine);

export const ProjectsView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSlug = useActiveTransitionSlug();

  const categoryParam = searchParams.get('category') as ProjectCategory | null;
  const validCategoryIds = projectCategories.map((c) => c.id);
  const selectedCategory: ProjectCategory | 'all' =
    categoryParam && validCategoryIds.includes(categoryParam) ? categoryParam : 'all';

  const filteredProjects = getProjectsByCategory(selectedCategory);
  const flagship = filteredProjects.filter(isFlagship);
  const supporting = filteredProjects.filter((p) => !isFlagship(p));

  const getCategoryCount = (categoryId: ProjectCategory | 'all'): number => {
    if (categoryId === 'all') return projects.length;
    return projects.filter((p) => p.category === categoryId).length;
  };

  const handleSelectCategory = (categoryId: ProjectCategory | 'all') => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryId === 'all') newParams.delete('category');
    else newParams.set('category', categoryId);
    setSearchParams(newParams, { replace: true });
  };

  // The catalog ref carries the project's position, so a row and the chain above it
  // name the same project the same way.
  const catalogRef = (project: Project) =>
    `P.${String(projects.findIndex((p) => p.slug === project.slug) + 1).padStart(2, '0')}`;

  return (
    <div className="space-y-12">
      <header className="space-y-8">
        <h1
          id="catalog-heading"
          className="text-xl sm:text-2xl font-semibold tracking-[-0.015em] text-pretty"
        >
          Engineering projects
        </h1>

        <p className="measure text-sm sm:text-base leading-relaxed text-pretty">
          I've always loved building and tinkering. My projects cover many different areas, but
          I'm most interested in AI that can act on its own — and in the checks that decide
          whether it actually did.
        </p>

        <ChannelStrip />
      </header>

      {/* Filters, as chips — the same outlined square the tags use. The list
          already opens with an "All Projects" entry, so there is no second one. */}
      <section aria-labelledby="filter-heading">
        <h2 id="filter-heading" className="sr-only">
          Filter projects by category
        </h2>
        <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
          {projectCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={selectedCategory === category.id}
              onClick={() => handleSelectCategory(category.id)}
              className="chip font-mono text-[11px] transition-colors"
            >
              {category.label}
              <span className="ml-1.5 tabular-nums">{getCategoryCount(category.id)}</span>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="catalog-heading-2">
        <h2 id="catalog-heading-2" className="sr-only">
          Project catalog
        </h2>
        <p role="status" aria-live="polite" className="sr-only">
          {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} shown
        </p>

        {flagship.length > 0 && (
          <>
            <p className="font-mono text-[11px] text-annotate py-2">Measured to an artifact</p>
            {flagship.map((project) => (
              <BenchEntry
                key={project.slug}
                project={project}
                catalogRef={catalogRef(project)}
                viewTransitionName={
                  activeSlug === project.slug ? `project-card-${project.slug}` : undefined
                }
              />
            ))}
          </>
        )}

        {supporting.length > 0 && (
          <div className="mt-12">
            <p className="font-mono text-[11px] text-annotate py-2">Repository only</p>
            {supporting.map((project) => (
              <BenchEntry
                key={project.slug}
                project={project}
                catalogRef={catalogRef(project)}
                viewTransitionName={
                  activeSlug === project.slug ? `project-card-${project.slug}` : undefined
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProjectsView;
