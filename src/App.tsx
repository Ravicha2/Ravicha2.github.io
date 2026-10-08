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
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { PrivacyView } from './views/PrivacyView';
import { DeveloperView } from './views/DeveloperView';
import { DocsView } from './views/DocsView';
import { NotFound } from './components/common/NotFound';

const NOT_FOUND_TITLE = `Page not found | ${profile.name}`;

/** The static routes, spelled out once: the router, the title and the announcer
 *  all read the same map, so a page cannot be reachable under a title that
 *  describes a different one. */
const STATIC_TITLES: Record<string, string> = {
  '/': `Overview | ${profile.name}`,
  '/projects': `Projects | ${profile.name}`,
  '/experience': `Experience | ${profile.name}`,
  '/about': `About ${profile.preferredName} | ${profile.name}`,
  '/contact': `Contact | ${profile.name}`,
  '/privacy': `Privacy | ${profile.name}`,
  '/developers': `Developer portal | ${profile.name}`,
  '/docs': `API reference | ${profile.name}`,
};

export const App: React.FC = () => {
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    const bare = pathname.replace(/\/+$/, '') || '/';
    if (STATIC_TITLES[bare]) return STATIC_TITLES[bare];
    if (bare.startsWith('/projects/')) {
      // A slug that resolves to nothing is a dead end, and the announcer has to
      // say so too — the route below renders the not-found page for it.
      const slug = bare.slice('/projects/'.length);
      return getProjectBySlug(slug) ? `Case Study | ${profile.name}` : NOT_FOUND_TITLE;
    }
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
          {/* The trust anchors and the machine surface. Real pages with real
              prose, because a 500-character stub is visible as a stub. */}
          <Route path="/about" element={<AboutView />} />
          <Route path="/contact" element={<ContactView />} />
          <Route path="/privacy" element={<PrivacyView />} />
          <Route path="/developers" element={<DeveloperView />} />
          <Route path="/docs" element={<DocsView />} />
          {/* GitHub Pages hands every unresolvable path back to this SPA, so the
              catch-all is reachable on the live site from any stale deep link. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </ViewTransitionProvider>
  );
};
