import type React from 'react';
import { profile } from '../data/profile';
import { TransitionLink } from '../components/common/TransitionLink';

const linkClass =
  'font-mono text-[11px] text-annotate underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-spark';

const Block: React.FC<{ id: string; heading: string; children: React.ReactNode }> = ({
  id,
  heading,
  children,
}) => (
  <section aria-labelledby={id} className="mark-thin pt-6">
    <h2 id={id} className="text-xl sm:text-2xl font-semibold tracking-[-0.015em] text-pretty">
      {heading}
    </h2>
    <div className="mt-5 space-y-5">{children}</div>
  </section>
);

export const PrivacyView: React.FC = () => (
  <div className="space-y-14 sm:space-y-16">
    <section aria-labelledby="privacy-heading">
      <h1
        id="privacy-heading"
        className="text-[clamp(1.7rem,3.6vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-pretty"
      >
        Privacy
      </h1>
      <p className="measure mt-4 text-sm sm:text-[15px] leading-relaxed text-annotate text-pretty">
        This is a static personal portfolio. It has no accounts, no forms, no shopping cart, and no
        application server, so most of what a privacy page usually has to describe does not exist
        here. What follows is the short list of what is actually true, including the parts that are
        outside this site's control. Last reviewed for accuracy against the deployed build.
      </p>
    </section>

    <Block id="collected-heading" heading="What this site collects">
      <p className="measure text-[13px] leading-relaxed text-annotate text-pretty">
        Nothing. There is no analytics script, no tag manager, no session recorder, no heatmap, no
        advertising pixel, and no cookie set by this site. No account is created when you read a page,
        and no identifier is assigned to you. The one input on the site — the copy button next to the
        email address — writes to your own clipboard and sends nothing anywhere, because there is
        nowhere for it to send.
      </p>
    </Block>

    <Block id="third-parties-heading" heading="Third parties that do see the request">
      <p className="measure text-[13px] leading-relaxed text-annotate text-pretty">
        The site is published with GitHub Pages, so the HTTP request reaches GitHub's
        infrastructure before it reaches a file. GitHub may record ordinary server-log data — IP
        address, user agent, the path requested, and the time — under{' '}
        <a
          href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
          className={linkClass}
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub's privacy statement
        </a>
        , which this site does not control and cannot inspect. Nothing else is loaded from a
        third-party origin: the fonts are self-hosted from <code>/fonts/</code> rather than fetched
        from a font CDN, so reading a page does not disclose the visit to a font service, and the
        images are served from this domain.
      </p>
      <p className="measure text-[13px] leading-relaxed text-annotate text-pretty">
        Links out — GitHub, LinkedIn, PyPI, IEEE Xplore, and the live demos named on project pages —
        leave this site. Once you follow one, that service's own policy applies and this one no
        longer does.
      </p>
    </Block>

    <Block id="cookies-heading" heading="Cookies and local storage">
      <p className="measure text-[13px] leading-relaxed text-annotate text-pretty">
        This site sets no cookies and writes nothing to <code>localStorage</code> or{' '}
        <code>sessionStorage</code>. The only values it keeps in the browser live in memory for as
        long as the tab is open: which project filter is selected, and whether the copy button
        recently succeeded. Closing the tab discards them.
      </p>
    </Block>

    <Block id="personal-data-heading" heading="Personal data on this site">
      <p className="measure text-[13px] leading-relaxed text-annotate text-pretty">
        The pages publish {profile.name}'s own professional details — name, role, location, email
        address, employer and university history, and links to public profiles — because that is what
        a portfolio is for. No third party's personal data is published: the people named in project
        acknowledgements and paper authorships are named as public co-authors of public work, and
        nothing beyond a public author list belongs here.
      </p>
    </Block>

    <Block id="agent-data-heading" heading="Agents and machine readers">
      <p className="measure text-[13px] leading-relaxed text-annotate text-pretty">
        The machine-readable surface of this site — the OpenAPI document at{' '}
        <a href="/openapi.json" className={linkClass}>
          /openapi.json
        </a>
        , the dossiers at{' '}
        <a href="/llms.txt" className={linkClass}>
          /llms.txt
        </a>{' '}
        and{' '}
        <a href="/llms-full.txt" className={linkClass}>
          /llms-full.txt
        </a>
        , and the markdown twins of the content pages — describes the same person as the HTML. None of
        those documents carries anything the human pages do not, and none of them is generated per
        visitor. There is no hidden field, no visitor-specific payload, and no prompt content
        addressed to a model: everything an agent can fetch is the same bytes every reader gets.
      </p>
    </Block>

    <Block id="rights-heading" heading="Requests and corrections">
      <p className="measure text-[13px] leading-relaxed text-annotate text-pretty">
        Because no personal data is collected here, there is no stored record to export or delete. If
        you believe something published on this site is wrong, private, or should not be public,
        write to{' '}
        <a href={profile.links.email} className={linkClass}>
          {profile.email}
        </a>{' '}
        and say which page and which detail; the content comes from files in a public repository, so a
        correction is a one-line change that propagates to every page reading it.
      </p>
    </Block>

    <Block id="changes-heading" heading="Changes to this page">
      <p className="measure text-[13px] leading-relaxed text-annotate text-pretty">
        If the site ever adds something that collects data — even a newsletter signup or a privacy-
        friendly counter — this page will say what it is, what it stores, and where, at the same time
        the feature ships rather than after. Until then, this page describes a site with nothing to
        disclose, and it says so plainly rather than importing boilerplate about data this site never
        receives.
      </p>
    </Block>

    <Block id="more-heading" heading="Related pages">
      <p className="measure text-[13px] leading-relaxed text-annotate">
        The person behind the data is described at{' '}
        <TransitionLink to="/about" className={linkClass}>
          /about
        </TransitionLink>
        , the way to reach them is at{' '}
        <TransitionLink to="/contact" className={linkClass}>
          /contact
        </TransitionLink>
        , and the machine-readable API is documented at{' '}
        <TransitionLink to="/docs" className={linkClass}>
          /docs
        </TransitionLink>
        .
      </p>
    </Block>
  </div>
);

export default PrivacyView;
