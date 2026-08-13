# Friday Letter No. 5 — send 2026-08-14

**Status:** DRAFT. Review, edit, paste into Kit. Never sent from here.
**Written:** 2026-08-12 (Wednesday cycle, on schedule).

---

## Subject line

**Primary:** Pads are on: what the heat rule actually requires

**Alt 1:** It's never the hottest day that gets them

**Alt 2:** Texas just made this mandatory. Has your league?

---

## Preview text

Most fall sports run a 14-day heat-acclimatization period, and it's not there because your coach can't be trusted.

---

## Lead

Check-in day was yesterday around here: medical checks, equipment fitting, media day, a full team meeting, all crammed into one long afternoon. Pads go on today. If your kid's team runs anything like that schedule, you're either in the middle of it right now or a few days out, and the next two weeks matter more than almost any other stretch of the season, not because of anything drawn up on a whiteboard, but because of how the first hot practices get handled.

Most fall sports run some version of a heat-acclimatization rule for those first two weeks: shorter practices, no full pads or equipment right away, a mandatory rest day built into the schedule. It's not there because coaches can't be trusted. It's there because athletic trainers went back and looked at when heat deaths actually happen, and it's almost never the hottest day of the month. It's day two or three, before a kid's body has had time to catch up.

Texas just made its version of that rule mandatory statewide, after two years of leaving it optional. If you don't know whether your own state, league, or school still treats its heat rule as a suggestion, this is the week to find out.

One read on what the rule actually requires, one on what to say if a coach skips it anyway, and one from the archive.

---

## Content links

**1. Texas UIL Heat Monitoring Rule Goes From Recommended to Required**
Wet-bulb globe temperature tracking is now mandatory before every outdoor UIL practice, marching band included, with cold-water immersion tubs required above the trigger threshold.
https://parentcoachdesk.com/news/texas-uil-heat-rule-mandatory-2026/

**2. The Heat-Acclimatization Rule Your Soccer Program Has to Follow the First Two Weeks**
One practice a day, capped at three hours, for the first five days, before double sessions are allowed starting day six, straight from the national athletic trainers' guideline most states have adopted.
https://parentcoachdesk.com/drive-there/heat-acclimatization-rule-soccer/

---

## Archive resurface

**The Coach Who Ignores the Heat Advisory: What We Actually Say**
The exact low-conflict question that got water breaks moved up without anyone having to admit a coach was wrong.
https://parentcoachdesk.com/team-parent/the-coach-who-ignores-the-heat-advisory/

---

## Sign-off

Glad you're here. See you next Friday.

— The Parent Coach Desk

---

## Notes for Jeff

- **Seasonal hook, verified against your calendar:** yesterday (8/12) was check-in day, New Player Medical Check, Returning Player Equipment Check, New Player Equipment, Returning Player Medical, Media Day, Team Meeting, matching last week's letter exactly. Today (8/13, the Wednesday-cycle "today" the lead refers to) is logged as "FB Practice (Helmet)," the first practice in pads. The lead's "check-in day was yesterday, pads go on today" is accurate as of the day this was written; by Friday's send it'll read as a day or two in the past, which is fine, same as last week's letter.
- **This week's new/updated content, reviewed:** everything published since the 8/07 letter (which covered through `helmet-care-without-wrecking-it` and `youth-sports-costs`). New and live: `heat-acclimatization-rule-soccer` (8/10), `post-game-field-breakdown-checklist` (8/11), `texas-uil-heat-rule-mandatory-2026` news (8/11), plus `color-coded-bin-system-for-multi-sport-families`, `dry-the-gear-without-warping-it`, `one-day-coaching-clinic-what-to-look-for` (all 8/9), and `volleyball-equipment` (8/7, missed last week). Two soccer field-marking pieces, `squaring-soccer-field-corners-with-the-3-4-5-method` and `setting-up-the-soccer-center-circle`, are still `draft: true` (status `needs-revision`, both failed Penny's rubric on sentence rhythm/paragraph length), so excluded per the standing rule. `what-has-to-be-signed-before-football-practice` is scheduled for 8/17, still `draft: true`, not eligible yet either. `cleat-care-that-triples-the-lifespan` and `heat-lightning-decision-trees` flipped from draft to live sometime after last week's letter was written; `heat-lightning-decision-trees` (WBGT flags, the 30-30 lightning rule) was a strong candidate for a content link but I went with the Texas news + the soccer acclimatization piece instead to keep the letter to two links and avoid three heat pieces in one send. Worth using `heat-lightning-decision-trees` next week if the theme carries over, or saving it for the first real heat advisory of the season.
- **Why this angle over pure football:** last week's letter was football-specific (helmet care, costs, two-a-days). This week's new content clustered hard around heat rules across soccer and a Texas news item, so I widened the lead to "fall sports" generally rather than repeating football as the frame two weeks running. Your own program's check-in day and pads-on date still anchor the lead, they're just presented as one example of the same thing happening everywhere.
- **Archive pick:** `the-coach-who-ignores-the-heat-advisory` (published 7/4, live). Chosen over `cross-country-august-heat-first-season` and `heat-illness-when-to-pull-them-out`, both reasonable heat-themed alternatives, because it's the "what do I actually do about it" companion to two content links that are both "here's what the rule says." Also deliberately different from last week's archive pick (`two-a-days-what-parents-need-to-know`) so the letter isn't leaning on the same resurface two weeks running.
- **Deploy caveat, same as every week:** per `src/lib/publishFilter.ts`, `draft: false` and a past `publishedAt` make a piece locally eligible, not live. Nothing rebuilds the site on a schedule since the Pages-to-Workers cutover. Confirm `heat-acclimatization-rule-soccer` and the Texas news item are actually live before sending, not just eligible.
- **Amazon scan: clean.** No Amazon links anywhere in the letter or in either source article's frontmatter.
- **Link verification:** not fetched live (fetch restrictions on this domain from this environment). Verified against the repo instead: the news link routes through `src/pages/news/[slug].astro`, which builds its path from `item.id` with no `slug` override in this file's frontmatter, so `/news/texas-uil-heat-rule-mandatory-2026/` is correct. The soccer and archive links route through their respective `[slug].astro` pages for `drive-there` and `team-parent`, same pattern as last week, no custom slugs on either file. Worth a click-through before you send.
- Lead word count: 230.
