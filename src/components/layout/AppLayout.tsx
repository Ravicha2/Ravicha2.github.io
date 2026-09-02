import type React from 'react';
import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { SkipLink, RouteAnnouncer } from '../../accessibility';

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
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col antialiased">
      <SkipLink />
      <RouteAnnouncer pageTitle={pageTitle} mainRef={mainRef} />

      <header role="banner" className="sticky top-0 z-40 bg-canvas/80 backdrop-blur border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <NavLink
            to="/"
            className="font-medium tracking-tight text-text-primary hover:text-accent-solid focus-visible:ring-2 focus-visible:ring-accent-solid rounded px-1"
          >
            Palm Suksawasdi
          </NavLink>

          <nav role="navigation" aria-label="Main Navigation" className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-accent-solid ${
                    isActive
                      ? 'bg-accent-badge-bg text-accent-badge-text font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
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
        className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 outline-none"
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
              className="hover:text-text-primary focus-visible:ring-2 focus-visible:ring-accent-solid rounded px-1"
              aria-label="Palm's GitHub profile (opens in a new tab)"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/ravicha-suksawasdi-na-ayuthaya"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary focus-visible:ring-2 focus-visible:ring-accent-solid rounded px-1"
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
