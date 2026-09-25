import type React from 'react';
import {
  workExperience,
  education,
  publications,
  accolades,
  skillCategories,
} from '../data/experience';
import { ContactBlock } from '../components/common/ContactBlock';
import { FeatureControlFrame } from '../components/sheet/FeatureControlFrame';

const linkClass =
  'font-mono text-[11px] uppercase tracking-widest text-annotate underline underline-offset-4 decoration-1 decoration-annotate hover:text-ink hover:decoration-ink rounded';

/** A numbered run of lines, the same shape the proof traces are read in. */
const Items: React.FC<{ items: string[]; className?: string }> = ({ items, className = '' }) => (
  <ul className={`space-y-2 ${className}`}>
    {items.map((item, i) => (
      <li key={i} className="measure flex gap-3 text-sm leading-relaxed">
        <span className="font-mono text-[11px] text-annotate shrink-0 pt-0.5" aria-hidden="true">
          {String(i + 1).padStart(2, '0')}
        </span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const SectionHead: React.FC<{ id: string; heading: string; annotation: string }> = ({
  id,
  heading,
  annotation,
}) => (
  <div className="rule-verified pt-3">
    <h2 id={id} className="text-xl sm:text-2xl font-semibold tracking-[-0.01em]">
      {heading}
    </h2>
    <p className="mt-1 font-mono text-[11px] text-annotate">{annotation}</p>
  </div>
);

export const ExperienceView: React.FC = () => (
  <div className="space-y-14">
    <header>
      <FeatureControlFrame
        as="h1"
        nominal="Engineering journey & experience"
        tolerance={
          <>
            {workExperience.length} roles · {education.length} degrees ·{' '}
            {publications.length} peer-reviewed paper · {accolades.length} accolades
          </>
        }
        datum="Résumé, in full. The CV in the title block carries the same entries."
      />
      <p className="measure mt-5 text-sm sm:text-base leading-relaxed text-pretty">
        Originally trained in Automotive Design & Manufacturing Engineering at Chulalongkorn
        University. During an IoT exchange at IMT Atlantique in France right when modern LLMs
        took off, saw the potential of combining software intelligence with systems
        engineering and made a decisive pivot to Computer Science.
      </p>
    </header>

    {/* Work experience, as a record of engagements rather than a stack of cards. */}
    <section aria-labelledby="work-experience-heading" className="space-y-6">
      <SectionHead
        id="work-experience-heading"
        heading="Work Experience"
        annotation="Production engineering, distributed pipelines, and systems design"
      />

      <div>
        {workExperience.map((item) => (
          <article
            key={item.id}
            data-testid={`work-item-${item.id}`}
            className="relative rule-thin pt-4 pb-6 grid gap-x-6 gap-y-3 sm:grid-cols-[10rem_minmax(0,1fr)]"
          >
            <div>
              <p className="font-mono text-[13px] text-ink flex flex-wrap items-baseline gap-x-2">
                <span>{item.period}</span>
                {item.isCurrent && (
                  <span className="text-[10px] uppercase tracking-widest text-annotate font-semibold">
                    Current
                  </span>
                )}
              </p>
              <p className="font-mono text-[11px] text-annotate mt-1">
                <span>{item.location}</span>
              </p>
            </div>

            <div className="min-w-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-6 gap-y-1">
                <h3 className="text-lg font-semibold tracking-[-0.01em]">
                  <span>{item.role}</span>
                </h3>
                <p className="font-mono text-[13px] text-annotate shrink-0">
                  <span>{item.company}</span>
                </p>
              </div>

              <Items items={item.description} />

              {item.highlights && item.highlights.length > 0 && (
                <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-annotate">
                    Highlights
                  </span>
                  {item.highlights.map((highlight, idx) => (
                    <span key={idx} className="font-mono text-[11px] text-ink">
                      {highlight}
                    </span>
                  ))}
                </p>
              )}

              <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-1">
                {item.tags.map((tag) => (
                  <span key={tag} className="font-mono text-[11px] text-annotate">
                    {tag}
                  </span>
                ))}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                    aria-label={`${item.company} repository (opens in a new tab)`}
                  >
                    View repository
                  </a>
                )}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>

    {/* Education */}
    <section aria-labelledby="education-heading" className="space-y-6">
      <SectionHead
        id="education-heading"
        heading="Education & Academic Foundations"
        annotation="Degrees, international exchange study, and foundational engineering training"
      />

      <div>
        {education.map((edu) => (
          <article
            key={edu.id}
            data-testid={`edu-item-${edu.id}`}
            className="rule-thin pt-4 pb-6 grid gap-x-6 gap-y-3 sm:grid-cols-[10rem_minmax(0,1fr)]"
          >
            <div>
              <p className="font-mono text-[13px] text-ink">
                <span>{edu.period}</span>
              </p>
              {edu.grade && (
                <p className="font-mono text-[11px] text-ink mt-1">{edu.grade}</p>
              )}
              <p className="font-mono text-[11px] text-annotate mt-1">
                <span>{edu.location}</span>
              </p>
            </div>

            <div className="min-w-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-6 gap-y-1">
                <h3 className="text-lg font-semibold tracking-[-0.01em]">
                  <span>{edu.degree}</span>
                </h3>
                <p className="font-mono text-[13px] text-annotate shrink-0">
                  <span>{edu.institution}</span>
                </p>
              </div>

              {edu.field && (
                <p className="font-mono text-[11px] text-annotate">
                  <span className="uppercase tracking-widest">Field of study</span>
                  <span aria-hidden="true"> · </span>
                  <span className="text-ink">{edu.field}</span>
                </p>
              )}

              <Items items={edu.details} />
            </div>
          </article>
        ))}
      </div>
    </section>

    {/* Publications and accolades */}
    <section aria-labelledby="publications-accolades-heading" className="space-y-6">
      <SectionHead
        id="publications-accolades-heading"
        heading="Publications & Accolades"
        annotation="Peer-reviewed research, hackathon awards, and leadership development"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {publications.map((pub) => (
          <article
            key={pub.id}
            data-testid={`pub-item-${pub.id}`}
            className="rule-verified pt-4 space-y-4"
          >
            <p className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-[11px]">
              <span className="uppercase tracking-widest text-annotate">IEEE Publication</span>
              <span className="text-annotate">{pub.date}</span>
            </p>

            <h3 className="text-base font-semibold leading-snug">{pub.title}</h3>

            <p className="font-mono text-[13px] text-annotate">{pub.conference}</p>

            {pub.image && (
              <figure>
                <img
                  src={pub.image}
                  alt={pub.imageCaption || pub.title}
                  className="w-full h-48 sm:h-56 object-cover object-center border border-ink"
                  loading="lazy"
                />
                {pub.imageCaption && (
                  <figcaption className="border-x border-b border-ink px-3 py-1.5 font-mono text-[11px] text-annotate">
                    {pub.imageCaption}
                  </figcaption>
                )}
              </figure>
            )}

            <dl className="font-mono text-[11px] space-y-1 border-y border-annotate py-2.5">
              <div className="flex gap-2">
                <dt className="uppercase tracking-widest text-annotate w-20 shrink-0">Authors</dt>
                <dd className="text-ink">{pub.authors.join(', ')}</dd>
              </div>
              {pub.advisor && (
                <div className="flex gap-2">
                  <dt className="uppercase tracking-widest text-annotate w-20 shrink-0">Advisor</dt>
                  <dd className="text-ink">{pub.advisor}</dd>
                </div>
              )}
              <div className="flex gap-2">
                <dt className="uppercase tracking-widest text-annotate w-20 shrink-0">Role</dt>
                <dd className="text-ink">{pub.role}</dd>
              </div>
            </dl>

            <ul className="space-y-2">
              {pub.description.map((desc, idx) => (
                <li key={idx} className="measure text-sm leading-relaxed">
                  {desc}
                </li>
              ))}
            </ul>

            {pub.link && (
              <p>
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                  aria-label="Read paper on IEEE Xplore (opens in a new tab)"
                >
                  View on IEEE Xplore
                </a>
              </p>
            )}
          </article>
        ))}

        {accolades.map((acc) => (
          <article
            key={acc.id}
            data-testid={`accolade-item-${acc.id}`}
            className="rule-verified pt-4 space-y-3"
          >
            <p className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-[11px]">
              <span className="uppercase tracking-widest text-annotate">
                <span>{acc.organization}</span>
              </span>
              <span className="text-annotate">{acc.date}</span>
            </p>

            <h3 className="text-[15px] font-semibold">{acc.title}</h3>

            {acc.image && (
              <figure>
                <img
                  src={acc.image}
                  alt={acc.imageCaption || acc.title}
                  className="w-full h-40 sm:h-48 object-cover object-top border border-ink"
                  loading="lazy"
                />
                {acc.imageCaption && (
                  <figcaption className="border-x border-b border-ink px-3 py-1.5 font-mono text-[11px] text-annotate">
                    {acc.imageCaption}
                  </figcaption>
                )}
              </figure>
            )}

            <p className="measure text-sm leading-relaxed">{acc.description}</p>

            {acc.link && (
              <p>
                <a
                  href={acc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                  aria-label={`View ${acc.title} project live platform at ${acc.link} (opens in a new tab)`}
                >
                  heal.a2a.ing
                </a>
              </p>
            )}
          </article>
        ))}
      </div>
    </section>

    {/* Skills */}
    <section
      id="skills-taxonomy"
      data-testid="skills-taxonomy"
      aria-labelledby="skills-taxonomy-heading"
      className="space-y-6"
    >
      <SectionHead
        id="skills-taxonomy-heading"
        heading="Technical Skills Taxonomy"
        annotation="Categorized matrix of languages, frameworks, storage systems, and infrastructure"
      />

      <dl className="grid gap-x-8 gap-y-5 md:grid-cols-2">
        {skillCategories.map((group) => (
          <div
            key={group.category}
            data-testid={`skill-group-${group.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            className="rule-thin pt-3"
          >
            <dt className="font-mono text-[10px] uppercase tracking-widest text-annotate">
              {group.category}
            </dt>
            <dd className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
              {group.skills.map((skill) => (
                <span key={skill} className="font-mono text-[13px] text-ink">
                  {skill}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>

    <ContactBlock />
  </div>
);

export default ExperienceView;
