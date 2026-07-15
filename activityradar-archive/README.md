# ActivityRadar archive

> **Operational update, 2026-07-15:** `activityradar-yelp` was retired and deleted after this archive was written. References below describe historical merge state, not a live Worker.

ActivityRadar was retired as a separate product on 2026-07-10. It never shipped a
public search UI. Everything from that repo has been folded into parent-coach-desk,
which was always the live front door and already bound the same shared D1
(`activity-radar`, database_id `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`) and the same
R2 bucket (`activityradar-photos`).

The data itself was never "in" the ActivityRadar folder — it lives in Cloudflare D1
and R2. Nothing about the live site or the shared database changed in this move.

## Where the active pieces landed (in this repo, parent-coach-desk)

- `buildout/` — the daily org-discovery pipeline (search worklists, results.jsonl,
  import scripts, the raw IRS BMF source data and gazetteer). This is what runs
  every day. Same relative structure as before, so `python3 buildout/hit-rate-test/
  daily_discovery.py buildout/bmf/*.csv --limit 400` still works unchanged, just run
  from the parent-coach-desk repo root now instead of ActivityRadar's.
- `migrations-activity-radar/` — the org/program/session schema history (0001-0012)
  for the shared D1. Kept separate from this repo's own `migrations/` (camps/claims/
  etc.) because the numbering collides on filenames but the content doesn't overlap.
  Both histories are already applied to the live database — see `d1_migrations` in
  D1 itself for the authoritative applied-migrations record.
- `workers-activity-radar/` — source for the two Cloudflare Workers that run against
  the shared D1: `activityradar-enrichment` (hourly camp-scan worker) and
  `activityradar-yelp`. These stay deployed as their own Workers; only the source
  location moved.
- `scripts/` (this repo's top-level scripts folder) — picked up ActivityRadar's
  Python/SQL utility scripts (`ingest_irs_bmf.py`, `migrate_camps.py`,
  `build_zip_centroids.py`, etc). `backup-d1.ps1` collided with an existing script
  here and was added as `backup-d1-activity-radar.ps1` — it does a full
  `wrangler d1 export` of the whole shared database and is the one to actually use;
  this repo's original `backup-d1.ps1` still references a `camps` table that no
  longer exists post-migration and should be retired.

## What's archived here, unchanged, for reference only

- `00-ARCHITECTURE.md` — the org-centric schema decision doc. Explains why the data
  model moved off the old flat `camps` table.
- `ORG-ACQUISITION-AND-GTM-STRATEGY-2026-06-15.md`, `WS1-SEARCH-UI-BUILD-PROMPT.md`
  — GTM strategy and the spec for the ActivityRadar search UI that was never built.
- `SECURITY-AUDIT.md`, `STANDARD-AUDIT.md`, `DATA-MAP.md` — ActivityRadar's own
  pillar audit and data map. parent-coach-desk has its own versions of these at the
  repo root; this folder's copies are historical record only.
- `src/`, `public/` — the unshipped ActivityRadar Astro site scaffold (org search,
  org profile pages, program detail pages, city/category landing pages). If the
  structured-search product gets picked back up, this is the starting point.
- `seed/` — the one-time camps-to-organizations migration SQL and the IRS BMF
  national-org-backbone seed files. Already applied to the live D1; kept for record.
- `camps_export.json` — the original flat-camps export that `seed/0005_seed_from_
  camps.sql` was generated from.
- `package-activityradar.json`, `astro.config.mjs`, `tailwind.config.mjs`,
  `tsconfig.json`, `wrangler-activityradar.jsonc` — ActivityRadar's own site config,
  kept for reference if the search UI ever gets built.
- `README-activityradar.md`, `BACKUP-activityradar.md`, `discovery.ps1` — original
  repo docs and helper script.

## Not moved

`node_modules/`, `dist/`, `.astro/`, `.wrangler/`, `.git/` were left behind —
regenerable build artifacts and the old repo's own git history, not source.

## retired-migration-tools/ (added 2026-07-13, merge session WP-2)

`migrate-camps-to-activity-radar.mjs`, `migrate-camps-to-activity-radar.sql`
(the 6,108-line one-time INSERT dump), and `migrate_camps.py` — the historical
one-time tools that moved the flat `camps` table into the organizations/programs
graph. All three already ran against the live D1 and must never run again.

Full originals are preserved here. The copies still sitting in `scripts/` at the
repo root were overwritten in place with retired-stub versions that throw/exit
immediately instead of running — the session's sandbox could not delete or
rename files on this mount (filesystem allows overwrite but not unlink/rename),
so true removal of the stub files from `scripts/` is one manual cleanup step for
Jeff (`Remove-Item scripts\migrate-camps-to-activity-radar.mjs`,
`migrate-camps-to-activity-radar.sql`, `migrate_camps.py` — safe any time, the
real copies live in this folder). `scripts/backup-d1.ps1` got the same
retired-stub treatment; `backup-d1-activity-radar.ps1` is the live backup path
(see `BACKUP.md`).

## Still to do (Jeff, manual — not something I run without confirmation)

1. Verify parent-coach-desk builds and deploys clean with the new folders in place.
2. Once confirmed safe, close the `activityradar` GitHub repo
   (github.com/jeffthomas4-lab/activityradar).
3. Cloudflare cleanup, if desired: the `activityradar-enrichment` and
   `activityradar-yelp` Workers can stay deployed as-is (they don't depend on the
   old repo folder existing) — only decide to delete them if you want to
   re-source and redeploy from `workers-activity-radar/` under a new Worker name,
   or retire them. Deleting Workers/Pages projects is irreversible, so that's a
   deliberate call for you to make, not something to automate away.
4. Delete the three retired-stub files from `scripts/` per the note above
   (sandbox couldn't unlink them this session).
