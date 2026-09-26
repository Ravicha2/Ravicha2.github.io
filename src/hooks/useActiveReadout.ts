import { useEffect, useState } from 'react';

/**
 * What the rail reads out: the artifact currently on screen.
 *
 * Any element carrying `data-readout` is a candidate, and the first one touching
 * the reading band (40% down the viewport) wins. The rail re-reads after each
 * route change, which is what `key` is for.
 *
 * This is deliberately a *duplicate* of content that is already on the page, so
 * the rail marks it `aria-hidden` and a screen reader loses nothing — and does
 * not get a live region chattering on every scroll.
 */
export function useActiveReadout(key: string): string | null {
  const [readout, setReadout] = useState<string | null>(null);

  useEffect(() => {
    setReadout(null);

    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-readout]'));
    if (nodes.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const onScreen = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target);
          else onScreen.delete(entry.target);
        }
        const first = nodes.find((node) => onScreen.has(node));
        setReadout(first?.dataset.readout ?? null);
      },
      { rootMargin: '-40% 0px -50% 0px' },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [key]);

  return readout;
}

export default useActiveReadout;
