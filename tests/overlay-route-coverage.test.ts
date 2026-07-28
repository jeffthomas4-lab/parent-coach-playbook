// Inline editor: route coverage.
//
// The failure this catches is silent and nasty. If a route is in OVERLAY_ROUTES
// but NOT in assets.run_worker_first, Cloudflare serves the prerendered asset
// straight from the edge, the Worker never runs, HTMLRewriter never fires, and
// the page quietly shows its in-repo fallback forever. Jeff edits the headline,
// sees "Saved. Live now.", and the live site never changes.
//
// Nothing at runtime would report that. So it is a build-time assertion.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { OVERLAY_ROUTES, isOverlayRoute } from '../src/lib/overlay-rewriter';
import { EDITABLE_REGIONS } from '../src/lib/editable-regions';

const ROOT = resolve(__dirname, '..');

function readJsonc(relPath: string): any {
  const raw = readFileSync(resolve(ROOT, relPath), 'utf8');
  return JSON.parse(
    raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1'),
  );
}

const CONFIGS = ['wrangler.jsonc', 'wrangler.production.jsonc'] as const;

describe('overlay routes reach the Worker', () => {
  for (const file of CONFIGS) {
    it(`${file}: every OVERLAY_ROUTE is in assets.run_worker_first`, () => {
      const runFirst: string[] = readJsonc(file).assets?.run_worker_first ?? [];
      for (const route of OVERLAY_ROUTES) {
        expect(
          runFirst,
          `${route} carries editable regions but is not in run_worker_first in ${file}, so the overlay would never apply and edits would silently not appear.`,
        ).toContain(route);
      }
    });
  }

  it('normalizes trailing slashes so "/" and "" both match', () => {
    expect(isOverlayRoute('/')).toBe(true);
    expect(isOverlayRoute('')).toBe(true);
  });

  it('does not claim routes it has not registered', () => {
    expect(isOverlayRoute('/articles/some-post')).toBe(false);
    expect(isOverlayRoute('/camps')).toBe(false);
  });
});

describe('editable-region manifest', () => {
  it('has no duplicate keys', () => {
    const keys = EDITABLE_REGIONS.map((r) => r.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('gives every region a positive length cap', () => {
    for (const r of EDITABLE_REGIONS) {
      expect(r.maxLength, `${r.key} needs a maxLength`).toBeGreaterThan(0);
    }
  });

  it('keeps meta titles and descriptions OUT of the overlay', () => {
    // Jeff's call, 2026-07-28: the SEO blast radius of an unreviewed meta tag
    // is larger than the convenience. These stay in git.
    for (const r of EDITABLE_REGIONS) {
      expect(
        /(^|\.)(meta|title|description|canonical|og|twitter)(\.|$)/i.test(r.key),
        `${r.key} looks like an SEO meta field. Those are deliberately not inline-editable.`,
      ).toBe(false);
    }
  });

  it('keeps article and guide bodies OUT of the overlay', () => {
    // Those keep markdown-in-git, Penny's review gate, and their fact-check stamps.
    for (const r of EDITABLE_REGIONS) {
      expect(
        /(^|\.)(article|guide|pillar|news|coachingTip|body|content)(\.|$)/i.test(r.key),
        `${r.key} looks like long-form content. That lane stays in git.`,
      ).toBe(false);
    }
  });

  it('only registers routes the rewriter actually processes', () => {
    for (const r of EDITABLE_REGIONS) {
      if (r.route === '*') continue;
      expect(
        isOverlayRoute(r.route),
        `Region ${r.key} targets ${r.route}, which is not in OVERLAY_ROUTES.`,
      ).toBe(true);
    }
  });
});
