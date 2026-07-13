# Sonnet orchestration prompt: finish merging ActivityRadar into PCD

Hand this whole file to a Sonnet session. It is the orchestrator for finishing the ActivityRadar merge so ActivityRadar stops being a separate entity in every place it still is one: code, folders, workers, databases-by-name, statuses, scheduled tasks, docs, and the Forge Command ladder. Run one work package per subagent, verify against live systems, and report pass or fail with evidence.

## The decision this encodes

ActivityRadar is not a standalone venture. It is ParentCoachDesk's camp data layer. Master Plan Track V9 asked whether ActivityRadar is "a standalone product or PCD's database." The answer is PCD's database. This session makes every system reflect that.

## Read first, do not rediscover

1. `Outputs/parent-coach-desk/ACTIVITYRADAR-MERGE-PLAN.md`. This is the backbone. It has a Facts card and work packages WP-0 through WP-7c, dated 2026-07-10. Most of the file move already happened in-tree. Your job on those is to verify current state against live systems and finish whatever is not done, not to redo work.
2. `Outputs/parent-coach-desk/PCD-OPERATING-MANUAL.md`, section 3.2 (the live scheduled-task inventory) and section 1.3 (the workstream and department map).
3. `Outputs/parent-coach-desk/CAMPS_APPROVAL_THRESHOLD.md` if it exists, plus the `campApproval()` function now in `workers-activity-radar/enrichment-worker.ts`.
4. `About Me/Deployments.md`, the ActivityRadar section near the "activity-radar" project block, and the CLAUDE.md norms.

## Guardrails (these govern every work package)

- Model Sonnet. One work package per subagent. Report pass or fail with evidence, then stop.
- One session on this tree at a time. If another Cowork or Claude Code session has this repo open, halt. A cross-session write truncated a worker file in June. Do not repeat it.
- Agents edit and verify. Jeff pastes every `wrangler deploy`, every D1 command, and every dashboard step. Format anything Jeff runs as one PowerShell block per Deployments.md. Never invent flags.
- No new schema migrations during the merge except the one narrow exception the plan already allows in WP-4, plus the optional backfill in WP-8 below, which Jeff pastes.
- Write any runtime JS or TS through the shell and syntax-check it before calling it done. Use the build or the worker bundler, not a single-file TypeScript transpile. The repo has a known quirk where a regex in the enrichment worker makes `tsc --transpileModule` report a false brace error; the real bundler compiles it fine. Judge syntax by the build, not that transpile.
- `/web:commit-check` runs on the session diff before the merge commit.
- HUMAN GATE holds. Nothing publishes, deploys, or deletes without Jeff.

## The physical-names principle

Do not rename live resources. The D1 stays `activity-radar` (id `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`), the R2 bucket stays `activityradar-photos`, the two Workers stay `activityradar-enrichment` and `activityradar-yelp`, and the Pages project stays `parent-coach-playbook`. These are identifiers, and renaming them risks breaking live bindings for no gain. This is the same call the team already made for the `parent-coach-playbook` project name. The merge removes the conceptual separateness, not the physical names. Where a name is unavoidably visible, a one-line comment says it is a historical identifier for PCD's camp layer.

## Part A: finish the existing plan

Work WP-0 through WP-7c in `ACTIVITYRADAR-MERGE-PLAN.md` in order. For each, first check whether it is already done against the live tree and live systems, then finish it if not. Honor each "Done when" line as the exit check. Write the result into that file's Phase reports section. Do not restate the plan here; it is the source.

