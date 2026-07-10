# ActivityRadar: Architecture & Build Plan

**Owner: Jeff Thomas. Started: June 14, 2026.**
**Status: foundation built. Schema, migration, read layer, and scaffold done. No public search UI yet.**

This is the source of truth for how ActivityRadar gets built. It pins the database model, the relationship to parentcoachdesk.com, and the build phases before any code gets written.

---

## The decision in one line

ActivityRadar is the main activity database. parentcoachdesk.com/camps becomes a filtered view of it. One database, two front doors.

Your read is right. Right now the camps directory lives inside parent-coach-playbook as a flat `camps` table. That was the correct call for a camp directory shipped fast. It is the wrong shape to carry forward as the company's activity asset. This doc explains why and what replaces it.

---

## Why we do not just copy parentcoachdesk

The current `camps` table is one flat row per camp or league. The org name, the address, the dates, the price, and the contact all live on the same row. A `program_type` column discriminates camp from league. There are about 1,308 records in production today.

That model breaks the moment an organization runs more than one thing.

Take a real case. The Tacoma Boys & Girls Club runs a summer soccer camp, a fall flag-football league, and year-round open-gym classes. In the flat model that is three unrelated rows. Nothing ties them to one organization. There is no single page for the org. A parent who trusts the club cannot see everything it offers. The same address, phone, and trust signals get duplicated three times and can drift out of sync.

The Activity Platform OS spec (chapter 07-02) already calls for the right model, and it is not the flat table. It is a normalized graph:

- **organizations** — one row per entity that offers activities. The thing a parent decides to trust.
- **programs** — one row per offering an org runs. A camp, a league, a class series, a clinic. Linked to one organization.
- **sessions** — one row per occurrence of a program. The specific dates and times. Linked to one program.
- **trust_signals** — one row per signal per org. Years operating, accreditation, reviews, claimed status, insurance on file.
- **search_events** — one row per parent search. The demand intelligence feed.

This is the difference between a list of camps and a map of who runs what, where, for whom. The second one is the asset. It is worth more, it powers org profile pages, and it lets a competitor's two-year head start actually mean something.

So the rebuild is not a reskin of the camps table. It is a new org-centric schema, with the existing 1,308 camp rows migrated in as `programs` under deduplicated `organizations`.

---

## What "filtered view" means concretely

parentcoachdesk.com/camps does not get its own copy of the data. It reads the same database and filters.

The camps directory becomes a query: programs where `program_type = 'camp'`, surfaced in Parent Coach Desk's editorial wrapper, alongside the articles a parent already came for. The league pages are the same query with `program_type = 'league'`.

ActivityRadar reads the whole graph with no `program_type` filter and presents it as structured search: filter by age, location, activity type, schedule, price. Org profile pages. Program detail pages. City and category landing pages for SEO.

Same database. Parent Coach Desk is the editorial, parent-facing door. ActivityRadar is the structured search-and-discovery door. A change to an org's record shows up on both at once.

---

## What carries forward from the camps build

Plenty. The camps work was not wasted, it just gets re-homed under a better schema.

- The 1,308 camp and league records. They migrate in as programs.
- The claim-listing flow, reviews, featured listings, confidence scoring, source-domain tracking, URL health checks, and the awaiting-review queue. These are real and they map cleanly onto the new model. Most attach to the organization instead of the flat row.
- The geocoding cache and the radius search (haversine). Reusable as is.
- The submitter trust tiers and auto-approve logic.
- The Astro + Cloudflare Pages + D1 + R2 stack and the deploy norm.

What changes is the spine: organizations and sessions become first-class, programs hang off organizations, and trust signals stop being duplicated per row.

---

## Migration result (live, June 14, 2026)

The seed is loaded in the shared `activity-radar` D1: **910 organizations, 1,701 programs, 9 trust signals.**

The export held 1,701 approved camp rows (not the ~1,308 estimated). The dedup policy: a registrable website domain identifies an organization, EXCEPT for national camp hosts and registration platforms where one domain fronts many geographically distinct camps. Those are blocklisted and dedup by name+city+state into distinct local orgs. US Sports Camps alone was 1,443 of the 1,701 rows; left merged it would have been one org with 1,443 programs, which is wrong for location search. With the split, 1,567 camps on host/platform domains became distinct local orgs, and 19 real org domains (Mountaineers, YMCA Pierce-Kitsap, Point Defiance Zoo, Metro Parks Tacoma, and others) merged correctly.

The migrated camp data is seed data, not a schema migration. It lives at `seed/0005_seed_from_camps.sql` and is applied with `wrangler d1 execute --file`, never `migrations apply`, so the migration runner never re-runs it.

