# PLAT-009 full CRM cross-repository verification

Status: **PASS-LOCAL / HOSTED PILOT HOLD / FULL TRANSFER HOLD**

Recorded: `2026-09-06T16:18:04Z`

## Exact identities

- PCD producer candidate: `f1bc696720d65c578b513165e2f62756da2fe2f5`
- CRM receiver candidate: `d810612d5c8f55f97e7e04596cca2af4128049eb`
- PCD evidence branch checkpoint before this receipt:
  `54fb38ce8458032534e0007b3a484a993e94a11e`
- expired synthetic packet boundary: `1788709988000`
- expired packet aggregate:
  `7bc2f2a71c9cb3de729143c8a38fbb0b13975efcd6f792b6d27558684d15a520`

The exact receiver candidate was checked in a clean detached worktree. The PCD evidence branch
retained the user's unrelated modified link manifest and seven untracked Open Graph images without
staging or editing them.

## Fresh producer verification

- packet generator and activation guard: **2 files / 29 tests PASS** in 29.71 seconds;
- canonical isolated CRM adapter integration: **1 file / 74 tests PASS** in 233.22 seconds;
- the adapter suite covers eligibility and restriction enforcement, immutable-boundary historical
  scanning, manifest binding, stable keyset pagination, interruption/resume, suppression and
  retraction precedence, durable outbox delivery, bounded reconciliation, and completion gates;
- one combined three-file attempt ended with a Vitest worker-process exit after two files passed;
  it had no assertion failure and was superseded by the required isolated adapter run.

## Fresh receiver verification

Against exact candidate `d810612d5c8f55f97e7e04596cca2af4128049eb`:

- deployment configuration: PASS, fail-closed;
- remote-D1 migration portability: **28/28 files PASS**;
- locked SBOM: **3 runtime dependencies, 210/210 locked components, 211 dependency nodes**;
- generated Worker binding types: current;
- TypeScript: PASS;
- release-tool attack suite: **16/16 PASS**, including oversized manifests, dirty and hidden index
  state, duplicate JSON keys, evidence ancestry, code renamed into documentation, candidate/tree
  substitution, sibling drift, and Git replacement-object attacks;
- application suite: **36 files / 325 tests PASS** in 55.47 seconds;
- UI contract validation: PASS;
- Wrangler dry-run build: PASS, **1,336.10 KiB uncompressed / 235.29 KiB gzip**, seven assets;
- detached verification worktree remained clean.

The first aggregate `npm.cmd run check` exited nonzero only when the sandbox denied Wrangler's
optional user-profile log and preserved-worktree `dist` writes. Every preceding validation and all
325 tests passed. The identical dry-run build was then rerun with its log and output beneath a
writable ignored evidence directory and exited zero. No hosted deploy occurred.

## Requirement accounting

| Full CRM requirement | Current evidence | Decision |
|---|---|---|
| Multi-workspace organization CRM and owner access | staging resources, migrations, candidates, and owner bootstrap previously verified | staged foundation PASS |
| Canonical organization/contact authority remains in PCD sources | signed adapter contracts and source-owned backfill implementation | PASS-LOCAL |
| Every frozen organization and extracted contact receives a terminal disposition | bounded manifest-bound backfill plus exact accounting equations | PASS-LOCAL; real rows unproved |
| Active source/contact restrictions and suppression win over observations | retained producer and receiver regressions | PASS-LOCAL |
| Restartable 198,000-plus organization transfer at measured scale | 200,000-row synthetic scale, leases, keysets, receipts, and two-pass reconciliation | PASS-LOCAL |
| Hosted synthetic packet and receiver reconciliation | approved packet expired unused | HOLD; fresh C1-A then C1-B required |
| Full staging historical transfer | requires refreshed inventories, bookmarks, exact manifest, and separate Gate 9C-D | HOLD |
| Production CRM promotion and full source migration | requires clean promotion, provider/live/recovery evidence, and exact production gate | HOLD |
| Outbound communications | deliberately absent and separately gated | OUT OF CURRENT RELEASE |

## Exact next gate

The late C1-B approval cannot revive the expired packet. The next authorized action must be a new
Gate 9C-C1-A generation approval naming the expiry receipt commit. That gate permits exactly one
local packet generation and immediate authenticated read-only staging revalidation. A new C1-B
must then separately name that fresh boundary, all eight hashes, their aggregate, exact candidates,
active versions, D1 identifiers, execution sequence, rollback, abort thresholds, and exclusions.

No D1 mutation, Worker deployment, packet application, flag/boundary change, data transfer,
production change, export, outbound send, privacy-policy text, payment activity, or
secret/provider/resource change occurred during this verification.

## Performance review

- approximate algorithmic complexity: producer backfill `O(o + c)` in fixed pages; receiver checks
  are bounded by test fixtures and build input size;
- DB query count on primary path: zero while both producer flags are false; historical pages and
  delivery/reconciliation statements remain within the previously measured bounds;
- external API calls: zero; the Wrangler build used `--dry-run`;
- queue jobs created: zero;
- expected memory behavior: bounded producer pages and receiver requests, with the build peaking at
  the fixed candidate bundle;
- likely scaling bottleneck: conservative sequential Service Binding throughput and D1 audit/outbox
  write volume during the eventual observed historical drain.
