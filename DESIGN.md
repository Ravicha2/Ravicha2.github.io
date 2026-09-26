---
name: The Bench — Palm Suksawasdi Portfolio
description: A dark instrument workroom where a claim ships with what makes it checkable — the value that came back, the verdict that mark carries, and the artifact plus the commit it was read at.
colors:
  signal: "#c9a04a"
  nonconform: "#f38d8a"
  bench: "#14120f"
  well: "#0d0c0a"
  panel: "#1e1a16"
  ink: "#ece5d8"
  annotate: "#b0a695"
  rule: "#6d655d"
typography:
  display:
    fontFamily: "Barlow, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(1.7rem, 4.2vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Barlow, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Barlow, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.55
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Barlow, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Iosevka, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: "0.06em"
rounded:
  none: "0px"
spacing:
  gutter: "2rem"
  block: "1.5rem"
  section: "3.5rem"
components:
  reading:
    typography: "{typography.headline}"
    textColor: "{colors.ink}"
  reading-value-clean:
    typography: "{typography.label}"
    textColor: "{colors.signal}"
  reading-datum:
    typography: "{typography.label}"
    textColor: "{colors.annotate}"
  link-primary:
    typography: "{typography.label}"
    textColor: "{colors.ink}"
  link-reference:
    typography: "{typography.label}"
    textColor: "{colors.annotate}"
  chip:
    typography: "{typography.label}"
    textColor: "{colors.annotate}"
    rounded: "{rounded.none}"
    padding: "0.09rem 0.4rem"
  chip-selected:
    textColor: "{colors.ink}"
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.none}"
  capture-well:
    backgroundColor: "{colors.well}"
    rounded: "{rounded.none}"
---

# Design System: The Bench — Palm Suksawasdi Portfolio

## Overview

**Creative North Star: "The Bench"**

The site is a dark instrument workroom, and the design *is* the instrument readout. Nothing on it is a product pitch: every claim ships as a **reading** — what was measured, the value or state that came back, the verdict that decides whether it holds, and the artifact plus the commit it was read at. The page is walked downward like a record, not composed like a landing page: the flagships and their artifacts, then supporting work at decreasing weight, then the graph of work and study, the publication, contact last. `.impeccable/review/desktop-home-hero.png`, `desktop-home-record.png`, `desktop-projects.png`, `desktop-case.png`, `desktop-graph.png` and `desktop-experience.png` show the same bench; the rail is the only chrome, and the artifacts are the only colour.

The register is a design property, not a content choice. The user's correction during the build: *"These look like magazine more than portfolio flows. keep the casual feeling but need more informative flow, we not selling product."* So every route carries information progressively and casually — one reading at a time, in plain sentences, with the number always next to the thing that makes it checkable. There is no hero, no funnel, no buy button, no CTA above the fold, and no kicker above any heading.

**Where the build now diverges from the reading-per-page idea (2026-09-26).** Three page-level `Reading` blocks — the home first viewport's flagship reading, and the `h1` readings on `/projects` and `/experience` — plus the marks legend that taught the vocabulary on `/`, were removed on the user's instruction: the artifact readouts (value, `sha7` datum, verdict stamp) read as overselling, and the two executive-summary sentences did not add up. What replaced them is smaller, not a new device: the two index pages open on a plain `h1` and their existing prose, and the home first viewport opens on the name alone. `Reading` still ships on a case-study header (`as="h1"`), where a claim and its artifact are the page's subject. The mark vocabulary itself is unchanged and still shipped by the components that carry it (`BenchEntry`, `ProofArtifactView`, `Reading`, `ChannelStrip`); it is simply no longer *taught* by a key on `/`, so a verdict stays legible only where the block or the section label above it states it in words — `ProofArtifactView` names its kind ("Measured table", "Durable run, in order", "Source, as quoted"), a catalog row sits under "Measured to an artifact" or "Repository only", and a `Reading` writes the verdict out in its `dl`. Nothing else in this document moved: the rail, the marks, the channel strip, the captures and the artifact components are as described below.

