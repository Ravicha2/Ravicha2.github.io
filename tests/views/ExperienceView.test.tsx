import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ExperienceView } from '../../src/views/ExperienceView';
import { workExperience, education, accolades, skillCategories } from '../../src/data/experience';

describe('ExperienceView Component', () => {
  const renderExperienceView = () =>
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ExperienceView />
      </MemoryRouter>
    );

  describe('Header and Narrative Overview', () => {
    it('renders the main heading and progression narrative subtitle', () => {
      renderExperienceView();
      expect(
        screen.getByRole('heading', { level: 1, name: /Engineering Journey & Experience/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/A chronological progression from physical systems engineering to distributed & agentic AI architectures/i)
      ).toBeInTheDocument();
    });
  });

  describe('Work Experience Timeline', () => {
    it('renders the work experience section heading', () => {
      renderExperienceView();
      expect(
        screen.getByRole('heading', { level: 2, name: /Work Experience/i })
      ).toBeInTheDocument();
    });

    it('renders all work experience timeline items with roles, companies, and dates', () => {
      renderExperienceView();

      for (const item of workExperience) {
        const itemElement = screen.getByTestId(`work-item-${item.id}`);
        expect(itemElement).toBeInTheDocument();

        expect(within(itemElement).getByText(new RegExp(item.company, 'i'))).toBeInTheDocument();
        expect(within(itemElement).getByText(new RegExp(item.role, 'i'))).toBeInTheDocument();
        expect(within(itemElement).getByText(item.period)).toBeInTheDocument();
        expect(within(itemElement).getByText(new RegExp(item.location, 'i'))).toBeInTheDocument();
      }
    });

    it('renders technical rationales and bullet points for experience entries', () => {
      renderExperienceView();

      const tendorCard = screen.getByTestId('work-item-tendor');
      expect(within(tendorCard).getByText(/backend services, automated workflows, and AI agent integrations/i)).toBeInTheDocument();

      const nodesNowCard = screen.getByTestId('work-item-nodesnow');
      expect(within(nodesNowCard).getByText(/fault-tolerant AI agent orchestration system using Inngest/i)).toBeInTheDocument();
      expect(within(nodesNowCard).getByText(/persisted ingested data into pgvector and neo4j/i)).toBeInTheDocument();

      const heatingCard = screen.getByTestId('work-item-3d-technical-design');
      expect(within(heatingCard).getByText(/stress calculations for heat distribution/i)).toBeInTheDocument();

      const schindlerCard = screen.getByTestId('work-item-jardine-schindler');
      expect(within(schindlerCard).getByText(/electromechanical systems engineering analysis/i)).toBeInTheDocument();
    });

    it('renders repository / external links for entries with external resources', () => {
      renderExperienceView();

      const nodesNowCard = screen.getByTestId('work-item-nodesnow');
      const repoLink = within(nodesNowCard).getByRole('link', { name: /view repository|repository/i });
      expect(repoLink).toHaveAttribute('href', 'https://github.com/Ravicha2/document-ingestion-agent');
      expect(repoLink).toHaveAttribute('target', '_blank');
      expect(repoLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });

    it('renders technology tags for each work experience entry', () => {
      renderExperienceView();

      const tendorCard = screen.getByTestId('work-item-tendor');
      expect(within(tendorCard).getByText('TypeScript')).toBeInTheDocument();
      expect(within(tendorCard).getByText('AI Agents')).toBeInTheDocument();

      const nodesNowCard = screen.getByTestId('work-item-nodesnow');
      expect(within(nodesNowCard).getByText('NestJS')).toBeInTheDocument();
      expect(within(nodesNowCard).getByText('Neo4j')).toBeInTheDocument();
    });
  });

  describe('Education Milestones', () => {
    it('renders the education section heading', () => {
      renderExperienceView();
      expect(
        screen.getByRole('heading', { level: 2, name: /Education & Academic Foundations/i })
      ).toBeInTheDocument();
    });

    it('renders all education entries including UNSW, IMT Atlantique, and Chulalongkorn', () => {
      renderExperienceView();

      for (const edu of education) {
        const eduElement = screen.getByTestId(`edu-item-${edu.id}`);
        expect(eduElement).toBeInTheDocument();

        expect(within(eduElement).getByText(new RegExp(edu.institution, 'i'))).toBeInTheDocument();
        expect(within(eduElement).getByText(new RegExp(edu.degree, 'i'))).toBeInTheDocument();
        expect(within(eduElement).getByText(edu.period)).toBeInTheDocument();
      }
    });

    it('renders academic distinction and key coursework/focus for UNSW', () => {
      renderExperienceView();
      const unswItem = screen.getByTestId('edu-item-unsw');
      expect(within(unswItem).getAllByText(/WAM 83/i).length).toBeGreaterThanOrEqual(1);
      expect(within(unswItem).getAllByText(/Distinction/i).length).toBeGreaterThanOrEqual(1);
      expect(within(unswItem).getByText(/Advanced Algorithms/i)).toBeInTheDocument();
    });

    it('renders IoT pivot narrative for IMT Atlantique', () => {
      renderExperienceView();
      const imtItem = screen.getByTestId('edu-item-imt-atlantique');
      expect(within(imtItem).getAllByText(/Architecture and Engineering in IoT/i).length).toBeGreaterThanOrEqual(1);
      expect(within(imtItem).getByText(/Key turning point sparking the transition/i)).toBeInTheDocument();
    });
  });

  describe('Publications and Accolades', () => {
    it('renders the publications and accolades section heading', () => {
      renderExperienceView();
      expect(
        screen.getByRole('heading', { level: 2, name: /Publications & Accolades/i })
      ).toBeInTheDocument();
    });

    it('renders the IEEE TENCON 2023 publication with conference, title, and external link', () => {
      renderExperienceView();
      const pubItem = screen.getByTestId('pub-item-tencon-2023');
      expect(pubItem).toBeInTheDocument();

      expect(within(pubItem).getByText(/Position Accuracy of a 6-DOF Passive Robotic Arm/i)).toBeInTheDocument();
      expect(within(pubItem).getByText(/IEEE Region 10 Technical Conference \(TENCON 2023\)/i)).toBeInTheDocument();

      const paperLink = within(pubItem).getByRole('link', { name: /ieee xplore|read paper|ieee/i });
      expect(paperLink).toHaveAttribute('href', 'https://ieeexplore.ieee.org/document/10349000');
      expect(paperLink).toHaveAttribute('target', '_blank');
    });

    it('renders accolades including Hack2Heal award and UNSW leadership programs', () => {
      renderExperienceView();

      for (const accolade of accolades) {
        const accoladeItem = screen.getByTestId(`accolade-item-${accolade.id}`);
        expect(accoladeItem).toBeInTheDocument();
        expect(within(accoladeItem).getByText(new RegExp(accolade.title, 'i'))).toBeInTheDocument();
        expect(within(accoladeItem).getByText(new RegExp(accolade.organization, 'i'))).toBeInTheDocument();
      }

      // Hack2Heal link check
      const hack2healItem = screen.getByTestId('accolade-item-hack2heal');
      const hackLink = within(hack2healItem).getByRole('link', { name: /heal\.a2a\.ing/i });
      expect(hackLink).toHaveAttribute('href', 'https://heal.a2a.ing');
    });
  });

  describe('Technical Skills Taxonomy', () => {
    it('renders the skills matrix section heading', () => {
      renderExperienceView();
      expect(
        screen.getByRole('heading', { level: 2, name: /Technical Skills Taxonomy/i })
      ).toBeInTheDocument();
    });

    it('renders all categorized skill groups and tag chips', () => {
      renderExperienceView();
      const skillsSection = screen.getByTestId('skills-taxonomy');

      for (const cat of skillCategories) {
        expect(within(skillsSection).getByText(cat.category)).toBeInTheDocument();
        for (const skill of cat.skills) {
          expect(within(skillsSection).getByText(skill)).toBeInTheDocument();
        }
      }
    });
  });
});
