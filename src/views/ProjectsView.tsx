import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { projects, projectCategories, getProjectsByCategory } from '../data/projects';
import { ProjectCategory, Project } from '../data/types';
import { useActiveTransitionSlug } from '../hooks/useViewTransitionNavigate';
import { FeatureControlFrame } from '../components/sheet/FeatureControlFrame';
import { CatalogEntry } from '../components/sheet/CatalogEntry';
import { SheetChain } from '../components/sheet/SheetChain';

const isFlagship = (project: Project) => Boolean(project.proof && project.proofLine);

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

  // The intervals carry their catalog position, so the chain's references and the
  // catalog rows name the same project the same way.
  const intervalRef = (project: Project) =>
    `P.${String(projects.findIndex((p) => p.slug === project.slug) + 1).padStart(2, '0')}`;

  return (
    <div className="space-y-10">
      <header>
        <FeatureControlFrame
          as="h1"
          nominal="Engineering Projects: seven built systems, four measured to an artifact."
          tolerance={
            <>
              {projects.filter(isFlagship).length} flagship carry a settling artifact and one line of
              real output · {projects.length - projects.filter(isFlagship).length} supporting resolve
              to their repository
            </>
          }
          datum="github.com/Ravicha2 · every artifact pinned to the commit it was read at"
        />

        <p className="measure mt-5 text-sm sm:text-base leading-relaxed text-pretty">
          I've always loved building and tinkering. My projects cover many different areas, but
          I'm most interested in AI that can act on its own — and in the checks that decide
          whether it actually did.
        </p>

        <SheetChain className="mt-9" note="The four flagship intervals, carried across every route" />
      </header>

      {/* The category filters, drawn as the sheet's legend. */}
      <section aria-labelledby="legend-heading" className="rule-verified pt-4">
        <h2
          id="legend-heading"
          className="font-mono text-[10px] uppercase tracking-widest text-annotate"
        >
          Legend — filter by subject
        </h2>
        <div
          role="group"
          aria-label="Filter projects by category"
          className="mt-3 flex flex-wrap gap-x-5 gap-y-2"
        >
          {projectCategories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelectCategory(category.id)}
                className={`font-mono text-[11px] uppercase tracking-widest py-1 underline underline-offset-4 decoration-1 rounded transition-[text-decoration-thickness] ${
                  isSelected
                    ? 'text-ink decoration-2 decoration-ink font-semibold'
                    : 'text-annotate decoration-annotate hover:text-ink hover:decoration-ink'
                }`}
              >
                {category.label}
                <span className="ml-1.5 tabular-nums">
                  {getCategoryCount(category.id)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-label="Projects catalog">
        <p role="status" aria-live="polite" className="sr-only">
          {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} shown
        </p>

        {flagship.length > 0 && (
          <>
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-annotate pb-2">
              Flagship — measured to an artifact
            </h2>
            {flagship.map((project) => (
              <CatalogEntry
                key={project.slug}
                project={project}
                sheetRef={intervalRef(project)}
                viewTransitionName={
                  activeSlug === project.slug ? `project-card-${project.slug}` : undefined
                }
              />
            ))}
          </>
        )}

        {supporting.length > 0 && (
          <div className="mt-10">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-annotate pb-2">
              Supporting — repository only
            </h2>
            {supporting.map((project) => (
              <CatalogEntry
                key={project.slug}
                project={project}
                sheetRef={intervalRef(project)}
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
