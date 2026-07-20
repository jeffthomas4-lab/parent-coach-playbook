# Plan: The Approval Queue (design note, build blocked on the Slack app)

**Plan ID:** 021
**Author:** Claude Code
**Date:** 2026-07-20
**Status:** Draft. Blocked on Jeff creating/reusing the Slack app and handing over four values (`SLACK_WEBHOOK_URL` or bot token, `SLACK_SIGNING_SECRET`, the destination channel id, `SLACK_APPROVER_IDS`) per `HANDOFF-2026-07-15.md` section 4d. No code in this plan; it exists so the real build is fast once those values land.

## Objective

Describe exactly what the Approval Queue needs, per `PCD-AI-OS/00-FOUNDATIONS.md` section 4: "one queue, not seventeen. Every Stage-class output lands as an approval card (Slack message + Notion row) with evidence, a recommended action, a confidence score, and one-tap approve/reject." This is prep work, not a build request.

## Tier

3. Touches Slack app secrets, a new interactivity surface generalized across agents, and a Notion mirror. Sized for review even though nothing ships from this plan alone.

## Business outcome

None yet — this is groundwork. Once built on top of this design: any Stage-class output from any of the seven agents (not just Ed's editorial drafts) lands in one Slack+Notion queue with the context Jeff needs to decide in one tap, instead of Jeff opening `/admin/editorial` or a markdown file to get the context first.

## Current-state evidence

- **Verified in code:** the editorial-specific slice of this already exists and is *not* what's blocked. `src/lib/publish.ts` (`buildApprovalBlocks`, `publishDraft`) and `src/pages/api/slack/actions.ts` (the interactivity endpoint) are built: a signature-verified Slack button click, approver-allowlist checked, flips `draft: false`, commits to GitHub, responds to the thread. `src/pages/api/admin/editorial/publish.ts` is the equivalent Cloudflare-Access-gated route for the same action from `/admin/editorial`. None of this is stubbed or fake; it only lacks the four Slack app secrets to run end to end, per `HANDOFF-2026-07-15.md` section 4d.
- **Verified in code:** `buildApprovalBlocks`'s card carries a title, a link, and Approve/Leave-as-draft buttons. It does **not** carry evidence, a recommended action, or a confidence score — the three fields Foundations section 4 requires on every card. It is also editorial-only; there is no shared card builder other departments' Stage-class outputs (Ranger's camp fixes, Hal's link swaps, Nora's site fixes — see `automation/SLACK-STAGING.md`'s Class C rows) can reuse.
- **Verified in code:** no Notion row mirror exists anywhere in the repo for this flow. `automation/SLACK-STAGING.md` deliberately rejected a Notion Review Queue for the lighter draft-ready notification pattern ("No Notion Review Queue database... Slack is the one place Jeff already opens"), but that decision was about the *notification*, not the *Approval Queue* card, which Foundations explicitly specs as Slack **and** Notion. The two documents are not in conflict once read this way: a draft-ready ping stays Slack-only; a Stage-class approval card gets both.
- **Verified in code:** `migrations-pcd-ops/0025_events.sql` (this session) defines the `events` table but is unapplied, same production-safety posture as `0023`/`0024`.
- **Not verified:** whether Jeff wants one shared Slack channel for every department's approval cards or per-department channels. `SLACK-STAGING.md` names `#pcd-agent-notications` (`C0BJC3WTNKC`) as the one and only PCD notification channel today; this plan assumes the same channel carries approval cards unless Jeff says otherwise.

## Scope (for the future build, once unblocked)

1. **Generalize the card.** Extend `buildApprovalBlocks` (or a new `buildApprovalCard` that supersedes it) to a shape any department can call:
   - Header line: which agent, which department, one line of context (matches `SLACK-STAGING.md`'s existing "Agent has X ready" convention).
   - **Evidence**: 1-3 bullet lines or a link to the evidence (source URLs, before/after diff, the file changed). Per SOURCE RULE, never asserted without a pointer to where it came from.
   - **Recommended action**: the one sentence stating what happens if Jeff taps approve — Ranger's existing SLACK-STAGING.md rule ("a Class C line says what happens if Jeff approves... names the delete") generalizes cleanly to every department.
   - **Confidence score**: the 0-100 number from the department's own scoring (Foundations section 6's bands: ≥90 Act-eligible, 70-89 Stage, which is exactly this queue's range).
   - Buttons: Approve / Reject, one tap each, `action_id`s namespaced per department (`publish_draft` stays as-is; new ones follow the same pattern, e.g. `approve_camp_fix`, `approve_link_swap`).
2. **One shared interactivity endpoint, not seventeen.** `/api/slack/actions.ts` already has the signature verification, replay-window check, and approver-allowlist scaffolding this needs. Extend its `action_id` switch to route each department's approve/reject to that department's own apply-function (the same way `publish_draft` routes to `publishDraft`), instead of building a second endpoint. Each apply-function stays owned by its department's lib module; this endpoint only verifies the human and dispatches.
3. **Notion row mirror.** One Notion database, one row per approval card, written at the same time the Slack card is posted (not after). Fields: department, agent, entity reference, evidence link, recommended action, confidence score, status (pending/approved/rejected), decided_by, decided_at. The Slack card and the Notion row both update on decision so neither goes stale relative to the other — the write path needs to update both, in that order, and log if the second write fails so the mismatch is visible rather than silent.
4. **Wire `pcd.editorial.published` and future `pcd.<domain>.stage_ready` / `pcd.<domain>.approved` / `pcd.<domain>.rejected` events** through `src/lib/events.ts` (built this session) at the same call sites as the Slack/Notion writes, so the `events` table becomes the audit trail of every card issued and decided, not just editorial.
5. **Approver allowlist stays generic.** `SLACK_APPROVER_IDS` already supports comma-separated ids for future co-approvers; no change needed there, just confirm the same allowlist gates every department's cards (Jeff is the only approver today across all departments, per the Human Approval Matrix).

## Non-goals

- Does not touch payments approval. Foundations section 6 and the roadmap's section 6 both hold payments gated permanently, outside this queue's scope forever.
- Does not change the existing editorial publish flow's behavior — it is additive (a richer card, a Notion mirror, an events row), not a rewrite of `publishDraft`.
- Does not decide the Slack channel question (one shared channel vs. per-department) — flagged as an open question below.
- Does not build any of the seven departments' apply-functions beyond editorial's, which already exists.

## Files likely affected (future build)

- `src/lib/publish.ts` (generalize `buildApprovalBlocks` or add a sibling builder)
- `src/pages/api/slack/actions.ts` (extend the `action_id` routing)
- `src/lib/notion-approval-queue.ts` (new — Notion row read/write)
- `src/lib/events.ts` (already built; call sites added per department as each is wired)
- `migrations-pcd-ops/0025_events.sql` (already built this session; apply once approved)
- Per-department lib modules as each is wired to the shared queue (Ranger's camp-fix apply function, Hal's link-swap apply function, etc.), each a separate, separately reviewed slice per the roadmap's "one capability at a time" rule.

## Human approval gates

- Jeff creates or designates the Slack app and hands over the four values (this plan cannot proceed without them).
- Jeff confirms the channel question (shared vs. per-department).
- Jeff approves the `0025_events.sql` migration for staging/production per the normal migration-approval gate before any department's card writes depend on it existing.
- Every card this queue ever issues still requires Jeff's tap — this plan does not relax the HUMAN GATE, it only makes the card Jeff taps richer and adds a durable trail of what was tapped.

## Open questions

1. One shared Slack channel for every department's approval cards, or per-department channels? Affects `SLACK-STAGING.md` and the interactivity endpoint's routing.
2. Which Notion workspace/database hosts the mirror, and who else besides Jeff should have read access to it?
3. Does a rejected card need a reason captured (free text) or is a bare reject sufficient for the audit trail? Affects the Notion schema and the `events` payload shape for `pcd.<domain>.rejected`.
