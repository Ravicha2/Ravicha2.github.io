import type React from 'react';
import { getProjectBySlug, projects } from '../data/projects';
import { profile } from '../data/profile';
import { workExperience, education } from '../data/experience';
import { Capture } from '../components/bench/Capture';
import { ChannelStrip } from '../components/bench/ChannelStrip';
import { ContactBlock } from '../components/common/ContactBlock';
import { TransitionLink } from '../components/common/TransitionLink';

const linkClass =
  'font-mono text-[11px] text-annotate underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-signal';

/** The two flagships whose artifact is strongest get their own row on the bench. */
const FEATURED_ARTIFACT_ROWS = ['shepherd', 'nl2regex'];

export const HomeView: React.FC = () => {
  const recordRows = FEATURED_ARTIFACT_ROWS.map((slug) => getProjectBySlug(slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p?.image),
  );
  const remaining = projects.filter(
    (p) => !FEATURED_ARTIFACT_ROWS.includes(p.slug) && p.slug !== 'heal-a2a',
  );
  const heal = getProjectBySlug('heal-a2a');

  const currentWork = workExperience.find((w) => w.isCurrent) ?? workExperience[0];
  const primaryEducation = education[0];

  return (
    <div className="space-y-14 sm:space-y-16">
      {/* First viewport. A real person, their role, and the way in. */}
      <section aria-labelledby="bench-heading" className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7 xl:col-span-6 flex flex-col">
          <h1
            id="bench-heading"
            className="text-[clamp(1.7rem,4.2vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-pretty"
          >
            {profile.name}
          </h1>

          {/* The name is the heading, so this line carries the role and not a
              second copy of the name. */}
          <p className="mt-4 font-mono text-[12px] text-annotate">{profile.title}</p>

          <p className="measure mt-5 text-sm sm:text-[15px] leading-relaxed text-annotate text-pretty">
            {profile.narrative.systemsMindset}
          </p>

          <p className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <TransitionLink
              to="/projects"
              className="font-mono text-[12px] text-ink underline decoration-signal underline-offset-4 transition-colors hover:decoration-[3px]"
            >
              All {projects.length} projects
            </TransitionLink>
            <TransitionLink to="/experience" className={linkClass}>
              Experience
            </TransitionLink>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (opens in a new tab)"
              className={linkClass}
            >
              GitHub
            </a>
          </p>
        </div>

        <Capture
          className="lg:col-span-5 xl:col-span-6 lg:mt-1 lg:self-start"
          src="/assets/Hero-1400.jpg"
          srcSet="/assets/Hero-900.jpg 900w, /assets/Hero-1400.jpg 1400w"
          sizes="(min-width: 1024px) 46vw, 100vw"
          width={1400}
          height={933}
          priority
          alt="Palm Suksawasdi at a work table, reaching across it mid-conversation."
          source="Palm at work — IEEE Thailand Section event photograph"
        />
      </section>

      {/* The four flagships, carried on every route so no route is an island. */}
      <ChannelStrip />

      {/* The record, walked downward: artifacts first, at the weight they earned. */}
      <section aria-labelledby="record-heading" className="space-y-12">
        <h2 id="record-heading" className="text-[25px] font-semibold tracking-[-0.01em]">
          The record
        </h2>

        {recordRows.map((project, i) => {
          const flipped = i % 2 === 1;
          return (
            <article
              key={project.slug}
              className="mark-thin pt-6 grid gap-6 lg:grid-cols-12 lg:gap-9"
            >
              <div
                className={`min-w-0 lg:col-span-5 ${flipped ? 'lg:order-2 lg:col-start-8' : ''}`}
              >
                <h3 className="text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-pretty">
                  <TransitionLink
                    to={`/projects/${project.slug}`}
                    className="underline decoration-rule underline-offset-4 transition-colors hover:decoration-signal"
                  >
                    {project.title}
                  </TransitionLink>
                </h3>

                <p className="measure mt-3 text-sm leading-relaxed text-pretty">
                  {project.summary}
                </p>

                {project.proofLine && (
                  <p className="mt-4 font-mono text-[12px] leading-snug text-signal">
                    {project.proofLine}
                  </p>
                )}

                <dl className="mt-4 space-y-1.5">
                  {project.metrics?.map((metric) => (
                    <div key={metric.label} className="flex flex-wrap items-baseline gap-x-2.5">
                      <dt className="font-mono text-[12px] text-ink shrink-0">{metric.value}</dt>
                      <dd className="font-mono text-[11px] leading-snug text-annotate">
                        {metric.label}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  <TransitionLink
                    to={`/projects/${project.slug}`}
                    className="font-mono text-[11px] text-ink underline decoration-signal underline-offset-4 transition-colors hover:decoration-[3px]"
                  >
                    Read the case study
                  </TransitionLink>
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} repository (opens in a new tab)`}
                      className={linkClass}
                    >
                      Repository
                    </a>
                  )}
                </p>
              </div>

              <Capture
                className={`lg:col-span-6 ${flipped ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-7'}`}
                src={project.image!}
                width={project.imageWidth ?? 1440}
                height={project.imageHeight ?? 683}
                develop
                alt={project.imageAlt ?? `The ${project.title} repository, captured at its live state.`}
                source={project.imageCaption ?? project.title}
                readout={`${project.slug} · ${project.imageAlt ? 'mark' : 'captured'}`}
                href={project.links.github}
                linkLabel={`Open the ${project.title} repository (opens in a new tab)`}
              />
            </article>
          );
        })}

        {/* The rest at decreasing weight: a ruled list, not more cards. */}
        <div className="mark-thin pt-2">
          <ul>
            {remaining.map((project) => (
              <li key={project.slug} className="border-b border-rule">
                <TransitionLink
                  to={`/projects/${project.slug}`}
                  className="group grid gap-x-6 gap-y-1.5 py-4 sm:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold tracking-[-0.01em] text-ink transition-colors group-hover:text-signal">
                      {project.title}
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-annotate text-pretty">
                      {project.summary}
                    </span>
                  </span>
                  <span className="min-w-0 sm:text-right shrink-0">
                    <span className="block font-mono text-[12px] text-ink">
                      {project.metrics?.[0]?.value ?? project.timeline}
                    </span>
                    <span className="mt-0.5 block font-mono text-[11px] text-annotate">
                      {project.categoryLabel}
                    </span>
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The deployed product. A live url is a different kind of evidence to a repo. */}
      {heal?.image && (
        <section aria-labelledby="live-heading" className="grid gap-6 lg:grid-cols-12 lg:gap-9">
          <div className="lg:col-span-6 lg:col-start-1">
            <Capture
              src={heal.image}
              width={heal.imageWidth ?? 1440}
              height={heal.imageHeight ?? 683}
              develop
              alt="The Healing Together landing page, as served on heal.a2a.ing."
              source={heal.imageCaption ?? 'heal.a2a.ing'}
              readout="heal.a2a.ing · live"
              href={heal.links.demo}
              linkLabel="Open heal.a2a.ing (opens in a new tab)"
            />
          </div>
          <div className="lg:col-span-5 lg:col-start-8 min-w-0 lg:pt-2">
            <h2 id="live-heading" className="text-xl sm:text-2xl font-semibold tracking-[-0.02em]">
              {heal.title}
            </h2>
            <p className="measure mt-3 text-sm leading-relaxed text-pretty">{heal.summary}</p>
            <p className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <a
                href={heal.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open heal.a2a.ing (opens in a new tab)"
                className="font-mono text-[11px] text-ink underline decoration-signal underline-offset-4 transition-colors hover:decoration-[3px]"
              >
                heal.a2a.ing
              </a>
              <TransitionLink to={`/projects/${heal.slug}`} className={linkClass}>
                Case study
              </TransitionLink>
            </p>
          </div>
        </section>
      )}

      {/* Context, as ruled entries rather than a pair of cards. */}
      <section aria-labelledby="context-heading">
        <h2 id="context-heading" className="text-[15px] font-semibold tracking-[-0.01em]">
          Where this is coming from
        </h2>

        <dl className="mt-4 border-b border-rule">
          {currentWork && (
            <div className="grid gap-x-8 gap-y-1.5 py-5 border-t border-rule sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="font-mono text-[11px] text-annotate">
                {currentWork.isCurrent ? 'Now' : 'Most recent'}
              </dt>
              <dd className="min-w-0">
                <span className="block text-[15px] font-semibold">{currentWork.role}</span>
                <span className="block font-mono text-[11px] text-annotate mt-1">
                  {currentWork.company} · {currentWork.period}
                </span>
                <span className="measure block mt-2.5 text-sm leading-relaxed text-annotate">
                  {currentWork.description[0]}
                </span>
              </dd>
            </div>
          )}

          {primaryEducation && (
            <div className="grid gap-x-8 gap-y-1.5 py-5 border-t border-rule sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="font-mono text-[11px] text-annotate">Formation</dt>
              <dd className="min-w-0">
                <span className="block text-[15px] font-semibold">{primaryEducation.degree}</span>
                <span className="block font-mono text-[11px] text-annotate mt-1">
                  {primaryEducation.institution}
                  {primaryEducation.grade && ` · ${primaryEducation.grade}`}
                </span>
                <span className="measure block mt-2.5 text-sm leading-relaxed text-annotate">
                  {profile.narrative.origin}
                </span>
              </dd>
            </div>
          )}
        </dl>
      </section>

      <ContactBlock />
    </div>
  );
};

export default HomeView;