## National org backbone (live, June 14, 2026)

The shared D1 now holds **196,252 organizations**: the 910 camp-derived orgs plus **195,342 youth-activity nonprofits** loaded from the IRS Exempt Organizations Business Master File (migration 0006 + `scripts/ingest_irs_bmf.py`). Kept NTEE codes: N (recreation/sports), O (youth development), and the arts-education subset of A. Each is keyed by name+city+state (deduped against existing orgs via INSERT OR IGNORE), carries its EIN and `source_dataset='irs_eo_bmf'`, and is loaded as an unverified stub: `record_source='import'`, `record_status='unverified'`, no programs, no lat/lng. Stubs are hidden from parent search (which filters to active orgs) until a discovery pass adds programs and promotes them.

Next passes (not done): geocode the stubs (ZIP centroids or a geocoder), program discovery per org website (OS 04-07), optional national YMCA / Boys & Girls Club rosters, then phase 4 search UI.

---

## Decisions made (June 14, 2026)

The three forks are settled.

1. **Database: new shared D1.** A fresh D1 named `activity-radar` holds the org-centric schema. The 1,308 camp rows migrate in. Both ActivityRadar and parent-coach-playbook bind it by `database_id`. Neither site owns the data.
2. **Stack: match Parent Coach Desk.** Astro (hybrid) + Cloudflare Pages + D1 + R2. One deploy norm, one auth system, both sites bind the same D1.
3. **Scope this session: foundation only.** Schema, migration script, shared read layer, and repo scaffold. No public search UI.

---

## What got built this session

The repo lives in this folder alongside this doc.

- **Schema** (`migrations/0001`–`0004`). organizations, programs, sessions, activity_categories, trust_signals, accreditations, search_events, plus the carried-forward operational tables (submitters, org_claims, reviews, featured_listings, geocoded_addresses, domain_quality). Field names follow the F&F Entity Dictionary (entities 19–22): `confidence_score` and `last_verified_at` are canonical; OS platform fields (`record_source`, `record_status`, `is_claimed`) are layered on. Verified: all four migrations apply clean in SQLite with zero foreign-key violations.
- **Migration script** (`scripts/migrate_camps.py`). Reads a JSON export of the old camps table, deduplicates organizations by registrable domain (else name+city+state), emits each camp as a program under its org, rolls up categories/ages/program_types onto the org, maps the free-text `sport` onto the controlled vocabulary, parses `price_text` into price + price_type, and writes trust_signals. Tested: two same-domain camps collapse to one org with two programs, prices and categories map correctly. Sessions are deliberately not fabricated (camp rows only carry a coarse date range, which lives on the program).
- **Shared read layer** (`src/lib/db.ts`). The single API both front doors call: `searchOrganizations` (age/category/price/availability filters + haversine radius), `getOrganization`, `searchPrograms` (the camps view), `searchSuggest`, `logSearchEvent`. Verified: every query runs against the real schema with no column drift.
- **Scaffold + deploy pipeline.** `wrangler.jsonc` (shared D1 + R2 bindings), `package.json`, `astro.config.mjs`, `tsconfig.json`, env types, a foundation landing page that reports live org/program counts, and `migrations/README.md` with the full apply-and-seed runbook.

### Next session (not done yet)

Phase 4 (search UI: home search, results, org/program pages, SEO landing pages) and phase 5 (re-point parentcoachdesk.com/camps to the shared DB).

---

## Build phases (once the forks are set)

1. **Schema.** Write the org / program / session / trust_signal / search_event schema. Map every current camps column to its new home.
2. **Migration.** Dedupe the 1,308 rows into organizations, attach programs, derive sessions where dates exist, move trust data onto orgs.
3. **Shared read API.** One read layer both sites call. Search, org-by-id, program-by-id, suggest.
4. **ActivityRadar site.** Home search, results, org profile, program detail, city/category landing pages, parent accounts, claim portal, org dashboard.
5. **Parent Coach Desk re-point.** Rewrite /camps to read the new API filtered to `program_type = 'camp'`. Verify nothing regresses on the live site.
6. **SEO surface.** Auto-generated city + category landing pages. schema.org markup.

---

## Source references

- F&F Master Plan: ActivityRadar as Radar Intelligence, one database two front doors (lines 35, 59, 67).
- F&F OS chapter 07-01 Platform Overview, 07-02 Shared Activity Database, 07-03 ActivityRadar Site Spec.
- parent-coach-playbook: `migrations/0001`–`0010`, `src/lib/camps-db.ts`, `src/pages/camps/`, `wrangler.jsonc` (D1 binding `DB`, id `8336fa9f-...`).
