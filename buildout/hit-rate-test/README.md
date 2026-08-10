# Org discovery — individual-search lane (fallback)

This directory is **lane 2 of 2**. It works organizations one at a time in the
browser, and it is now the *fallback* path: it runs only for priority
organizations that no current approved directory snapshot covers.

Lane 1 is `buildout/donny/` — the directory-batch lane. When an official group
directory is available and approved, that lane processes the whole group from
one dated snapshot, which is roughly two orders of magnitude cheaper per
organization. Read `buildout/donny/README.md` first.

Both lanes write to the shared `activity-radar` D1
(`8cc3694a-26f8-4a56-b131-d5d3a68c49ef`). ActivityRadar was folded into
parent-coach-desk on 2026-07-10 as its camp data layer; the physical database
name is kept unchanged on purpose.

---

## Why the numbers argue for the batch lane

Measured against production on 2026-08-08:

| | |
|---|---|
| organizations total | 198,287 |
| with a website | 3,678 |
| **missing a website** | **194,609** |
| worked by this lane since 2026-07-10 | 3,091 |

At roughly 100 organizations a day, one at a time, the remaining pool is a
multi-decade job. One approved directory snapshot yields hundreds of canonical
names, affiliations, locations, websites, and public role contacts from a single
fetch. That is the whole reason lane 1 exists.

---

## What actually runs

The five-step `sample_orgs.py → discovery_batch.py` flow this file used to
document **is retired**. It described 10 engines and 1,250 orgs/day against an
`Outputs/ActivityRadar` repo root that no longer exists. The live driver is
`daily_discovery.py --pool`, six engines, and the pool comes from D1, not from
the IRS BMF files.

```
D1 query          ->  out/db-pool.csv           id,name,city,state (already filtered)
daily_discovery.py -> out/worklist-<ST>-<DATE>.csv  tiered, engine-assigned, resumable
[Chrome session]   -> out/results.jsonl         one JSON line per org
import_results.py  -> out/import-<DATE>.sql     fill-blank-only SQL + review CSV
D1 MCP             -> live                      statement by statement
```

### 1. Cut the pool from D1

```sql
SELECT id, name, city, state FROM organizations
WHERE (website_url IS NULL OR website_url = '')
  AND (camp_unlikely IS NULL OR camp_unlikely = 0)
ORDER BY CASE state WHEN 'WA' THEN 0 WHEN 'OR' THEN 1 WHEN 'ID' THEN 2
                    WHEN 'AK' THEN 3 ELSE 9 END, RANDOM()
LIMIT 500;
```

Write it to `out/db-pool.csv` with header `id,name,city,state`. The `RANDOM()`
tiebreaker matters: an earlier `ORDER BY city, name` returned the same
alphabetically-first 500 WA orgs every day, and once that slice was exhausted
the driver reported "All states fully resolved" while ~194k rows had never been
touched.

### 2. Cut the worklist

```bash
python3 buildout/hit-rate-test/daily_discovery.py \
  --pool buildout/hit-rate-test/out/db-pool.csv --limit 400
```

`--pool` skips the BMF load and NTEE filtering and trusts the CSV's `id` as the
live `organizations.id`. Engines and caps live in `ENGINES` at the top of
`daily_discovery.py`: duckduckgo 250, bing 250, brave 200, mojeek 200, ecosia
150, startpage 150 — 1,200 total, not the 1,250-across-10 this file used to
claim.

### 3. Work the worklist in Chrome

Follow `DISCOVERY-PROMPT.md`. One search per org via its assigned engine and
pre-built `search_url`. Append one JSON line per org to `out/results.jsonl`.

**Rate limiting, not human mimicry.** The previous instruction was to pick a
fresh random 20–180s gap per org and take 5–12 minute breaks to "mimic someone
stepping away." That was an evasion technique and it is gone. What replaces it:
a constant declared interval, one request at a time, exponential backoff on
429/5xx, a truthful `User-Agent`, and a hard per-run request cap. The limits are
in `buildout/donny/policy.py::RateLimit` and there is a regression test that
fails if randomized pacing comes back. If a source does not want automated
access, the answer is to stop, not to look more human.

### 4. Generate SQL

```bash
# Dump live ids first: SELECT id FROM organizations WHERE deleted_at IS NULL;
python3 buildout/hit-rate-test/import_results.py \
  --results  buildout/hit-rate-test/out/results.jsonl \
  --worklist buildout/hit-rate-test/out/worklist-WA-2026-08-08.csv \
  --live-ids buildout/hit-rate-test/out/live-org-ids.txt
```

