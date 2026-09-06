# PLAT-009 Gate 9C-C1 authenticated packet expiry receipt

Status: **EXPIRED UNUSED / LATE C1-B REJECTED / FRESH C1-A HOLD**

Recorded: `2026-09-06T16:10:35Z` (`2026-09-06` Pacific)

## Expired packet identity

- C1-A hash-freeze evidence commit: `fb44cd3f9744965a8d2a7d376bd4328b8b47e123`
- PCD candidate: `f1bc696720d65c578b513165e2f62756da2fe2f5`
- CRM candidate: `d810612d5c8f55f97e7e04596cca2af4128049eb`
- boundary: `1788709988000`
- boundary ISO: `2026-09-06T15:53:08.000Z`
- hard expiry: `2026-09-06T16:08:08.000Z`
- eight-file aggregate:
  `7bc2f2a71c9cb3de729143c8a38fbb0b13975efcd6f792b6d27558684d15a520`

The owner supplied the exact Gate 9C-C1-B approval after the hard expiry. The first verified UTC
clock read after receipt was `2026-09-06T16:10:35.5401870Z`, 147.540 seconds after expiry. The
approval therefore cannot authorize the hosted pilot. The packet is permanently invalid for
remote execution and must not be applied, renamed, or represented as fresh.

## No-action proof

No C1-B command was invoked. No Time Travel bookmark, Worker deployment, D1 mutation, packet
application, producer flag or remote-boundary change, rollback, historical transfer, production
change, export, send, privacy-policy text, payment activity, or secret/provider/resource change
occurred under the late approval.

The only post-freeze activity was local test verification:

- CRM packet and staging activation-guard suites: **2 files / 29 tests PASS** in 29.71 seconds;
- canonical isolated CRM adapter integration suite: **1 file / 74 tests PASS** in 233.22 seconds;
- an earlier combined three-file attempt ended with a Vitest worker-process exit after two files
  passed; it produced no assertion failure and was superseded by the canonical isolated adapter
  run above.

The existing unrelated `public/link-manifest.json` modification and seven untracked Open Graph
images remained unstaged and untouched.

## Gate decision

Gate 9C-C1-B is HOLD because the approved packet expired before approval. A newly approved C1-A
generation is required. Wrangler authentication is active, so the replacement generation and its
immediate authenticated read-only staging revalidation can run in the same short window.

## Exact next approval

> Approve CRM Gate 9C-C1-A regeneration after the late C1-B expiry exactly as recorded at evidence
> commit `<EVIDENCE_COMMIT>`, using PCD candidate
> `f1bc696720d65c578b513165e2f62756da2fe2f5`, packet-generator SHA-256
> `6e3c54da0f3cff5ac681f5d8453b82463938b812092e3864ab17efd34698e89e`, and deploy-guard SHA-256
> `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`. Acknowledge that the
> packet at boundary `1788709988000` expired unused before Gate 9C-C1-B approval and is permanently
> invalid for remote execution. Authorize exactly one new local-only generation and hash-freeze of
> the fixed eight-file synthetic staging packet at one fresh second-aligned boundary, writing only
> beneath the recorded ignored `backups/` directory, plus immediate authenticated read-only staging
> revalidation. Stop before any Worker deploy, D1 mutation, packet application, producer flag or
> remote-boundary change, rollback, historical transfer, production change, export, send,
> privacy-policy text, payment activity, or secret/provider/resource change.
