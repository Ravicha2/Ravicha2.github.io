import type React from 'react';
import { apiEndpoints, openApiDocument } from '../data/api';
import { profile } from '../data/profile';
import { TransitionLink } from '../components/common/TransitionLink';
import { ContactBlock } from '../components/common/ContactBlock';

const linkClass =
  'font-mono text-[11px] text-annotate underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-spark';

const primaryLink =
  'font-mono text-[12px] text-ink underline decoration-signal underline-offset-4 transition-colors hover:decoration-[3px]';

/** A ruled block, the same boundary the catalog and the case study use. */
const Block: React.FC<{ id: string; heading: string; annotation?: string; children: React.ReactNode }> = ({
  id,
  heading,
  annotation,
  children,
}) => (
  <section aria-labelledby={id} className="mark-thin pt-6">
    <h2 id={id} className="text-xl sm:text-2xl font-semibold tracking-[-0.015em] text-pretty">
      {heading}
    </h2>
    {annotation && (
      <p className="measure mt-2 text-[13px] leading-relaxed text-annotate">{annotation}</p>
    )}
    <div className="mt-5 space-y-5">{children}</div>
  </section>
);

/** A command a caller can paste. Not a code fence with a highlighted token: the
 *  point is that the string is exactly what to type. */
const Command: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <pre className="well overflow-x-auto px-3 py-2 font-mono text-[11px] leading-relaxed text-ink">
    <code>{children}</code>
  </pre>
);

