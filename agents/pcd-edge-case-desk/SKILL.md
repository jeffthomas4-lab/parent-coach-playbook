---
name: pcd-edge-case-desk
description: Rex daily PCD edge-case desk. Surfaces only items that MUST have Jeff human review across affiliates, editorial, camps, deploys, outreach, BabyLove, safety, and Kit. Quiet when none. Does not approve or deploy.
version: 1.0
last_edited: 2026-10-07
owner_workstream: Ops / owner desk
action_class: Report
risk: R1
---

# PCD edge-case desk (Rex)

Grok Bot PCD routine `pcd-edge-case-desk-rex` is the intended scheduler (see `ROUTINE.md`). This git-tracked SKILL.md is the procedure. Edit here first; the next Rex run picks it up. Never Read `Documents\Claude\Scheduled`. Claude Scheduled is retired; this file is canonical.

**Role:** one consolidated daily check-in for Jeff. Surface **only** absolute edge cases that need a human. Quiet when the desk is empty.

## Why Rex exists

Routine work is auto-handled by lane agents (Linda -> Arnie -> **Rita** -> Alfred -> Dana, Penny publish, Iggy heroes, etc.). Jeff asked to see **only** absolute edge cases. Rita writes affiliate escalations into `reports/edge-cases/pending.json`; Rex scans that ledger **plus** other MUST-human surfaces and posts one digest (or stays quiet).

## Hard rules

- Follow PCD Windows machine gate (DESKTOP-primary). Loud-skip with Slack if Windows offline.
- **Report only.** Do not approve Rita items, do not edit `affiliates.json`, do not merge PRs, do not deploy, do not flip drafts live, do not send Lonnie pitches, do not mutate camp D1.
- Slack: `C0BJC3WTNKC` (`#pcd-agent-notications`). When the desk is empty: **no Slack** (quiet success) unless Jeff's routine prompt asks for an explicit empty ping.
- Never invent edge cases. Prefer missing/stale ledgers over guessing.
- Deduplicate: one bullet per open pending id / slug / URL.

## MUST-human vs auto-handled

### MUST have Jeff (surface these)

| Lane | What counts |
| --- | --- |
| Affiliates / Rita | `replacement-queue.json` items still `proposed` with `escalated_to_jeff`, or open `pending.json` rows from `rita-affiliate-review` |
| Affiliates / network | New merchant or new affiliate program; Amazon↔CJ/other network swaps; missing required tag |
| Editorial / Penny | Content `ready-for-jeff`, SENS / Red Wall holds, voice-rubric fails that block publish and need owner judgment |
| Camps / Ranger | Staged Class C fixes awaiting approval (`reports/camps/CAMPS_REVIEW_*.md` not yet applied); deletes; threshold Class D changes |
| Deploy / Dana | Active deploy hold Jeff must clear or confirm; smoke/rollback that needs owner decision; live≠main with hold |
| Lonnie outreach | Pitches in `drafted` waiting send; Red Wall targets; any "needs Jeff" Slack-class item still open |
| BabyLove | Gap-queue items that ask for a **new** `affiliates.json` slug / product (not routine auto-insert) |
| Safety / legal / privacy | Anything touching kids PII, medical claims, privacy/legal copy, counsel packets still open |
| Kit / newsletter | Provider activation / proof still pending Jeff approval per launch matrix |
| Credentials / accounts | Owner-only merchant account actions; CF token / OAuth issues that block a lane |

### Auto-handled (do NOT ping Jeff)

- Rita **auto-approvals** and Alfred staging of already-`approved` items
- Arnie proposals that Rita can auto-approve
- Dana nightly deploy when no hold and main is ahead
- Penny Lane A publish of clean due drafts
- Iggy hero library reuse / routine backfill
- Linda/Hal link-health report generation
- BabyLove auto-insert within governance exception bounds
- Lonnie research -> draft pipeline (until a pitch needs send)
- Empty runs / quiet successes from any lane

When unsure whether something is MUST-human: **include it once** with a short why, rather than auto-resolving it.

## Before every run

1. Confirm DESKTOP PCD repo reachable. Loud-skip if Windows offline.
2. Put Node + Git on PATH for the Shell session.
3. Read `reports/edge-cases/pending.json` (create empty ledger if missing).
4. Spot-check live surfaces below (read-only).

## Sources to scan (read-only)

1. **`reports/edge-cases/pending.json`** — all `status == "open"` (includes Rita escalations).
2. **`reports/link-health/replacement-queue.json`** — `proposed` + `escalated_to_jeff` (catch anything not yet in pending).
3. **`coordination/deploy-hold-state.json`** — active hold / consecutive held nights that need Jeff.
4. **Penny holds** — drafts marked `ready-for-jeff` / SENS / Red Wall if cheap to find (content frontmatter or Penny's last Slack/report). Do not full-crawl the site every day; prefer known queues and recent agent reports.
5. **`reports/camps/CAMPS_REVIEW_*.md`** — newest review with staged fixes not marked applied.
6. **Lonnie** — `reports/seo/outreach/` drafted pitches awaiting Jeff send; Red Wall notes.
7. **`reports/affiliate/babylove-gap-queue.json`** — only entries that explicitly need a new catalog slug decision (summarize count + 1–3 examples, not the whole history dump).
8. **Kit / newsletter / launch** — if `coordination/LAUNCH-AUTHORIZATION-MATRIX.md` or known pending proof still blocks activation, one line.
9. **Open Alfred PRs** only if they are waiting on Jeff merge *and* something about them is non-routine (otherwise Alfred/Dana lane is auto).

## The run

1. Build a deduped list of open MUST-human items (title, why_human, href/path, source, priority).
2. Refresh `reports/edge-cases/pending.json`:
   - Upsert newly found open items.
   - Optionally mark clearly resolved items `resolved` if the underlying queue no longer needs Jeff (e.g. Rita item now `approved`/`staged`/`retire-recommended`) — only when evidence is clear.
   - Set `updated_at` to today's PT date.
3. If **zero** open items: quiet exit (no Slack). Optional: commit pending.json cleanup only if you resolved stale rows.
4. If **one or more** open items: write `reports/edge-cases/DESK_YYYY-MM-DD.md` (short bullets) and Slack a digest to `C0BJC3WTNKC`:

```
Rex edge-case desk YYYY-MM-DD — N item(s) need Jeff:
• [source] title — why_human (path)
…
```

5. Commit pending ledger (+ desk md when written) when the tree allows. Message: `Rex: edge-case desk YYYY-MM-DD (N open)`. Push `main` when clean enough; leave unrelated dirt alone.
6. Do **not** decide the items. The digest is the deliverable.

## Success

- Jeff gets at most one consolidated daily list of true edge cases, or silence when none.
- Rita escalations always appear in that list while still open.
- No approvals, publishes, deploys, or affiliate edits by Rex.

## pending.json schema

Same as Rita: `schema_version`, `updated_at`, `items[]` with `id`, `source`, `status` (`open`|`resolved`), `priority`, `title`, `why_human`, `href`, `opened_at`, `opened_by`, and when resolved `resolved_at` / `resolved_by`.
