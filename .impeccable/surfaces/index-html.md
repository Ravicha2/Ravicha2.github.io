---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["src/views/HomeView.tsx","src/views/ProjectsView.tsx","src/views/CaseStudyView.tsx"]
---

# Surface brief — Palm Suksawasdi portfolio

## Scope and mode

Site-wide visual world across four routes (`/`, `/projects`, `/projects/:slug`,
`/experience`). Mode: **Experience** — the visitor is inside the work, so the
artifact leads from the first viewport and the interface recedes.

## Audience, job, action

Primary: recruiters screening Applied AI, agentic systems, and backend roles —
Sydney plus global remote, a job description open, ninety seconds between
meetings. Their job is to decide role fit from verifiable proof without
emailing first. Secondary: technical interviewers who will try to falsify the
systems claims. Action: open a case study, follow one claim to its settling
artifact, make contact.

## Proof and content

Seven projects, four flagship. Every claim resolves to a repo permalink to real
bytes, a live deployment, a publication, or a measured result. No testimonials,
no client logos, no fabricated telemetry. The content is already specific; the
design's job is to stop flattening it into identical containers.

## Direction contract

**THESIS.** Everything on this site was built, then measured, and not every
measurement came back clean — the misses are on the page next to the hits. The
site is the bench the work sits on: a real photograph of the person, real
captures of the running systems, real numbers with the sha they were read at.
It refuses both halves of the category: the dark terminal with a node graph, and
its tasteful opposite, the cream editorial page this site shipped until now.

**OWN-WORLD.** A dark workroom. Warm near-black substrate (`#14120f`), warm bone
text (`#ece5d8`) that is never white, raised panels a shade up (`#1e1a16`) that
are fills and never boundaries, and faint blueprint rules (`#6d655d`) dividing
the bench into channels. Two chromatic values, both meaning-carrying and both
warm: **brass** (`#c9a04a`) is the live signal — a link, the row you are on, a
reading that came back clean; and **fault** (`#f38d8a`) appears *only* on a
reading that failed, and never as decoration. Fault is a coral rather than a
crimson because the verdict is text: it had to clear the same 7:1 floor as the
prose, and this is the deepest warm red that still does. The room itself carries no colour:
**every chromatic element on the page is a real photograph or a real capture**,
so the artifacts hold all the colour and the substrate stays out of their way.
Meaning is never carried by colour alone — clean and failed differ in mark as
well as in hue, so the distinction survives greyscale and forced-colours.
Barlow states the voice; Iosevka carries every measured value (sha, DOI,
timestamp, node count, coordinate, version) and never a label. The structure is
**a bench with a continuous datum rail**, not a stack of cards: frames and
fields, hairlines and channels.

Measured contrast, against all three surfaces (bench / panel / deep `#0d0c0a`),
documented in `tokens.css` as the incumbent did:

| token | bench | panel | deep |
|---|---|---|---|
| ink `#ece5d8` | 14.93 | 13.80 | 15.61 |
| annotate `#b0a695` | 7.78 | 7.19 | 8.13 |
| signal `#c9a04a` | 7.67 | 7.09 | 8.02 |
| nonconform `#f38d8a` | 8.00 | 7.40 | 8.37 |
| rule `#6d655d` (non-text) | 3.27 | 3.02 | 3.42 |

Two values moved after this contract was written, both because the first pass
was measured against the wrong floor: `nonconform` was picked at 5.91–6.18
against a text floor of 7:1, and `rule` at 2.89 on panel against a non-text
floor of 3:1. The shipped values are the ones above, and `tokens.test.ts`
re-measures them out of the stylesheet rather than trusting this table.

**STORY.** A recruiter ninety seconds between meetings sees a real person and a
real number in the first viewport, and understands the number came from
somewhere they can open. Scrolling walks the bench downward and the information
arrives progressively: flagships with their artifacts, then supporting work at
decreasing weight, then the graph of work and study, the publication, contact last. They leave
knowing what he built, what it measured, what it missed, and how to reach him —
without emailing first and without being sold anything.

**FIRST VIEWPORT.** Not a hero and not a funnel. The bench as it actually looks:
a real photograph of Palm at a work table, large and bled off one edge, and
beside it the instrument readout already lit — his name as the only heading at
display scale, one plain sentence of what he does, the availability line, and
the first genuine reading of the Shepherd eval drawn from its own log with its
sha and a live permalink to the bytes. The datum rail runs down the left and is
the only chrome: local time in Sydney, availability, and the repo@sha of
whatever is currently on screen, updating as you scroll. No pitch, no buy
button, no kicker above any heading.

