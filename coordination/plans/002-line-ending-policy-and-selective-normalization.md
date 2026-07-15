# Plan: Establish line-ending policy and selectively normalize text files

**Plan ID:** 002
**Author:** Codex
**Date:** 2026-07-15
**Status:** Awaiting Jeff

## Objective **[required]**

Add an explicit cross-platform line-ending policy and mechanically normalize only repository-owned text files, proving that the normalization commit changes no text content.

## Tier **[required]**

Tier 3. The mechanical pass can touch much of the repository and must not conceal substantive edits or corrupt binary/generated/archive content.

## Business outcome **[required]**

Future Claude/Codex reviews show semantic changes instead of CRLF/LF churn, and Windows and Unix tools produce stable checkouts.

## Current-state evidence **[required]**

- **Verified in code:** Plan 001 preserved the dirty working set in bounded commits `1a9b122` through `5c4c56f`.
- **Verified in code:** after those checkpoints, only `tests/probe.txt` remains untracked.
- **Verified in code:** Git repeatedly warned that LF working copies would be replaced by CRLF; the repository has no committed `.gitattributes`.
- **Verified by tests:** 233 tests pass; `tsconfig.verify.json` and `worker-cron/tsconfig.json` type checks pass; the high-severity dependency audit is clean.
- **Verified by tests:** `astro check` fails with four existing content-body errors and a duplicate SSR route warning. Plan 002 does not fix those failures.
- **Not verified:** the preferred line endings for every third-party, archived, or generated file class.

## Scope **[required]**

1. Add `.gitattributes` in a policy-only commit.
2. Classify tracked files as repository-owned text, platform-specific scripts, binary, generated, vendor, archive, or unknown.
3. Normalize only approved repository-owned text in a separate mechanical commit.
4. Prove normalized file content is byte-equivalent after newline canonicalization.

## Non-goals **[required]**

- No application behavior changes, formatting, dependency updates, file deletion, generated-output refresh, build, deployment, migration, or production access.
- Do not modify `tests/probe.txt`; its cleanup remains separate.
- Do not normalize binary, generated, vendored, imported, archived, backup, or data-export content without an explicit per-class decision.
- Do not use normalization to fix whitespace, encoding, mojibake, or syntax defects.

## Files likely affected **[required]**

- New `.gitattributes`.
- Approved repository-owned text extensions: `*.ts`, `*.tsx`, `*.js`, `*.mjs`, `*.cjs`, `*.astro`, `*.json`, `*.jsonc`, `*.toml`, `*.yaml`, `*.yml`, `*.md`, `*.css`, `*.html`, `*.sql`, `*.py`, `*.ps1`, `*.sh`.
- Explicit exclusions pending classification: `activityradar-archive/**`, `imports/**`, `buildout/**/out/**`, `public/**/*.jpg`, `public/**/*.jpeg`, `public/**/*.png`, `public/**/*.gif`, `public/**/*.webp`, `public/**/*.pdf`, `node_modules/**`, `dist/**`, `backups/**`, lockfiles, CSV/JSONL data exports, and any generated manifest.

## Proposed policy

Start with this policy for review; do not write it until approval:

```gitattributes
* text=auto

*.ts text eol=lf
*.tsx text eol=lf
*.js text eol=lf
*.mjs text eol=lf
*.cjs text eol=lf
*.astro text eol=lf
*.json text eol=lf
*.jsonc text eol=lf
*.toml text eol=lf
*.yaml text eol=lf
*.yml text eol=lf
*.md text eol=lf
*.css text eol=lf
*.html text eol=lf
*.sql text eol=lf
*.py text eol=lf
*.sh text eol=lf
*.ps1 text eol=crlf

*.jpg binary
*.jpeg binary
*.png binary
*.gif binary
*.webp binary
*.pdf binary
```

PowerShell remains CRLF for Windows compatibility; shell scripts and cross-platform source use LF.

