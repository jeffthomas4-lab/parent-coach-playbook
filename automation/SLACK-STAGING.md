# PCD Slack Staging Convention

**Status:** channel confirmed by Jeff 2026-07-14: `#pcd-agent-notications` (`C0BJC3WTNKC`, workspace `fieldforgeventures.slack.com`). Every PCD agent posts here via the Slack MCP's `slack_send_message` tool with that `channel_id`, directly, in-session — not through a separate webhook Worker. This is the one and only PCD notification channel. Nothing PCD-related posts to `#command`; that channel is Barnabus's portfolio-wide chief-of-staff briefing, which covers every venture as one line item each, not a PCD agent notification stream.

---

## The convention

Every agent's drafts and reports post one notification to the existing PCD Slack channel Jeff already checks. The notification carries a link to the markdown draft or report. That's the whole pattern.

No Notion Review Queue database. No scattered local files as the primary destination. One channel, one notification per run that needs Jeff's eyes, one link to the real content.

## Why this and not the alternatives

The Session Two input file weighed a Notion Review Queue page against local markdown files against Slack. Both alternatives were rejected. Notion adds a second place to check, and local files have no notification layer at all. Slack is the one place Jeff already opens, so staging rides on habit that already exists instead of building a new one.

## What posts

- **Class B (Draft):** one message when the draft is ready, linking to the markdown file.
- **Class C (Stage):** one message when the change set is ready to review, linking to the markdown file, stating plainly what will happen if Jeff approves it.
- **Class D (Act):** no per-run notification required, since the threshold was pre-approved. Anything that falls outside the threshold escalates to Slack the same as Class C.
- **Class A (Analyze):** no notification unless the analysis surfaces something that needs Jeff's attention (a `needs_you` item in the run log).

## Message shape

Keep it short. Agent name, one line on what's ready, the link. No summary of the whole draft in the Slack message itself; the markdown file carries the content.

Example: "Ed has next week's article brief staged. [link]"

## The roster's staging lines (added 2026-07-15, roster complete)

One line per agent, so the pattern is written down once rather than reinvented per build. Agent name, one line on what's ready, the link. Nothing else.

| Agent | Class | When it posts | The line |
|---|---|---|---|
| Nora | A / B / C | A: only on a regression or a dashboard-only action. B: an outreach or reveal draft. C: a staged site fix | "Nora has the July hygiene fix staged. [link]" |
| Ed | A / B | Every draft, brief, or plan ready for a read. The freshness audit only when a candidate is urgent | "Ed has a draft ready on [topic]. [link]" |
| Frida | B | Every completed run. A Friday Letter draft always needs Jeff before Friday | "Frida has this week's Friday Letter draft ready. [link]" |
| Hal | A / B | A: only on a browser-confirmed broken link or a disclosure gap. B: follow-up drafts and swap proposals | "Hal has follow-up drafts for 3 networks pending over 30 days. [link]" |
| Ranger | A / C / D | C: every staged fix, stating what happens on approval. D: nothing per run, the threshold was pre-approved. Anything outside the threshold escalates as C | "Ranger has 4 camp fixes staged, including 1 delete. [link]" |
| Vera | B / C | Only when something is staged. A clean run posts nothing and still logs. Posts to `#pcd-agent-notications` (`C0BJC3WTNKC`), same as the rest of the roster — this row previously said `#command`, which was wrong; the deployed `pcd-deletion-monitor` SKILL.md has always used the correct channel, this doc just hadn't caught up | "S4 deletion, 19 days left. [link]" |
| Sunny | B | Drafts waiting and flags raised, by count only | "Sunny has 3 reply drafts ready and 1 flagged for you. [link]" |

**Two rules that bind harder than the message shape.**

No PII in a Slack post, ever, from any agent. Vera and Sunny read mail from real people and their posts carry counts and links, never names, addresses, or quoted content. The file behind the link identifies a record by internal id.

A Class C line says what happens if Jeff approves. "4 fixes staged" is not enough when one of them is a delete. Ranger's line names the delete because the cost of Jeff skimming past it is a row nobody gets back.

## Delivery configuration

The approved destination for every Parent Coach Desk operational alert is `#pcd-agent-notications` (`C0BJC3WTNKC`, workspace `fieldforgeventures.slack.com`), confirmed directly by Jeff on 2026-07-14. It is not a destination for personally identifiable information.

**Correction, 2026-07-14:** an earlier version of this section named a different channel, `#pcd-alerts` (`C0BJT2194E4`), reached via a Slack Incoming Webhook Worker that was never confirmed live (a 2026-07-17-dated receipt check had found no synthetic-alert post there). That channel and that webhook plan are superseded. The working, confirmed mechanism is simpler: each agent calls the Slack MCP's `slack_send_message` tool directly with `channel_id: C0BJC3WTNKC` in-session, the same way `pcd-deletion-monitor` (Vera) already does today. No webhook, no `SLACK_WEBHOOK_URL` secret, no separate staging Worker required for this notification pattern. If a future build genuinely needs a webhook-based relay (e.g. `POST /api/agent-runs` triggering an alert outside a live agent session), point it at this same channel, not a third one.
