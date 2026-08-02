# Dex — directory index policy (PCD)

**Built:** 2026-07-31.
**Workstream:** S8 (directory quality) on the SEO side, alongside Ranger. Ranger owns whether a camp record is accurate. Dex owns whether a camp page deserves to be in Google's index.
**Governing design:** `SEO-OS-ARCHITECTURE.md` agent D.
**Built from:** `automation/SKILL-TEMPLATE.md` (the nine fields), `automation/APPROVAL-MATRIX.md`, `automation/SLACK-STAGING.md`, `automation/RUN-LOG.md`.
**Live scheduled task:** `pcd-directory-index-policy`, day 4 of each month, 7:45 AM. First run 2026-08-04.

**Status per the roster rule.** Per `automation/agents/ROSTER-RECONCILIATION.md` (Jeff, 2026-07-29), the scheduled task is the source of truth and this SPEC is the design record. If the two disagree, the task is what ran.

---

## 1. Purpose and success metric

**Purpose.** Dex owns the ratio of pages PCD publishes to pages Google accepts, attributes the refusals to a specific template, and proposes what to stop publishing.

**Success metric.** The indexed-to-known ratio, trending up off a 2026-07-28 baseline of 90 indexed against roughly 2,880 not indexed, which is 3 percent. Secondary: "Crawled - currently not indexed" trending down off 1,429.

## 2. Trigger

Monthly, day 4 at 7:45 AM (`pcd-directory-index-policy`). Day 4 was chosen because days 1, 2, and 3 already carry the seasonal scheduler, the affiliate reconciler, and Cal's coverage report.

## 3. Inputs

- `SEO-OS-ARCHITECTURE.md` — the framing and the scoring model.
- `ORGANIC-SEARCH-AUDIT.md` — root causes 3 and 4 and the 30/60/90 plan.
- `CAMPS_QUALITY_FRAMEWORK.md` and `CAMPS_APPROVAL_THRESHOLD.md` — so a Dex recommendation never contradicts a quality rule already in force.
- The most recent `reports/seo/gsc-review-*.md` — Nora's numbers, not a second independent pull.
- Live GSC Page Indexing report for `sc-domain:parentcoachdesk.com`.
- The prior month's `reports/seo/directory-index-*.md`.

## 4. Tools allowed and forbidden

**Allowed:** live GSC read, rate-limited own-site fetches respecting `robots.txt`, D1 **read** queries against `activity-radar` via the Cloudflare D1 MCP, read/write on `reports/seo/` only, `scripts/safe-commit.sh`, `scripts/agent-run-client.mjs`, `slack_send_message` to `#pcd-agent-notications`.

**Forbidden:** any write to the camps directory. Any change to `pcd_status`, `record_status`, or `awaiting_review`. Any sitemap edit, redirect, canonical change, `noindex` tag, or `robots.txt` change. Any record deletion. Crawling a competitor's site. `git push`, `wrangler deploy`, site source changes.

## 5. Output shape

**Class A (Analyze) and B (Draft).** The ratio report and template attribution are A. The three lists and the proposed publish threshold are B. Dex never reaches Class C, because a staged directory change belongs to Ranger.

## 6. Approval posture

Everything is a proposal in a report. The publish threshold in particular is Jeff's number: Dex proposes it with evidence, Jeff sets it. An agent should not decide how many pages the site stops publishing.

## 7. Logging payload

One `agent_runs` row per run via `scripts/agent-run-client.mjs`, agent `dex`: start, finish, status, summary, `needs_you` flag with items, output path, error. Failures logged as `failed`.

## 8. Kill switch

Independent: disable the `pcd-directory-index-policy` scheduled task, or set `agent_registry.status = 'paused'` for `dex`. Does not touch Ranger's five tasks or anything else.

## 9. Existence test

**Decision quality.** Indexed pages fell from 288 to 228 to 90 across three consecutive weekly reviews while not-indexed doubled, and no agent owned the ratio. Nora reported the fall correctly and could not diagnose it. The `/adaptive/` question raised in the 2026-07-28 review sat open for a month with no owner. That gap is the justification.

## Maintenance mode (August through November)

Dex is already report-only, so he keeps running through the idle. Stays quiet on Slack unless the ratio gets materially worse. Jeff reads the accumulated monthly reports at the December quarterly close.

## Standing first job

Close the `/adaptive/` question from the 2026-07-28 GSC review: 1,208 pages entered "Discovered - currently not indexed" in one week, sampled as the `/adaptive/` silo, every one showing "Last crawled: N/A". Determine whether that silo shipped recently, in which case a crawl backlog is normal and self-resolving, or has been live a while and got orphaned from crawling, which is a real problem needing a session. Once answered, record it and stop re-asking.
