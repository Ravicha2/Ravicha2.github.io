import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export interface RouteAnnouncerProps {
  pageTitle: string;
}

/**
 * Announces client-side navigations. It deliberately does NOT move focus into
 * `main`: the skip link and the header nav sit before `main` in DOM order, so
 * focusing `main` made both unreachable with forward Tab. Instead each real
 * navigation resets focus to the document start, so forward Tab re-enters the
 * page at the skip link, and the live region carries the context.
 */
export const RouteAnnouncer: React.FC<RouteAnnouncerProps> = ({ pageTitle }) => {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('');
  // Seeded with the entry pathname so the initial mount (and StrictMode's second
  // effect pass, which re-runs this with the same pathname) stays silent.
  const announcedPathname = useRef(location.pathname);

  useEffect(() => {
    document.title = `${pageTitle} | Palm Suksawasdi`;

    if (announcedPathname.current === location.pathname) return;
    announcedPathname.current = location.pathname;

    setAnnouncement(`Navigated to ${pageTitle}`);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [location.pathname, pageTitle]);

  return (
    <div
      id="route-announcer"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};

export default RouteAnnouncer;
