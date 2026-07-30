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
      // NOTE (2026-07-29 color/UI deep dive): the `spacing` key that mirrored
      // --s1..--s10 into Tailwind utilities (`py-s6`, `gap-s3`, ...) was
      // removed. A full sweep of src/ excluding src/content found ZERO
      // consumers -- not one `p-s*`, `m-s*`, or `gap-s*` in any .astro file.
      // It was dead config advertising a system nothing used. The CSS custom
      // properties themselves stay in global.css, where .band, .container-px,
      // and .gear-pick do consume --s2/--s3/--s8. Page templates still use
      // literal Tailwind spacing (py-12, py-20, ...). Wiring ~100 templates
      // onto the ramp is a real mechanical pass; see STANDARD-AUDIT #40.
    },
  },
};
