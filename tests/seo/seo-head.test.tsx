import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { SEOHead } from '../../src/components/seo/SEOHead';
import { generateJsonLdForRoute, getRouteMeta } from '../../src/utils/seo';
import { profile } from '../../src/data/profile';

describe('Dynamic SEOHead & JSON-LD Structured Data Generator', () => {
  beforeEach(() => {
    // Reset document head
    document.title = 'Initial Title';
    const existingScript = document.getElementById('dynamic-jsonld');
    if (existingScript) existingScript.remove();
  });

  it('generates valid Person and ProfilePage JSON-LD for root route "/"', () => {
    const schema = generateJsonLdForRoute('/');
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@graph']).toBeDefined();

    const person = schema['@graph'].find((item: any) => item['@type'] === 'Person');
    expect(person).toBeDefined();
    // The legal name is what a crawler matches against LinkedIn and the CV; "Palm"
    // rides alongside as the nickname those same tools may know this person by.
    expect(person.name).toBe(profile.name);
    expect(person.alternateName).toBe('Palm');
  });

  it('makes the root route and its ProfilePage name the real discipline', () => {
    const schema = generateJsonLdForRoute('/');
    const profilePage = schema['@graph'].find((item: any) => item['@type'] === 'ProfilePage');
    const person = schema['@graph'].find((item: any) => item['@type'] === 'Person');

    // The page entity is named the same way as the route title, and the title states
    // the discipline rather than the container the material is stored in.
    expect(profilePage.name).toBe(getRouteMeta('/').title);
    expect(profilePage.name).toContain(profile.discipline);
    // The discipline is backed by the jobTitle and skills the Person node already
    // carries, so the title is a restatement, not a new claim.
    expect(person.jobTitle).toBe(profile.title);
    expect(person.knowsAbout).toContain('Applied AI');
  });

  it('generates valid SoftwareSourceCode JSON-LD for project detail route "/projects/shepherd"', () => {
    const schema = generateJsonLdForRoute('/projects/shepherd');
    const software = schema['@graph'].find((item: any) => item['@type'] === 'SoftwareSourceCode');

    expect(software).toBeDefined();
    expect(software.name).toContain('Shepherd');
    expect(software.codeRepository).toBe('https://github.com/Ravicha2/Shepherd');
    expect(software.programmingLanguage).toContain('Python');
  });

  it('generates valid CollectionPage JSON-LD for "/projects"', () => {
    const schema = generateJsonLdForRoute('/projects');
    const collection = schema['@graph'].find((item: any) => item['@type'] === 'CollectionPage');

    expect(collection).toBeDefined();
    expect(collection.mainEntity).toBeDefined();
  });

  it('generates valid AboutPage and ScholarlyArticle JSON-LD for "/experience"', () => {
    const schema = generateJsonLdForRoute('/experience');
    const about = schema['@graph'].find((item: any) => item['@type'] === 'AboutPage');
    const article = schema['@graph'].find((item: any) => item['@type'] === 'ScholarlyArticle');

    expect(about).toBeDefined();
    expect(article).toBeDefined();
    expect(article.name).toContain('Position Accuracy of a 6-DOF Passive Robotic Arm');
  });

  // `public/404.html` hands every unresolvable path back to the SPA, so an unmatched
  // path reaches a crawler as a real URL. Canonicalising it to itself would ask Google
  // to index a dead end under a title that reads "Page not found".
  it.each(['/nope-404', '/foo/bar', '/projects/no-such-project'])(
    'points the canonical at the root, not at itself, for unmatched path %s',
    (pathname) => {
      const meta = getRouteMeta(pathname);
      expect(meta.title).toMatch(/page not found/i);
      expect(meta.canonicalUrl).toBe('https://ravicha2.github.io/');
      expect(meta.canonicalUrl).not.toContain(pathname);
    }
  );

  // GitHub Pages 301s a bare directory route to its trailing-slash form, so a browser
  // on /projects holds `/projects/` while the router and the build carry `/projects`.
  // While the two disagreed, every deep route matched no branch above, canonicalised
  // itself to the home page and announced "Page not found" — with the correct title
  // sitting right there in the prerendered HTML for the client to overwrite.
  it.each(['/projects', '/experience', '/projects/shepherd'])(
    'reads the trailing-slash form GitHub Pages serves as the same route as %s',
    (route) => {
      expect(getRouteMeta(`${route}/`)).toEqual(getRouteMeta(route));
      expect(getRouteMeta(`${route}/`).title).not.toMatch(/page not found/i);
      expect(generateJsonLdForRoute(`${route}/`)).toEqual(generateJsonLdForRoute(route));
    }
  );

  it('states the canonical as the URL the site is actually served at', () => {
    expect(getRouteMeta('/').canonicalUrl).toBe('https://ravicha2.github.io/');
    expect(getRouteMeta('/projects').canonicalUrl).toBe('https://ravicha2.github.io/projects/');
    expect(getRouteMeta('/experience').canonicalUrl).toBe('https://ravicha2.github.io/experience/');
    expect(getRouteMeta('/projects/shepherd').canonicalUrl).toBe(
      'https://ravicha2.github.io/projects/shepherd/'
    );
  });

  it('SEOHead component dynamically updates title, canonical link, and dynamic-jsonld script in DOM', () => {
    render(
      <MemoryRouter initialEntries={['/projects/shepherd']}>
        <SEOHead />
      </MemoryRouter>
    );

    expect(document.title).toContain('Shepherd');

    const dynamicScript = document.getElementById('dynamic-jsonld');
    expect(dynamicScript).not.toBeNull();
    const parsed = JSON.parse(dynamicScript!.textContent || '{}');
    expect(parsed['@graph'].some((item: any) => item['@type'] === 'SoftwareSourceCode')).toBe(true);
  });
});
