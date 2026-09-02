import type React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

import { HomeView } from './views/HomeView';

const ProjectsView: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Projects</h1>
    <p className="text-text-secondary">Curated engineering projects and technical case studies.</p>
  </div>
);

const ExperienceView: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Experience</h1>
    <p className="text-text-secondary">Engineering career timeline and technical milestones.</p>
  </div>
);

const CaseStudyView: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Case Study</h1>
    <p className="text-text-secondary">Deep dive case study.</p>
  </div>
);

export const App: React.FC = () => {
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    if (pathname === '/') return 'Overview | Palm Suksawasdi';
    if (pathname.startsWith('/projects/')) return 'Case Study | Palm Suksawasdi';
    if (pathname === '/projects') return 'Projects | Palm Suksawasdi';
    if (pathname === '/experience') return 'Experience | Palm Suksawasdi';
    return 'Palm Suksawasdi';
  };

  return (
    <AppLayout pageTitle={getPageTitle(location.pathname)}>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/projects" element={<ProjectsView />} />
        <Route path="/projects/:slug" element={<CaseStudyView />} />
        <Route path="/experience" element={<ExperienceView />} />
      </Routes>
    </AppLayout>
  );
};
