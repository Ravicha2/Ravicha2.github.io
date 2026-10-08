# ADR 0004: Accept HTML 404s from GitHub Pages and state the limitation

## Context
`improve_agent.md` asks this origin to answer a failing request in a machine-readable
form: a markdown error body when an agent sends `Accept: text/markdown` (item 1), a
structured JSON error envelope (item 4), and markdown content negotiation on the
homepage with `Vary: Accept` (item 5). The audit scores item 1 partial and items 4
and 5 failed.

The origin is a static GitHub Pages site. Verified live on 2026-10-08: GitHub Pages
serves `404.html` as `text/html; charset=utf-8` for **every** unmatched path, ignores
`Accept`, and offers no way to set a response header. `404.md` is never consulted —
only a file named exactly `404.html`. The homepage's `Vary` header is `Accept-Encoding`
and cannot be changed. A markdown error body, a JSON error envelope and `Vary: Accept`
are therefore structurally unreachable on bare Pages.

Two facts narrow the problem. First, `/index.md` and every route's `.md` twin are
already served as `text/markdown` because Pages derives the content type from the file
extension; that satisfies `markdown-negotiation` **option (b)** — a static root markdown
file — with no header work and no edge layer. Second, the correct 404 status is already
returned. What remains unreachable is item 1's markdown body and item 4's JSON envelope,
roughly five points in the audit model.

Three honest resolutions were considered:

1. **Accept and state it.** Publish the limitation, keep the correct 404 status, and
   stop claiming the missing points are available.
2. **Put an edge layer in front** (a Cloudflare Worker or a handler on another host)
   that reads `Accept` and rewrites the 404 body.
3. **Change the hosting** behind the existing domain so the origin itself can negotiate.

## Decision
We adopt **Option 1: accept the limitation and state it.**

- The correct HTTP 404 status stays.
- `/openapi.json` documents the real `text/html` 404 in `x-error-model`, and every
  operation's `404` response names `text/html` as its media type. The RFC 9457
  `application/problem+json` envelope is described under `components.schemas.Problem`
  but marked **not served**.
- Every document and page that could imply a markdown or JSON error body, a `Vary:
  Accept` header, or content negotiation on the homepage is corrected to say what the
  origin actually does. The `.md` twins keep their true claim: they are served as
  `text/markdown` **by file extension**, not by negotiation.
- `tests/agent-protocols.test.ts` pins the wording, so the honesty cannot rot.

Items 1 and 4 — and the `Vary: Accept` variant of item 5 — are recorded as **knowingly
unreachable on this host**, not as work still waiting to be done.

## Rejected alternatives
**Option 2 — an edge layer.** Rejected. It would recover items 1 and 4 (and item 5's
`Vary` variant) at the cost of a second deployment target in front of the first, a
second place for the site to drift, a deploy no longer describable as a static
`git push`, and a runtime the portfolio does not otherwise have. The gain is about five
audit points; the cost is a permanent component that must be maintained, secured and
kept in sync with the origin it proxies. A decision that trades a self-describing static
site for a proxy has to buy more than this.

**Option 3 — change the hosting.** Rejected. It recovers the same points with a larger
blast radius: the build, the deploy workflow and the `404.html` SPA shim all change, and
the domain is re-plumbed. It buys nothing option 2 does not already buy and is the
hardest of the three to reverse. If the site ever needs a real origin that is a separate
decision, with its own ADR — not a rider on an audit item.

## Consequences
### Positive
- **Zero new infrastructure and zero new points claimed.** The site stays a set of static
  files that a `git push` describes completely.
- **The correct 404 status is preserved**, and the markdown surface that already works —
  `/index.md` and every `.md` twin, served as `text/markdown` — is untouched.
- **The gap is stated where an agent reads it** (`x-error-model`, `/docs`, `/developers`)
  rather than hidden, and every statement is checkable against a live `curl`.

### Negative / Trade-offs
- **Items 1 and 4 remain unreachable, and item 5's `Vary: Accept` variant with them —
  roughly five audit points knowingly forgone.** On this host the JSON envelope is not
  merely unbuilt; it cannot be built without the edge layer rejected above.
- An agent that sends `Accept: application/problem+json` or `Accept: text/markdown` to an
  unmatched path still receives HTML and must branch on the **404 status** rather than
  parse a body. The spec says so, but the failure mode remains.
- `components.schemas.Problem` is published with no served operation: deleting it would
  lose the intended shape, and serving it is impossible. It is documented as not served,
  and a test pins that.
- The `markdown-negotiation` option (b) point rests on **extension-based** content types,
  not on negotiation. Pages serves `.md` as `text/markdown` but will not vary the homepage
  on `Accept`. The claim must stay phrased as "served by extension", never as "negotiated".
- The same limitation has to be stated in `/auth.md` (issue #39). That document does not
  exist on this branch; when it is added it must carry the same sentence, not a promise of
  a JSON error body.
- If an edge layer is added later, this ADR is superseded and the `x-error-model` note,
  the `/docs` and `/developers` copy, and `tests/agent-protocols.test.ts` all change with it.
