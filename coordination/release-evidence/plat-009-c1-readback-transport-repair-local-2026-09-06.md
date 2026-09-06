# PLAT-009 C1 readback transport repair

Status: **PASS-LOCAL / FRESH C1-A HOLD / REMOTE PILOT HOLD**

Recorded: `2026-09-06`

## Identity

- incident receipt: `48bf05c80ee74a3c35cd47c14811d5ba85f0db69`
- repair candidate: `aef3385e254b5eb6cf4a483436da91297e5fb39d`
- candidate tree: `90467d4032bb9906be5414088df261b7e94789e7`
- repaired packet-generator SHA-256:
  `c3620e51331f932b20a9f54e676d016a0e75565d042caeaba0185bea693f3fa0`
- unchanged deploy-guard SHA-256:
  `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`

## Finding

Wrangler's official implementation sends remote `d1 execute --file` through the D1 import
endpoint, including upload and ingestion, while `--command` uses the query endpoint. During the
approved C1-A readback at boundary `1788711908000`, the directory and ops SELECT files returned
zero rows written but also `changes=1`, `changed_db=true`, and new bookmarks. Direct-command
SELECTs immediately proved every application aggregate unchanged.

The packet aggregate
`4e3faa58daf34b29adecd12aae58756aea5b8a2fa49eea3f6d9df79ccbed73be`
is nevertheless permanently invalid for remote use. C1-B may not name it.

## Repair

Every newly generated manifest now contains this executable contract:

```json
{
  "readOnlyD1Transport": {
    "requiredFlag": "--command",
    "prohibitedFlags": ["--file"],
    "requiredMeta": {
      "success": true,
      "changes": 0,
      "rows_written": 0,
      "changed_db": false
    }
  }
}
```

The hard-stop list also states that every remote read-only D1 preflight must use `--command`, that
`--file` uses the import endpoint, and that `--file` is prohibited. The fixed packet remains eight
files; no additional executor, dependency, authority path, or remote capability was introduced.

## Dependency decision

Live npm, PyPI, and GitHub review found maintained Execa, an interactive third-party D1 CLI, and
Cloudflare's official Wrangler source. Execa adds twelve dependencies for behavior native
`child_process` already supplies, while the third-party D1 CLI adds a second authentication and
execution path. Neither fits this repair. The existing official Wrangler client and native Node
primitives remain the only execution path; no dependency was added.

## Red-first and verification evidence

- red-first focused regression: **1/1 failed** against prior behavior because
  `manifest.readOnlyD1Transport` was `undefined`;
- focused regression after repair: **1/1 PASS**;
- packet, read-only transport, and staging deploy-guard suites: **3 files / 30 tests PASS** in
  24.83 seconds;
- the full synthetic packet journey still exercises all three organizations, eight contact
  dispositions, raw-free DNC propagation, receipt prerequisites, hashes, and receiver counts;
- `npx tsc --noEmit`: PASS;
- `git diff --check`: PASS before candidate commit;
- unrelated modified/untracked public-site files remained untouched and unstaged.

## Performance review

- approximate algorithmic complexity: `O(1)` for the fixed manifest object;
- DB query count on primary path: unchanged; this code generates local artifacts only;
- external API calls: zero;
- queue jobs created: zero;
- expected memory behavior: one fixed small object and eight bounded synthetic artifacts;
- likely scaling bottleneck: none in this repair; eventual hosted backfill throughput remains the
  bounded Service Binding/D1 outbox path.

## Authority boundary

No Worker deploy, packet application, producer flag/boundary change, historical transfer,
production change, non-backup export, outbound send, privacy-policy text, payment activity, or
secret/provider/resource change is authorized or performed by this repair. The prior file-mode
metadata transactions are retained in the incident receipt and are not represented as read-only.

## Exact next approval

> Approve CRM Gate 9C-C1-A command-only regeneration exactly as recorded at evidence commit
> `<EVIDENCE_COMMIT>`, using PCD candidate
> `aef3385e254b5eb6cf4a483436da91297e5fb39d`, packet-generator SHA-256
> `c3620e51331f932b20a9f54e676d016a0e75565d042caeaba0185bea693f3fa0`, and deploy-guard SHA-256
> `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`.
> Acknowledge that the packet at boundary `1788711908000` is permanently invalid because its
> Wrangler file-mode preflight returned `changed_db=true`. Authorize exactly one new local-only
> generation and hash-freeze of the fixed eight-file synthetic staging packet at one fresh
> second-aligned boundary beneath ignored `backups/`, plus immediate authenticated staging
> revalidation using direct `d1 execute --command` SELECTs only and requiring every response to
> report `success=true`, `changes=0`, `rows_written=0`, and `changed_db=false`. Stop before any
> Worker deploy, D1 mutation, packet application, producer flag or remote-boundary change,
> rollback, historical transfer, production change, non-backup export, send, privacy-policy text,
> payment activity, or secret/provider/resource change.
