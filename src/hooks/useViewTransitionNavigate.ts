import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate, useLocation, type NavigateOptions } from 'react-router-dom';
import { flushSync } from 'react-dom';

const ROUTE_INDEXES: Record<string, number> = {
  '/': 0,
  '/projects': 1,
  '/experience': 2,
};

interface ViewTransitionContextValue {
  activeSlug: string | null;
  navigateWithTransition: (to: string, options?: NavigateOptions, targetSlug?: string) => void;
}

const ViewTransitionContext = createContext<ViewTransitionContextValue | null>(null);

export const ViewTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const navigateWithTransition = useCallback(
    (to: string, options?: NavigateOptions, targetSlug?: string) => {
      // Check if View Transitions API is available and reduced motion is not requested
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const fromPath = location.pathname;
      const toPath = to.split('?')[0].split('#')[0];

      // Detect if navigating to or from a case study
      let slug: string | null = targetSlug || null;
      if (!slug) {
        if (toPath.startsWith('/projects/') && toPath !== '/projects') {
          slug = toPath.replace('/projects/', '');
        } else if (fromPath.startsWith('/projects/') && fromPath !== '/projects') {
          slug = fromPath.replace('/projects/', '');
        }
      }

      let direction: 'slide-left' | 'slide-right' | null = null;
      if (fromPath in ROUTE_INDEXES && toPath in ROUTE_INDEXES && fromPath !== toPath) {
        direction = ROUTE_INDEXES[toPath] > ROUTE_INDEXES[fromPath] ? 'slide-left' : 'slide-right';
      }

      if (
        typeof document !== 'undefined' &&
        'startViewTransition' in document &&
        typeof (document as unknown as { startViewTransition: (cb: () => void) => { finished?: Promise<void> } }).startViewTransition ===
          'function' &&
        !prefersReducedMotion
      ) {
        if (direction) {
          document.documentElement.dataset.transitionDirection = direction;
        } else {
          delete document.documentElement.dataset.transitionDirection;
        }

        if (slug) {
          setActiveSlug(slug);
        }

        const transition = (document as unknown as {
          startViewTransition: (cb: () => void) => { finished?: Promise<void> };
        }).startViewTransition(() => {
          flushSync(() => {
            navigate(to, options);
          });
        });

        if (transition && transition.finished && typeof transition.finished.finally === 'function') {
          transition.finished.finally(() => {
            delete document.documentElement.dataset.transitionDirection;
            setActiveSlug(null);
          });
        } else {
          delete document.documentElement.dataset.transitionDirection;
          setActiveSlug(null);
        }
      } else {
        if (typeof document !== 'undefined' && document.documentElement) {
          delete document.documentElement.dataset.transitionDirection;
        }
        setActiveSlug(null);
        navigate(to, options);
      }
    },
    [navigate, location.pathname]
  );

  return React.createElement(
    ViewTransitionContext.Provider,
    { value: { activeSlug, navigateWithTransition } },
    children
  );
};

/**
 * Hook providing a navigate function wrapped in document.startViewTransition()
 * with synchronous DOM flushing, directional slide detection, and reduced motion support.
 */
export const useViewTransitionNavigate = () => {
  const context = useContext(ViewTransitionContext);
  if (context) {
    return context.navigateWithTransition;
  }

  // Fallback if rendered outside provider (e.g. isolated unit tests)
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (to: string, options?: NavigateOptions) => {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const fromPath = location.pathname;
      const toPath = to.split('?')[0].split('#')[0];

      let direction: 'slide-left' | 'slide-right' | null = null;
      if (fromPath in ROUTE_INDEXES && toPath in ROUTE_INDEXES && fromPath !== toPath) {
        direction = ROUTE_INDEXES[toPath] > ROUTE_INDEXES[fromPath] ? 'slide-left' : 'slide-right';
      }

      if (
        typeof document !== 'undefined' &&
        'startViewTransition' in document &&
        typeof (document as unknown as { startViewTransition: (cb: () => void) => { finished?: Promise<void> } }).startViewTransition ===
          'function' &&
        !prefersReducedMotion
      ) {
        if (direction) {
          document.documentElement.dataset.transitionDirection = direction;
        } else {
          delete document.documentElement.dataset.transitionDirection;
        }

        const transition = (document as unknown as {
          startViewTransition: (cb: () => void) => { finished?: Promise<void> };
        }).startViewTransition(() => {
          flushSync(() => {
            navigate(to, options);
          });
        });

        if (transition && transition.finished && typeof transition.finished.finally === 'function') {
          transition.finished.finally(() => {
            delete document.documentElement.dataset.transitionDirection;
          });
        }
      } else {
        if (typeof document !== 'undefined' && document.documentElement) {
          delete document.documentElement.dataset.transitionDirection;
        }
        navigate(to, options);
      }
    },
    [navigate, location.pathname]
  );
};

export const useActiveTransitionSlug = () => {
  const context = useContext(ViewTransitionContext);
  return context ? context.activeSlug : null;
};

export default useViewTransitionNavigate;

