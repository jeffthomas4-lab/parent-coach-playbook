# Data Map: parent-coach-desk (parentcoachdesk.com)

Pillar 2 (Privacy) of the Website Build Standard. Every piece of personal data this app touches, where it lives, who it goes to, how long it is kept, and how it gets deleted. The privacy policy is written from this file. If it is not listed here, the policy must not claim it.

Last updated: 2026-07-30 (Pillars 2/3/5 audit: added `org_contacts`, Turnstile, Sentry-dark, the account-deletion waiver, and the `org_contacts` deletion path). Prior: 2026-06-27.

## Data home
D1 `activity-radar` (database_id 8cc3694a-26f8-4a56-b131-d5d3a68c49ef): tables include organizations, programs, camp_claims, camp_reviews, submitters, search_events, geocoded_addresses, domain_quality, org_claims, org_suggestions. R2 `activityradar-photos`: org logos and program photos. No KV.

One database, one map (updated 2026-07-13, ActivityRadar merge): this file now covers `org_claims` and `org_suggestions` too, folded in from ActivityRadar's own data map (`activityradar-archive/DATA-MAP.md`, archived, no longer maintained separately).

Added 2026-07-22: D1 `PCD_OPS_DB` (`parent-coach-desk-ops-production`), table `proof_inbox` (migration `migrations-pcd-ops/0026_proof_inbox.sql`). Not live yet: the migration is unapplied and the write route (`src/pages/api/proof-submit.ts`) is gated behind `PROOF_SUBMIT_ENABLED`, currently `false` in both `wrangler.jsonc` and `wrangler.production.jsonc`. Listed here ahead of launch per this file's own rule below. Other `PCD_OPS_DB` tables (`trust_cases`, `demand_events`, etc.) predate this session and are a separate open item, not covered by this update.

Added 2026-07-30 (Pillar 2/3/5 audit pass): D1 `PCD_OPS_DB`, table `org_contacts` (migration `migrations-pcd-ops/0028_org_contacts.sql`), access layer `src/lib/org-contacts.ts`. This is a named-human PII layer: full name, title, role, direct email, direct phone for staff at camp/program organizations. **Not live yet** — migration 0028 is written and verified against SQLite but unapplied (per that migration's own header and `CONTACT-DATA-MAP.md`'s Status table); every call in `org-contacts.ts` fails closed to a no-op ("no such table") until it lands. Full detail, the two-database PII boundary, what may be published, and the discovery agents that populate it live in `CONTACT-DATA-MAP.md` (companion file, project root) — read that file for anything beyond the summary below. **This is data about people who never submitted it themselves** (staff names/titles/emails compiled from an organization's own public contact/about/staff pages, not given to PCD by that person): see `REGULATORY-RISK.md` at the project root, required and written this pass per Pillar 2's rule on data subjects who never asked.

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
| Submitter name, testimonial text, optional context (role/city), optional link to where they posted it | `/proof` share-your-experience form | `PCD_OPS_DB` `proof_inbox` | None. Not live: see note under Data home. |
| Org staff full name, title, role, direct email, direct phone | Automated research against the organization's own public contact/about/staff/coaches/leadership pages, by the `org-discovery-daily-worklist` (daily) and `pcd-evergreen-daily` (daily) agents; never from the person directly | `PCD_OPS_DB` `org_contacts` | None. Not live: migration 0028 unapplied, see note under Data home. **This is compiled data — the person did not submit it.** See `REGULATORY-RISK.md`. |

## Third parties

| Vendor | Data received | Purpose | Sells data? |
|--------|--------------|---------|------------|
| Nominatim (OSM) | Org street address (no personal data) | Geocoding | No |
| Cloudflare | IP, request logs | Hosting, edge, Web Analytics | No |
| Cloudflare Turnstile | Browser/device signals needed to issue a challenge token (no PII stored by PCD) | Spam/bot prevention on the 4 public forms (camp submit, camp suggest, review submit, claim submit) | No — essential security function, loads with no consent gate per Pillar 3 |
| Kit (ConvertKit) | Email address | Newsletter delivery | No |
| Google Analytics 4 | Anonymized page-view data (country, referrer) | Traffic analytics | No (signals/ads disabled) |
| Sentry | Not live: `SENTRY_DSN`/`PUBLIC_SENTRY_DSN` unset in both `wrangler.jsonc` and `wrangler.production.jsonc`, code is wired but dark, sends nothing | Error tracking, when turned on | No — add a row with a confirmed answer before flipping the DSN on |

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
| Proof inbox submissions | Until reviewed (approved or rejected) + 12 months | Curation reference; only the curated quote/name/context a person approves is ever republished to the public `/proof` page |
| Org contacts (`org_contacts`) | While the organization relationship is active, reviewed by the weekly `pcd-camps-data-steward` coverage report; a row that goes `do_not_contact` is retained indefinitely as a suppression record only (name/email/phone kept solely so a future re-discovery pass can match and skip it — `upsertOrgContact()` refuses to write over a suppressed row) | Operational/CRM contact for camp verification and outreach; suppression must survive re-import, so the suppression record cannot itself expire on a timer the way an active contact should |

## Deletion path

A user who wants access, correction, restriction, export, or deletion should use the approved privacy contact. Each validated request receives a recorded jurisdiction, statutory deadline, internal target, extension/exception state, and accountable owner. The response period is not a universal 30-day deletion rule: GDPR requests generally use one month subject to lawful extensions and exceptions, and other laws or contracts may differ. Customer-facing language and the configured workflow require counsel review before launch. (The current documented contact is support@parentcoachdesk.com; routing and human receipt still require live proof.)

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
| D1 `proof_inbox` | Row for that submission | `DELETE FROM proof_inbox WHERE id = ?`. If the same content was already promoted to the published `src/data/proof.json`, that entry must be removed separately (it is a committed file, not a database row). |
| D1 `org_contacts` | Row for that person, everywhere it lives | `setDoNotContact()` sets `do_not_contact = 1` and drops `is_public` to 0 in the same write, so a suppressed contact comes off any public page immediately. Routine removal is `softDeleteOrgContact()` (`deleted_at` set, row excluded from every list query) rather than a hard `DELETE`, on purpose: a hard delete is invisible to the CRM sync described in `CONTACT-DATA-MAP.md`, a tombstone tells it to retract its own copy. A person who wants to stop being contacted uses the `/trust/` privacy-request path (category "Privacy: access, correction, deletion, or opt-out"); a person who wants the row gone entirely gets the same path with a hard-delete request, handled by an admin directly against `PCD_OPS_DB`. Never copied into `activity-radar` or written to a file in this repo — see `CONTACT-DATA-MAP.md`'s "Never staged to files" rule. |

A delete that clears one table and leaves copies is not a delete. The above covers every store. If a new data collection is added, this map must be updated before the feature ships.

## Self-service account deletion (Pillar 2 / Pillar 5)

Waived: this site has no user accounts. Newsletter signup, camp submissions, and (when enabled) reviews and claims are all single-shot forms tied to an email address, not a login. There is nothing to log into and nothing to delete from a "my account" screen. Deletion of any data tied to an email address goes through the `/trust/` privacy-request path in the table above, the same path every other store on this site uses.
