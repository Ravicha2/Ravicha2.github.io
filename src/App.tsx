import type React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

import { HomeView } from './views/HomeView';
import { ProjectsView } from './views/ProjectsView';
import { CaseStudyView } from './views/CaseStudyView';
import { ExperienceView } from './views/ExperienceView';

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
