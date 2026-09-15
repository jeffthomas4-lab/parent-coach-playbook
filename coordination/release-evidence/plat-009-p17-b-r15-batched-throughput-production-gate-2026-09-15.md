# CRM Gate 9C-P17-B-R15 batched production import throughput

Status: **AWAITING EXACT OWNER APPROVAL**

Recorded: 2026-09-15 America/Los_Angeles / 2026-09-15 UTC

## Purpose

Deploy the independently reviewed receiver and producer batch path so the already-running,
source-frozen historical organization import advances in ordered groups of at most 100 rather than
one event at a time. The gate preserves the existing run, source snapshot, source policy, contact
boundary, two-pass reconciliation contract, schedules, routes, domains, databases, queues,
bindings, and secrets. It creates no second run and performs no migration.

The production CRM is already usable as an owner-only conditional beta against organizations that
have arrived. This gate accelerates the remaining governed import; it does not redefine partial
delivery as data-complete.

## Exact frozen inputs

### Parent Coach Desk producer

- candidate: `12d2015cca1ebf66df540eb8c62c36f18dd4c60b`
- candidate tree: `04a64f2c061070cfd7fe0a1fac26a292e853bb54`
- producer adapter SHA-256:
  `66e3489d693b703cdaa9f678c56633a5a71eb109939684754e0b478695b475df`
- producer regression SHA-256:
  `6ef85e0741e51b4d8443c26ff6ec5120e28482c82a51e3a2d8387501cbbf4c35`
- scale-harness SHA-256:
  `4f6062f5b0650f7d62f7ad91ca860561cae4fb42f704cb9438f781593020d39a`
- production build artifact aggregate SHA-256:
  `2affffa6afb09beb74537afc5839dbd459f4dbb0ffcc47107fb6f1211740202b`
- enabled production manifest SHA-256:
  `3a0e5c3bb37309394c5e97076f32895b289f15462198ac0b42a87a043555ccc8`
- active and mandatory rollback version:
  `43244bc7-9300-4a9d-a9a6-e2da43aba6af`
- last recorded active deployment:
  `a2ce1e25-0c73-47c6-8542-9bc6c89e4ca4`

The producer build aggregate covers the complete `dist` artifact in sorted relative-path order and
excludes only `dist/server/.wrangler.crm-production-r15.json`, which is frozen separately above.
The manifest keeps both producer flags true, schedules `17 */6 * * *` and `* * * * *`, and every
existing non-secret production binding.

### CRM receiver

- candidate: `7358b69328ab4be707a7424788a09794e7a01882`
- candidate tree: `ca2a5486d4e69ee063c9783ab0df2ac3db559d97`
- receiver route SHA-256:
  `f0ccbbf2cc23949a5be01670deed82a53ab6e70bc8df91d7d66fd8251c5be0f2`
- receiver regression SHA-256:
  `bf78e15082f9fb317d6ed7ce478719892802b3b6300f0b64d9fa836eb14c1782`
- production resource-receipt byte SHA-256:
  `090e289687fd1277b5747faf1daff8999e3d3d3a854fc2dc7143440aad316b09`
- production resource-receipt canonical SHA-256:
  `d5a83c5b95ce2d977ff83019b3a01faaab77a84118e9eea8122bbff7c913499c`
- generated production configuration SHA-256:
  `2337fe5d2bfb89c5e1a994d602ae8a0d47d6fa677f930ec0dbcaddb1c9ae9ada`
- production build artifact aggregate SHA-256:
  `f6e83ec3e18c037315b083a72d395c4f978ca267f1b9df20db7e86de6121fa32`
- active and mandatory rollback version:
  `d969492c-5b4c-4811-895d-80706836b1d5`
- active and mandatory rollback deployment:
  `3d883829-b078-487c-9784-e67ef55ad59c`

The receiver artifact aggregate uses the `field-forge-crm-build-artifact-v1` framing over every
file in the exact production-config Wrangler dry-run output, sorted by relative path. The generated
configuration retains the production D1, private R2 bucket, jobs Queue and dead-letter Queue,
consumer batch size 5, both existing crons, custom domain, Access audience, Turnstile public site
key, seven secret declarations, and all existing non-secret variables.

### Existing frozen import

- Cloudflare account: `d42a1d557371024c855bc44a2c4aa28c`
- production directory D1: `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`
- production PCD operations D1: `b38d5f37-54df-4e0f-9706-023edc12c7fe`
- production CRM D1: `9ea593e2-b5ca-40d8-b7fa-8172e02edb3d`
- run:
  `pcd-backfill:a236b19b5572d5468964cd184eb248e5c04f4809a2abc8668d6689f30d16b64b`
- activation boundary: `1789224552000`
- manifest SHA-256:
  `deae5828ee500bf0cb2f50efd0b4df27eabb3ec0162da6f2b4a92108d4b06e5b`
- directory snapshot bookmark:
  `00004981-00000000-000050e4-85a637987da722502b36726b686d23b9`
- operations snapshot bookmark:
  `000000d6-00000000-000050e4-57c6d2d705be38b834a24e9695066645`
