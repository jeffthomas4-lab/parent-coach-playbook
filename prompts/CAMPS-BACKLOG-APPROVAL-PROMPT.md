# Sonnet run prompt: camps backlog low-threshold approval

Hand this whole file to a Sonnet session. It defines a deliberately low confidence threshold, writes it down as the standing policy, then works the pending camp backlog and approves as many as clear the bar. Jeff has authorized this bulk approval; he is the approving human for every record this run touches.

---

## What you are doing and why

parentcoachdesk.com's camps directory reads live from a shared Cloudflare D1 named `activity-radar` (database_id `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`). The public `/camps` pages show a program only when `pcd_status = 'approved'` AND `session_end_date >= date('now')`. The page reads D1 at request time, so an approval shows up on the live site with no rebuild.

A daily discovery agent finds youth-org websites, an hourly worker scans them and creates camp rows in the `programs` table, and every one of those rows lands as `pcd_status = 'pending'`. Nobody has been working that queue, so the discovery pipeline's entire output is invisible. As of 2026-07-13 there are about 937 pending programs. All have a name, a city and state, and a live URL. About 132 are future-dated.

Your job: approve everything that clears a low bar, so the pipeline's work reaches parents.

## The confidence threshold (make it low, then save it)

The rule is simple: if a program has enough information to be useful, it goes through. Approve by default. Only a hard disqualifier keeps a program out.

**Approve** any pending program that has all of:

1. A non-empty name.
2. A location: a city and state, or latitude and longitude.
3. A URL that is not dead: `url_health_status` is `live` or `unchecked`. Treat `unchecked` as fine; do not re-verify, the bar is low.
4. At least one thing a parent can act on OR read: a session date, a registration URL, a price, or a real description of two sentences or more.

**Hard disqualifiers (the only reasons not to approve):**

- No usable name.
- No location at all (no city and state, and no coordinates).
- URL confirmed dead: `url_health_status` in (`dead`, `404`) or `url_last_status_code >= 400`. Set these to `rejected`, reason `dead-url`.
- The source page exposes minor personal data: rosters, dates of birth, medical notes, or individual student or parent emails. Set to `rejected`, reason `minor-data`, and never copy that data anywhere.
- Clearly not a youth activity (adult-only, or not a camp, class, league, or program at all). Set to `rejected`, reason `not-youth-activity`.

**Confidence grade** (record it, but it does not block approval):

- `high`: has a future session date and a registration URL or price.
- `medium`: has a date, a registration URL, or a price, but not the full set.
- `low`: has only name, location, live URL, and a description. Thin, but Jeff's call is to let it through.

Before processing, save this rule to `Outputs/parent-coach-desk/CAMPS_APPROVAL_THRESHOLD.md` as the standing policy, dated today, so future runs and the enrichment worker inherit the same bar.

## How to work the backlog

Push every write through the Cloudflare D1 MCP tool `d1_database_query` (load via ToolSearch on `d1_database_query` if deferred), database_id `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`. Do not use local `wrangler d1 execute`; this sandbox has a Windows wrangler binary that fails with a platform mismatch, not a real auth error.

1. **Count first.** Run `SELECT COUNT(*) FROM programs WHERE pcd_status='pending'` and record the starting number.

2. **Pull in batches of 150, future-dated first**, so the camps parents can actually see get approved before the archive:

   ```sql
   SELECT p.id, p.name, p.activity_category, p.session_start_date, p.session_end_date,
          p.registration_url, p.price_text, p.description, p.url_health_status, p.url_last_status_code,
          o.city, o.state, o.latitude, o.longitude
   FROM programs p JOIN organizations o ON p.organization_id = o.id
   WHERE p.pcd_status='pending'
   ORDER BY (p.session_end_date >= date('now')) DESC, p.session_end_date DESC
   LIMIT 150;
   ```

   Keep queries simple. D1 rejects compound SELECTs with too many UNION terms (error 7500), so do not stack many UNIONs in one statement.

3. **Classify each row** by the threshold above into approve (with a grade) or reject (with a reason).

4. **Write the batch as compact grouped UPDATEs**, not one statement per row. Use the same column set the app's own approve path uses, so the records stay consistent:

   ```sql
   UPDATE programs
   SET pcd_status='approved', record_status='active', awaiting_review=0,
       pcd_confidence=<grade>, reviewed_by='sonnet-bulk-approval',
       reviewed_at='<NOW-ISO>', review_notes='low-threshold approval 2026-07-13'
   WHERE pcd_status='pending' AND id IN ('<id>','<id>', ...);
   ```

   Group the IN list by grade so each UPDATE sets the right `pcd_confidence`. Cap each IN list around 150 ids. Reruns are safe because the `WHERE pcd_status='pending'` guard means an already-approved row is never touched again.

   For rejects:

   ```sql
   UPDATE programs
   SET pcd_status='rejected', record_status='inactive',
       reject_reason_code='<reason>', reviewed_by='sonnet-bulk-approval',
       reviewed_at='<NOW-ISO>', review_notes='low-threshold reject: <reason> 2026-07-13'
   WHERE pcd_status='pending' AND id IN (...);
   ```

5. **Make sure the parent org is active** for each approved program so it is not filtered out upstream:

   ```sql
   UPDATE organizations SET record_status='active'
   WHERE id IN (SELECT organization_id FROM programs WHERE pcd_status='approved' AND reviewed_by='sonnet-bulk-approval');
   ```

6. **Repeat** until `SELECT COUNT(*) FROM programs WHERE pcd_status='pending'` reaches 0 or only genuine disqualifiers remain.

## Guardrails

- Writes go only to `programs` and `organizations`, only the columns above. No other tables, no schema changes.
- Never store or copy rosters, dates of birth, medical notes, or individual student or parent emails. If a record carries them, reject it and move on.
- No emails, no external sends, no site deploy. This is a database pass; the live site reflects it on its own.
- Idempotent: every write is guarded by `pcd_status='pending'`, so you can rerun this prompt safely.

## Report back

End with a short report:

- Pending at start, approved, rejected, still pending, broken out by confidence grade and by reject reason.
- How many approved programs are future-dated (`session_end_date >= date('now')`), which is what parents can see now, versus archived past-date approvals.
- Run this to confirm the live count and put it in the report:

  ```sql
  SELECT COUNT(*) FROM programs WHERE pcd_status='approved' AND session_end_date >= date('now');
  ```

- One line on any pattern worth Jeff knowing: a source domain that produced a lot of junk, a category that was mostly disqualified, anything that suggests a fix upstream in the discovery or scan worker.

## After the backlog

Note in your report, do not build this run: the same threshold should move into the enrichment worker so future scraped camps are created already approved (or auto-approved on a nightly pass) instead of piling up pending again. Clearing the backlog once does not stop it from refilling.
