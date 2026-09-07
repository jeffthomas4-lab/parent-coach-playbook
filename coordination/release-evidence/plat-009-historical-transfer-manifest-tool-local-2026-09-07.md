# PLAT-009 historical transfer manifest tool

Status: **PASS-LOCAL / HOSTED PILOT AND HISTORICAL TRANSFER HOLD**

Recorded: `2026-09-07T06:58:47Z`

## Outcome

Candidate `0a9de935e15ed95f128d545f7bd487139fbfef1f` adds a deterministic local manifest
builder for the full Parent Coach Desk organization/contact projection into the portfolio CRM.
It binds one historical run to:

- exact producer and receiver commits;
- the action-time second-aligned activation boundary;
- the directory, PCD operations, and CRM D1 UUIDs;
- exact directory and operations Time Travel bookmarks;
- the public-professional source-policy version;
- frozen organization, contact, channel-bearing-contact, and public-reviewed-contact counts;
- the fixed producer workspace, target workspace, and source identity; and
- completion requirements covering terminal disposition accounting, delivery receipts, two full
  reconciliation passes, zero pending/dead events, and zero receiver findings.

The exact serialized JSON bytes are SHA-256 hashed for
`PCD_CRM_BACKFILL_MANIFEST_SHA256`. The CLI refuses unknown, duplicate, or valueless flags,
malformed identities, stale or non-second-aligned boundaries, inconsistent contact inventories,
output outside ignored `backups/`, and replacement of an existing manifest. The file itself says
`remoteExecutionAuthorized=false`; generation grants no provider authority.

## Fresh read-only source inventory

Authenticated direct `d1 execute --command` SELECTs returned `success=true`, `changes=0`,
`rows_written=0`, and `changed_db=false`:

- production directory D1 `activity-radar`: 198,287 total/live organizations, zero tombstones;
- organization creation range: `2026-05-01T19:28:59.586Z` through
  `2026-06-14T23:34:03Z`;
- organization update range: `2026-05-01T19:28:59.586Z` through
  `2026-09-05 13:21:48`;
- production PCD ops D1: 141 total/live contacts, zero tombstones;
- 35 contacts have an email or phone channel;
- all 141 contacts retain a source URL;
- zero contacts are suppressed;
- zero contacts are public-reviewed, so zero may be projected as active CRM contacts at this
  snapshot. All 141 must still receive a terminal disposition during backfill.

These are current inventory facts, not a transfer receipt. Action-time Gate 9C-D must refresh them
and seal its own source bookmarks and manifest after the hosted synthetic pilot passes.

## Red-first and verification

- initial focused suite failed because the manifest module did not exist;
- the output-boundary regression then failed because the resolver did not exist;
- final focused suite: 1 file / 5 tests PASS;
- Node syntax check: PASS;
- Astro typecheck: 645 files, 0 errors, 0 warnings, 398 pre-existing hints;
- `git diff --check`: PASS.

QA attacked missing/duplicate CLI values, stale boundaries, overwrite, and output escape. Security
and data-integrity review attacked malformed commits, D1 IDs, bookmarks, policy IDs, inconsistent
counts, accidental contact activation, and remote-authority ambiguity. Efficiency review found no
runtime source scan or provider call in the tool. Simplicity review retained native Node `crypto`
and one JSON write; no dependency or service layer was added.

Dependency search covered npm, PyPI, and GitHub. Available manifest/signing packages were unrelated
or materially broader than this fixed first-party artifact, while Node already provides SHA-256 and
deterministic JSON serialization. No package was added.

## Performance review

- approximate algorithmic complexity: `O(1)` over fixed manifest fields;
- DB query count on the primary build path: 0;
- external API calls: 0;
- queue jobs created: 0;
- expected memory: one small manifest string and buffer, `O(1)`;
- likely scaling bottleneck: none in generation; later bounded delivery/reconciliation throughput
  remains the historical transfer bottleneck.

## Boundary

No deployment, D1 mutation, source copy, producer flag/boundary change, backfill run, production
change, export, outbound send, privacy-policy edit, payment activity, secret/provider/resource
change, or MedConfRadar access occurred. The current synthetic C1-B pilot remains separately
exact-hash gated. The full historical Gate 9C-D remains separately action-time-manifest gated.
