import type React from 'react';
import { featuredProjects } from '../../data/projects';
import { TransitionLink } from '../common/TransitionLink';

export interface Channel {
  to: string;
  slug: string;
  label: string;
  /** The reading this channel is dimensioned to. */
  value: string;
  /** What that value measured, so a channel is never a bare figure. */
  note: string;
  /**
   * How far the channel's claim has got: `settled` when it resolves to an artifact
   * anyone can open, `in progress` when it is measured but the work is unfinished
   * and nothing public settles it, `open` when it carries no reading at all.
   */
  status: 'settled' | 'in progress' | 'open';
}

/** The four flagships as four channels, in the order the catalog states them. */
export const channels: Channel[] = featuredProjects.map((project) => ({
  to: `/projects/${project.slug}`,
  slug: project.slug,
  // "Shepherd: GraphRAG Compliance Engine" reads as "Shepherd" on a channel width.
  label: project.title.split(':')[0] ?? project.title,
  value: project.metrics?.[0]?.value ?? project.timeline,
  note: project.metrics?.[0]?.label ?? project.role,
  status: project.proof ? 'settled' : project.proofLine ? 'in progress' : 'open',
}));

/**
 * One continuous strip across the bench: four channels, each carrying the one
 * reading that settles it. Every channel is a link, so the strip is also the way
 * into the four case studies — and because the same strip runs on every route,
 * no route is an island.
 */
export const ChannelStrip: React.FC<{ currentSlug?: string; className?: string }> = ({
  currentSlug,
  className = '',
}) => (
  <nav aria-label="Flagship projects" className={className}>
    <ol className="grid grid-cols-2 lg:grid-cols-4 border-t border-rule">
      {channels.map((channel, i) => {
        const here = channel.slug === currentSlug;
        return (
          <li
            key={channel.to}
            className={[
              'min-w-0 border-rule',
              // Column rules between channels, and a top row rule on the wrap.
              i % 2 === 1 ? 'border-l' : '',
              'lg:border-l lg:first:border-l-0',
              i >= 2 ? 'border-t lg:border-t-0' : '',
            ].join(' ')}
          >
            <TransitionLink
              to={channel.to}
              aria-current={here ? 'page' : undefined}
              className={[
                'group block h-full px-3 py-3.5 sm:px-4',
                'border-t-2 transition-colors',
                here
                  ? 'border-signal bg-panel'
                  : 'border-transparent hover:border-signal hover:bg-panel',
              ].join(' ')}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
                  {channel.label}
                </span>
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] text-annotate transition-colors group-hover:text-signal"
                >
                  {channel.status}
                </span>
              </span>

              <span className="mt-1.5 block font-mono text-[13px] font-semibold text-signal">
                {channel.value}
              </span>
              <span className="mt-0.5 block font-mono text-[11px] leading-snug text-annotate">
                {channel.note}
              </span>
            </TransitionLink>
          </li>
        );
      })}
    </ol>
  </nav>
);

export default ChannelStrip;
