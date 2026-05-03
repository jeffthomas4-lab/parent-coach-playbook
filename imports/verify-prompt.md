# Claude in Chrome prompt: spot-check verification

Paste everything below the line into Claude in Chrome. You must be logged into Cloudflare Access in this browser session before pasting (visit `/admin/camps/spot-check` once and complete the One-Time PIN flow).

---

## Task

Verify the unverified camps on parentcoachplaybook.com against their actual websites. For each camp, visit the registration page and confirm the dates, ages, price, and spots status still match what we have in the database. Produce a single markdown report I can scan and act on.

You are NOT to modify the database. You only produce a report. I'll click "Mark verified" or "Reject" myself based on what you find.

## Step 1. Read the spot-check queue

Navigate to:

  https://parentcoachplaybook.com/admin/camps/spot-check

This page is behind Cloudflare Access. If it bounces you to a login screen, complete the One-Time PIN flow with the email Cloudflare prompts for, then return to the page.

The page lists every approved camp with `verified=0`. Each camp card shows:
- name
- sport, ages, date range, program type, spots status
- street address, city, state, zip
- website url (the link with the ↗ arrow)
- price
- description

Extract all of these into your working memory. Each camp also has a slug visible in its "View on site ↗" link (`/camps/<slug>/`). Capture the slug so I can find each camp again in the report.

## Step 2. Verify each camp

For each camp in the queue, in order from top to bottom:

1. Open the camp's `website_url` in a new tab.
2. Find the same program on that page. The actual published name may differ slightly (e.g., "Logger Volleyball Setter Camp" vs. "Setter Camp" once you're inside the volleyball microsite).
3. Compare these fields against what the spot-check page says:
   - **dates**: do the start_date and end_date on the website match the database?
   - **ages**: does the age range still match?
   - **price**: does the price text still match? Small wording differences are fine if the dollar amount agrees.
   - **spots status**: is registration still open, or has it filled, gone to waitlist, or closed?
   - **page health**: did the page load? 404? Was the camp removed entirely?
4. Classify the camp into one of these buckets:
   - `PASS` — everything matches, page is live, registration is open or matches the DB status. Recommend Mark verified.
   - `DATE_CHANGED` — dates have shifted on the website. Recommend Edit then verify.
   - `AGE_CHANGED` — age range differs.
   - `PRICE_CHANGED` — price has changed materially.
   - `STATUS_CHANGED` — was open, is now full or waitlist (or vice versa).
   - `DEAD` — page 404, camp removed, or website no longer shows this program at all. Recommend Reject.
   - `BLOCKED` — Cloudflare or login wall, can't verify. Recommend skip; I'll check manually.
   - `NEEDS_REVIEW` — anything you couldn't classify confidently.

Don't guess. If a field is ambiguous, mark `NEEDS_REVIEW` and let me decide.

## Step 3. Output the report

After processing every camp, output ONE markdown fenced block containing the full report. No CSV. No commentary outside the block.

The block has two parts:

```markdown
## Verification report

Total checked: N · PASS: a · DATE_CHANGED: b · AGE_CHANGED: c · PRICE_CHANGED: d · STATUS_CHANGED: e · DEAD: f · BLOCKED: g · NEEDS_REVIEW: h

### PASS — bulk-verify these

| Slug | Name | Notes |
|---|---|---|
| pearl-street-ymca-all-week-camp-tropical-paradise | Pearl Street YMCA All Week Camp - Tropical Paradise | matches |
| ... |

### Needs action

| Slug | Name | Bucket | What changed | Recommended action |
|---|---|---|---|---|
| example-camp-slug | Example Camp Name | DATE_CHANGED | website shows Jul 6-10, DB has Jun 22-26 | Edit dates then verify |
| dead-camp-slug | Old Camp | DEAD | website 404 | Reject |
| ... |
```

Group the report so PASS rows are in their own table (tight, scannable) and everything else lives in the "Needs action" table.

If a section has no rows, write `(none)` under the heading instead of an empty table.

## Step 4. Output the action shortcuts (optional)

After the report, output a second fenced block of one-line URLs I can click to open each NEEDS_ACTION camp in the admin editor:

```
https://parentcoachplaybook.com/admin/camps/<id>/
```

If you can grab the camp `id` from the spot-check page (it's in the form action attributes like `/api/admin/camps/<id>/verify`), include that. Otherwise the slug-based public URL is fine.

## Field rules

- Don't invent data. If the website doesn't show a price, write "no price on page" in Notes — don't fabricate.
- "Matches" means functionally the same, not character-for-character. "$295" matches "$295.00". "Day camp" matches "day program".
- Dates: use the website's published dates. If the website shows multiple sessions, match against the specific session in the DB row by date overlap.
- If a camp redirects to a different URL, follow the redirect once. If it bounces multiple times, mark BLOCKED.
- Be efficient. Don't write essays in the Notes column. Two-to-six word descriptions per row.

## What to skip

- Camps where you cannot reach the website at all due to network errors. Mark as BLOCKED with the error reason.
- Pages that require a login Chrome doesn't have. Mark BLOCKED.

When the report is complete, output the markdown block. No preamble. No summary after.
