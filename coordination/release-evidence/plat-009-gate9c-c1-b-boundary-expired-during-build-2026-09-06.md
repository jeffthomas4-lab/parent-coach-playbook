# PLAT-009 Gate 9C-C1-B boundary expired during verified build

Date: 2026-09-06 America/Los_Angeles / 2026-09-07 UTC  
Gate: CRM 9C-C1-B  
Approved evidence commit: `3b3c35d65dcea3682c234bf86619d51d7ac3c3c3`  
Approved PCD candidate: `aef3385e254b5eb6cf4a483436da91297e5fb39d`  
Approved CRM candidate: `d810612d5c8f55f97e7e04596cca2af4128049eb`  
Approved boundary: `1788757721000` (`2026-09-07T05:08:41.000Z`)  
Packet expiry: `2026-09-07T05:23:41.000Z`  
Approved packet aggregate: `05a8a019b61dc6efb974d3c744701157f606799d3671721eaf9d8deb0a7284a0`

## Outcome

**SAFE ABORT / NO ACTIVATION.** The verified deployment guard rebuilt the full static site, then
refused the deployment because the approved boundary had become older than fifteen minutes. The
Worker deployment command was never invoked. No packet SQL was applied. No staging D1 row was
mutated. Neither producer flag changed. Mandatory rollback was therefore not needed because the
activation phase never began.

The packet at boundary `1788757721000` is expired and permanently invalid for remote use.

## Pre-action recovery points

Before attempting activation, authenticated staging Time Travel bookmarks were captured for all
three approved D1 databases:

- directory D1 `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`:
  `0000006c-00000000-000050df-9b46416ee2d1a09a09a6b2fdb478f369`
- PCD ops D1 `7f0da00d-bc98-464f-8702-ce0fb381dd5e`:
  `00000028-00000000-000050df-6ff5116371e61511889b6d6d8c228005`
- CRM D1 `9d5e91d3-683b-4070-b511-623e5173ba33`:
  `00000084-00000004-000050df-6a3e0be74a871494cc18b1393e6f5acb`

The first bookmark invocation included an unsupported `--remote` option. Wrangler rejected that
invocation during argument parsing before contacting or changing D1. The corrected Time Travel
commands omitted `--remote`, as Time Travel is inherently remote, and returned the bookmarks above.

## Exact stopped sequence

At `2026-09-07T05:16:11Z`, the packet had 449 seconds remaining. From the exact candidate checkout,
the approved command was started:

```text
npm.cmd run deploy:staging:verified -- --crm-activation-boundary-ms 1788757721000 --expected-source-sha aef3385e254b5eb6cf4a483436da91297e5fb39d --confirm-crm-activation
```

The guard verified the source candidate, then ran the repository build. The approximately
1,500-page Astro build completed at `2026-09-07T05:23:37Z`, after about 185 seconds. Before opening
an activation config or invoking Wrangler deploy, the guard stopped with:

```text
Error: activation boundary must be within 15 minutes of deployment
```

The exception originated at the post-build boundary check in
`scripts/deploy-staging-verified.mjs`. Because that check precedes deployment, directory schema
readback in the activation path, packet application, and rollback, none of those later phases ran.

## Post-abort authoritative readback

Authenticated staging deployment readback after the abort showed:

- active PCD deployment: `019eec55-9cf0-4881-acd0-24ab0441c0ea`
- active PCD version: `6f2aef37-a320-4d78-a186-d9f6e599fd55` at 100 percent
- deployment message: exact candidate
  `f1bc696720d65c578b513165e2f62756da2fe2f5`; producers disabled; no activation boundary
- `PCD_CRM_ADAPTER_ENABLED=false`
- `PCD_CRM_BACKFILL_ENABLED=false`
- `PCD_CRM_SOURCE_NOT_BEFORE_MS` absent

This is the same disabled staging baseline that preceded the attempt. No successful C1-B action is
claimed.

## Root cause and required local repair

C1-A must freeze a fresh, fifteen-minute packet before the owner can approve C1-B. The verified
C1-B deploy path then unconditionally rebuilds the full site after approval. Human approval latency
plus the approximately three-minute build repeatedly consumes the packet's immutable validity
window. Retrying another packet without changing this sequencing would preserve the same race.

The next local candidate must add a fail-closed prebuilt-artifact mode to the existing deployment
guard. C1-A can build and validate the disabled manifest before selecting the boundary, record an
exact SHA-256 for that candidate-bound artifact, and freeze that hash with the packet. C1-B can then
verify the source SHA, build-info SHA, clean/allowed generated paths, disabled manifest invariants,
and exact manifest hash before injecting the approved boundary and invoking the existing deploy
path. No dependency, provider, secret, binding, database, production surface, or policy change is
needed.

Any repaired candidate and newly generated packet require a new exact remote-action gate. This
receipt itself authorizes and records no further remote action.
