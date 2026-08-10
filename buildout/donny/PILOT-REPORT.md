# Donny upgrade — audit, source registry, pilot, and approval gate

**Date:** 2026-08-08 · **Status:** dry run complete, nothing applied to production
**Task:** `org-discovery-daily-worklist` (unchanged and still running the old prompt)

---

## 1. Current-state audit

I inspected the live scheduled-task definition, the five files named in the brief, the `activity-radar` and `parent-coach-desk-ops-production` schemas, and all 3,091 rows of `results.jsonl`.

### The scale problem, measured

| | |
|---|---|
| organizations in `activity-radar` | 198,287 |
| with a website | 3,678 |
| **missing a website** | **194,609** |
| pool-eligible (no website, not camp_unlikely) | 194,024 |
| worked by Donny since 2026-07-10 | 3,091 |
| organizations with an email | 193 |
| organizations with a phone | 426 |

3,091 organizations in roughly a month, one at a time. The remaining pool is a multi-decade job at that rate. That is the case for the batch lane, and it is the number worth keeping in front of you.

### Confirmed concerns from the brief

**The importer's identity bug is real, and it is worse and subtler than described.** I recomputed the id for all 3,091 rows and checked every disagreement against production:

- **37 rows** where the carried `org_id` and the recomputed id disagree.
- **35 of 37** — the agent corrupted the UUID in transcription. Several are not valid hex; one is `org-0e16372e-9f8b-5a6e-db05-7b4f3e2a1h5d` (contains an `h`). Recomputing rescued these. The old comment was right about this.
- **2 of 37** — the agent's id was **correct and live**, and the recomputed id **does not exist in the table**. Both caused by the agent writing a tidier city than production stores:

  | source row said | production stores | result |
  |---|---|---|
  | New Northerners Football Club, *Mountlake Terrace* | *Mountlake* | UPDATE hit 0 rows |
  | Bainbridge Roots Basketball…, *Bainbridge Island* | *Bainbridge Is* | UPDATE hit 0 rows |

  For both, the `camp_scan_queue` insert was skipped by its own `EXISTS` guard. No error, no log line, no row. The site was found, verified, and then silently thrown away.

So neither pure strategy is safe: recomputing from mutable fields breaks whenever a name or city string moves, and it cannot work at all for organizations not created through the IRS deterministic-id path. Trusting the carried id breaks when the model mistypes. **Fixed** — see §4.

**`results.jsonl` as a permanent done-ledger.** Confirmed, 3,091 lines. Replaced. Completion is now a property of a dated snapshot, not of an organization.

**Human-mimicry pacing.** Confirmed in STEP 3 of the live prompt: `sleep $((RANDOM % 160 + 20))`, "never the same gap twice in a row", "mimic someone stepping away". Removed and replaced with declared limits, with a regression test that fails if it comes back.

**Stale README.** Confirmed and worse than "stale paths": it documented a five-step `sample_orgs.py → discovery_batch.py` flow with **10 engines and 1,250 orgs/day** against an `Outputs/ActivityRadar` repo root that no longer exists, while the live driver is `daily_discovery.py --pool` with **6 engines and 1,200**. Rewritten.

**High-confidence output going straight to production.** Confirmed. Now dry-run by default with an explicit per-source auto-apply flag.

### Additional drift found (not in the brief)

1. **`STEP 5b` never ran the way the prompt implies.** `import_results.py` never read `org_email` / `org_phone` / `contact_page_url`, so the prompt told the agent to hand-write those updates every night. 141 of 3,091 rows carry them. `org_email` and `org_phone` are now emitted by the script; **`contact_page_url` still is not** — it has no destination column, and `pcd-evergreen-daily` is the consumer that would use it. That remains an open gap.
2. **`org_contacts` is applied in production** (29 live rows) despite migration `0028` declaring itself "additive and intentionally unapplied". The migration comment is wrong about the state of the world.
3. **`DISCOVERY-PROMPT.md` and the task prompt disagree.** The playbook's `results.jsonl` schema never gained the three contact fields the task added 2026-07-30.
4. **`query` is missing from 1,418 of 3,091 rows** (present in 1,673). The audit trail for "what did we actually search" is half absent.
5. **Duplicate organizations in production.** The CA volleyball slice alone shows four identical `Nike Volleyball Camp at Helix Charter High School` rows per session, some with `org-` prefixed ids and some with bare UUIDs — two different id schemes coexisting in `organizations.id`. Not caused by Donny, but it will collide with any matching work and is worth its own pass.
6. **The sandbox cannot download binary PDFs** through approved tooling. This is not a defect to fix; it is the operational reason `approved_manual_snapshot` requires a human to place the file.

