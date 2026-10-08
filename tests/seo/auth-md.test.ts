import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * `/auth.md` is the answer an agent gets when it arrives looking for credentials.
 * The answer is "none are needed", which only reads as an answer if the document
 * keeps the exact shape a reader matches on: the required headings, in order, and
 * the anchor keywords that identify it as an auth document rather than a stray page.
 *
 * It is a static file under public/, so Vite copies it to the site root as
 * `dist/auth.md` and GitHub Pages serves it as `text/markdown; charset=utf-8` by
 * extension alone — no header work. The tests below hold the structure so it cannot
 * quietly rot, and hold the honesty constraints so the document cannot start
 * claiming an endpoint this origin does not have.
 */
const publicDir = path.resolve(__dirname, '../../public');
const authPath = path.join(publicDir, 'auth.md');

const REQUIRED_HEADINGS = [
  '# auth.md',
  '## Step 1 — Discover',
  '### 1a. Fetch the Protected Resource Metadata',
  '### 1b. Fetch the Authorization Server metadata',
  '## Step 2 — Pick a method',
  '### identity_assertion + id-jag',
  '### service_auth',
  '### anonymous',
  '## Step 3 — Register',
  '## Step 4 — Claim ceremony',
  '## Step 5 — Exchange the assertion',
  '## Step 6 — Use the access_token',
  '## Errors',
  '## Revocation',
];

const ANCHOR_KEYWORDS = [
  'agent_auth',
  'identity_endpoint',
  'identity_assertion',
  'service_auth',
  'id-jag',
  'WWW-Authenticate',
];

const authMd = fs.readFileSync(authPath, 'utf8');
const headings = [...authMd.matchAll(/^#{1,6} .+$/gm)].map((match) => match[0]);

describe('public/auth.md', () => {
  it('is a static root markdown file that opens with an H1 naming itself', () => {
    expect(fs.existsSync(authPath)).toBe(true);
    // Serving as text/markdown comes from the .md extension, so the file has to sit
    // at the public root with that extension — not behind a rewrite or a header.
    expect(path.basename(authPath)).toBe('auth.md');
    expect(authMd.split('\n')[0]).toBe('# auth.md');
    expect(authMd.trim().length).toBeGreaterThan(0);
  });

  it('carries every required heading, in the order a reader matches on', () => {
    const positions = REQUIRED_HEADINGS.map((heading) => {
      const index = headings.indexOf(heading);
      expect(index, `missing heading: ${heading}`).toBeGreaterThanOrEqual(0);
      return index;
    });
    // Strictly increasing: the sequence is load-bearing, not just the membership.
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(new Set(positions).size).toBe(positions.length);
  });

  it('uses the exact heading text, including its punctuation', () => {
    for (const heading of REQUIRED_HEADINGS) {
      expect(headings, `heading drifted from its spec text: ${heading}`).toContain(heading);
    }
  });

  it('contains every anchor keyword', () => {
    for (const keyword of ANCHOR_KEYWORDS) {
      expect(authMd, `anchor keyword missing: ${keyword}`).toContain(keyword);
    }
  });

  it('publishes both endpoint dialects in one agent_auth block', () => {
    const block = authMd.match(/```json\n([\s\S]*?)\n```/);
    expect(block, 'no json agent_auth block found').not.toBeNull();

    const parsed = JSON.parse(block![1]) as { agent_auth: Record<string, any> };
    const agentAuth = parsed.agent_auth;
    expect(agentAuth, 'block has no agent_auth key').toBeDefined();

    // WorkOS dialect.
    expect(agentAuth.identity_endpoint).toBeTruthy();
    expect(agentAuth.claim_endpoint).toBeTruthy();
    expect(agentAuth.events_endpoint).toBeTruthy();

    // Scanner-recipe dialect.
    expect(agentAuth.register_uri).toBeTruthy();
    expect(agentAuth.claim_uri).toBeTruthy();
    expect(agentAuth.revocation_uri).toBeTruthy();

    expect(agentAuth.identity_types_supported).toEqual(['anonymous']);
    expect(
      agentAuth.identity_assertion.assertion_types_supported,
      'the ID-JAG URN belongs inside identity_assertion, not at the top level'
    ).toContain('urn:ietf:params:oauth:token-type:id-jag');
    expect(agentAuth.assertion_types_supported).toBeUndefined();
  });

  it('states plainly that no credential is issued and no endpoint is live', () => {
    expect(authMd).toMatch(/no credentials/i);
    expect(authMd).toMatch(/no endpoint is live/i);
    expect(authMd).toMatch(/none is issued|no .* is issued/i);
    expect(authMd).toMatch(/complete answer/i);
    // The one identity type the origin can honour.
    expect(authMd).toMatch(/anonymous/);
  });
});
