# PLAT-009 historical backfill manifest binding

Status: **LOCAL PASS; REMOTE HOLD**  
Date: 2026-09-05  
PCD code candidate: `8923d9767fc2dedffc47bc962308533f0e16c33e`  
PCD tree: `c5d40b1fcd5705ca0432c596546804610da25853`

## Outcome

Historical CRM projection can no longer create or resume a run from only a workspace pair and
timestamp. When both producer switches are true, runtime now requires and persists the exact
approval-manifest SHA-256, directory and ops source D1 identities, CRM target D1 identity, both
source Time Travel bookmarks, and the contact-policy version. These identities, the workspace
pair, and the second-aligned boundary determine the immutable run ID and are rechecked before a
run can lease, advance a cursor, or enqueue an event.

Migration `0042_crm_backfill_approval_manifest.sql` adds the retained approval identities and a
partial unique index on every nonempty manifest hash. The index makes one manifest authorize only
one historical run and target, including under concurrent `INSERT OR IGNORE` attempts. Empty
upgrade defaults remain outside the index, but runtime never creates or accepts an empty approval.

Migration SHA-256: `59a191e9ff8d1629117be50ad2b55d2b0788c01077c1c1624e1c07341de65566`  
One-file migration aggregate (`filename sha256\n`):
`46dc023a1560f421b098d8985b6caf065f9ae6931613d643e79dfa0d6baef22d`

## Retained red-first evidence

1. The missing-manifest regression resolved on the prior code instead of rejecting; after repair it
   rejects before a backfill-run row exists.
2. Cold QA found that changing only the target workspace reused the same manifest to create a
   second run. The reversed regression failed on that vulnerable behavior. After the database
   uniqueness repair it rejects and preserves exactly the original run and outbox event.

## Verification

- canonical isolated CRM adapter integration suite: **69/69 PASS** in 215.81 seconds;
- migration-upgrade/index suite: **1/1 PASS** in single-worker Miniflare isolation;
- focused approval and retarget regressions: **7/7 PASS**;
- `npx tsc --noEmit`: **PASS**;
- `git diff --check`: **PASS** before the code candidate was committed;
- independent QA re-review: **CLEAN**, including sequential/concurrent retarget and valid resume;
- independent Security/data-integrity re-review: **CLEAN**;
- independent Efficiency: no runtime finding; its low test-only PRAGMA cleanup was adopted;
- independent Simplicity: **CLEAN**, no behavior-preserving deletion identified.

The default unit runner was also attempted. Its 5-second per-test ceiling timed out four existing
Miniflare-heavy cases and caused one downstream assertion failure. The repository classifies this
adapter as an isolated integration suite with a 30-second per-test ceiling; the canonical run above
passed every case. A separate default fork once exited before executing the migration test; the
documented single-worker Miniflare rerun passed. Neither event is represented as product green or
product red.

## Performance review

- approximate algorithmic complexity: `O(1)` approval validation per historical tick; unchanged
  `O(o + c + e)` full-run behavior;
- DB query count on primary path: +0 runtime statements; the existing indexed run lookup/insert
  reads and stores seven additional bounded values;
- external API calls: +0;
- queue jobs created: +0;
- expected memory behavior: `O(1)`, a fixed sub-kilobyte approval object and one SHA-256 input;
- likely scaling bottleneck: unchanged D1/outbox receiver throughput and audit-write volume, not
  manifest validation.

## Boundary

This evidence authorizes nothing remotely. Migration `0042` is unapplied; candidate `8923d976` is
undeployed; both staging producer switches remain false; no activation boundary or approval
manifest variables were set; and no organization/contact data was copied. Production changes,
exports, sends, policy text, secrets, providers, and resource changes remain excluded.
