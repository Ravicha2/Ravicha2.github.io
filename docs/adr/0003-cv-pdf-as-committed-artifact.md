# ADR 0003: CV PDF is a committed artifact, built outside CI

## Context
The CV existed only as `Ravicha_cv_AU.typ` at the repo root, unreachable from the
site and excluded from version control by the blanket `*.typ` ignore rule. The
portfolio had no CV download on any route, despite it being the highest-intent
asset a recruiter looks for.

Two ways to ship it:

1. Compile it in CI, so the PDF is always regenerated from source.
2. Commit the compiled PDF and rebuild it deliberately.

`typst` is not available on the deploy runner, and `npm run build` is run by both
CI and any local contributor. Compiling in CI would mean adding a `typst` install
step to `deploy.yml` *and* making local `npm run build` fail for anyone without
the toolchain installed — a build that breaks on a missing optional binary is a
worse trade than a stale artifact.

## Decision
Commit `public/cv.pdf` as a build artifact and rebuild it explicitly:

```
npm run cv:build      # typst compile Ravicha_cv_AU.typ public/cv.pdf
```

- `Ravicha_cv_AU.typ` is un-ignored (`!Ravicha_cv_AU.typ`) and tracked, so the
  source of truth lives in the repo and the PDF is reproducible.
- `npm run build` does **not** invoke typst; it only copies `public/cv.pdf` into
  `dist/`, where GitHub Pages serves it at `/cv.pdf`.
- `Ravicha_cv.typ` (the non-AU variant) is deleted. It was stale — it still
  read `Jul 2026 - present` and used a superseded email address.

`tests/pipeline/cv-pdf.test.ts` guards the parts that can be checked without the
typst toolchain: the artifact exists and is a PDF, and the source carries no
claim that contradicts `src/data/` (canonical email, no open-ended `present` end
dates, and the stated period of every role the CV lists).

## Consequences
### Positive
- No new CI dependency and no optional-binary failure mode for contributors.
- The CV is reachable at `/cv.pdf` and linked from the header (every route) and
  the closing conversion block on `/experience` and every case study.

### Negative / Trade-offs
- The PDF can drift from its source: editing the `.typ` without running
  `npm run cv:build` leaves a stale artifact, and CI cannot detect that because
  it does not run typst. **Rebuild the PDF in the same commit as any `.typ`
  edit.** If this proves unreliable, the upgrade path is to add a `typst` setup
  step to `deploy.yml` and build the PDF as part of the deploy job.
