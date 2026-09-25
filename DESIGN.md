# DESIGN.md — the Tolerance Frame

This document is derived from the shipped site, not from intentions. Where it
states a number, the number was measured on `dist/` after `npm run build`. It
replaces the earlier zinc/blue specification and supersedes
`docs/superpowers/specs/2026-09-04-elevenlabs-theme-and-color-palette-design.md`.

The design authority is the direction contract in `.impeccable/surfaces/index-html.md`.
This file records what that contract became once built.

---

## 1. The world

The site is a **printed drafting sheet**, not a stack of cards.

Every claim is stated the way a drawing states one: a **nominal**, the
**tolerance** it must hold, and the **datum** it was measured against — a feature
control frame, which either conforms or does not.

- A framed sheet on a grey ground, with a 2px ink rule on all four edges.
- Dense near-black linework on white. One grey for annotation and leader lines.
- A corner **title block** carrying the name, revision, and the primary action.
- **Datum references** in the right margin: what every measurement is taken
  against (the GitHub account, UNSW Sydney, Sydney).
- Exactly **one hue** — inspection red — and it appears only on non-conformance.

The world refuses both the dark terminal and the cream editorial page. There is
no dark mode; there is no second theme.

## 2. Colour

Six tokens, five values, one hue. Declared in `src/styles/tokens.css`.

| Token | Value | Contrast on sheet / panel | Used for |
|---|---|---|---|
| `--sheet` | `#ffffff` | — | The sheet |
| `--panel` | `#f6f6f5` | — | The ground the sheet is inset from; the current chain interval |
| `--ink` | `#0d1013` | 19.08 / 17.64 | Rules, headings, primary text |
| `--annotate` | `#474c53` | 8.65 / 8.00 | Annotation, leader lines, secondary text, ordinary links |
| `--nonconform` | `#9d1116` | 8.32 / 7.69 | The failed rule, and nothing else |

**Measured on the built site** (headless Chrome over CDP, every route, every
text-bearing element, effective background resolved by walking ancestors):
worst ratio anywhere is **8.00:1**, against a floor of 7:1. The focus ring is
2px solid `--ink` with a 2px offset — **19.08:1** against the sheet it sits on
and 19.08:1 against an ink-filled control, against a floor of 3:1.

`--panel` and `--sheet` differ by 1.08:1 and carry no meaning. Separation is
always an ink rule, never a fill change.

**Meaning is never carried by colour.** Line weight and style carry it, so the
verdict survives greyscale, colour blindness, and forced-colours mode
(WCAG 1.4.1 by construction):

| Weight | Style | Meaning |
|---|---|---|
| `.rule-verified` | 2px solid ink | Verified — the artifact is in the repository at the pinned commit |
| `.rule-asserted` | 2px dashed ink | Asserted — stated, not yet measured |
| `.rule-failed` | 6px double nonconform | Failed — measured, and does not conform |

Ordinary navigation links take ink and an underline. They never take the hue.

## 3. Type

Two families, both self-hosted and subset. Neither is a training-data default.

- **Barlow** states the claim — headings, prose, labels.
- **Iosevka** carries every measured value, dimension, reference, and permalink.

Subsets and licences: `public/fonts/PROVENANCE.md`. `font-display: swap`,
relative `url()` only; the stylesheet contacts no third party.

**The measure.** The sheet stays wide because artifacts are — a benchmark table
and a quoted source range both want every pixel. Prose alone is held to
`max-width: 66ch` (`.measure`). The previous build measured 85–121 characters
per line; it now measures within the 45–75 band.

## 4. The proof grammar

A case study carries **one full-width artifact, with no nested container**, and
its shape follows its proof type (`src/components/sheet/ProofArtifact.tsx`):

| `kind` | Renders as |
|---|---|
| `table` | A real `<table>`, with `<caption class="sr-only">` and `th scope="col"` |
| `trace` | An ordered run of durable steps, each with its line in the pinned file |
| `capture` | The quoted source, as `<pre><code>` |

Above each artifact: what it settles, and the reference
`repo · sha7 · L{from}–L{to}`. Below it: the permalink.

**A link to `main` at `#L41` is not a permalink.** Every artifact is pinned to
the commit its bytes were read at —
`https://github.com/<owner>/<repo>/blob/<sha>/<path>#L<from>-L<to>` — and a
claim about the artifact is only a claim about those bytes.

All four shipped permalinks were verified to resolve: blob 200, commit 200, and
the pinned range inside the file's line count.

**Catalog tiering is a rendering change, not a data one.** Four flagships carry
the full-weight rule, one line of real output, and their permalink; three
supporting entries are a thin rule and stop at their repository. The tier is
read off `proof`/`proofLine` presence, never off a badge.

## 5. The chain

One **continuous dimension line** runs on all four routes, carrying the four
flagship projects as dimensioned intervals and marking the interval the visitor
is standing on. No route is an island: the chain is the route into the case
studies and the record of where you are on it.

It renders as `.dimension` — a 1px ink line with a 9px extension tick at each
boundary — and each interval is a link whose value is the metric that measured
it, never a bare figure.

## 6. Motion

Three motions, all native CSS, no library.

1. **The plotter pass** (`AppLayout`). Four absolutely-positioned rules draw the
   frame in one ordered pass on first paint: top, left, right, header, bottom.
   Transform-animated from a zero scale, so the geometry is reserved before the
   pass and nothing reflows. Runs exactly once — no animation anywhere on this
   site has an iteration count above 1.
2. **The dimension line** draws once, 260ms into the same pass.
3. **Scroll-driven reading** (`src/styles/sheet.css`), on the case-study
   sequence only: `animation-timeline: view()`, `animation-range` set per block,
   `animation-duration: 1ms` so Firefox doesn't fall back to a 0s duration.

The scroll reveal animates **transform only, never opacity**. A fade was measured
on the built site at 0.67 mid-range, which takes `--annotate` to 3.59:1 on the
sheet — mid-range being exactly where the reading band is. Motion here is a
redundant second channel; it never carries readability.

The hero H1 is never animated.

**Under `prefers-reduced-motion`, every route is the finished, static document.**
Both motions are inside `prefers-reduced-motion: no-preference`, and
`src/styles/accessibility.css` additionally forces duration to 0.01ms with
`animation-timeline: none`. The content never depends on an animation to be
readable — including in a browser with no scroll-timeline support, where the
`@supports` block simply doesn't apply.

## 7. Accessibility

- **Focus**: one `:focus-visible` rule for the whole app, in
  `src/styles/accessibility.css` and nowhere else. `outline`, not `box-shadow`,
  so it survives forced-colours mode.
- **Landmarks**: `banner`, `main`, `contentinfo`, and the datum margin as a
  labelled complementary region; a skip link targeting `#main-content`.
- **Conformance is not announced by colour.** Every state carries a word —
  `CONFORMS`, `ASSERTED`, `NONCONFORMING` — as well as its weight.
- **Route changes** are announced, and shared-element morphs are limited to the
  catalog entry → case-study header pair.

## 8. Performance guardrails

- The SPA stays a SPA: Vite + React 18 + TypeScript + Tailwind 3.
- Route transitions use `document.startViewTransition()` when available, and
  fall back to a plain navigation when it is not, or when motion is reduced.
- No gradients. No animation libraries. No webfont that isn't self-hosted.
- Dependency floor: `react`, `react-dom`, `react-router-dom`. Nothing else.
