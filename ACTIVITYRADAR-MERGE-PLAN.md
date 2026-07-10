# ActivityRadar Merge Plan

**Date:** 2026-07-10. **Owner:** Jeff Thomas. **Executors:** Sonnet subagents, one work package each, run from an orchestrator session in this repo.

ActivityRadar folds back into parent-coach-desk. One camp database location, one repo, one front door. Most of the file move already happened in this working tree on the morning of 2026-07-10 (uncommitted), and the old `Outputs/ActivityRadar` folder was deleted the same day. This plan verifies that move, finishes the leftovers, decommissions the old surfaces, and updates the norms.

**Decisions locked (2026-07-10):**

1. Verify and finish the in-tree move. No redo.
2. activityradar.com becomes a 301 redirect to parentcoachdesk.com/camps.
3. GitHub repo `jeffthomas4-lab/activityradar` gets archived as the historical record. Local folder is already gone.
4. The unshipped ActivityRadar search UI stays in `activityradar-archive/`. Out of scope.

---

## Facts card

Every subagent reads this before its work package. Do not rediscover these.

- **Repo:** `Outputs/parent-coach-desk`. Live domain parentcoachdesk.com. Cloudflare Pages project `parent-coach-playbook` (the project and D1 keep the old name on purpose; never "fix" it).
- **Canonical database:** D1 `activity-radar`, id `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`, bound as `DB` in `wrangler.jsonc`. This is the one camp database. R2 bucket `activityradar-photos`, bound as `PHOTOS`.
- **Two migration histories, one live schema.** `migrations/` (0001-0010, the old flat-camps era) and `migrations-activity-radar/` (0001-0013, the org/program/session graph plus PCD editorial fields). Filenames collide across folders; content does not. The authoritative applied record is the `d1_migrations` table in the live D1, not either folder.
- **Schema shape:** `organizations` → `programs` (camps are `program_type='camp'`) → `sessions`. PCD editorial fields (pcd_status, awaiting_review, verified, featured) live on `programs` via `migrations-activity-radar/0013_pcd_editorial_fields.sql`. Support tables: camp_claims, camp_reviews, org_claims, org_suggestions, submitters, search_events, search_domains/anchors/batches, enrichment_queue, camp_scan_queue, zip_centroids, domain_quality, geocoded_addresses, trust_signals, featured_listings.
- **Workers:** `workers-activity-radar/` holds two standalone Workers deployed against the shared D1: `activityradar-enrichment` (hourly cron, `wrangler.toml`) and `activityradar-yelp` (daily 3am cron, `yelp-wrangler.toml`, secret `YELP_API_KEY`). They deploy separately from the Pages site.
- **Discovery pipeline:** `buildout/hit-rate-test/daily_discovery.py`, run from this repo root. IRS BMF source data in `buildout/bmf/`.
- **Archive:** `activityradar-archive/` documents the whole move in its README. Historical record, never imported by live code.
- **Old repo status:** local folder deleted 2026-07-10 with its `.git`. Whether the final state reached `github.com/jeffthomas4-lab/activityradar` is UNVERIFIED. WP-0 settles it.
- **Old D1 `parent-coach-playbook`** may still exist in the Cloudflare account with stale flat-camps data. WP-5 settles it.

**Hard rules for every subagent:**

- Model: Sonnet. One work package per agent. Report pass or fail with evidence, then stop.
- One session on this tree at a time. If another session is writing here, halt everything. A cross-session write truncated worker.js in June; not again.
- Write runtime JS/TS through the shell and syntax-check it (`node --check` or the build) before calling it done.
- No new schema migrations during the merge, one narrow exception in WP-4.
- Agents edit and verify. Jeff pastes every wrangler deploy, D1 command, and dashboard step. Format anything Jeff runs as a single PowerShell block per Deployments.md. Never invent flags.
- `/web:commit-check` runs on the session diff before the merge commit (WP-6).

---

## Phase 0: Preconditions (blocking, nothing runs before this passes)

### WP-0: Concurrency and recovery gate