- frozen inventory: 198,287 organizations and 141 contacts
- source policy: `pcd-public-professional-v1`
- producer workspace: `pcd-activity-radar`
- target workspace: `ws-sightsmash`
- source: `source-pcd-activity-radar`

The last authenticated checkpoint before this gate was authored had all 198,287 organizations and
all 141 contacts scanned with terminal dispositions, 93,558 delivered organization events,
104,729 queued organization events, zero leased or dead events, and reconciliation pass 1 not yet
started. The receiver concurrently held 93,533 organizations and receipts; the 25-event difference
was an in-flight bounded producer/receiver observation, not a declared final parity point. These
counts are historical lower bounds only. The execution preflight must observe monotonic progress
or a completed run, never regression.

## Local verification already completed

- PCD strict Astro check passed across 655 files with zero errors and zero warnings.
- All 85 PCD CRM adapter tests passed across the full run plus the separately rerun historical
  slow test; the only initial issue was that test exceeding the suite's ten-second timeout, not an
  assertion failure.
- CRM `npm run check` passed: deployment configuration, all 29 migration portability checks,
  locked SBOM, generated types, strict TypeScript, 22 release-tool tests, 344 Worker tests across
  37 files, UI contract, and dry build.
- The exact CRM production configuration dry run passed at 1,369.33 KiB raw / 240.21 KiB gzip.
- The exact PCD enabled production manifest validated and its Wrangler dry run passed with the
  production D1s, R2, KV, rate limits, Service Binding, assets, enabled flags, source boundary,
  bookmarks, policy, manifest, and schedules intact.
- The complete 200,000-organization local scale rehearsal passed before the final set-based and
  safety-order refinements. Those final refinements are covered by focused and full suites; the
  200,000-row rehearsal was not rerun after them and is not represented otherwise.

Independent QA and Security returned PASS after proving that organization batches cannot commit
their projection clock backward, a later contact-deletion safety event does not block an earlier
organization batch, malformed local rows are isolated precisely, global sequence uniqueness
remains enforced, and forced late failures atomically roll back clocks, organizations, workspace
projections, receipts, and audits. Efficiency returned PASS within the 40-query budget. The
simplicity pass found no Critical, High, or Medium item.

Dependency decision: npm, PyPI, and GitHub were searched live. `p-limit` and similar concurrency
helpers were rejected because the required path is one ordered, bounded batch and existing platform
primitives are smaller and safer. No dependency was added.

## Contact and communication boundary

All 141 frozen contacts have terminal non-actionable dispositions. None has the required current
public-professional review. The source permits only `identity_projection` and prohibits
`infer_consent` and `automated_sending`; zero people, contact points, contact projections, consent
events, or contact channels may be created by this gate.

The producer batch endpoint accepts organization-upsert events only. Contact deletion retains
priority on the existing single-event safety path. Any newly eligible contact, contact projection,
copied channel, or communication row is an immediate abort and rollback condition.

## Exact one-attempt execution sequence

1. Require authenticated Wrangler. Recompute every candidate, tree, source, test, artifact,
   configuration, manifest, run, boundary, bookmark, database, workspace, source, and policy value
   above. Permit only the five known PCD build-generated working-tree paths while hashing; stage,
   reset, clean, absorb, or deploy none of them.
2. Use direct `d1 execute --command` aggregate SELECTs only. Each must report `success=true`,
   `changes=0`, `rows_written=0`, and `changed_db=false`. Require the exact single active producer
   and receiver rollback versions, both exact schedules on `parent-coach-desk`, every existing route
   and domain, unchanged non-secret bindings and secret-name sets, both producer flags true, the
   exact run/boundary/manifest/bookmarks/policy, no stale lease, no dead or exhausted event, no
   rejection or halt, monotonic delivery, zero bad reconciliation finding, and the zero-contact
   boundary. If the run has already completed, skip both deploys and perform only final readbacks.
3. Capture fresh pre-action Time Travel bookmarks for the three exact D1 databases. They authorize
   no restoration.
4. Upload exactly one uniquely tagged inactive `field-forge-crm` version from receiver candidate
   `7358b69328ab4be707a7424788a09794e7a01882` and the exact generated production configuration.
   Inspect it before traffic and require byte-for-byte non-secret binding parity, exact handlers,
   exact custom domain configuration, exact Queue consumer settings, and the unchanged seven secret
   names without reading values.
5. Promote that exact receiver version alone to 100 percent. Require immediate and delayed health,
   Access, owner workspace, custom-domain, Queue, scheduled-handler, cross-workspace isolation, and
   non-secret binding readbacks. Do not seed, migrate, or change a resource.
6. Upload exactly one uniquely tagged inactive `parent-coach-desk` version from producer candidate
   `12d2015cca1ebf66df540eb8c62c36f18dd4c60b` and the exact enabled manifest. Inspect it before
   traffic and require the exact production bindings, `CRM_ADAPTER` Service Binding, both true
   producer flags, frozen boundary/bookmarks/policy/manifest, schedules, routes, domains, and
   unchanged secret-name set without reading values.
7. Promote that exact producer version alone to 100 percent. Do not apply a trigger, route, domain,
   Queue, D1, R2, KV, Access, Turnstile, provider, or secret configuration change.
