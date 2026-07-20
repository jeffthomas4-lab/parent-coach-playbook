# Hal's skill: the S5 weekly link health and the S6 monthly reconcile

**Agent:** Hal (Affiliate ops, PCD)
**Governs:** the S5 and S6 SOPs (`PCD-OPERATING-MANUAL.md`), run to `SPEC.md` in this folder. If this file and the manual disagree, the manual wins.
**Version-controlled:** this file lives in the site repo. Any change to how Hal runs is a commit, not a chat edit.

---

## Before every run

1. Read `SPEC.md` in this folder. Confirm the kill switch is on (`agent_registry.status = 'active'` for `agent = 'hal'` in the `forge-command` D1). If paused, stop and log a `partial` run explaining why.
2. Run `node scripts/agent-run-client.mjs preflight`, then use its exported `writeAgentRun()` for a start with a UUID, agent `hal`, venture `pcd`. The token comes only from runtime `PCD_AGENT_RUNS_TOKEN`; never request, print, or pass it as an argument.
3. Check `PCD-OPERATING-MANUAL.md` section 3.4. During maintenance mode (August through November) the checks still run, because they are read-only and they watch the only revenue surface PCD has. No follow-up drafting, no swap proposals; those become `needs_you` items for the December close.
4. Read the prior run's file (`reports/link-health/` or `reports/affiliate/`) so this run reports a delta and a repeat, not a fresh discovery of last week's problem.

## S5: the weekly link health check (Class A, Monday)

1. Read `src/data/affiliates.json` and list every slug.
2. **Pick the batch by slug, never by index.** Read `reports/link-health/STATE.md`, a table of slug to last-checked date. Take roughly the 65 slugs with the oldest or never-checked date, so all 135 turn over about monthly no matter how the list churns. Index ranges break silently when a slug is added, removed, or reordered, and on this site that happens often.
3. For each selected slug, fetch `https://parentcoachdesk.com/go/<slug>/` and follow it to the destination. Flag a 404, an out-of-stock or unavailable page, a redirect to a generic search or category page, and any merchant domain that changed.
4. **Space Amazon requests out by at least 5 to 10 seconds each.** Closer to 30 seconds is what the production worker uses. Fast automated requests trip Amazon's bot detection and return an interstitial that can carry the literal words "currently unavailable" while the product is fine. That is not a hypothetical: the 2026-07-06 run flagged 6 of 65 links and all 6 were confirmed fine on a manual browser recheck.
5. **Two-tier verification, on every flag, before it reaches the report.** Re-check the flagged link in a real browser session (Claude in Chrome: navigate, then find the stock availability status). Only a link the browser recheck confirms goes in the report as broken or degraded. Say in the report which flags turned out to be bot-detection false positives and which were confirmed.
6. Spot-check 10 random live pages from `https://parentcoachdesk.com/sitemap-content.xml` for broken internal links. Cloudflare email-obfuscation links (`/cdn-cgi/l/email-protection#...`) always 404 under a plain fetch because they need client-side JS to decode. That is expected. Do not report them.
7. Write `reports/link-health/LINK_HEALTH_YYYY-MM-DD.md`: a one-line summary at the top (X checked, Y confirmed issues, Z false-positive flags dismissed), then each confirmed issue with the article it sits in and a suggested replacement product or slug.
8. Update each checked slug's date in `STATE.md`. This is the one state write Hal makes and it happens after the checks, not before, so a run that dies halfway does not mark unchecked slugs as checked.
9. Never edit `affiliates.json`. Never deploy. The report is the deliverable.

## S6: the monthly reconcile (Class A report, Class B drafts, day 2)

1. Read `AFFILIATE_MASTER_LIST.md`, `AFFILIATE_NETWORKS_TO_APPLY.md`, `AFFILIATE_PENDING_FROM_JEFF.md`, and `src/data/affiliates.json`.
2. Build the status table: each network (Amazon Associates, CJ and its brands, Bookshop.org, Impact Radius, Awin, FlexOffers, TeamSnap, Avantlink), its status (live, pending, not applied), and days since application.
3. **Pull the real numbers if you can.** With Chrome access granted and Jeff already logged in, read the Amazon Associates and CJ dashboards for last month's clicks and earnings by tracking ID. Read only: no setting changed, no tracking ID created or renamed, tab closed when done. If access is not there, put a checklist of the exact numbers Jeff has to pull by hand in the report and set that as a `needs_you` item. Never estimate a revenue figure. This is the SOURCE RULE and it bites hardest here, because a made-up number in a revenue report is worse than no number.
4. For any network pending more than 30 days, draft a short follow-up email into the report. Read `About Me/Anti AI Writing.txt` first. Check `reports/affiliate/` for a follow-up already drafted for that network and revise it rather than writing a third version of the same note.
5. Name three lists: the top 10 earning slugs, the slugs with clicks and zero dollars (swap candidates now that CJ brands may be approved), and the Amazon items a live CJ merchant carries at a better rate. Each swap candidate names the slug, the current destination, the proposed one, and why.
6. Write `reports/affiliate/AFFILIATE_REVIEW_<month>.md`. One-line summary at the top.
7. Never place an order, never change a payout setting, never submit an application.

## The disclosure and application status pass (part of the monthly run)

1. Check that every page carrying an affiliate link carries its disclosure, matching the pattern in the existing guides. `COMPLIANCE_AUDIT_2026-06.md` is the standard. A page with a link and no disclosure is a `needs_you` item, not a note buried in the report.
2. Confirm the Amazon rule still holds on Frida's side: zero Amazon affiliate links in the Friday Letter drafts on file in `reports/friday-letters/`. Hal reads and reports; he does not edit her drafts. If one ever appears, it is a `needs_you` item flagged the same run, because it is an Operating Agreement violation and not a style question.
3. Record each pending application's days-since count so the number is on file rather than re-derived from memory every month.

## Every run, no exceptions

- Close through `writeAgentRun()` with the same UUID, status, summary, redacted needs-you items, outputs, and real failure text. A clean run with nothing for Jeff posts nothing.
- Post the Class B Slack line only when a draft is actually ready: agent name, one line, the link. Example: "Hal has follow-up drafts for 3 networks pending over 30 days. reports/affiliate/AFFILIATE_REVIEW_2026-08.md" The channel is confirmed: post via `slack_send_message` to `#pcd-agent-notications` (`channel_id C0BJC3WTNKC`, workspace `fieldforgeventures.slack.com`). Never `#command` — that's Barnabus's portfolio channel, not PCD's.
- Say plainly when a flag was a false positive. A report that quietly drops last week's six flags teaches Jeff to distrust the number.
- Say plainly when there is no revenue to report. There has never been any, and writing that sentence honestly every month is the point of the metric.

## Idempotency

Safe to re-run. The link check reflects live destinations, so a second run in a day re-checks and re-confirms rather than compounding a wrong call, and `STATE.md` is a slug-keyed table that gets updated in place, never appended to. A same-month re-run of the reconcile overwrites `AFFILIATE_REVIEW_<month>.md` rather than creating a second file for the same month. Follow-up emails are revised in place per network, never stacked, so a network pending four months has one current draft rather than four.
