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

**THESIS.** Every claim on this site is stated as a feature control frame: a
nominal, the tolerance it must hold, and the datum it was measured against —
and it either conforms or it does not. It refuses both halves of the category:
the dark terminal with a node graph, and its tasteful opposite, the cream
editorial page this site currently ships.

**OWN-WORLD.** A printed drafting sheet. White sheet, dense near-black ruled
linework, one grey for annotation and leader lines, and exactly one hue —
inspection red — permitted only for non-conformance. Meaning is carried by line
weight and style, never by colour alone: solid = verified, dashed = asserted,
heavy double rule = failed. Technical lettering sans states the claim; a
condensed mono carries every measured value, dimension, and permalink. The
structure is a framed sheet with a corner title block and datum references, not
a stack of cards.

**STORY.** The visitor understands inside the first viewport that these claims
are measured rather than asserted, and that the difference is visible. They
believe the systems-engineering claim because clicking a value lands them on
the bytes that produced it. They open a case study, follow one claim to its
proof, and reach contact from the title block without hunting.

**FIRST VIEWPORT.** A framed sheet. The hero claim sits in a feature control
frame at upper-left — nominal, tolerance, datum — at display scale. Below it a
dimension line runs the sheet's width carrying the four flagship projects as
dimensioned intervals. The right margin holds datum references and the
availability line as annotation. The primary action sits bottom-right in the
title block, where a drawing's action always is. One value in the first
viewport already carries a live permalink to real bytes.

**FORM.** Tolerance frame — structural drafting sheet with GD&T notation.
Ranked 1 of 7 on the grounded list; drawn as the pick from direction seed key
`73676231`, whose roll assigned index 3 (Heat Main); the user chose the pick
card over the assignment. Build path: code-led.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance.

## Disciplines carried in from declined challengers

- From **Hand-Bent Neon Circuit**: every value shows the constraint that
  produced it — the tolerance is never decorative, it is the number that makes
  the claim checkable.
- From **Luminescent Understory**: exactly one element per viewport sits at
  maximum emphasis; everything else recedes to thin rule.
- From **Night Market Sign River**: one continuous dimension chain carries the
  visitor across all four routes, so no route is an island.

## Motion: the plotter

Requested by the user: ASCII animation. It fits only as the sheet being produced
by its machine, never as ambient decoration.

Permitted:

- **Plotter draw.** On first paint the frame, ruled lines, dimension line and
  arrows extend in one ordered pass, as a pen plotter draws them. The geometry
  is reserved before the animation runs so nothing reflows, and the hero H1 is
  never animated — a typing headline already produced CLS 0.187 here once, fixed
  in `169ef93`.
- **One data-bearing character-cell artifact.** A case study's repo excerpt may
  render in a real character-cell grid with the traversed path highlighting cell
  by cell, so the ASCII carries the query rather than standing in for texture.

Banned: looping glyph noise, matrix rain, scanline shimmer, or any ASCII running
continuously; ASCII appearing in more than one place per viewport; any state
conveyed by motion alone.

Constraints: decorative layers are `aria-hidden` with a text equivalent;
`prefers-reduced-motion` renders the finished sheet instantly; the animation is
the viewport's single maximum-emphasis element, so it cannot coexist with the
display claim in the same first viewport.

## Unresolved decisions

- Typeface choice. Must not be a training-data default, and must survive a
  self-hosting and licensing check; the site currently self-hosts Geist, whose
  mono is the category's own default face.
- Where the availability and visa prose line sits on the sheet.
- Whether the catalog's category filters become the plan's legend or medium key.
- Evidence repair must land before any claim can be rendered as a measured
  value, since a nominal without a real tolerance has nothing to state.
