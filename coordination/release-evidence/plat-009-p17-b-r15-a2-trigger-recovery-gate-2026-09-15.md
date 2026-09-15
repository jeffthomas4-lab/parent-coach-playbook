# CRM Gate 9C-P17-B-R15-A2 trigger recovery and batched import completion

Status: **AWAITING EXACT OWNER APPROVAL**

Recorded: 2026-09-15 UTC

## Purpose

Restore the two frozen `parent-coach-desk` production Cron triggers without changing any route or
domain, prove exact R13 can advance the safely stalled historical import, then complete the already
reviewed R15 receiver/producer promotion and bounded aggregate-only monitoring. This is the narrow
recovery successor to the truthfully aborted R15-A1 execution.

## Frozen evidence and current baseline

- R15-A1 approval evidence: `3a6ef6358c5a0bfcb883ac1efab86eeb48a0ac1b`;
- R15-A1 execution and rollback evidence: `fc7c13ce4f6d284c4c32063c8efb3c50111e6a09`;
- producer candidate: `12d2015cca1ebf66df540eb8c62c36f18dd4c60b`;
- producer tree: `04a64f2c061070cfd7fe0a1fac26a292e853bb54`;
- producer build aggregate:
  `2affffa6afb09beb74537afc5839dbd459f4dbb0ffcc47107fb6f1211740202b`;
- enabled producer manifest hash:
  `3a0e5c3bb37309394c5e97076f32895b289f15462198ac0b42a87a043555ccc8`;
- receiver candidate: `7358b69328ab4be707a7424788a09794e7a01882`;
- receiver tree: `ca2a5486d4e69ee063c9783ab0df2ac3db559d97`;
- receiver build aggregate:
  `f6e83ec3e18c037315b083a72d395c4f978ca267f1b9df20db7e86de6121fa32`;
- receiver generated config hash:
  `2337fe5d2bfb89c5e1a994d602ae8a0d47d6fa677f930ec0dbcaddb1c9ae9ada`;
- already-uploaded and inspected inactive receiver version:
  `f4138b4a-aed1-4501-84f2-86f250e713d2`;
- receiver version tag: `crm-p17b-r15-receiver-7358b69328ab`;
- current and rollback receiver version: `d969492c-5b4c-4811-895d-80706836b1d5`;
- corrective and rollback producer R13 version:
  `43244bc7-9300-4a9d-a9a6-e2da43aba6af`;
- current R13 deployment: `01b7adea-c2a1-401f-9f71-f9a6820ccd5d`;
- current receiver rollback deployment: `23bb4e43-17d5-4f00-8715-d5465e5b4349`;
- production directory D1: `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`;
- production PCD operations D1: `b38d5f37-54df-4e0f-9706-023edc12c7fe`;
- production CRM D1: `9ea593e2-b5ca-40d8-b7fa-8172e02edb3d`;
- run: `pcd-backfill:a236b19b5572d5468964cd184eb248e5c04f4809a2abc8668d6689f30d16b64b`;
- activation boundary: `1789224552000`;
- backfill manifest hash:
  `deae5828ee500bf0cb2f50efd0b4df27eabb3ec0162da6f2b4a92108d4b06e5b`;
- frozen inventory: 198,287 organizations and 141 contacts;
- source policy: `pcd-public-professional-v1`;
- producer workspace: `pcd-activity-radar`;
- target workspace: `ws-sightsmash`;
- source: `source-pcd-activity-radar`.

The authenticated post-rollback baseline is 94,887 delivered organization events and 103,400
pending organization events, with zero retry, leased, dead, or exhausted events, no run lease, no
reconciliation failure or halt, and zero people, contact points, workspace contacts, consent
events, or contact clocks. Exact R13 and the rollback receiver are each active alone at 100 percent.
The inspected R15 receiver version remains inactive. No R15 producer version has been uploaded.

The R15-A1 live tail captured a Worker-handled HTTP invocation on exact R13 but no scheduled
invocation across the following complete minute boundary. A subsequent authenticated, read-only
Cloudflare Dashboard inspection made the cause definitive: `parent-coach-desk` exposes exactly one
Cron trigger, described as "At 17 minutes past the hour, every 6 hours." The required `* * * * *`
minute trigger is absent. This exact one-trigger remote state is the trigger-recovery predicate.

## Exact one-attempt execution sequence

1. Recompute every candidate, tree, source/test, build aggregate, generated configuration,
   manifest, version, deployment, account, database, binding, secret-name, run, boundary,
   bookmark, source-policy, workspace, source-inventory, import-health, parity, reconciliation, and
   zero-contact value above. Direct D1 reads must be `d1 execute --command` SELECTs returning
   `success=true`, `changes=0`, `rows_written=0`, and `changed_db=false`. Permit monotonic progress
   above 94,887 only when every accounting and parity equation remains exact.
2. Capture fresh pre-action Time Travel bookmarks for all three exact production D1 databases.
   They authorize no restoration.
