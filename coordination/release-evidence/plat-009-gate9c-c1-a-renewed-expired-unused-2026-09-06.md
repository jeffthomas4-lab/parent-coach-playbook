# PLAT-009 renewed Gate 9C-C1-A packet expiry

Status: **EXPIRED UNUSED / FRESH C1-A HOLD / REMOTE PILOT HOLD**

Recorded: `2026-09-06T21:56:56Z`

## Expired packet

- C1-A evidence commit: `78fd4210788ca904608575746682494cc9368471`
- PCD candidate: `aef3385e254b5eb6cf4a483436da91297e5fb39d`
- boundary: `1788724991000`
- generated: `2026-09-06T20:03:11.000Z`
- immutable expiry: `2026-09-06T20:18:11.000Z`
- observed expired: `2026-09-06T21:56:56.914Z`
- elapsed beyond expiry: 5,926 seconds
- packet aggregate:
  `6f0762f94521d90064814a38130c6602fac76aeabb8eeca4929425f2145ad1a6`

The packet was generated exactly once under the approved C1-A gate, frozen as eight artifacts,
and immediately revalidated against authenticated staging with command-only SELECTs. Every D1
result reported `success=true`, `changes=0`, `rows_written=0`, and `changed_db=false`.

No exact C1-B approval arrived and activation did not begin before the 15-minute boundary window
closed. The packet is therefore permanently invalid for remote execution. Its SQL files and hashes
must not be named by a future C1-B gate.

## Mutation accounting

No Worker deploy, D1 mutation, packet application, producer flag or remote-boundary change,
rollback, historical transfer, production change, non-backup export, outbound send,
privacy-policy text, payment activity, or secret/provider/resource change occurred.

## Exact next approval

> Approve CRM Gate 9C-C1-A regeneration after the renewed packet expiry exactly as recorded at
> evidence commit `<EVIDENCE_COMMIT>`, using PCD candidate
> `aef3385e254b5eb6cf4a483436da91297e5fb39d`, packet-generator SHA-256
> `c3620e51331f932b20a9f54e676d016a0e75565d042caeaba0185bea693f3fa0`, and deploy-guard
> SHA-256 `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`.
> Acknowledge that the packet at boundary `1788724991000` expired unused and is permanently
> invalid for remote execution. Authorize exactly one new local-only generation and hash-freeze
> beneath ignored `backups/`, plus immediate authenticated staging revalidation using direct
> `d1 execute --command` SELECTs only and requiring `success=true`, `changes=0`,
> `rows_written=0`, and `changed_db=false`. All recorded exclusions remain unchanged.

This approval does not authorize Worker deployment, D1 mutation, packet application, producer
flag or remote-boundary change, rollback, historical transfer, production change, non-backup
export, outbound send, privacy-policy text, payment activity, or secret/provider/resource change.
