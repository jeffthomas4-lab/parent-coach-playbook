# Donny — directory-batch lane

Donny is the organization discovery worker (`org-discovery-daily-worklist`). It
now runs two lanes:

| lane | what it does | where |
|---|---|---|
| **1. directory batch** | processes a complete official group from one dated snapshot | `buildout/donny/` |
| **2. individual search** | works uncovered priority organizations one at a time in the browser | `buildout/hit-rate-test/` |

Lane 1 runs first. Lane 2 only covers what no current approved directory reaches.

## Why

Production, measured 2026-08-08: **198,287** organizations, **194,609** with no
website. Lane 2 has resolved **3,091** since 2026-07-10. One at a time, the
remaining pool is a multi-decade job. One approved directory snapshot yields
hundreds of canonical names, locations, affiliations, websites, and public role
contacts from a single fetch.

## What "complete" means

A batch is complete when **every row in one dated snapshot has exactly one
recorded disposition**. It does **not** mean every organization has complete
contact information. Those are separate measures and conflating them is how a
pipeline reports success while shipping nothing usable.

- Batch completion → `reconcile_batch()` in `intake.py`
- Row completeness → the C0–C5 tiers, reported alongside, never instead

| tier | meaning |
|---|---|
| C0 | organization name only |
| C1 | plus geography, sport, or affiliation |
| C2 | official website or registration page verified |
| C3 | at least one public organizational contact channel or named adult role contact |
| C4 | channel validated, provenance current, suppression checked |
| C5 | eligible for a specific campaign after separate consent and workspace rules |

## Files

| file | role |
|---|---|
| `policy.py` | the source gate. Classifications, hard deny list, robots + Content-Signal parsing, transparent rate limits |
| `intake.py` | normalization, youth-data screen, canonical matching, dispositions, completeness, reconciliation, rollback, snapshot diffing, masking |
| `run_pilot.py` | dry-run driver. Writes to a local SQLite mirror only. There is no `--apply` flag |
| `schema_local.sql` | the migration DDL, for the staging mirror |
| `sources.seed.sql` | the source registry, with every classification and its evidence |
| `test_intake.py` | 73 tests, stdlib unittest, synthetic fixtures only |
| `fixtures/` | synthetic snapshot + a real read-only slice of canonical orgs |

## Source policy

Nothing enters the batch lane without a `directory_sources` row that passes
`policy.gate_batch_lane()`. Five classifications:

- `approved_public_batch` — official public directory, supported batch method, no discovered restriction. **May enumerate.**
- `approved_manual_snapshot` — official public source, bounded human-reviewed snapshot, not repeatedly crawled. **May enumerate, one snapshot at a time.**
- `validation_only` — may confirm one organization. **May not enumerate a group.**
- `permission_required` — needs written permission or a licensed feed first.
- `blocked` — prohibits the intended use, exposes protected data, or requires bypassing a control.

"Public on the web" is not permission for bulk reuse or outreach.

The gate also denies on: hard-denied domain, robots disallow for our agent,
`Content-Signal` reservation, inactive source, never-checked policy, and a
policy check older than the refresh cadence. A stale check is a denial, not a
warning, because terms change.

### Rate limiting is not human mimicry

The predecessor task told the agent to pick a fresh random 20–180s gap per
search and take 5–12 minute breaks to "mimic someone stepping away." That is an
evasion technique aimed at bot detection and it is gone.

What replaces it: a constant declared interval, concurrency of 1, exponential
backoff on 429/5xx, a truthful project `User-Agent` with a contact address, and
a hard per-run request cap that raises a stop condition rather than retrying.
`test_intake.py::TestRateLimit::test_interval_is_constant_not_randomized` fails
if randomized pacing comes back.

Where robots.txt names `ClaudeBot` and disallows it, the source is `blocked`.
Renaming the User-Agent to slip past that would be a bypass. The legitimate path
is a permission request to the organization.

## Canonical matching