The room itself carries no colour at all. Every chromatic element on the page is a real photograph or a real capture, so the artifacts hold the colour and the warm near-black substrate stays out of their way. The world refuses the dark terminal with a node graph and its tasteful opposite, the cream editorial page this site shipped until now — and it **replaces a third world, "the Tolerance Frame"**, a printed drafting sheet with feature control frames, dimension lines and chain references. That world was deleted by the rework that landed the Bench (the commit shipping this document — `de07ffb` built it, and built it only: the sheet components, `sheet.css` and its motion test are all additions in that commit and all deletions in this one); it is the anti-reference, and not one of its devices, token names or rules is carried into this system.

This document is derived from the shipped artifact, not from intentions. Sizes below were measured on `dist/` after `npm run build` on 2026-09-26: `dist/index.html` 5.74 kB, `dist/assets/index-DOS7XD5x.css` 24.66 kB, `dist/assets/index-D-JxCa3P.js` 256.63 kB (gzip 1.72 / 5.59 / 80.51 kB), 56 modules. The design authority is the direction contract in `.impeccable/surfaces/index-html.md`; where the contract and the build diverge, the build is recorded and the divergence is named.

### Motion — the world's one moment, then stillness

Exactly two authored keyframes exist in the entire build — `sweep` and `develop`, both in `src/styles/bench.css` — and `tests/accessibility/bench-motion.test.ts` fails if a third appears.

- **The sweep** is the one authored moment: a single brass hairline (a `linear-gradient` from transparent through `--signal`) travels the viewport once on first paint, transform-only, 900 ms `cubic-bezier(0.16, 1, 0.3, 1)`, then leaves. It is `position: fixed`, `pointer-events: none`, `aria-hidden`, and it carries no state. It is the viewport's single maximum-emphasis element and it never coexists with a headline mid-animation.
- **The develop reveal** applies to real captures only (`Capture develop`, `bench.css` `.develop`): a `clip-path: inset(0 0 100% 0)` → `inset(0 0 0 0)` on a native `animation-timeline: view()`, `animation-range: entry 10% entry 90%`, `animation-duration: 1ms` (Firefox otherwise drops to a 0 s duration and skips it). Frames resolve like a print coming up, staggered only by their own scroll position; no authored delay is set. Text and headings are simply present — they never animate.
- **State language**, not motion: a frame raises its caption rule and its border on hover / focus-visible; the rail names whatever is under the lens. Never the only carrier of the state.

All motion sits inside `prefers-reduced-motion: no-preference`, and `src/styles/accessibility.css` additionally forces `animation-duration: 0.01ms`, `animation-iteration-count: 1`, `animation-timeline: none`, `transition-duration: 0.01ms` and `animation: none` on every `::view-transition-*` under reduced motion. Route transitions animate only `::view-transition` snapshots (180/200 ms `cubic-bezier(0.2, 0, 1, 1)`); `index.css` animates nothing else.

**The Develop-Not-Fade Rule.** An artifact frame may develop; it may never fade. A mid-range opacity of 0.67 takes `--annotate` to 3.6:1 on the bench — and mid-range is exactly where the reading band is. The reveal is a `clip-path` on real captures, and prose is never in its scope.

**The One-Moment Rule.** Motion is allowed one authored entrance per viewport and nothing that loops. No ambient motion, no matrix rain, no scanline shimmer, no animated text, and no state carried by motion alone.

