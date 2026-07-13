# PCD Slack Staging Convention

**Status:** foundation document, Session 0. Resolves the staging-destination question from PCD-SESSION-TWO-INPUT-from-reviews-2026-07-13.md item 1 (Jeff's call, 2026-07-13).

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

## Open item

The actual channel is not wired yet. Confirm the exact PCD Slack channel with Jeff before the first agent posts to it. Until that's confirmed, no agent should assume a channel ID and post blind.
