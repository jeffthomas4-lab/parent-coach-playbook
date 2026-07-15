# Plan: Recover a trustworthy repository baseline

**Plan ID:** 001
**Author:** Codex
**Date:** 2026-07-15
**Status:** Approved by Jeff, 2026-07-15

## Objective **[required]**

Establish a stable, attributable, reviewable Git baseline for ParentCoachDesk before line-ending normalization or further application work. Preserve every existing change, identify the active working set and its owner, commit the coordination protocol independently, and produce an evidence-based inventory of D1 mutation surfaces without changing application behavior.

## Tier **[required]**

Tier 3. This plan governs a repository-wide dirty worktree, branch/history preservation, future normalization across many surfaces, and the inventory of automated database mutations. It does not authorize application changes, normalization, production access, deployment, migration execution, or database writes.

## Business outcome **[required]**

This is groundwork. After completion, Jeff, Claude, and Codex can identify which changes belong together, review bounded commits instead of an unstable 35,000-line working-tree diff, and plan line-ending cleanup without risking loss or accidental incorporation of substantive work. D-001 will also have a factual mutation inventory suitable for an approval decision.

## Current-state evidence **[required]**

The shared snapshot is `coordination/CURRENT_STATE.md`, verified 2026-07-15. Because the worktree changed during that inspection, every implementation run must refresh the evidence below before acting.

- **Verified in code:** current branch is `migration/pages-to-workers-staging`; it has no configured upstream.
- **Verified in code:** the tracked working-tree diff contains 123 modified files.
- **Verified in code:** the untracked count changed during inspection. No historical count is authoritative.
- **Verified in code:** `tsconfig.check.json` appeared during Claude's session and `tsconfig.nocron.tmp.json` appeared and disappeared. Claude did not create them. Codex did not create either file and did not intentionally run a command that would generate them.
- **Not verified:** which actor or process created those TypeScript configurations.
- **Verified in code:** no `.gitattributes` or `.editorconfig` was found in the repository during the 2026-07-15 inspection.
- **Verified in code:** whitespace-insensitive comparison reduces the apparent modified set substantially, indicating line-ending churn mixed with substantive changes.
- **Verified in code:** `origin` is configured, but the current branch has no upstream.
- **Not verified:** whether equivalent current work exists in any remote branch or commit.
- **Verified in code:** D1 mutation statements exist in `src/lib/camps-db.ts`, `src/lib/agent-runs.ts`, `src/pages/api/search-event.ts`, `worker-link-checker/src/index.ts`, `workers-activity-radar/enrichment-worker.ts`, and `workers-activity-radar/yelp-worker.ts`.
- **Verified in code:** generated SQL under `buildout/hit-rate-test/out/` contains organization updates; generation of SQL does not itself prove execution.
- **Not verified:** which D1 writers are deployed, scheduled, enabled, human-triggered, or autonomous in any live environment.
- **Documented as deployed:** the operating manual describes scheduled camp discovery/enrichment writes. This is not confirmation of current execution.

## Scope **[required]**

1. Prove the worktree is quiet for the duration of baseline recovery.
2. Identify the provenance of temporary TypeScript configurations or explicitly record it as unresolved.
3. Capture a sanitized manifest of modified and untracked paths, grouped by likely workstream without assigning ownership from filenames alone.
4. Ask Jeff to confirm ownership and disposition for each workstream group.
5. Commit only the eight coordination setup files after Jeff approves that commit.
6. Establish a preservation checkpoint for the substantive working set only after Jeff approves its exact contents and commit boundaries.
7. Trace D1 mutation surfaces from entrypoint or scheduled trigger to bound statement and human gate.
8. Update `CURRENT_STATE.md`, the active handoff, and D-001 evidence from the verified results.
9. Produce, but do not execute, a separate Plan 002 for line-ending policy and selective normalization.

## Non-goals **[required]**

- Do not normalize line endings.
- Do not add `.gitattributes` or `.editorconfig` under this plan.
- Do not edit application code, tests, migrations, Wrangler configuration, generated assets, or automation prompts.
- Do not delete, rename, clean, reset, restore, checkout, stash, or discard any existing path.
- Do not use `git add -A`, `git add .`, or broad wildcard staging.
- Do not create a branch or worktree until Jeff approves the preservation strategy and the worktree is quiet.
- Do not fetch, push, merge, rebase, deploy, apply migrations, access production, inspect secret values, send outbound messages, or modify database data.
- Do not approve D-001 through D-004 automatically.
- Do not treat generated SQL, documentation, filenames, or scheduled-task definitions as proof that a live write occurs.
- Do not fix application validation failures in this plan.

## Files likely affected **[required]**

Only coordination artifacts may be edited before the substantive checkpoint is approved:

