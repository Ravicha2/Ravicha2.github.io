# ADR 0005: WebMCP is browser-mediated — no discovery document, and `/.well-known/mcp` stays the MCP Server Card

## Context

On 2026-10-13 an external agent walked this origin's discovery paths and reported two
things: that the site "advertises its Lit-Review-Council server", and that "webmcp in the
sense of a browser-callable tool endpoint isn't there yet." Both observations are true.
Neither is a defect, and the second is not something this origin can fix by adding a file.
The full argument, the spec quotations and the audit trail are in issue #50; this ADR
records the decision so the next reader does not have to re-derive it.

Two protocols share the word *MCP*, and conflating them is what produced the report.

| | Backend MCP | WebMCP |
| --- | --- | --- |
| Where the code runs | A server process the client spawns or calls | The page's own JavaScript, in the visitor's browser |
| How tools are declared | `tools/list` over a transport | `document.modelContext.registerTool()` on load |
| How a tool is discovered | A client handshake, and a Server Card at `/.well-known/mcp` | The attached agent asks the open document (`getTools()`, `toolchange`) |
| Reachable by a crawler | Yes | No — a document must be loaded in a supporting browser |

The WebMCP explainer defines **imperative registration only**, and rejects static
declarative manifests under *Alternatives Considered* §2: "Static manifests prevent web
developers from dynamically adding, updating, or removing tools based on the active page
state or user authentication status. Manifests cannot contain executable code." No
well-known path appears anywhere in it, and headless agents are an explicit non-goal: the
API "is not intended for fully autonomous agents where a browser UI is not present."
Background discovery is a future direction proposed in the supplementary service-worker
explainer, not a shipped mechanism.

This origin already publishes both surfaces honestly, from one source each:

