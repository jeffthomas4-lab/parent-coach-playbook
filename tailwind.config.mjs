/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Brand tokens — warm editorial. Do not invent new shades.
        ink: '#2D2520',          // Warm Ink (was Stadium Ink)
        paper: '#FAF6EE',        // Cream Paper (was Field Paper)
        'paper-warm': '#F2EAD9', // card backgrounds, warmer cream
        rust: '#C5713D',         // Terracotta (was Drive Rust)
        turf: '#8FA68C',         // Sage (was Turf)
        bone: '#DDD2BD',         // Linen (was Bone) — borders/dividers
        trophy: '#D4AB6A',       // Honey (was Trophy) — highlight
        'ink-soft': '#5F5448',   // Walnut — body text
        rose: '#B8908F',         // Dusty rose — tertiary accent for pull quotes / soft callouts
        'rose-bg': '#EDDBD9',    // Light rose tint for backgrounds
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        // Soft display: Mulish at heavy weight. Used on landing pages where the
        // editorial-but-stern Fraunces reads too heavy for a mom-audience first impression.
        'display-soft': ['"Mulish"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        body: ['"Mulish"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
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
