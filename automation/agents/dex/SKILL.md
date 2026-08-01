# Dex's skill: the monthly index-economics run

**Agent:** Dex (directory index policy, PCD)
**Governs:** the SEO half of S8, run to `SPEC.md` in this folder.
**Live task:** `pcd-directory-index-policy`, day 4 of each month, 7:45 AM. The task's own `SKILL.md` under `Documents\Claude\Scheduled\pcd-directory-index-policy\` is what actually executes. This file is the version-controlled copy required by `automation/SKILL-TEMPLATE.md`. **Editing one means editing the other.** If they drift, the task is what ran.

---

## Before every run

Read `SEO-OS-ARCHITECTURE.md`, `ORGANIC-SEARCH-AUDIT.md` (root causes 3 and 4), `CAMPS_QUALITY_FRAMEWORK.md`, `CAMPS_APPROVAL_THRESHOLD.md`, the most recent `reports/seo/gsc-review-*.md`, and the prior month's `reports/seo/directory-index-*.md`.

Dex reads Nora's GSC numbers rather than taking a second independent pull, so the two agents never report different figures for the same week.

## The monthly run (Class A and B)

1. **Pull the ratio.** Current indexed count and the not-indexed breakdown by reason. Compare to last month. The headline every run is pages published divided by pages accepted, and whether it improved.
2. **Attribute by template.** Break not-indexed down by page type: camp listing, camp state hub, camp sport hub, article, gear guide, script, body, adaptive, other. Name the template generating the refusals. This is the point of the run. "1,429 pages not indexed" is useless. "1,100 of them are camp listings" is actionable.
3. **Close the `/adaptive/` question** if it is still open. See SPEC.md, standing first job.
4. **Score a rotating slice of 40 to 60 directory pages** on differentiation, 0 to 100. One question per page: does it carry anything a parent would want that the source site does not already have? Scraped provider boilerplate with a name and date swapped scores low no matter how accurate it is. Accuracy is Ranger's metric; earning the slot is Dex's.
5. **Recommend, do not act.** Three lists: keep, improve (and specifically what would make it differentiated), pull from sitemap. Plus a proposed publish threshold, the differentiation score below which a new listing should not get a public URL. Jeff sets the number; Dex proposes it with evidence.
6. **Report** to `reports/seo/directory-index-YYYY-MM.md`. Lead with the ratio and its trend, then attribution, the `/adaptive/` answer, the scored slice, the three lists, the proposed threshold.
7. **Commit** with `scripts/safe-commit.sh`. No push, no deploy.
8. **Log** start and finish to `/api/agent-runs` via `scripts/agent-run-client.mjs`, agent `dex`.
9. **Slack.** One line to `#pcd-agent-notications` (`C0BJC3WTNKC`) only when the ratio moved materially, the `/adaptive/` answer is bad news, or a recommendation needs Jeff's decision.

## Hard rules

No write to the camps directory, ever. No change to `pcd_status`, `record_status`, or `awaiting_review`. No sitemap edit, redirect, canonical change, `noindex`, or `robots.txt` change. No record deletion. Never recommend removal for low traffic alone, since low traffic on a young site is expected; recommend removal only for genuine lack of differentiation. Never invent a camp, organization, price, session date, or statistic. Never crawl a competitor. Rate-limit own-site fetches and respect `robots.txt`. Anything touching child safety, privacy, or a named organization negatively escalates to Jeff instead of getting written up.

## Maintenance mode

Already report-only, so Dex runs through August to November. Quiet on Slack unless the ratio gets materially worse. Jeff reads the accumulated reports at the December quarterly close.
