import type React from 'react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SkipLink, RouteAnnouncer } from '../../accessibility';
import { SEOHead } from '../seo/SEOHead';
import { WebMcpTools } from '../../webmcp/WebMcpTools';
import { useViewTransitionNavigate } from '../../hooks/useViewTransitionNavigate';
import { useActiveReadout, type LensState } from '../../hooks/useActiveReadout';
import { profile } from '../../data/profile';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { readClocks, type Clocks } from '../../utils/clocks';
import { RoomLight } from '../bench/RoomLight';

export interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const NAV = [
  { to: '/', label: 'Overview' },
  { to: '/projects', label: 'Work' },
  { to: '/experience', label: 'Experience' },
];

const BENCH_ZONE = 'Australia/Sydney';

/** The lamp. Three states, each carried by the words beside it as well as by the
 *  hue: the room is idle, something is under the lens, or the visitor has reached
 *  for something. */
const LAMP: Record<LensState, string> = {
  idle: 'bg-rule',
  under: 'bg-signal',
  reach: 'bg-spark',
};

/**
 * The bench clock and the visitor's, on a 20 s tick.
 *
 * The second clock is the humane half: a recruiter three zones away reads the
 * gap and knows immediately whether the person is awake, without converting
 * anything. Null until mounted — read during render, the prerendered HTML would
 * carry the build machine's zone and then disagree with the browser's at
 * hydration, and Node's ICU need not spell a zone the way the browser does.
 */
function useClocks(benchZone: string): Clocks | null {
  const [clocks, setClocks] = useState<Clocks | null>(null);

  useEffect(() => {
    // A zone the platform cannot resolve would throw inside the formatter, so the
    // bench's own clock is the fallback rather than a broken rail.
    let visitorZone = benchZone;
    try {
      visitorZone = Intl.DateTimeFormat().resolvedOptions().timeZone || benchZone;
    } catch {
      visitorZone = benchZone;
    }

    const tick = () => {
      try {
        setClocks(readClocks(new Date(), benchZone, visitorZone));
      } catch {
        setClocks(null);
      }
    };

    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, [benchZone]);

  return clocks;
}

const linkClass =
  'font-mono text-[11px] text-annotate underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-spark';

export const AppLayout: React.FC<AppLayoutProps> = ({ children, pageTitle }) => {
  const navigateWithTransition = useViewTransitionNavigate();
  const lens = useActiveReadout(pageTitle);
  const clocks = useClocks(BENCH_ZONE);
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
    <div className="min-h-screen text-ink flex flex-col">
      {/* The substrate itself is the body background; this only lights it. */}
      <RoomLight />
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
            <dl className="font-mono text-[11px] leading-snug text-annotate space-y-1">
              <div className="flex">
                <dt className="sr-only">Local time</dt>
                {/* The clock is reserved at the width a formatted time occupies, so
                    the placeholder filling in does not reflow the rail. */}
                <dd className="readout min-w-0">
                  <span className="inline-block w-[11ch] text-ink">{clocks?.here ?? '--:--'}</span>
                  {profile.location.replace(', Australia', '')}
                </dd>
              </div>
              {clocks?.yours && (
                <div className="flex">
                  <dt className="sr-only">Your time</dt>
                  <dd className="readout min-w-0">
                    <span className="inline-block w-[11ch] text-ink">{clocks.yours}</span>
                    your time{clocks.gap ? ` · ${clocks.gap}` : ''}
                  </dd>
                </div>
              )}
            </dl>

            <p className="readout mt-2.5 flex gap-2 font-mono text-[11px] leading-snug text-annotate min-h-[2.6em]">
              {/* The lamp: bark when the lens is over the room, brass while something
                  is under it, and the bench's warmer amber the moment the visitor
                  reaches for something. The readout line says which, in words. */}
              <span
                className={`mt-[0.35em] w-[5px] h-[5px] shrink-0 transition-colors ${LAMP[lens.state]}`}
              />
              <span>{lens.label ?? 'nothing under the lens'}</span>
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