- **The portfolio tools.** `src/webmcp/tools.ts` registers `search-projects`,
  `get-project` and `describe-site`, read-only, every handler reading `src/data` — the same
  source the views render from. They ship in the deployed bundle (issue #40).
- **The Server Card.** `/.well-known/mcp/server-card.json` is the SEP-2127 card for
  `lit-review-council`, a `uvx`-installed stdio server published with that project
  (issue #38). The bare `/.well-known/mcp` is the namespace directory whose `index.html`
  carries the same bytes.

The audit item that asked for "a live handshake at `/.well-known/mcp`" and the audit item
that asked for WebMCP pull in different directions. #38 answered the first with a card for
the one real MCP server this product org publishes; #40 answered the second in the page.

## Decision

**Do not publish a WebMCP discovery document, and keep `/.well-known/mcp` describing only
the backend MCP server.**

1. **No discovery file.** No `/.well-known/webmcp.json`, no `/webmcp.json`, no `/mcp.json`.
   No standard path exists, and inventing one would advertise an endpoint no HTTP client can
   call: the `execute` callbacks live in page JavaScript and run only in a visitor's
   browser. Registering a tool is not a claim that it is callable remotely — there is no
   `url`, no `remotes`, no transport.

2. **`/.well-known/mcp` keeps its one meaning.** It is the SEP-2127 Server Card for
   `lit-review-council`, installable from PyPI, and every document that points at it says
   which server it describes. It is never rewritten to describe the portfolio tools, and
   the portfolio gains no card for a server that does not exist.

3. **Describe the in-page tools where each kind of reader can reach them**, so a reader
   that never loads the page still learns the surface exists and what to do instead:

   | A reader asks | In-page tool | Static equivalent |
   | --- | --- | --- |
   | "What has Palm built involving X?" | `search-projects` | `/llms.txt`, `/projects.md` |
   | "Show me one project's trade-offs" | `get-project` | `/projects/<slug>.md` |
   | "What does this site publish, and where?" | `describe-site` | `/llms.txt`, `/openapi.json`, `/sitemap.xml` |

   - **ARD.** `/.well-known/ard.json` and `/.well-known/ai-catalog.json` gain one entry for
     the in-page tools, delivered as inline `data` rather than a `url` — the ARD model
     allows exactly one of the two, and there is no URL to point at. Its descriptors are
     projected from `webMcpTools` at build time, so the entry cannot drift from the tools
     the page really registers, and it carries the browser caveat in its own text.
     `/.well-known/api-catalog` is unchanged: an RFC 9727 linkset holds `href`s and cannot
     describe a document that has none.
   - **Prose.** `/developers` and `/developers.md`, `/llms.txt`, `/agents.md`,
     `/.well-known/agent-skills/portfolio/SKILL.md`, and `describe-site`'s own output each
     name the three tools, say they need a browser that exposes
     `document.modelContext`, and point at the static equivalents.
   - **One source, and a tether.** The tools stay read-only, feature-detected, and sourced
     from `src/data`, so a tool answer and the page cannot describe the portfolio
     differently. Because the prose surfaces are hand-maintained, a test pins them: every
     surface must name the tools and carry the caveat, and the names it checks come from
     `webMcpTools`.

4. **The blocker is the browser and the token, not the host.** WebMCP is gated by the
   `tools` Permissions Policy, which defaults to `self` and permits registration in
   top-level documents; the Chrome 149 origin trial delivers its token in a `<meta>` tag the
   page can carry, and GitHub Pages cannot set response headers but does not need to. The
   surface is dark today because support is narrow and `index.html` carries no trial token,
   and because `installWebMcpTools()` feature-detects and returns `null` — the page is
   byte-identical without it, which is the intended degradation. A hosted backend would not
   change any of this; it would only enable a *different* surface (see the fourth rejected
   alternative below).

5. **Declare what is served, not what a specification asks for.** GitHub Pages derives the
   content type from the file extension. An extensionless `/.well-known` path is therefore
   served as `application/octet-stream`, and a directory path as the `index.html` inside it,
   `text/html`. The OpenAPI document and the endpoint tables on `/docs` and `/developers`
   name the media type the origin *really sends*; the type a specification asks for is
   carried in the operation's description, where the gap is stated in words.

6. **The discovery surface is a census, not a selection.** Every document this origin
   publishes under `/.well-known/` either has an operation in the published OpenAPI document
   or is a declared exception with a written reason (a byte-identical alias, or a
   convention-mandated document that is intentionally not an operation). A test asserts the
   two directions agree, so a document cannot go live and stay invisible to the spec.

## Evidence (verified live 2026-10-13)

```
$ curl -sS -L -o /dev/null -D - https://ravicha2.github.io/.well-known/mcp
HTTP/2 301
location: https://ravicha2.github.io/.well-known/mcp/
```

```
$ curl -sS -L -o /dev/null -w '%{http_code} %{content_type}\n' https://ravicha2.github.io/webmcp.json
404 text/html; charset=utf-8
```

`/.well-known/webmcp.json` and `/mcp.json` answer the same 404. The bytes at
`/.well-known/mcp/` and `/.well-known/mcp/server-card.json` compare identical (`cmp`), so
the bare namespace path is the card, served as `text/html` because Pages answers a
directory with its `index.html`. That mislabelling is the same class of limitation ADR 0004
records, and it is the only host-caused absence on the MCP path.

The tools are really in the build, not just in source:

```
$ curl -sS https://ravicha2.github.io/assets/index-DhALyTte.js | grep -o 'registerTool' | head -1
registerTool
$ curl -sS https://ravicha2.github.io/assets/index-DhALyTte.js | grep -o 'describe-site\|get-project\|search-projects' | sort -u
describe-site
get-project
search-projects
```

`index.html` carries no `origin-trial` meta tag, and the origin sends no
`Permissions-Policy` header — so the platform default (`self`) applies and top-level
registration is permitted. The skill document's published digest matches the bytes on disk,
so the build's integrity check holds. The four extensionless discovery paths —
`/.well-known/api-catalog`, `/.well-known/oauth-protected-resource`,
`/.well-known/oauth-authorization-server` and
`/.well-known/http-message-signatures-directory` — are each served as
`application/octet-stream`, which is the measurement behind decision 5.

## Rejected alternatives

**Publish `/.well-known/webmcp.json` anyway.** Rejected. It satisfies a scanner, not an
agent: the file would list tools no HTTP client can invoke, and it would need hand
maintenance against a draft that is still changing. This is the failure ADR 0004 refuses
when it declines to publish an unservable JSON error envelope.

**Ship an origin-trial token now.** Rejected for now, not forever. It would make the tools
live for Chrome 149 visitors without a flag, at the cost of a token that expires, a `<meta>`
tag invisible to every other browser, and a claim of support this static site cannot verify.
Worth revisiting if WebMCP ships unflagged.

**Rewrite `/.well-known/mcp` to describe the portfolio tools.** Rejected. SEP-2127 reserves
that path for a Server Card, and the only real MCP server here is `lit-review-council`. A
card for a server that does not exist would break the one contract this path does honour.

**Host a remote portfolio MCP server.** Out of scope, and a different decision with its own
ADR. GitHub Pages cannot run one; it would mean new infrastructure in front of a site whose
whole deploy is a `git push`. It is also not a remedy for anything here: a remote server
would serve headless agents a *backend* MCP surface, not WebMCP, whose callbacks only run in
a visitor's browser.

## Consequences

### Positive

- The site publishes only what it serves, and the reason is written down where the next
  reader finds it — including the two claims that were wrong in the original RFC draft (the
  in-page tools *can* be described machine-readably through ARD's inline `data`, and the
  extensionless-path media type is a class, not one caveat on the MCP path).
- `/.well-known/mcp` keeps its one honest meaning, and the audit item it closes stays closed.
- The substitute path is stated, and it is real: every tool answer already exists as a
  document, so a headless agent loses nothing but the ranking.
- The discovery surface is now checked in both directions, so the next document cannot ship
  undescribed, and the prose that carries the caveat is pinned by a test.

### Negative / Trade-offs

- **An agent that fetches only discovery paths cannot call anything**, and learns the tools
  exist only from prose and from an ARD entry that says, in its own text, that it cannot be
  called. That is the honest maximum on this host.
- On almost every browser shipped today the tools register nothing and the visitor sees no
  difference. The capability is real and, in practice, mostly dormant.
- The prose describing the surface exists in six hand-maintained places. A test holds them
  together, but the test enforces the presence of the tool names and the caveat, not the
  quality of the sentences around them.
- Four published discovery documents are declared exceptions rather than operations:
  `/.well-known/mcp/index.html` and `/.well-known/ai-catalog.json`, because each is a
  byte-identical alias of a document that already has an operation;
  `/.well-known/oauth-authorization-server`, because no credential is issued; and
  `/.well-known/http-message-signatures-directory`, because this origin signs no outbound
  request. The exception list is a place a future document can be parked instead of
  described, and the reason field is what keeps that honest.

### What would retire this ADR

A discovery mechanism for WebMCP landing in the specification (a shipped service-worker
background-discovery story, or static manifests being accepted); WebMCP shipping unflagged
in a majority browser; or a hosted endpoint for the portfolio. Any of the three makes the
file question worth asking again. If the decision is revisited, the ARD entry, the six prose
surfaces, the OpenAPI census and their tests all change with it.
