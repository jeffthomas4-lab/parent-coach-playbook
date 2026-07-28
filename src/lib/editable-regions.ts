// Inline editor: the registered-region manifest.
//
// This file is the allowlist. A region key that does not appear here cannot be
// read from the overlay and cannot be written to it, no matter what the client
// sends. That is what keeps /admin/api/content/[key] from being an arbitrary
// KV write endpoint (Website Build Standard, Pillar 1 item 2).
//
// SCOPE DECISION (Jeff, 2026-07-28): meta titles and descriptions are NOT
// editable inline. The SEO blast radius of a bad meta tag with no review is
// larger than the convenience is worth. They stay in git. Do not add a
// region with kind 'meta' — there is no such kind on purpose.
//
// Article, guide, pillar, news and coachingTips BODIES are also out of scope.
// Those keep the markdown-in-git workflow with Penny's review gate and their
// factCheckGoodThrough stamps. This manifest covers site chrome and marketing
// copy only.

/** What a region is allowed to contain. */
export type RegionKind =
  /** Plain text. No markup survives the sanitizer. */
  | 'text'
  /** Plain text plus a tight inline subset: strong, em, a[href]. */
  | 'richInline';

export interface EditableRegion {
  /** Stable dotted key. Also the KV key suffix. Never reuse a retired key. */
  key: string;
  /** Human label shown in the editor and in the receipt log. */
  label: string;
  kind: RegionKind;
  /** Hard cap on stored length, in characters, after sanitizing. */
  maxLength: number;
  /**
   * Where this region appears. Used by the editor UI to group regions and by
   * the route-coverage test that proves every region's page is Worker-routed.
   */
  route: string;
}

/**
 * Every inline-editable region on parentcoachdesk.com.
 *
 * Adding a row here is the only way to make something editable. Removing a row
 * makes the region fall back to its in-repo string immediately; the stored KV
 * value is ignored (and swept by the reconciliation job), not served.
 */
// SCOPE, v1: homepage only.
//
// A region is useless unless its page is in `assets.run_worker_first`, because
// otherwise the prerendered asset is served straight from the edge, the Worker
// never runs, and the swap never happens. Only "/" is Worker-routed today, so
// only "/" carries regions. There is deliberately no '*' route in this list:
// a nav or footer region would look editable and silently do nothing on the
// 1,851 pages that are pure static assets.
//
// To make another page editable: add its path to OVERLAY_ROUTES in
// src/lib/overlay-rewriter.ts AND to run_worker_first in both wrangler configs,
// then add its regions here. tests/overlay-route-coverage.test.ts enforces the
// pairing.
export const EDITABLE_REGIONS: readonly EditableRegion[] = [
  // --- Homepage hero ---
  { key: 'home.hero.eyebrow',        label: 'Hero eyebrow line',          kind: 'text',       maxLength: 60,   route: '/' },
  { key: 'home.hero.headline',       label: 'Hero headline',              kind: 'text',       maxLength: 80,   route: '/' },
  { key: 'home.hero.headlineAccent', label: 'Hero headline (accent half)', kind: 'text',      maxLength: 80,   route: '/' },
  { key: 'home.hero.subhead',        label: 'Hero subhead',               kind: 'richInline', maxLength: 320,  route: '/' },
  { key: 'home.hero.ctaPrimary',     label: 'Hero primary button',        kind: 'text',       maxLength: 30,   route: '/' },
  { key: 'home.hero.ctaSecondary',   label: 'Hero secondary button',      kind: 'text',       maxLength: 30,   route: '/' },

  // --- Homepage section labels ---
  { key: 'home.latest.eyebrow',      label: '"Latest" rail eyebrow',      kind: 'text',       maxLength: 40,   route: '/' },
  { key: 'home.season.eyebrow',      label: '"This Season" eyebrow',      kind: 'text',       maxLength: 40,   route: '/' },
  { key: 'home.fresh.eyebrow',       label: '"Fresh at the Desk" eyebrow', kind: 'text',      maxLength: 40,   route: '/' },
] as const;

const REGION_BY_KEY = new Map(EDITABLE_REGIONS.map((r) => [r.key, r]));

/** Look up a region. Returns undefined for any unregistered key. */
export function getRegion(key: string): EditableRegion | undefined {
  return REGION_BY_KEY.get(key);
}

/** True only for keys present in the manifest. The allowlist gate. */
export function isRegisteredRegion(key: string): boolean {
  return REGION_BY_KEY.has(key);
}

/** Every registered key. Used by the read path to build one bulk KV fetch. */
export function allRegionKeys(): string[] {
  return EDITABLE_REGIONS.map((r) => r.key);
}

/** Regions that render on a given pathname, including the global '*' set. */
export function regionsForRoute(pathname: string): EditableRegion[] {
  return EDITABLE_REGIONS.filter((r) => r.route === '*' || r.route === pathname);
}