**FORM.** The Bench — a dark instrument workroom with a living datum rail and a
contact sheet of real artifacts. Direction re-derived after the roll's
assignment (Detection Waterfall, round-2 payload
`.impeccable/questions/payload-direction.json`) was declined by the user as
adjacent to the already-re-rolled Yield Console; the reference the user supplied
(`https://bryangarage.dev/`, inspected live) redirected the world to warm-dark
material, real photography, and an asymmetric information flow. Taken from that
reference: the material logic (one warm emissive accent against near-black, real
photographs as the only chromatic content), the git-style graph as the spine of the
experience route, the corner console readout, the numbered contact sheet of real
frames, and outlined square chips over pills. **Deliberately not taken:** its
kicker-above-heading scaffold (the craft floor bans it outright), its bootable
terminal, radio, and desk-pet furniture (Palm's register is plainer and
evidence-led), and its amber hue. Build path: code-led — no image generation is
available this session (`OPENAI_API_KEY` unset), and none is wanted, because the
imagery this world needs is evidence that cannot be generated.

**Imagery — every raster is real and carries its provenance.** No generated
illustration ships. The program is three real photographs already owned plus
live captures taken from the running systems:

| asset | what it is | provenance |
|---|---|---|
| `Hero.jpeg` | Palm at a work table, IEEE Thailand Section event | official event photograph, currently orphaned and unused |
| `IEEE.png` | Chulalongkorn cohort, IEEE TENCON 2023, Chiang Mai | event photograph, shipped with `imageCaption` |
| `Hack2Heal.png` | Team Bread, Founder's Choice Award, UNSW Founders Stage | event photograph, shipped with `imageCaption` |
| `captures/heal-*.png` | `heal.a2a.ing` live, the running product | captured from the live deployment |
| `captures/repo-*.png` | repo and file views at pinned shas | captured from GitHub at the pinned commit |
| `captures/registry-*.png` | PyPI and MCP registry listings | captured from the live registries |

One asset is deliberately not a capture. `captures/shepherd.webp` is the
**author-supplied Shepherd project mark** — a drawn head, shipped and
recompressed from the same pixels (2,848×1,496, WebP q82), never redrawn. It
names the project and settles no claim: no photograph or live capture of
Shepherd ships, because the two-arm annotation study behind its figures lives in
a private research repository and no public permalink settles it. The eval
drawing this table used to promise was dropped with the dev eval it quoted.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance.

## Durable brief constraints

- **Portfolio flow, not a magazine.** The user's words: *"These looks like
  magazine more than portfolio flows. keep the casual feeling but need more
  informative flow, we not selling product."* Every route is a record walked
  downward, not a landing page. No funnel, no pitch, no buy button, no CTA above
  the fold.
- **The energy must come from colour and material, motion and interaction, and
  real imagery and artifacts.** Type was deliberately not the axis, so do not
  spend the build on typefaces.
- **Banned:** anything that reads as a template or an AI default; anything too
  dense to scan. Provenance must not be lost; style over substance is not the
  failure mode being guarded against.

## Disciplines carried in from declined challengers

- From **Hand-Bent Neon Circuit**: every value shows the constraint that
  produced it — the number that makes the claim checkable is never decorative.
- From **Luminescent Understory**: exactly one element per viewport sits at
  maximum emphasis; everything else recedes, and in a dark room receding means
  losing contrast, not losing the content.
- From **Night Market Sign River**: one continuous rail carries the visitor
  across all four routes, so no route is an island.

## Motion: the sweep

The instrument sweeping the cell, once, and then stillness. Two mechanisms
only — one load moment and one reveal — plus a state language. Nothing loops.

- **The sweep (the one authored moment).** On first paint a single brass
  hairline travels the viewport once, top to bottom, then leaves. It is the
  viewport's one maximum-emphasis element and it never coexists with a
  headline mid-animation. Geometry is reserved before it runs, so nothing
  reflows; the first-viewport heading is never animated by it — a typing
  headline already produced CLS 0.187 here once, fixed in `169ef93`.
- **The reveal, on real captures only.** Artifact frames resolve from
  undeveloped to full tone through a `clip-path`/`mask` inset as they enter,
  once, staggered within a group by no more than 80 ms. Text and headings are
  simply present — they never animate. This asymmetry is the decision: imagery
  arrives like a print developing; prose is already there.
- **State language.** A frame raises its caption datum and its border mark on
  hover and focus-visible; the fault mark goes full strength on a reading that
  failed. Cheap, on the palette, and never the only carrier of the state.

Banned: looping ambient motion, matrix rain, scanline shimmer, continuous
glyph noise, animated text, and any state conveyed by motion alone.

Constraints: decorative layers are `aria-hidden` with a text equivalent;
`prefers-reduced-motion` renders the finished page instantly with all frames
developed and no sweep. Browser surfaces are themed from the palette — text
selection, caret, scrollbars, focus rings, underline offset, and tabular
numerals on every measured value.

## Resolved

- **Typeface.** Barlow + Iosevka, already self-hosted, subset and licensed with
  provenance in `public/fonts/PROVENANCE.md`. Kept: Barlow's signage-grotesque
  lineage suits an instrument workroom, and Iosevka is a real technical mono
  doing real work on real values. No font work in this build.
- **Availability and location.** They live in the datum rail, present on every
  route — `profile.status` and `profile.location` stop being dead data.
- **Contact.** Reaches every route including the case studies, with a copyable
  address and the CV, and is the last thing on the bench.
- **Evidence repair.** Landed in `ee4ebec` (#21); every metric on the page now
  resolves to a real artifact before it is rendered as a value.
