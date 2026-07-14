# Pages → Workers Migration Brief: parent-coach-desk

**Purpose of this file:** a scoping handoff for planning the migration that would let this site upgrade past Astro 5 and clear the last 8 waived `npm audit` findings. Written 2026-07-14 after a same-session upgrade attempt hit a hard platform blocker (not a code bug) partway through. Read this before starting the migration — it names the exact blocker, what's already been validated, and what's still unverified.

## Why this exists

`STANDARD-AUDIT.md` open item #13 waives 8 `npm audit` findings (2 low, 1 moderate, 5 high — the `astro` / `@astrojs/cloudflare` / `wrangler` / `esbuild` / `undici` / `ws` chain) because fixing them requires bumping `astro` 5.18 → 7.0.9 and `@astrojs/cloudflare` 12.6 → 14.1.3. Attempting that bump this session surfaced something bigger than a dependency upgrade.

## The actual blocker: Astro 6+ dropped Cloudflare Pages support

This site deploys via `npx wrangler pages deploy dist --project-name parent-coach-playbook` — a **Cloudflare Pages** project. Astro 6 (and therefore 7) rebuilt `@astrojs/cloudflare` on top of `@cloudflare/vite-plugin`, which only targets **Cloudflare Workers**. Pages is not supported at all.

Confirmed via [withastro/astro#16107](https://github.com/withastro/astro/issues/16107) — an open GitHub issue where an Astro core maintainer (`matthewp`) states directly:

> "Astro 6 doesn't support Pages, because the Cloudflare Vite plugin does not. Luckily it's simple to migrate to Workers." — links [Cloudflare's own Pages→Workers migration guide](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)

The concrete symptom: `npm run build` fails during the wrangler config validation step with:
```
The name 'ASSETS' is reserved in Pages projects. Please use a different name for your Assets binding.
```
Root cause per the issue's triage: `@astrojs/cloudflare`'s `cloudflareConfigCustomizer` auto-provisions an `ASSETS` binding unconditionally. Cloudflare Pages already injects that binding itself and wrangler rejects the duplicate declaration. There is no config flag to opt out — the adapter's Workers-only assumption is structural, not a missing setting.

**Bottom line: this is not a code migration you can do while staying on Pages. It's "move the site from Cloudflare Pages to Cloudflare Workers," and the Astro version bump is just the reason it's now forced.**

## What a Fable planning pass should scope

1. **Cloudflare resource change.** `parent-coach-playbook` is currently a Pages project. Workers deployment means either converting it or standing up a new Worker resource. Follow [Cloudflare's official Pages→Workers guide](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/) — it covers the supported conversion path.
2. **wrangler.jsonc rewrite.** Pages config (`pages_build_output_dir`-style) becomes Workers config (`main` entry point + a `[assets]` binding for the static output + routes). D1 (`DB`), R2 (`PHOTOS`), KV (`SESSION`) bindings should carry over structurally — same binding names, same resource IDs — but need re-verifying under the Workers config shape, not assumed.
3. **Custom domain re-attachment.** `parentcoachdesk.com` is currently attached to the Pages project. Workers uses a different custom-domain/route attachment mechanism. This is the step most likely to cause live downtime if rushed — plan a maintenance window and a rollback path (Pages project stays live and attached until the Worker is confirmed serving correctly).
4. **Deploy command + CI changes.** `About Me/Deployments.md`'s parentcoachdesk block (`npx wrangler pages deploy dist --project-name parent-coach-playbook --branch main`) becomes `npx wrangler deploy`. `.github/workflows/ci.yml` and `camps-sweep-cron.yml` reference Pages-specific assumptions worth re-checking.
5. **Cloudflare Access.** Admin routes sit behind Cloudflare Access policies scoped to the Pages project's domain/routes today. Confirm the Access policy still applies correctly to the Worker after cutover — this gates `/admin/*` and every `/api/admin/*` route.
6. **Content collections migration to the Content Layer API.** Astro 6 also removed legacy content-collections config (`type: 'content'` + `schema`, no `loader`) — this site's `src/content/config.ts` uses that legacy format across all 14 collections. **This part is already done and validated below** — reuse it, don't redo it.
7. **Downstream `.slug` / `.render()` fallout — NOT yet verified.** See the two open risk items below. This is real, unavoidable work; budget time for it.
8. **Two known pre-existing warnings that become hard errors in future Astro versions**, independent of this migration but worth fixing in the same pass since they'll need touching anyway:
   - `/camps/[slug].astro` and `/camps/[state]/index.astro` match the same SSR route shape (Astro warns today, hard-errors later — see `STANDARD-AUDIT.md` open item #12).
   - None others currently known; re-run `npm run build` after each step of the migration and treat every new warning as a future hard error.

## Already validated this session — reuse this

The Content Layer API migration (item 6 above) was completed and got through Astro's content sync cleanly (`[content] Synced content`, `[types] Generated`, zero schema errors) before the Pages/Workers blocker was hit downstream. This is a straight mechanical translation — same schemas, same validation rules, same field names, only the collection *definition* wrapper changed. It's safe to start the real migration from this file rather than re-deriving it.

Move this to `src/content.config.ts` (Astro 6+ requires the file at that path, not `src/content/config.ts`) and delete the old `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ... (all the SPORT_ENUM / AGE_ENUM / FUNDAMENTAL_ENUM / PROGRESSION_ENUM /
// faqField / editorialField constants are unchanged from src/content/config.ts —
// copy them over verbatim)

const articles = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/articles' }),
  schema: ({ image }) => z.object({ /* unchanged */ }),
});

// Repeat the same loader wrapper for every collection: guides, resources,
// coachingTips, seasonCalendars, body, pathways, recruiting, adaptive, rules,
// scripts, decisions, news, pillar. Pattern is identical for all 14 — only
// `base` changes to match each collection's directory name.
```

**Why the `**/[^_]*.md` pattern specifically:** it's Astro's own documented default for a straight legacy-to-loader conversion (matches every `.md` file, excludes underscore-prefixed files, no recursion surprises). Confirmed safe for this repo specifically because **every content collection here is a flat directory with zero nested subfolders** (verified this session: `find src/content/<each> -mindepth 2 -type f` returned 0 for all 14 collections).

**Also confirmed safe: entry IDs won't change.** Content Layer's `glob()` loader derives each entry's `id` from its filename (lowercased, extension stripped) unless a custom `generateId` is supplied. This repo has 35 files with an explicit `slug:` frontmatter override (legacy content collections' compatibility field) — **every single one was checked and every one exactly matches its own filename** (e.g. `guides/band.md` has `slug: "band"`). That means the default glob-loader `id` will produce the identical string value the old `slug` did, for every entry, in every collection. No URLs change. No custom `generateId` function is needed.

## Two open risk items — real work, not yet done or verified

1. **`entry.slug` → `entry.id` rename, ~51 files.** Content Layer collection entries expose `.id`, not `.slug` (the property name changes even though — per above — the string value doesn't). 51 files across this repo import from `astro:content` or reference collection entries; not all of them use `.slug`, but many do (`RelatedArticles.astro`, `ArticleLayout.astro`, `PillarLayout.astro`, every collection's `[slug].astro` / `index.astro` pair, the three RSS feed files, `sitemap-content.xml.ts`, `admin/preview/[collection]/[slug].astro`, `admin/editorial/index.astro`, and more). **The critical trap:** this codebase also has plenty of *unrelated* `.slug` properties on non-collection objects — `Camp.slug` (D1 camps data), `SPORTS[].slug`, `TOPICS[].slug`, `PILLARS[].slug`, `TEAM_PARENT_TOPICS[].slug` — none of which should be touched. A blind find-and-replace across the repo **will** break the camps directory. This has to be done file-by-file, checking whether each `.slug` access is on a `CollectionEntry` (rename to `.id`) or something else (leave alone). Full file list: run `grep -rl "astro:content" src/` to regenerate it.
2. **`entry.render()` may need to become `render(entry)`.** 18 files call `.render()` directly on a collection entry (`adaptive/[slug].astro`, `admin/preview/[collection]/[slug].astro`, `body/[slug].astro`, `coaching-tips/[slug].astro`, `decisions/[slug].astro`, `drive-home/[slug].astro`, `drive-there/[slug].astro`, `game/[slug].astro`, `guides/[slug].astro`, `news/[slug].astro`, `pathways/[sport].astro`, `pillar/[slug].astro`, `recruiting/[slug].astro`, `rules/[sport].astro`, `scripts/[slug].astro`, `season-calendar/[slug].astro`, `team-parent/[slug].astro`, `what-to-buy/[slug].astro`). Astro's Content Layer docs recommend the `render()` function imported from `astro:content` instead of the entry method. **This was never actually verified against a real build this session** — the build failed on the Workers/Pages config error before any SSR route was ever invoked (most of these routes are `prerender: false`, so they don't execute during a static build at all; they'd only surface a `.render()` incompatibility at request time, in production, per-route). Test every one of these 18 routes live (not just `npm run build` succeeding) before calling this done.

## Suggested order of operations for the actual migration

1. Do the wrangler.jsonc + deploy command + Cloudflare resource conversion FIRST, on a throwaway/staging Cloudflare Worker, before touching app code — confirm a stock Astro 7 Workers app deploys and serves from this repo's D1/R2/KV bindings correctly.
2. Then land the content.config.ts migration (already drafted above).
3. Then work through the 51-file `.slug`/`.id` audit and the 18-file `.render()` check, one collection at a time (e.g. finish `articles` end-to-end — content.config.ts, every consuming page, a live request against a preview deploy — before moving to `guides`).
4. Re-run `npm run build`, `npm run check`, and `npx vitest run` after every collection, not just at the end.
5. Only cut the live custom domain over once every collection's routes have been hit live against a preview Worker deploy.
6. Re-run `npm audit` — this is the finish line that started all of this. Expect 0 vulnerabilities once `astro`/`@astrojs/cloudflare`/`wrangler` land on current versions.

## Effort/risk read

This is a multi-session project, not a single sitting. The content-collections piece (already drafted) is genuinely mechanical and low-risk. The Pages→Workers platform cutover and the 51-file slug/render audit are the real work, and the platform cutover specifically carries live-downtime risk if the custom domain is moved before the Worker is proven. Recommend treating this as its own tracked initiative with its own session(s), not a follow-on to a security-audit session.
