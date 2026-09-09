# PLAT-009 Gate 9C-P17-B production historical activation guard

Status: **PASS-LOCAL / REMOTE HOLD**

Recorded: 2026-09-09 America/Los_Angeles / UTC

## Outcome

The production historical-transfer deploy path is now fail-closed around a single fresh,
hash-frozen approval manifest. No production backfill manifest was generated, no activation
boundary was selected, no Worker was deployed, and no organization or contact was copied.

This local guard is the next-candidate control for the later activation gate. Gate 9C-P16-C-R5-B
must first establish the receiver and Gate 9C-P17-A must then establish the disabled producer
schema/release. Only after both PASS may a separate action-time step capture real source
bookmarks, generate one fresh production manifest, freeze its hash, and request the exact remote
activation approval.

## Exact local candidate

- PCD candidate: `a01e225e287b68b933116cba6b223565e1fbc528`
- candidate tree: `e62fe560921713ca1d4b7199ef3e770d6c0d3f85`
- deterministic production artifact SHA-256:
  `6c142abef0e8279dc52e67d563f407a1f45d6cbec3354a24b82d4dddd4c78164`
- generated disabled production manifest SHA-256:
  `8483b96bb32a621322aefa4a8c544d503fb1997836a1cf0fbf16032bf907cacb`
- historical-activation guard SHA-256:
  `5a21e5403feea75a87df834e3a1707a15556f2f1112edc932077a16c01576572`
- guard regression SHA-256:
  `87f67a4f710a964cff472981c506a0d89bdd74cc829422ef930bf2422e385a18`
- production-manifest generator SHA-256:
  `bc0dc0233b518545a1a9101422c58a8bbec5e443292f4ede4efa5f201c495524`
- receiver candidate required by the guard:
  `4dd8794b8006c075bcda6905f5a4dda283a0378a`

The prebuilt artifact reports source commit
`a01e225e287b68b933116cba6b223565e1fbc528` and build origin `local`. The base artifact remains
disabled: both CRM producer flags are exactly `false` and no activation boundary is present.

## Guarded contract

Before it can make the one allowed deploy call, the guard requires all of the following:

- clean candidate state apart from named build-generated files;
- exact producer candidate and prebuilt artifact hash;
- exact receiver candidate;
- exact byte hash of a manifest generated beneath ignored `backups/`;
- manifest environment `production` and classification `governed_source_projection`;
- the immutable PCD producer workspace, SightSmash target workspace, and PCD source identity;
- production directory D1 `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`;
- production operations D1 `b38d5f37-54df-4e0f-9706-023edc12c7fe`;
- production CRM target D1 `9ea593e2-b5ca-40d8-b7fa-8172e02edb3d`;
- two syntactically valid, frozen source Time Travel bookmarks;
- source policy `pcd-public-professional-v1`;
- non-negative organization/contact inventories with bounded channel/public subsets;
- a positive, second-aligned boundary no more than 15 minutes from deployment;
- exact adapter/backfill flags, boundary, database IDs, bookmarks, policy, and manifest digest in
  the deployed runtime;
- every completion-contract field set true;
- no staging pilot variable;
- the typed confirmation `ACTIVATE parent-coach-desk CRM PRODUCTION BACKFILL`;
- an ISO-8601 receipt timestamp and a create-new receipt path beneath ignored `backups/`.

The temporary activation config is create-new and deleted after the command. The receipt path is
reserved before deployment so a successful deploy cannot be followed by a collision that loses
the local deployment receipt. A failed deployment removes the empty reserved receipt. The guard
uses the repository's installed Wrangler binary directly; it does not use `npx` or install a
package at action time.

The manifest's `remoteExecutionAuthorized=false` value deliberately remains false. The local
packet is evidence, not authority. Remote authority must come from the separately approved gate
whose evidence commit and exact packet hash are supplied at action time.

## Verification

- focused manifest, disabled-release, and activation-guard tests: 20 passed, 0 failed;
- `tsc --noEmit`: passed;
- full repository check: 647 files, 0 errors, 0 warnings, 384 pre-existing hints;
- exact production build: passed;
- base disabled production manifest verification: passed;
- `git diff --check`: passed before commit.

Retained negative coverage proves rejection of:

- a staging manifest;
- the wrong CRM target D1;
- a stale boundary;
- a changed local-authorization marker;
- any required-runtime drift;
- post-preparation target drift;
- any production pilot-mode variable;
- unknown or duplicate CLI arguments; and
- a receipt path outside ignored `backups/`.

## Performance review

- approximate algorithmic complexity: `O(f + v)`, where `f` is the bounded prebuilt artifact
  file count and `v` is the fixed runtime-contract field count
- DB query count on primary path: zero inside this deploy guard; action-time database preflights
  remain in the separately approved gate
- external API calls: zero in dry-run mode; exactly one Worker deploy after every gate passes
- queue jobs created: none synchronously; the deployed scheduled producer creates bounded jobs
  later under its existing runtime contract
- expected memory behavior: one bounded manifest, one generated Worker config, and streaming
  artifact hashing; no source dataset is loaded
- likely scaling bottleneck: the later scheduled 198,287-row projection and reconciliation, not
  guard validation

## Dependency decision

The implementation reuses the existing first-party Wrangler installation, production manifest
verifier, and Node cryptography/filesystem primitives. No new dependency was added.

## Stop condition

This receipt grants no provider or production authority. Stop before capturing production
bookmarks for a backfill, generating a real production manifest, selecting an activation
boundary, enabling either producer flag, deploying this candidate, copying data, starting a
backfill, exporting rows, sending messages, or changing any secret, provider, resource, policy,
or privacy text.
