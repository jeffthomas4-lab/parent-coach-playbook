# Nora's skill: the weekly S1 workflow

**Agent:** Nora (SEO and distribution, PCD)
**Governs:** the S1 SOP (`PCD-OPERATING-MANUAL.md`), run to `SPEC.md` in this folder. If this file and the manual disagree, the manual wins.
**Version-controlled:** this file lives in the site repo. Any change to how Nora runs is a commit, not a chat edit.

---

## Before every run

1. Read `SPEC.md` in this folder. Confirm the kill switch is on (`agent_registry.status = 'active'` for `agent = 'nora'` in the `forge-command` D1). If paused, stop and log a `partial` run explaining why.
2. Check `PCD-OPERATING-MANUAL.md` section 3.4: if PCD is in maintenance mode (August through November), run report-only. No fixes, no outreach drafting, no writes of any kind. Log the run as `success` with a one-line summary noting maintenance mode held.
3. Pull the prior week's file from `reports/seo/` if one exists, so this run can report real deltas instead of a single snapshot.

## The weekly run (Class A, no approval needed)

1. Pull live Google Search Console for `sc-domain:parentcoachdesk.com`: clicks, impressions, average CTR, average position, the Page Indexing report (indexed vs. not-indexed, broken out by reason), the Links report (external and internal), Core Web Vitals if field data exists.
2. Compare every number against the prior week's file. Flag anything that moved the wrong direction: indexed count down, 404/410 count up, impressions or clicks down two weeks running, a new "Crawled – currently not indexed" spike.
3. Spot-check the site itself: fetch a handful of pages GSC flags as problems (new 404s, pages that dropped out of the index) to confirm the flag is real and not a GSC lag artifact.
4. Name the single highest-impact fix for the week, same framing as the Organic Search Audit's ranked table (impact vs. effort). Most weeks this will be "nothing new, keep executing the 30/60/90 plan" — that is a valid, honest answer, not a failure to find something.
5. Write the week's report to `reports/seo/gsc-review-YYYY-MM-DD.md`. Plain numbers, the deltas, the one fix, links to anything cited.
6. If nothing needs Jeff's attention, no Slack post (per `SLACK-STAGING.md`: Class A only posts when something needs eyes). If something does — a regression, a new backlink worth knowing about, a dashboard-only action only Jeff can take — set `needs_you = true` in the run log and post one line via `slack_send_message` to `#pcd-agent-notications` (`channel_id C0BJC3WTNKC`, workspace `fieldforgeventures.slack.com`) with a link to the file. Never `#command` — that's Barnabus's portfolio channel, not PCD's.

## Indexing triage (part of the same weekly pass)

1. For every page in "Crawled – currently not indexed," check whether it's a known category (thin scraped camp listing, paginated/filtered variant) or something new worth flagging.
2. For every new 404, check the camps-directory expired-camp policy is actually catching it (should 301 to a sport/state hub or 410, never a bare 404 — see `src/pages/camps/[slug].astro` and `getCampBySlugAny` in `src/lib/camps-db.ts`). If a bare 404 shows up for a camp slug that should have hit the policy, that's a `needs_you` item: the policy has a gap, not a one-off.
3. Note sitemap health (both `sitemap-index.xml` and `sitemap-camps.xml` reading Success) in the weekly file. Only escalate if a sitemap goes to Error.

## Distribution and outreach drafting (Class B, session-triggered, not weekly)

Runs when Jeff asks for it, not on the Monday cadence. Examples: the author reveal, an outreach batch, a Pinterest push.

1. Read the relevant strategy file (`strategy/AUTHOR-REVEAL-CHECKLIST.md`, `strategy/PINTEREST-LAUNCH-KIT.md`, or whatever the session names).
2. Read `About Me/Anti AI Writing.txt` before writing one word. Every draft gets checked against it before it's called done: banned words, banned patterns, paragraph length, at least one voice marker, no em dashes.
3. Draft the copy. Save it under `reports/seo/` (or the location the specific strategy file already establishes, e.g. `reports/friday-letters/` stays Frida's, not Nora's).
4. Never send. Never post. The draft is the deliverable. Post one Slack line per `SLACK-STAGING.md`'s Class B convention: agent name, one line on what's ready, the link.

## Staged site fixes (Class C, session-triggered, pre-scoped only)

Only for fixes Jeff has explicitly scoped in the session (like the July hygiene pass). Never opportunistic — Nora doesn't go fix things she notices mid-report; she names them as `needs_you` items for a future session instead.

1. Make the change in the site repo.
2. Run `/web:commit-check` on the diff. Run whichever pillar reviewer applies to what changed (`/web:seo`, `/web:privacy`, `/web:a11y`, etc.).
3. No open Critical ships. If a fix can't be verified safe inside the session (can't confirm a live external dependency, can't test against a production account Nora has no access to), stage it as a clearly-marked note instead of shipping it. Log it as a `needs_you` item, not a completed fix.
4. Hand Jeff the paste-ready PowerShell block (build, git add/commit, wrangler deploy, git push) per the Deployment and Backup norms. Nora never runs it.

## Every run, no exceptions

- Run `node scripts/agent-run-client.mjs preflight`, then use its exported `writeAgentRun()` for start and finish. The scheduled-task secret store exposes `PCD_AGENT_RUNS_TOKEN` at runtime; never request, print, or pass it as an argument. Use agent `nora`, venture `pcd`, one idempotent UUID, and redacted finish fields. See `automation/RUN-LOG.md` and `coordination/AGENT-RUN-TOKEN-DISTRIBUTION.md`.
- If the run touched site source, note in the summary that the diff is staged and unshipped until Jeff runs the deploy block.
- If the run surfaced a dashboard-only action (Cloudflare zone rule, Kit account setting, DNS record) that no code fix can reach, name the exact steps in `needs_you_items`, not a vague "check Cloudflare" pointer.

## Idempotency

Every part of this skill is safe to re-run. The weekly GSC pull always reflects live data, so running it twice in a day just produces two near-identical reports (harmless, if wasteful). The indexing triage re-checks live URLs each time, so it never compounds a wrong call. Outreach drafts are always freshly written, never appended to a growing file that would double content on a second run.
