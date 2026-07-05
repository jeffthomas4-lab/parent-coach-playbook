# SEO Recovery Progress

Session started 2026-07-05. Working folder: `Outputs/parent-coach-desk`. Update this file after every batch so a fresh session can resume without re-deriving what's already known.

## Task 1: Camps blackout — DONE

**Root cause.** The 2026-06-14 migration that pointed parentcoachdesk.com's camps at the shared `activity-radar` D1 (`8cc3694a-26f8-4a56-b131-d5d3a68c49ef`) ran through ActivityRadar's own `scripts/migrate_camps.py`, which generated `seed/0005_seed_from_camps.sql`. That seed file's `INSERT INTO programs (...)` column list never includes `pcd_status` (or `reviewed_by`, `reviewed_at`, `submitted_by_email`). The column was added in the same window by `migrations/0013_pcd_editorial_fields.sql` as `pcd_status TEXT NOT NULL DEFAULT 'pending'`. Every row the seed inserted — including the 1,701 camps that were already human-approved in the old `parent-coach-playbook` D1 — landed on that default. Nothing overwrote an existing approval after the fact; the approval was simply never carried into the INSERT in the first place. `parent-coach-desk/scripts/migrate-camps-to-activity-radar.mjs` (the script sitting in this repo, which does map status correctly) was never the one actually run — its output uses a different `id` format than what's live (`c.id` directly vs. the live `prog-{uuid5}` + `legacy_camp_id` pattern from `migrate_camps.py`).

**Recovery.** Rather than re-deriving approval from `CAMPS_QUALITY_FRAMEWORK.md` heuristics, I recovered the real prior decision: parsed the original `scripts/old-camps-export.json` (a wrangler SQL dump of the pre-migration `parent-coach-playbook` D1) for the 1,701 rows with `status='approved'`, then joined those legacy IDs against `programs.legacy_camp_id` in the live D1 and restored `pcd_status='approved'`, `record_status='active'`, `awaiting_review=0`, plus a `reviewed_by`/`reviewed_at`/`review_notes` audit trail, scoped to `session_end_date >= date('now')` per the brief. Ran in 7 batches of ~250 IDs.

- Batch results: 171, 152, 151, 144, 163, 148, 130 = **1,059 camps restored to approved**.
- 642 of the 1,701 were legitimately past their `session_end_date` and correctly left alone.
- The 44 originally-rejected camps and ~1,046 genuinely-pending camps were untouched.

**Verify (live, curled 2026-07-05).**
- `curl https://parentcoachdesk.com/sitemap-camps.xml` → 1,059 `<url>` entries (was 0).
- `/camps/` renders `camp-card` listings.
- 5 random camp pages (Nike Volleyball at Embry-Riddle, Greentrike Summer Camp, Camp Create Week 3, Breakthrough Basketball Auburn, Nike Soccer at Oregon State) all return HTTP 200 with real titles.
- No redeploy was needed — `/camps` and the sitemap read D1 at request time (SSR), so the D1 fix went live immediately.

**Prevent.** Fixed the silent-failure pattern:
- `src/pages/sitemap-camps.xml.ts` — now `console.error`s on D1 failure and on a 0-result urlset, instead of swallowing both silently.
- `src/lib/camps-db.ts` — added `countApprovedFutureCamps()`.
- `src/pages/api/cron/camps-sweep.ts` — added a third job that calls `countApprovedFutureCamps` and logs `CAMPS ALERT` if it's 0. `worker-cron` already hits this endpoint daily, so the alert surfaces in `npx wrangler tail` on the existing cron without any new secret or deploy target.

**Not yet done:** GSC resubmit of `sitemap.xml` (needs Chrome tools pass — see below). A data-quality item worth a follow-up ticket, not part of this brief: source names/descriptions for the `ussportscamps.com`-scraped rows have mis-encoded en dashes (`ΓÇô` instead of `–`), a Windows-1252/UTF-8 mismatch from the original scrape. Cosmetic, not a blocker, didn't touch it.

**Build verification note:** the sandbox this session runs in couldn't complete a full `npm run build` (disk space and native-binary issues unrelated to the code — rollup and esbuild native binaries are broken in this container, and the mounted project folder blocks cache-file deletes). The 3 edited files were reviewed by hand for syntax correctness. The `npm run build` in the deploy block below is the real gate — run it before trusting this session's code changes.

## Task 2: Purge old brand — pending

## Task 3: Internal-linking sprint — pending

## Task 4: Sport hub metadata — pending

## Task 5: Empty "Our take" fields — pending

## Task 6: RSS expansion — pending

## Task 7: Kit drip prep — pending

## Task 8: Pinterest launch kit — pending

## Task 9: Author reveal prep — pending

## Close-out — pending
