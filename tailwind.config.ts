import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Barlow', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Iosevka', 'ui-monospace', 'monospace'],
      },
      colors: {
        sheet: 'var(--sheet)',
        panel: 'var(--panel)',
        ink: 'var(--ink)',
        annotate: 'var(--annotate)',
        nonconform: 'var(--nonconform)',
      },
    },
  },
  plugins: [],
};

export default config;