8. Observe at least three complete minute boundaries. Require ordered batches of at most 100,
   exact per-event acknowledgements, monotonic delivered and receiver organization counts, no
   missing sequence, no backward organization projection clock, no duplicate receipt, no stale
   lease, no dead/exhausted/rejected event, no reconciliation finding, and no contact row or channel.
9. Continue aggregate-only bounded monitoring until the existing run is `completed`, pending,
   retry, leased, dead, and exhausted counts are zero, both reconciliation passes are complete,
   every frozen organization and contact has one terminal disposition, eligible organization events
   equal durable receiver receipts, and every missing, duplicate, stale, unauthorized, mismatch,
   contact, and cross-workspace finding is zero.
10. Capture fresh post-action bookmarks and record exact candidates, versions, deployments,
    bindings, routes, domains, schedules, import checkpoint, terminal accounting, parity,
    reconciliation, contact boundary, health, and rollback identities in source-controlled receipts.
    Then stop.

## Mandatory rollback and abort thresholds

Abort before upload on any candidate, tree, source, test, artifact, configuration, account,
database, version, deployment, binding, route, domain, schedule, secret-name, run, boundary,
bookmark, source-policy, migration-ledger, workspace, source inventory, import-health, or contact
boundary mismatch. Abort if the active lease is stale, any dead/exhausted/rejected event exists,
accounting regresses, a reconciliation finding appears, or any contact becomes projectable.

If the receiver upload, inspection, promotion, immediate readback, or health checks fail, restore
CRM version `d969492c-5b4c-4811-895d-80706836b1d5` alone to 100 percent and stop before producer
upload.

After producer promotion, any failed binding, batch, acknowledgement, ordering, delivery,
reconciliation, isolation, or contact check requires, in order:

1. restore PCD version `43244bc7-9300-4a9d-a9a6-e2da43aba6af` alone to 100 percent;
2. require the existing schedules, routes, domains, flags, boundary, manifest, and bindings;
3. restore CRM version `d969492c-5b4c-4811-895d-80706836b1d5` alone to 100 percent; and
4. repeat aggregate-safe database, import, health, isolation, and contact-boundary readbacks.

Do not mutate a database, replay or delete an event, change a flag or boundary, or use Time Travel
restoration as routine rollback. A database repair or restoration requires a separate
incident-specific decision.

## Exclusions

No migration; no new run, source snapshot, source scan, boundary, manifest, policy, workspace, or
producer-flag change; no trigger, Queue, R2, KV, D1, Access, Turnstile, DNS, route, domain, binding,
provider, or secret change; no secret-value readback; no contact review, activation, projection, or
exposure; no consent or suppression decision; no export; no campaign approval; no email, SMS, or
other send; no privacy-policy text; no money action; no production deletion; no automatic Time
Travel restoration; and no data movement outside the exact governed PCD-to-CRM organization
projection.

## Performance review

- approximate algorithmic complexity: producer `O(n log n + B)` and receiver `O(n + B)`, with
  `n <= 100` and body size `B <= 2 MiB`
- DB query count on the 100-organization primary path: producer 6 D1 statements and receiver 10 D1
  statements, 16 combined and below the 40-query budget
- external API calls: one bounded `CRM_ADAPTER` Service Binding call per organization batch; no
  third-party call on the data path
- queue jobs created: zero by the producer/receiver organization batch path
- expected memory behavior: `O(n + B)`, bounded by 100 events and 2 MiB
- likely scaling bottleneck: the one-batch-per-minute ordered producer schedule; a full 200,000-row
  run has a 33.3-hour delivery lower bound at 100 organizations per minute, followed by bounded
  reconciliation work. The last recorded remaining queue alone represented about 17.5 hours of
  minimum delivery time before the two reconciliation passes.

## Approval sentence

> Approve CRM Gate 9C-P17-B-R15 exactly as recorded at evidence commit `<EVIDENCE_COMMIT>`, using
> PCD candidate `12d2015cca1ebf66df540eb8c62c36f18dd4c60b`, PCD build artifact aggregate
> `2affffa6afb09beb74537afc5839dbd459f4dbb0ffcc47107fb6f1211740202b`, PCD enabled production
> manifest SHA-256 `3a0e5c3bb37309394c5e97076f32895b289f15462198ac0b42a87a043555ccc8`, CRM candidate
> `7358b69328ab4be707a7424788a09794e7a01882`, CRM build artifact aggregate
> `f6e83ec3e18c037315b083a72d395c4f978ca267f1b9df20db7e86de6121fa32`, CRM generated
> production configuration SHA-256
> `2337fe5d2bfb89c5e1a994d602ae8a0d47d6fa677f930ec0dbcaddb1c9ae9ada`, mandatory rollback
> versions `43244bc7-9300-4a9d-a9a6-e2da43aba6af` and
> `d969492c-5b4c-4811-895d-80706836b1d5`, and the exact run, boundary, manifest, database IDs,
> execution sequence, monitoring to completion, rollback, abort thresholds, contact boundary, and
> exclusions recorded there.
