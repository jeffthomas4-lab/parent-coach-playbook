# Regulatory risk: org_contacts

Pillar 2 of the Website Build Standard: any site holding personal data its subjects never submitted carries this file at the root, names the data, its sources, and the laws plausibly in play, and gets a lawyer's read before public launch or any outreach campaign that uses it. Written 2026-07-30, during the Pillars 2/3/5 audit that found this table was not yet in `DATA-MAP.md`.

## The data

`org_contacts` (D1 `PCD_OPS_DB`, migration `migrations-pcd-ops/0028_org_contacts.sql`, access layer `src/lib/org-contacts.ts`): full name, title, role, direct email, direct phone for staff at youth sports and activity organizations (camp directors, registrars, coaches, front-desk contacts). Full detail on the schema and the two-database PII boundary is in `CONTACT-DATA-MAP.md` at the project root; this file does not repeat it.

**Not live.** Migration 0028 is written and verified against SQLite but unapplied. Every write in `org-contacts.ts` fails closed ("no such table") until Jeff applies it. This file exists ahead of that, per `DATA-MAP.md`'s own rule that a new data collection gets documented before the feature ships, not after.

## Why this is "never asked" data

The person did not give PCD this information. Two agents compile it from an organization's own public web pages:

- `org-discovery-daily-worklist` (daily 9pm): general org email/phone from a contact-page URL found during search.
- `pcd-evergreen-daily` (daily 6am): the named-contact agent. Reads `/contact`, `/about`, `/staff`, `/coaches`, `/leadership` on the organization's own domain and writes named contacts with `is_public = 0`.

Both are scoped to a person's professional capacity at an organization, and `CONTACT-DATA-MAP.md` states the out-of-scope list explicitly: no minors, no parent volunteers or families from rosters or signup sheets, nothing behind a login, nothing from a third-party aggregator or scraped-email site. Only the organization's own public domain, only staff acting in that capacity. That scoping matters for the analysis below but does not remove this from "compiled record" territory — the individual staff member still never gave PCD their name, email, or phone directly.

## Laws plausibly in play

**State data-broker registries.** Several states (California, Vermont, Oregon, Texas among them) require registration for a business that knowingly collects and sells or licenses personal information of individuals with whom it has no direct relationship. PCD is not selling this data today and the CRM sync described in `CONTACT-DATA-MAP.md` is "not selected" — but the moment a CRM or outreach product built on this table exchanges money or a like-for-like data trade with a third party, the registry question is live. Confirm PCD's activity against each state's specific definition of "sale" and "broker" before that day, not after.

**CCPA/CPRA (California).** Business-contact information used for business-to-business communication has a narrower, though not absolute, carve-out for some CCPA obligations, but California residents named in this table still have the general rights the disclosure page already offers everyone (access, correction, deletion). The B2B carve-out does not remove the notice-at-collection question: because PCD collected this indirectly, not from the individual, a "notice to indirect sources" analysis is worth a specific look, since the standard first-party notice-at-collection mechanics assume the business is talking to the person who gave the data.

**GDPR-style "right to be informed" for indirectly collected data (if any EU/UK/EEA org staff end up in the table).** GDPR Article 14 requires specific notice within a bounded window when data is collected about a person from a source other than that person, including telling them where it came from. This table is scoped to US youth sports and activity organizations today, so EU exposure is unlikely but not architecturally prevented — nothing in the schema or the agents' scoping blocks a non-US organization's staff page from being scraped if one were ever added to the discovery pipeline.

**Washington My Health My Data Act.** Named because the standard calls out Washington health-adjacent data specifically. This table is role/title/contact data for camp and program staff, not health data, and the site's editorial content elsewhere already draws a hard line against storing anything health-related in user-submitted fields. Low relevance here, listed for completeness rather than as a live concern.

**FTC Section 5 (unfair or deceptive practice).** The practical gate, regardless of which state or federal statute technically applies: if `is_public` or a CRM export ever shows a contact's name in a place that organization's staff member would find surprising, or PCD cannot honor a `do_not_contact` suppression on request, that is the fact pattern regulators and plaintiffs' counsel actually act on. The suppression architecture (`setDoNotContact()`, checked before every write) is built for this reason and should stay the thing this file's lawyer review actually tests.

## What is already built to reduce exposure

- `is_public` defaults to 0 always when an agent writes; only a human can flip it (`upsertOrgContact()`'s own docstring: "an agent must never pass 1").
- `is_public = 1` never authorizes publishing `full_name`, `title`, or `notes` — only the channel (email/phone). Names do not syndicate. See `CONTACT-DATA-MAP.md`, "What may be published."
- `do_not_contact` is authoritative, PCD-owned, and checked before any write (`upsertOrgContact()` refuses to write to a suppressed row), so a re-discovering agent cannot resurrect an opt-out.
- Soft-delete only (`deleted_at`), never a hard `DELETE`, so a CRM sync can see a tombstone instead of silently losing track of a removal.
- Never staged to a file in this repo (git history is permanent) — D1 or discarded, per `CONTACT-DATA-MAP.md`.
- The `/trust/` page already carries a "Privacy: access, correction, deletion, or opt-out" category any org contact can use.

## The human gate

Before migration 0028 is applied to production, or before this table is used for any outreach beyond the current internal verification/CRM-prep purpose (whichever comes first): a lawyer's read of this file, confirming (1) which state data-broker registrations, if any, apply given PCD's actual planned use, (2) whether a GDPR Article-14-style indirect-collection notice is needed given the current US-only scoping, and (3) that the `is_public`/`do_not_contact` architecture above is sufficient or needs a stronger default (e.g., opt-out notice sent to a contact the first time they are added, rather than only on request). That review is Jeff's to schedule; a reviewer can only confirm this file exists, is current, and that opt-out works without an account and survives a re-import — all three are true as of this pass.

Reviewed: 2026-07-30 (Pillars 2/3/5 audit). Next review: before migration 0028 is applied, or in 6 months, whichever comes first.