**Key Characteristics:**
- A warm near-black workroom (`--bench`) with bone text that is never white and raised panels that are fills, never boundaries.
- One continuous datum rail on every route: local Sydney time, availability, and the artifact currently under the lens.
- Exactly two chromatic tokens, both warm and both meaning-carrying; every other surface is desaturated.
- Verdicts are encoded weight-first, style-second, hue-third, and always written in words.
- Every measured value, reference and permalink is Iosevka; prose and headings are Barlow.
- Square corners everywhere, hairlines instead of boxes, and no shadows.
- Real rasters only — event photographs and live captures, each carrying its provenance.
- Accessibility is a floor: WCAG AAA text, 3:1 rules, one focus indicator, full reduced-motion suppression.

## Colors

The palette is a warm dark room with two meaning-carrying hues and nothing decorative: substrate, a recessed well and a raised panel in three steps of the same warm near-black; bone and bark for text; one brass signal; one coral fault that is reserved and currently unspent.

### Primary
- **Live Signal / Brass** (`#c9a04a`): the live signal, and the only chromatic colour the room spends at rest. It marks a link that is the primary action (a case study's commit-pinned permalink, "Read the case study"), the row you are on in the channel strip and the rail, a reading whose value came back clean, the sweep hairline, the text caret, and the text selection background. It is saturated (chroma > 60 in the raw-channel sense), so it reads as a hue against a desaturated room.

### Secondary
- **Fault / Coral** (`#f38d8a`): a reading that was measured and **does not hold**. It appears nowhere else — never an accent, never a hover, never decoration. It is coral rather than crimson because the failed verdict is *text*: it had to clear the same 7:1 floor as the prose, and this is the deepest warm red that still does. It is currently **unlit** — no reading the site states fails, so `--nonconform` and `.mark-failed` have no consumer anywhere in the build, not even a key explaining them. Reserved, not spent.

### Neutral
- **Bench** (`#14120f`): the substrate — body background, every page surface, and the ground the scrollbar track sits on.
- **Well** (`#0d0c0a`): a recessed fill for image frames. It is a fill, never a boundary; well-vs-bench is 1.05:1 and carries no meaning. The only consumer is `Capture`.
- **Panel** (`#1e1a16`): a raised fill for the current channel, a selected chip, and a hovered row. Also a fill only — a panel never separates two things.
- **Ink / Bone** (`#ece5d8`): headings, prose, primary values. Warm bone, never white.
- **Annotate / Bark** (`#b0a695`): annotation, secondary prose, provenance captions, datum lines, reference links, labels. It is dimmer than ink but still clears 7:1 everywhere.
- **Rule** (`#6d655d`): 1 px hairlines, borders, scrollbar thumb, dots, underline decoration. Non-text only, and it clears the 3:1 non-text floor on all three surfaces.

Measured contrast against all three surfaces (bench `#14120f` / panel `#1e1a16` / well `#0d0c0a`), as documented in `src/styles/tokens.css` and re-measured out of the stylesheet by `tests/accessibility/tokens.test.ts`:

| token | bench | panel | well | floor |
|---|---|---|---|---|
| ink `#ece5d8` | 14.93 | 13.80 | 15.61 | 7:1 text |
| annotate `#b0a695` | 7.78 | 7.19 | 8.13 | 7:1 text |
| signal `#c9a04a` | 7.67 | 7.09 | 8.02 | 7:1 text |
| nonconform `#f38d8a` | 8.00 | 7.40 | 8.37 | 7:1 text |
| rule `#6d655d` | 3.27 | 3.02 | 3.42 | 3:1 non-text |

`tokens.test.ts` reads the literals out of the stylesheet rather than restating them, so the guard fails the moment a token moves. It also asserts that bench / well / panel / ink / annotate stay desaturated (raw-channel chroma < 40) and that signal and nonconform are hues (chroma > 60), with the gap between the two bounds deliberately empty so a drifting token fails loudly.

**The One Room Rule.** The room carries no colour of its own. Every chromatic element on the page is a real photograph or a real capture; the substrate, panels and wells are warm but desaturated and never compete with the artifacts sitting on them.

**The Weight-Before-Hue Rule.** A verdict is carried by mark weight and style first, hue second, and words always. Clean is a 2 px solid rule, claimed is dashed, failed is a heavy double; colour is a redundant second channel that survives greyscale, colour blindness and forced-colours mode (WCAG 1.4.1 by construction).

**The Reserved Fault Rule.** `--nonconform` and `.mark-failed` mean exactly one thing — measured, and it does not hold. They are not decoration, not an accent, not a hover colour, and not "something to add colour with". When a real failed reading ships, it lights up; until then it stays reserved. Since the legend on `/` was removed (see Overview), that reservation lives in this document and in `src/styles/tokens.css`, not on the page.

## Typography

**Display Font:** Barlow (with `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)
**Body Font:** Barlow (same stack)
**Label/Mono Font:** Iosevka (with `ui-monospace, monospace`)

**Character:** A signage grotesque stating the claim in plain, unornamented sentences, paired with a real technical mono that does real work on real values. Barlow is the voice; Iosevka is the measurement. Both are self-hosted, subset and shipped under the SIL OFL 1.1 — upstream packages, versions and the exact `pyftsubset` command are in `public/fonts/PROVENANCE.md`, and `index.html` preloads the Barlow 400/600 and Iosevka 400 faces the first viewport draws with. No font is fetched at runtime and no CDN is contacted. Known gap: Barlow has no `→`, `≤` or `≥`, so those glyphs appear only inside measured values and never in Barlow prose.

### Hierarchy
- **Display** (600, `clamp(1.7rem, 4.2vw, 3rem)`, 1.08, −0.03em): the first viewport's `h1` — the name, and the only element at display scale. `text-wrap: balance`. It is never animated, never typed, and never late-measured; a typing headline once produced CLS 0.187 on this site.
- **Headline** (600, 1.25rem → 1.5rem at `sm`, 1.4, −0.015em): a page `h1` on `/projects` and `/experience` ("Engineering projects", "Engineering journey"), the case-study claims, and the section headings on `/`.
- **Title** (600, 1.125rem, 1.55, −0.01em): catalog and experience entry headings, where a list of many needs a lighter step than a section head.
- **Body** (400, 0.875rem → 0.9375rem, 1.625, normal): plain sentences. Prose is held to `max-width: 66ch` (`.measure`); the artifact settle sentence uses 62ch. `text-wrap: pretty`.
- **Label** (Iosevka, 10–13px, 1.375, 0.06em when uppercase; verdicts use 0.14em): every measured value, sha, line range, timestamp, tag, chip, reference link, catalog ref, navigation item and provenance caption. `tabular-nums` on the rail readout and on counts.

**The Value-Is-Mono Rule.** Iosevka carries every measured value, reference, permalink, sha, line range, period and coordinate — and never a label or a sentence. If a thing was read off an artifact, it is mono; if it is somebody speaking, it is Barlow.

**The Bench-Stays-Wide Rule.** The bench is wide because artifacts are: a benchmark table and a quoted source range want every pixel. Prose alone is held to a measure (66ch) — the same rule applied to the artifact's own settle sentence (62ch) and to the rail's status line. A full-width paragraph is a bug.

## Layout

The bench is a two-column instrument: a **datum rail** 15rem wide (17rem at `xl`) and the work surface beside it, from `lg` up. The rail is the only chrome the site has — the name and title, the availability line, the email with a copy control, CV / GitHub / LinkedIn, the local Sydney time on a 20 s tick, the live readout of whatever is under the lens (the first `data-readout` element intersecting a −40% / −50% band, `aria-hidden` because it duplicates content already on the page), and the nav with its 5 px square state dot. It is `position: sticky`, `h-screen`, `overflow-y: auto`. Below `lg` it becomes a bordered top block and a sticky `h-14` bar carries the name and nav instead; the rail's instrument half is `lg`-only.

Work surfaces are 12-column and deliberately asymmetric: the first viewport is 7/5 (6/6 at `xl`, the hero photograph bled to the right edge), the record rows alternate which side the 5-column claim and 6-column capture sit on via an `order` flip, and the live-product block is 6/5. The catalog is a three-column row — a 3rem catalog ref, the claim column, and a 19rem measured column — collapsing to two columns below `lg`. The section rhythm is `space-y-14` → `space-y-16` at `sm` (3.5 → 4rem), block rhythm `space-y-6` (1.5rem), and the column gutter is `gap-x-8` (2rem); the main padding steps 1rem → 1.5rem → 2.5rem → 3.5rem across `sm / lg / xl`. The four flagships run as a channel strip on **every** route (`grid-cols-2` → `lg:grid-cols-4`, column rules between channels), so no route is an island.

Layout is load-bearing for CLS: `Capture` **requires** the true intrinsic `width` and `height` so the box is reserved before the image loads, the hero photograph ships a two-width `srcset` (`Hero-900.jpg 900w`, `Hero-1400.jpg 1400w`) with the same `sizes` attribute in its preload and its `<img>`, and the first viewport's heading is static text.

**The One-Chrome Rule.** The datum rail is the only chrome. There is no second sidebar, no floating toolbar, no sticky CTA, and no card wrapping a card. Anything that would add a frame around the work is refused.

**The Datum Rule.** A value without its datum is not a reading. Every reading states the datum it was taken against; where a reading measures an artifact, the datum is the artifact, the `sha7` and the line range, and the reference is a **permalink to the commit**, never a branch — a link to `main` at `#L41` resolves to whatever the file says today, which is not what the claim was measured against. It binds the readings that remain (a case-study header, `BenchEntry`, `ProofArtifactView`); the page-level readings that measured no artifact and stated their standing instead were removed with them (see Overview).

## Elevation & Depth

**There are no shadows.** `box-shadow` appears nowhere in the system (`accessibility.css` says so explicitly: the focus indicator is an `outline`, not a `box-shadow`, so it survives forced-colours mode), and the only gradient in the build is the sweep hairline.

Depth is tonal layering and nothing else: the bench (`#14120f`) is the substrate, the panel (`#1e1a16`) is a raised fill, and the well (`#0d0c0a`) is a recessed fill for image frames and readouts. The three steps are close — well-vs-bench is 1.05:1 — and none of them carries meaning. Separation is always a hairline: a 1 px `--rule` border, a 2 px mark, a column rule between channels. A fill never separates two things, and nothing is lifted off the page.

**The Rule-Not-A-Box Rule.** Separation is always a rule; a panel or a well is a fill and never a boundary. The moment a fill is used to divide, the page becomes a grid of boxes and the bench is lost.

## Shapes

The world has **no rounded vocabulary**. Radius is `0` everywhere — there is no `border-radius` authored in `src/`, chips are outlined squares and never pills, and even the scrollbar thumb is square. Nothing on the page can be mistaken for a card, because nothing has a card's silhouette.

Form comes from hairlines and marks instead: 1 px `--rule` for boundaries, column rules and dividers; a **2 px solid `--signal`** top rule for a clean reading; a **2 px dashed `--annotate`** top rule for a claim not yet measured; a **6 px double `--nonconform`** top rule for a failed one; a **1 px solid `--rule`** top rule (`.mark-thin`) for a section boundary that carries no verdict; 5 px square dots as state markers; and a 1 px hairline vocabulary for the axis and the channel rules. The well is a square frame with a 1 px `--rule` border. Text underlines are offset 4 px, coloured `--rule` at rest and `--signal` on hover, and the primary reference link thickens its underline to 3 px on hover.

**The Square Corner Rule.** Zero radius, everywhere, forever. A pill, a rounded card or a 4 px corner is a different world's vocabulary and a tell that the bench is being decorated rather than used.

## Components

### Buttons
- **Shape:** square (radius 0), text-only.
- **Primary:** the rail's copy-to-clipboard control is Iosevka, uppercase, 0.06em, `--annotate`, underlined `--rule` offset 4 px; on hover it becomes `--ink` with a `--signal` decoration. (The in-page copy control in the closing contact block uses the reference-link style instead.) Its label is a polite live region ("Copy" → "Copied" / "Copy failed"), so a copy is announced without moving focus.
- **Hover / Focus:** `transition-colors` at 150 ms; state is a colour swap on the underline and text, never a fill.
- **Secondary / Ghost:** there is no filled button anywhere on the site. Filter controls are `button.chip` (see Chips) and navigation is anchors.

### Chips
- **Style:** an outlined square — 1 px `--rule`, `--annotate` Iosevka 11px, `padding: 0.09rem 0.4rem`, radius 0, `display: inline-block`. Used for tags, skill names, experience highlights and filter controls.
- **State:** hover / focus-visible raise the border to `--signal` and the text to `--ink`. The selected filter is `[aria-pressed='true']` — border `--ink`, background `--panel`, text `--ink` — a *stated* selected state, never a filled pill. Filters are real buttons with `aria-pressed` inside a labelled `role="group"`, and the count sits beside the label in `tabular-nums`.

### Cards / Containers
- **Corner Style:** square (radius 0). There are no cards. The two container forms are the **well** (a square frame for a real capture, `--well` fill + 1 px `--rule` border, with a provenance caption on a top border) and the **ruled block** (a `.mark-thin` or `mark-clean` top rule with the content beneath it).
- **Background:** `--well` for image frames and readouts; `--panel` only for a current/selected/hovered row; otherwise transparent on `--bench`.
- **Shadow Strategy:** none — see Elevation & Depth.
- **Border:** 1 px `--rule`, or the mark vocabulary when the block states a verdict.
- **Internal Padding:** the well's caption is `px-3 py-2`; a ruled block takes `pt-3`/`pt-4`/`pt-6` above the rule and `py-4`–`py-5` of row rhythm.

### Inputs / Fields
None. The site has no form; the only text-like control is the copy button beside the visible, selectable email address. (`mailto:` deliberately is not the primary path — it silently no-ops on managed machines — so the address ships as selectable text plus a copy control.)

### Navigation
- **Style, typography, states:** the rail's nav is Barlow 13px items with a 5 px square dot — `--signal` when current, `--rule` otherwise — and `--ink` for the current label against `--annotate` at rest. The mobile bar's nav is Iosevka 11px uppercase, `0.06em`, with a 2 px bottom border: `--signal` when active, `--rule` on hover, transparent at rest. `aria-current="page"` marks the current channel in the strip and the current row in the rail.
- **Mobile treatment:** below `lg`, a sticky `h-14` bar carries the name and the three nav items; the rail's instrument block is hidden and the footer repeats the address and location.
- **Accessibility:** a skip link is the first focusable element and targets `#main-content`; the rail is a labelled complementary region ("Status and contact"); the route announcer is a polite live region that announces "Navigated to …" and deliberately does **not** write `document.title`.

### The five bench devices
These five carry the world. Each has one job and a fixed place.

- **`Reading`** — *states a measurement.* Measured / value / datum / verdict, in a two-column grid (`minmax(0,1fr) 20rem` at `lg`) under the verdict's top-rule mark. It now has exactly one consumer: a case-study header (`as="h1"`), where the claim and the artifact that settles it are the page's subject — the home first viewport and the `/projects` and `/experience` headers were relieved of theirs (see Overview). Props: `measured`, `value`, `datum`, `verdict` (default `clean`), `as` (`h1|h2|h3`), `id`. Each of the three `dt`s ("Reading", "Datum", "Verdict") is `sr-only`, so the structure is a real `dl` for assistive tech and unlabelled visually. Verdict words: **"Measured · holds"**, **"Claimed · not yet measured"**, **"Measured · does not hold"**.
- **`Capture`** — *shows a real artifact.* A photograph or live capture in a well, with a provenance line in the caption ("… at e4d177f — the batch that moved false positives 66 → 33.") and an optional develop reveal. **`width`/`height` are required** (intrinsic pixels — the box is reserved from them), and it takes `src`/`srcSet`/`sizes`, an optional `href` (external) or `to` (internal), a `linkLabel` so the whole frame is one named link, a `readout` the rail can pick up, and `priority` for the first viewport's largest paint (eager + sync + high fetch priority). Used on `/` (hero photo, flagship repositories, the live product) and on a case study and `/experience` (event photographs).
- **`ChannelStrip`** — *carries the four flagships across every route.* Four channels, each a link with one reading: the label, a `settled`/`open` word (`aria-hidden`), the value in `--signal` Iosevka, and the label that makes the value checkable (`note`). The current slug takes `aria-current="page"` and the 2 px top rule plus `--panel` fill; the others raise both on hover/focus. It renders below the case-study header too, so a case study remains part of the bench.
- **`BenchEntry`** — *one catalog row.* The row carries no handler; a stretched anchor inside it does the work, which is what gives the row a keyboard equivalent. The **tier is read off presence, not a badge**: a flagship (`proof` **and** `proofLine`) gets a full-weight `mark-clean` rule, one monochrome line of real output, and the permalink that settles it (`shortRef @ sha7`); a supporting entry gets `.mark-thin` and stops at its repository. Its catalog ref (`P.01`…) is computed from position in `projects`, so a row and the channel strip above it name the same project the same way. The measured column carries every `metric.value` with the `metric.label` that makes it checkable.
- **`ProofArtifactView`** — *the artifact that settles a claim.* Page-width and unboxed, under a `mark-clean` header stating the claim in words and the reference `repo · sha7 · L{from}–L{to}`, with the permalink below. Its **shape follows its `kind`**: `table` renders a real `<table>` (with `<caption class="sr-only">` and `th scope="col"`, parsed from the quoted markdown and dropping the `|---|` separator), `trace` renders an ordered durable run — each step numbered, `⇢` marking a fan-out `sendEvent`, and each call's real line number in the pinned file — and `capture` renders the bytes verbatim in `<pre><code>`.

**No legend ships.** The marks legend that once taught the vocabulary on `/` — three rules at 3rem width with their names (Measured / Claimed / Failed) and meanings, followed by a sentence on brass and the unlit red — was removed on 2026-09-26 (see Overview). The vocabulary is unchanged; it is now a convention stated in this document rather than a key on the page. That is a real loss for a reader meeting the marks cold, and it is recorded rather than glossed: the compensation is that no remaining mark is the only carrier of its meaning (The Weight-Before-Hue Rule), and the two index routes name their tiers in words ("Measured to an artifact" / "Repository only").

## Do's and Don'ts

### Do:
- **Do** mark a verdict with weight and style first — 2 px solid `--signal` (clean), 2 px dashed `--annotate` (claimed), 6 px double `--nonconform` (failed) — then hue, and **always** write the verdict in words.
- **Do** state the datum for every reading. Where it measures an artifact, give the artifact, the `sha7`, the line range, and a commit-pinned permalink (`https://github.com/<owner>/<repo>/blob/<sha>/<path>#L…`). Never `main`, never `#L41` alone.
- **Do** hold prose to `max-width: 66ch` (`.measure`) and let the bench stay wide for tables and quoted source.
- **Do** give every `Capture` its true intrinsic `width`/`height`, and ship a `srcset` + a matching preload for the first viewport's largest paint. The first viewport's heading is static — no typing, no late measurement, no animation.
- **Do** keep the room desaturated (bench / well / panel / ink / annotate) and keep every chromatic surface a real photograph or capture.
- **Do** keep exactly one focus indicator for the whole app: `:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px }` in `src/styles/accessibility.css` and nowhere else. It clears 14.93 / 13.80 / 15.61 against bench / panel / well, and the offset shows the substrate through which is what carries contrast on an ink-filled control. `outline`, not `box-shadow`, so it survives forced-colours mode.
- **Do** keep the accessibility floor: skip link to `#main-content`, labelled landmarks (`main`, `contentinfo`, the rail as complementary), a polite route announcer that does **not** write `document.title` (`SEOHead` is its one owner), `aria-hidden` on decorative layers with a text equivalent, and every state also in words.
- **Do** keep all motion behind `prefers-reduced-motion: no-preference` and depend on no animation for readability — a browser without scroll-timeline support gets the developed frame; `accessibility.css` suppresses the rest.
- **Do** keep the register casual and informative: a record walked downward, one reading at a time, in plain sentences, with the checkable number next to the claim.

### Don't:
- **Don't** spend `--nonconform` or `.mark-failed` as decoration, an accent, a hover colour, or a way to add colour. It means one thing and nothing currently lights it.
- **Don't** use radius, pills, or card silhouettes. Zero radius, everywhere; the scrollbar thumb included.
- **Don't** put a fill behind anything to separate it, and don't add a shadow. Separation is a hairline; depth is tonal only.
- **Don't** fade text, animate prose or headings, or use an entrance that loops. The develop reveal is a `clip-path` on real captures only; no ambient motion, scanline shimmer, glyph noise or animated text.
- **Don't** put a kicker or eyebrow above a heading. The craft floor bans it and the bench has no vocabulary for it.
- **Don't** use hard offset shadows, glyph icons or icon fonts (a state mark is a rule, not an icon), a system display face, or any third-party font, CDN, image or animation library.
- **Don't** wrap a container in a container, or frame the work in a card that adds nothing but a border.
- **Don't** state a claim without its artifact, and don't write anything that implies the absences exist: no testimonials or referee quotes, no client or employer logos, no Tendor artifacts, repos or metrics, no user or traffic numbers for the site itself, no rates or salary figures, and no team sizes beyond those already recorded.
- **Don't** add a dark/light toggle or a second theme. There is one room; `tailwind.config.ts` configures no `darkMode`, `tokens.css` declares a single `:root`, and `tests/pipeline/css-classes.test.ts` fails on a `dark:` variant.

### Deliberately absent
No testimonials, client logos, Tendor artifacts, traffic numbers, rates or team sizes (PRODUCT.md's absence list). No dark/light toggle or second theme. No shadows, no radius, no pills, no gradients beyond the sweep hairline. No kickers or eyebrows. No animated text, no looping ambient motion. No icon font, no glyph icons, no third-party font/CDN/image/animation dependency. No cards nested in cards. No form, no funnel, no CTA above the fold, no buy button.

### Where the guards live
- `tests/accessibility/tokens.test.ts` — contrast floors re-measured out of `tokens.css`, the desaturated-room assertion, and the single `:root` palette.
- `tests/accessibility/bench-motion.test.ts` — exactly two keyframes (`develop`, `sweep`), no `opacity` in `develop`, nothing animated in `index.css` outside `::view-transition`, no `infinite` or iteration counts, ≥2 `no-preference` gates, `animation-timeline: view()` with `animation-duration: 1ms`, no `scroll` listeners, browser surfaces themed, and full reduced-motion suppression.
- `tests/accessibility/RouteAnnouncer.test.tsx` — the announcer leaves `document.title` to `SEOHead`.
- `tests/pipeline/css-classes.test.ts` — no utility that generates no CSS, no `dark:` variant, no `darkMode` strategy.
- Measured on 2026-09-26: `npx vitest run` — 24 test files, 163 tests, all passing; `npm run build` (which runs `tsc`) clean; `impeccable detect --json` returns `[]`. `HomeView.test.tsx` no longer asserts the first-viewport reading or the marks legend, and no longer asserts a pinned permalink in the first viewport (the home route's only one was the removed reading's).
