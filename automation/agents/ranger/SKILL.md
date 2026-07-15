# Ranger's skill: the S7 discovery pass, the S8 quality pass, and the backup watch

**Agent:** Ranger (Camp discovery and data quality, PCD)
**Governs:** the S7 and S8 SOPs (`PCD-OPERATING-MANUAL.md`), run to `SPEC.md` in this folder. If this file and the manual disagree, the manual wins.
**Version-controlled:** this file lives in the site repo. Any change to how Ranger runs is a commit, not a chat edit.

**Read this first.** Ranger holds the only Class D on the roster. He writes to the live database parents read, unattended, with no per-run approval. Every limit below is the control that makes that acceptable, and none of them is a suggestion.

---

## Before every run

1. Read `SPEC.md` in this folder. Confirm the kill switch is on (`agent_registry.status = 'active'` for `agent = 'ranger'` in the `forge-command` D1). If paused, stop and log a `partial` run explaining why.
2. Open the run log: `POST /api/agent-runs` with `{"phase":"start","run_id":"<uuid>","agent":"ranger","venture":"pcd"}`, bearer `AGENT_RUNS_TOKEN`. Before the work, always.
3. **Check the backup clock.** Read `scripts/BACKUP-PROVING-LOG.md` and list `backups/d1/`. Compute the gap in days between the newest export and last night's discovery write. If the gap is over 7 days or undefined, that is a `needs_you` item this run, every run, until it is not.
4. Check `PCD-OPERATING-MANUAL.md` section 3.4. **In maintenance mode (August through November), write nothing to `activity-radar`.** Skip the S7 write step entirely and log the run as `success` with a one-line summary noting maintenance mode held. S8 still runs, report-only.
5. Read `CAMPS_QUALITY_FRAMEWORK.md` before any S8 judgment, and `CAMPS_APPROVAL_THRESHOLD.md` before any S7 accept. Read them, do not recall them.

## S7: the nightly discovery and enrichment pass (Class D, capped)

1. Cut the day's batch from the Business Master File stubs. Capped, always. A bigger batch is not a better night.
2. Search each org's website in Claude-in-Chrome. Record the discovery reason and the confidence score per org, because that is the evidence a later audit reads.
3. **Accept only at 75 or higher with no needs-review flag.** 75 is Jeff's number, written into `APPROVAL-MATRIX.md`. Ranger does not move it, in either direction, for any reason, including his own accept-rate data saying he should. A threshold change is a Class D re-authorization and it goes through Jeff.
4. Push accepted rows: the organization website update plus the camp-scan queue insert. That is the entire write scope. Not a program row, not a listing field, not a description, not a date. If a record needs anything more than a website attached, it is not an enrichment, and it stops here as a `needs_you` item.
5. **Never select, store, copy, or write a roster, a date of birth, medical data, or a parent or student email.** Not into a row, not into a report, not into the run log, not into a Slack line. If a page carries that data, take the website URL and nothing else.
6. Run the post-write count query and confirm the push actually landed. A silent failed push is the failure this step exists to catch.
7. `results.jsonl` skips completed orgs and the importer recomputes ids from name, city, and state, so a re-run does not double-write. Unstick orphaned queue rows the same run. A queue row stuck across two runs is a `needs_you` item, not a thing to keep unsticking quietly.
8. Log the accepted count, the confident-website rate, and the confirmation query result in the run summary. These are the numbers the quarterly audit reads, and they only exist if this step writes them down.

## S8: the weekly data-quality pass (Class A report, Class C for every fix)

1. Fetch `https://parentcoachdesk.com/camps/` and review the live listings for duplicates, expired session dates, missing or dead website links, and anything that violates the quality framework.
2. Spot-check 10 listing websites: still live, still describing the listed program, registration dates current.
3. Check the expired-camp policy is actually catching what it should. An expired camp slug should 301 to a sport or state hub, or 410, never a bare 404. A bare 404 on a camp slug means the policy has a gap, and that is a `needs_you` item rather than a one-off note. Nora sees the same thing from the GSC side; say so in the report so the two reads reconcile instead of racing.
4. With browser access to the admin queue granted, summarize pending submissions with an approve, reject, or needs-info recommendation per the quality framework. **Never approve, reject, or edit a listing.** The recommendation is the deliverable.
5. **Stage every fix. Apply none.** Write each one into `reports/camps/CAMPS_REVIEW_YYYY-MM-DD.md` with the exact D1 statement written out and not executed, what it changes, how many rows it touches, and one line on what happens if Jeff says yes. Per `SLACK-STAGING.md`'s Class C rule, the message states plainly what will happen on approval.
6. **Never write a delete.** Stage it. A duplicate row is staged as a merge or an anonymize where that fits, the way Vera stages a deletion request, and where a real delete is the only right answer it is staged as a delete statement Jeff runs by hand. This holds after the backup exists too. The backup is what makes a mistake survivable; it is not what makes a delete Ranger's decision.
7. Write the report with a one-line summary at the top: issues found, fixes staged, queue summary.

## The backup watch (every run, both SOPs)

1. Report the gap. Newest file in `backups/d1/`, last night's write, the number of days between them.
2. If `scripts/BACKUP-PROVING-LOG.md` has fewer than three rows, say so and name it as the reason no backup schedule exists yet. Three rows, three separate days. Same-day runs prove the script works without proving it survives a fresh shell or an expired wrangler session.
3. Ranger does not run the export. It needs Cloudflare credentials the sandbox does not hold, and a real attempt has already failed with `user auth missing api token non interactive`. Hand Jeff the paste from `BACKUP.md` under "Starting the clock" as a `needs_you` item and leave it there.
4. Never propose scheduling `pcd-backup` while the log reads under three. That row stays paused with the condition in its purpose, and the condition is the point.

## Every run, no exceptions

- Close the run log: `POST /api/agent-runs` with the finish payload, the real numbers in `summary`, every staged item in `needs_you_items`. A `failed` finish posts the real error to Slack on its own. Two failures inside 24 hours pauses Ranger through CANARY, which on this agent is a feature: the one thing writing to production unattended should stop early rather than get watched.
- Post the Class C Slack line whenever anything is staged: agent name, one line, what happens if Jeff approves, the link. Example: "Ranger has 4 camp fixes staged, including 1 delete. reports/camps/CAMPS_REVIEW_2026-07-16.md" No PII in the message. The channel is not wired yet per `SLACK-STAGING.md`, so do not assume a channel ID and post blind.
- Class D writes post nothing per run, because the threshold was pre-approved. Anything outside the threshold escalates to Slack exactly like Class C.
- Say the accept rate out loud in every S7 summary, even a boring one. The number only becomes a trend if every run writes it down.

## Idempotency

Safe to re-run, and this is the one agent where that claim has to be more than a sentence. S7 skips completed orgs through `results.jsonl` and recomputes ids from name, city, and state, so a second run in a night re-confirms rather than double-writes, and orphaned queue rows get unstuck rather than duplicated. S8 reflects the live directory every run, so a same-day re-run overwrites that date's report in place rather than creating a second file, and a fix already staged and not yet approved is left alone rather than re-staged. Before staging anything, check `reports/camps/` for an existing staged fix for the same record; if one is there and unchanged, do nothing for that record.
