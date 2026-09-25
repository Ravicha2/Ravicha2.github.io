import React from 'react';
import { profile } from '../../data/profile';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

const linkClass =
  'font-mono text-[11px] uppercase tracking-widest text-annotate underline underline-offset-4 decoration-1 decoration-annotate hover:text-ink hover:decoration-ink rounded';

/**
 * Closing block: the address as visible, selectable text plus a copy button, the
 * outbound profiles, and one factual availability line.
 *
 * There is no status pill, badge, or dot — a sentence is information, a pill is
 * decoration, and the sheet has no vocabulary for decoration.
 */
export const ContactBlock: React.FC = () => {
  const { state, copy } = useCopyToClipboard();

  return (
    <section aria-labelledby="contact-heading" className="rule-verified pt-4 space-y-4">
      <h2
        id="contact-heading"
        className="text-xl sm:text-2xl font-semibold tracking-[-0.01em]"
      >
        Get in touch
      </h2>

      <p className="measure text-sm sm:text-base leading-relaxed">{profile.status}</p>

      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        {/* Plain text, not an anchor: a mailto: silently no-ops on managed machines,
            so the readable address has to be selectable and copyable on its own. */}
        <span className="font-mono text-[13px] break-all select-text">{profile.email}</span>
        <button
          type="button"
          onClick={() => copy(profile.email)}
          className="font-mono text-[11px] uppercase tracking-widest text-annotate underline underline-offset-4 decoration-1 decoration-annotate hover:text-ink hover:decoration-ink rounded"
        >
          <span aria-live="polite">
            {state === 'copied' ? 'Copied' : state === 'error' ? 'Copy failed' : 'Copy'}
          </span>
        </button>
      </div>

      <p className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
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
        <span className="font-mono text-[11px] text-annotate">{profile.location}</span>
      </p>
    </section>
  );
};

export default ContactBlock;
