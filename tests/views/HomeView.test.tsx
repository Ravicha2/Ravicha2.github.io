import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomeView } from '../../src/views/HomeView';
import { profile } from '../../src/data/profile';
import { featuredProjects } from '../../src/data/projects';
import { workExperience, education } from '../../src/data/experience';

describe('HomeView Component', () => {
  const renderHome = () =>
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <HomeView />
      </MemoryRouter>
    );

  describe('First viewport — the claim, its tolerance, its datum', () => {
    it('states the hero claim as the only h1, in a feature control frame', () => {
      renderHome();
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Fault-tolerant agentic systems, measured.');
      expect(h1.closest('[data-conformance]')).toHaveAttribute('data-conformance', 'verified');
    });

    it('renders the name, role title, and headline', () => {
      renderHome();
      expect(screen.getByText(new RegExp(profile.name, 'i'))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(profile.title, 'i'))).toBeInTheDocument();
      expect(screen.getByText(/Building fault-tolerant multi-agent pipelines/i)).toBeInTheDocument();
    });

    it('carries a live permalink to real bytes, pinned to a commit SHA', () => {
      renderHome();
      const permalink = screen
        .getAllByRole('link')
        .find((link) => /\/blob\/[0-9a-f]{40}\//.test(link.getAttribute('href') ?? ''));

      expect(permalink, 'the first viewport must carry one pinned permalink').toBeDefined();
      expect(permalink!.getAttribute('href')).not.toContain('/blob/main/');
      expect(permalink!.getAttribute('target')).toBe('_blank');
    });

    it('offers the primary action and the profile links', () => {
      renderHome();
      expect(screen.getByRole('link', { name: /explore projects/i })).toHaveAttribute(
        'href',
        '/projects'
      );

      const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
      expect(hrefs).toContain(profile.links.github);
      expect(hrefs).toContain(profile.links.linkedin);
      expect(hrefs).toContain(profile.links.email);
    });
  });

  describe('Dimension chain', () => {
    it('dimensions all four flagship projects as intervals of one chain', () => {
      renderHome();
      const chain = screen.getByRole('list');
      const intervals = within(chain).getAllByRole('listitem');
      expect(intervals).toHaveLength(featuredProjects.length);

      for (const project of featuredProjects) {
        const interval = within(chain).getByRole('link', {
          name: new RegExp(project.title.split(':')[0], 'i'),
        });
        expect(interval).toHaveAttribute('href', `/projects/${project.slug}`);
        expect(within(interval).getByText(project.metrics![0].value)).toBeInTheDocument();
      }
    });
  });

  describe('How a claim is marked', () => {
    it('states the key to the notation with all three line weights', () => {
      renderHome();
      const heading = screen.getByRole('heading', { level: 2, name: /how a claim is marked/i });
      const legend = heading.closest('section')!;

      for (const rule of ['rule-verified', 'rule-asserted', 'rule-failed']) {
        expect(legend.querySelector(`.${rule}`)).not.toBeNull();
      }
      expect(legend).toHaveTextContent(/Verified/i);
      expect(legend).toHaveTextContent(/Asserted/i);
      expect(legend).toHaveTextContent(/Failed/i);
    });
  });

  describe('System context', () => {
    it('labels the role from data rather than claiming currency it cannot check', () => {
      renderHome();
      const isCurrent = workExperience.some((w) => w.isCurrent);
      expect(screen.getByText(isCurrent ? 'Active' : 'Most recent')).toBeInTheDocument();
      expect(screen.queryByText('Active Deployment')).not.toBeInTheDocument();
    });

    it('renders the current role and the primary degree', () => {
      renderHome();
      const current = workExperience.find((w) => w.isCurrent) ?? workExperience[0];
      // Regex, not exact: the row runs the company and the period into one line.
      for (const text of [current.role, current.company, education[0].degree, education[0].institution]) {
        expect(screen.getAllByText(new RegExp(text, 'i')).length).toBeGreaterThanOrEqual(1);
      }
    });

    it('links on to the full catalog and the experience timeline', () => {
      renderHome();
      expect(screen.getByRole('link', { name: /all \d+ projects/i })).toHaveAttribute(
        'href',
        '/projects'
      );
      expect(screen.getByRole('link', { name: /full experience/i })).toHaveAttribute(
        'href',
        '/experience'
      );
    });
  });
});