1. Confirm with Jeff that no other Claude Code or Cowork session has this repo open. Halt until confirmed.
2. Verify the GitHub remote: does `jeffthomas4-lab/activityradar` exist, and does its latest commit reflect the repo's final state (the 0013 migration, the workers, buildout)? Jeff checks the repo page or runs `git ls-remote`. If the remote is missing or stale, record in `activityradar-archive/README.md` that `activityradar-archive/` is now the only surviving copy of the retired repo, and move on. Nothing in the archive is load-bearing for the live site, so this is a record-keeping loss, not an operational one.
3. Full database backup before anything touches D1: Jeff runs `scripts\backup-d1-activity-radar.ps1` (it does a full `wrangler d1 export` of the shared database). Confirm the dated dump landed in `backups\`.

**Done when:** other-session check confirmed, GitHub state known and recorded, dated D1 export on disk.

## Phase 1: Verify the in-tree move

### WP-1: Parity audit (read-only)

The archive README's "where the active pieces landed" section is the checklist. Verify each landed piece exists, is complete, and is not truncated:

1. `migrations-activity-radar/`: all thirteen files 0001-0013 present (0005 was a seed, never a migration; its absence is correct). Non-empty, valid SQL.
2. `workers-activity-radar/`: `enrichment-worker.ts`, `yelp-worker.ts`, `verify_extract.js`, both toml configs. Check each toml still binds D1 id `8cc3694a...` and the worker names are unchanged (`activityradar-enrichment`, `activityradar-yelp`); a name change would orphan the deployed secrets and crons.
3. `buildout/`: `hit-rate-test/` scripts, `bmf/` source CSVs, `out/` worklists. Dry-run `python buildout/hit-rate-test/daily_discovery.py --help` (or the script's dry-run flag) from the repo root to prove paths resolve.
4. `scripts/`: `ingest_irs_bmf.py`, `migrate_camps.py`, `build_zip_centroids.py`, `backup-d1-activity-radar.ps1`, `geocode_orgs_from_zip.sql`, `seed-enrichment-queue.sql`, `reprioritize-sport-names.sql` all present.
5. `activityradar-archive/`: README, 00-ARCHITECTURE.md, both audits, DATA-MAP, the site scaffold `src/`, `seed/`, `camps_export.json`, config files.
6. `npm run build` compiles from this tree as-is. A red build here means the move itself is broken; fix before Phase 2.

**Done when:** every checklist line verified with file sizes or checks noted, build green, findings written into the report section at the bottom of this file.

## Phase 2: Code cleanup

### WP-2: Kill the flat-camps leftovers

1. `src/pages/api/camps/nearest.ts` still queries `FROM camps`, a table shape the code no longer owns. Rewrite it against `organizations`/`programs` (`program_type='camp'`, join for lat/lng, keep the response shape its callers expect), or if nothing calls it, delete the route and its references. Find callers first; decide from evidence.
2. Retire `scripts/backup-d1.ps1` (it dumps the dead `camps` table). Delete it; `backup-d1-activity-radar.ps1` is the backup script now.
3. `scripts/migrate-camps-to-activity-radar.mjs`, `.sql`, and `migrate_camps.py` are one-time historical migration tools. Move all three into `activityradar-archive/` and note it in the archive README. They must never run again against the live DB.
4. Sweep the tree (src, scripts, workers-activity-radar, package.json, .github) for `FROM camps`, `camps_export`, and D1-database references to `parent-coach-playbook`. Judgment rule: `parent-coach-playbook` as the Pages project name or D1 export commands in docs is correct and stays; as a D1 binding or query target in live code it is a bug and gets fixed. List every hit and the call made on it.
5. Check `.github/workflows/ci.yml` and `camps-sweep-cron.yml` (untracked, landed with the merge): do they reference paths that exist in this tree, and does ci.yml match the Pillar 9 gate (npm ci, gitleaks, npm audit, build, test)? Fix paths only; do not redesign CI here.

**Done when:** zero live-code references to the flat `camps` table remain, historical tools archived, CI workflow paths valid, build and existing tests still green.

## Phase 3: Workers redeploy from the new home

### WP-3: Re-point the two Workers' source of truth

The Workers are already deployed and running; only their source moved. Risk is drift, not downtime.

1. Agent confirms both toml configs are deployable from `workers-activity-radar/` (paths, `main` entries, D1 ids).
2. Jeff deploys both from the new location and confirms the `YELP_API_KEY` secret survived (it lives on the deployed Worker, so an unchanged worker name keeps it):

```powershell
cd "$HOME\Desktop\Claude Cowork\Outputs\parent-coach-desk\workers-activity-radar"
npx wrangler deploy
npx wrangler deploy --config yelp-wrangler.toml
npx wrangler secret list --config yelp-wrangler.toml
```

3. Verify the next cron tick of each Worker in the Cloudflare dashboard (Workers → each worker → Logs/Metrics), or `npx wrangler tail activityradar-enrichment` across the top of an hour.

**Done when:** both Workers deployed from parent-coach-desk source, secret intact, one post-deploy cron tick observed on each.

## Phase 4: Database verification (the "one camp database" claim)

### WP-4: Prove the schema and the data

1. Jeff runs, agent reads: `npx wrangler d1 execute activity-radar --remote --command "SELECT name FROM d1_migrations ORDER BY id"` from the repo root. Confirm both histories applied, including 0013.
2. Check whether the old flat `camps` table still exists in the live DB: `SELECT name FROM sqlite_master WHERE type='table' AND name='camps'`. If it exists: export it to `activityradar-archive/camps-table-final-export.json`, then drop it with a new dated file in `migrations-activity-radar/` (0014). This is the one permitted schema change, and it runs only after WP-2 proved no live code reads it and WP-6's live smoke test passes. If the table is already gone, note it and move on.
3. Row-count sanity: organizations total, programs total, programs where `program_type='camp'` and `pcd_status='approved'`. Compare the approved-camp count against what /camps shows live. A mismatch over a few rows is a finding, not a fix; log it.
4. Confirm whether the old `parent-coach-playbook` D1 database still exists in the account (`npx wrangler d1 list`). Feeds WP-5 step 3.

**Done when:** applied-migrations list recorded, camps-table fate executed or confirmed moot, counts logged, old-DB existence answered.

## Phase 5: Decommission the old surfaces

Runs after WP-6's live smoke test passes, except step 3 and 4 which can run any time after WP-0/WP-4.

### WP-5: Redirect, archive, retire

1. **activityradar.com → 301.** In the Cloudflare dashboard (eepskalla account): Bulk Redirects → create a list with `https://activityradar.com/*` and `https://www.activityradar.com/*` → `https://parentcoachdesk.com/camps`, status 301, then enable the redirect rule. Account-level Bulk Redirects work without any Pages project behind the hostname; the zone just needs proxied DNS records (AAAA `100::` placeholders if the Pages records get removed).
2. **Delete the `activityradar` Pages project** (dashboard: Workers & Pages → activityradar → Settings → Delete) once the redirect answers. Domain and zone stay registered.
3. **Archive the GitHub repo** `jeffthomas4-lab/activityradar` (repo Settings → Archive this repository), after WP-0 settled what's on it.
4. **Old `parent-coach-playbook` D1:** if WP-4 found it still exists, export it once (`npx wrangler d1 export parent-coach-playbook --remote --output backups\parent-coach-playbook-final.sql`), keep the dump, delete the database after 90 days (2026-10-10; put it on the calendar). It has been dead weight since the June re-point.

