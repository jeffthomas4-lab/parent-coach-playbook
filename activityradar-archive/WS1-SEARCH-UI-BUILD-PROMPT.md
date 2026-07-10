# WS-1 Build Prompt: ActivityRadar Discovery Search UI

*Hand this to the build agent as the session-start block. Rows D1–D6, K1–K3, N1–N2. Created 2026-06-20.*

---

You are building the public search-and-discovery surface for **ActivityRadar**, the discovery door of the SightSmash platform. The database and the read API are already live. Your job is the UI and the demand logging on top. Do not rebuild the data layer.

## Read first (stop when you have enough)

1. `Outputs/ActivityRadar/src/lib/db.ts` — THE read API you build against. Functions: `searchOrganizations`, `getOrganization`, `searchPrograms`, `searchSuggest`, `logSearchEvent`. Types: `Organization`, `Program`, `OrgSearchParams`, `Env`. Read it before writing anything.
2. `Outputs/ActivityRadar/migrations/0001_core_graph.sql` — the schema (organizations, programs, sessions, activity_categories). `migrations/0004_seed_categories.sql` — the category vocabulary slugs.
3. `Outputs/ActivityRadar/00-ARCHITECTURE.md` — the model and the one-database-two-doors decision. Includes the deploy block.
4. `Outputs/SightSmash/SIGHTSMASH-UNIFIED-BUILD-PLAN.md` Sections 3, 4, 9 — vocabulary, architecture, WS-1 scope.

## Stack facts you must respect

- Astro 5, `output: 'hybrid'`, Cloudflare adapter, Tailwind with `applyBaseStyles: false`.
- Access D1 in a page via `(Astro.locals as any).runtime.env.DB as D1Database`.
- Dynamic pages (search, results, org, program): `export const prerender = false`. SEO landing pages: `prerender = true` (static, built with `getStaticPaths`).
- The DB is live: **196,252 organizations, 1,701 programs.** Most orgs are unverified IRS stubs deliberately hidden from search (`record_status='active'` filter is already in `db.ts`). Do not "fix" that.
- Bindings (`wrangler.jsonc`): `DB` (D1), `PHOTOS` (R2), `SITE_URL`.
- ZIP-centroid data exists (`seed/0007_zip_centroids.sql`, `scripts/geocode_orgs_from_zip.sql`). Resolve a typed city or ZIP to lat/lng from that table. Do not call an external geocoder at request time.

## Design system (Navy v2, locked)

Navy `#0c273c` (text, dark bg), rust `#bb6033` (primary action), cream `#faf5f1` (light bg), bone `#e8e8e8` (borders), `#c72c12` (destructive). Flat: border-radius 0, no box-shadow, 48px minimum touch targets, uppercase labels. System font stack plus JetBrains Mono for mono. `tailwind.config.mjs` `theme.extend` is empty today: add these as tokens, plus a small `src/styles/global.css`. Voice: direct, no hype, no emojis, no exclamation marks.

## Build (name work by row ID)

- **D1 Layout and tokens.** `BaseLayout.astro`, header, footer, Navy v2 Tailwind tokens, `global.css`. Replace the placeholder `src/pages/index.astro`.
- **D2 Home search.** Location + activity + age search box. Autocomplete via `searchSuggest`. Submits to `/search`.
- **D3 Results.** Server-rendered from `searchOrganizations(db, params)`. Filters: category (activity_categories slug), age, radius (lat/lng + radiusMiles), price min/max, availableNow. Show `distance_miles` when a radius search ran. Honest empty state when a region is thin.
- **D4 Org profile.** `/org/[slug]` via `getOrganization`. Show the org, its programs, trust signals. A "Claim this listing" CTA (links to the claim flow; stub the target if it does not exist yet).
- **D5 Program detail.** `/program/[slug]`. Add a `getProgram(db, slug)` helper to `db.ts` only if one is missing; otherwise reuse. Show the program, a link to its parent org, the `registration_url` CTA, and price.
- **D6 Suggest endpoint.** A small JSON endpoint backing D2 autocomplete from `searchSuggest`.
- **K1–K3 SEO landing pages.** Prerendered `/[category]-[programtype]/[city]-[state]` (e.g. `/soccer-camps/tacoma-wa`), generated from the live data via `getStaticPaths`. schema.org `ItemList` markup. Start with the Tacoma and Puget Sound region.
- **N1 Demand logging.** Call `logSearchEvent` on every search. Match its keys exactly: `query`, `location_searched`, `latitude`, `longitude`, `radius_miles`, `age_searched`, `categories_searched`, `price_min`, `price_max`, `available_now`, `result_count`, `source: 'activityradar'`. This is the moat. Never skip it.
- **N2 Click capture.** Record `clicked_org_ids` when a parent clicks a result through to an org profile.

## Rules

1. Work in the ActivityRadar repo only. Do not touch the SightSmash app repo.
2. Use the exact vocabulary: Organization, Program, Session. Never call a Program a "listing" in code.
3. Do not fabricate data or seed rows. Build against what is in D1.
4. Do not rewrite `db.ts` beyond adding `getProgram` if it is missing.
5. Mobile-first. 48px targets. Build the empty state, not just the happy path.

## Verify before done (exit test)

- `npm run build` is clean.
- `npm run dev` (platformProxy on) renders the home page, runs a real search that returns Tacoma-area orgs, opens an org profile with its programs, and opens a program detail page.
- A search writes one row to `search_events` (confirm with a D1 query).
- One SEO landing page renders statically with schema.org markup.

## At the end

- Update `Outputs/SightSmash/PROJECT-STATE.md` (WS-1 status) and the ActivityRadar `README.md` phase line.
- Append the ActivityRadar deploy block from `00-ARCHITECTURE.md` / `BACKUP.md` (build, git add/commit, `wrangler pages deploy`, git push) as one paste-ready PowerShell block. Do not invent flags or project names; use the ones in those docs.

Start by reading `db.ts` and the `0001` schema, then build D1 first. It gates everything else.
