import type React from 'react';
import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { SkipLink, RouteAnnouncer } from '../../accessibility';
import { SEOHead } from '../seo/SEOHead';

export interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, pageTitle }) => {
  const mainRef = useRef<HTMLElement>(null);

  const navItems = [
    { to: '/', label: 'Overview' },
    { to: '/projects', label: 'Projects' },
    { to: '/experience', label: 'Experience' },
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <NavLink
            to="/"
            className="group flex items-center gap-2 font-semibold tracking-tight text-text-primary hover:text-accent-solid focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-md px-1.5 py-1 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-accent-solid transition-transform group-hover:scale-125" aria-hidden="true" />
            <span>Palm Suksawasdi</span>
          </NavLink>

          <nav
            role="navigation"
            aria-label="Main Navigation"
            className="flex items-center space-x-1 sm:space-x-1.5"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 text-sm rounded-md transition-all duration-150 focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
                    isActive
                      ? 'bg-accent-badge-bg text-accent-badge-text font-semibold border border-border-subtle shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover font-medium border border-transparent'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
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
