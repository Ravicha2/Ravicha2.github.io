import type React from 'react';
import { apiEndpoints, openApiDocument } from '../data/api';
import { TransitionLink } from '../components/common/TransitionLink';

const linkClass =
  'font-mono text-[11px] text-annotate underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-spark';

const primaryLink =
  'font-mono text-[12px] text-ink underline decoration-signal underline-offset-4 transition-colors hover:decoration-[3px]';

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

const Code: React.FC<{ label?: string; children: React.ReactNode }> = ({ label, children }) => (
  <figure className="space-y-2">
    {label && <figcaption className="font-mono text-[11px] text-annotate">{label}</figcaption>}
    <pre className="well overflow-x-auto px-3 py-2 font-mono text-[11px] leading-relaxed text-ink">
      <code>{children}</code>
    </pre>
  </figure>
);

/** One operation, spelled out: what it returns and a request that really works. */
const Operation: React.FC<{ index: number }> = ({ index }) => {
  const endpoint = apiEndpoints[index];
  return (
    <article className="space-y-2">
      <h3 className="font-mono text-[12px] text-ink">
        <span className="text-annotate">GET</span> {endpoint.path}
      </h3>
      <p className="measure text-[13px] leading-relaxed text-annotate">
        {endpoint.summary} Returns {endpoint.returns.toLowerCase()} as{' '}
        <code>{endpoint.contentType}</code>. <code>operationId</code>:{' '}
        <code>{endpoint.operationId}</code>.
      </p>
      <Code label="Request">
        {`curl -sS -i https://ravicha2.github.io${endpoint.path}`}
      </Code>
    </article>
  );
};

export const DocsView: React.FC = () => {
  const discoveryEnd = apiEndpoints.findIndex((e) => e.operationId === 'getArdCatalog') + 1;
  const contextStart = apiEndpoints.findIndex((e) => e.operationId === 'getLlmsTxt');

  return (
    <div className="space-y-14 sm:space-y-16">
      <section aria-labelledby="docs-heading">
        <h1
          id="docs-heading"
          className="text-[clamp(1.7rem,3.6vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-pretty"
        >
          API reference
        </h1>
        <p className="measure mt-4 text-sm sm:text-[15px] leading-relaxed text-annotate text-pretty">
          The published OpenAPI 3.1 document describes {apiEndpoints.length} operations, all of them
          GETs of documents that really exist at the URLs given. This page is a rendering of that
          document, not a second source: the tables and the spec come from one list, so a path cannot
          be documented here without also being declared there.
        </p>
        <p className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <a href="/openapi.json" className={primaryLink}>
            /openapi.json
          </a>
          <TransitionLink to="/developers" className={linkClass}>
            Developer portal
          </TransitionLink>
          <a href="/auth.md" className={linkClass}>
            /auth.md
          </a>
        </p>
      </section>

      <Block
        id="base-url-heading"
        heading="Base URL"
        annotation="One origin, no version prefix in the path. The API version is carried in the document."
      >
        <Code>{`https://ravicha2.github.io`}</Code>
        <p className="measure text-[13px] leading-relaxed text-annotate">
          Every path below is relative to it. There is no <code>api.</code> subdomain: the documents
          are served from the same origin as the pages that describe them, which is what lets the
          discovery files and the pages cite each other without a cross-origin hop.
        </p>
      </Block>

      <Block
        id="auth-heading"
        heading="Authentication"
        annotation="Required: no. Documented anyway, because an agent should not have to prove that by trying."
      >
        <p className="measure text-[13px] leading-relaxed text-annotate">
          {openApiDocument['x-authentication'].note} The spec publishes no{' '}
          <code>securitySchemes</code> and no operation declares a <code>security</code> requirement,
          so a conforming client will send no credential and will be answered in full. The walkthrough
          an agent is expected to read first is at{' '}
          <a href="/auth.md" className={linkClass}>
            /auth.md
          </a>
          ; the machine-readable equivalent is at{' '}
          <a href="/.well-known/oauth-protected-resource" className={linkClass}>
            /.well-known/oauth-protected-resource
          </a>
          .
        </p>
      </Block>

      <Block
        id="conventions-heading"
        heading="Conventions"
        annotation="Four things an agent can rely on without checking, and one it cannot."
      >
        <ul className="measure space-y-3 text-[13px] leading-relaxed text-annotate">
          <li>
            <span className="text-ink">Read-only.</span> No <code>POST</code>, <code>PUT</code>,{' '}
            <code>PATCH</code> or <code>DELETE</code> is implemented on any path. A write method is
            answered the way an unknown path is.
          </li>
          <li>
            <span className="text-ink">Content types are real.</span> GitHub Pages derives the type
            from the file extension, so <code>.json</code> is served as{' '}
            <code>application/json</code> and <code>.md</code> as <code>text/markdown</code>. The
            types in the tables are the types on the wire.
          </li>
          <li>
            <span className="text-ink">Errors are HTML.</span> An unmatched path returns the site 404
            document as <code>text/html</code>, not JSON. That is the one convention this API breaks,
            and the reason is the host rather than the design — see the named gap on the{' '}
            <TransitionLink to="/developers" className={linkClass}>
              developer portal
            </TransitionLink>
            .
          </li>
          <li>
            <span className="text-ink">No pagination.</span> No operation returns a collection large
            enough to page. The lists inside documents are complete.
          </li>
        </ul>
      </Block>

      <Block
        id="discovery-heading"
        heading="Discovery operations"
        annotation="What to fetch to learn what is here. Each one is a document an agent can act on without a human reading it first."
      >
        {apiEndpoints.slice(0, discoveryEnd).map((_, index) => (
          <Operation key={apiEndpoints[index].operationId} index={index} />
        ))}
      </Block>

      <Block
        id="context-heading"
        heading="Context operations"
        annotation="What to fetch to learn what the work is. These are the ones worth reading in full."
      >
        {apiEndpoints.slice(contextStart).map((_, offset) => (
          <Operation key={apiEndpoints[contextStart + offset].operationId} index={contextStart + offset} />
        ))}
      </Block>

      <Block
        id="schema-heading"
        heading="Schemas"
        annotation="Five documents are JSON; the rest are prose. The five have shapes, and every shape is named in the spec."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-[11px]">
            <caption className="sr-only">
              The declared component schemas, and the operation that returns each one.
            </caption>
            <thead>
              <tr className="border-b border-rule">
                <th scope="col" className="py-2 pr-4 font-semibold text-ink">
                  Schema
                </th>
                <th scope="col" className="py-2 pr-4 font-semibold text-ink">
                  Required fields
                </th>
                <th scope="col" className="py-2 font-semibold text-ink">
                  Served at
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(openApiDocument.components.schemas).map(([name, schema]) => {
                const required = (schema as { required?: readonly string[] }).required ?? [];
                const path = apiEndpoints.find(
                  (e) =>
                    e.operationId ===
                    {
                      Problem: '',
                      McpServerCard: 'getMcpServerCard',
                      Linkset: 'getApiCatalog',
                      AgentSkillsIndex: 'getAgentSkillsIndex',
                      AgentCard: 'getAgentCard',
                      ProtectedResourceMetadata: 'getProtectedResourceMetadata',
                    }[name],
                );
                return (
                  <tr key={name} className="border-b border-rule align-top">
                    <td className="py-2 pr-4 text-ink">{name}</td>
                    <td className="py-2 pr-4 text-annotate">
                      {required.length > 0 ? required.join(', ') : '—'}
                    </td>
                    <td className="py-2 text-annotate">{path ? path.path : 'not served'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Block>
    </div>
  );
};

export default DocsView;
