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
