# PLAT-009 Gate 9C-C1-A prebuilt activation regeneration

Status: **PASS — LOCAL PACKET FROZEN / AUTHENTICATED READ-ONLY BASELINE PASS / C1-B HOLD**

Generated: `2026-09-07T06:21:20Z` (`2026-09-06` Pacific)

## Repaired candidate and bounded reason

The previously approved C1-B packet at boundary `1788757721000` reached the staging activation
guard only after the full Astro build consumed its validity window. The guard failed closed before
deploy with `activation boundary must be within 15 minutes of deployment`; no Worker deploy or D1
mutation occurred. That abort is recorded in
`plat-009-gate9c-c1-b-boundary-expired-during-build-2026-09-06.md`.

The local repair binds activation to a complete, previously built and hash-frozen artifact instead
of rebuilding after approval:

- PCD candidate: `9952678e639eab0a260618134275647929c7129f`
- candidate deploy-guard SHA-256:
  `460b12a79de97e30acc38636e14df1dfd50b68787f877c9ef5dd5495f692db2b`
- packet-generator SHA-256:
  `c3620e51331f932b20a9f54e676d016a0e75565d042caeaba0185bea693f3fa0`
- complete prepared `dist` artifact SHA-256:
  `04f951a0228091f70275c41ef123f6549a41e5aedee16ee472ba2907b066f87b`
- CRM candidate remains: `d810612d5c8f55f97e7e04596cca2af4128049eb`

Preparation verified the exact source SHA, a clean source checkout, build-info, the disabled staging
manifest, and the complete `dist` tree. Reuse requires that same source SHA and artifact hash,
derives only the approved activation variables in a uniquely created temporary config, and hashes
the complete artifact again immediately before Wrangler deploy while excluding only that owned
temporary config. Symlinks, special files, stale boundaries, artifact drift, and mode ambiguity all
fail closed. Preparation performed no remote operation.

## Authentication recovery and invalid unused packet

The first packet generated at boundary `1788761681000` is permanently invalid and unused. Its
first direct read-only D1 command reached Cloudflare, but saved OAuth refresh returned HTTP 401
before SQL execution. No D1 statement, write, deployment, or other remote mutation occurred.

Wrangler OAuth authentication was renewed. `wrangler whoami` then identified the intended account
`d42a1d557371024c855bc44a2c4aa28c`, and a direct `SELECT 1` returned `success=true`,
`changes=0`, `rows_written=0`, and `changed_db=false` before the replacement generation.

## Frozen replacement packet

- exact boundary: `1788762080000`
- boundary ISO: `2026-09-07T06:21:20.000Z`
- expiry under the unchanged 15-minute guard: `2026-09-07T06:36:20.000Z`
- ignored local directory: `backups/crm-c1a-packet-1788762080000`

| File | Bytes | SHA-256 |
|---|---:|---|
| `00-directory-preflight.sql` | 460 | `5805a934b9d3983734ad8ace20bf3f2909e1ba91f6bc387225e1be03e8828a7b` |
| `00-ops-preflight.sql` | 463 | `a968d46552e46e71d72a8a2e290269eb647ef560263c53879b52d26ffb7d34fb` |
| `01-directory-organizations.sql` | 823 | `05ede5e511135da27b90f08658519304a9919db811b4d5760164dcc3d430b913` |
| `02-ops-contacts.sql` | 5167 | `82eebbfe5a2184e40ba1a995b33430627b9bb3b6a232da19bb6f4f186cd59d54` |
| `90-directory-verification.sql` | 462 | `b5d1adeec395462e57e384e095144ebfd6f1bcc06edf115ccd8e03687068e262` |
| `91-ops-verification.sql` | 3959 | `df9b333752fe7bdde38ff2f58b66bad20b7d457ec0a5e145e8bb270efe8aeffb` |
| `92-crm-verification.sql` | 1154 | `450a5a4070f0aeaa8f47005cdac18f1ed9d3a0c5fbdd7c4f0dcba61bd52a731d` |
| `manifest.json` | 4846 | `0057654187a7e6fe3ecf2991959da54305d55950f096f18b66bf3cd4e7cfa7e7` |

Eight-file aggregate, computed as
`sha256(utf8(compact-json(sorted [{name,sha256}])))`:

`729874b978428f9be5a738e28b16c1758235c7fd9ffab3244903b7e08e61d01d`

The generator ran exactly once after authenticated transport proof and wrote only beneath ignored
`backups/`. The manifest's seven embedded SQL hashes and byte counts match the physical files.

## Immediate authenticated read-only staging revalidation

All D1 checks used direct `d1 execute --command` SELECTs only. Every result reported
`success=true`, `changes=0`, `rows_written=0`, and `changed_db=false`.

