import { useNavigate, useLocation, type NavigateOptions } from 'react-router-dom';
import { useCallback } from 'react';
import { flushSync } from 'react-dom';

const ROUTE_INDEXES: Record<string, number> = {
  '/': 0,
  '/projects': 1,
  '/experience': 2,
};

/**
 * Hook providing a navigate function wrapped in document.startViewTransition()
 * with synchronous DOM flushing, directional slide detection, and reduced motion support.
 */
export const useViewTransitionNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithTransition = useCallback(
    (to: string, options?: NavigateOptions) => {
      // Check if View Transitions API is available and reduced motion is not requested
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

  return navigateWithTransition;
};

export default useViewTransitionNavigate;

