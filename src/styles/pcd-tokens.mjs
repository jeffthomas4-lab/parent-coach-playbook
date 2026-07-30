// Parent Coach Desk design tokens (item 123 / ADR-049).
//
// Values extracted verbatim from tailwind.config.mjs and
// src/styles/global.css's `:root` block. Originally the warm-editorial
// palette (ink/paper/rust/turf/trophy/bone/rose, Fraunces + Mulish); remapped
// 2026-07-29 to the navy/silver-green palette (ink/paper/rust/turf/trophy/
// bone/rose kept as legacy token NAMES with new hex VALUES, so the ~4187
// existing `bg-paper` / `text-rust` / etc. utility usages across the site
// keep working without a rename). Conforms to the same `DesignTokens` shape
// SightSmash uses (see ./design-tokens.d.ts) even though the actual colors
// are intentionally different — see ADR-049 in the SightSmash repo for why
// the two repos share a token *shape* rather than a live npm dependency.

/** @typedef {import('./design-tokens.js').DesignTokens} DesignTokens */

/** @type {DesignTokens} */
export const pcdTokens = {
  name: 'pcd-navy-silver',
  colors: {
    ink: '#041E42', // Deep navy — h1-h3, section headings, structural rules (was Warm Ink #2D2520)
    inkSoft: '#2E3A45', // Body text (was Walnut #5F5448)
    paper: '#EDF1F5', // Page background, light grey-blue (was Cream Paper #FAF6EE)
    paperWarm: '#FFFFFF', // Card and content surfaces (was warmer cream #F2EAD9)
    rust: '#003594', // PRIMARY ACCENT: links, buttons, active states (was Terracotta #9E5228)
    bone: '#C9D2DA', // Borders and dividers (was Linen #DDD2BD)
    // turf/trophy/rose are deliberately the SAME value now (#8A9BA0, silver
    // green). Collapsed to one decorative accent so the palette doesn't carry
    // a third color — kept as three separate token names only because ~4187
    // existing `bg-turf` / `text-trophy` / `border-rose` utility usages across
    // 146 files reference them and a rename was out of scope for this pass.
    turf: '#8A9BA0', // Silver green — DECORATIVE ONLY (was Sage #8FA68C)
    trophy: '#8A9BA0', // Collapsed into silver green (was Honey #D4AB6A)
    rose: '#8A9BA0', // Collapsed into silver green (was Dusty rose #B8908F)
    roseBg: '#F4F7FA', // Palest fill (was light rose tint #EDDBD9)
    // PCD has no dedicated error/destructive color defined today.

    // --- New semantic tokens (2026-07-29 navy/silver remap) ---
    surface: '#FFFFFF',
    surfaceSunken: '#EDF1F5',
    stripe: '#F4F7FA', // zebra rows, hover rows
    accent: '#003594',
    accentHover: '#002873',
    navy: '#041E42',
    muted: '#5A6468', // muted text, captions
    line: '#C9D2DA',
    // Section divider. Darker than bone/line on purpose — see the --rule
    // comment in global.css. 3.49:1 on white (WCAG 1.4.11 non-text wants 3:1
    // when a rule is the sole carrier of a boundary).
    rule: '#7C8B99',
    // silver (#8A9BA0) is 2.89:1 on white — DECORATIVE ONLY (fills, borders,
    // glyphs). Never use it for body or label text; use silverDeep instead.
    silver: '#8A9BA0',
    // silverDeep (#5F7075) is the AA-safe silver-green for eyebrow/label TEXT
    // — 5.17:1 on white, 4.56:1 on #EDF1F5.
    silverDeep: '#5F7075',
  },
  fonts: {
    display: '"Fraunces", "Fraunces Fallback", Georgia, "Times New Roman", serif',
    body: 'Inter, "Inter Fallback", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"JetBrains Mono", Menlo, monospace',
  },
  layout: {
    // No single base radius: PCD uses pill buttons (999px) for chips only
    // now, a 0/12px/12px/0 pull-quote shape, and card-radius editorial cards.
    maxWidth: '1200px', // container
    prose: '68ch',
  },
  extensions: {
    // Same as body sans — display-soft variant used on landing pages where
    // Fraunces reads too stern for a mom-audience first impression.
    displaySoftFont: 'Inter, "Inter Fallback", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
    // New semantic aliases
    surface: tokens.colors.surface,
    'surface-sunken': tokens.colors.surfaceSunken,
    stripe: tokens.colors.stripe,
    accent: tokens.colors.accent,
    'accent-hover': tokens.colors.accentHover,
    navy: tokens.colors.navy,
    muted: tokens.colors.muted,
    line: tokens.colors.line,
    silver: tokens.colors.silver,
    'silver-deep': tokens.colors.silverDeep,
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