- `coordination/CURRENT_STATE.md`
- `coordination/HANDOFF.md`
- a new immutable file under `coordination/handoffs/`
- `coordination/DECISIONS.md`, limited to evidence corrections; decision statuses remain Proposed unless Jeff separately approves them
- this plan's status field after Jeff's decision
- a new Plan 002 under `coordination/plans/`

The eight existing coordination setup files may be committed as one documentation-only commit. No other path may enter that commit.

The D1 inventory reads, but does not modify, these likely surfaces:

- `wrangler.jsonc`
- `worker-cron/src/index.ts`
- `worker-cron/wrangler.toml`
- `worker-link-checker/src/index.ts`
- `worker-link-checker/wrangler.toml`
- `workers-activity-radar/enrichment-worker.ts`
- `workers-activity-radar/yelp-worker.ts`
- `workers-activity-radar/wrangler.toml`
- `src/lib/camps-db.ts`
- `src/lib/agent-runs.ts`
- `src/pages/api/search-event.ts`
- `src/pages/api/agent-runs.ts`
- relevant `src/pages/api/**` callers
- `buildout/hit-rate-test/README.md`
- `buildout/hit-rate-test/daily_discovery.py`
- `buildout/hit-rate-test/import_results.py`
- relevant agent skill/spec files that declare the trigger

## Step-by-step implementation **[required]**

### Phase 1: Quiet-worktree gate

1. Jeff confirms that Claude Code, Codex, development servers, test watchers, build watchers, and other repository-writing processes are stopped.
2. Claude records the current time and runs these read-only commands from the repository root:

   ```powershell
   git status --porcelain=v1 --untracked-files=all
   git diff --name-status
   git ls-files --others --exclude-standard
   Get-Process | Where-Object { $_.ProcessName -match 'node|python|claude|codex|wrangler|astro|vitest' } | Select-Object ProcessName,Id,StartTime
   ```

3. Claude hashes the three Git listings in memory or a temporary location outside the repository. Do not create a repository file for sampling.
4. Repeat the three Git listings after at least five minutes with no repository-writing command in between.
5. If any path appears, disappears, or changes, stop. Record the changed paths and process observations in a new handoff. Do not infer the actor.
6. If the listings remain identical, label the worktree `Observed stable for <duration>` rather than `Confirmed quiet`.

Exit gate: Jeff acknowledges either the observed-stable result or the unresolved concurrent-writer risk before Phase 2.

### Phase 2: Provenance and ownership manifest

1. Read, without modifying, `tsconfig.verify.json` and `tsconfig.check.json` if present. Record creation/modification times, contents, and whether any tracked file references them.
2. Search shell history, task logs, or process logs only where already locally available and authorized. Do not inspect secrets or external systems.
3. Classify provenance as one of: identified actor and purpose; likely generated with evidence; unresolved. Do not classify from naming pattern alone.
4. Produce a sanitized path manifest grouped by evidence-supported workstream:
   - Pages-to-Workers migration
   - authentication/admin safety
   - camp data and admin UI
   - automation/run logging
   - email/publishing/Slack
   - editorial and reports
   - generated images/assets
   - line-ending-only candidates
   - unknown
5. For every group, record whether it contains tracked modifications, untracked additions, generated outputs, or a mixture.
6. Jeff assigns each group an owner and disposition: preserve in the current migration; move to a later task; generated/ignored candidate; or unknown pending inspection.

Exit gate: no checkpoint is created until every path is assigned a disposition or explicitly marked unresolved by Jeff.

### Phase 3: Coordination-only commit

1. Re-read the eight coordination files and review their diff.
2. Correct remaining factual overstatements before staging. In particular, D-002 must not state that prose cannot be queried, diffed, or asserted against; the governing distinction is whether prose controls consequential automated action.
3. Run a secret-pattern scan limited to `coordination/`, reviewing matches manually. Do not print values from environment files.
4. Stage the eight approved paths explicitly, one by one. Do not stage this Plan 001 unless Jeff explicitly includes it in the same commit; otherwise stage it in its own later documentation commit.
5. Run:

   ```powershell
   git diff --cached --name-status
   git diff --cached --check
   git status --short
   ```

6. Confirm the staged name list contains only the paths Jeff approved.
7. Commit only after Jeff explicitly approves the exact staged list and commit message.
8. Do not push.

Exit gate: coordination documentation exists in a bounded local commit with no application/configuration paths.

### Phase 4: Preserve the substantive working set

1. Using the Phase 2 manifest, propose explicit commit groups and exact path lists. Separate generated assets from source and separate unrelated workstreams.
2. For each proposed group, show Jeff:
   - exact paths;
   - substantive diff summary ignoring whitespace;
   - known author/owner;
   - validation status;
   - unresolved questions;
   - proposed commit message.
