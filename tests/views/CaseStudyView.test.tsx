import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CaseStudyView } from '../../src/views/CaseStudyView';
import { projects } from '../../src/data/projects';

describe('CaseStudyView Component', () => {
  const renderWithRoute = (slug: string) =>
    render(
      <MemoryRouter
        initialEntries={[`/projects/${slug}`]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/projects/:slug" element={<CaseStudyView />} />
          <Route path="/projects" element={<div>Projects Catalog</div>} />
        </Routes>
      </MemoryRouter>
    );

  describe('Valid Case Study: Shepherd', () => {
    it('renders breadcrumbs / back navigation to /projects', () => {
      renderWithRoute('shepherd');
      const backLinks = screen.getAllByRole('link', { name: /back to projects|all projects|projects/i });
      expect(backLinks.some((link) => link.getAttribute('href') === '/projects')).toBe(true);
    });

    it('renders project header, role, timeline, and metadata tags', () => {
      renderWithRoute('shepherd');
      const shepherd = projects.find((p) => p.slug === 'shepherd')!;

      expect(screen.getByRole('heading', { level: 1, name: new RegExp(shepherd.title, 'i') })).toBeInTheDocument();
      expect(screen.getByText(shepherd.subtitle)).toBeInTheDocument();
      expect(screen.getByText(shepherd.role)).toBeInTheDocument();
      expect(screen.getAllByText(shepherd.timeline).length).toBeGreaterThanOrEqual(1);

      // Tech stack pills
      expect(screen.getAllByText('Neo4j').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('FastAPI').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Cypher').length).toBeGreaterThanOrEqual(1);
    });

    it('renders external links with security and accessibility attributes', () => {
      renderWithRoute('shepherd');
      const githubLinks = screen.getAllByRole('link', { name: /github/i });
      expect(githubLinks.some((link) => link.getAttribute('href') === 'https://github.com/Ravicha2/Shepherd')).toBe(true);
    });

    it('renders all 4 sections of the case study framework', () => {
      renderWithRoute('shepherd');
      const shepherd = projects.find((p) => p.slug === 'shepherd')!;
      const cs = shepherd.caseStudy!;

      // Section 1: Core Intuition & Friction
      expect(screen.getByRole('heading', { level: 2, name: /core intuition|intuition & friction/i })).toBeInTheDocument();
      expect(screen.getByText(cs.intuition.spark)).toBeInTheDocument();
      expect(screen.getByText(cs.intuition.naiveFailureMode)).toBeInTheDocument();

      // Section 2: The Root Problem Encountered
      expect(screen.getByRole('heading', { level: 2, name: /root problem|problem encountered/i })).toBeInTheDocument();
      for (const edgeCase of cs.problemEncountered.edgeCases) {
        expect(screen.getByText(edgeCase)).toBeInTheDocument();
      }
      for (const constraint of cs.problemEncountered.constraints) {
        expect(screen.getByText(constraint)).toBeInTheDocument();
      }

      // Section 3: Why Built This Way
      expect(screen.getByRole('heading', { level: 2, name: /why built this way|architectural decisions/i })).toBeInTheDocument();
      expect(screen.getByText(cs.whyBuiltThisWay.architecturalInsight)).toBeInTheDocument();
      for (const tradeOff of cs.whyBuiltThisWay.tradeOffs) {
        expect(screen.getByText(tradeOff.decision)).toBeInTheDocument();
        expect(screen.getByText(tradeOff.rationale)).toBeInTheDocument();
      }
      if (cs.whyBuiltThisWay.guardrails) {
        for (const guardrail of cs.whyBuiltThisWay.guardrails) {
          expect(screen.getByText(guardrail)).toBeInTheDocument();
        }
      }

      // Section 4: Outcomes, Verification & Key Takeaways
      expect(screen.getByRole('heading', { level: 2, name: /outcomes|verification & key takeaways/i })).toBeInTheDocument();
      for (const verif of cs.outcomes.verification) {
        expect(screen.getByText(verif)).toBeInTheDocument();
      }
      for (const imp of cs.outcomes.impact) {
        expect(screen.getByText(imp)).toBeInTheDocument();
      }
      expect(screen.getByText(cs.outcomes.takeaway)).toBeInTheDocument();
    });
  });

  describe('Valid Case Study: NL2REGEX', () => {
    it('renders NL2REGEX specific ADR trade-offs, metrics, and external links', () => {
      renderWithRoute('nl2regex');
      const nl2regex = projects.find((p) => p.slug === 'nl2regex')!;

      expect(screen.getByRole('heading', { level: 1, name: new RegExp(nl2regex.title, 'i') })).toBeInTheDocument();
      expect(screen.getByText(/1,000,000\+ rows processed/i)).toBeInTheDocument();
      expect(screen.getByText(/Two-Stage LLM Triage \(ADR 0003\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Canonical Parquet Normalization \(ADR 0002\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Local Singleton JVM Session \(ADR 0004\)/i)).toBeInTheDocument();

      // Demo and Video links
      const demoLinks = screen.getAllByRole('link', { name: /demo|live demo/i });
      expect(demoLinks.some((link) => link.getAttribute('href') === 'http://207.148.87.49')).toBe(true);

      const videoLinks = screen.getAllByRole('link', { name: /video/i });
      expect(videoLinks.some((link) => link.getAttribute('href') === 'https://youtu.be/mFec2jMgosg')).toBe(true);
    });
  });

  describe('Not Found / 404 Fallback State', () => {
    it('renders clean not-found message with back to projects link for invalid slug', () => {
      renderWithRoute('nonexistent-project-slug');

      expect(screen.getByRole('heading', { level: 1, name: /project not found|case study not found/i })).toBeInTheDocument();
      expect(screen.getByText(/the project you are looking for does not exist/i)).toBeInTheDocument();

      const backToProjectsLink = screen.getByRole('link', { name: /back to projects|return to catalog/i });
      expect(backToProjectsLink).toBeInTheDocument();
      expect(backToProjectsLink).toHaveAttribute('href', '/projects');
    });
  });
});
