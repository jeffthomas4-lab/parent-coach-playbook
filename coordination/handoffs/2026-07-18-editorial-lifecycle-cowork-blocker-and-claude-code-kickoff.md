# Editorial lifecycle — Cowork environment blocker + Claude Code kickoff

**Date:** 2026-07-18
**Author:** Claude (Cowork session)
**Status:** Handed off to Claude Code (Windows host). No code changed this session.

## Why this handoff exists

The Codex handoff (`2026-07-18-editorial-lifecycle-claude-jeff.md`) assigned the remaining Tier 3 editorial-lifecycle work. A Cowork session attempted to pick it up but hit a hard environment blocker and stopped before any implementation.

## Environment blocker (Cowork Linux sandbox)

- The real repo files on the Windows host are **intact and clean** at `192a173`. Verified via the direct file tools: `wrangler.jsonc` and `package.json` both read correctly end-to-end.
- The **Cowork Linux sandbox mount serves truncated copies** of the same files. In the mount, `package.json` fails to parse (cut off mid-line ~line 62), `wrangler.jsonc` is cut off mid-value, and 102 of 103 tracked files appear "modified" with no trailing newline. This "dirty tree" is a cross-bridge truncation artifact, not real changes — the same corruption pattern documented earlier in `CURRENT_STATE.md`.
- Consequence: from Cowork there is no `npm.cmd` / Windows shell, and the sandbox copy of the repo is corrupted, so **none of the required checks (`report:editorial-lifecycle`, `check:editorial-lifecycle`, vitest, release suite) can be run or trusted here.** Implementing governed migrations, auth workflows, and intake adapters with zero test execution would violate the repo's "never claim success without validation" rule.
- **Do not** run `git checkout`/reset in the sandbox to "fix" the 102 files — that would write LF-normalized/truncated content back over the intact host files through the same bridge (the destructive move the coordination protocol forbids).

**Decision (Jeff, 2026-07-18):** run this work in Claude Code on the Windows host, where the toolchain and files are sound.

## Claude Code kickoff prompt

You are taking over Parent Coach Desk from Codex. Repo: `C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk`. Baseline commit: `192a173`.

First, sanity-check the worktree is clean (`git status` should be clean at `192a173`; if it shows ~100 truncated/no-newline files, that is cross-bridge corruption from a prior tool — stop and tell Jeff, do not `git checkout`/reset).

Read before changing anything: `strategy/EDITORIAL-CONTENT-LIFECYCLE.md`, `src/data/editorial-governance.json`, `src/lib/editorial-lifecycle.ts`, `reports/editorial/lifecycle.json`, `coordination/handoffs/2026-07-18-editorial-lifecycle-claude-jeff.md`, `coordination/README.md`, `coordination/CURRENT_STATE.md`.

Run first: `npm.cmd run report:editorial-lifecycle`, `npm.cmd run check:editorial-lifecycle`, `npm.cmd exec vitest run tests/editorial-lifecycle.test.ts --run`.

Baseline interpretation: the 1,852-item corpus is a legacy baseline, NOT evidence-complete. Do not bulk-mark existing content approved without source, claim, relationship, disclosure, and human-approval evidence.

Remaining work (in order):

1. Real opportunity-intake layer for GSC signals, no-result searches, support questions, seasonal/camp gaps, affiliate gaps, newsletter opportunities, corrections, competitor observations, and emerging trends — privacy-safe aggregates only, no child PII or raw sensitive queries, behind a provider-neutral interface.
2. Durable source / claim / brief / relationship / review / approval records.
3. Migration plan + rehearsal evidence for Jeff's approval. Inspect existing migration and approval gates. Do NOT alter the deferred production trust migration packet. Do NOT run production migrations.
4. Authenticated admin workflows: create opportunities; score/classify; record sources and claims; complete editorial and SEO review; map relationships; assign monetization/disclosure classification; propose refresh, consolidation, or retirement.
5. Tests: lifecycle transitions; missing approval evidence; duplicate/cannibalized intent; privacy restrictions; stale-source handling; maintenance and retirement proposals; authenticated authorization boundaries.
6. Reconcile the corpus in bounded batches — small pilot batch first, with evidence artifacts, before scaling.

Preserve all safety rails: no auto-publish, no auto-delete, no auto-redirect, no affiliate link changes without review, no production credential changes, no external provider writes without Jeff's approval. Run the existing release and protection checks; do not weaken or rewrite unrelated Access, migration, backup, or deployment gates. Do not deploy. Stop before any external write, credential use, migration, provider activation, publication, or live deployment. Jeff is the final approver for credentials, production migrations, publishing, affiliate changes, provider integrations, and deployment.

Deliver at the end: files changed; tests and checks run (exact command, exit code, result); exact commit SHA; remaining blockers; a separate Jeff approval checklist; and a production deployment prompt only after all local evidence is complete.
