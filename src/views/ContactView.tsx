import type React from 'react';
import { profile } from '../data/profile';
import { TransitionLink } from '../components/common/TransitionLink';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { Block, PageHead } from '../components/common/PageBlocks';

const linkClass =
  'font-mono text-[11px] text-annotate underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-spark';

export const ContactView: React.FC = () => {
  const { copy, state } = useCopyToClipboard();

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHead
        id="contact-page-heading"
        title="Contact"
        lead={
          <>
            One inbox, read by {profile.preferredName} directly. There is no form, no ticket queue, and
            no autoresponder on this page — a static site cannot receive a submission, so the site
            points at the channel that actually reaches a person instead of rendering a form that
            silently drops it.
          </>
        }
      />

      <Block id="email-heading" heading="Email">
        <p className="measure text-sm leading-relaxed">
          For anything — a role, a question about a project, a correction to something on this site.
        </p>
        <p className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <a
            href={profile.links.email}
            className="select-all font-mono text-[15px] text-ink underline decoration-signal underline-offset-4 transition-colors hover:decoration-[3px]"
          >
            {profile.email}
          </a>
          <button
            type="button"
            onClick={() => copy(profile.email)}
            className="touch-target font-mono text-[11px] uppercase tracking-[0.06em] text-annotate underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-spark"
          >
            <span aria-live="polite">
              {state === 'copied' ? 'Copied' : state === 'error' ? 'Failed' : 'Copy'}
            </span>
          </button>
        </p>
      </Block>

      <Block id="elsewhere-heading" heading="Elsewhere">
        <ul className="measure space-y-3 text-sm leading-relaxed">
          <li>
            <span className="text-ink">GitHub</span> —{' '}
            <a href={profile.links.github} className={linkClass} rel="noopener noreferrer" target="_blank">
              {profile.links.github}
            </a>
            . The repositories behind every project catalogued here, with the commits the case studies
            quote.
          </li>
          <li>
            <span className="text-ink">LinkedIn</span> —{' '}
            <a href={profile.links.linkedin} className={linkClass} rel="noopener noreferrer" target="_blank">
              {profile.name}
            </a>
            . The professional record, kept in step with{' '}
            <TransitionLink to="/experience" className={linkClass}>
              /experience
            </TransitionLink>
            .
          </li>
          <li>
            <span className="text-ink">Curriculum vitae</span> —{' '}
            <a href="/cv.pdf" className={linkClass}>
              /cv.pdf
            </a>
            . The printable form of the same facts, for a system that wants a file.
          </li>
        </ul>
      </Block>

      <Block id="availability-heading" heading="Availability">
        <p className="measure text-sm leading-relaxed">{profile.status}</p>
        <p className="measure text-sm leading-relaxed">
          {profile.narrative.target}
        </p>
      </Block>

      <Block id="response-heading" heading="What to expect">
        <p className="measure text-sm leading-relaxed">
          A reply from a person, usually within a couple of days. If you are an agent acting for
          someone, the machine-readable contact record is the <code>email</code> field on the{' '}
          <code>Person</code> entity in this page's JSON-LD — the same address, in the form a tool can
          parse. There is no support commitment attached to it, and no service level to quote.
        </p>
      </Block>

      <Block id="corrections-heading" heading="Corrections">
        <p className="measure text-sm leading-relaxed">
          Claims on this site are pinned to public artifacts, so a wrong one is usually checkable and
          worth reporting. If a figure does not hold against the commit it cites, say which page and
          which figure — the correction will be made in the data, and every page that reads it will
          follow.
        </p>
      </Block>
    </div>
  );
};

export default ContactView;
