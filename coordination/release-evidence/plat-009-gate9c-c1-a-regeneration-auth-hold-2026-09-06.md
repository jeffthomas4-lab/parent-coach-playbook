# PLAT-009 Gate 9C-C1-A regenerated packet receipt

Status: **LOCAL PACKET FROZEN / READ-ONLY REVALIDATION AUTH HOLD / C1-B HOLD**

Generated: `2026-09-06T15:25:29Z` (2026-09-06 Pacific)
Recorded: `2026-09-06T15:31:49Z`

## Approved identity

- regeneration evidence commit: `91fb1da050f59351ed866faef45584890c7239ed`
- PCD candidate: `f1bc696720d65c578b513165e2f62756da2fe2f5`
- candidate tree: `005e4b0370d8145acb1770d9ef79d37af81a2afb`
- packet-generator SHA-256:
  `6e3c54da0f3cff5ac681f5d8453b82463938b812092e3864ab17efd34698e89e`
- deploy-guard SHA-256:
  `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`
- exact boundary: `1788708329000`
- exact boundary ISO: `2026-09-06T15:25:29.000Z`
- hard expiry: `2026-09-06T15:40:29.000Z`

The owner approved exactly one replacement local-only generation. The clean detached checkout at
the exact candidate and both approved script hashes were verified before the generator was invoked.
The generator was invoked exactly once. It wrote only beneath the repository's ignored `backups/`
directory, and the detached candidate remained clean afterward.

## Frozen artifacts

| File | Bytes | SHA-256 |
|---|---:|---|
| `00-directory-preflight.sql` | 460 | `4024da1879846b0b3b71f3f6b143e00896e78e1f8bef4cf140206321fbc588d6` |
| `00-ops-preflight.sql` | 463 | `354338640f3faf2678dc5a9c46c8f00592f81b825dbf1907305b4d45cb82f771` |
| `01-directory-organizations.sql` | 823 | `c583d86edd3d8513701bc2c1e13697ec9a990d98368623715ce34324b008e0b7` |
| `02-ops-contacts.sql` | 5167 | `663e22128de85fe19cfb4aca760e27b3689eba3a86546025b9cea7dab0ed60dd` |
| `90-directory-verification.sql` | 462 | `0372874a81e22709855e4999b485684e0c1ac35b7484399146907cb34c211684` |
| `91-ops-verification.sql` | 3959 | `a103f8e86c28d299d5072f80a94a386c639fb2f906686f880ab07c8f36c09ba8` |
| `92-crm-verification.sql` | 1154 | `12c30239b2fe1aceb98b8010dfdffe5386bae1c219c6ec50d6f3e879755bad4d` |
| `manifest.json` | 4495 | `169e7e0231f605b1084a11254dde456972cacfc476de67ca256f0158577bb109` |

Eight-file aggregate, computed as
`sha256(utf8(compact-json(sorted [{name,sha256}])))`:

`f3525a3de5e6f15f63df88ed62b547c1fb4b157b6ce7e1540647982d0f5a9b8c`

The manifest's seven embedded artifact hashes and byte counts match the physical SQL files. The
manifest is schema version 1, kind `pcd-crm-staging-synthetic-pilot`, environment `staging`, data
classification `synthetic_nonproduction`, has `remoteExecutionAuthorized=false`, contains the
exact boundary, and names exactly three fixture organizations and eight fictional contacts.

## Read-only staging revalidation

The authorized read-only revalidation could not complete because Wrangler authentication was not
available to the executing identity:

1. The first aggregate-only directory attempt stopped in the local `npx` wrapper with a Windows
   libuv assertion before a Cloudflare result was returned.
2. The same read was retried through the repository's npm-exec path. Wrangler refused before
   issuing the query because the non-interactive environment had no usable API token.
3. The authenticated workspace shell returned the same pre-query authentication refusal.
4. The Cloudflare dashboard fallback was not signed in. No login, credential extraction, OAuth
   action, or security-setting change was attempted.

No D1 statement returned a result, so no current aggregate may be inferred. The last successful
read-only baseline remains prior evidence only and is not substituted for this action-time check.

## Gate decision

The local generation and hash-freeze portion of Gate 9C-C1-A is PASS. Gate 9C-C1-A as a whole is
**HOLD** because its required read-only staging revalidation is missing. Gate 9C-C1-B is not
executable from this receipt.

If authenticated read-only access is restored before `2026-09-06T15:40:29.000Z`, the exact three
staging D1 aggregates and Worker version/binding readbacks may be completed without regenerating
the packet. If the expiry passes first, this packet becomes permanently invalid for remote use and
a new separately approved generation is required.

No Worker deploy, D1 mutation, packet application, producer flag or remote-boundary change,
rollback, historical transfer, production change, export, send, privacy-policy text, or
secret/provider/resource change occurred.