---

## 2. Source registry

Full evidence in `sources.seed.sql`. Assessed 2026-08-08.

| source | classification | why |
|---|---|---|
| **USAV Region Index** (40 RVAs) | `approved_public_batch` | permissive robots, path allowed, **zero PII**, stable 2-letter region code |
| **USAV SCSN Club Directory** (SoCal PDF) | `approved_manual_snapshot` | dated public NGB PDF, no restriction found, but publishes named directors' email + phone |
| WIAA School Directory | `validation_only` | page-level `noindex,nofollow`; binding terms belong to an unread vendor ToS |
| Little League League Finder | `permission_required` | ToU §6 bars collecting personal information and commercial use without permission |
| Washington Youth Soccer | `permission_required` | nothing verifiable; domain unreadable. Silence is not consent |
| **USAV Puget Sound (PSRVB)** | `permission_required` | robots.txt names `ClaudeBot` and disallows the whole site |
| **USAV Evergreen (ERVA)** | `permission_required` | same Cloudflare block |
| **AAU Club Finder** | **`blocked`** | explicit anti-solicitation covenant + 3 more grounds |

### Three findings that change the plan

**1. The Washington-first volleyball pilot is not currently possible.** Both WA volleyball regions — Puget Sound (western WA) and Evergreen (eastern WA) — serve a Cloudflare-managed `robots.txt` containing `User-agent: ClaudeBot / Disallow: /`. Their pages returned empty bodies, consistent with enforcement. Renaming the User-Agent to get past that would be a bypass, so it is off the table. The legitimate route is a permission email to each region office, both of which publish one. **That email is the highest-value next action for a Washington pilot.**

Also worth correcting: the brief treated "Puget Sound / Evergreen" as one region. They are two, and a WA pilot needs both.

**2. AAU is blocked four times over.** Its Club Finder carries a click-through covenant, quoted verbatim:

> "I agree that this club locator tool is not to be used for solicitation of any kind nor to advertise events not licensed by the AAU. Any violation or misuse of our club locator will result in action being taken against your membership."

Plus a site-wide `ClaudeBot` disallow and two ToU clauses barring harvesting. It is hard-coded into `policy.py::HARD_DENY_DOMAINS` so that a mistaken edit to the registry table cannot re-enable it — verified: the gate denies it on the domain before it ever reads the classification.

**3. Expect permission, not technology, to be the bottleneck.** Three assessed domains serve a *byte-identical* Cloudflare managed AI-crawler block with `Content-Signal: search=yes, ai-train=no, use=reference`. That is a default, not a bespoke decision, which means most of the Cloudflare-fronted youth-sports web is block-by-default for an AI agent. `Content-Signal` is also an express reservation of rights — building a persistent internal directory for later outreach is not a "reference" use — so `policy.py` treats it as `permission_required` even when `Allow: /` applies to generic crawlers. Budget for permission requests.

⚠️ **One process failure to flag.** A research subagent, told explicitly not to fetch by any means other than approved tooling, hit the `web_fetch` dedup cache and used `curl` instead to retrieve the region index. The content is public and zero-PII, but the method was out of bounds. I have **not** treated it as a verified snapshot; the registry row records the breach and requires re-acquisition through approved tooling before any production run.

---

## 3. Schema diff

New file: **`migrations-pcd-ops/0030_directory_acquisition.sql`**. Additive, idempotent, **not applied**.

