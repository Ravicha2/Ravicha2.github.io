import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomeView } from '../../src/views/HomeView';
import { profile } from '../../src/data/profile';
import { featuredProjects } from '../../src/data/projects';

describe('HomeView Component', () => {
  const renderHome = () =>
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <HomeView />
      </MemoryRouter>
    );

  describe('Hero Narrative Section', () => {
    it('renders the name, primary role title, and hero heading', () => {
      renderHome();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(new RegExp(profile.name, 'i'))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(profile.title, 'i'))).toBeInTheDocument();
    });

    it('renders the narrative summary and explore projects CTA link', () => {
      renderHome();
      expect(screen.getByText(/Building fault-tolerant multi-agent pipelines/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /explore projects/i })).toHaveAttribute('href', '/projects');
    });

    it('renders quick contact and social links with accessible attributes', () => {
      renderHome();
      const githubLinks = screen.getAllByRole('link', { name: /github/i });
      expect(githubLinks.some((link) => link.getAttribute('href') === profile.links.github)).toBe(true);

      const linkedinLinks = screen.getAllByRole('link', { name: /linkedin/i });
      expect(linkedinLinks.some((link) => link.getAttribute('href') === profile.links.linkedin)).toBe(true);

      const emailLinks = screen.getAllByRole('link', { name: /email/i });
      expect(emailLinks.some((link) => link.getAttribute('href') === profile.links.email)).toBe(true);
    });
  });

  describe('Bento Grid Flagship Showcase', () => {
    it('renders the Bento Grid section heading', () => {
      renderHome();
      expect(
        screen.getByRole('heading', { level: 2, name: /Featured Case Studies|Flagship Systems|Featured Systems/i })
      ).toBeInTheDocument();
    });

    it('renders exactly 4 featured case study cards', () => {
      renderHome();
      const bentoGrid = screen.getByTestId('bento-grid');
      expect(bentoGrid).toBeInTheDocument();

      const expectedSlugs = ['shepherd', 'nl2regex', 'document-ingestion-agent', 'lit-review-council'];
      expect(featuredProjects.map((p) => p.slug)).toEqual(expect.arrayContaining(expectedSlugs));

      for (const slug of expectedSlugs) {
        const card = screen.getByTestId(`bento-card-${slug}`);
        expect(card).toBeInTheDocument();
      }
    });

    it('displays project titles, stack pills, metrics, and case study links for each card', () => {
      renderHome();

      for (const project of featuredProjects) {
        const card = screen.getByTestId(`bento-card-${project.slug}`);
        expect(card).toBeInTheDocument();

        // Project title or part of title in heading
        expect(
          within(card).getByRole('heading', { level: 3, name: new RegExp(project.title.split(':')[0], 'i') })
        ).toBeInTheDocument();

        // Case study navigation link
        const caseStudyLink = within(card).getByRole('link', { name: /read case study|view case study|case study/i });
        expect(caseStudyLink).toHaveAttribute('href', `/projects/${project.slug}`);

        // Tags / stack pills
        if (project.tags.length > 0) {
          expect(within(card).getByText(project.tags[0])).toBeInTheDocument();
        }

        // Metrics highlight
        if (project.metrics && project.metrics.length > 0) {
          expect(within(card).getByText(project.metrics[0])).toBeInTheDocument();
        }
      }
    });
  });

  describe('Career Snapshot and Direct Navigation CTAs', () => {
    it('renders links directing to full projects catalog and experience timeline', () => {
      renderHome();
      const allProjectsLinks = screen.getAllByRole('link', { name: /view all projects|explore all projects|all projects/i });
      expect(allProjectsLinks.length).toBeGreaterThanOrEqual(1);
      allProjectsLinks.forEach((link) => expect(link).toHaveAttribute('href', '/projects'));

      const fullExperienceLink = screen.getByRole('link', {
        name: /view full experience|full career timeline|view experience/i,
      });
      expect(fullExperienceLink).toHaveAttribute('href', '/experience');
    });
  });
});