export const DeveloperView: React.FC = () => (
  <div className="space-y-14 sm:space-y-16">
    <section aria-labelledby="developers-heading">
      <h1
        id="developers-heading"
        className="text-[clamp(1.7rem,3.6vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-pretty"
      >
        Developer portal
      </h1>
      <p className="measure mt-4 text-sm sm:text-[15px] leading-relaxed text-annotate text-pretty">
        The machine surface of this site: what an agent can fetch, what it gets back, and what it
        has to do to get it. Everything here is a real, public, static document — this is not a
        product with a sign-up form, and the page does not pretend otherwise.
      </p>
      <p className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <a href="/openapi.json" className={primaryLink}>
          OpenAPI 3.1 document
        </a>
        <TransitionLink to="/docs" className={linkClass}>
          API reference
        </TransitionLink>
        <a href="/llms.txt" className={linkClass}>
          llms.txt
        </a>
        <a href="/agents.md" className={linkClass}>
          agents.md
        </a>
      </p>
    </section>

    <Block
      id="quickstart-heading"
      heading="Quickstart"
      annotation="Three fetches from cold, in the order that wastes the least of an agent's context. No key, no registration, no wait."
    >
      <Command>{`curl -sS https://ravicha2.github.io/openapi.json`}</Command>
      <p className="measure text-[13px] leading-relaxed text-annotate">
        The spec. Enumerate every operation from here; each one carries an <code>operationId</code>{' '}
        and a description, so a function-calling client can build its tool list without reading this
        page.
      </p>
      <Command>{`curl -sS https://ravicha2.github.io/agents.md`}</Command>
      <p className="measure text-[13px] leading-relaxed text-annotate">
        When to use this material and when not to. Read before deciding the site is relevant — it is
        the one page written to lose a reader for the right reason.
      </p>
      <Command>{`curl -sS https://ravicha2.github.io/index.md`}</Command>
      <p className="measure text-[13px] leading-relaxed text-annotate">
        The homepage as markdown. Appending <code>.md</code> to any content route returns that page
        as <code>text/markdown</code>, so an agent never has to strip HTML to read a case study.
      </p>
    </Block>

    <Block
      id="auth-heading"
      heading="Authentication"
      annotation="One sentence, because this is the whole of it."
    >
      <p className="measure text-[13px] leading-relaxed text-annotate">
        {openApiDocument['x-authentication'].note} There is no key to request, no token to refresh,
        and no scope to select; a request with no <code>Authorization</code> header is answered in
        full. The long form, written to the WorkOS <code>auth.md</code> shape, is at{' '}
        <a href="/auth.md" className={linkClass}>
          /auth.md
        </a>
        .
      </p>
    </Block>

    <Block
      id="keys-heading"
      heading="API keys"
      annotation="Stated plainly rather than staged. A fake sign-up form is worse than none: it costs an agent a turn and teaches it to distrust the domain."
    >
      <p className="measure text-[13px] leading-relaxed text-annotate">
        No API keys are issued, and none are needed. The origin is a set of static files on GitHub
        Pages; there is nothing to rate-limit, nothing to meter, and nothing a key could gate. If a
        keyed surface is ever published, it will be announced in{' '}
        <a href="/llms.txt" className={linkClass}>
          /llms.txt
        </a>{' '}
        and described here with its issuer and scopes before it goes live.
      </p>
    </Block>

    <Block
      id="sandbox-heading"
      heading="Sandbox"
      annotation="The whole surface is a sandbox: every operation is a GET of a public document."
    >
      <p className="measure text-[13px] leading-relaxed text-annotate">
        There is no production data to damage, so there is no separate test mode and no fixture
        server pretending to be one. Read anything, as often as you like. If you want an isolated
        copy, mirror the documents in{' '}
        <a href="/openapi.json" className={linkClass}>
          /openapi.json
        </a>{' '}
        — they are static and version-pinned by URL.
      </p>
    </Block>

    <Block
      id="rate-limits-heading"
      heading="Rate limits"
      annotation="What is true, rather than what sounds like an API."
    >
      <p className="measure text-[13px] leading-relaxed text-annotate">
        None are imposed in software, because the documents are static and cached at the edge.
        GitHub Pages applies its own fair-use limits to the origin and may answer an unusual burst
        with an HTML error page. Be considerate and there is nothing else to know.
      </p>
    </Block>

    <Block
      id="errors-heading"
      heading="Errors"
      annotation="The gap here is real and is named rather than papered over."
    >
      <p className="measure text-[13px] leading-relaxed text-annotate">
        {openApiDocument['x-error-model'].note}
      </p>
      <p className="measure text-[13px] leading-relaxed text-annotate">
        The intended envelope is declared in the spec as{' '}
        <code>components.schemas.Problem</code>, so a client can be written against it today and will
        not need changing when this origin can send it.
      </p>
    </Block>

    <Block
      id="endpoints-heading"
      heading={`Endpoints (${apiEndpoints.length})`}
      annotation="Every operation the spec declares. The table is generated from the same list the spec is, so the two cannot drift."
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left font-mono text-[11px]">
          <caption className="sr-only">
            Every operation in the published OpenAPI document, with the media type it returns.
          </caption>
          <thead>
            <tr className="border-b border-rule">
              <th scope="col" className="py-2 pr-4 font-semibold text-ink">
                Path
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold text-ink">
                operationId
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold text-ink">
                Returns
              </th>
              <th scope="col" className="py-2 font-semibold text-ink">
                Content type
              </th>
            </tr>
          </thead>
          <tbody>
            {apiEndpoints.map((endpoint) => (
              <tr key={endpoint.operationId} className="border-b border-rule align-top">
                <td className="py-2 pr-4 text-ink">
                  <a
                    href={endpoint.path}
                    className="underline decoration-rule underline-offset-4 transition-colors hover:decoration-spark"
                  >
                    {endpoint.path}
                  </a>
                </td>
                <td className="py-2 pr-4 text-annotate">{endpoint.operationId}</td>
                <td className="py-2 pr-4 text-annotate">{endpoint.returns}</td>
                <td className="py-2 text-annotate">{endpoint.contentType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Block>

    <Block
      id="mcp-heading"
      heading="MCP server"
      annotation="A first-party Model Context Protocol server is published with the lit-review-council project."
    >
      <p className="measure text-[13px] leading-relaxed text-annotate">
        Its Server Card — the transport and address, with no tool list, because agents read tools
        from the server itself — is at{' '}
        <a href="/.well-known/mcp" className={linkClass}>
          /.well-known/mcp
        </a>
        . The Python distribution that carries it is{' '}
        <a href="https://pypi.org/project/lit-review-council/" className={linkClass}>
          lit-review-council on PyPI
        </a>
        , and the card names that package, so an agent can go from discovery to installation without
        a second lookup.
      </p>
    </Block>

    <Block
      id="contact-heading-dev"
      heading="Reaching a person"
      annotation="There is no support desk behind a static site. There is an inbox, and it is read."
    >
      <p className="measure text-[13px] leading-relaxed text-annotate">
        {profile.name} maintains these documents. Anything wrong in them — a stale path, a shape that
        does not match — is worth an email to{' '}
        <a href={profile.links.email} className={linkClass}>
          {profile.email}
        </a>
        .
      </p>
    </Block>

    <ContactBlock />
  </div>
);

export default DeveloperView;