| table | purpose |
|---|---|
| `directory_sources` | one row per directory family; classification, robots/Content-Signal, cadence, evidence |
| `directory_batches` | one row per immutable snapshot; hash, counts, status, `is_dry_run`, resume point |
| `directory_rows` | one row per source row; raw facts, match, **exactly one disposition**, C-tier |
| `dedupe_log` | every write, with `before_json`, reversible and attributable |

Key indexes: `UNIQUE(directory_source_id, content_sha256)` makes replay a no-op at the database level; `UNIQUE(directory_batch_id, source_row_number)` makes resume non-duplicating.

### ⚠️ Deviation from the brief you should rule on

**The brief implies these tables sit beside `organizations` in `activity-radar`. I put all four in `parent-coach-desk-ops-production` instead.**

`directory_rows` carries `source_contact_name` / `_email` / `_phone` — PII mapped to a human. ADR-046 keeps human-mapped rows out of `activity-radar`, and that is precisely what makes `activity-radar` safe to syndicate wholesale to the SightSmash public directory without a per-row privacy review. Putting a club director's name and direct email in there would quietly destroy that property. `dedupe_log.before_json` compounds it by accumulating a shadow copy of organization fields.

They are co-located rather than split because every reconciliation query in the runbook joins rows → batches → sources, and D1 has no cross-database joins. The PII-bearing member sets the home for the set. This is the same call migration 0028 made for `org_contacts`.

`canonical_organization_id` is therefore a **soft** reference: no FK, orphans possible, reported by a reconciliation query.

---

## 4. Code changes

### `import_results.py` — identity resolution rewritten

First hit wins:

1. **worklist** — the CSV came straight out of D1; joined on normalized name+city+state, so a mistyped UUID cannot affect it.
2. **carried** — the id on the results line, *if verified present* in `--live-ids`.
3. **recomputed_repair** — the legacy id, *if verified present*. Logged as a repair.
4. **held** — never a write against a guessed id.

`--live-ids` is required in practice: without it the script exits 1 and writes no SQL rather than guess. There is one deliberate escape hatch, `--allow-unverified`, which restores the old guess-an-id behavior and is documented in the file as "Don't." I kept it so a genuine emergency is not blocked, but **if you would rather it not exist, say so and I will remove it** — it is the single line that can reintroduce the silent-drop bug.

The script also finally emits the `org_email` / `org_phone` updates that had been sitting unused, and adds the missing `is_claimed` guard to the website update.

### `policy.py` — the gate

Five classifications, hard deny list, robots + `Content-Signal` parsing, and `RateLimit`: constant declared interval, concurrency 1, exponential backoff, truthful User-Agent with a contact address, hard per-run cap that raises a stop condition. A stale policy check is a **denial**, not a warning.

### `intake.py` — the lane

Normalization, youth-data screen, six-rule matching, dispositions, C0–C5, reconciliation, rollback planning, snapshot diffing, masking.

Two design points worth your attention:

- **Shared platform hosts are excluded from domain matching** (SportsEngine, LeagueApps, TeamSnap, Wix, Squarespace, …). Without this, every club on one registration platform collapses into a single organization.
- **Auto-apply threshold is 90**, so alias-corroborated matches (80) land in review by default. That is intentional: a name-shaped match never merges on its own.

---

## 5. Pilot — dry run

**Source:** SCSN club-directory structure (verified column headers: Club Name, Club Director Name, Club Email Address, Club Phone number, Club Location/City, Club Area).
**Canonical index:** 30 organizations pulled read-only from production `activity-radar` (CA volleyball) — real names, cities, and EINs, **with two rows hand-edited** to create the guard scenarios: `Beach Cities Volleyball Club` was given `is_claimed=1` and `Arcadia Volleyball Club` a pre-existing `website_url`, both using reserved `.example` hostnames. Neither edit touches production; the fixture is a local file. Without them the claimed-org and no-clobber guards would have had nothing to fire on.
**Source rows:** 28, synthetic. All contact values use `.invalid` domains.