3. Jeff approves, rejects, or revises each group.
4. Stage only approved explicit paths. Review `git diff --cached --name-status`, `git diff --cached --stat`, and `git diff --cached --check` before every commit.
5. Run validation proportionate to each group. Record pre-existing failures separately and do not claim a clean baseline if `npm run check` remains failing.
6. Create local checkpoint commits only after Jeff's per-group approval.
7. Do not push or create an upstream under this plan.

Exit gate: every substantive existing change is either preserved in a bounded local commit or explicitly recorded as unresolved/uncommitted with an owner. No path is silently omitted.

### Phase 5: Trace the D1 mutation inventory

1. Start from executable entrypoints, not filenames. For each root Worker and Astro API endpoint, record:
   - entrypoint/config;
   - trigger: HTTP, cron, scheduled external task, manual command, or unknown;
   - environment/binding name;
   - mutation function and SQL statement;
   - tables and mutation class;
   - authentication/authorization gate;
   - human approval gate;
   - batch size and idempotency behavior;
   - backup/rollback evidence;
   - deployed/enabled state using the coordination evidence labels.
2. Trace at minimum:
   - camp submissions and admin mutations through `src/lib/camps-db.ts`;
   - `search_events` ingestion;
   - `agent_runs` and CANARY registry updates;
   - link-health inserts and updates;
   - camp enrichment and Yelp workers;
   - hit-rate/discovery SQL generation and the separate command that would apply it;
   - cron Worker calls to other endpoints, distinguishing invocation from direct D1 writes.
3. Classify each mutation under the proposed D-001 categories: append-only/discardable; reconstructible update; difficult-to-reconstruct; destructive; bulk. Classification is evidence for Jeff, not approval of D-001.
4. Do not mark anything Confirmed live without live verification separately authorized by Jeff.
5. Update D-001 Context with the verified inventory. Keep its status Proposed.

Exit gate: every named writer has a traced trigger-to-statement path or is explicitly marked Not verified.

### Phase 6: Prepare Plan 002

1. Write a separate Tier 3 plan for repository line-ending policy and selective normalization.
2. Plan 002 must start from the preserved commit baseline created above.
3. It must specify proposed `.gitattributes` patterns, treatment of binary/generated/vendor/archive files, Windows scripts, shell scripts, and cross-platform files.
4. It must separate the policy commit from the mechanical normalization commit.
5. It must prove that the mechanical commit changes line endings only using content hashes or normalized comparisons.
6. Do not implement Plan 002 until Jeff approves it.

## Testing strategy **[required]**

This plan changes coordination records and Git history organization, not application behavior. Validation focuses on preservation and bounded diffs.

Required checks:

```powershell
git status --short
git diff --cached --name-status
git diff --cached --check
git show --stat --oneline --decorate HEAD
git show --format= --name-status HEAD
```

For each substantive checkpoint group, run its existing relevant tests and record exact commands, exit codes, concise results, and error excerpts. At minimum, before declaring the recovered baseline reviewable:

```powershell
npm.cmd test
$env:ASTRO_TELEMETRY_DISABLED='1'; npm.cmd run check
npm.cmd audit --audit-level=high
npx.cmd tsc --noEmit -p worker-cron/tsconfig.json
npx.cmd tsc --noEmit -p worker-link-checker/tsconfig.json
```

Known evidence from Codex's earlier read-only audit, to be re-run after checkpointing rather than assumed current:

- 222 tests passed.
- Dependency audit reported zero vulnerabilities.
- Astro check failed with 26 errors and a dynamic camps-route collision warning.
- Both standalone Worker TypeScript checks passed.

Do not run the full build until the tracked generated-output behavior is understood, because the build can regenerate `public/link-manifest.json` and OG assets. When a later plan authorizes a build, compare Git status before and after and attribute every generated change.

## Acceptance criteria **[required]**

1. No unexplained repository mutation occurs during the observed-stable sampling window, or Jeff explicitly accepts the unresolved risk before proceeding.
2. Provenance of `tsconfig.check.json` and `tsconfig.nocron.tmp.json` is identified or formally recorded as unresolved without speculation.
3. Every pre-existing modified or untracked path is assigned an owner/disposition or explicitly marked unresolved by Jeff.
4. The coordination setup is committed in a bounded local commit containing only Jeff-approved coordination paths.
5. No existing application/configuration path is lost, reverted, normalized, or silently incorporated into the coordination commit.
6. Substantive working-set checkpoints use explicit path lists and Jeff-approved boundaries; no broad staging command is used.
7. Current validation results are recorded without hiding existing failures.
8. The D1 inventory traces each claimed writer from trigger to mutation statement and labels deployed/live state honestly.
9. D-001 is updated with evidence but remains Proposed until Jeff separately approves it.
10. Plan 002 exists for line-ending policy and normalization, but no normalization has occurred.
11. `git status`, commit IDs, and remaining uncommitted paths are recorded in the closing handoff.

## Human approval gates **[required]**

