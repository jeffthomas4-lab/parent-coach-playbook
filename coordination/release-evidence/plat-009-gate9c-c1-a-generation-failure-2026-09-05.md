# PLAT-009 Gate 9C-C1-A local packet-generation failure

Status: **SAFE STOP / NO PACKET CREATED / RETRY HOLD**

Observed: `2026-09-06T04:15:00Z` (2026-09-05 Pacific)

## Authorized inputs

- approval evidence commit: `91b5e40de0dc4f3a19b17147cdc90e20af9f1edc`
- PCD candidate: `f1bc696720d65c578b513165e2f62756da2fe2f5`
- candidate tree: `005e4b0370d8145acb1770d9ef79d37af81a2afb`
- packet-generator SHA-256:
  `6e3c54da0f3cff5ac681f5d8453b82463938b812092e3864ab17efd34698e89e`
- deploy-guard SHA-256:
  `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`

The detached worktree at the exact candidate was clean, and all four identities matched before
the generator was invoked.

## Read-only revalidation

The PCD deployment remained `019eec55-9cf0-4881-acd0-24ab0441c0ea`, with exact disabled
version `6f2aef37-a320-4d78-a186-d9f6e599fd55` at 100%. The central CRM deployment remained
`20e95a24-e9f3-4ab8-9002-cc6bcfe9771c`, with exact version
`97bfa867-b9c0-4846-9307-6cca0a93febc` at 100%.

Directory D1 still contained exactly three live, unprojected pilot organizations, ten total
organizations, and revision sum zero. Every PCD ops pilot/backfill/adapter aggregate remained
zero. Every central CRM customer-data aggregate remained zero. Each successful D1 statement
reported `changes=0`, `rows_written=0`, and `changed_db=false`.

The first PCD readback attempt from the detached checkout could not see the existing Wrangler OAuth
session and failed before provider access. The same read-only checks were immediately rerun from
the authenticated evidence worktree and passed. The CRM readbacks passed on their first attempt.

## Generation attempt and safe stop

The approved generator was invoked exactly once with boundary `1788668082000`
(`2026-09-06T04:14:42.000Z`) and intended output directory
`C:\tmp\crm-c1a-packet-1788668082000`.

Node failed on the first filesystem operation:

```text
EPERM: operation not permitted, mkdir 'C:\tmp\crm-c1a-packet-1788668082000'
```

Post-failure inspection proved:

- the intended directory does not exist;
- no packet artifact or manifest was created;
- the detached candidate worktree remains clean; and
- no Worker deployment, D1 mutation, packet application, flag/boundary change, rollback,
  historical transfer, production change, export, send, policy edit, or provider/resource/secret
  change occurred.

Because Gate 9C-C1-A authorized exactly one generation, the failed invocation is treated as
consuming that authority. It must not be retried implicitly.

## Narrow retry design

A retry may use the same exact candidate and scripts but must write to a unique child of the
already-existing ignored `backups/` directory in the writable evidence worktree:

`C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\Field and Forge\SightSmash\.worktrees\pcd-crm-repair\backups\crm-c1a-packet-<BOUNDARY_MS>`

The exact detached candidate remains the process working directory. Only the output destination
changes. The replacement boundary must be fresh, positive, and second-aligned. The old boundary
and failed path are permanently invalid.

## Retry approval wording

> Approve CRM Gate 9C-C1-A retry exactly as recorded at evidence commit `<EVIDENCE_COMMIT>`, using
> PCD candidate `f1bc696720d65c578b513165e2f62756da2fe2f5`, packet-generator SHA-256
> `6e3c54da0f3cff5ac681f5d8453b82463938b812092e3864ab17efd34698e89e`, and deploy-guard SHA-256
> `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`. Acknowledge that the sole
> prior attempt at boundary `1788668082000` created no directory or artifact because sandboxed
> `C:\tmp` directory creation returned `EPERM`. Authorize exactly one replacement local-only
> generation and hash-freeze of the fixed eight-file synthetic staging packet at one new fresh
> second-aligned boundary, writing only beneath the recorded ignored `backups/` directory, plus
> read-only staging revalidation. Stop before any Worker deploy, D1 mutation, packet application,
> producer flag or remote-boundary change, rollback, historical transfer, production change,
> export, send, privacy-policy text, or secret/provider/resource change.