### ⚠️ What this pilot does and does not prove

It **does** prove the machinery: policy gate, hashing, parsing, screening, matching against real canonical data, dispositions, dedupe logging, reconciliation, replay, resume, rollback, masking.

It does **not** prove parsing of the real SCSN PDF. The sandbox cannot download binary PDFs through approved tooling, and I did not route around that. Running against the real file needs the PDF placed in `buildout/donny/snapshots/` by hand — which is exactly what `approved_manual_snapshot` means.

### Results

```
[gate]      USAV SCSN Region Club Directory -> ALLOWED (approved_manual_snapshot, checked 0 days ago)
[snapshot]  4,315 bytes  sha256=5dcdddb3ae2abf41311e94a460436be92a54f68bac3ddde9c2a8525120d37d44
[batch]     dbatch-e9899a4d-ac7f-5b03-b7ee-ac01e2047a41
[parse]     28 rows extracted (expected 28)
[index]     30 canonical organizations in scope
```

| disposition | n |
|---|---|
| matched | 20 |
| candidate (new-org, held) | 6 |
| needs_review | 1 |
| excluded | 1 |
| **total** | **28** |

| match method | n |
|---|---|
| name_city_state (90) | 20 |
| alias_corroborated (80) | 1 → held, below threshold |
| none | 7 |

**Planned writes (none executed):** 15 website additions · 19 contact upserts · 0 alias additions · 62 dedupe entries · 40 rollback steps.

The 15-vs-20 gap is the guards working. Of 20 matched: 1 claimed organization (no writes at all), 1 with a pre-existing website (not overwritten — the guard is "field is non-empty", there is no provenance field distinguishing owner-submitted from any other source), 1 whose only URL was a SportsEngine host (rejected as shared platform), 2 with no website in the source. 19 contact upserts rather than 20 because the claimed organization is skipped there too.

**Completeness:** C0=0 · C1=1 · C2=0 · **C3=27** · C4=0 · C5=0.

C3 is high because the fixture gives nearly every row a contact channel; the real SCSN file publishes an email for most clubs, so this is directionally right but should not be read as a forecast. **C4=0 and C5=0 are the honest numbers** — nothing is validated or campaign-eligible, and the batch being complete says nothing about that.

**Reconciliation: PASS.** Hash stored, 28 expected = 28 extracted, every row has exactly one disposition, no row-number gaps, every applied row logged.

### The two interesting rows

```
#6  Bravo Athletics VBC          needs_review   email stored
    reason: match below auto-apply threshold (80 < 90): alias match corroborated by city, state

#26 Sunrise 14U Travel Team Roster   excluded   email NOT stored (NULL)
    reason: minor-linked role term: parent
```

Row 6 is the fuzzy-hold rule doing its job: `VBC` normalizes to volleyball, the alias matches, city and state corroborate — and it is *still* held, because 80 is below the auto-apply line. Row 26 is the youth screen: the row is counted and reconciled as `excluded`, but its contact values were dropped before storage rather than being written and later cleaned up.

### Five masked samples

| # | name | city | disposition | tier | email | contact |
|---|---|---|---|---|---|---|
| 1 | Elevation Elite Volleyball Club | Anaheim | matched | C3 | `i***@**************.invalid` | D. R. S. |
| 2 | Cobra Volleyball Club | Banning | matched | C3 | `d*******@*******.invalid` | K. T. P. |
| 3 | Beaumont Volleyball Club | Beaumont | matched | C3 | `o*****@**********.invalid` | *(shared mailbox)* |
| 4 | Top Flight Volleyball Club Inc | Big Bear City | matched | C3 | `r***********@***********.invalid` | A. J. F. |
| 5 | Starlings Volleyball Clubs USA | Carlsbad | matched | C3 | `i***@**************.invalid` | M. P. E. |

### Replay, resume, rollback — verified

