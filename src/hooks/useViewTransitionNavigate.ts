import { useNavigate, type NavigateOptions } from 'react-router-dom';
import { useCallback } from 'react';
import { flushSync } from 'react-dom';

/**
 * Hook providing a navigate function wrapped in document.startViewTransition()
 * with synchronous DOM flushing and reduced motion support.
 */
export const useViewTransitionNavigate = () => {
  const navigate = useNavigate();

  const navigateWithTransition = useCallback(
    (to: string, options?: NavigateOptions) => {
      // Check if View Transitions API is available and reduced motion is not requested
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (
        typeof document !== 'undefined' &&
        'startViewTransition' in document &&
        typeof (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition ===
          'function' &&
        !prefersReducedMotion
      ) {
        (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
          flushSync(() => {
            navigate(to, options);
          });
        });
      } else {
        navigate(to, options);
      }
    },
    [navigate]
  );

  return navigateWithTransition;
};

export default useViewTransitionNavigate;

