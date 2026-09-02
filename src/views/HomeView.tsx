import type React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, GraduationCap, FolderGit2 } from 'lucide-react';
import { HeroNarrative } from '../components/home/HeroNarrative';
import { BentoGrid } from '../components/home/BentoGrid';
import { workExperience, education } from '../data/experience';

export const HomeView: React.FC = () => {
  const currentWork = workExperience.find((w) => w.isCurrent) || workExperience[0];
  const primaryEducation = education[0];

  return (
    <div className="space-y-14 sm:space-y-16 pb-12">
      {/* Hero Narrative Section */}
      <HeroNarrative />

      {/* Bento Showcase Grid */}
      <BentoGrid />

      {/* Career Snapshot & Quick Navigation Section */}
      <section aria-labelledby="career-snapshot-heading" className="space-y-6">
        <div className="border-b border-border-subtle pb-4">
          <h2 id="career-snapshot-heading" className="text-2xl font-bold tracking-tight text-text-primary">
            Career Snapshot
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Academic research at UNSW Sydney and production engineering experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Experience Card */}
          <div className="bg-surface border border-border-subtle rounded-lg p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-muted">
              <Briefcase className="w-4 h-4 text-accent-solid" aria-hidden="true" />
              <span>Current Role</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">{currentWork.role}</h3>
              <p className="text-sm font-medium text-text-secondary">
                {currentWork.company} · <span className="font-mono text-xs text-text-muted">{currentWork.period}</span>
              </p>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {currentWork.description[0]}
            </p>
          </div>

          {/* Education Card */}
          <div className="bg-surface border border-border-subtle rounded-lg p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-muted">
              <GraduationCap className="w-4 h-4 text-accent-solid" aria-hidden="true" />
              <span>Education</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">{primaryEducation.degree}</h3>
              <p className="text-sm font-medium text-text-secondary">
                {primaryEducation.institution} · <span className="font-mono text-xs text-text-muted">{primaryEducation.grade}</span>
              </p>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {primaryEducation.details[2] || primaryEducation.details[0]}
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-surface border border-border-subtle rounded-lg">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-semibold text-text-primary">Want to explore all projects and background?</h3>
            <p className="text-sm text-text-secondary">
              Browse the complete filterable catalog or inspect the chronological career timeline.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-surface text-text-primary border border-border-subtle hover:bg-surface-hover hover:border-border-strong transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <FolderGit2 className="w-4 h-4" aria-hidden="true" />
              <span>View all projects</span>
            </Link>
            <Link
              to="/experience"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-accent-solid text-white hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <span>View full experience</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
