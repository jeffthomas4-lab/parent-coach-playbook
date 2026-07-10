# Org Website Discovery (browser, no API)

End-to-end workflow that finds the official website for each youth-activity org and
feeds it into the live ActivityRadar database. No paid API. Claude-for-Chrome does the
searching by hand, up to ~1,250 orgs/day spread across 10 search engines, and never
does the same org twice.

Reads the IRS org backbone, writes to the shared `activity-radar` D1 through SQL you
apply with wrangler. The discovery pass only finds the website. The existing
enrichment + camp_scan workers take it from there to detect programs.

## The five steps

```
sample_orgs.py    IRS BMF        -> out/sample.csv         the org queue
discovery_batch.py queue         -> out/worklist-DATE.csv  today's 1,250, engine-assigned
[Chrome session]   worklist      -> out/results.jsonl      one site found per org
import_results.py  results       -> out/import-DATE.sql    confident sites + camp-scan seeds
wrangler d1 execute import.sql   -> activity-radar D1       live
```

`out/results.jsonl` is the memory of the whole thing. The batcher skips any org already
in it, so every day's worklist is the next undone slice and no org repeats.

## Run it (PowerShell, from the ActivityRadar repo root)

```powershell
cd "$HOME\Desktop\Claude Cowork\Outputs\ActivityRadar"

# 1. Build the org queue. Raise sample.size in config.json to cover the whole WA/OR
#    pool (8,349 orgs); the default 2,000 was the old API-gate sample.
python buildout/hit-rate-test/sample_orgs.py buildout/bmf/eo3.csv `
  --out buildout/hit-rate-test/out/sample.csv

# 2. Cut today's worklist (up to 1,250, spread across the 10 engines)
python buildout/hit-rate-test/discovery_batch.py `
  --queue buildout/hit-rate-test/out/sample.csv

# 3. Work the worklist in Chrome per DISCOVERY-PROMPT.md.
#    Append one JSON line per org to out/results.jsonl.

# 4. Turn the day's finds into SQL (confident sites only; uncertain -> review CSV)
python buildout/hit-rate-test/import_results.py `
  --results buildout/hit-rate-test/out/results.jsonl

# 5. Apply to the live database
npx wrangler d1 execute activity-radar --remote `
  --file=buildout/hit-rate-test/out/import-<DATE>.sql
```

Repeat steps 2-5 daily. The queue burns down on its own.

## How "no same org twice" works

Two layers.

- `discovery_batch.py` loads every org_id in `results.jsonl` and skips it, so a resolved
  org is never put on another worklist.
- `import_results.py` dedups org_ids again before writing SQL, and the UPDATE only fills
  a website when the org has none, so a claimed or owner-submitted site is never clobbered
  and re-running the same SQL changes nothing.

## How the engine spread works

`discovery_batch.py` assigns each org one engine by rotation, capped per engine per day:
Google 100, Bing 150, Brave 150, DuckDuckGo 150, Yahoo 125, Ecosia 125, Startpage 100,
Qwant 100, Mojeek 125, Swisscows 125. Total 1,250. Google is kept low because it is the
most aggressive about automated-query detection. Edit the caps in `discovery_batch.py`.

## What lands in the database

For each confident find (>= 75 confidence, not flagged):
- `organizations.website_url` is set (only if empty), `last_verified_at` stamped.
- a row is seeded into `camp_scan_queue` so the camp-scan worker visits the site and
  detects programs. Any org that comes back with a live program gets promoted from
  `unverified` to `active` and enters parent search.

Anything under 75, flagged, or social-only is written to `out/review-DATE.csv` instead of
the database. It never goes live without a human pass.

## Files

- `sample_orgs.py` - build the org queue from the IRS BMF (stratified, dedup by org_id).
- `discovery_batch.py` - cut the daily engine-assigned worklist. Resumable.
- `DISCOVERY-PROMPT.md` - the Chrome accept/reject/confidence/guardrail rules.
- `import_results.py` - results.jsonl -> idempotent SQL + review CSV.
- `config.json` - sample size, states, scoring thresholds.
- `score.py` / `verify_scoring.py` - optional: batch-score raw results and self-test the rules.
- `resolve.py` - the old paid-API resolver. Unused in the browser workflow; kept for reference.

## Guardrails (parent-facing youth product)

Never store youth athlete data (rosters, DOB, medical, parent/student emails). Never open
admin / login / checkout paths. Store the URL and the reason, not page bodies. Full rules
in `DISCOVERY-PROMPT.md`.
