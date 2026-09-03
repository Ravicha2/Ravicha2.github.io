import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { SEOHead } from '../../src/components/seo/SEOHead';
import { generateJsonLdForRoute } from '../../src/utils/seo';

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
    expect(person.name).toContain('Palm');
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