## Step-by-step implementation **[required]**

1. Confirm a clean index and record `HEAD`, branch, and `git status --short`. Stop if any unexplained writer appears.
2. Inventory tracked extensions and Git's current attribute decisions with `git ls-files` and `git check-attr -a -- <path>` sampling.
3. Present Jeff with every ambiguous class, especially lockfiles, CSV/JSONL, generated manifests, archives, and imports. Mark each normalize, preserve, or exclude.
4. Add only `.gitattributes`. Run `git diff --check`, inspect the cached path list, and commit the policy alone after Jeff approves the exact file and message.
5. Record a pre-normalization manifest for every candidate: path, raw hash, and a canonical-content hash calculated after converting CRLF and CR to LF in memory. Store the sanitized manifest outside the repository or in an approved coordination record.
6. Run `git add --renormalize` only against explicit approved path lists or extensions. Never run it across excluded directories.
7. Verify the cached list contains only approved text paths. Stop on binary, generated, archive, imported, unknown, or substantively modified files.
8. Recalculate canonical-content hashes from the staged blobs and require exact equality with the pre-normalization hashes for every path.
9. Inspect `git diff --cached --ignore-space-at-eol --ignore-cr-at-eol --exit-code`; expected exit code is 0. Investigate any nonzero result rather than overriding it.
10. Run the validation suite. Commit the mechanical normalization separately only after Jeff approves the cached list and proof summary.
11. Do not push.

## Testing strategy **[required]**

Required before and after the mechanical commit:

```powershell
npm.cmd test
$env:ASTRO_TELEMETRY_DISABLED='1'; npm.cmd run check
npx.cmd tsc --noEmit -p tsconfig.verify.json
npx.cmd tsc --noEmit -p worker-cron/tsconfig.json
npm.cmd audit --audit-level=high
```

The known Astro failure must remain identical in error count and affected paths. PowerShell scripts modified by normalization must parse using `System.Management.Automation.Language.Parser`. Shell scripts must receive an available syntax-only check.

## Acceptance criteria **[required]**

1. `.gitattributes` is committed alone.
2. Every normalized path was explicitly approved and has identical canonical-content hashes before and after.
3. No binary, generated, archive, imported, vendor, backup, or unknown file is normalized accidentally.
4. Tests and both TypeScript checks pass; audit remains clean; Astro diagnostics do not regress.
5. Policy and mechanical normalization are separate local commits; nothing is pushed or deployed.

## Human approval gates **[required]**

1. Jeff approves the file-class disposition and exact `.gitattributes` content.
2. Jeff approves the policy-only staged file and commit message.
3. Jeff approves the exact mechanical cached path list and hash proof before commit.
4. Any later push or merge requires separate approval.

## Open questions **[required]**

1. Should tracked lockfiles remain `text eol=lf` or be excluded from mechanical normalization?
2. Should CSV/JSONL and generated manifests be policy-controlled but excluded from this first normalization?
3. Should archived/imported repository-owned source ever be normalized, or permanently excluded?

## Dependencies **[Tier 3]**

A stable worktree, the Plan 001 checkpoint baseline, and Jeff's per-class decisions.

## Data model or migration changes **[Tier 3]**

None. SQL text may have newline normalization only; no migration content may change.

## Security and privacy requirements **[Tier 3]**

Do not hash or print ignored secrets, environment files, backups, or untracked private material. Only tracked approved paths enter manifests.

## Failure modes **[Tier 3]**

- Canonical hashes differ: unstage the affected path and investigate; do not commit.
- Generated or binary path appears: stop and remove it from the approved normalization list.
- Validation regresses: do not commit the mechanical pass.
- Another writer changes the tree: return to the quiet-worktree gate.

## Rollback plan **[Tier 3]**

Because the two commits are local and behavior-neutral, rollback is a normal revert of the mechanical commit followed, if necessary, by a separate revert of the policy commit. No history rewrite is required.
