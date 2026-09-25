import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { featuredProjects } from '../../src/data/projects';

describe('AI Agent Protocol Files (llms.txt & llms-full.txt)', () => {
  const publicDir = path.resolve(__dirname, '../../public');
  const llmsTxtPath = path.join(publicDir, 'llms.txt');
  const llmsFullTxtPath = path.join(publicDir, 'llms-full.txt');

  it('verifies public/llms.txt exists and conforms to llmstxt.org structure', () => {
    expect(fs.existsSync(llmsTxtPath)).toBe(true);
    const content = fs.readFileSync(llmsTxtPath, 'utf-8');

    // Header & High level summary
    expect(content).toContain('# Palm (Ravicha) Suksawasdi Na Ayuthaya');
    expect(content).toContain('Applied AI & Backend Systems Engineer');
    expect(content).toContain('UNSW Sydney');

    // Pointer to full dossier
    expect(content).toContain('llms-full.txt');

    // Key projects
    expect(content).toContain('Shepherd');
    expect(content).toContain('NL2REGEX');
    expect(content).toContain('document-ingestion-agent');
    expect(content).toContain('lit-review-council');

    // Core links
    expect(content).toContain('https://github.com/Ravicha2');
    expect(content).toContain('https://www.linkedin.com/in/ravicha-suksawasdi-na-ayuthaya/');
    expect(content).toContain('https://pypi.org/project/lit-review-council/');
  });

  it('verifies public/llms-full.txt exists and contains complete case study dossiers', () => {
    expect(fs.existsSync(llmsFullTxtPath)).toBe(true);
    const content = fs.readFileSync(llmsFullTxtPath, 'utf-8');

    // Full narrative
    expect(content).toContain('Automotive Engineering');
    expect(content).toContain('IMT Atlantique');
    expect(content).toContain('WAM 83');

    // 4-Part case studies
    expect(content).toContain('1. The Core Intuition & Friction');
    expect(content).toContain('2. The Root Problem Encountered');
    expect(content).toContain('3. Why Built This Way');
    expect(content).toContain('4. Outcomes, Verification & Key Takeaways');

    // Technical details
    expect(content).toContain('GraphRAG');
    expect(content).toContain('Two-Stage LLM Triage (ADR 0003)');
    expect(content).toContain('Inngest');
    expect(content).toContain('Borda-Count Consensus');
    expect(content).toContain('TENCON 2023');
  });

  // The dossier files are hand-maintained. These tests are the tether: editing only the
  // site data (or only the dossier) must fail loudly rather than shipping a silent split.
  describe('Site ↔ dossier parity', () => {
    const read = (file: string) => fs.readFileSync(file, 'utf-8');

    // Scoped to the flagship case studies: the dossier details those four in full and has no
    // supporting-projects section, so requiring node-api / robotic-arm / heal metrics here
    // would demand content the dossier is not meant to carry.
    it('reproduces every flagship project metric verbatim in llms-full.txt', () => {
      const content = read(llmsFullTxtPath);
      for (const project of featuredProjects) {
        for (const metric of project.metrics ?? []) {
          expect(content, `${project.slug}: metric "${metric}" is missing from llms-full.txt`).toContain(metric);
        }
      }
    });

    it('does not assert flagship claims that were removed from the project data', () => {
      const stale = [
        'Zero AST-ADR rule drift',
        'Automated PR blocking status checks',
        'Sub-second PR status check latency',
        'false negative tolerance',
        'Lead Researcher',
        'Systems Engineering Intern',
      ];
      for (const file of [llmsFullTxtPath, llmsTxtPath]) {
        const content = read(file);
        for (const claim of stale) {
          expect(content, `${path.basename(file)} still asserts "${claim}"`).not.toContain(claim);
        }
      }
    });

    it('does not attribute sub-millimeter accuracy to the robotics project entry', () => {
      // The claim legitimately survives in the IEEE publication description (it is still in
      // experience.ts), but it was removed from the robotic-arm project metrics — so the
      // short dossier, which describes projects, must not re-assert it there.
      expect(read(llmsTxtPath)).not.toContain('sub-millimeter');
    });

    it('keeps role titles and timelines in step with the experience data', () => {
      const full = read(llmsFullTxtPath);
      expect(full).toContain('Researcher & Developer (UNSW Sydney)');
      expect(full).toContain('Field Engineering Intern');
      expect(full).toContain('Jul 2026 – Sep 2026');
    });
  });
});