The likely-open ones to confirm with evidence: WP-3 (both Workers deployed from parent-coach-desk source, one clean cron tick each), WP-5 (activityradar.com returns 301 to parentcoachdesk.com/camps, old Pages project gone, old repo archived), WP-7a and WP-7b (Deployments.md still carries a separate ActivityRadar section that treats it as its own repo and Pages project; that section gets folded into the PCD entry or clearly marked as PCD's camp layer).

## Part B: new work packages this session adds

The plan predates two things Jeff has now asked for directly. Add them as work packages and run them with the same rules.

### WP-8: unify the status model

Problem: a camp carries two status fields that can disagree. `record_status` is the ActivityRadar field (`active`, `unverified`, `inactive`). `pcd_status` is the PCD field (`pending`, `approved`, `rejected`), and it is the one the public site filters on (`listApprovedCamps` uses `WHERE pcd_status='approved'`). The enrichment worker used to set `record_status='active'` without setting `pcd_status`, which is why scraped camps were live-by-one-field and hidden-by-the-other. The worker now sets both through `campApproval()`.

Make PCD's `pcd_status` the single source of truth and `record_status` a derived mirror:

1. Confirm the worker fix: every new scraped program sets `pcd_status` and a matching `record_status` (`approved` maps to `active`, else `unverified`). It does now via `campApproval()`; verify by reading the code and, after the next cron tick, by querying a few fresh rows.
2. Document the mapping in one place, `camps-db.ts` near the existing `recordStatus` derivation and in `CAMPS_APPROVAL_THRESHOLD.md`: `approved -> active`, `rejected -> inactive`, `pending -> unverified`. No code reads `record_status` to decide public visibility. If any does, change it to read `pcd_status`.
3. Backfill the drift, Jeff pastes the D1 command: any program whose `record_status` disagrees with its `pcd_status` gets `record_status` reset to the mapping above. Report the count before and after. This is data, not schema, so it needs no migration.
4. Report any place in the codebase that still branches on `record_status` for anything a parent sees, and either fix it or flag it for Jeff.

**Done when:** the mapping is documented, the worker sets both fields, no public-visibility code path reads `record_status`, and the backfill count is logged.

### WP-9: scheduled tasks and the Forge Command ladder

Make ActivityRadar stop being a separate entity in the automation and in Forge Command.

1. Inventory the live Cowork scheduled tasks that touch this data (PCD Operating Manual section 3.2 is the current list). The one carrying ActivityRadar-as-separate language is `org-discovery-daily-worklist`, whose description calls the database "parent-coach-desk / ActivityRadar's shared database." Rewrite its description and any in-prompt language to name PCD as the owner and the database as PCD's camp layer. Do not change its schedule or its logic. Check every other task's description for the same residue and fix wording only.
2. Confirm the two Cloudflare Worker crons (`activityradar-enrichment` hourly, `activityradar-yelp` daily) are covered in the manual's inventory. They are Workers, not Cowork tasks, so they will not appear in the Cowork list; add a one-line note in section 3.2 that they exist and run against the shared D1, so the picture is complete.
3. Update the Forge Command record: in `Outputs/Forge Command/FORGE-COMMAND-MASTER-PLAN.md` section 13, resolve Track V9 by stating ActivityRadar is merged into PCD as its camp data layer, not a standalone venture. Update the venture ladder row in Notion the same way. If a separate ActivityRadar venture page exists in the ladder, fold it into the ParentCoachDesk.com page and leave a redirect note.
4. Log the decision to the Field & Forge Decision Journal (both `Outputs/Forge Command/decision-log.md` and the Notion Decision Journal): ActivityRadar folded into PCD, Track V9 resolved, physical names kept, status model unified.
5. Update the PCD Operating Manual: section 3.2 note added, and a line in Open Items marking the ActivityRadar merge as in progress or done with a pointer to `ACTIVITYRADAR-MERGE-PLAN.md`.

**Done when:** no live scheduled task describes ActivityRadar as separate, the two Workers are noted in the manual, Track V9 is resolved in the master plan and Notion, and the decision is logged.

## Deliverables

- `ACTIVITYRADAR-MERGE-PLAN.md` Phase reports filled in for WP-0 through WP-9, each pass or fail with evidence.
- One clean merge commit through `/web:commit-check`, pushed. Jeff pastes the deploy and any D1 commands as PowerShell.
- Updated Deployments.md, CLAUDE.md norms, the master plan section 13, the PCD Operating Manual, `CAMPS_APPROVAL_THRESHOLD.md`, and the Decision Journal.

## Report back

End with a short status: which work packages passed, which are blocked and on what, the status-drift backfill count, the count of scheduled tasks relabeled, and any live resource you recommend renaming later despite the physical-names principle, with the reason. One line on anything that still treats ActivityRadar as separate that this session did not reach.
