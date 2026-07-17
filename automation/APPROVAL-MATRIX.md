# PCD Approval Matrix: Class A / B / C / D

**Status:** foundation document, Session 0. Reused as-is from PCD-SESSION-TWO-INPUT-from-reviews-2026-07-13.md item 1. Not reinvented here.

**Governs:** every agent in the PCD roster. Every agent spec names which class its normal output lands in, and that class decides what Jeff has to touch before anything moves.

---

## The four classes

**Class A: Analyze.** Read-only. Nothing changes as a result of the run. No approval needed, because there's nothing to approve. Nora's weekly GSC review runs this way today.

**Class B: Draft.** The agent produces a document a human reads and may act on. Nothing ships, sends, or publishes without Jeff picking it up and acting himself. Ed's articles and Frida's newsletter draft both live here.

**Class C: Stage.** A prepared change set sits in a review queue, fully formed, ready to commit with one approval. This sits between Draft and Act: the work is done, not just proposed. Vera's deletion-request fix and Ranger's bulk camp data-quality fixes fit here better than a flat Draft, because the change is already built and only needs a yes.

**Class D: Act.** The agent writes without a per-run approval, inside a fixed confidence threshold. Today this is one exception: Ranger's camp discovery enrichment writes (S7), gated at 75 percent confidence. Class D is Jeff only to authorize, and only inside the named threshold. No agent gets Class D by default.

---

## Tied to the HUMAN GATE

The HUMAN GATE (Master Plan rule 6) already splits work into unattended and gated. This matrix is a refinement of that line, not a new rule:

- Sends, purchases, deletions, publications, and anything touching money or a person outside the system require explicit approval. That's Class B, C, and D all routing through Jeff before anything live happens, except where D's threshold has already been set by Jeff in advance.
- Class A is the only class that runs with zero human touch, because it changes nothing.
- Class D never means unattended and unreviewed forever. It means the review happened once, at threshold-setting time, not on every run.

---

## Class D is Jeff only

No agent gets Class D status without Jeff naming the confidence threshold and the exact write scope in writing, in that agent's spec. Ranger (S7) is the only agent on the roster carrying Class D today, and even there the deletes stay gated at Class C.

---

## How this maps to the roster

| Agent | Normal class | Notes |
|---|---|---|
| Nora | A / B | GSC review is A. Outreach drafts are B. |
| Ed | B | Drafts only, Jeff publishes. |
| Frida | B | Draft only, Jeff sends. |
| Hal | A / B | Reports only, Jeff applies and pays. |
| Ranger | C / D | Enrichment writes under threshold are D. Deletes and bulk fixes are C. |
| Vera | B / C | Monitors and drafts the fix as C; Jeff deletes. |
| Sunny | B | Drafts only, a human sends. |

This table is a summary, not a substitute for each agent's own spec. Each agent's build session confirms and details its own class assignment.

---

## Worker paths and their class (added 2026-07-15)

The agents above are people doing jobs. These are the machine paths the Worker exposes for them. Same matrix, same rules.

| Path | Class | What it does | What Jeff has to touch |
|---|---|---|---|
| `POST /api/agent-runs` | D (legacy internal operations) | Writes `agent_runs`, updates registry state, can pause an agent, and projects a minimized failure alert to Slack | Jeff preauthorized only this bounded operational scope. It is **not Class A/read-only**. The shared token cannot provide workflow-scoped identity and must be replaced by Forge Command executor grants before expansion. |
| `POST /api/admin/editorial/approve` | C | Moves a piece to `jeff-approved`. Editorial sign-off, not a publication | The click, behind Cloudflare Access |
| `POST /api/admin/editorial/publish` | C | Flips `draft: false`, commits to main, fires the deploy hook. The post goes live | The click, behind Cloudflare Access |
| `POST /api/slack/actions` | C | Same publish, reached from the Slack button | The click. Signature-verified as coming from Slack, and the clicker's Slack ID must be on `SLACK_APPROVER_IDS` |
| `sendEmail(..., 'outbound')` | B today, C on the flip | Parent- and operator-facing mail | Everything. Staged to Slack, not sent, until `EMAIL_MODE=send` |
| `sendEmail(..., 'internal')` | B today, C on the flip | Admin alerts to an address on `ADMIN_EMAILS` | Staged to Slack until `EMAIL_ADMIN_MODE=send` |

**Approve and publish are two routes on purpose.** Signing off on a draft and putting it in front of parents are different decisions, so they take different clicks. Nothing about the approve route publishes.

**On the two email flips.** Neither is the Worker lane's to make. They are named here so the horizon in the build plan ("the gate has a horizon") is a switch someone can actually find, rather than a rewrite. The order they should go live in is admin first, parent-facing second, once admin mail has run clean for a while. Payments stay gated permanently and no flag exists for them.

**What no flag can do.** There is no env var that publishes without a click. The publish path has no unattended caller by construction: both routes that reach it require a human identity, and there is no cron or queue wired to it.
