import { useEffect, useState } from 'react';

/** What the lens is over. `idle` is the room; `under` is the reading band; `reach`
 *  is the thing the visitor has actually pointed at or focused on. */
export type LensState = 'idle' | 'under' | 'reach';

export interface Lens {
  /** The unit of work under the lens, named the way the bench names it. */
  label: string | null;
  state: LensState;
}

const IDLE: Lens = { label: null, state: 'idle' };

/**
 * What the rail reads out: the unit of work currently under the lens.
 *
 * Any element carrying `data-readout` is a candidate, and there are two channels
 * into the readout. The first is the reading band — the first candidate touching
 * 40% down the viewport wins, which is what the instrument reports while the
 * visitor reads. The second is reach: a pointer over a candidate, or keyboard
 * focus on one, takes the lens immediately, so the rail answers what the visitor
 * is handling rather than only what happens to be scrolling past. Both channels
 * are the same instrument, and neither is the only way to reach it.
 *
 * The readout deliberately duplicates content that is already on the page, so the
 * rail marks it `aria-hidden` and a screen reader loses nothing — and does not get
 * a live region chattering on every scroll. `key` re-reads after each route change.
 */
export function useActiveReadout(key: string): Lens {
  const [lens, setLens] = useState<Lens>(IDLE);

  useEffect(() => {
    setLens(IDLE);

    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-readout]'));
    if (nodes.length === 0) return;

    const onScreen = new Set<Element>();
    let reached: HTMLElement | null = null;

    const labelOf = (node: Element) => (node as HTMLElement).dataset.readout ?? null;

    const report = () => {
      if (reached) {
        setLens({ label: labelOf(reached), state: 'reach' });
        return;
      }
      const first = nodes.find((node) => onScreen.has(node));
      setLens(first ? { label: labelOf(first), state: 'under' } : IDLE);
    };

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) onScreen.add(entry.target);
            else onScreen.delete(entry.target);
          }
          report();
        },
        { rootMargin: '-40% 0px -50% 0px' },
      );
      nodes.forEach((node) => observer?.observe(node));
    }

    const reach = (event: Event) => {
      const target = (event.target as Element | null)?.closest?.('[data-readout]');
      if (!(target instanceof HTMLElement) || target === reached) return;
      reached = target;
      report();
    };

    // A move inside the same candidate — parent to child, child to parent — fires
    // out and over on the way, so the release only counts once the pointer has
    // genuinely left the candidate it took.
    const release = (event: Event) => {
      if (!reached) return;
      const next = (event as PointerEvent).relatedTarget as Element | null;
      if (next?.closest?.('[data-readout]') === reached) return;
      reached = null;
      report();
    };

    document.addEventListener('pointerover', reach);
    document.addEventListener('pointerout', release);
    document.addEventListener('focusin', reach);
    document.addEventListener('focusout', release);

    return () => {
      observer?.disconnect();
      document.removeEventListener('pointerover', reach);
      document.removeEventListener('pointerout', release);
      document.removeEventListener('focusin', reach);
      document.removeEventListener('focusout', release);
    };
  }, [key]);

  return lens;
}

export default useActiveReadout;
