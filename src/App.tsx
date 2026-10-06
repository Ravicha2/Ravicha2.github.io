import type React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ViewTransitionProvider } from './hooks/useViewTransitionNavigate';
import { getProjectBySlug } from './data/projects';
import { profile } from './data/profile';

import { HomeView } from './views/HomeView';
import { ProjectsView } from './views/ProjectsView';
import { CaseStudyView } from './views/CaseStudyView';
import { ExperienceView } from './views/ExperienceView';
import { NotFound } from './components/common/NotFound';

const NOT_FOUND_TITLE = `Page not found | ${profile.name}`;

export const App: React.FC = () => {
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    if (pathname === '/') return `Overview | ${profile.name}`;
    if (pathname === '/projects') return `Projects | ${profile.name}`;
    if (pathname.startsWith('/projects/')) {
      // A slug that resolves to nothing is a dead end, and the announcer has to
      // say so too — the route below renders the not-found page for it.
      const slug = pathname.slice('/projects/'.length);
      return getProjectBySlug(slug) ? `Case Study | ${profile.name}` : NOT_FOUND_TITLE;
    }
    if (pathname === '/experience') return `Experience | ${profile.name}`;
    return NOT_FOUND_TITLE;
  };

  return (
    <ViewTransitionProvider>
      <AppLayout pageTitle={getPageTitle(location.pathname)}>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/projects" element={<ProjectsView />} />
          <Route path="/projects/:slug" element={<CaseStudyView />} />
          <Route path="/experience" element={<ExperienceView />} />
          {/* GitHub Pages hands every unresolvable path back to this SPA, so the
              catch-all is reachable on the live site from any stale deep link. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </ViewTransitionProvider>
  );
};
