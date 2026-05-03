# Peachjar Flyer Log

Tracks every Peachjar flyer we've seen so we don't re-process them. Different from `CAMP-SEARCH-LOG.md` because Peachjar requires a login (Jeff's son's school account), the unit of work is one flyer at a time, and the data quality varies (most flyers are PDFs/images that need visual extraction).

**Last updated:** 2026-05-03

---

## How to use this file

1. **Before a Peachjar run:** Read the `Seen Flyers` table. Build the SKIP_LIST = every URL already in the table. Don't process those flyers again.
2. **During the run:** For each flyer on the school's Peachjar page, check if its URL is in SKIP_LIST. If yes, skip. If no, classify it (camp / league / skip).
3. **What to import:** Only flyers classified as `camp` or `league`. Everything else is logged but not imported.
4. **After the run:** Append every flyer you saw (imported, skipped, anything) to the `Seen Flyers` table. Append a summary row to `Run History`.

---

## School configuration

Set this to the Peachjar URL for your son's school. Chrome navigates here.

**School name:** (fill in if you want it on the page)
**School Peachjar URL:** https://my.peachjar.com/jar?audienceId=61436&tab=school&districtId=2591&audienceType=school

If the URL changes year-to-year, update it here once and never again.

---

## Active filter rules

Only import flyers that match `program_type` = `camp` or `league`. Skip:

- Flyers with `end_date` before today (past-date)
- One-time events (open houses, fundraisers, family fun nights, school dances)
- School announcements (PTA news, school news, parent surveys)
- Classes / lessons (music, art, tutoring) — for now. Revisit later.
- Anything we can't extract a real start_date from

A flyer counts as a `league` if it describes a recurring season (multiple practices/games over weeks). It counts as a `camp` if it's a time-bounded session (1 day to 2 weeks). When in doubt, default to `camp`.

---

## Seen Flyers

One row per flyer URL we've encountered. Don't delete rows; we use them as the dedupe key.

Classification enum:
- `camp` — imported as a camp
- `league` — imported as a league
- `event` — one-time event, skipped
- `class` — class/lesson, skipped (revisit later)
- `announcement` — school news / PTA / non-program, skipped
- `expired` — past end_date, skipped
- `incomplete` — not enough info to import, skipped (revisit if reposted)
- `duplicate` — same program already in the database from another source

| Flyer URL | Title | Posted | End date | Classification | Imported | Notes |
|---|---|---|---|---|---|---|
| (none yet) | | | | | | |

---

## Run History

| Date | Flyers seen | New | Imported (camps) | Imported (leagues) | Skipped | Notes |
|---|---|---|---|---|---|---|
| (none yet) | | | | | | |
