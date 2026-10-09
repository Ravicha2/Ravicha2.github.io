import type React from 'react';
import { profile } from '../data/profile';
import { workExperience, education, accolades, skillCategories } from '../data/experience';
import { projects, tierOf } from '../data/projects';
import { TransitionLink } from '../components/common/TransitionLink';
import { ContactBlock } from '../components/common/ContactBlock';
import { Block, PageHead } from '../components/common/PageBlocks';

const linkClass =
  'font-mono text-[11px] text-annotate underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-spark';

export const AboutView: React.FC = () => {
  const settled = projects.filter((p) => tierOf(p) === 'settled').length;
  const inProgress = projects.filter((p) => tierOf(p) === 'in-progress').length;

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHead
        id="about-heading"
        title={`About ${profile.preferredName}`}
        lead={
          <>
            {profile.name} is an {profile.title.toLowerCase()} working in {profile.location}, and
            this page is the plain account of who that is: where the engineering came from, what the
            work is now, and which claims on this site are settled and which are not.
          </>
        }
      />

      <Block id="who-heading" heading="In short">
        <p className="measure text-sm leading-relaxed text-pretty">{profile.summary}</p>
        <p className="measure text-sm leading-relaxed text-pretty">{profile.status}</p>
      </Block>

      <Block id="origin-heading" heading="Where this came from">
        <p className="measure text-sm leading-relaxed text-pretty">{profile.narrative.origin}</p>
        <p className="measure text-sm leading-relaxed text-pretty">
          {profile.narrative.systemsMindset}
        </p>
      </Block>

      <Block id="now-heading" heading="What the work is now">
        <p className="measure text-sm leading-relaxed text-pretty">{profile.narrative.appliedAi}</p>
        <p className="measure text-sm leading-relaxed text-pretty">
          The {projects.length} projects catalogued here are not equally finished, and the site says
          which is which rather than implying a uniform standard: {settled} are measured to a public
          artifact, {inProgress} are still in progress and say so on their own page, and the rest are
          supporting work. The catalog is at{' '}
          <TransitionLink to="/projects" className={linkClass}>
            /projects
          </TransitionLink>
          .
        </p>
      </Block>

      <Block id="experience-heading" heading="Experience and study">
        <ul className="measure space-y-3 text-sm leading-relaxed">
          {workExperience.slice(0, 3).map((role) => (
            <li key={role.id}>
              <span className="text-ink">{role.role}</span>, {role.company} — {role.period}.{' '}
              {role.description[0]}
            </li>
          ))}
          {education.slice(0, 2).map((item) => (
            <li key={item.id}>
              <span className="text-ink">{item.degree}</span>, {item.institution} — {item.period}
              {item.grade ? ` · ${item.grade}` : ''}.
            </li>
          ))}
        </ul>
        <p className="measure text-sm leading-relaxed">
          The full timeline, including publications and accolades, is at{' '}
          <TransitionLink to="/experience" className={linkClass}>
            /experience
          </TransitionLink>
          .
        </p>
      </Block>

      <Block id="record-heading" heading="How the record is kept">
        <p className="measure text-sm leading-relaxed text-pretty">
          Every measurement on this site is quoted from a public artifact and pinned to the commit it
          was read at, so a claim can be checked rather than believed. Where a figure rests on work
          that is not public — an annotation study held in a private repository, for instance — the
          page says so next to the figure instead of dropping the caveat from the summary. That is
          also why this site publishes a machine-readable dossier: an agent that has to cite this work
          should be able to read the same qualifications a person does.
        </p>
      </Block>

      <Block id="skills-heading" heading="Skills">
        <ul className="measure space-y-3 text-sm leading-relaxed">
          {skillCategories.map((category) => (
            <li key={category.category}>
              <span className="text-ink">{category.category}</span>: {category.skills.join(', ')}.
            </li>
          ))}
        </ul>
      </Block>

      <Block id="awards-heading" heading="Recognition">
        <ul className="measure space-y-3 text-sm leading-relaxed">
          {accolades.map((item) => (
            <li key={item.id}>
              <span className="text-ink">{item.title}</span> — {item.organization}, {item.date}.{' '}
              {item.description}
            </li>
          ))}
        </ul>
      </Block>

      <ContactBlock />
    </div>
  );
};

export default AboutView;
