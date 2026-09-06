# PLAT-009 Gate 9C-C1 expired packet receipt

Status: **EXPIRED UNUSED / C1-B NOT EXECUTABLE / FRESH C1-A HOLD**

Verified: `2026-09-06T12:10:24Z`

## Expired identity

- C1-A evidence commit: `46e10fd8b1fff35f93727b2d16e4559422b1932d`
- boundary: `1788668426000`
- boundary ISO: `2026-09-06T04:20:26.000Z`
- hard expiry: `2026-09-06T04:35:26.000Z`
- PCD candidate: `f1bc696720d65c578b513165e2f62756da2fe2f5`
- CRM candidate: `d810612d5c8f55f97e7e04596cca2af4128049eb`

The owner approved Gate 9C-C1-B after the hard expiry. The approval therefore cannot authorize
execution of this packet. The packet generator, deploy guard, hash-gate amendment, and C1-A
receipt all require the activation boundary to remain inside the 15-minute freshness window.

## Integrity and non-use proof

At `2026-09-06T12:10:24Z`, all eight packet files still existed locally with the exact byte counts
and SHA-256 values recorded at C1-A. The eight-file aggregate therefore remains the recorded
`2b232e9399e42f4a28bf5ce1f4989839d6b3637c56cd2b645f5703a8a43812ce`.

No C1-B command was invoked. No Worker deployment, Time Travel bookmark, D1 mutation, packet
application, producer flag/boundary change, rollback, historical transfer, production change,
export, send, privacy-policy edit, payment action, or secret/provider/resource change occurred.

The expired files are retained as immutable local evidence and must never be applied remotely.

## Required fresh gate

A fresh C1-A approval must authorize exactly one new local-only generation at a new second-aligned
boundary. It may reuse the unchanged exact candidate and script identities only after they are
revalidated. A later C1-B must name the new evidence commit, new boundary, all eight new hashes,
and new aggregate before that new packet expires.

## Fresh C1-A approval wording

> Approve CRM Gate 9C-C1-A regeneration exactly as recorded at evidence commit
> `<EVIDENCE_COMMIT>`, using PCD candidate
> `f1bc696720d65c578b513165e2f62756da2fe2f5`, packet-generator SHA-256
> `6e3c54da0f3cff5ac681f5d8453b82463938b812092e3864ab17efd34698e89e`, and deploy-guard SHA-256
> `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`. Acknowledge that the
> previously frozen packet at boundary `1788668426000` expired unused and is permanently invalid
> for remote execution. Authorize exactly one new local-only generation and hash-freeze of the
> fixed eight-file synthetic staging packet at one fresh second-aligned boundary, writing only
> beneath the recorded ignored `backups/` directory, plus read-only staging revalidation. Stop
> before any Worker deploy, D1 mutation, packet application, producer flag or remote-boundary
> change, rollback, historical transfer, production change, export, send, privacy-policy text, or
> secret/provider/resource change.