`activity-radar.organizations` is the canonical registry. Nothing here is a
second one. Deterministic evidence, in order, first hit wins:

| # | rule | confidence |
|---|---|---|
| 1 | existing source membership | 100 |
| 2 | exact official external id | 99 |
| 3 | exact EIN | 98 |
| 4 | exact normalized domain + compatible geography | 95 |
| 5 | exact normalized name + city + state | 90 |
| 6 | alias + a second corroborating signal | 80 |

Auto-apply threshold is **90**. Rule 6 therefore lands in review by default,
which is the intent: a name-shaped match never merges on its own. Anything
ambiguous (multiple candidates) is held with the conflicting ids recorded.

Shared platform hosts (SportsEngine, LeagueApps, TeamSnap, Wix, Squarespace, …)
are excluded from domain matching entirely. Without that, every club on one
registration platform collapses into a single organization.

**A canonical id never moves because a directory renamed a club.** The new name
becomes an alias on the existing organization.

## What is never written

- a claimed organization — no field update, no alias, no contact
- a non-empty field — every update is fill-blank-only, with a `before` value logged
- `do_not_contact`, `do_not_contact_at`, `do_not_contact_reason` — not in any write set on any path
- youth data — rosters, jersey numbers, DOB, grade or class year, medical, allergy, emergency contact, parent or student contacts. Screened in code before insert; a rejected row still gets an `excluded` disposition so it reconciles, but its values are never stored

`is_public = 1` on a contact means the channel was published. It is **not**
consent to market. Campaign eligibility is a separate check at send time.

## Where the tables live

All four (`directory_sources`, `directory_batches`, `directory_rows`,
`dedupe_log`) are in **`parent-coach-desk-ops-production`**, not `activity-radar`.

`directory_rows` carries `source_contact_name` / `_email` / `_phone` — PII mapped
to a human. ADR-046 keeps human-mapped rows out of the shared `activity-radar`
graph, which is what makes that graph safe to syndicate wholesale to the
SightSmash public directory without a per-row privacy review. Same reasoning
that put `org_contacts` there in migration 0028.

They are co-located rather than split because every reconciliation query joins
rows → batches → sources, and D1 has no cross-database joins.

`canonical_organization_id` is a **soft** reference to `activity-radar.organizations.id`.
No FK, orphans are possible, a reconciliation query reports them.

## Run a dry run

```bash
python3 buildout/donny/run_pilot.py \
  --snapshot   buildout/donny/fixtures/snapshot-scsn-shape-2026-08-08.csv \
  --orgs       buildout/donny/fixtures/pilot-orgs-ca-volleyball.json \
  --source-url "https://usavolleyball.org/wp-content/uploads/2025/08/2025-2026-SCSN-Directory-August-18-2025.pdf" \
  --expected-rows 28 \
  --out        buildout/donny/out
```

The staging mirror defaults to `$TMPDIR`, not the repo. SQLite locking does not
work reliably over the Windows mount from the Linux sandbox and raises
`disk I/O error`.

## Idempotency, resume, refresh

- **Replay** — identical bytes produce the same `content_sha256` and the same deterministic batch id; a unique index on `(directory_source_id, content_sha256)` rejects the second insert. A completed batch re-run is a no-op.
- **Resume** — an interrupted batch has the same hash but is *not* a completed replay, so it resumes. Resume keys on the **set of already-dispositioned row numbers**, not a high-water mark, so out-of-order writes cannot cause a silent skip. Verified: crash after 12 of 28 then resume produces dispositions and a dedupe count identical to a straight run.
- **Refresh** — a changed snapshot creates a new batch. `diff_snapshots()` reports added, changed, and removed. A removal is **recorded**, never turned into a canonical delete.

## Tests

```bash
python3 buildout/donny/test_intake.py -v
```

73 tests. All fixtures synthetic; domains use `.invalid` / `.example` so nothing
resolves. No real name, email, or phone number is in the suite.
