import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // The JIT scans raw file text, not class attributes, so ordinary words get
  // compiled into utilities: `document.activeElement.blur()`, `Array.filter()`,
  // and the phrase "rather than at a rounded one" each emitted a real rule that
  // nothing used — issue #18's problem in reverse. `blocklist` is the intended
  // fix and it cannot rot: the next `.filter(` call will not re-emit.
  blocklist: ['rounded', 'blur', 'filter'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Barlow', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Iosevka', 'ui-monospace', 'monospace'],
      },
      colors: {
        bench: 'var(--bench)',
        well: 'var(--well)',
        panel: 'var(--panel)',
        ink: 'var(--ink)',
        annotate: 'var(--annotate)',
        signal: 'var(--signal)',
        nonconform: 'var(--nonconform)',
        rule: 'var(--rule)',
      },
    },
  },
  plugins: [],
};

export default config;
