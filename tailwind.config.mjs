/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Brand tokens — locked. Do not invent new shades.
        ink: '#1A1F2E',          // Stadium Ink — primary
        paper: '#F7F3EC',        // Field Paper — background
        'paper-warm': '#F0EADF', // card backgrounds
        rust: '#B54422',         // Drive Rust — accent
        turf: '#4A5D3A',         // support
        bone: '#E8E1D2',         // borders / dividers
        trophy: '#C89B3C',       // highlight, used sparingly
        'ink-soft': '#2A3042',   // body text
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        label: '0.18em',
      },
      maxWidth: {
        prose: '680px',
        container: '1200px',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            color: '#2A3042',
            fontFamily: '"Fraunces", Georgia, serif',
            maxWidth: '680px',
          },
        },
      }),
    },
  },
  plugins: [],
};
