# Contact data map

Where organization contact data lives, what may be published, and how it reaches the SightSmash public directory and a future CRM. Companion to `DATA-MAP.md`. Written 2026-07-30. `org_contacts` is compiled data — the staff member never submitted it to PCD directly — so `REGULATORY-RISK.md` at the project root also covers this table; read that file for the data-broker/indirect-collection analysis and the pre-launch lawyer gate.

## The two-database split

| | `activity-radar` | `parent-coach-desk-ops-production` |
|---|---|---|
| Binding | `DB` | `PCD_OPS_DB` |
| database_id | `8cc3694a-26f8-4a56-b131-d5d3a68c49ef` | `b38d5f37-54df-4e0f-9706-023edc12c7fe` |
| Holds | the directory graph: `organizations`, `programs` | operational + PII state, including `org_contacts` |
| Human-mapped rows | none, by rule | yes, this is the PII home |
| Syndicates to SightSmash | yes | never |

The rule: **a channel lives in `activity-radar`, a person lives in `PCD_OPS_DB`.**

`organizations.email`, `organizations.phone`, `programs.contact_email`, `programs.contact_phone` are general org channels. They are already published on camp pages today via `COALESCE(p.contact_email, o.email)` and they carry no name.

`org_contacts` holds the named human: `full_name`, `title`, `role`, direct `email`/`phone`. Migration `migrations-pcd-ops/0028_org_contacts.sql`, access layer `src/lib/org-contacts.ts`.

This is not paperwork. Keeping `activity-radar` free of human-mapped rows is what lets the whole graph be exported to a public directory without reviewing it row by row. The moment a person's name is in that database, every export becomes a privacy decision.

### The cost

D1 has no cross-database joins and no cross-database foreign keys. So `org_contacts.organization_id` is a soft reference with no FK, orphans are possible, and every contact read is two queries joined in the Worker. Acceptable because contact lookup is an admin and CRM path, never a hot public path. The public camp page never touches `org_contacts`.

A reconciliation job should report contacts whose `organization_id` no longer resolves. Never cascade-delete; soft-delete via `deleted_at` so a downstream sync sees a tombstone.

## The two contact layers, and the bug they fixed

The public page shows `COALESCE(programs.contact_email, organizations.email)`. The admin edit form used to bind a single input to that *resolved* value, so saving an untouched form copied the org's email down into the program's override column, quietly converting a shared org contact into a per-program one and making the org value impossible to correct from the UI. Meanwhile `updateCamp` never wrote org-level contact at all, so `organizations.email`/`phone` were set at first insert and never corrected again.

Both are fixed. `Camp` now exposes `program_contact_email`/`program_contact_phone` and `org_email`/`org_phone` as separate raw values, and the admin form edits them as the two distinct things they are.

## What may be published

`org_contacts.is_public = 1` means **the channel on that row may appear on a public listing.** It never authorizes publishing `full_name`, `title`, or `notes`. Names do not syndicate.

Where a public listing needs a human-readable contact label, use `organizations.public_contact_label` (migration `migrations-activity-radar/0015_org_editorial_and_sync.sql`), which is constrained by convention to non-personal role labels: "Camp Registrar", "Front Desk", "Main Office".

Agents write `is_public = 0` always. Only a human flips it. `setDoNotContact()` clears `is_public` as a side effect, so a suppressed contact cannot stay on a public page.

## Provenance and verification

Before 0015, `organizations` had `record_status` and `last_verified_at` and nothing else, so a human verification pass was indistinguishable from a script touching a timestamp. It now carries the same editorial layer `programs` got in 0013: `pcd_status`, `verified`, `reviewed_by`, `reviewed_at`, `review_notes`, `reject_reason_code`, `verification_method`, `last_edited_at`, `last_edited_by`, `pcd_confidence`.

`verified = 1` means a human confirmed it. A script must never set it.

Each `org_contacts` row carries its own `source`, `source_url`, `confidence`, `verified_by`, `verified_at`, `verification_method`.

## Syndication to the SightSmash public directory

SightSmash's read model already exists: `directory_organizations`, `directory_locations`, `directory_programs`, `directory_source_records` (SightSmash `app/packages/db/src/migrations/214_directory_public_read_model.sql`), in the `sightsmash-global` D1. It ingests through `directory_source_records`, keyed on `(source_provider, source_record_key)` with `content_hash`, `observed_at`, and `confidence`.

PCD becomes `source_provider = 'pcd'`. The mapping:

