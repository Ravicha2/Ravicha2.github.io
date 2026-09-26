# Font provenance

Both families are self-hosted here, subset to the codepoints this site actually
uses, and shipped under the SIL Open Font License 1.1 (full text alongside each
family). No font is fetched at runtime, and no CDN is contacted.

| File | Source package | Version | Upstream |
|---|---|---|---|
| `Barlow-{400,500,600,700}.woff2` | `@fontsource/barlow` | 5.3.0 | <https://github.com/jpt/barlow> |
| `Iosevka-{400,500,700}.woff2` | `@fontsource/iosevka` | 5.3.0 | <https://github.com/be5invis/Iosevka> |

Each shipped file is the upstream `*-latin-<weight>-normal.woff2` reduced with
fontTools. Regenerate from a clean checkout with:

```bash
npm i --no-save @fontsource/barlow@5.3.0 @fontsource/iosevka@5.3.0
U="U+0020-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026,U+2032-2033,U+2192,U+2248,U+2264-2265"
pyftsubset node_modules/@fontsource/barlow/files/barlow-latin-400-normal.woff2 \
  --unicodes="$U" --layout-features='*' --flavor=woff2 --output-file=public/fonts/Barlow-400.woff2
# ...and the same for every other weight in the table above.
```

The range covers ASCII, Latin-1 (accented names) and the punctuation the sheet
uses: en/em dash, curly quotes, ellipsis, prime marks, middot, plus-minus, and
the arrow/inequality glyphs carried by Iosevka.

**Known gap:** Barlow ships no `U+2192` (→), `U+2264` (≤) or `U+2265` (≥) — the
upstream family has no such glyphs, not a subsetting loss. Those marks therefore
appear only inside measured values, which are set in Iosevka; never in Barlow
prose.
