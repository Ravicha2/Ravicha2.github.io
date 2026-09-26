import type React from 'react';
import {
  workExperience,
  education,
  publications,
  accolades,
  skillCategories,
} from '../data/experience';
import { ContactBlock } from '../components/common/ContactBlock';
import { Capture } from '../components/bench/Capture';

const linkClass =
  'font-mono text-[11px] text-annotate underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-signal';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** A dated run in the graph. `start`/`end` are decimal years, so a line can be
 *  drawn at its true length rather than at a rounded one. */
interface Span {
  id: string;
  label: string;
  org: string;
  period: string;
  kind: 'work' | 'study';
  start: number;
  end: number;
}

const parseSpan = (
  item: { id: string; period: string },
  label: string,
  org: string,
  kind: Span['kind'],
): Span | null => {
  // Every period in the data reads "Mon YYYY - Mon YYYY", sometimes with a
  // trailing "(Expected)". Anything that does not is left off the graph rather
  // than guessed at.
  const m = item.period.match(/([A-Z][a-z]{2}) (\d{4}) - ([A-Z][a-z]{2}) (\d{4})/);
  if (!m) return null;
  const [, sm, sy, em, ey] = m;
  const startMonth = MONTHS.indexOf(sm);
  const endMonth = MONTHS.indexOf(em);
  if (startMonth < 0 || endMonth < 0) return null;
  return {
    id: item.id,
    label,
    org,
    period: item.period.replace(' (Expected)', ''),
    kind,
    start: Number(sy) + startMonth / 12,
    end: Number(ey) + (endMonth + 1) / 12,
  };
};

const spans: Span[] = [
  ...workExperience.map((w) => parseSpan(w, w.role, w.company, 'work')),
  ...education.map((e) => parseSpan(e, e.degree, e.institution, 'study')),
].filter((s): s is Span => s !== null);

/** The runs in the order they started, which is the order the graph is read in. */
const GRAPH = [...spans].sort((a, b) => a.start - b.start);

/** The graph's own coordinates. The line down the left is the record in order;
 *  a run that began while something else was already going forks out to the right
 *  and rejoins, which is the one thing a column of squares cannot say. */
const SPINE = 13;
const BRANCH = 39;
const GUTTER = 52;

/** Where a fork leaves the line and where it rejoins, as a fraction of the row.
 *  Drawn just inside the row so both diagonals are visible — a fork and a merge
 *  have no duration of their own to draw. */
const FORK = 25;
const MERGE = 75;

/** Which month a decimal year falls in. `end` is the instant just past a run's
 *  last month, so the month it was last running in is one less than this. */
const monthOf = (year: number) => Math.floor(year * 12);

/** A 1px edge, drawn in a space whose height is the row's height whatever that
 *  is. `non-scaling-stroke` is what keeps the hairline a hairline once the
 *  vertical scale has stretched it — without it the y-scaling thickens it. */
const Edge: React.FC<{ x1: number; y1: number; x2: number; y2: number }> = (props) => (
  <line {...props} stroke="var(--rule)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
);

/** One run as a node on the graph. The line runs straight down every row: it is
 *  the record in order, and it claims nothing beyond that — the gap between two
 *  degrees is a gap in studying, not a break in the record, so the line does not
 *  break for it either. A run that started while something else still had months
 *  left forks off that line and rejoins it, and *that* is the overlap, drawn.
 *
 *  The square sits on the line the run belongs to, brass for work and bone for
 *  study. The rows state their own dates, so the graph is a second telling of
 *  them and is kept out of the accessibility tree rather than read out twice. */
