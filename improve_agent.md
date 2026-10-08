Improve how ready https://ravicha2.github.io is for agents.

Current Is Agentic score: 54/100 (Is Agentic readiness model based on Ora audit evidence).

Implement the following fixes in priority order (failures first, then warnings):

1. Agent-friendly 404s (Essential, Partial)
   Evidence: The nonexistent path https://ravicha2.github.io/__ora-404-probe-lbnb7iax correctly returns HTTP 404. Partial credit: no Markdown error body was detected.
   Recommended fix: Keep the correct HTTP 404 status. The remaining requirement is a Markdown error body when agents request Accept: text/markdown. Include at least 20 characters explaining the error and a link to your docs, sitemap, or llms.txt. Verify with `curl -sS -L -i -H 'Accept: text/markdown' https://yourdomain.com/some-path-that-does-not-exist`. Check both the final 404 status and the Markdown body with Content-Type: text/markdown. Checking the status alone does not verify the missing requirement.
   Current result: Partial (50%).
2. Content is available without JavaScript (Essential, Partial)
   Evidence: 4251 chars with H1, but first content heading is H2, not H1
   Recommended fix: Serve at least 500 characters of meaningful homepage content in raw HTML. Add a clear H1, keep deeper heading levels sequential, and remove excessive non-content markup.
   Current result: Partial (67%).
3. OpenAPI spec published (Essential, Failed)
   Evidence: No OpenAPI/Swagger specification found
   Recommended fix: Publish an OpenAPI (Swagger) specification at `/openapi.json` or `/api/openapi.yaml.` This is how agents understand your API surface automatically.
   Current result: Failed.
4. JSON error responses (Essential, Failed)
   Evidence: API does not return JSON error responses (or no API detected)
   Recommended fix: Return structured JSON error responses with error codes, messages, and resolution hints. Agents can't parse HTML error pages.
   Current result: Failed.
5. Markdown content negotiation (acceptmarkdown.com) (Essential, Failed)
   Evidence: Homepage https://ravicha2.github.io does not meet the Markdown negotiation requirements: Accept: text/markdown returned text/html; charset=utf-8; Vary header missing Accept (got "accept-encoding")
   Recommended fix: Enable Markdown negotiation on the scanned homepage. Supporting it only on `/docs` or a separate .md URL does not satisfy this check. Requests with Accept: text/markdown must receive a nonempty Markdown body with Content-Type: text/markdown and Vary: Accept. Keep serving HTML for Accept: text/html. Adding Vary alone does not create a Markdown response. Verify both with `curl -sS -L -i -H 'Accept: text/markdown' https://yourdomain.com/` and `curl -sS -L -i -H 'Accept: text/html' https://yourdomain.com/`. Check the final response headers and body: Markdown with Vary: Accept for the first request, HTML for the second.
   Current result: Failed.
6. Brand name discoverability (Recommended, Failed)
   Evidence: ravicha2.github.io was not in the top 10 for "Ravicha Suksawasdi Na Ayuthaya Portfolio AI engineering"
   Recommended fix: Make sure your own domain ranks in the top results when people search your brand together with your main product (for example "Acme payments API"). If it does not, your brand may be too generic, conflict with a more established term, or not yet indexed. Strengthen it by describing your main product clearly in your homepage title and headings, earning press mentions that link to your domain, and avoiding redirect chains that mask your main domain in search results.
   Current result: Failed.
7. Developer portal (Recommended, Failed)
   Evidence: No developer portal found
   Recommended fix: Create a developer portal at `/developers` with API keys, documentation, quickstart guides, and a sandbox environment.
   Current result: Failed.
8. CLI tool available (Recommended, Failed)
   Evidence: No CLI tool found
   Recommended fix: Publish an official CLI tool on npm, PyPI, or Homebrew. A CLI lets agents and developers script interactions with your product without building API integrations from scratch.
   Current result: Failed.
9. Public API/docs linked from homepage (Recommended, Failed)
   Evidence: No public API or documentation page linked from homepage
   Recommended fix: Publish API documentation at a discoverable URL (`/docs`, `/api`, `/developers`). Include authentication, endpoints, and example requests.
   Current result: Failed.
10. Agent instruction / when-to-use (Recommended, Failed)
   Evidence: No agent instruction file with when-to-use guidance found
   Recommended fix: Tell agents when to reach for you: add a 'when to use this' section to your llms.txt (or a dedicated agent-instructions file) that names your best-fit use cases and how an agent should call you. Be specific about the jobs you are right for - generic marketing copy does not read as guidance.
   Current result: Failed.
11. API schema complexity analysis (Recommended, Failed)
   Evidence: No API schema detected
   Recommended fix: Make your API spec self-describing: a unique operationId and a description on every operation, typed parameters, and response schemas. For GraphQL, a fully typed schema with a documented cost or rate limit reads best.
   Current result: Failed.
12. Function calling compatibility (Recommended, Failed)
   Evidence: No API spec found - function calling requires discoverable endpoints
   Recommended fix: Ensure API endpoints have unique operation IDs, typed schemas, and descriptions compatible with LLM function-calling formats.
   Current result: Failed.
13. Trust anchor pages (Recommended, Failed)
   Evidence: No trust anchor pages found with sufficient content (About, Contact, Privacy)
   Recommended fix: Publish real `/about`, `/contact`, and `/privacy` pages with at least 500 characters of content each. These are the pages AI agents check to verify your business is legitimate before recommending you.
   Current result: Failed.
14. MCP server / manifest (Recommended, Partial)
   Evidence: First-party MCP server published by product org (npm, @github/mcp-registry, 16659 score). Add live handshake at /.well-known/mcp for full credit.
   Recommended fix: Build an MCP (Model Context Protocol) server exposing your API as tools. Use Streamable HTTP transport for full score. This lets Claude, ChatGPT, and other AI agents call your product natively.
   Current result: Partial (83%).

Requirements:

- Inspect the existing codebase before changing files.
- Follow each published protocol or file format exactly.
- Preserve existing product behavior and visual design.
- Add or update tests for every behavior you change.
- Verify every public endpoint and machine-readable file after implementation.
- Finish with a concise change summary, verification results, and any remaining recommendations that require product decisions or credentials.