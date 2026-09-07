# PLAT-009 Gate 9C-C1-A boundary 1788753962000 expired unused

Status: **HOLD — PACKET EXPIRED BEFORE C1-B EXECUTION / NO REMOTE ACTION**

Recorded: `2026-09-07T05:05:02Z` (`2026-09-06` Pacific)

## Frozen identity

- C1-A evidence commit: `7cfc65d11afeff5359daf2283230c213cedac6d1`
- PCD candidate: `aef3385e254b5eb6cf4a483436da91297e5fb39d`
- packet-generator SHA-256:
  `c3620e51331f932b20a9f54e676d016a0e75565d042caeaba0185bea693f3fa0`
- deploy-guard SHA-256:
  `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`
- boundary: `1788753962000`
- boundary ISO: `2026-09-07T04:06:02.000Z`
- immutable expiry: `2026-09-07T04:21:02.000Z`
- C1-B execution preflight time: `2026-09-07T05:05:02.7453176Z`
- elapsed beyond expiry at preflight: 2,640.7 seconds

## Decision

The exact C1-B approval naming this packet arrived after the immutable 15-minute activation
window. The evidence receipt's hard stop requires activation to begin before expiry. The packet at
boundary `1788753962000` is permanently invalid for remote execution.

No Worker deploy, D1 statement, packet application, producer flag or remote-boundary change,
rollback, historical transfer, production change, non-backup export, outbound send,
privacy-policy text, payment activity, or secret/provider/resource change occurred. The only
action was a local wall-clock expiry check.

## Exact replacement approval

> Approve CRM Gate 9C-C1-A regeneration after the late C1-B approval exactly as recorded at
> evidence commit `<EVIDENCE_COMMIT>`, using PCD candidate
> `aef3385e254b5eb6cf4a483436da91297e5fb39d`, packet-generator SHA-256
> `c3620e51331f932b20a9f54e676d016a0e75565d042caeaba0185bea693f3fa0`, and deploy-guard
> SHA-256 `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`.
> Acknowledge that the packet at boundary `1788753962000` expired unused and is permanently
> invalid for remote execution. Authorize exactly one new local-only generation and hash-freeze
> beneath ignored `backups/`, plus immediate authenticated staging revalidation using direct
> `d1 execute --command` SELECTs only and requiring `success=true`, `changes=0`,
> `rows_written=0`, and `changed_db=false`. All recorded exclusions remain unchanged.