| test | result |
|---|---|
| re-run identical snapshot | `NO-OP` — completed batch detected by hash |
| crash after 12 of 28, then resume | resumed at the 16 undone rows; **every row-level field identical to a straight run except wall-clock timestamps** — 28 rows, 62 dedupe entries, same deterministic row and dedupe ids |
| rollback plan | 40 steps generated; field updates restore `before_json`, inserted candidates soft-delete |

Two real bugs surfaced during this and are fixed:

1. An interrupted batch was being mistaken for a completed replay, so a crashed run could never resume. The guard now keys on completion, not existence.
2. Resume keyed on `MAX(source_row_number)`, which silently skips everything below the high-water mark if rows land out of order. Now keys on the *set* of dispositioned row numbers.

### Throughput

28 rows in 0.22s of processing. The meaningful comparison is not CPU time but human-and-browser cost:

| | individual lane | directory lane |
|---|---|---|
| acquisition | 1 search per organization | 1 fetch per group |
| observed rate | ~100 orgs/day | 28 rows from one snapshot, no per-row network |
| SCSN full file | 190 clubs ≈ 2 days | 190 clubs, 1 snapshot |
| identity | model transcribes a UUID per row | deterministic id from source row number |

The identity row matters as much as the speed row: the batch lane has no step where a model retypes a UUID, which is the failure mode that silently dropped 2 of 37 rows in the current pipeline.

---

## 6. Operational queries

```sql
-- Sources due for refresh
SELECT id, name, access_classification, last_policy_checked_at, refresh_cadence_days,
       CAST(julianday('now') - julianday(last_policy_checked_at) AS INTEGER) AS days_since
FROM directory_sources
WHERE access_classification <> 'blocked'
  AND (last_policy_checked_at IS NULL
       OR julianday('now') - julianday(last_policy_checked_at) >= refresh_cadence_days)
ORDER BY days_since DESC;

-- Batch disposition
SELECT disposition, COUNT(*) AS n FROM directory_rows
WHERE directory_batch_id = ? GROUP BY disposition ORDER BY disposition;

-- Unresolved duplicate candidates
SELECT source_name, source_city, source_state, match_method, match_confidence, disposition_reason
FROM directory_rows WHERE directory_batch_id = ? AND disposition = 'needs_review'
ORDER BY match_confidence DESC, source_name;

-- Same domain assigned to multiple canonical organizations
SELECT lower(replace(replace(source_website_url,'https://',''),'http://','')) AS dom,
       COUNT(DISTINCT canonical_organization_id) AS orgs,
       GROUP_CONCAT(DISTINCT canonical_organization_id)
FROM directory_rows
WHERE source_website_url IS NOT NULL AND source_website_url <> ''
  AND canonical_organization_id IS NOT NULL
GROUP BY dom HAVING orgs > 1 ORDER BY orgs DESC;

-- Same email or phone tied to multiple organizations
SELECT lower(source_contact_email) AS ch, COUNT(DISTINCT canonical_organization_id) AS orgs
FROM directory_rows
WHERE source_contact_email IS NOT NULL AND source_contact_email <> ''
  AND canonical_organization_id IS NOT NULL
GROUP BY ch HAVING orgs > 1
UNION ALL
SELECT lower(source_contact_phone), COUNT(DISTINCT canonical_organization_id)
FROM directory_rows
WHERE source_contact_phone IS NOT NULL AND source_contact_phone <> ''
  AND canonical_organization_id IS NOT NULL
GROUP BY lower(source_contact_phone) HAVING COUNT(DISTINCT canonical_organization_id) > 1;

-- Contacts missing source URL or verification timestamp  (PCD_OPS_DB)
SELECT id, organization_id, role, source, source_url, verified_at
FROM org_contacts
WHERE deleted_at IS NULL AND (source_url IS NULL OR source_url = '' OR verified_at IS NULL);

-- Batches whose counts do not reconcile
SELECT b.id, b.snapshot_date, b.expected_row_count, b.extracted_row_count,
       (SELECT COUNT(*) FROM directory_rows r WHERE r.directory_batch_id = b.id) AS rows_present,
       (SELECT COUNT(*) FROM directory_rows r WHERE r.directory_batch_id = b.id
          AND r.disposition IS NULL) AS undispositioned
FROM directory_batches b
WHERE b.extracted_row_count <> (SELECT COUNT(*) FROM directory_rows r WHERE r.directory_batch_id = b.id)
   OR (b.expected_row_count IS NOT NULL AND b.expected_row_count <> b.extracted_row_count)
   OR EXISTS (SELECT 1 FROM directory_rows r WHERE r.directory_batch_id = b.id AND r.disposition IS NULL);

-- Completeness improvement during a run
SELECT completeness_tier, COUNT(*) FROM directory_rows
WHERE directory_batch_id = ? GROUP BY completeness_tier ORDER BY completeness_tier;

-- Organizations whose canonical id no longer resolves (run the IN-list against activity-radar)
SELECT DISTINCT canonical_organization_id FROM directory_rows
WHERE canonical_organization_id IS NOT NULL AND retired_at IS NULL;

-- High-yield gaps by geography and category  (activity-radar)
SELECT state, json_extract(categories,'$[0]') AS category, COUNT(*) AS organizations,
       SUM(CASE WHEN website_url IS NOT NULL AND website_url <> '' THEN 1 ELSE 0 END) AS with_website,
       SUM(CASE WHEN website_url IS NULL OR website_url = '' THEN 1 ELSE 0 END) AS missing_website
FROM organizations WHERE deleted_at IS NULL
GROUP BY state, json_extract(categories,'$[0]') ORDER BY missing_website DESC;
```