3. Apply exactly the frozen Cron expressions `17 */6 * * *` and `* * * * *` to
   `parent-coach-desk` using the frozen enabled production manifest and the command shape already
   dry-run locally:

   `wrangler triggers deploy --config dist/server/.wrangler.crm-production-r15.json --name parent-coach-desk --triggers "17 */6 * * *" "* * * * *"`

   Pass no `--routes` or `--route` option. Retain every existing route and custom domain exactly.
   Do not change code, traffic, bindings, variables, secrets, databases, Queues, R2, KV, Access,
   Turnstile, DNS, or producer flags in this step.
4. Require exact R13 to remain active alone at 100 percent with its `CRM_ADAPTER` Service Binding,
   both true producer flags, frozen boundary/bookmarks/policy/manifest, unchanged routes/domains,
   and unchanged secret-name set. Across the next complete minute boundary, capture a scheduled
   invocation and require delivered count and exact receiver parity to advance monotonically with
   no retry, lease, dead/exhausted event, finding, or contact row. If it does not, stop before any
   receiver or producer version action.
5. Re-inspect inactive receiver version `f4138b4a-aed1-4501-84f2-86f250e713d2` and require its
   exact tag, handlers, bindings, seven secret names, custom domain, existing Queue consumer batch
   size 5, schedules, and generated-config parity. Promote it alone to 100 percent. Require
   immediate and delayed Access, owner-workspace, public-boundary, tenant-isolation, Queue,
   scheduled-handler, binding, and aggregate parity readbacks.
6. Recompute the exact producer artifact and enabled manifest once more. Upload exactly one
   uniquely tagged inactive `parent-coach-desk` version from candidate
   `12d2015cca1ebf66df540eb8c62c36f18dd4c60b`, using tag
   `crm-p17b-r15-producer-12d2015cca1e`. Inspect it before traffic and require exact production
   bindings, the `CRM_ADAPTER` Service Binding, both true producer flags, frozen import values,
   both restored schedules, unchanged routes/domains, and unchanged secret-name set.
7. Promote that exact R15 producer version alone to 100 percent. Do not apply another trigger,
   route, domain, Queue, D1, R2, KV, Access, Turnstile, provider, or secret configuration change.
8. Observe at least three complete minute boundaries. Require ordered batches of at most 100,
   exact per-event acknowledgements, monotonic delivered and receiver counts, no sequence gap,
   backward clock, duplicate receipt, stale lease, retry, dead/exhausted event, rejection,
   reconciliation finding, contact row, or channel.
9. Continue bounded aggregate-only monitoring until the run is `completed`, all pending/retry/
   leased/dead/exhausted counts are zero, both reconciliation passes are complete, every frozen
   subject has one terminal disposition, eligible organization events equal durable receiver
   receipts, and every missing/duplicate/stale/unauthorized/mismatch/contact/cross-workspace
   finding is zero.
10. Capture post-action bookmarks and commit exact trigger, version, deployment, binding,
    route/domain, import, parity, reconciliation, contact-boundary, health, and rollback receipts.

## Mandatory rollback and abort thresholds

Abort before mutation on any frozen identity, hash, version, deployment, binding, route/domain,
secret-name, database, run, boundary, bookmark, policy, inventory, accounting, reconciliation, or
contact-boundary mismatch.

If trigger application or the next-minute R13 proof fails, keep R13 and receiver rollback version
`d969492c-5b4c-4811-895d-80706836b1d5` alone at 100 percent and stop before receiver promotion or
R15 producer upload. An unexpected route/domain change is an incident and requires immediate stop;
this gate does not authorize an inferred route repair.

If receiver inspection, promotion, health, or parity fails, restore receiver version
`d969492c-5b4c-4811-895d-80706836b1d5` alone at 100 percent and stop before R15 producer upload.

After R15 producer promotion, any binding, batch, acknowledgement, ordering, delivery,
reconciliation, isolation, or contact failure requires, in order: restore exact R13 alone to 100
percent; require its restored schedules, routes/domains, flags, boundary, manifest, and bindings;
restore receiver version `d969492c-5b4c-4811-895d-80706836b1d5` alone to 100 percent; repeat all
aggregate-safe readbacks; then stop.

No database mutation, event replay/deletion, flag/boundary change, or Time Travel restore is a
rollback action under this gate.

## Exclusions

No migration; no new run, source snapshot, source scan, boundary, manifest, policy, workspace, or
producer-flag change; no Queue, R2, KV, D1, Access, Turnstile, DNS, provider, binding, route,
custom-domain, or secret change; no secret-value readback; no contact review, activation,
projection, channel, consent, inference, export, send, or privacy-policy text; no production data
copy outside the existing governed import. The only non-versioned remote mutation is the exact two
Cron expressions in step 3.

## Exact approval text

> Approve CRM Gate 9C-P17-B-R15-A2 exactly as recorded at evidence commit `<EVIDENCE_COMMIT>`,
> including its exact trigger recovery, frozen candidates and versions, execution sequence,
> mandatory rollbacks, abort thresholds, contact boundary, and exclusions.
