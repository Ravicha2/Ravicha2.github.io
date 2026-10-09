import { describe, it, expect } from 'vitest';
import { render as renderDom, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../src/App';
import { render as renderServer } from '../src/entry-server';
import { apiEndpoints } from '../src/data/api';

/**
 * The pages an agent or a trust-checking crawler lands on, rendered as the router
 * renders them and as the prerenderer serialises them. The raw-HTML checks matter
 * most: an agent that does not run JavaScript reads the server markup, so the H1 has
 * to be the first heading there.
 */
const renderRoute = (route: string) =>
  renderDom(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

const AGENT_ROUTES = ['/about', '/contact', '/privacy', '/developers', '/docs'] as const;

describe('Agent and trust pages render', () => {
  it.each(AGENT_ROUTES)('%s renders one h1 and at least 500 characters of content', (route) => {
    renderRoute(route);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);

    const main = screen.getByRole('main');
    expect((main.textContent ?? '').trim().length).toBeGreaterThan(500);
  });

  it('links the trust pages from the homepage, but not the machine surface', () => {
    const { container } = renderRoute('/');
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    for (const route of ['/about', '/contact']) {
      expect(hrefs, `homepage does not link ${route}`).toContain(route);
    }
    // /docs and /developers stay reachable by URL and advertised in sitemap.xml for
    // crawlers; they are deliberately not put in front of a person browsing the site.
    for (const route of ['/docs', '/developers']) {
      expect(hrefs, `the homepage exposes ${route} to a human`).not.toContain(route);
    }
  });

  it('keeps the layout rail label a paragraph, not a heading', () => {
    const { container } = renderRoute('/');
    const rail = container.querySelector('#rail-heading');
    expect(rail).not.toBeNull();
    expect(rail!.tagName).toBe('P');
    expect(rail!.closest('h1, h2, h3, h4, h5, h6')).toBeNull();
  });
});

describe('Prerendered homepage headings', () => {
  it('opens with the H1 before any deeper heading in the raw markup', () => {
    // The rail renders above <main> on every route; while its label was an <h2> it was
    // the first content heading a no-JS crawler saw, which is the content-no-js defect.
    const { html } = renderServer('/');
    const firstH1 = html.indexOf('<h1');
    const firstH2 = html.indexOf('<h2');
    expect(firstH1).toBeGreaterThan(-1);
    expect(firstH2 === -1 || firstH1 < firstH2, 'a heading deeper than h1 precedes the h1').toBe(true);
  });
});

describe('Endpoint tables are generated from the API data', () => {
  it.each(['/docs', '/developers'])('%s renders every operation from src/data/api.ts', (route) => {
    const { container } = renderRoute(route);
    const text = container.textContent ?? '';
    for (const endpoint of apiEndpoints) {
      expect(text, `${route} is missing ${endpoint.operationId}`).toContain(endpoint.operationId);
      expect(text, `${route} is missing ${endpoint.path}`).toContain(endpoint.path);
    }
  });
});