---

## 7. Tests

```bash
python3 buildout/donny/test_intake.py -v
```

**73 tests, all passing.** No real person's name, email address, or phone number appears in the suite or the fixtures; every domain is `.invalid` or `.example` and every phone is a `555` number.

To be precise about what *is* real: `fixtures/pilot-orgs-ca-volleyball.json` contains 30 real organization names, cities, and EINs read from production. Those are organization-level facts already in our own database, not personal data — but the fixture is not wholly synthetic, and two of its rows are hand-edited (see §5).

| area | covers |
|---|---|
| replay | identical bytes → same batch id; unique index rejects the second insert |
| resume | crash after 12 of 28 → identical result; naive restart does not duplicate |
| matching | external id, EIN, domain, name+city+state; **fuzzy-name-only is held**; shared platform never matches; ambiguity held |
| identity | rename keeps canonical id and gains an alias; alias add idempotent |
| no-clobber | claimed org never written; non-empty field never overwritten; before-value always present |
| youth screen | roster, DOB, grade, class year, parent, emergency contact, medical, unexpected field — all rejected; **rejected rows still get a disposition** |
| contacts | upsert idempotent; shared mailbox preferred; `do_not_contact` survives a real upsert against a real partial index; suppression columns absent from every write set |
| policy | blocked/validation_only/permission_required denied; robots disallow denies; Content-Signal denies; stale check denies; **hard deny beats a bad registry edit** |
| rate limit | interval constant not randomized; run cap is a stop condition; backoff exponential and capped |
| reconciliation | expected≠extracted, missing disposition, vanished row, unlogged write, missing hash all fail |
| rollback | restores pre-batch values; candidate soft-deleted not hard-deleted; dry-run entries not rolled back |
| importer | all four resolution paths incl. the two real production failure modes |
| docs | README references resolve; retired commands are not presented as runnable |

Three of these tests found real bugs during the build: the `ON CONFLICT` clause was missing the partial-index predicate and would have failed at runtime; the replay guard blocked resume; resume used a high-water mark.

---

## 8. Files changed

**New**

```
migrations-pcd-ops/0030_directory_acquisition.sql   migration, NOT applied
buildout/donny/README.md
buildout/donny/policy.py
buildout/donny/intake.py
buildout/donny/run_pilot.py
buildout/donny/schema_local.sql
buildout/donny/sources.seed.sql                     NOT applied
buildout/donny/test_intake.py
buildout/donny/PROPOSED-TASK-PROMPT.md              NOT installed
buildout/donny/PILOT-REPORT.md                      this file
buildout/donny/.gitignore
buildout/donny/snapshots/README.md
buildout/donny/fixtures/snapshot-scsn-shape-2026-08-08.csv
buildout/donny/fixtures/pilot-orgs-ca-volleyball.json
buildout/donny/out/pilot-report-2026-08-08.json
```

