import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

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
});
