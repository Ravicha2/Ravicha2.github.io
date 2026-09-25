import type React from 'react';
import { NavLink } from 'react-router-dom';
import { SkipLink, RouteAnnouncer } from '../../accessibility';
import { SEOHead } from '../seo/SEOHead';
import { useViewTransitionNavigate } from '../../hooks/useViewTransitionNavigate';
import { profile } from '../../data/profile';

export interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

/**
 * Datum references: what every measurement on this sheet is taken against. They
 * sit in the right margin because that is where a drawing puts them, and because
 * a visitor deciding on role fit should be able to see the grounds without
 * opening anything.
 */
const DATUMS = [
  { ref: 'A', name: 'github.com/Ravicha2', note: 'the source every claim resolves to' },
  { ref: 'B', name: 'UNSW Sydney', note: 'Master of IT, WAM 83, graduating Dec 2026' },
  { ref: 'C', name: 'Sydney, Australia', note: 'UTC+10 · full-time, on-site or remote' },
];

const NAV = [
  { to: '/', label: 'Overview' },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
];

/**
 * A drawn rule. Absolutely positioned and sized before the pass runs, so the
 * geometry is reserved and nothing reflows while the pen moves. It sits above the
 * sticky header so the frame reads as one continuous edge.
 */
const Rule: React.FC<{ at: number; vertical?: boolean; className?: string }> = ({
  at,
  vertical = false,
  className = '',
}) => (
  <span
    aria-hidden="true"
    className={`plot ${vertical ? 'plot-v' : ''} absolute z-50 pointer-events-none bg-ink ${className}`}
    style={{ '--plot-delay': `${at}ms` } as React.CSSProperties}
  />
);

export const AppLayout: React.FC<AppLayoutProps> = ({ children, pageTitle }) => {
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

  return (
    <div className="min-h-screen bg-panel text-ink flex flex-col antialiased">
      <SEOHead />
      <SkipLink />
      <RouteAnnouncer pageTitle={pageTitle} />

      {/* The sheet: inset from the ground so it reads as paper on a drawing table.
          Its frame is four drawn rules rather than a border, so the plotter pass can
          extend them in order without transforming anything inside them — the hero
          H1 lives in here and is never animated. */}
      <div className="flex-1 flex flex-col m-2 sm:m-4 lg:m-6 relative bg-sheet">
        <Rule at={0} className="inset-x-0 top-0 h-[2px]" />
        <Rule at={60} vertical className="inset-y-0 left-0 w-[2px]" />
        <Rule at={90} vertical className="inset-y-0 right-0 w-[2px]" />
        <Rule at={480} className="inset-x-0 bottom-0 h-[2px]" />

        <header
          id="site-header"
          role="banner"
          className="sticky top-2 sm:top-4 lg:top-6 z-40 bg-sheet relative"
        >
          <div className="relative flex items-center justify-between gap-4 px-3 sm:px-5 h-14">
            <NavLink
              to="/"
              onClick={handleNavClick('/')}
              className="font-semibold tracking-[-0.01em] text-sm sm:text-[15px] rounded"
            >
              {profile.name}
            </NavLink>

            <nav aria-label="Main Navigation" className="flex items-center gap-4 sm:gap-6">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={handleNavClick(item.to)}
                  className={({ isActive }) =>
                    `font-mono text-[11px] uppercase tracking-widest py-1 underline underline-offset-4 rounded transition-[text-decoration-thickness] ${
                      isActive
                        ? 'text-ink decoration-2 decoration-ink'
                        : 'text-annotate decoration-1 decoration-annotate hover:text-ink hover:decoration-ink'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download CV (PDF, opens in a new tab)"
                className="font-mono text-[11px] uppercase tracking-widest py-1 text-annotate underline underline-offset-4 decoration-1 decoration-annotate hover:text-ink hover:decoration-ink rounded transition-[text-decoration-thickness]"
              >
                CV
              </a>
            </nav>
          </div>
          <Rule at={120} className="inset-x-0 bottom-0 h-[2px]" />
        </header>

        <div className="flex-1 grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:divide-x lg:divide-ink">
          <main
            id="main-content"
            tabIndex={-1}
            role="main"
            className="min-w-0 px-3 sm:px-5 py-8 sm:py-10 outline-none"
          >
            {children}
          </main>

          <aside
            aria-labelledby="datum-heading"
            className="border-t border-ink lg:border-t-0 px-3 sm:px-5 py-6 lg:py-10"
          >
            <h2
              id="datum-heading"
              className="font-mono text-[10px] uppercase tracking-widest text-annotate"
            >
              Datum references
            </h2>
            <dl className="mt-3 space-y-3">
              {DATUMS.map((d) => (
                <div key={d.ref} className="flex gap-2.5">
                  <dt className="font-mono text-[11px] text-ink w-10 shrink-0">{d.ref}</dt>
                  <dd className="min-w-0">
                    <span className="block text-[13px] font-medium leading-snug">{d.name}</span>
                    <span className="block font-mono text-[11px] text-annotate leading-snug mt-0.5">
                      {d.note}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <p className="rule-annotate mt-5 pt-3 font-mono text-[11px] leading-relaxed text-annotate">
              {profile.status}
            </p>
          </aside>
        </div>

        {/* Title block. The primary action is here, where a drawing's action always is. */}
        <footer role="contentinfo" className="border-t border-ink">
          <div className="grid sm:grid-cols-[minmax(0,1fr)_auto] sm:divide-x sm:divide-ink">
            <p className="px-3 sm:px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-annotate">
              Every claim is measured against a datum. Values pin to the commit they were read
              at.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-[repeat(3,auto)] border-t sm:border-t-0 sm:divide-x divide-ink">
              <div className="px-3 sm:px-5 py-3 border-r sm:border-r-0 border-ink">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-annotate">
                  Drawn
                </span>
                <span className="block text-[13px] font-medium mt-0.5">{profile.name}</span>
              </div>
              <div className="px-3 sm:px-5 py-3">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-annotate">
                  Revision
                </span>
                <span className="block font-mono text-[11px] mt-1">2026-09</span>
              </div>
              <div className="px-3 sm:px-5 py-3 flex flex-wrap items-center gap-x-4 gap-y-1 col-span-2 sm:col-span-1 border-t sm:border-t-0 border-ink">
                <a
                  href={profile.links.email}
                  className="inline-block bg-ink text-sheet font-mono text-[11px] px-3 py-1.5 rounded"
                >
                  {profile.email}
                </a>
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Palm's GitHub profile (opens in a new tab)"
                  className="font-mono text-[11px] uppercase tracking-widest text-annotate underline underline-offset-4 decoration-1 decoration-annotate hover:text-ink hover:decoration-ink rounded"
                >
                  GitHub
                </a>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Palm's LinkedIn profile (opens in a new tab)"
                  className="font-mono text-[11px] uppercase tracking-widest text-annotate underline underline-offset-4 decoration-1 decoration-annotate hover:text-ink hover:decoration-ink rounded"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;
