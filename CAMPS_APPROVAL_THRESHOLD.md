# Camps approval threshold

Dated 2026-07-13. Standing policy for `programs.pcd_status`. Applies to this bulk pass and to the enrichment worker going forward.

## The rule

Approve by default. A program goes from `pending` to `approved` if it has all four:

1. A non-empty name.
2. A location: city and state, or latitude and longitude.
3. A URL that is not confirmed dead: `url_health_status` is `live` or `unchecked`. `unchecked` counts as fine, no re-verification required.
4. At least one of: a session date, a registration URL, a price, or a description of two sentences or more.

## Hard disqualifiers (reject, only reasons)

- No usable name.
- No location at all.
- URL confirmed dead: `url_health_status` in (`dead`, `404`) or `url_last_status_code >= 400`. Reason code `dead-url`.
- Source page exposes minor personal data (rosters, dates of birth, medical notes, individual student or parent emails). Reason code `minor-data`. Never copy that data anywhere.
- Clearly not a youth activity (adult-only, or not a camp/class/league/program). Reason code `not-youth-activity`.

## Confidence grade (recorded, does not block approval)

- `high`: future session date and (registration URL or price).
- `medium`: a date, a registration URL, or a price, but not the full set.
- `low`: only name, location, live URL, and a description. Thin, approved anyway.

## Why the bar is low

The discovery and scan pipeline was producing pending rows nobody worked, so the entire pipeline's output was invisible to parents. The site reads D1 live, so an approval shows on `/camps` immediately with no rebuild. Letting thin-but-usable records through gets the pipeline's work in front of parents; a name, a location, a live link, and a real description is enough to be useful.

## Standing instruction

This threshold should move into the enrichment worker so newly scraped camps are created already approved (or auto-approved on a nightly pass) instead of piling up pending again. Clearing the backlog once does not stop it from refilling.

Status: done. `campApproval()` in `workers-activity-radar/enrichment-worker.ts` applies this threshold at scrape time.

## Status model (added 2026-07-13, ActivityRadar merge WP-8)

Two status fields exist on `programs`. `pcd_status` (`pending`/`approved`/`rejected`) is the single source of truth. `record_status` (`active`/`unverified`/`inactive`) is a derived mirror, ActivityRadar-era naming kept for the shared schema. No code in this repo reads `record_status` to decide what a parent sees; every public query (`listApprovedCamps`, `CAMP_SELECT`, etc. in `src/lib/camps-db.ts`) filters on `pcd_status`.

The mapping, applied everywhere a program's status is set:

| pcd_status | record_status |
|---|---|
| approved | active |
| rejected | inactive |
| pending | unverified |

Where it's enforced: `campApproval()` in the enrichment worker (creation time), `approveCamp()`/`rejectCamp()` in `src/lib/camps-db.ts` (admin review). `insertCamp()` derives the same mapping for manual submissions.

One known drift, not fixed this session: `workers-activity-radar/enrichment-worker.ts`'s `writeCamp()` unconditionally sets the *organization's* `record_status = 'active'` whenever `camp_detected = 1`, even when the program it just wrote is `pcd_status = 'pending'`. This doesn't affect parent-facing visibility (nothing reads org-level `record_status`), so it's a data-quality note, not a bug — flagged for Jeff to decide whether to gate it on the program's approval status too.