const GraphRow: React.FC<{ span: Span; index: number }> = ({ span, index }) => {
  // Only earlier rows can have been running when this one started. The earlier
  // run must still have months left, not merely be alive on the day: a run that
  // begins in another's final month is a handover — the degree finished in August
  // and the job started in August — so it carries on down the line rather than
  // forking off it.
  const forks = GRAPH.slice(0, index).some((o) => monthOf(o.end) - 1 > monthOf(span.start));

  return (
    <li className="flex items-stretch border-b border-rule">
      <div className="relative shrink-0" style={{ width: GUTTER }} aria-hidden="true">
        {/* Absolute: in flow this SVG would size itself off its own 52:100
            viewBox and set the row height to 100px. Out of flow it takes the
            row's height from the flex stretch, which is what it should scale to. */}
        <svg
          viewBox={`0 0 ${GUTTER} 100`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <Edge x1={SPINE} y1={0} x2={SPINE} y2={100} />
          {forks && (
            <>
              <Edge x1={SPINE} y1={0} x2={BRANCH} y2={FORK} />
              <Edge x1={BRANCH} y1={FORK} x2={BRANCH} y2={MERGE} />
              <Edge x1={BRANCH} y1={MERGE} x2={SPINE} y2={100} />
            </>
          )}
        </svg>
        <span
          className={`absolute top-1/2 w-[9px] h-[9px] -translate-x-1/2 -translate-y-1/2 ${
            span.kind === 'work' ? 'bg-signal' : 'bg-ink'
          }`}
          style={{ left: forks ? BRANCH : SPINE }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5 py-3 pl-4">
        <span className="text-[13px] text-ink">{span.label}</span>
        <span className="font-mono text-[11px] text-annotate">{span.org}</span>
        <span className="ml-auto shrink-0 font-mono text-[11px] text-annotate">{span.period}</span>
      </div>
    </li>
  );
};

/** A numbered run of lines, the same shape the proof traces are read in. */
const Items: React.FC<{ items: string[]; className?: string }> = ({ items, className = '' }) => (
  <ul className={`space-y-2 ${className}`}>
    {items.map((item, i) => (
      <li key={i} className="measure flex gap-3 text-sm leading-relaxed">
        <span className="mt-[0.5em] w-[5px] h-[5px] shrink-0 bg-rule" aria-hidden="true" />
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
  <div className="mark-thin pt-6">
    <h2 id={id} className="text-xl sm:text-2xl font-semibold tracking-[-0.015em]">
      {heading}
    </h2>
    <p className="mt-1.5 text-[13px] text-annotate">{annotation}</p>
  </div>
);

export const ExperienceView: React.FC = () => (
  <div className="space-y-14">
    <header className="space-y-8">
      <h1
        id="experience-heading"
        className="text-xl sm:text-2xl font-semibold tracking-[-0.015em] text-pretty"
      >
        Engineering journey
      </h1>
      <p className="measure text-sm sm:text-base leading-relaxed text-pretty">
        Originally trained in Automotive Design & Manufacturing Engineering at Chulalongkorn
        University. During an IoT exchange at IMT Atlantique in France right when modern LLMs
        took off, saw the potential of combining software intelligence with systems
        engineering and made a decisive pivot to Computer Science.
      </p>
    </header>

    {/* The record as a graph. One row per run in the order they started, a line
        down the whole thing, and a fork-and-rejoin wherever a run began while
        something else was still going — so the overlap is the thing you see, and
        the years that hold nothing but continuation need no row of their own. */}
    <section aria-labelledby="graph-heading">
      <SectionHead
        id="graph-heading"
        heading="Works and and Educations"
        annotation="One row per run, in the order it started. A run that started while something else still had months left forks off the line and comes back to it."
      />

      <ol className="mt-6 border-t border-rule">
        {GRAPH.map((span, i) => (
          <GraphRow key={span.id} span={span} index={i} />
        ))}
      </ol>

      {/* The key to the squares. Hidden with the graph it explains, for the same
          reason: the rows state their own dates, so a reader who cannot see the
          squares is not short of anything they carry. */}
      <p
        aria-hidden="true"
        className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1.5 font-mono text-[11px] text-annotate"
      >
        <span className="flex items-center gap-2">
          <span className="w-[7px] h-[7px] bg-signal" />
          work
        </span>
        <span className="flex items-center gap-2">
          <span className="w-[7px] h-[7px] bg-ink" />
          study
        </span>
      </p>
    </section>

    {/* Work experience, as a record of engagements rather than a stack of cards. */}
    <section aria-labelledby="work-experience-heading" className="space-y-6">
      <SectionHead
        id="work-experience-heading"
        heading="Work experience"
        annotation="Production engineering, distributed pipelines, and systems design"
      />

      <div>
        {workExperience.map((item) => (
          <article
            key={item.id}
            data-testid={`work-item-${item.id}`}
            className="mark-thin pt-4 pb-6 grid gap-x-6 gap-y-3 sm:grid-cols-[10rem_minmax(0,1fr)]"
          >
            <div>
              <p className="readout font-mono text-[13px] text-ink flex flex-wrap items-baseline gap-x-2">
                <span>{item.period}</span>
                {item.isCurrent && <span className="text-[11px] text-signal">current</span>}
              </p>
              <p className="font-mono text-[11px] text-annotate mt-1">{item.location}</p>
            </div>

            <div className="min-w-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-6 gap-y-1">
                <h3 className="text-lg font-semibold tracking-[-0.015em]">{item.role}</h3>
                <p className="font-mono text-[13px] text-annotate shrink-0">{item.company}</p>
              </div>

              <Items items={item.description} />

              {item.highlights && item.highlights.length > 0 && (
                <ul className="flex flex-wrap gap-2 pt-1">
                  {item.highlights.map((highlight, idx) => (
                    <li key={idx} className="chip font-mono text-[11px] text-ink">
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}

              <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 pt-1">
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
        heading="Education & academic foundations"
        annotation="Degrees, international exchange study, and foundational engineering training"
      />

      <div>
        {education.map((edu) => (
          <article
            key={edu.id}
            data-testid={`edu-item-${edu.id}`}
            className="mark-thin pt-4 pb-6 grid gap-x-6 gap-y-3 sm:grid-cols-[10rem_minmax(0,1fr)]"
          >
            <div>
              <p className="readout font-mono text-[13px] text-ink">{edu.period}</p>
              {edu.grade && <p className="font-mono text-[11px] text-signal mt-1">{edu.grade}</p>}
              <p className="font-mono text-[11px] text-annotate mt-1">{edu.location}</p>
            </div>

            <div className="min-w-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-6 gap-y-1">
                <h3 className="text-lg font-semibold tracking-[-0.015em]">{edu.degree}</h3>
                <p className="font-mono text-[13px] text-annotate shrink-0">{edu.institution}</p>
              </div>

              {edu.field && (
                <p className="font-mono text-[11px] text-annotate">
                  Field of study <span aria-hidden="true">·</span>{' '}
                  <span className="text-ink">{edu.field}</span>
                </p>
              )}

              <Items items={edu.details} />
            </div>
          </article>
        ))}
      </div>
    </section>

    {/* Publications and accolades, each with the photograph the event actually left. */}
    <section aria-labelledby="publications-accolades-heading" className="space-y-6">
      <SectionHead
        id="publications-accolades-heading"
        heading="Publications & accolades"
        annotation="Peer-reviewed research, hackathon awards, and leadership development"
      />

      <div className="grid gap-10 lg:grid-cols-2">
        {publications.map((pub) => (
          <article key={pub.id} data-testid={`pub-item-${pub.id}`} className="space-y-4">
            <div className="mark-thin pt-4 space-y-4">
              <p className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-[11px] text-annotate">
                <span>IEEE publication</span>
                <span>{pub.date}</span>
              </p>

              <h3 className="text-base font-semibold leading-snug text-pretty">{pub.title}</h3>

              <p className="font-mono text-[13px] text-annotate">{pub.conference}</p>

              <dl className="font-mono text-[11px] space-y-1.5 border-y border-rule py-2.5">
                <div className="flex gap-2">
                  <dt className="text-annotate w-20 shrink-0">Authors</dt>
                  <dd className="text-ink">{pub.authors.join(', ')}</dd>
                </div>
                {pub.advisor && (
                  <div className="flex gap-2">
                    <dt className="text-annotate w-20 shrink-0">Advisor</dt>
                    <dd className="text-ink">{pub.advisor}</dd>
                  </div>
                )}
                <div className="flex gap-2">
                  <dt className="text-annotate w-20 shrink-0">Role</dt>
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
            </div>

            {pub.image && (
              <Capture
                src={pub.image}
                width={pub.imageWidth ?? 1440}
                height={pub.imageHeight ?? 900}
                develop
                alt={pub.imageCaption || pub.title}
                source={pub.imageCaption ?? pub.title}
              />
            )}
          </article>
        ))}

        {accolades.map((acc) => (
          <article key={acc.id} data-testid={`accolade-item-${acc.id}`} className="space-y-4">
            <div className="mark-thin pt-4 space-y-3">
              <p className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-[11px] text-annotate">
                <span>{acc.organization}</span>
                <span>{acc.date}</span>
              </p>

              <h3 className="text-[15px] font-semibold text-pretty">{acc.title}</h3>

              <p className="measure text-sm leading-relaxed">{acc.description}</p>

              {acc.link && (
                <p>
                  <a
                    href={acc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                    aria-label={`${acc.title} live platform at ${acc.link} (opens in a new tab)`}
                  >
                    heal.a2a.ing
                  </a>
                </p>
              )}
            </div>

            {acc.image && (
              <Capture
                src={acc.image}
                width={acc.imageWidth ?? 1440}
                height={acc.imageHeight ?? 900}
                develop
                alt={acc.imageCaption || acc.title}
                source={acc.imageCaption ?? acc.title}
              />
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
        heading="Technical skills"
        annotation="Categorized matrix of languages, frameworks, storage systems, and infrastructure"
      />

      <dl className="grid gap-x-8 gap-y-5 md:grid-cols-2">
        {skillCategories.map((group) => (
          <div
            key={group.category}
            data-testid={`skill-group-${group.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            className="mark-thin pt-3"
          >
            <dt className="font-mono text-[11px] text-annotate">{group.category}</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span key={skill} className="chip font-mono text-[11px] text-ink">
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
