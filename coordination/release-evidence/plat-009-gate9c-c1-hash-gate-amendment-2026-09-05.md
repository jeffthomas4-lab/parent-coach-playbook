# PLAT-009 Gate 9C-C1 exact-hash gate amendment

Status: **LOCAL GOVERNANCE REPAIR PASS / PACKET AND REMOTE PILOT HOLD**

Recorded: 2026-09-05 Pacific / 2026-09-06 UTC

## Finding

Evidence commit `c489b23666825b566d016738ecf122f5ba884e72` correctly defined the fixed synthetic
pilot, bounded observations, abort thresholds, and mandatory rollback, but its proposed one-step
approval allowed the packet hashes to be captured after approval and before remote application.

That wording conflicts with the canonical adapter contract in `docs/PCD-PORTFOLIO-CRM-ADAPTER.md`:
the real action-time packet hashes must be regenerated and named in the execution gate. Conditional
hash capture is strong technical verification, but it is not the exact owner-approved artifact
identity the repository requires.

The one-step approval wording in evidence commit `c489b236` is therefore superseded and must not be
used. No packet, activation boundary, remote mutation, or deployment occurred under it.

## Amended two-gate sequence

### Gate 9C-C1-A: local packet freeze only

C1-A may authorize exactly one local packet generation from:

- PCD candidate `f1bc696720d65c578b513165e2f62756da2fe2f5`;
- candidate tree `005e4b0370d8145acb1770d9ef79d37af81a2afb`;
- packet generator `scripts/build-crm-staging-pilot.mjs` SHA-256
  `6e3c54da0f3cff5ac681f5d8453b82463938b812092e3864ab17efd34698e89e`; and
- deploy guard `scripts/deploy-staging-verified.mjs` SHA-256
  `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`.

The generation must use one fresh positive second-aligned Unix-millisecond boundary and a new
temporary directory. It must produce exactly seven SQL artifacts plus `manifest.json`, with no
manual edit or substitution. Before any remote mutation, record:

- the exact boundary and ISO time;
- every artifact filename, byte count, and SHA-256;
- the manifest SHA-256; and
- the aggregate `sha256(utf8(compact-json(sorted [{name,sha256}])))` across all eight files.

C1-A authorizes no Worker deployment, D1 write, packet application, flag change, remote activation
boundary, rollback, data copy, seed, export, or send. Read-only version, binding, schema, bookmark,
ledger, and aggregate revalidation remains allowed. If the packet's 15-minute window expires before
C1-B approval and deployment, the packet is permanently invalid for remote use; C1-A does not
authorize silently replacing it with a new packet.

### Gate 9C-C1-B: exact-hash hosted pilot

Only a second approval may authorize the remote pilot. It must name:

- the C1-A evidence commit;
- the exact PCD and CRM candidates;
- the exact active PCD disabled rollback version and active CRM version;
- the exact three staging D1 UUIDs;
- the exact boundary;
- all eight file hashes and the eight-file aggregate; and
- the complete execution scope and exclusions from
  `plat-009-gate9c-c1-synthetic-pilot-proposal-2026-09-05.md`, as amended here.

C1-B remains invalid if the 15-minute boundary window cannot survive the verified activation build.
In that case, no remote action may occur and a newly approved C1-A packet is required.

Once valid C1-B approval exists, the retained ordered execution is unchanged:

1. exact preflight and three D1 Time Travel bookmarks;
2. exact-candidate adapter-only activation with historical backfill false;
3. hash-verified organization phase;
4. exact three-organization delivery/receipt/projection gate;
5. hash-verified contact phase;
6. exact two-observation plus one raw-free-DNC result;
7. aggregate-only final readbacks; and
8. mandatory rollback to disabled PCD version
   `6f2aef37-a320-4d78-a186-d9f6e599fd55` on pass, failure, or timeout.

All abort thresholds and exclusions in the superseded proposal remain binding except where this
amendment makes artifact approval stricter.

## Relationship to the full CRM transfer

The synthetic pilot is still a prerequisite, not completion. The full transfer must account for
every frozen production source row and retain PCD as the organization/contact authority. Current
planning evidence records 198,287 organizations and a growing contact inventory; the latest
read-only snapshot records 141 extracted contacts, of which 35 have a channel, while all remain
private/unreviewed and ineligible for active CRM contact projection until human public-professional
review exists.

The current conservative receiver limit is ten sequential events per minute. At 198,287 initially
eligible organization events, the no-retry lower bound is about 13.8 days, followed by two complete
100-event reconciliation passes. Gate 9C-D therefore cannot be a one-shot import: it must remain a
manifest-bound, restartable, observed historical run with exact disposition accounting and no
elapsed-time success shortcut.

## Performance review

- approximate algorithmic complexity: O(3 + 8 + 7), fixed local packet cardinality
- DB query count: 0 for C1-A packet generation; read-only revalidation is bounded separately
- external API calls: 0 for packet generation
- queue jobs created: 0
- expected memory behavior: fixed tens of kilobytes for seven SQL files and one manifest
- likely scaling bottleneck: the later hosted receiver pump and reconciliation windows, not packet
  generation or hashing

## Gate 9C-C1-A approval wording

> Approve CRM Gate 9C-C1-A exactly as recorded at evidence commit `<EVIDENCE_COMMIT>`, using PCD
> candidate `f1bc696720d65c578b513165e2f62756da2fe2f5`, packet-generator SHA-256
> `6e3c54da0f3cff5ac681f5d8453b82463938b812092e3864ab17efd34698e89e`, and deploy-guard SHA-256
> `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`. Authorize exactly one
> local-only generation and hash-freeze of the fixed eight-file synthetic staging packet at one
> fresh second-aligned boundary, plus read-only staging revalidation. Stop before any Worker deploy,
> D1 mutation, packet application, producer flag or remote-boundary change, rollback, historical
> transfer, production change, export, send, privacy-policy text, or secret/provider/resource change.
