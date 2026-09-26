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

  describe('First viewport', () => {
    it('states the name as the only h1', () => {
      renderHome();
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent(profile.name);
      // The identity, and exactly one of it: the display heading is not a
      // positioning line. `profile.headline` is the route's meta description.
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    });

    it('renders the role under the name rather than repeating the name', () => {
      renderHome();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(profile.name);
      expect(screen.getByText(new RegExp(profile.title, 'i'))).toBeInTheDocument();
    });

    it('offers the way into the catalog and the profile links', () => {
      renderHome();
      expect(screen.getByRole('link', { name: /all \d+ projects/i })).toHaveAttribute(
        'href',
        '/projects'
      );

      const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
      expect(hrefs).toContain(profile.links.github);
      expect(hrefs).toContain(profile.links.linkedin);
      expect(hrefs).toContain(profile.links.email);
    });
  });

  describe('Channel strip', () => {
    it('carries all four flagship projects as channels of one strip', () => {
      renderHome();
      const strip = screen.getByRole('navigation', { name: /flagship projects/i });
      const channels = within(strip).getAllByRole('listitem');
      expect(channels).toHaveLength(featuredProjects.length);

      for (const project of featuredProjects) {
        const channel = within(strip).getByRole('link', {
          name: new RegExp(project.title.split(':')[0], 'i'),
        });
        expect(channel).toHaveAttribute('href', `/projects/${project.slug}`);
        expect(within(channel).getByText(project.metrics![0].value)).toBeInTheDocument();
      }
    });
  });

  describe('System context', () => {
    it('labels the role from data rather than claiming currency it cannot check', () => {
      renderHome();
      const isCurrent = workExperience.some((w) => w.isCurrent);
      expect(screen.getByText(isCurrent ? 'Now' : 'Most recent')).toBeInTheDocument();
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
      expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute(
        'href',
        '/experience'
      );
    });
  });
});
