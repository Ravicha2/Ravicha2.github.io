import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SkipLink, RouteAnnouncer } from '../../accessibility';
import { SEOHead } from '../seo/SEOHead';
import { WebMcpTools } from '../../webmcp/WebMcpTools';
import { useViewTransitionNavigate } from '../../hooks/useViewTransitionNavigate';
import { useActiveReadout } from '../../hooks/useActiveReadout';
import { profile } from '../../data/profile';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

export interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const NAV = [
  { to: '/', label: 'Overview' },
  { to: '/projects', label: 'Work' },
  { to: '/experience', label: 'Experience' },
];

/** Local time on the bench. A recruiter in another timezone is the reason this
 *  is worth a clock: the number answers "is he awake right now". */
function useLocalTime(timeZone: string) {
  // Null until mounted. Read during render, the prerendered HTML would carry the
  // build machine's clock and then disagree with the browser's at hydration — and
  // Node's ICU need not spell the zone the way the browser does either.
  const [now, setNow] = useState<Date | null>(null);
  const format = useMemo(
    () =>
      new Intl.DateTimeFormat('en-AU', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZoneName: 'short',
      }),
    [timeZone],
  );

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 20_000);
    return () => window.clearInterval(id);
  }, []);

  return now ? format.format(now) : '--:--';
}

const linkClass =
  'font-mono text-[11px] text-annotate underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-spark';

export const AppLayout: React.FC<AppLayoutProps> = ({ children, pageTitle }) => {
  const navigateWithTransition = useViewTransitionNavigate();
  const readout = useActiveReadout(pageTitle);
  const time = useLocalTime('Australia/Sydney');
  const { state, copy } = useCopyToClipboard();

  const handleNavClick =
    (to: string) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
    <div className="min-h-screen bg-bench text-ink flex flex-col">
      <SEOHead />
      <WebMcpTools />
      <SkipLink />
      <RouteAnnouncer pageTitle={pageTitle} />
      <span className="sweep" aria-hidden="true" />

      {/* The bar exists only where the rail cannot: below the rail's breakpoint. */}
      <header
        id="site-header"
        role="banner"
        className="lg:hidden sticky top-0 z-40 bg-bench border-b border-rule"
      >
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 h-14">
          {/* The bar shares its row with the nav, and the full name needs two lines
              in the width that is left on a phone. The rail below carries it in full. */}
          <NavLink to="/" className="text-[15px] font-semibold tracking-[-0.01em]">
            {profile.preferredName}
          </NavLink>
          <nav aria-label="Main" className="flex items-center gap-4">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={handleNavClick(item.to)}
                className={({ isActive }) =>
                  `touch-target font-mono text-[11px] tracking-[0.06em] uppercase border-b-2 transition-colors ${
                    isActive
                      ? 'text-ink border-signal'
                      : 'text-annotate border-transparent hover:text-ink hover:border-rule'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <div className="flex-1 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
        {/* The rail. Not a sidebar of links — the instrument readout, and the only
            chrome the bench has. Everything on it is true data. */}
        <aside
          id="site-rail"
          aria-labelledby="rail-heading"
          className="border-b lg:border-b-0 lg:border-r border-rule px-4 sm:px-6 lg:px-5 xl:px-6 py-6 lg:py-7 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto"
        >
          {/* Not a heading. This rail is chrome, and it renders above <main> on
              every route, so an <h2> here put a level-2 heading in front of the
              page's own <h1> — a heading order no page can fix from inside its
              view. `aria-labelledby` labels the aside just as well from a
              paragraph, and the label stays out of the document outline. */}
          <p id="rail-heading" className="sr-only">
            Status and contact
          </p>

          <div className="hidden lg:block">
            <NavLink
              to="/"
              onClick={handleNavClick('/')}
              className="block text-[15px] font-semibold tracking-[-0.01em]"
            >
              {profile.name}
            </NavLink>
            <p className="mt-1 font-mono text-[11px] leading-snug text-annotate">
              {profile.title}
            </p>
          </div>

          <p className="lg:mt-6 text-[13px] leading-relaxed text-annotate measure">{profile.status}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-mono text-[12px] break-all select-text text-ink">
              {profile.email}
            </span>
            <button
              type="button"
              onClick={() => copy(profile.email)}
              className="touch-target font-mono text-[11px] uppercase tracking-[0.06em] text-annotate underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-spark"
            >
              <span aria-live="polite">
                {state === 'copied' ? 'Copied' : state === 'error' ? 'Failed' : 'Copy'}
              </span>
            </button>
          </div>

          <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className={linkClass}>
              CV
            </a>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (opens in a new tab)"
              className={linkClass}
            >
              GitHub
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (opens in a new tab)"
              className={linkClass}
            >
              LinkedIn
            </a>
          </p>

          {/* The instrument half of the rail. It duplicates content that is already
              on the page, so it is aria-hidden: a screen reader gains nothing from
              it and would hear a live region on every scroll. */}
          <div aria-hidden="true" className="hidden lg:block mt-7 pt-6 border-t border-rule">
            <p className="readout font-mono text-[11px] text-annotate">
              {profile.location.replace(', Australia', '')}{' '}
              {/* Reserved at the width a formatted time occupies, so the placeholder
                  filling in does not reflow the rail. */}
              <span className="inline-block w-[10ch]">{time}</span>
            </p>
            <p className="readout mt-2 flex gap-2 font-mono text-[11px] leading-snug text-annotate min-h-[2.6em]">
              {/* The lamp: warm while something is under the lens, bark when the
                  readout has nothing to name. */}
              <span
                className={`mt-[0.35em] w-[5px] h-[5px] shrink-0 ${readout ? 'bg-spark' : 'bg-rule'}`}
              />
              <span>{readout ?? 'nothing under the lens'}</span>
            </p>
          </div>

          <nav aria-label="Main navigation" className="hidden lg:block mt-7 pt-6 border-t border-rule">
            <ul className="space-y-1.5">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={handleNavClick(item.to)}
                    className={({ isActive }) =>
                      `flex items-start gap-2 py-0.5 text-[13px] transition-colors ${
                        isActive ? 'text-ink' : 'text-annotate hover:text-ink'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          aria-hidden="true"
                          className={`mt-[0.4em] w-[5px] h-[5px] shrink-0 ${
                            isActive ? 'bg-signal' : 'bg-rule'
                          }`}
                        />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main
          id="main-content"
          tabIndex={-1}
          role="main"
          className="min-w-0 px-4 sm:px-6 lg:px-10 xl:px-14 py-8 sm:py-12 outline-none"
        >
          {children}
        </main>
      </div>

      <footer role="contentinfo" className="border-t border-rule">
        <div className="px-4 sm:px-6 lg:px-10 xl:px-14 py-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-8 gap-y-3">
          <p className="font-mono text-[11px] leading-relaxed text-annotate measure">
            Every number here was read off a real artifact, at the commit it was read at. The
            misses are on the page next to the hits.
          </p>
          {/* The route always ends here, and on mobile the rail has scrolled away,
              so the footer carries the address rather than assuming the rail. */}
          <p className="font-mono text-[11px] text-annotate shrink-0">
            {profile.preferredName} · {profile.location} ·{' '}
            <a href={profile.links.email} className={linkClass}>
              {profile.email}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
