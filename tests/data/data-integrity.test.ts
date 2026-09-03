import { describe, it, expect } from 'vitest';
import { profile } from '../../src/data/profile';
import { projects, featuredProjects, getProjectBySlug, projectCategories } from '../../src/data/projects';
import {
  experience,
  workExperience,
  education,
  publications,
  accolades,
  skillCategories,
} from '../../src/data/experience';

describe('Data Layer Integrity', () => {
  describe('Profile Data', () => {
    it('exports valid personal details and professional title', () => {
      expect(profile).toBeDefined();
      expect(profile.name).toMatch(/Palm|Ravicha/);
      expect(profile.fullName).toBe('Ravicha Suksawasdi Na Ayuthaya');
      expect(profile.preferredName).toBe('Palm');
      expect(profile.title).toContain('Applied AI');
      expect(profile.headline).toBeDefined();
      expect(profile.headline.length).toBeGreaterThan(15);
      expect(profile.status).toContain('UNSW');
      expect(profile.status).toContain('Dec 2026');
      expect(profile.location).toContain('Sydney');
    });

    it('exports complete and valid contact links', () => {
      expect(profile.links).toBeDefined();
      expect(profile.links.github).toMatch(/github\.com\/[Rr]avicha2?/);
      expect(profile.links.linkedin).toMatch(/linkedin\.com\/in\/ravicha/);
      expect(profile.links.email).toMatch(/@/);
    });

    it('exports structured narrative paragraphs depicting the Automotive to AI arc', () => {
      expect(profile.narrative).toBeDefined();
      expect(profile.narrative.origin).toContain('Automotive');
      expect(profile.narrative.systemsMindset).toContain('systems');
      expect(profile.narrative.appliedAi).toContain('UNSW');
      expect(profile.narrative.target).toContain('2026');
      expect(Array.isArray(profile.narrative.paragraphs)).toBe(true);
      expect(profile.narrative.paragraphs.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Projects Data', () => {
    it('contains unique slugs across all projects', () => {
      expect(projects.length).toBeGreaterThan(0);
      const slugs = projects.map((p) => p.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('contains all 4 flagship case studies with featured: true', () => {
      const requiredFlagships = ['shepherd', 'nl2regex', 'document-ingestion-agent', 'lit-review-council'];
      for (const slug of requiredFlagships) {
        const proj = projects.find((p) => p.slug === slug);
        expect(proj, `Missing flagship project ${slug}`).toBeDefined();
        expect(proj?.featured).toBe(true);
      }
      expect(featuredProjects.length).toBe(4);
    });

    it('contains supporting projects', () => {
      expect(projects.length).toBeGreaterThanOrEqual(6);
      const supportingSlugs = projects.map((p) => p.slug);
      expect(supportingSlugs).toContain('node-api');
    });

    it('validates each project has non-empty tags, title, subtitle, and category', () => {
      projects.forEach((proj) => {
        expect(proj.slug.trim()).not.toBe('');
        expect(proj.title.trim()).not.toBe('');
        expect(proj.subtitle.trim()).not.toBe('');
        expect(proj.category.trim()).not.toBe('');
        expect(proj.categoryLabel.trim()).not.toBe('');
        expect(proj.tags.length).toBeGreaterThan(0);
        proj.tags.forEach((tag) => expect(tag.trim()).not.toBe(''));
        expect(proj.summary.trim()).not.toBe('');
        expect(proj.links).toBeDefined();
      });
    });

    it('validates complete 4-part case study fields for all flagship projects', () => {
      featuredProjects.forEach((proj) => {
        expect(proj.caseStudy, `Flagship ${proj.slug} must have caseStudy`).toBeDefined();
        const cs = proj.caseStudy!;

        // 1. Intuition & Friction
        expect(cs.intuition).toBeDefined();
        expect(cs.intuition.spark.trim().length).toBeGreaterThan(20);
        expect(cs.intuition.naiveFailureMode.trim().length).toBeGreaterThan(20);

        // 2. Problem Encountered
        expect(cs.problemEncountered).toBeDefined();
        expect(cs.problemEncountered.edgeCases.length).toBeGreaterThan(0);
        expect(cs.problemEncountered.constraints.length).toBeGreaterThan(0);

        // 3. Why Built This Way
        expect(cs.whyBuiltThisWay).toBeDefined();
        expect(cs.whyBuiltThisWay.architecturalInsight.trim().length).toBeGreaterThan(20);
        expect(cs.whyBuiltThisWay.tradeOffs.length).toBeGreaterThan(0);
        cs.whyBuiltThisWay.tradeOffs.forEach((t) => {
          expect(t.decision.trim()).not.toBe('');
          expect(t.rationale.trim()).not.toBe('');
        });

        // 4. Outcomes & Verification
        expect(cs.outcomes).toBeDefined();
        expect(cs.outcomes.verification.length).toBeGreaterThan(0);
        expect(cs.outcomes.impact.length).toBeGreaterThan(0);
        expect(cs.outcomes.takeaway.trim().length).toBeGreaterThan(20);
      });
    });

    it('allows finding project by slug helper', () => {
      const shepherd = getProjectBySlug('shepherd');
      expect(shepherd).toBeDefined();
      expect(shepherd?.title).toContain('Shepherd');

      const nonexistent = getProjectBySlug('non-existent-slug');
      expect(nonexistent).toBeUndefined();
    });

    it('provides valid category definitions', () => {
      expect(projectCategories.length).toBeGreaterThanOrEqual(4);
      expect(projectCategories.some((c) => c.id === 'all')).toBe(true);
    });
  });

  describe('Experience Data', () => {
    it('contains all required work experience items', () => {
      expect(workExperience.length).toBeGreaterThanOrEqual(3);

      const companies = workExperience.map((w) => w.company);
      expect(companies.some((c) => /NodesNow/i.test(c))).toBe(true);
      expect(companies.some((c) => /3D Technical Design/i.test(c))).toBe(true);
      expect(companies.some((c) => /Schindler/i.test(c))).toBe(true);

      workExperience.forEach((item) => {
        expect(item.id.trim()).not.toBe('');
        expect(item.role.trim()).not.toBe('');
        expect(item.company.trim()).not.toBe('');
        expect(item.period.trim()).not.toBe('');
        expect(item.location.trim()).not.toBe('');
        expect(item.description.length).toBeGreaterThan(0);
        expect(item.tags.length).toBeGreaterThan(0);
      });
    });

    it('contains all education milestones', () => {
      expect(education.length).toBeGreaterThanOrEqual(3);

      const institutions = education.map((e) => e.institution);
      expect(institutions.some((i) => /UNSW/i.test(i))).toBe(true);
      expect(institutions.some((i) => /IMT Atlantique/i.test(i))).toBe(true);
      expect(institutions.some((i) => /Chulalongkorn/i.test(i))).toBe(true);

      education.forEach((item) => {
        expect(item.id.trim()).not.toBe('');
        expect(item.degree.trim()).not.toBe('');
        expect(item.institution.trim()).not.toBe('');
        expect(item.period.trim()).not.toBe('');
        expect(item.details.length).toBeGreaterThan(0);
      });
    });

    it('contains IEEE publication', () => {
      expect(publications.length).toBeGreaterThanOrEqual(1);
      const tencon = publications.find((p) => p.conference.includes('TENCON') || p.title.includes('6-DOF'));
      expect(tencon).toBeDefined();
      expect(tencon?.year).toBe(2023);
      expect(tencon?.title).toContain('6-DOF Passive Robotic Arm');
      expect(tencon?.authors.length).toBeGreaterThan(0);
    });

    it('contains accolades including Hack2Heal and leadership programs', () => {
      expect(accolades.length).toBeGreaterThanOrEqual(2);
      const hackathon = accolades.find((a) => /Hack2Heal/i.test(a.title) || /Hack2Heal/i.test(a.organization));
      expect(hackathon).toBeDefined();
      expect(hackathon?.title).toContain("Founder's Choice");
    });

    it('contains comprehensive skill categories', () => {
      expect(skillCategories.length).toBeGreaterThanOrEqual(4);
      const categoryNames = skillCategories.map((s) => s.category);
      expect(categoryNames.some((c) => /Languages/i.test(c))).toBe(true);
      expect(categoryNames.some((c) => /Frameworks/i.test(c) || /Backend/i.test(c))).toBe(true);
      expect(categoryNames.some((c) => /Data/i.test(c) || /Databases/i.test(c))).toBe(true);
      expect(categoryNames.some((c) => /Cloud/i.test(c) || /DevOps/i.test(c) || /Tools/i.test(c))).toBe(true);

      skillCategories.forEach((cat) => {
        expect(cat.skills.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('exports bundled experience object matching child arrays', () => {
      expect(experience.work).toEqual(workExperience);
      expect(experience.education).toEqual(education);
      expect(experience.publications).toEqual(publications);
      expect(experience.accolades).toEqual(accolades);
      expect(experience.skills).toEqual(skillCategories);
    });
  });
});
