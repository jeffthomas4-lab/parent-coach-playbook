// Shared design-token contract (item 123 / ADR-049), vendored from the
// SightSmash monorepo (`app/packages/design-tokens/types.d.ts`).
//
// This describes the SHAPE PCD and SightSmash both fill in. It is not a
// promise the two products share color values — they don't, on purpose
// (SightSmash: flat navy tool-brand; PCD: warm editorial, ink/paper/rust/
// turf/trophy/bone/rose with Fraunces/Mulish). What's shared is the
// vocabulary, so tooling written against `DesignTokens` works for either.
//
// PCD is a separate git repo from SightSmash with no shared private npm
// registry set up, so this is a plain copy, not a package dependency. If the
// shape changes in the SightSmash package, copy the change here by hand —
// there is no automated sync today. See ADR-049 in the SightSmash repo for
// the full reasoning.

export interface DesignTokenColors {
  ink: string;
  inkSoft: string;
  paper: string;
  paperWarm: string;
  rust: string;
  bone: string;
  turf: string;
  trophy: string;
  rose: string;
  roseBg: string;
  error?: string;
}

export interface DesignTokenFonts {
  display: string;
  body: string;
  mono: string;
}

export interface DesignTokenLayout {
  /** Optional: PCD uses pill/rounded shapes per-component, not one base radius. */
  radius?: string;
  maxWidth: string;
  prose: string;
}

export interface DesignTokens {
  name: string;
  colors: DesignTokenColors;
  fonts: DesignTokenFonts;
  layout: DesignTokenLayout;
  extensions?: Record<string, unknown>;
}