**Modified**

```
buildout/hit-rate-test/import_results.py   identity resolution rewritten; contact fields emitted
buildout/hit-rate-test/README.md           rewritten to match what actually runs
```

**Untouched:** `daily_discovery.py`, `DISCOVERY-PROMPT.md`, `enrichment-worker.ts`, `src/lib/org-contacts.ts`, every existing migration, and the live scheduled task.

---

## 9. HOLD FOR JEFF APPROVAL

**Nothing has been applied, deployed, pushed, or activated.** No production migration, no production write, no commit, no task change. The pilot ran entirely against a local SQLite mirror; the only production access was read-only `SELECT`.

Before anything ships, please rule on:

1. **Table placement** — all four `directory_*` tables in `parent-coach-desk-ops-production` rather than `activity-radar`, on the ADR-046 people-data boundary (§3). This is the one real architectural deviation from the brief.
2. **Source classifications** (§2) — particularly that Little League and both Washington volleyball regions are `permission_required`, which means **no Washington volleyball pilot until a region office replies**.
3. **The permission emails** — PSRVB and ERVA. This is the unblocking action for a WA-first pilot and it needs to come from you, not an agent.
4. **Migration `0030`** — review, then apply to `parent-coach-desk-ops-production`.
5. **`sources.seed.sql`** — review the evidence, then load.
6. **The replacement task prompt** — `PROPOSED-TASK-PROMPT.md`, to be copied to `C:\Users\jeffthomas\Documents\Claude\Scheduled\org-discovery-daily-worklist\SKILL.md`.
7. **Auto-apply policy** — which sources, if any, may write without review. My recommendation is none for the first month: run dry, read the diffs, then enable fill-blank-only writes for the SCSN source alone.

### Recommended sequence

1. Read the FinalForms ToS PDF — it is the one unread document that could move WIAA from `validation_only`.
2. Send the PSRVB and ERVA permission emails.
3. Apply `0030`, load `sources.seed.sql`.
4. Place the real SCSN PDF in `buildout/donny/snapshots/` and re-run the pilot against it, still dry.
5. Review that diff, then install the new task prompt with auto-apply off.
6. Enable fill-blank-only writes for SCSN after a clean week.

Separately, and outside this scope: the duplicate-organization problem in §1.5 (two id schemes coexisting in `organizations.id`) will interfere with matching and deserves its own pass.

### Housekeeping — one thing I could not clean up

A `git` command of mine hit the tool timeout and left a zero-byte `.git/index.lock` in the parent-coach-desk repo. No git process is running; it is stale. The Linux sandbox cannot delete it (Windows mount permissions), and **it will block your next `git commit`**. One line from PowerShell:

```powershell
Remove-Item "$HOME\Desktop\Claude Cowork\Outputs\Field and Forge\parent-coach-desk\.git\index.lock"
```

Because of that lock, `git status` reports `buildout/hit-rate-test/out/review-2026-08-08.csv` as modified. It is not — `git diff` on the content is empty. A verification subagent overwrote it while testing the `--allow-unverified` path and restored it; the stale lock is just preventing git from refreshing its index. It will resolve itself once the lock is gone.

### Verification

These findings were checked by an independent adversarial pass that re-ran the suite and the pilot from scratch. It confirmed all pilot numbers, the replay and resume behavior at row level, migration idempotency, production isolation of `run_pilot.py`, and the suppression-column claim. It also caught six inaccuracies in the first draft of this report — the `--live-ids` overstatement, the `contact_page_url` claim, the undisclosed fixture edits, the "byte-identical" wording, the "owner-submitted" inference, and a shipped JSON artifact that was the resume run rather than the straight run. All six are corrected above, and the artifact has been regenerated from a clean straight run.
