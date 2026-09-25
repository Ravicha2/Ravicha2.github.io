import type React from 'react';
import { featuredProjects } from '../../data/projects';
import { DimensionLine, type DimensionInterval } from './DimensionLine';

/**
 * The four flagship projects as dimensioned intervals, each measured to its own
 * headline figure. One chain, rendered on every route, so the same four references
 * carry the visitor from the overview into a case study and back out.
 */
export const intervals: DimensionInterval[] = featuredProjects.map((project, i) => ({
  to: `/projects/${project.slug}`,
  slug: project.slug,
  ref: `P.${String(i + 1).padStart(2, '0')}`,
  label: project.title,
  value: project.metrics?.[0]?.value ?? project.timeline,
  note: project.metrics?.[0]?.label ?? project.role,
}));

export const SheetChain: React.FC<{ currentSlug?: string; note?: string; className?: string }> = ({
  currentSlug,
  note = `One chain, four flagship projects, ${featuredProjects.length} of 7 intervals shown`,
  className = '',
}) => <DimensionLine intervals={intervals} note={note} currentSlug={currentSlug} className={className} />;

export default SheetChain;
