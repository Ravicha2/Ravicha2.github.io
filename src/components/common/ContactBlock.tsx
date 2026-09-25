import React from 'react';
import { Mail, Copy, Check, AlertTriangle } from 'lucide-react';
import { profile } from '../../data/profile';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

const linkClass =
  'text-sm font-semibold text-text-secondary hover:text-accent-solid underline decoration-border-strong underline-offset-4 rounded transition-colors';

/**
 * Closing conversion block: the address as visible, selectable text plus a copy
 * button, the outbound profiles, and one factual availability line.
 *
 * Per spec §1.3 there is no status pill, badge, or dot here — a sentence is
 * information, a pill is decoration.
 */
export const ContactBlock: React.FC = () => {
  const { state, copy } = useCopyToClipboard();

  return (
    <section
      aria-labelledby="contact-heading"
      className="pt-8 border-t border-border-subtle space-y-4"
    >
      <h2
        id="contact-heading"
        className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary"
      >
        Get in touch
      </h2>

      <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl">
        {profile.status}
      </p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Mail className="w-4 h-4 text-accent-solid flex-shrink-0" aria-hidden="true" />
        {/* Plain text, not an anchor: a mailto: silently no-ops on managed machines,
            so the readable address has to be selectable and copyable on its own. */}
        <span className="font-mono text-sm text-text-primary break-all select-text">
          {profile.email}
        </span>
        <button
          type="button"
          onClick={() => copy(profile.email)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-canvas border border-border-subtle text-xs font-mono text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
        >
          <span aria-live="polite" className="inline-flex items-center gap-1.5">
            {state === 'copied' ? (
              <>
                <Check className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : state === 'error' ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                <span>Copy failed</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy</span>
              </>
            )}
          </span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <a href={profile.links.email} className={linkClass}>
          Email
        </a>
        <a
          href="/cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download CV (PDF, opens in a new tab)"
          className={linkClass}
        >
          CV (PDF)
        </a>
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          GitHub
        </a>
        <a
          href={profile.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          LinkedIn
        </a>
        <span className="font-mono text-xs text-text-muted">{profile.location}</span>
      </div>
    </section>
  );
};

export default ContactBlock;
