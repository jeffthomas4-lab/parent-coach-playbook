# Data Map: parent-coach-desk (parentcoachdesk.com)

Pillar 2 (Privacy) of the Website Build Standard. Every piece of personal data this app touches, where it lives, who it goes to, how long it is kept, and how it gets deleted. The privacy policy is written from this file. If it is not listed here, the policy must not claim it.

Last updated: 2026-06-27 (retrofit scaffold, confirm and complete with `/web:privacy`).

## Data home
D1 `activity-radar` (shared with ActivityRadar): organizations, programs, camp_claims, camp_reviews, submitters, search_events, geocoded_addresses, domain_quality. R2 `activityradar-photos`: org logos, program photos. No KV.

## Personal data collected
- Submitter / claimant email addresses (camp_claims, submitters).
- Search queries and events (search_events).
- IP / request logs (Cloudflare edge, default).
- Geocoded addresses from submitted orgs (geocoded_addresses).

## Third parties (data leaves the site)
- Nominatim geocoding (no key, no account; query sent at submit/admin-edit, cached in D1).
- Cloudflare (hosting, edge logs).

## Retention
TO CONFIRM, set a window per data type. Run `/web:privacy`.

## Deletion path
TO CONFIRM, for each store above (live DB, backups, analytics, logs), document how a deletion request purges it. A delete that clears one table and leaves copies is not a delete. Run `/web:privacy`.
