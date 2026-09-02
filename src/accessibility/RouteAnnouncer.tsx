import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export interface RouteAnnouncerProps {
  pageTitle: string;
  mainRef: React.RefObject<HTMLElement | null>;
}

export const RouteAnnouncer: React.FC<RouteAnnouncerProps> = ({ pageTitle, mainRef }) => {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('');
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      document.title = `${pageTitle} | Palm Suksawasdi`;
      return;
    }

    document.title = `${pageTitle} | Palm Suksawasdi`;
    setAnnouncement(`Navigated to ${pageTitle}`);

    if (mainRef.current) {
      mainRef.current.focus({ preventScroll: true });
    }
  }, [location.pathname, pageTitle, mainRef]);

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
