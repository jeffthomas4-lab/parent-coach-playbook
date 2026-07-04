import { pcdTokens, tailwindColorsFrom, tailwindFontsFrom } from './src/styles/pcd-tokens.mjs';

// Colors, fonts, and layout now derive from src/styles/pcd-tokens.mjs
// (item 123 / ADR-049) instead of a hand-copied list here. Values are
// unchanged from before this switch — same hex codes, same font stacks —
// so this is a no-op visually. See pcd-tokens.mjs for the single source.

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: tailwindColorsFrom(pcdTokens),
      fontFamily: {
        // Real font first, metric-adjusted fallback (defined in src/styles/global.css), then system fonts.
        ...tailwindFontsFrom(pcdTokens),
      },
      letterSpacing: {
        label: pcdTokens.extensions?.letterSpacing?.label ?? '0.18em',
      },
      maxWidth: {
        prose: pcdTokens.layout.prose,
        container: pcdTokens.layout.maxWidth,
      },
      typography: () => ({
        DEFAULT: {
          css: {
            color: '#2A3042',
            fontFamily: '"Fraunces", "Fraunces Fallback", Georgia, serif',
            maxWidth: '680px',
          },
        },
      }),
    },
  },
  plugins: [],
};