**Done when:** curl of activityradar.com returns 301 to parentcoachdesk.com/camps, Pages project gone, repo archived, old-DB fate logged with its date.

## Phase 6: Tests, QA, commit, ship

### WP-6: Make it green, make it one commit

1. Tests for what the merge touched, Pillar 9 minimum (happy path, failure path, auth) for: the rewritten or deleted `/api/camps/nearest`, plus any camps API route WP-2 edited. Vitest, in `tests/`, matching the existing suite's style. Do not chase the full 13-route backlog here; that stays on STANDARD-AUDIT.
2. `npm run build` and `npm test` green.
3. Run `/web:commit-check` on the full session diff (this is one big diff: the morning's move plus the cleanup). Fix anything Critical.
4. One commit for the whole merge, then deploy per the Deployments.md parent-coach-desk block, then push. Jeff pastes:

```powershell
cd "$HOME\Desktop\Claude Cowork\Outputs\parent-coach-desk"
npm run build
npm test
git add -A
git commit -m "Fold ActivityRadar into parent-coach-desk: pipeline, workers, schema history, archive; retire flat-camps leftovers"
npx wrangler pages deploy dist --project-name parent-coach-playbook --branch main
git push
```

5. Live smoke test: /camps list, one camp detail page, /camps/submit form renders, admin review queue loads, the rewritten nearest endpoint answers, camp photos serve from R2.

**Done when:** deploy is live, smoke test passes, commit pushed. This gate releases WP-5 steps 1-2 and WP-4's drop migration.

## Phase 7: Docs, norms, and the record

### WP-7a: Deployments.md and CLAUDE.md

1. `About Me/Deployments.md`: replace the activityradar.com block with a three-line retired notice (retired 2026-07-10, 301 to parentcoachdesk.com/camps, source folded into parent-coach-desk). Move the migration command into the parentcoachdesk.com block: migrations for the shared D1 now apply from parent-coach-desk, `npx wrangler d1 execute activity-radar --file=./migrations-activity-radar/00NN_name.sql --remote`. Kill the old "Never run migrations from the parent-coach-desk repo" rule; it inverted. Note the D1 name in the PCD block: the binding targets `activity-radar`, and the `parent-coach-playbook` database name in that block is historical. Add the two Workers' deploy commands (WP-3 block).
2. `CLAUDE.md`: in the Field & Forge norm's project list, mark ActivityRadar as retired into Parent Coach Desk. In the Deployment/Backup norm project lists, same. Small edits, no restructuring.

### WP-7b: Project files in this repo

1. `DATA-MAP.md`: fold in the shared-DB personal data ActivityRadar's map covered: search_events (90-day retention), org_claims, org_suggestions, submitters, camp_claims/camp_reviews emails. One database, one map. Retention and deletion path per table.
2. `STANDARD-AUDIT.md` and `SECURITY-AUDIT.md`: note the merged surface (two Workers, discovery pipeline, org schema) and that ActivityRadar's own audits are archived in `activityradar-archive/`. Pillars 8-10 stay open as already flagged.
3. `BACKUP.md`: point at `backup-d1-activity-radar.ps1` as the backup path.
4. Append the phase reports to the bottom of this file.

### WP-7c: The Field & Forge record

1. `Outputs/Field & Forge Ventures/Field-Forge-Ventures-Context-Index.md`: update the ActivityRadar portfolio line (retired 2026-07-10, folded into Parent Coach Desk, shared D1 unchanged).
2. Log the decision to the Decision Journal page in Notion per the F&F norm: ActivityRadar retired as a separate product; one camp database, one repo, one front door; domain 301s to PCD.
3. Regenerate `Outputs/PORTFOLIO-STATUS.md` via `/web:portfolio`.
4. `Outputs/CONTINUITY.md`: remove or retire the ActivityRadar deploy row, add the two Workers under parent-coach-desk.

**Done when:** every doc above edited, Notion decision logged, portfolio regenerated.

---

## Sequencing

WP-0 blocks everything. Then WP-1 → WP-2 → WP-3 → WP-4 → WP-6, strictly in order. WP-5 steps 3-4 (GitHub archive, old-DB export) can run any time after WP-0/WP-4; WP-5 steps 1-2 (redirect, project delete) and WP-4's table drop wait for WP-6's live smoke test. WP-7a/7b/7c run in parallel after WP-6, as three separate agents.

Nine subagents total: WP-0 through WP-4, WP-6, and the three WP-7s. Each gets this file plus its own section as the brief. The orchestrator holds the gate between phases and collects the reports.

## Done definition

One camp database (`activity-radar` D1) with one repo that owns its schema history, pipeline, workers, and front door. Old folder gone, GitHub repo archived, activityradar.com answering 301 to parentcoachdesk.com/camps, old D1 on a dated deletion clock. PCD built, tested, deployed, and pushed from the merged tree. Deployments.md, CLAUDE.md, DATA-MAP, the audits, the Context Index, Notion, and PORTFOLIO-STATUS all telling the same story.

---

## Phase reports

(Subagents append here: WP id, date, pass/fail, evidence, open findings.)
