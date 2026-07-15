# Active Handoff

This file is a pointer, not a document. It names the active baton and what it is waiting on. It is overwritten at each handoff. The handoff itself lives in `handoffs/` and is immutable once written.

This is the only place active status lives. Do not duplicate it elsewhere.

---

**Active handoff:** `handoffs/2026-07-15-phase-2-provenance-and-ownership.md`
**From:** Codex
**To:** Jeff
**Task:** Plan 001 Phase 2 provenance and ownership manifest
**Tier:** 3; coordination documentation only in this phase
**Branch:** `migration/pages-to-workers-staging` (no dedicated branch; see handoff for why)
**Commit range:** None. Files are uncommitted, pending Jeff's approval.
**Status:** Jeff approved G1 through G10 as proposed. Phase 3 documentation review and secret-pattern scan are complete; awaiting approval of the exact coordination commit contents and message.
**Human approval required:** Yes. Jeff must approve the exact Phase 3 staging list and commit message. This does not pre-approve substantive checkpoints, branching, worktrees, normalization, pushing, deployment, migration, or production access.

**Blocking Jeff's attention:**

1. Approve or revise the exact ten-path coordination staging list presented by Codex. It contains the original eight setup paths plus Plan 001 and the Phase 2 handoff; the active pointer is already one of the original eight paths.
2. Approve or revise the proposed commit message.
3. Generated-asset versioning and possible later deletion of `tests/probe.txt` remain deferred to their substantive checkpoint decisions; nothing has been deleted.
4. The in-repo instruction-file question (`AGENTS.md` / `CLAUDE.md`) remains Proposed as D-004.
5. Line-ending normalization remains prohibited until Plan 002 is written and separately approved.

**Next step:** Jeff approves or revises the exact Phase 3 coordination staging list and commit message supplied by Codex. Codex will stage only those explicit paths, show the cached name list and checks, and commit only after that approval. The Sonnet/Opus model policy in `README.md` is binding by Jeff's 2026-07-15 decision and may be overruled by Jeff case by case.