1. Jeff confirms repository-writing processes are stopped or accepts the unresolved concurrency risk.
2. Jeff assigns ownership/disposition to the current working-set groups.
3. Jeff approves the exact coordination paths and commit message before the coordination commit.
4. Jeff approves every substantive checkpoint group and exact path list before staging/commit.
5. Jeff decides whether any local checkpoint may later be pushed and where; pushing is outside this plan.
6. Jeff separately approves or rejects D-001 through D-004. This plan does not approve them.
7. Jeff approves Plan 002 before line-ending policy or normalization work begins.

## Open questions **[required]**

1. What process created `tsconfig.check.json` and the now-absent `tsconfig.nocron.tmp.json`?
2. Which existing working-set groups belong to the Pages-to-Workers migration, and which belong to separate automation work?
3. Should Plan 001 be committed with the initial eight coordination files or as a separate coordination commit after protocol approval?
4. Which generated assets are intentionally versioned, and which should be ignored in a later plan?
5. Which local validation failures predate the current working set versus result from it?
6. Does Jeff want repository-local shared instructions under D-004 before substantive implementation resumes?

---

## Dependencies **[Tier 3]**

- Jeff's identification of active tools/processes and confirmation that they are stopped.
- Jeff's ownership decisions for the existing working set.
- Stable access to the current local repository state.
- Existing Git executable and local history.
- No production or network access is required for this plan.

## Architecture and data flow **[Tier 3]**

This plan creates a trustworthy control boundary:

```text
unstable, unattributed working tree
            |
            v
observed-stable sampling + provenance evidence
            |
            v
Jeff-approved path ownership and commit boundaries
            |
            +--> coordination-only commit
            |
            +--> bounded substantive checkpoint commits
            |
            +--> traced D1 mutation inventory
            v
reviewable baseline for Plan 002 and later feature work
```

Git history becomes the preservation mechanism only after Jeff approves what each commit contains. Documentation remains evidence-labeled and does not establish production state.

## Data model or migration changes **[Tier 3]**

None. Migration files may be read for inventory purposes but must not be edited or applied. The duplicate `0009` prefix remains a separate stabilization concern.

## Security and privacy requirements **[Tier 3]**

- Never print or record secret values.
- Refer to bindings and environment variables by name only.
- Do not read `.env` values for this plan.
- Do not query production databases or external services.
- Do not treat authorization code existence as proof that a deployed route is protected.
- Preserve the human approval gates for publishing, outbound email, deletion, production mutations, deployment, pushing, and merging.
- Sanitize process-command observations if they contain tokens or private paths before writing a handoff.

## Failure modes **[Tier 3]**

- **Another writer mutates the tree:** stop immediately, record changed paths, and return to Jeff.
- **Unknown ownership remains:** do not checkpoint that group; keep it uncommitted and identified in the handoff.
- **Coordination staging includes another path:** unstage only the mistakenly staged path without reverting its working-tree contents, then re-review. Never reset or discard the file.
- **A checkpoint mixes line-ending churn with substance:** reject the boundary and redesign the group; do not normalize opportunistically.
- **Validation changes tracked generated files:** stop and attribute the generator before committing.
- **D1 trigger cannot be traced:** label it Not verified; do not infer autonomy.
- **Remote or production state is required:** stop and request separate authorization; it is outside this plan.

## Edge cases **[Tier 3]**

- Git may collapse untracked directories unless `--untracked-files=all` is used; compare path manifests, not only summary counts.
- A file may contain both substantive edits and line-ending changes; whitespace-insensitive similarity does not prove it is normalization-only.
- A generated file may be intentionally tracked and required for deployment.
- A cron Worker may invoke a mutating endpoint without directly holding a D1 binding; inventory both invocation and mutation separately.
- A scheduled external task may apply generated SQL manually or through a command not referenced by package scripts.
- The same D1 table may receive both append-only telemetry and destructive administrative updates, requiring per-operation classification.
- Temporary files can disappear before inspection; absence does not prove they never existed.

## Observability **[Tier 3]**

- The active `coordination/HANDOFF.md` records the current gate and next owner.
- Immutable handoffs record sampling hashes, exact commit IDs, staged path lists, validation results, and unresolved provenance.
- The D1 inventory records evidence labels per trigger and writer.
- Plan 002 may begin only when Plan 001's closing handoff names a stable checkpoint commit and all remaining uncommitted paths.

## Deployment plan **[Tier 3]**

None. This plan creates local documentation and approved local checkpoint commits only. It authorizes no push, merge, deploy, migration, or production action.

## Rollback plan **[Tier 3]**

No existing content is reverted under this plan. If an incorrect path is staged, unstage that path while preserving its working-tree contents. If a local coordination or checkpoint commit is incorrect, stop and ask Jeff for a corrective forward commit strategy; do not reset or rewrite history without explicit approval.
