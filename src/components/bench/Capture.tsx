import type React from 'react';
import { TransitionLink } from '../common/TransitionLink';

export interface CaptureProps {
  src: string;
  /** What the capture shows, for a visitor who cannot see it. */
  alt: string;
  /** The provenance line: what this is and where it was read. */
  source: string;
  /** Intrinsic pixel size. Required: the box is reserved from these, so the
   *  capture cannot shift the page while it loads. */
  width: number;
  height: number;
  /** Where to open the real thing. Renders the whole frame as one link. */
  href?: string;
  /** Internal route instead of an external url. */
  to?: string;
  /** What the rail reads out while this capture is on screen. */
  readout?: string;
  /** Apply the develop-in reveal. Images only — never prose. */
  develop?: boolean;
  /** The first viewport's largest paint, if this is it. */
  priority?: boolean;
  srcSet?: string;
  sizes?: string;
  /** Set when the frame is a link, so the link has its own accessible name. */
  linkLabel?: string;
  className?: string;
}

/**
 * A real artifact on the bench: a photograph or a live capture, in a well, with
 * the provenance that makes it checkable written underneath it. The room carries
 * no colour, so the artifact is the only chromatic thing in its neighbourhood —
 * which is why a capture is framed plainly and never dressed.
 */
export const Capture: React.FC<CaptureProps> = ({
  src,
  alt,
  source,
  width,
  height,
  href,
  to,
  readout,
  develop = false,
  priority = false,
  srcSet,
  sizes,
  linkLabel,
  className = '',
}) => {
  const image = (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      // React 18 does not know the camelCase form and warns about it on every
      // render; the lowercase attribute React suggests is passed straight to the
      // DOM, which is where the preload hint has to land. `auto` is the default,
      // so omitting it is the same thing.
      {...(priority ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
      className="block w-full h-auto"
    />
  );

  const frame = (
    <span className={`block overflow-hidden ${develop ? 'develop' : ''}`}>{image}</span>
  );

  return (
    <figure
      className={`well group ${className}`}
      data-readout={readout}
      data-testid="capture"
    >
      {to ? (
        <TransitionLink
          to={to}
          aria-label={linkLabel}
          className="block"
        >
          {frame}
        </TransitionLink>
      ) : href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={linkLabel}
          className="block"
        >
          {frame}
        </a>
      ) : (
        frame
      )}

      <figcaption className="border-t border-rule px-3 py-2 font-mono text-[11px] leading-snug text-annotate transition-colors group-hover:border-signal">
        <span className="block break-all">{source}</span>
      </figcaption>
    </figure>
  );
};

export default Capture;
