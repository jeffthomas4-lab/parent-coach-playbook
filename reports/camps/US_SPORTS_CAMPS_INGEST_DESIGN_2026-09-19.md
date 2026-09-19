# US Sports Camps ingest design

Dated 2026-09-19. Status: **design only** — implement after November 2026 seasonal camps pause (Cass / Donny / evergreen writers resume).

Owner: PCD camps lane (Donny org discovery + Ranger steward + approval gate). Jeff intent: US Sports Camps / Nike youth sessions belong in the directory; the Sep 2026 scrape did not.

## Why the first import failed

On 2026-09-17 P1 triage held 40 `ussportscamps.com` rows as dup-org noise. On 2026-09-19 Jeff rejected all 40 (`reject_reason_code=aggregator-syndication`, `reviewed_by=pcd-jeff-ussportscamps-reject-2026-09-19`).

Root causes observed in D1:

1. **Session-as-org.** Each listing created a separate `organizations` row whose `name` was the full marketing title including dates (e.g. "Nike Tennis Camp at Lewis & Clark College - (July 13–16, 2026)"). That is not an organization.
2. **Missing session dates on programs.** Rejected `programs` rows often have `session_start_date` / `session_end_date` null even when dates appear in the org title or on the source page. Public `/camps` only lists `pcd_status=approved` AND `session_end_date >= today`, so null dates never go live.
3. **Duplicate program shells.** Multiple pending rows shared the same `registration_url` and short program name (e.g. three "Nike Baseball Camp at University of Puget Sound" rows pointing at one US Sports Camps URL).
4. **Aggregator shape.** US Sports Camps is a multi-venue operator (Nike-branded camps at college/park venues). Treating each venue-session as a standalone local org floods the directory and breaks "org with many sessions" browsing.

Rejecting the bad rows was correct. Leaving US Sports Camps out forever is not — parents in PNW (and elsewhere) actually look for these camps.

## Goals

- One canonical org parents can trust: **US Sports Camps**.
- Many **programs/sessions** under that org: sport × venue × date window × day/overnight.
- Venue readable on the card (city/state + location notes / campus name).
- Safe re-ingest that does not recreate session-as-org rows.
- Human approval still required before `approved` (standing camps publication gate).

Non-goals for v1:

- Full national coverage on day one (start PNW / PCD geo focus).
- Claiming or paid placement.
- Changing the public approval threshold document beyond noting this source class.

## Target data model

### Organization (exactly one)

| Field | Value |
| --- | --- |
| `name` | US Sports Camps |
| `aliases` | Nike Sports Camps; US Sports Camps / Nike |
| `website_url` | https://www.ussportscamps.com/ |
| `organization_type` | camp-operator / multi-venue (match existing enum) |
| `source_domain` / provenance | ussportscamps.com |
| `pcd_status` | approved only after Jeff/Ranger review of the org shell |

Do **not** create one org per venue. Venues live on programs.

### Program (one row per bookable session)

| Field | Source |
| --- | --- |
| `organization_id` | FK → US Sports Camps org |
| `name` | Short stable title without dates: "Nike Baseball Camp at University of Puget Sound" |
| `activity_category` / sport | Parsed from URL path or page (`/baseball/`, `/soccer/`, …) |
| `session_start_date` / `session_end_date` | Required for publish; parse from session picker / structured data / title fallback |
| `day_or_overnight` | From page labels (Day Camp / Overnight) |
| `registration_url` | Canonical session or camp page URL |
| `location_notes` | Venue name (campus / park) |
| city / state / lat / lon | From venue page or geocode of venue; never invent |
| `source_domain` | ussportscamps.com |
| `external_key` | Stable dedup key (below) |
| `pcd_status` | `pending` on ingest → human approve |

### Dedup key

`external_key` (or equivalent content hash) must be stable across scrapes:

```
ussportscamps|{sport}|{venue_slug}|{session_start}|{session_end}|{day_or_overnight}
```

Fallback if dates missing at fetch time: do **not** insert; queue for enrichment. Never insert a second org.

URL alone is not enough (one camp page can list multiple dated sessions).

## Ingest pipeline (post-November)

1. **Allowlist source** `ussportscamps.com` in Donny/Ranger discovery with a dedicated parser profile (`ussportscamps-multi-venue`), not the generic local-org scraper.
2. **Resolve org once** — find-or-create US Sports Camps by `website_url` / external key; never create from page `<title>`.
3. **Parse sessions** — for each camp page, extract every dated session (start/end, day vs overnight, price if present).
4. **Upsert programs** by `external_key`. Update dates/URL/price when changed; do not fork duplicates.
5. **Geocode venue** once per venue_slug; reuse across sports/sessions at that campus.
6. **Land as `pending`.** Ranger/Jeff approve in batches (e.g. PNW first: UPS, University of Portland, OSU, Lewis & Clark, local parks).
7. **Sweep compatibility** — URL liveness and past-date archive already in `/api/cron/camps-sweep` apply unchanged once approved with real end dates.

## Approval policy for this source

- Approve sessions that have: usable name, venue location, live registration URL, and future `session_end_date`.
- Reject / skip: sold-out-only historical shells with no future dates; adult-only clinics if any; pages that cannot yield dates after enrichment.
- Do not auto-approve on scrape confidence alone (standing gate from `CAMPS_APPROVAL_THRESHOLD.md`).

## Migration of the rejected batch

The 40 rejected rows are evidence, not a restore source of truth.

After the new parser exists:

1. Keep them `rejected` (audit trail).
2. Re-crawl the same `registration_url`s through the multi-venue profile.
3. Insert clean pending programs under the single US Sports Camps org.
4. Optionally attach `review_notes` linking back to `pcd-jeff-ussportscamps-reject-2026-09-19` so we know they were rebuilt, not resurrected.

## Implementation checklist (after Nov 2026)

- [ ] Add parser profile + tests with fixtures from 2–3 real US Sports Camps pages (baseball UPS, volleyball Portland, tennis Lewis & Clark).
- [ ] Create/approve the single US Sports Camps org shell.
- [ ] PNW pilot: ingest ≤20 future sessions → pending → human approve → confirm `/api/camps/lite` and `/camps/` show venue-clear cards.
- [ ] Expand geography only after pilot quality bar passes.
- [ ] Document source in camps discovery runbook; ensure seasonal pause docs point here so we do not re-enable the broken generic scrape.

## Success metrics

- Zero new `organizations` rows whose names contain month/day date ranges from this source.
- Each live US Sports Camps card has future dates and a clear venue.
- No growth in duplicate `registration_url` pending stacks from this source.
- Parent-facing coverage: major PNW Nike/US Sports Camps venues discoverable on `/camps` before summer 2027 registration peaks.

## Decision log

- 2026-09-17: Held 40 as dup-org during P1 evergreen triage.
- 2026-09-19: Rejected all 40 as aggregator noise (Jeff).
- 2026-09-19: Jeff directed design-now / implement-after-November for a proper one-org multi-session ingest.
