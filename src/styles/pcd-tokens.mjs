// Parent Coach Desk design tokens (item 123 / ADR-049).
//
// Values extracted verbatim from tailwind.config.mjs and
// src/styles/global.css's `:root` block — the warm-editorial palette
// (ink/paper/rust/turf/trophy/bone/rose, Fraunces + Mulish). Nothing here is
// new or changed; this just gives those two hand-copied lists one shared
// source. Conforms to the same `DesignTokens` shape SightSmash uses
// (see ./design-tokens.d.ts) even though the actual colors are intentionally
// different — see ADR-049 in the SightSmash repo for why the two repos share
// a token *shape* rather than a live npm dependency.

/** @typedef {import('./design-tokens.js').DesignTokens} DesignTokens */

/** @type {DesignTokens} */
export const pcdTokens = {
  name: 'pcd-warm-editorial',
  colors: {
    ink: '#2D2520', // Warm Ink (was Stadium Ink)
    inkSoft: '#5F5448', // Walnut — body text
    paper: '#FAF6EE', // Cream Paper (was Field Paper)
    paperWarm: '#F2EAD9', // card backgrounds, warmer cream
    rust: '#9E5228', // Terracotta — darkened from #C5713D 2026-07-07 for WCAG AA (5.3:1 on paper, 4.8:1 on paper-warm, 5.3:1 with paper text on rust bg; must stay in sync with global.css --rust)
    bone: '#DDD2BD', // Linen — borders/dividers
    turf: '#8FA68C', // Sage
    trophy: '#D4AB6A', // Honey — highlight
    rose: '#B8908F', // Dusty rose — tertiary accent for pull quotes / soft callouts
    roseBg: '#EDDBD9', // Light rose tint for backgrounds
    // PCD has no dedicated error/destructive color defined today.
  },
  fonts: {
    display: '"Fraunces", "Fraunces Fallback", Georgia, serif',
    body: '"Mulish", "Mulish Fallback", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    mono: '"JetBrains Mono", Menlo, monospace',
  },
  layout: {
    // No single base radius: PCD uses pill buttons (999px), a 0/6px/6px/0
    // pull-quote shape, and square editorial cards, chosen per component.
    maxWidth: '1200px', // container
    prose: '680px',
  },
  extensions: {
    // Heavy-weight Mulish display variant, used on landing pages where
    // Fraunces reads too stern for a mom-audience first impression.
    displaySoftFont: '"Mulish", "Mulish Fallback", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    letterSpacing: {
      label: '0.18em',
    },
  },
};

/**
 * Builds a Tailwind `theme.extend.colors` object from a DesignTokens
 * instance, matching the exact color-name surface PCD's tailwind.config.mjs
 * hand-maintained before this file existed.
 * @param {DesignTokens} tokens
 */
export function tailwindColorsFrom(tokens) {
  return {
    ink: tokens.colors.ink,
    paper: tokens.colors.paper,
    'paper-warm': tokens.colors.paperWarm,
    rust: tokens.colors.rust,
    turf: tokens.colors.turf,
    bone: tokens.colors.bone,
    trophy: tokens.colors.trophy,
    'ink-soft': tokens.colors.inkSoft,
    rose: tokens.colors.rose,
    'rose-bg': tokens.colors.roseBg,
  };
}

/**
 * Builds a Tailwind `theme.extend.fontFamily` object, including PCD's
 * `display-soft` variant which isn't part of the shared DesignTokens shape.
 * @param {DesignTokens} tokens
 */
export function tailwindFontsFrom(tokens) {
  const split = (stack) => stack.split(',').map((f) => f.trim());
  return {
    display: split(tokens.fonts.display),
    'display-soft': split(tokens.extensions?.displaySoftFont ?? tokens.fonts.body),
    body: split(tokens.fonts.body),
    mono: split(tokens.fonts.mono),
  };
}
