# Audit: Pillars 10, 11, 12 (SEO, Emotional Design, Sales Tax) — parentcoachdesk.com

**Date run:** 2026-07-31 (dated 2026-07-30 per the branch's session-batch convention)
**Branch:** `audit/full-standard-2026-07-30`
**Scope:** SEO and Discoverability (Pillar 10), Emotional Design (Pillar 11), Sales Tax and Nexus (Pillar 12).

---

## Pillar 10: SEO and Discoverability

### Method

Wrote `scripts/seo-title-desc-audit.mjs`, which parses the frontmatter of every file across all 14 content collections (1,862 files) and reproduces the exact title/description computation each page template performs — verified line-by-line against the `.astro` source for every collection (`ArticleLayout.astro` and 13 `[slug].astro`/`[sport].astro` route files), not guessed. It applies the real BaseLayout suffix (` | Parent Coach Desk`, 21 characters) to every computed title before checking the 60-character budget.

### Findings

**Title length: 1,005 of 1,862 pages (54%) exceed 60 characters** in their final `<title>` tag. Worst collections: `body` (167/177, 94%), `guides`/`what-to-buy` (37/37, 100%), `news` (22/22, 100%), `pillar` (17/17, 100%), `adaptive` (18/18, 100%). Root cause is structural, not a content-authoring mistake: every page's title gets a 21-character ` | Parent Coach Desk` suffix appended in `BaseLayout.astro` line 31, and several collections (`body`, `resources`, `pathways`, `recruiting`, `adaptive`, `rules`, `decisions`) have no `seoTitle` override field at all — they render the raw editorial `title`, which was written for readability, not a 39-character SERP budget. A handful of raw titles run 90-110+ characters before the suffix even applies (e.g. `body/adhd-athlete.md` renders a 96-character final title), so shortening the suffix alone would not close the gap for those.

**Description length: 263 of 1,862 pages (14%) exceed 160 characters.** Zero pages have a missing description (every collection's description field traces back to a Zod-required field, so the build itself would fail before shipping a truly empty one). Worst: `news` (22/22, 100% — this collection's `summary` field has a 400-char max with no page-level trim), `seasonCalendars` (27/28, 96%), `pathways` (21/26, 81%).

**Duplicate `<title>` collisions: 55 groups.** 53 are two `coachingTips` drills that share a name across baseball/softball (e.g. "Backhand Pickup" for both `baseball-backhand-pickup.md` and `softball-backhand-pickup.md`) — cosmetically identical titles, genuinely different content, low real-world SEO cost since these are low-competition long-tail pages. 2 are real duplicate/near-duplicate articles under two separate filenames (`camp-counselor-the-kid-hates.md` / `the-camp-counselor-your-kid-hates.md`, `packing-for-a-long-tournament-weekend.md` / `packing-for-tournament-weekend.md`) — flagged for Jeff, not merged, since consolidating two live articles (redirects, canonical choice, which URL keeps its indexing signal) is an editorial call this session should not make unilaterally.

**Recommendation, not applied:** shortening the BaseLayout title suffix (e.g. ` | PCD`, 6 characters instead of 21) would reclaim 15 characters on every page and close a real share of the `scripts`/`recruiting`/`decisions`-class overflows, which run mostly single digits to ~20 characters over budget. It would not fix the severe collections (`body`, `adaptive`, `news`) where the raw title itself is already 90-130 characters. This is a brand-visible, sitewide string change and this session left it as a recommendation rather than an auto-fix, consistent with how this file treats other brand-identity calls (see items #34/#37) as Jeff's to make.

### Fixed this session

**Sitemap enumeration drift (closes open item #32 for real).** `src/pages/sitemap-content.xml.ts` previously enumerated all 14 collections by hand with 14 separate `getCollection()` calls — exactly the pattern that let `pillar` silently go missing from the sitemap for weeks (item #32, fixed 2026-07-28, already deployed and reverified live this session: `curl https://parentcoachdesk.com/sitemap-content.xml` shows all 17 `/pillar/` URLs). Rewrote the file so every collection's URL builder lives in one `COLLECTION_URL_BUILDERS` map, and `GET()` calls `assertNoCollectionDrift()` first, which diffs `Object.keys(COLLECTION_URL_BUILDERS)` against `Object.keys(collections)` imported directly from `content.config.ts` — the real source of truth for what collections exist. If a future session adds a 15th collection to `content.config.ts` and forgets to wire its URL shape into the sitemap, the route now throws instead of silently shipping an invisible collection. Verified: no TypeScript syntax diagnostics (`ts.transpileModule`, since `astro build`/`esbuild` both crash in this sandbox — see the repo's other 2026-07 session notes on the same sandbox limitation).

### Verified live (not just in source)

- `www.parentcoachdesk.com` → 301 → bare domain. Confirmed with `curl -I`.
- `robots.txt` (200) correctly `Disallow`s `/go/`, `/admin/`, `/api/` for every named crawler and references `Sitemap: https://parentcoachdesk.com/sitemap.xml`.
- `sitemap.xml` (200, sitemap index) → `sitemap-content.xml` (200) → `sitemap-camps.xml` (200). All three resolve.
- The previously-404ing camp page named in `ORGANIC-SEARCH-AUDIT.md` (`/camps/soccer-camp-full-day-at-sera-sports-complex/`) now returns 301, confirming the expired-camp redirect fix (2026-07-12) is live in production, not just in source.
- An unknown/fabricated camp slug returns a real 404 (not a soft 404).
- A live pillar page (`/pillar/ultimate-parent-guide-baseball/`) returns 200, with a self-referencing canonical and a real description — confirms item #32's fix is genuinely deployed, this session's sitemap rewrite is a drift-proofing hardening pass on an already-working state, not a re-fix of a currently-broken one.

### Event JSON-LD (camps) — honesty check

Read `src/lib/camp-event-schema.ts` in full. `buildCampEventSchema()` returns `null` unless the camp has a real name, valid ISO start/end dates with `end >= start`, and a complete address (street, city, 2-letter state, valid ZIP) — a camp missing any of these gets no Event markup rather than a partial/fabricated one. No `organizer` node is emitted (a deliberate omission per the source comment, since the site cannot vouch for organizer identity), no fake `AggregateRating`, no invented `offers` beyond what's genuinely known. This is honest structured data and needs no fix.

### OG images

`BaseLayout.astro` emits `og:title`, `og:description`, `og:url`, `og:image` (resolved to an absolute URL) on every page — universal, no gaps. `ArticleLayout.astro` gives all 812 articles a unique, slug-keyed `/og/{slug}.jpg` card (confirmed 812 files on disk per open item #72, already closed). **Every other collection — guides, resources, coachingTips, seasonCalendars, body, pathways, recruiting, adaptive, rules, scripts, decisions, news, pillar (roughly 1,050 pages) — has no `ogImage` prop wired and falls back to the single sitewide `/og-default.jpg`.** The requirement ("a real og:image at 1200x630" on every shareable page) is technically met — the fallback file exists, resolves 200, and is a real image, not a broken path — but 1,050 pages share one generic card. This is a real, if lower-severity, finding logged below, not auto-fixed (generating 1,050 new per-page cards from a template is a real build task, `scripts/build-og-images.py` already exists and could plausibly be extended, but that's a next-session scope call, not a meta-tag fix).

### GSC and Core Web Vitals — human/dashboard steps, not re-derived

This session has no GSC or Lighthouse access. `ORGANIC-SEARCH-AUDIT.md` (2026-07-12, the last real GSC pull) and `STANDARD-AUDIT.md` open item #10 (RESOLVED) already document: property registered, both sitemaps submitted and reading Success, no manual actions, no query rows unlocked yet (traffic too thin). Nothing in this session contradicts that. Core Web Vitals: no field data exists (traffic too thin, per the same audit); a lab Lighthouse run against the live deployed site is still an open human/CI step (tracked as open item #9, unchanged by this session).

---

## Pillar 11: Emotional Design

See `EMOTIONAL-DESIGN-AUDIT.md` at the project root for the full journey maps, per-feature scores, wow moments, and ranked change list. Summary: **scored, no launch-blocking fail.** No persona documentation exists for this site (logged as finding zero); four personas were constructed from the site's own stated reader (`SITE.description`, the four content phases, the team-parent resource categories, the camp-claim flow's stated audience). Strongest workflow: the scripts "Pin this" save block (9/10) — genuine tension relief built into the content schema itself, not decoration. Weakest: camp submit/claim completion (4/10) — an honest, well-framed form that ends in a flat status line with no artifact or next action, the textbook "completed step, no next action" fail this pillar names explicitly. Full ranked change list and the "why users will love this" section are in the standalone file.

---

## Pillar 12: Sales Tax and Nexus Compliance

**Waived — this site takes no money today.** Checked for a live checkout: no `stripe` package dependency in `package.json`, no `Stripe`/checkout code anywhere in `src/`, and the one live reference to Stripe in the whole codebase is a comment in `src/pages/api/camps/[slug]/claim.ts` describing a future manual step ("Admin verifies ownership, sends payment link (Stripe / invoice), then marks claim paid") — not a built, automated, cross-state checkout. `BUSINESS_PLAN_24MO.md`'s four revenue lines are Amazon/affiliate commission (paid to PCD, not by a PCD customer), display advertising (ad network pays PCD), camp sponsorship/claim listings (Year 1-2, manually invoiced per the claim-flow comment above, not an in-site checkout), and white-label gear (Year 3, not built). None of these is PCD running a checkout that collects money from a customer across state lines today. `Outputs/Field and Forge/parent-coach-desk/STANDARD-AUDIT.md`'s existing Terms & Legal row (Pillar 5) already states the same conclusion independently ("No payment taken anywhere on the site... so refund/billing terms are correctly absent").

**Trigger condition, named per this pillar's own rule:** the moment camp sponsorship or claim-listing fees move from manual invoicing to an automated in-site Stripe checkout, or Year 3's white-label gear line ships with a real storefront, this pillar goes live and `NEXUS-MAP.md` needs to be built against real Stripe customer-by-state data at that point, not before. No `NEXUS-MAP.md` was written this session, per the pillar's own instruction not to manufacture findings on a site with no checkout.

---

## What this session did NOT do

- Did not run `astro build`, `npm run check`, or a live Lighthouse pass — sandbox limitation carried over from every other 2026-07 session on this repo (`astro build` and `esbuild` both crash in this sandbox). All `.astro` edits were none this session (only `.ts`), so `@astrojs/compiler` validation wasn't the applicable check; the one `.ts` change was validated via `ts.transpileModule` (zero syntax diagnostics) instead.
- Did not merge or redirect the two genuine duplicate-content article pairs found by the title-collision check — flagged for Jeff, not merged.
- Did not regenerate OG images for the ~1,050 pages sharing `og-default.jpg` — flagged as a finding with a suggested next step (extend `scripts/build-og-images.py`), not attempted blind.
- Did not shorten the sitewide title suffix — flagged as the highest-leverage recommendation with real trade-offs named, left for Jeff's call since it's a brand-visible sitewide string.
- Did not write a PCD `qa/personas.md` — recommended it, since the emotional-design personas here were reconstructed from indirect evidence rather than real reader research.
