import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#fafafa',
        surface: '#ffffff',
        'surface-hover': '#f4f4f5',
        'border-subtle': '#e4e4e7',
        'border-strong': '#d4d4d8',
        'text-primary': '#09090b',
        'text-secondary': '#3f3f46',
        'text-muted': '#52525b',
        'accent-solid': '#1e40af',
        'accent-badge-bg': '#eff6ff',
        'accent-badge-text': '#1e40af',
      },
    },
  },
  plugins: [],
};

export default config;
