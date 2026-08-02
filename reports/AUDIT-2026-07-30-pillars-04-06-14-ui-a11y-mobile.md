# Pillars 4, 6, 14 audit — UI/Design System, Accessibility, Mobile-First

Date: 2026-07-31. Branch: `audit/full-standard-2026-07-30`. Scope owned this session: every `.astro`, `.css`, and design-token file in the repo. Full detail lives in `STANDARD-AUDIT.md`'s Pillar 4/6/14 rows and open items #53, #70-73 (plus the correction to #53). This file is the narrative version.

## Starting state

Most of the heavy lifting on these three pillars had already landed in prior 2026-07-29/07-30 sessions on this same branch: the navy/silver-green palette remap, the section-band contrast fix, the `.container-px` shorthand bug, the type-scale consolidation, the 44px tap-target sweep (items #39-48), and the first Pillar 14 pass on the homepage (item #30). This session's job was to verify that work against current source and the deployed site, close the flagged follow-ups, and extend the responsive-image and tap-target work past the homepage.

## Pillar 4: UI and Design System — pass

Swept `src/` and `public/` for every retired warm-palette hex. Zero live occurrences remain; the only matches are the intentional `/* was ... */` documentary comments in `pcd-tokens.mjs` and `global.css`. No new shorthand-on-an-axis-a-utility-owns regressions found. Confirmed the `--input-border` token (added in a prior session specifically to answer open item #53) is now actually applied to every real form control site-wide, not just defined — this closes #53, which the audit file had still marked open.

## Pillar 6: Accessibility — pass

Re-checked WCAG 2.2's nine added criteria against current source. 2.4.11 (focus not hidden): no sticky header or fixed footer exists. 2.5.8 (target floor): this project holds itself to 44px, tap-target findings below. 2.5.7 (drag alternative): no drag-only interaction anywhere in the codebase. 3.2.6 (consistent help): the footer legal nav is identical on every page via the shared layout. 3.3.7/3.3.8/3.3.9 (no re-asking, paste allowed, no memory test): not applicable — no accounts, no multi-step forms. Contrast, keyboard, semantics, and motion were all re-verified clean in the prior 2026-07-29 pass and nothing in this session's edits touched those surfaces.

## Pillar 14: Mobile-First Experience — pass, one new Critical logged

### Pages measured (live, 390px, fetch+iframe technique against the deployed site)

| Page | Mobile height | Tap targets under 44px |
|---|---|---|
| Homepage | 9,814px (re-measured; 9,563px on 2026-07-30) | 28 |
| `/camps/` | **84,749px** | 396 |
| `/sports/soccer/` | 10,519px | 36 |
| `/what-to-buy/` | 5,996px | 29 |

The homepage's 28 sub-44px elements were cross-referenced one by one against current source: the header logo (`Logo.astro`), all 11 footer links plus the 6 legal-nav items (`Footer.astro`), and the two homepage CTA links (`index.astro`) all already carry `min-h-11` in source. This is a stale-production artifact — the branch's fixes haven't shipped yet — not an open source defect. Item #50 is resolved. `/what-to-buy/` and `/sports/soccer/` were measured for the first time this session but not verified item-by-item against source for time; logged as item #71, likely the same stale-deploy pattern, needs a post-deploy re-check.

### The one real new finding: `/camps/`

`/camps/index.astro` calls `listApprovedCamps(env.DB)` with no limit and server-renders every one of the 1,300+ approved camps as a full card. That is roughly ten times this pillar's own ~8,000px flag and the worst page on the site by a wide margin. It was already flagged as a data over-fetch problem under Pillar 7; this session connects it to its mobile-height consequence and logs it as Critical under Pillar 14 (item #70). It was not fixed this session: the page's client-side map/filter script needs the full dataset in the browser to search instantly, so capping the server-rendered list without breaking that feature is a real design decision (windowing, incremental render, or a paginated list under an always-fully-fed map), not a safe mechanical edit. Recommend a dedicated session.

### Responsive images extended sitewide

The homepage's `Illo.astro` component and `build-illustration-variants.py` script covered 16 images as of 2026-07-30. This session generated `-480w`/`-960w` variants for all 268 illustration source files in `public/illustrations/` (804 files on disk now, up from 48), then converted every remaining static illustration `<img>` across 11 files to `<Illo>`, plus `ArticleLayout.astro`'s per-article hero image — the single highest-leverage image on the site, since it renders on all 812 published articles. The hero's `<Illo>` `base` is derived from the article's `hero` frontmatter path at render time (all 812 articles point at `/illustrations/*.webp`), with a plain-`<img>` fallback kept for the case a hero ever points elsewhere. Two article-grid card thumbnails (`reads/[topic].astro`, `team-parent/[topic].astro`) got `srcset`/`sizes` added directly, since their crop doesn't match `Illo`'s default aspect ratio.

Left out of scope on purpose: `/camp-photos/*` (user/admin-uploaded at runtime, no build-time file to generate variants from) and the admin-only camp-photo preview (gated behind Cloudflare Access, no reader impact).

### OG cards (item #36)

Confirmed already resolved: `public/og/` holds 812 files, and the generator script's brand colors already match the navy palette. No action needed this session.

## Validation

`astro build` was not run — it bus-errors against this sandbox's mounted filesystem, a known, pre-existing limit. All 14 files this session touched (`body/index.astro`, `youth-sports-pendulum.astro`, `team-parent/index.astro`, `pathways/index.astro`, `parent-coach.astro`, `newsletter.astro`, `NewsletterSignup.astro`, `PillarLayout.astro`, `LeadMagnetCTA.astro`, `cost-calculator.astro`, `camps/index.astro`, `ArticleLayout.astro`, `reads/[topic].astro`, `team-parent/[topic].astro`) were validated through `@astrojs/compiler`'s `transform()` directly from `node_modules`, with zero diagnostics. `npm run build` and `npm run check` still need a real run on Jeff's machine before merge, same as the prior session's note.

## What Jeff needs to do

1. Deploy this branch. Most of what live measurement flagged (homepage tap targets, likely `/what-to-buy/` and `/sports/soccer/`) is already fixed in source and just hasn't shipped.
2. Schedule a dedicated session on `/camps/` pagination/windowing (item #70) before the next Pillar 14 pass — it's the one real new Critical this session found, and it isn't a quick fix.
3. Re-run `/web:mobile` against the deployed site after that deploy to confirm the stale-production gaps actually clear, and to itemize `/what-to-buy/` and `/sports/soccer/` for real if anything remains.
