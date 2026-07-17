# PCD Slack Staging Convention

**Status:** dedicated private alert channel created 2026-07-17; incoming webhook still pending.

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
| Vera | B / C | Only when something is staged. A clean run posts nothing and still logs. Posts to `#command` (`C0BGMPKT3GT`) | "S4 deletion, 19 days left. [link]" |
| Sunny | B | Drafts waiting and flags raised, by count only | "Sunny has 3 reply drafts ready and 1 flagged for you. [link]" |

**Two rules that bind harder than the message shape.**

No PII in a Slack post, ever, from any agent. Vera and Sunny read mail from real people and their posts carry counts and links, never names, addresses, or quoted content. The file behind the link identifies a record by internal id.

A Class C line says what happens if Jeff approves. "4 fixes staged" is not enough when one of them is a delete. Ranger's line names the delete because the cost of Jeff skimming past it is a row nobody gets back.

## Delivery configuration

The dedicated private channel is `#pcd-alerts` (`C0BJT2194E4`). It is the approved destination for Parent Coach Desk operational alerts; it is not a destination for personally identifiable information.

The channel still needs a Slack Incoming Webhook scoped only to `#pcd-alerts`. Store its full webhook URL as the staging Worker secret `SLACK_WEBHOOK_URL`; do not place it in this repository, a message, or a dashboard variable. `POST /api/agent-runs` will then post only `failed` and `needs_you` run signals, and internal email alerts will require that Slack relay before sending.