`--live-ids` is **required**. The script refuses to emit SQL without it rather
than write against an unverified id. See "Identity resolution" below.

### 5. Apply

The repo's `node_modules` were installed on Windows, so `npx wrangler` does not
run in the Linux sandbox (workerd platform-binary mismatch). **Do not use
`wrangler d1 execute` from an agent run.** Read `out/import-<DATE>.sql`, split on
`;`, skip `--` comments, and execute each statement through the D1 MCP query
tool against `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`. Confirm with a count of
organizations stamped `last_verified_at` today.

---

## Identity resolution (the 2026-08-08 fix)

This script used to recompute every org id from `name + city + state` and throw
away the id carried through from the pool. Measured across all 3,091 rows in
`out/results.jsonl`, 37 disagreed:

- **35 of 37** — the agent had corrupted the UUID while transcribing it. Some
  are not even valid hex (one contains an `h`). Recomputing rescued these.
- **2 of 37** — the agent's id was **correct and live**, and the recomputed id
  did not exist. Both were caused by the agent writing a tidier city than the
  database stores: `Mountlake Terrace` vs the stored `Mountlake`,
  `Bainbridge Island` vs the stored `Bainbridge Is`. For those two the `UPDATE`
  matched zero rows and the `camp_scan_queue` insert was skipped by its `EXISTS`
  guard. No error, no log line, no row.

Neither pure strategy is safe. Resolution order now, first hit wins:

1. **worklist** — the CSV came straight out of D1; joined on normalized
   name+city+state so a mistyped UUID cannot affect it.
2. **carried** — the id on the results line, *if* present in `--live-ids`.
3. **recomputed_repair** — the legacy name+city+state id, *if* present in
   `--live-ids`. Logged as a repair, not treated as normal.
4. **held** — no write against a guessed id, ever.

The run prints the resolution mix, so a rising `recomputed_repair` count is a
visible signal that transcription is degrading.

## Completion is no longer permanent

`results.jsonl` still acts as a local skip-list for the individual lane, but it
is **no longer the definition of done**. A JSONL line saying "attempted, never
look again" made refreshes impossible when an official directory changed. In the
batch lane, completion is a property of a dated snapshot — `content_sha256` plus
one recorded disposition per row — not a property of an organization. The same
source can be pulled again next season.

## What lands in the database

For each accepted find (≥75 confidence, not flagged), all fill-blank-only and
skipped entirely for claimed organizations:

- `organizations.website_url`, `last_verified_at`, `updated_at`
- `organizations.email` / `organizations.phone` from `org_email` / `org_phone`
  — **new**; these were captured from 2026-07-30 onward and sat unused because
  this script never read them
- a `camp_scan_queue` row (`INSERT OR IGNORE`, guarded by `EXISTS`)

Anything under 75, flagged, social-only, or with an unresolvable id goes to
`out/review-<DATE>.csv`. It never goes live without a human pass.

## Guardrails

Never store youth athlete data: rosters, jersey numbers, DOB, grade or class
year, medical, allergy, emergency contact, parent or student emails. Never open
`/admin`, `/login`, `/account`, `/dashboard`, `/cart`, `/checkout`, `/wp-admin`,
`/private`. Store the URL and the reason, not page bodies. The batch lane
enforces this in code (`buildout/donny/intake.py::screen_row`) and it is tested;
this lane enforces it by prompt, per `DISCOVERY-PROMPT.md`.

Named individuals do not belong in `activity-radar`. Personal names, titles, and
direct addresses live in `org_contacts` in `parent-coach-desk-ops-production`
per ADR-046. `organizations.email` / `organizations.phone` hold a general org
channel, never a person.

## Files

| file | status |
|---|---|
| `daily_discovery.py` | **live** — pool → tiered worklist, resumable |
| `import_results.py` | **live** — results → fill-blank-only SQL + review CSV |
| `DISCOVERY-PROMPT.md` | **live** — accept/reject/confidence/guardrail rules |
| `config.json` | states and scoring thresholds |
| `score.py`, `verify_scoring.py` | optional scoring self-test |
| `discovery_batch.py` | **retired** — superseded by `daily_discovery.py` |
| `sample_orgs.py` | **retired** — BMF sampling, superseded by the D1 pool query |
| `resolve.py` | **retired** — old paid-API resolver, kept for reference |

## Tests

```bash
python3 buildout/donny/test_intake.py -v
```

Covers both lanes, including this script's identity resolution.
