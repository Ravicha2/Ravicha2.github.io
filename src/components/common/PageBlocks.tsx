import type React from 'react';

/**
 * The spine of a prose route — the developer, docs, about, contact and privacy
 * pages.
 *
 * They are the same record the home route is: walked downward, a section at a
 * time, one boundary at a time. So they open on the bench's one display scale and
 * every section is a ruled block — a hairline, a heading, the deck that says what
 * the section is for, then the prose.
 *
 * What went wrong when each page carried its own copy of this: the heading, its
 * deck and its body were the same small size and the same dim bark, so six or
 * eight sections in a row read as one grey wall with no shape to it. The deck is
 * still bark — it is a standfirst, not the body — and the body is bone, at the
 * reading size the home route already uses. Nothing else about the pages moved.
 */

/** The head of a prose route: the title at display scale, the one paragraph that
 *  says what the page is, and the row of references that belongs with it. */
export const PageHead: React.FC<{
  id: string;
  title: string;
  lead: React.ReactNode;
  children?: React.ReactNode;
}> = ({ id, title, lead, children }) => (
  <section aria-labelledby={id}>
    <h1
      id={id}
      className="text-[clamp(1.7rem,4.2vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-pretty"
    >
      {title}
    </h1>
    <p className="measure mt-5 text-sm sm:text-[15px] leading-relaxed text-annotate text-pretty">
      {lead}
    </p>
    {children && <div className="mt-6">{children}</div>}
  </section>
);

/** A ruled block: a section boundary that carries no verdict. */
export const Block: React.FC<{
  id: string;
  heading: React.ReactNode;
  /** The standfirst under the heading. Bark, because it is not the body. */
  annotation?: React.ReactNode;
  /** What the rail names while this section is under the lens. Defaults to the
   *  heading, so a plain-text block needs no extra props to be readable. */
  readout?: string;
  children: React.ReactNode;
}> = ({ id, heading, annotation, readout, children }) => (
  <section
    aria-labelledby={id}
    data-readout={readout ?? (typeof heading === 'string' ? heading : undefined)}
    className="mark-thin pt-6"
  >
    <h2 id={id} className="text-xl sm:text-2xl font-semibold tracking-[-0.015em] text-pretty">
      {heading}
    </h2>
    {annotation && (
      <p className="measure mt-2 text-[13px] leading-relaxed text-annotate">{annotation}</p>
    )}
    <div className="mt-5 space-y-5">{children}</div>
  </section>
);