- directory D1 `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`: exact fixture rows 3, live
  fixture rows 3, unprojected fixture rows 3;
- PCD ops D1 `7f0da00d-bc98-464f-8702-ce0fb381dd5e`: existing pilot contacts 0;
- CRM D1 `9d5e91d3-683b-4070-b511-623e5173ba33`: pilot organizations 0,
  pilot contacts 0, pilot restrictions 0;
- PCD deployment `019eec55-9cf0-4881-acd0-24ab0441c0ea` remains 100% on disabled
  rollback version `6f2aef37-a320-4d78-a186-d9f6e599fd55`;
- the PCD version retains exact directory and ops D1 bindings, `CRM_ADAPTER` to
  `field-forge-crm-staging`, `PCD_CRM_ADAPTER_ENABLED=false`,
  `PCD_CRM_BACKFILL_ENABLED=false`, and no activation-boundary binding;
- CRM deployment `20e95a24-e9f3-4ab8-9002-cc6bcfe9771c` remains 100% on version
  `97bfa867-b9c0-4846-9307-6cca0a93febc`, with message naming exact candidate
  `d810612d5c8f55f97e7e04596cca2af4128049eb`, producers disabled, and no boundary;
- the CRM version retains exact staging D1, R2, Queue, Access, origin, Turnstile, and secret-name
  bindings. No secret value was read or changed.

## Verification and cost profile

- red-first: three focused guard tests failed before implementation for the missing reuse option,
  artifact hash, and prebuilt reader;
- focused guard/staging/manifest contract tests: 35 passed;
- CRM staging pilot tests: 3 passed;
- CRM adapter integration configuration: 74 passed;
- Astro typecheck: 641 files, 0 errors, 0 warnings, 384 pre-existing advisory hints;
- `git diff --check`: passed;
- full default Vitest: 214 files passed, 6 failed; 1411 tests passed, 15 failed, with failures
  isolated to stale access/release evidence, article-refresh timing, and the adapter suite's wrong
  default five-second pool. The dedicated adapter configuration passed all 74 tests.

Performance review for the activation repair:

- approximate complexity: `O(F + B)` for files and bytes in the prepared artifact;
- DB queries on the primary activation path: two read-only schema statements in one existing D1
  readback call; no new query;
- external calls: unchanged existing one D1 readback plus one Wrangler deploy; preparation has zero;
- queue jobs created: zero;
- expected memory: `O(max artifact file)`, one file buffer at a time;
- likely bottleneck: local artifact I/O; measured 5,899 files / 253,994,817 bytes at about 13.8
  seconds per hash pass, about 28 seconds total for reuse verification.

Separate QA, security/data-integrity, efficiency, and simplicity passes attacked stale boundaries,
mode ambiguity, artifact substitution, tampering, memory behavior, redundant passes, and added
architecture. No open Critical or High finding remains. The implementation adds no dependency or
new service layer. True independent-agent acceptance remains HOLD because this session was not
authorized to delegate; this receipt does not substitute for the separately required C1-B gate.

## Mutation accounting and exact next gate

No Worker deploy, D1 mutation, packet application, producer flag change, remote-boundary change,
rollback, historical transfer, data copy, seed, non-backup export, outbound send, privacy-policy
text, payment activity, or secret/provider/resource change occurred in this regeneration.

Only a separate exact Gate 9C-C1-B approval may authorize this replacement packet. It must name
this evidence commit after it is created, PCD candidate and complete build artifact hash, both
script hashes, CRM candidate, disabled rollback and active CRM versions, all three D1 UUIDs,
boundary, all eight file hashes, aggregate, the exact execution sequence, mandatory rollback,
abort thresholds, and exclusions.

The retained ordered execution is exact preflight and three Time Travel bookmarks; artifact-hash
verified adapter-only activation with historical backfill false; hash-verified organization
application and its exact delivery/receipt/projection gate; hash-verified contact application and
its exact two observations plus one raw-free do-not-contact result; aggregate-only final readbacks;
and mandatory rollback to the disabled PCD version on pass, failure, or timeout.

All exclusions in `plat-009-gate9c-c1-synthetic-pilot-proposal-2026-09-05.md` and
`plat-009-gate9c-c1-hash-gate-amendment-2026-09-05.md` remain binding, including no production
changes, historical organization/contact copying or seeding, 198,000-plus organization transfer,
backfill run, source-inventory export, non-backup export, outbound sends, privacy-policy text,
payment activity, secret/provider/resource changes, or synthetic-row deletion.

If activation does not begin before `2026-09-07T06:36:20.000Z`, this packet becomes permanently
invalid for remote execution.