| PCD (`organizations`) | SightSmash |
|---|---|
| `external_key` | `directory_source_records.source_record_key` |
| `content_hash` | `directory_source_records.content_hash` |
| `syndication_status` | `directory_organizations.publication_state` |
| `last_verified_at` | `directory_source_records.observed_at` |
| `pcd_confidence` | `directory_source_records.confidence` |

`external_key` is stable forever once assigned. `slug` is not (it is regenerated on rename) and `id` is an implementation detail, so neither is safe to publish as a join key. `scripts/backfill_external_keys.py` derives it deterministically from the row id, so it is idempotent and needs no state file.

`content_hash` covers the syndicated field set only. Editorial columns are excluded on purpose, so an internal review note does not look like a public change and force a pointless re-publish.

`syndication_status` defaults to `'private'`, meaning never exported. Nothing syndicates until that is moved off `'private'` deliberately.

**Open blocker.** No wrangler config in the SightSmash repo binds `activity-radar`, despite `PRODUCT-BINDER.md` §19 claiming the shared graph runs there. That is SightSmash open item H-053 / item 122. The schema on both sides is now ready; the wiring is not. Resolve H-053 before building the exporter.

## CRM sync

Field-level ownership, not a merge. The two sides write **disjoint column sets**, so "bidirectional" needs no conflict resolution — each pushes its own columns and treats the other's as read-only.

- **PCD owns:** identity, channels, provenance, verification, `is_public`, `do_not_contact`.
- **CRM owns:** `crm_status`, `crm_owner`, `crm_last_touch_at`.
- **Shared plumbing:** `crm_external_id` (the CRM's id), `crm_synced_at` (last PCD push), `crm_updated_at` (last CRM write-back), `content_hash` (hashed over PCD-owned fields only, so a CRM write-back does not look like a PCD change and bounce back out).

`do_not_contact` is authoritative and PCD-owned. The CRM must honor it and never send. It is set by unsubscribe, hard bounce, complaint, or a privacy request (`0015_privacy_request_lifecycle`), and the daily `pcd-deletion-monitor` is the human-gated path that acts on those. `upsertOrgContact()` refuses to write to a suppressed row, so a re-discovering agent cannot resurrect an opt-out.

## Agents

| Agent | Contact role |
|---|---|
| `org-discovery-daily-worklist` (daily 9pm) | Captures general org email/phone and a contact-page URL for free during search. Writes them to `organizations.email`/`phone` guarded to only ever fill a blank, never on a claimed org. |
| `pcd-evergreen-daily` (daily 6am) | The contact-capture agent. Reads `/contact`, `/about`, `/staff`, `/coaches`, `/leadership` and writes named contacts to `org_contacts` with `is_public=0`. Gated on the table existing; if 0028 is unapplied it discards the data and reports the count rather than writing PII to disk. |
| `pcd-camps-data-steward` (weekly Thu) | Reports contact coverage and flags flat week-over-week coverage as a silent extraction failure. Counts only, never names. |

**Never staged to files.** Contact PII is never written to a JSONL, CSV, or report file in this repo. The repo is committed to git and git history is permanent, which would make the 30-day deletion SLA in `DATA-MAP.md` impossible to honor. It goes to D1 or it is discarded.

**Out of scope for every agent:** any minor; parent volunteers or families from rosters, signup sheets, or PDFs; anything behind a login or member directory; anything from a third-party aggregator or scraped-email site. Only the organization's own public domain, only staff in their professional capacity.

## Status

| Item | State |
|---|---|
| `migrations-pcd-ops/0028_org_contacts.sql` | Written, verified against SQLite, **unapplied** (needs approval per that directory's README) |
| `migrations-activity-radar/0015_org_editorial_and_sync.sql` | Written, verified against SQLite, **unapplied** |
| `src/lib/org-contacts.ts` | Written, defensive, safe before 0028 lands |
| Admin org-level contact write path + UI | Fixed, uses only columns that exist today |
| `scripts/backfill_external_keys.py` | Written, verified idempotent and deterministic |
| Agents capturing contacts | Updated |
| Exporter to `directory_source_records` | Not started, blocked on SightSmash H-053 |
| CRM | Not selected |
| `DATA-MAP.md` | Updated 2026-07-30 with `org_contacts`, its retention, and its deletion path |
| `REGULATORY-RISK.md` | Written 2026-07-30; lawyer read still owed before migration 0028 is applied |
