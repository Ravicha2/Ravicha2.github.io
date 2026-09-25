import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { workExperience } from '../../src/data/experience';
import { profile } from '../../src/data/profile';

/**
 * The CV is a committed artifact built by `npm run cv:build` (see ADR 0003), so
 * CI never runs typst. These checks cover what can be verified without it: the
 * artifact exists, and its source does not contradict `src/data/`.
 */
describe('CV artifact and source', () => {
  const root = path.resolve(__dirname, '../..');
  const pdfPath = path.join(root, 'public/cv.pdf');
  const sourcePath = path.join(root, 'Ravicha_cv_AU.typ');

  // typst escapes the @ in an email address, so compare with escapes stripped.
  const source = fs.readFileSync(sourcePath, 'utf-8');
  const plain = source.replace(/\\/g, '');

  it('ships public/cv.pdf as a real PDF that GitHub Pages can serve', () => {
    expect(fs.existsSync(pdfPath), 'public/cv.pdf is missing — run npm run cv:build').toBe(true);
    expect(fs.readFileSync(pdfPath).subarray(0, 5).toString()).toBe('%PDF-');
  });

  it('keeps the tracked source of truth in the repo', () => {
    expect(fs.existsSync(sourcePath), 'Ravicha_cv_AU.typ must stay tracked (see ADR 0003)').toBe(true);
    expect(fs.existsSync(path.join(root, 'Ravicha_cv.typ')), 'the stale non-AU variant was deleted').toBe(false);
  });

  it('uses the canonical email and no superseded one', () => {
    expect(plain).toContain(profile.email);
    expect(plain).not.toContain('rsuksawasdi@gmail.com');
  });

  it('states the same period as the data for every role it lists', () => {
    // The CV deliberately omits older roles; the invariant is only that a role it
    // does mention cannot disagree with the site about its dates.
    const listedRoles = workExperience.filter((role) => source.includes(role.company));
    expect(listedRoles.length).toBeGreaterThan(0);

    for (const role of listedRoles) {
      expect(source, `${role.company} period disagrees with src/data`).toContain(role.period);
    }
  });

  it('carries no open-ended end date', () => {
    // Anchored on a year so a bullet like "- Presented ultrasound…" cannot match.
    expect(source).not.toMatch(/\d{4}\s*(?:–|—|-)\s*present/i);
    expect(source).not.toMatch(/\d{4}\s*(?:–|—|-)\s*current/i);
  });
});
