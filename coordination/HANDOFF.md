# Active Handoff

This file is a pointer, not a document. It names the active baton and what it is waiting on. It is overwritten at each handoff. The handoff itself lives in `handoffs/` and is immutable once written.

This is the only place active status lives. Do not duplicate it elsewhere.

---

**Active handoff:** `handoffs/2026-07-17-plan-015-editorial-approval-repair-deployed.md`
**From:** Codex
**To:** Jeff
**Task:** Plan 015 designated live editorial-approval verification
**Tier:** 2
**Branch:** `main`
**Commit range:** `bf4c424` deployed as Worker version `35449367-a085-4096-bb7b-6886c048cea5`.
**Status:** Source repair implemented, verified, and deployed; one human-gated GitHub-write verification remains.
**Human approval required:** Yes: choose a non-customer test article and perform the one approval click.

**Blocking Jeff's attention:**

Choose a non-customer article for the one live approval click. This creates a GitHub content commit and is intentionally not an automated test.

**Next step:** Use the deployed Admin Editorial screen to approve the selected test article once. Record only the bounded UI result and resulting GitHub commit ID; do not paste provider details or credentials.
