import type React from 'react';
import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { User, FolderGit2, Briefcase } from 'lucide-react';
import { SkipLink, RouteAnnouncer } from '../../accessibility';
import { SEOHead } from '../seo/SEOHead';
import { useViewTransitionNavigate } from '../../hooks/useViewTransitionNavigate';

export interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, pageTitle }) => {
  const mainRef = useRef<HTMLElement>(null);
  const navigateWithTransition = useViewTransitionNavigate();

  const handleNavClick = (to: string) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.shiftKey
    ) {
      e.preventDefault();
      navigateWithTransition(to);
    }
  };

  const navItems = [
    { to: '/', label: 'Overview', icon: User },
    { to: '/projects', label: 'Projects', icon: FolderGit2 },
    { to: '/experience', label: 'Experience', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col antialiased selection:bg-accent-badge-bg selection:text-accent-badge-text">
      <SEOHead />
      <SkipLink />
      <RouteAnnouncer pageTitle={pageTitle} mainRef={mainRef} />

      <header
        role="banner"
        className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-border-subtle transition-colors"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          <NavLink
            to="/"
            onClick={handleNavClick('/')}
            className="group flex items-center gap-2 font-semibold tracking-tight text-sm sm:text-base text-text-primary hover:text-accent-solid focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-md px-1 py-1 transition-colors flex-shrink-0"
          >
            <span>Palm Suksawasdi</span>
          </NavLink>

          <nav
            role="navigation"
            aria-label="Main Navigation"
            className="flex items-center space-x-1 sm:space-x-1.5"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={handleNavClick(item.to)}
                  aria-label={item.label}
                  title={item.label}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm rounded-md transition-all duration-150 focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
                      isActive
                        ? 'bg-accent-badge-bg text-accent-badge-text font-semibold border border-border-subtle'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover font-medium border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>

      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        role="main"
        className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 outline-none"
      >
        {children}
      </main>

      <footer role="contentinfo" className="border-t border-border-subtle py-8 text-sm text-text-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Palm Suksawasdi. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Ravicha2"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded px-1.5 py-0.5 transition-colors"
              aria-label="Palm's GitHub profile (opens in a new tab)"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/ravicha-suksawasdi-na-ayuthaya"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded px-1.5 py-0.5 transition-colors"
              aria-label="Palm's LinkedIn profile (opens in a new tab)"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
