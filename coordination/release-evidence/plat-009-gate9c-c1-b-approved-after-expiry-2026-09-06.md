# PLAT-009 Gate 9C-C1-B approval received after expiry

Status: **EXPIRED UNUSED / FRESH C1-A HOLD / REMOTE PILOT HOLD**

Recorded: `2026-09-06T19:59:39Z`

## Approved but expired identity

- C1-A evidence commit: `5b381112573439f06a713c1261ae95e8ac87413e`
- PCD candidate: `aef3385e254b5eb6cf4a483436da91297e5fb39d`
- CRM candidate: `d810612d5c8f55f97e7e04596cca2af4128049eb`
- boundary: `1788716876000`
- boundary ISO: `2026-09-06T17:47:56.000Z`
- immutable expiry: `2026-09-06T18:02:56.000Z`
- observed when the exact C1-B approval was processed: `2026-09-06T19:59:39.503Z`
- elapsed beyond expiry: 7,004 seconds
- frozen aggregate:
  `4c47a473d6bf27e55de54bfe1dda381fed95e1e1d6d959a805c1182cbf376e0e`

The exact Gate 9C-C1-B approval named the correct evidence commit, candidates, database
identities, rollback version, active CRM version, boundary, eight artifact hashes, aggregate,
execution sequence, mandatory rollback, abort thresholds, and exclusions. It nevertheless arrived
after the packet's recorded 15-minute activation window. The deploy guard requires the boundary
to be within 15 minutes when activation begins, so this packet is permanently invalid for remote
use.

## Pre-expiry read-only work retained as evidence

Before the exact C1-B approval existed, the permitted preflight and recovery work completed at
`2026-09-06T17:58:26Z`:

- disabled PCD version `6f2aef37-a320-4d78-a186-d9f6e599fd55` remained at 100%;
- active CRM version `97bfa867-b9c0-4846-9307-6cca0a93febc` remained at 100%;
- the directory, PCD ops, and CRM aggregate baselines matched exactly;
- every D1 SELECT reported `success=true`, `changes=0`, `rows_written=0`, and
  `changed_db=false`;
- directory bookmark:
  `00000067-00000000-000050de-e9849e621162b28edc19169ead392e77`;
- PCD ops bookmark:
  `00000023-00000000-000050de-0b6b1073e1256df5d0cb4cf1007da3bb`;
- CRM bookmark:
  `00000074-00000000-000050de-650a9b68585ea11575f9ff95c29cdf0a`.

These readbacks and bookmarks do not extend the expired boundary. A future C1-B execution must
capture fresh recovery bookmarks and repeat the exact preflight before mutation.

## Mutation accounting

An earlier attempt to interpret the owner's `fix this` instruction as C1-B authorization was
rejected by the execution safety gate before the deployment process started. The later exact C1-B
approval was not executed because the packet had expired.

No Worker deploy, D1 mutation, packet application, producer flag or remote-boundary change,
rollback, historical transfer, production change, non-backup export, outbound send,
privacy-policy text, payment activity, or secret/provider/resource change occurred.

## Exact next approval

> Approve CRM Gate 9C-C1-A regeneration after the late C1-B approval exactly as recorded at
> evidence commit `<EVIDENCE_COMMIT>`, using PCD candidate
> `aef3385e254b5eb6cf4a483436da91297e5fb39d`, packet-generator SHA-256
> `c3620e51331f932b20a9f54e676d016a0e75565d042caeaba0185bea693f3fa0`, and deploy-guard
> SHA-256 `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`.
> Acknowledge that the packet at boundary `1788716876000` expired unused and is permanently
> invalid for remote execution. Authorize exactly one new local-only generation and hash-freeze
> beneath ignored `backups/`, plus immediate authenticated staging revalidation using direct
> `d1 execute --command` SELECTs only and requiring `success=true`, `changes=0`,
> `rows_written=0`, and `changed_db=false`. All recorded exclusions remain unchanged.

This approval does not authorize Worker deployment, D1 mutation, packet application, producer
flag or remote-boundary change, rollback, historical transfer, production change, non-backup
export, outbound send, privacy-policy text, payment activity, or secret/provider/resource change.
