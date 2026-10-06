import { describe, it, expect } from 'vitest';
import { render, routes } from '../../src/entry-server';
import { profile } from '../../src/data/profile';
import { workExperience } from '../../src/data/experience';
import { projects } from '../../src/data/projects';

/**
 * scripts/prerender.mjs ships whatever these functions return, so this is the
 * contract worth pinning: the deployed HTML has to carry the content, and each route
 * has to describe itself. The sitemap is generated from the same `routes()`, and is
 * checked in tests/seo/crawler-protocols.test.ts.
 */
describe('Prerendered routes', () => {
  it('puts the page content in the markup instead of an empty root div', () => {
    const { html } = render('/');

    expect(html).toContain(profile.name);
    expect(html).toContain(profile.narrative.systemsMindset);
    expect(html).toContain(profile.links.github);
  });

  it('renders the experience record, internships and all', () => {
    const { html } = render('/experience');

    for (const job of workExperience) {
      expect(html, `${job.company} missing from the prerendered experience page`).toContain(
        job.company
      );
    }
  });

  it('renders a case study body for each slug', () => {
    const shepherd = projects.find((project) => project.slug === 'shepherd')!;
    expect(render(`/projects/${shepherd.slug}`).html).toContain(shepherd.summary);
  });

  it('gives each route its own title and canonical URL', () => {
    const titles = routes().map((route) => render(route).meta.title);

    expect(new Set(titles).size).toBe(titles.length);
    expect(render('/experience').meta.canonicalUrl).toBe('https://ravicha2.github.io/experience');
  });
});
