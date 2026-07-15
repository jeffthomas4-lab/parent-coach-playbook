# Active Handoff

This file is a pointer, not a document. It names the active baton and what it is waiting on. It is overwritten at each handoff. The handoff itself lives in `handoffs/` and is immutable once written.

This is the only place active status lives. Do not duplicate it elsewhere.

---

**Active handoff:** `handoffs/2026-07-15-plan-001-checkpoint-and-d1-inventory.md`
**From:** Codex
**To:** Jeff
**Task:** Plan 001 checkpoint recovery, D1 inventory, and Plan 002 preparation
**Tier:** 3
**Branch:** `migration/pages-to-workers-staging` (no dedicated branch; see handoff for why)
**Commit range:** None. Files are uncommitted, pending Jeff's approval.
**Status:** Plan 001 implementation is complete through Phase 6. Substantive work is checkpointed locally; D1 evidence is recorded; Plan 002 awaits Jeff.
**Human approval required:** Yes. Jeff decides D-001 and Plan 002 separately. Nothing authorizes normalization, pushing, deployment, migration, production access, secret changes, publishing, or outbound communication.

**Blocking Jeff's attention:**

1. Decide whether D-001 should be Approved, revised, or remain Proposed now that its writer inventory is traced.
2. Review and approve or revise `plans/002-line-ending-policy-and-selective-normalization.md`; it has not been implemented.
3. Decide whether `tests/probe.txt` may be deleted as scratch; it remains untouched.
4. The in-repo instruction-file question (`AGENTS.md` / `CLAUDE.md`) remains Proposed as D-004.

**Next step:** Jeff reviews D-001 and Plan 002. Codex continues acting as implementer until Jeff says otherwise, but will observe every remaining approval gate.
