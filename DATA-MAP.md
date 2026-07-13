# Data Map: parent-coach-desk (parentcoachdesk.com)

Pillar 2 (Privacy) of the Website Build Standard. Every piece of personal data this app touches, where it lives, who it goes to, how long it is kept, and how it gets deleted. The privacy policy is written from this file. If it is not listed here, the policy must not claim it.

Last updated: 2026-06-27.

## Data home
D1 `activity-radar` (database_id 8cc3694a-26f8-4a56-b131-d5d3a68c49ef): tables include organizations, programs, camp_claims, camp_reviews, submitters, search_events, geocoded_addresses, domain_quality, org_claims, org_suggestions. R2 `activityradar-photos`: org logos and program photos. No KV.

One database, one map (updated 2026-07-13, ActivityRadar merge): this file now covers `org_claims` and `org_suggestions` too, folded in from ActivityRadar's own data map (`activityradar-archive/DATA-MAP.md`, archived, no longer maintained separately).

## Personal data collected

| Data | Collected at | Table / store | Sent to third party |
|------|-------------|---------------|-------------------|
| Submitter email | Camp submit form, claim form | `submitters`, `camp_claims` | None |
| Reviewer email (private) | Camp review form | `camp_reviews` | None |
| Reviewer display name (public) | Camp review form | `camp_reviews` | None |
| Claimant name, phone, org | Claim form | `camp_claims` | None |
| Search queries | Search bar | `search_events` | None |
| Org address (geocoded) | Submit / admin edit | `geocoded_addresses` | Nominatim (query only, no account) |
| Email newsletter signup | Newsletter form | Kit (third party) | Kit (ConvertKit) |
| IP address, country, request logs | All page loads | Cloudflare edge logs | None (Cloudflare infra) |
| GA4 aggregate traffic | All page loads (non-EU, non-DNT/GPC) | Google Analytics 4 | Google (anonymized, no signals) |
| Org-claim name, email, role, evidence text | `/claim` (org-side claim flow) | `org_claims` | None |
| Org-suggestion submitter email (optional) | `/suggest`-style org suggestion flow | `org_suggestions` | None |

## Third parties

| Vendor | Data received | Purpose | Sells data? |
|--------|--------------|---------|------------|
| Nominatim (OSM) | Org street address (no personal data) | Geocoding | No |
| Cloudflare | IP, request logs | Hosting, edge, Web Analytics | No |
| Kit (ConvertKit) | Email address | Newsletter delivery | No |
| Google Analytics 4 | Anonymized page-view data (country, referrer) | Traffic analytics | No (signals/ads disabled) |

## Retention

| Data | Retention window | Rationale |
|------|-----------------|-----------|
| Submitter emails | Until camp listing is removed or user requests deletion | Needed for follow-up on the listing |
| Reviewer emails | 3 years or until deletion request | Moderation reference; not published |
| Reviewer display name | Retained as long as review is published, then purged | Public attribution |
| Claimant contact info | Until claim is resolved and 1 year after | Dispute resolution window |
| Search events | **Conflict, not resolved this session: this file said 12 months; ActivityRadar's own map said 90 days.** No PII either way (no email or name in the row). Flagged for Jeff to confirm which is the real retention job and fix the code/doc to match — do not assume either figure is currently enforced. | Content planning signal; no PII tied to individual |
| Geocoded addresses | Until parent organization is removed | Cache; org data only |
| Cloudflare edge logs | 7 days (Cloudflare default) | Infra debugging |
| GA4 data | 14 months (GA4 default; shortened from 26) | Traffic analysis |
| Kit email list | Until unsubscribe | Newsletter function |
| Org-claim records | Until claim resolved + 12 months | Dispute/verification window |
| Org-suggestion records | Until reviewed + 12 months | Review reference |

## Deletion path

A user who wants their data removed should email parentcoachplaybook@gmail.com. We handle it within 30 days.

| Store | What gets purged | How |
|-------|-----------------|-----|
| D1 `submitters` | Row for that email | `DELETE FROM submitters WHERE email = ?` |
| D1 `camp_claims` | Rows for that email | `DELETE FROM camp_claims WHERE email = ?` |
| D1 `camp_reviews` | Review rows; display name set to `[removed]` if the review stays up for integrity | Manual admin action |
| R2 `activityradar-photos` | Photos uploaded by that operator | Manual deletion from R2 dashboard |
| Kit | Email removed from list | Kit unsubscribe or admin delete |
| GA4 | Deletion request via GA4 User Deletion API (anonymized, no user-level IDs stored; effectively a no-op but submitted for record) | Google's user deletion tool |
| Cloudflare edge logs | Self-purge in 7 days; no action needed | Automatic |
| Search events | Rows contain no email; cannot be tied to individual after the fact; no deletion path needed | N/A |
| D1 `org_claims` | Row for that claim | `DELETE FROM org_claims WHERE id = ?` |
| D1 `org_suggestions` | Row for that suggestion | `DELETE FROM org_suggestions WHERE id = ?` |

A delete that clears one table and leaves copies is not a delete. The above covers every store. If a new data collection is added, this map must be updated before the feature ships.
