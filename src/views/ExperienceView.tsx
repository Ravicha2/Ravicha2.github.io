import type React from 'react';
import {
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  Sparkles,
  ExternalLink,
  MapPin,
  Calendar,
  Code2,
  Layers,
  Database,
  Cloud,
  CheckCircle2,
} from 'lucide-react';
import {
  workExperience,
  education,
  publications,
  accolades,
  skillCategories,
} from '../data/experience';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const getCategoryIcon = (category: string) => {
  if (/Languages/i.test(category)) return <Code2 className="w-4 h-4 text-accent-solid" aria-hidden="true" />;
  if (/Frameworks|Libraries/i.test(category)) return <Layers className="w-4 h-4 text-accent-solid" aria-hidden="true" />;
  if (/Data|Databases/i.test(category)) return <Database className="w-4 h-4 text-accent-solid" aria-hidden="true" />;
  return <Cloud className="w-4 h-4 text-accent-solid" aria-hidden="true" />;
};

export const ExperienceView: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Page Header */}
      <header className="space-y-4 border-b border-border-subtle pb-6 sm:pb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent-badge-bg border border-border-subtle text-accent-badge-text text-xs font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Career & Education Timeline</span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-tight">
          Engineering Journey & Experience
        </h1>
        <p className="text-sm sm:text-lg text-text-secondary max-w-3xl leading-relaxed">
          A chronological progression from physical systems engineering to distributed & agentic AI architectures—combining mechanical rigor, durable orchestration, and graph-based intelligence.
        </p>
      </header>

      {/* Section 1: Work Experience Timeline */}
      <section aria-labelledby="work-experience-heading" className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-lg bg-surface border border-border-subtle text-text-primary">
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-accent-solid" aria-hidden="true" />
          </div>
          <div>
            <h2 id="work-experience-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Work Experience
            </h2>
            <p className="text-xs font-mono text-text-muted mt-0.5">
              Production engineering, distributed pipelines, and systems design
            </p>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-5 sm:pl-8 border-l border-border-subtle space-y-6 sm:space-y-8">
          {workExperience.map((item) => (
            <article
              key={item.id}
              data-testid={`work-item-${item.id}`}
              className="relative bg-surface border border-border-subtle rounded-lg p-4 sm:p-6 space-y-4 hover:border-border-strong transition-all duration-150"
            >
              {/* Timeline Node Bullet */}
              <div
                className={`absolute -left-[27px] sm:-left-[39px] top-5 sm:top-6 w-3.5 h-3.5 rounded-full border-2 border-canvas ${
                  item.isCurrent ? 'bg-accent-solid ring-4 ring-accent-badge-bg' : 'bg-text-muted'
                }`}
                aria-hidden="true"
              />

              {/* Header: Role, Company, Period, Location */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-text-primary tracking-tight">
                      {item.role}
                    </h3>
                    {item.isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-accent-badge-bg text-accent-badge-text border border-border-subtle font-semibold">
                        Current Role
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-accent-solid mt-0.5 flex-wrap">
                    <span>{item.company}</span>
                    <span className="text-text-muted select-none font-normal">·</span>
                    <span className="text-xs font-mono text-text-muted font-normal flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                      {item.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted bg-canvas px-2.5 py-1 rounded-md border border-border-subtle self-start sm:self-auto">
                  <Calendar className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                  <span>{item.period}</span>
                </div>
              </div>

              {/* Descriptions / Technical Rationales */}
              <ul className="space-y-2 text-sm text-text-secondary">
                {item.description.map((desc, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-accent-solid font-mono font-bold select-none mt-0.5">›</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>

              {/* Highlights & Tags */}
              <div className="space-y-3 pt-2">
                {item.highlights && item.highlights.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono font-medium text-text-muted">
                      Key Highlights:
                    </span>
                    {item.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-md bg-accent-badge-bg text-accent-badge-text border border-border-subtle font-medium"
                      >
                        <CheckCircle2 className="w-3 h-3 text-accent-solid" aria-hidden="true" />
                        <span>{highlight}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Tech Stack Chips & Link */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border-subtle">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-surface-hover text-text-secondary border border-border-subtle"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent-solid hover:underline focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded px-1.5 py-0.5"
                      aria-label={`${item.company} repository (opens in a new tab)`}
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>View Repository</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 2: Education */}
      <section aria-labelledby="education-heading" className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-surface border border-border-subtle text-text-primary">
            <GraduationCap className="w-5 h-5 text-accent-solid" aria-hidden="true" />
          </div>
          <div>
            <h2 id="education-heading" className="text-2xl font-bold tracking-tight text-text-primary">
              Education & Academic Foundations
            </h2>
            <p className="text-xs font-mono text-text-muted mt-0.5">
              Degrees, international exchange study, and foundational engineering training
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {education.map((edu) => (
            <article
              key={edu.id}
              data-testid={`edu-item-${edu.id}`}
              className="bg-surface border border-border-subtle rounded-lg p-6 space-y-4 hover:border-border-strong transition-all duration-150"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
                <div>
                  <h3 className="text-lg font-bold text-text-primary tracking-tight">
                    {edu.degree}
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-semibold text-accent-solid mt-0.5 flex-wrap">
                    <span>{edu.institution}</span>
                    <span className="text-text-muted select-none font-normal">·</span>
                    <span className="text-xs font-mono text-text-muted font-normal flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                      {edu.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {edu.grade && (
                    <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-accent-badge-bg text-accent-badge-text border border-border-subtle font-semibold">
                      {edu.grade}
                    </span>
                  )}
                  <span className="text-xs font-mono text-text-muted bg-canvas px-2.5 py-1 rounded-md border border-border-subtle flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                    <span>{edu.period}</span>
                  </span>
                </div>
              </div>

              {edu.field && (
                <div className="text-xs font-mono text-text-muted">
                  <span className="font-semibold">Field of Study:</span>{' '}
                  <span className="text-text-primary font-medium">{edu.field}</span>
                </div>
              )}

              <ul className="space-y-2 text-sm text-text-secondary">
                {edu.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-accent-solid font-mono font-bold select-none mt-0.5">›</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Section 3: Publications & Accolades */}
      <section aria-labelledby="publications-accolades-heading" className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-surface border border-border-subtle text-text-primary">
            <Award className="w-5 h-5 text-accent-solid" aria-hidden="true" />
          </div>
          <div>
            <h2 id="publications-accolades-heading" className="text-2xl font-bold tracking-tight text-text-primary">
              Publications & Accolades
            </h2>
            <p className="text-xs font-mono text-text-muted mt-0.5">
              Peer-reviewed research, hackathon awards, and leadership development
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Publications Card */}
          {publications.map((pub) => (
            <article
              key={pub.id}
              data-testid={`pub-item-${pub.id}`}
              className="bg-surface border border-border-subtle rounded-lg p-6 space-y-4 flex flex-col justify-between hover:border-border-strong transition-all duration-150"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-accent-badge-bg text-accent-badge-text border border-border-subtle font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-accent-solid" aria-hidden="true" />
                    <span>IEEE Publication</span>
                  </span>
                  <span className="text-xs font-mono text-text-muted">{pub.date}</span>
                </div>

                <h3 className="text-base font-bold text-text-primary leading-snug">
                  {pub.title}
                </h3>

                <p className="text-xs font-mono text-accent-solid font-semibold">
                  {pub.conference}
                </p>

                {pub.image && (
                  <div className="overflow-hidden rounded-md border border-border-subtle bg-canvas">
                    <img
                      src={pub.image}
                      alt={pub.imageCaption || pub.title}
                      className="w-full h-48 sm:h-56 object-cover object-center hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                    {pub.imageCaption && (
                      <div className="px-3 py-1.5 bg-canvas/95 border-t border-border-subtle text-[11px] font-mono text-text-muted flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-solid flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">{pub.imageCaption}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-xs font-mono text-text-muted space-y-1 bg-canvas p-3 rounded-md border border-border-subtle">
                  <div>
                    <span className="text-text-secondary font-medium">Authors:</span> {pub.authors.join(', ')}
                  </div>
                  {pub.advisor && (
                    <div>
                      <span className="text-text-secondary font-medium">Advisor:</span> {pub.advisor}
                    </div>
                  )}
                  <div>
                    <span className="text-text-secondary font-medium">Role:</span> {pub.role}
                  </div>
                </div>

                <ul className="space-y-1.5 text-xs text-text-secondary pt-1">
                  {pub.description.map((desc, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-accent-solid font-bold select-none">›</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {pub.link && (
                <div className="pt-4 border-t border-border-subtle">
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent-solid hover:underline focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded px-1.5 py-0.5"
                    aria-label={`Read paper on IEEE Xplore (opens in a new tab)`}
                  >
                    <span>View on IEEE Xplore</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              )}
            </article>
          ))}

          {/* Accolades Cards */}
          <div className="space-y-6">
            {accolades.map((acc) => (
              <article
                key={acc.id}
                data-testid={`accolade-item-${acc.id}`}
                className="bg-surface border border-border-subtle rounded-lg p-5 space-y-3 hover:border-border-strong transition-all duration-150"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-accent-badge-bg text-accent-badge-text border border-border-subtle font-semibold">
                    {acc.organization}
                  </span>
                  <span className="text-xs font-mono text-text-muted">{acc.date}</span>
                </div>

                <h3 className="text-sm font-bold text-text-primary">
                  {acc.title}
                </h3>

                {acc.image && (
                  <div className="overflow-hidden rounded-md border border-border-subtle bg-canvas">
                    <img
                      src={acc.image}
                      alt={acc.imageCaption || acc.title}
                      className="w-full h-40 sm:h-48 object-cover object-top hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                    {acc.imageCaption && (
                      <div className="px-3 py-1.5 bg-canvas/95 border-t border-border-subtle text-[11px] font-mono text-text-muted flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-solid flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">{acc.imageCaption}</span>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs text-text-secondary leading-relaxed">
                  {acc.description}
                </p>

                {acc.link && (
                  <div className="pt-2">
                    <a
                      href={acc.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent-solid hover:underline focus-visible:ring-2 focus-visible:ring-accent-solid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded px-1 py-0.5"
                      aria-label={`View ${acc.title} project live platform at ${acc.link} (opens in a new tab)`}
                    >
                      <span>heal.a2a.ing</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Technical Skills Taxonomy */}
      <section
        id="skills-taxonomy"
        data-testid="skills-taxonomy"
        aria-labelledby="skills-taxonomy-heading"
        className="space-y-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-surface border border-border-subtle text-text-primary">
            <Code2 className="w-5 h-5 text-accent-solid" aria-hidden="true" />
          </div>
          <div>
            <h2 id="skills-taxonomy-heading" className="text-2xl font-bold tracking-tight text-text-primary">
              Technical Skills Taxonomy
            </h2>
            <p className="text-xs font-mono text-text-muted mt-0.5">
              Categorized matrix of languages, frameworks, storage systems, and infrastructure
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((group) => (
            <div
              key={group.category}
              data-testid={`skill-group-${group.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="bg-surface border border-border-subtle rounded-lg p-5 space-y-3.5 hover:border-border-strong transition-all duration-150"
            >
              <div className="flex items-center gap-2 border-b border-border-subtle pb-2.5">
                {getCategoryIcon(group.category)}
                <h3 className="text-sm font-bold text-text-primary font-mono">
                  {group.category}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-mono px-2.5 py-1 rounded bg-canvas text-text-primary border border-border-subtle hover:border-accent-solid hover:text-accent-solid transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExperienceView;
