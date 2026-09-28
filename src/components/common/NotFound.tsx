import type React from 'react';
import { TransitionLink } from './TransitionLink';

export interface NotFoundProps {
  /** The page's only h1. */
  title?: string;
  message?: string;
  /** Where the way back goes. */
  backTo?: string;
  backLabel?: string;
}

/**
 * A dead end, said out loud: a heading, a sentence, and one way back. It serves
 * both the unknown route and an unknown project slug — a mistyped or stale deep
 * link used to render an empty `<main>` with no heading and nothing to click.
 */
export const NotFound: React.FC<NotFoundProps> = ({
  title = 'Page not found',
  message = 'The page you are looking for does not exist or has been moved.',
  backTo = '/',
  backLabel = 'Back to overview',
}) => (
  <div className="space-y-6 py-16">
    <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">{title}</h1>
    <p className="measure text-sm leading-relaxed text-annotate">{message}</p>
    <p className="pt-2">
      <TransitionLink
        to={backTo}
        className="font-mono text-[11px] text-ink underline decoration-signal underline-offset-4 transition-colors hover:decoration-[3px]"
      >
        {backLabel}
      </TransitionLink>
    </p>
  </div>
);

export default NotFound;
