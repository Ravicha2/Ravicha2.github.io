# Asset provenance

Every raster on this site is real: a photograph taken at an event, a capture of
a running system, or a mark the author supplied. No image is fetched at runtime
and no raster stands in for an artifact that does not exist.

Three kinds of raster ship:

1. **Event photographs** — owned originals, resized here. The untouched originals
   are kept at `.impeccable/review/asset-originals/` so the shipped derivative is
   always checkable against its source.
2. **Live captures** — screenshots of the running systems, taken from the public
   deployment or the public repository at the pinned commit. A capture is dated
   by its capture, not by the code it shows.
3. **Author-supplied marks** — a project's own mark or logo. A mark identifies
   the project; it is not a capture and settles no claim. Where a project's
   headline claim needs settling, it is settled by the capture underneath it.

## Event photographs

| Shipped | Original | What it is |
|---|---|---|
| `Hero-900.jpg`, `Hero-1400.jpg` | `Hero.jpeg` 1086×724 | Palm at a work table, IEEE Thailand Section event |
| `IEEE.jpg` | `IEEE.png` 1162×712 | Chulalongkorn cohort, IEEE TENCON 2023, Chiang Mai |
| `Hack2Heal.jpg` | `Hack2Heal.png` 5120×2880 | Team Bread, Founder's Choice Award, UNSW Founders Stage |

Regenerate from the preserved originals with:

```bash
sips -s format jpeg -s formatOptions 82 -Z 900  originals/Hero.jpeg    --out public/assets/Hero-900.jpg
sips -s format jpeg -s formatOptions 84 -Z 1400 originals/Hero.jpeg    --out public/assets/Hero-1400.jpg
sips -s format jpeg -s formatOptions 80         originals/IEEE.png     --out public/assets/IEEE.jpg
sips -s format jpeg -s formatOptions 78 -Z 1600 originals/Hack2Heal.png --out public/assets/Hack2Heal.jpg
```

`Hero` ships two widths because it is the first viewport's largest paint: the
900px cut is what the `srcset` serves on a phone, the 1400px cut on a wide
display. Both are preloaded together in `index.html` with the same `sizes`
attribute the `<img>` declares, so the preload picks the file the browser
actually uses.

`IEEE.png` and `Hack2Heal.png` were PNGs carrying photographic data, which is the
wrong container for a photograph; they are JPEG here. `Hack2Heal` was 5120px
wide, four times wider than it is ever displayed.

## Live captures

Taken 2026-09-26: the repository and registry views with a headless Chrome at a
1440px viewport; the NL2REGEX workspace from the app itself, in a browser at
2848px wide (2×, so it stays sharp on a retina display).

| Shipped | Source | Settles |
|---|---|---|
| `captures/gh-doc-ingestion.png` | `github.com/Ravicha2/document-ingestion-agent` | the durable-step ingestion engine repository at commit `a698cbf` |
| `captures/gh-shepherd.png` | `github.com/Ravicha2/Shepherd` | the repository the claim resolves to |
| `captures/gh-nl2regex.png` | `github.com/Ravicha2/NL2REGEX` | the distributed regex engine repository |
| `captures/gh-litreview.png` | `github.com/Ravicha2/lit-review-council` | the agentic peer-review repository |
| `captures/pypi-litreview.png` | `pypi.org/project/lit-review-council/` | the package is published, not just committed |
| `captures/NL2REGEX.png` | the NL2REGEX app, run from the repository at `9c9fe8a` | the workspace the 172 backend tests back is built and runs |
| `captures/heal-desktop.png` | `heal.a2a.ing` | the product is deployed and running |

## Author-supplied marks

| Shipped | What it is |
|---|---|
| `captures/shepherd.png` | The Shepherd project mark, supplied by the author. It names the project and settles nothing else: Shepherd's shipped figures come from a two-arm annotation study in a private research repository, so no capture and no permalink backs them. |

## Kept but not shown

Five captures ship in `dist/` and no page references them. `gh-litreview.png`,
`gh-nl2regex.png` and `gh-shepherd.png` are repository pages; `gh-shepherd-eval.png`
is the AGGREGATE.md file view from Shepherd's dev eval, and `gh-shepherd-eval.png`
no longer underpins any shipped claim — the dev eval was replaced by the two-arm
benchmark, which `projects.ts` carries without a permalink. Each is superseded as
illustration — by the published package (`pypi-litreview.png`), the workspace
(`NL2REGEX.png`), and the project mark (`shepherd.png`) respectively. They are
superseded as illustration, not as evidence, so they stay.

Captures are not re-taken by a build step. Re-take them by hand when the thing
in them changes, and update the date above — a capture that has drifted from its
source is worse than no capture, because it still looks like evidence.
