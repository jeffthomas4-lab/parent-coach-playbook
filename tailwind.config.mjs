import { pcdTokens, tailwindColorsFrom, tailwindFontsFrom } from './src/styles/pcd-tokens.mjs';

// Colors, fonts, and layout derive from src/styles/pcd-tokens.mjs (item 123 /
// ADR-049) instead of a hand-copied list here — single source of truth.
// Consumed via Tailwind v4's `@config` directive in src/styles/global.css
// (Tailwind v3->v4 migration, Card M4) rather than v3's implicit content-glob
// config loading. Values are unchanged — same hex codes, same font stacks.
//
// The `typography` theme key that used to live here was dropped: it had zero
// effect. @tailwindcss/typography was never installed or registered in
// `plugins`, so it was dead code -- not something this migration needs to
// port forward. See PAGES-TO-WORKERS-MIGRATION-BRIEF.md, Card M4.

/** @type {import('tailwindcss').Config} */
export default {
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
        measure: '68ch',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        btn: 'var(--radius-btn)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        cardHover: 'var(--shadow-card-hover)',
      },
      spacing: {
        s1: 'var(--s1)',
        s2: 'var(--s2)',
        s3: 'var(--s3)',
        s4: 'var(--s4)',
        s5: 'var(--s5)',
        s6: 'var(--s6)',
        s7: 'var(--s7)',
        s8: 'var(--s8)',
        s9: 'var(--s9)',
        s10: 'var(--s10)',
      },
    },
  },
};
