# On-computer build handoff — Parent Coach Desk (2026-07-18)

**For:** the next Claude session started **On your computer** (Windows host), which has a reliable local shell.
**Why this exists:** the prior session ran in the cloud sandbox, whose `device_bash` bridge **truncates repo file reads** and cannot safely run git/tests/build (your 2026-07-17 log already recorded "git write fails over the cloud bridge"). All discovery below was done from intact bridge copies; the *building* was deferred to you because you can validate and commit.

Standing architecture (Jeff's instruction): **Sonnet subagents do the coding in parallel; Opus orchestrates.**

## 0. First, confirm the shell is trustworthy
Run these and confirm files are NOT truncated:
```
git rev-parse HEAD              # expect d799631 (Hand off remaining build plan to Claude); 5a24aa8 is its parent
git status --porcelain=v1       # expect ONLY the unrelated dirty files in §2 below — NOT ~90 modified files
```
If `git status` shows ~90 modified tracked files ending mid-line, the shell is still serving truncated reads — stop and fix the environment before doing anything (do NOT commit; that would write corruption).

## 1. Verify the baseline before claiming it (do not trust the prior number blindly)
Run the serialized full suite (one worker), Astro diagnostics, production build, and built-link contract. Expected baseline: **161 test files / 809 tests pass**, Astro **0 errors / 0 warnings / 356 hints**, production build passes, `check:built-links` passes, `check:root-organization` = 85 artifacts + 36 directories, 139/139 routes classified. Only claim the baseline after observing it here.

## 2. Working-tree boundary — preserve, never touch
Unrelated user work; do not stage/edit/delete/move/reformat unless Jeff changes scope:
modified `buildout/hit-rate-test/out/_todo.tsv`, `buildout/hit-rate-test/out/results.jsonl`; untracked `body.json`; untracked hit-rate diagnostics (`_now.txt`, `_push_insert.sql`, `_push_pairs.json`, `_push_update.sql`, `_rec2.py`, `import-2026-07-17.sql`, `review-2026-07-17.csv`); untracked `worker-cron/schema/`; phantom `NUL/`.
Stage only explicit files for the current slice. Never `git add -A`.

## 3. Build these local slices, in order (all need NO owner approval)
Each as the smallest vertical slice: focused tests + proportionate validation; before any release-facing handoff run the serialized full suite + Astro diagnostics + production build + built-link contract + affected generated-inventory checks; ask Codex to review each diff; commit only explicit slice files; update `coordination/CURRENT_STATE.md`, the build-plan audit, and a fresh handoff with evidence + claim boundaries.

1. **Warm-up (confirms the commit loop):** fix the stale doc string at `src/pages/admin/search-signals.astro:69` — replace `wrangler pages dev` with the Worker-local dev command. One line.
2. **Q5 — biggest downtime gap:** add an auto-remediation step to the deploy job so that on post-deploy smoke/health failure it auto-invokes rollback to the recorded good version ID, or at minimum halts and emits an unambiguous alert instead of leaving a failed-smoke deploy live. Test against a mocked Wrangler CLI: simulate a failed smoke check and assert the remediation path fires. (Local code+test only; the actual staging rollback drill remains a separate staging step, Jeff-gated.)
3. **Q3 — S4 exception vs. seasonal freeze:** verify whether the deletion/opt-out proposal path (`agents/pcd-deletion-monitor` / Vera) routes through the same "protected site mutation endpoint" that the Aug–Nov blanket freeze holds. If so, add a narrowly-scoped `deletion_opt_out_proposal` write class exempt from both the calendar hold and `PCD_MAINTENANCE_MODE`, with three tests: (a) ordinary writes held Aug 1–Nov 30, (b) the S4 path succeeds inside that window, (c) the override cannot suppress the S4 path. Also record in the docs whether the nine non-exempt tasks' "report only" is code-enforced or prompt-only.
4. **Q1/Q2 — additive verifiers:** (Q1) add a verifier that can accept/require an independently-issued attestation of the smoke receipt+checksum pair (GitHub Actions OIDC artifact attestation — no new secret); (Q2) add a SHA-256 per committed caller to the scheduled-task reconciliation script so live-prompt comparison becomes a hash match, not an eyeball diff.

Do NOT touch: anything under `migrations/`/`migrations-activity-radar/` (incl. the duplicate `0009` prefix — policy-gated), `wrangler*.jsonc` bindings, `src/lib/publish.ts|email.ts|slack.ts`, `.env` credential values, or the confidential MedConfRadar directory.

## 4. Then STOP at the deploy gate
Everything after local hardening — staging deploy, rollback rehearsal, Access probes, production deploy, scheduled-task reconciliation, offsite backup, newsletter provider, migration — is owner/provider/elapsed-time gated. They are all collapsed into `coordination/JEFF-ACTION-PACKAGE-2026-07-18.md` (one-sitting checklist + gate ledger + safe order). Do not deploy, migrate, touch credentials/providers, post, or contact anyone without Jeff's explicit per-action approval.

## 5. Context already gathered (don't redo)
- Baseline commit `5a24aa8`; HEAD `d799631` (doc-only handoff commit).
- Full five-question review: `coordination/reviews/2026-07-18-claude-review-answers.md`.
- Batched owner gates: `coordination/JEFF-ACTION-PACKAGE-2026-07-18.md`.
- `rc01.json`: 11 pass / 1 not_applicable / 7 pending; the packet needs a re-cut after the next commit (`superseded_note`).
- Note: `AGENTS.md` does not exist; governance is `PCD-OPERATING-MANUAL.md` v1.5, `PCD-AI-OS/08-roadmaps.md`, `automation/APPROVAL-MATRIX.md`, `coordination/LAUNCH-AUTHORIZATION-MATRIX.md`.
