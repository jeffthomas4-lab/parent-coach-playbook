# Friday Letter No. 4 — send 2026-08-07

**Status:** DRAFT. Review, edit, paste into Kit. Never sent from here.
**Written:** 2026-08-05 (Wednesday cycle, on schedule).

---

## Subject line

**Primary:** One week out: the helmet and the receipts

**Alt 1:** Before check-in day, two five-minute jobs

**Alt 2:** Pads go on Thursday. Here's what's due first.

---

## Preview text

Dish soap beats the cleaner under your sink for the helmet, and the two-a-days playbook worth a re-read before the first practice in gear.

---

## Lead

Staff meetings are underway, and this morning's conference call made it official: eleven days until pads go on. For a lot of programs, next Wednesday is the day everything lands at once, physicals, equipment fitting, media day, the first full team meeting, all in one afternoon. Thursday brings the first practice in gear. If your kid's season runs anything like ours, you've got one week to get two boring things handled before the calendar gets loud again.

First, the helmet that's been sitting in the garage since last season. Dish soap and warm water is the whole job. Skip the commercial cleaner under the sink, and skip bleach entirely, both can quietly degrade the shell and foam and void the manufacturer's warranty, and neither one does what an actual NOCSAE recertification does.

Second, before you sign anything or hand over a card: know what the season costs, all in, not just the number on the registration form. Rec and club totals rarely mean the same thing, and most towns have a scholarship or fee waiver nobody bothers to advertise.

One read on the helmet, one on the money, and one from the archive on the two weeks that are about to get physical.

---

## Content links

**1. Clean the Helmet Without *Wrecking* It**
Mild, non-citrus dish soap and warm water only. Commercial cleaners, wax, bleach, and solvents can degrade the shell and foam and void the warranty.
https://parentcoachdesk.com/team-parent/helmet-care-without-wrecking-it/

**2. Youth Sports Costs for Parents: How to Plan and Save**
Compare rec and club totals side by side, get every fee in writing, and check for a municipal scholarship before you register.
https://parentcoachdesk.com/game/youth-sports-costs/

---

## Archive resurface

**Two-a-Days: What Parents Need to Know**
What they are, how long they run, and why hydration and sleep matter more in this two-week window than at any other point in the season.
https://parentcoachdesk.com/drive-there/two-a-days-what-parents-need-to-know/

---

## Sign-off

Glad you're here. See you next Friday.

— The Parent Coach Desk

---

## Notes for Jeff

- **Seasonal hook, verified against your calendar:** "First Staff Meetin[g]" was 8/3, "NWC Football Pre-Season Meeting" was this morning (8/5). Camp check-in day (New Player Medical Check, Returning Player Equipment Check, New Player Equipment, Returning Player Medical, Media Day, Team Meeting) is 8/12, and the first practice with helmets on is logged 8/13. "One week out from pads" is accurate as of the Wednesday this was written; it'll read as "this week" by the time it sends Friday, which is fine, the lead doesn't promise a specific day count.
- **This week's new/updated content, reviewed:** six articles touched since the 7/31 letter. Two are still `draft: true` (`cleat-care-that-triples-the-lifespan`, `heat-lightning-decision-trees`), not live, not linked, per the standing rule. Of the four `draft: false` pieces, `swim-meet-weekend-logistics` was only an `updatedAt` touch on a 5/13 original, not new content, so it's excluded. `usa-vs-usssa-bats` (8/1) is a solid buying guide but a spring/summer-baseball seasonal fit, not an August pre-season one, so it's excluded this week too. `helmet-care-without-wrecking-it` (8/3) and `youth-sports-costs` (8/2) are both genuinely new, both live, and both land squarely in "check-in week."
- **Archive pick:** `two-a-days-what-parents-need-to-know` (published 6/11, live). Chosen over `week-one-camp-drop-off`, `first-team-meeting-agenda`, and `the-first-parent-email-of-the-season`, all reasonable "drive-there" pieces, because two-a-days is the one that names the exact thing about to happen (pads on, heat rules, the two-week grind) rather than a generic season-kickoff note. `what-has-to-be-signed-before-football-practice` would have been a tighter fit for the "paperwork" half of this letter but is still `draft: true`, so it's out.
- **Deploy caveat, worth remembering:** per `src/lib/publishFilter.ts`, `draft: false` and a past `publishedAt` only make an article locally eligible, they don't put it on the live site. Nothing rebuilds parentcoachdesk.com on a schedule since the Pages-to-Workers cutover; a deploy only happens when a human merges to main and approves production. Worth confirming `helmet-care-without-wrecking-it` and `youth-sports-costs` are actually live before Friday, not just eligible.
- **Amazon scan: clean.** No Amazon links anywhere in the letter or in either source article's frontmatter.
- **Link verification:** not fetched live (fetch restrictions on this domain from this environment). Verified against the repo instead: both content links and the archive link route through `isLive`-filtered `[slug].astro` pages for their respective phases (`team-parent`, `game`, `drive-there`), none have a custom `slug:` override, so the filename is the route segment for all three. Worth a quick click before you send, same as always.
- Lead word count: 203.
