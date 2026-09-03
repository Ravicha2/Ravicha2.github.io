import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ProjectsView } from '../../src/views/ProjectsView';
import { projects, projectCategories } from '../../src/data/projects';

describe('ProjectsView Component', () => {
  const renderProjectsView = () =>
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ProjectsView />
      </MemoryRouter>
    );

  describe('Header and Layout', () => {
    it('renders the main heading and introductory description', () => {
      renderProjectsView();
      expect(screen.getByRole('heading', { level: 1, name: /Projects|Engineering Projects/i })).toBeInTheDocument();
      expect(screen.getByText(/Curated engineering projects and technical case studies/i)).toBeInTheDocument();
    });

    it('renders all category filter buttons with correct initial aria-pressed state', () => {
      renderProjectsView();
      const filterGroup = screen.getByRole('group', { name: /filter projects by category/i });
      expect(filterGroup).toBeInTheDocument();

      const buttons = within(filterGroup).getAllByRole('button');
      expect(buttons.length).toBe(projectCategories.length);

      // 'All Projects' button should be pressed by default
      const allButton = within(filterGroup).getByRole('button', { name: /all/i });
      expect(allButton).toHaveAttribute('aria-pressed', 'true');

      // Other buttons should not be pressed
      const agenticButton = within(filterGroup).getByRole('button', { name: /agentic ai/i });
      expect(agenticButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Catalog Rendering and Filtering', () => {
    it('renders all project cards by default', () => {
      renderProjectsView();
      for (const project of projects) {
        expect(screen.getByTestId(`project-card-${project.slug}`)).toBeInTheDocument();
      }
    });

    it('filters projects when clicking a category button', async () => {
      const user = userEvent.setup();
      renderProjectsView();

      // Click "Distributed Systems" category
      const distSystemsBtn = screen.getByRole('button', { name: /distributed systems/i });
      await user.click(distSystemsBtn);

      expect(distSystemsBtn).toHaveAttribute('aria-pressed', 'true');
      const allButton = screen.getByRole('button', { name: /all/i });
      expect(allButton).toHaveAttribute('aria-pressed', 'false');

      // NL2REGEX should be visible
      expect(screen.getByTestId('project-card-nl2regex')).toBeInTheDocument();
      // Shepherd (graph-rag) should NOT be visible
      expect(screen.queryByTestId('project-card-shepherd')).not.toBeInTheDocument();
    });

    it('filters correctly for Agentic AI category and switches back to All', async () => {
      const user = userEvent.setup();
      renderProjectsView();

      // Click "Agentic AI & MCP"
      const agenticBtn = screen.getByRole('button', { name: /agentic ai/i });
      await user.click(agenticBtn);

      expect(screen.getByTestId('project-card-document-ingestion-agent')).toBeInTheDocument();
      expect(screen.getByTestId('project-card-lit-review-council')).toBeInTheDocument();
      expect(screen.getByTestId('project-card-node-api')).toBeInTheDocument();
      expect(screen.queryByTestId('project-card-shepherd')).not.toBeInTheDocument();

      // Switch back to "All"
      const allBtn = screen.getByRole('button', { name: /all/i });
      await user.click(allBtn);

      expect(allBtn).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('project-card-shepherd')).toBeInTheDocument();
      expect(screen.getByTestId('project-card-nl2regex')).toBeInTheDocument();
    });

    it('filters correctly for Robotics category', async () => {
      const user = userEvent.setup();
      renderProjectsView();

      const roboticsBtn = screen.getByRole('button', { name: /robotics/i });
      await user.click(roboticsBtn);

      expect(screen.getByTestId('project-card-robotic-arm-ultrasound')).toBeInTheDocument();
      expect(screen.queryByTestId('project-card-shepherd')).not.toBeInTheDocument();
      expect(screen.queryByTestId('project-card-nl2regex')).not.toBeInTheDocument();
    });
  });

  describe('Project Card Details', () => {
    it('displays case study links for flagship projects with case study data', () => {
      renderProjectsView();
      const shepherdCard = screen.getByTestId('project-card-shepherd');
      const caseStudyLink = within(shepherdCard).getByRole('link', { name: /read case study|view case study|case study/i });
      expect(caseStudyLink).toHaveAttribute('href', '/projects/shepherd');
    });

    it('displays external links with accessible labels and attributes', () => {
      renderProjectsView();
      const nl2regexCard = screen.getByTestId('project-card-nl2regex');

      const githubLink = within(nl2regexCard).getByRole('link', { name: /github/i });
      expect(githubLink).toHaveAttribute('href', 'https://github.com/Ravicha2/NL2REGEX');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', expect.stringContaining('noopener'));

      const demoLink = within(nl2regexCard).getByRole('link', { name: /demo/i });
      expect(demoLink).toHaveAttribute('href', 'http://207.148.87.49');

      const videoLink = within(nl2regexCard).getByRole('link', { name: /video/i });
      expect(videoLink).toHaveAttribute('href', 'https://youtu.be/mFec2jMgosg');
    });

    it('displays tech stack pills and metrics on project cards', () => {
      renderProjectsView();
      const shepherdCard = screen.getByTestId('project-card-shepherd');
      expect(within(shepherdCard).getByText('Neo4j')).toBeInTheDocument();
      expect(within(shepherdCard).getByText('FastAPI')).toBeInTheDocument();
      expect(within(shepherdCard).getByText(/Zero AST-ADR rule drift/i)).toBeInTheDocument();
    });
  });
});
