-- Migration: 0028_org_contacts
-- The named-human contact layer for organizations. This is the table that did
-- not exist: before this, there was nowhere in the estate to store a person's
-- name against an organization. `organizations.email` / `organizations.phone`
-- and `programs.contact_email` / `programs.contact_phone` hold a channel, never
-- a person, and `org_claims` / `camp_claims` only fill when somebody claims
-- their own listing.
--
-- WHY THIS LIVES IN PCD_OPS_DB AND NOT IN activity-radar
--
-- A contact name, direct email, direct phone, and title is PII mapped to a
-- specific human. ADR-046 (SightSmash D-046, "people-data boundary") holds that
-- PII/human-mapped tables live in an operational or per-tenant database and
-- never in the shared `activity-radar` graph. PCD_OPS_DB is already the estate's
-- PII home: customer identity and tenancy (0016), owner claims and disputes
-- (0017, 0020), invitations and recovery (0018), the privacy-request lifecycle
-- (0015, 0021). This table belongs with those, not with the directory data.
--
-- The payoff is not compliance theatre. Keeping `activity-radar` free of
-- human-mapped rows is what makes it safe to syndicate wholesale to the
-- SightSmash public directory (`directory_organizations` /
-- `directory_source_records`, SightSmash migration 214) without a per-row
-- privacy review. The private layer stays here; the public layer stays there.
--
-- CROSS-DATABASE REFERENCE — READ BEFORE WRITING QUERIES
--
-- `organization_id` points at `organizations.id` in the *`activity-radar`*
-- database (binding `DB`, id 8cc3694a-26f8-4a56-b131-d5d3a68c49ef). This table
-- is in `parent-coach-desk-ops-production` (binding `PCD_OPS_DB`). D1 has no
-- cross-database joins and no cross-database foreign keys, so:
--   * there is deliberately NO `FOREIGN KEY` clause on `organization_id`;
--     nothing at the database level enforces that the org exists.
--   * every read is two queries and a join in the Worker: fetch org rows from
--     `DB`, collect ids, then `SELECT ... FROM org_contacts WHERE
--     organization_id IN (...)` against `PCD_OPS_DB`.
--   * orphans are possible. `scripts/` should carry a reconciliation job that
--     reports contacts whose `organization_id` no longer resolves. Do not add a
--     cascade delete; soft-delete via `deleted_at` instead so the CRM sync can
--     see the tombstone.
--
-- This is the cost of the boundary and it is the intended trade. Contact lookup
-- is an admin and CRM path, never a hot public path. The public camp page reads
-- `COALESCE(p.contact_email, o.email)` out of `activity-radar` exactly as it
-- does today and never touches this table.
--
-- SYNDICATION RULE
--
-- `is_public = 1` means the *channel* (email/phone) on this row may appear on a
-- public listing. It never authorizes publishing `full_name`, `title`, or
-- `notes`. Names do not syndicate. If a public listing needs a human-readable
-- contact label, use `organizations.public_contact_label` in activity-radar
-- (migration 0015 there), which is constrained to non-personal role labels
-- ("Camp Registrar", "Front Desk").
--
-- STATUS: additive and intentionally unapplied, same convention as 0023-0027 in
-- this directory. Do not apply remotely and do not point production code at it
-- as a hard dependency until reviewed and approved per this directory's README.
-- No route, feature flag, or UI is enabled by this file.

CREATE TABLE IF NOT EXISTS org_contacts (
  id                  TEXT PRIMARY KEY,

  -- Soft reference to activity-radar `organizations.id`. No FK: cross-database.
  organization_id     TEXT NOT NULL,
  -- Optional narrowing to one offering when the contact is program-specific
  -- (e.g. a single camp's registrar). Soft reference to `programs.id`.
  program_id          TEXT,

  -- ---- The person -------------------------------------------------------
  -- full_name is the whole reason this table exists. Stored as one field on
  -- purpose: real-world contact names do not split cleanly into given/family
  -- and a bad split is worse than no split.
  full_name           TEXT CHECK (full_name IS NULL OR length(full_name) BETWEEN 1 AND 160),
  title               TEXT CHECK (title IS NULL OR length(title) <= 160),
  role                TEXT NOT NULL DEFAULT 'unknown' CHECK (role IN (
                        'owner', 'director', 'registrar', 'coach',
                        'admin', 'marketing', 'billing', 'media', 'unknown'
                      )),

  -- ---- The channels -----------------------------------------------------
  email               TEXT CHECK (email IS NULL OR length(email) <= 320),
  phone               TEXT CHECK (phone IS NULL OR length(phone) <= 40),
  phone_ext           TEXT CHECK (phone_ext IS NULL OR length(phone_ext) <= 12),
  preferred_channel   TEXT CHECK (preferred_channel IS NULL OR preferred_channel IN ('email', 'phone', 'form', 'mail')),

  -- ---- Placement --------------------------------------------------------
  -- is_primary: the one contact to use for this org. Enforced one-per-org by a
  -- partial unique index below (scoped to live rows).
  is_primary          INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0, 1)),
  -- is_public: the syndication gate. See SYNDICATION RULE above. Channels only.
  is_public           INTEGER NOT NULL DEFAULT 0 CHECK (is_public IN (0, 1)),

  -- ---- Contactability ---------------------------------------------------
  -- Suppression flag. The CRM must treat this as authoritative and never send.
  -- Set by unsubscribe, bounce, complaint, or an explicit privacy request
  -- (see 0015_privacy_request_lifecycle).
  do_not_contact      INTEGER NOT NULL DEFAULT 0 CHECK (do_not_contact IN (0, 1)),
  do_not_contact_at   TEXT,
  do_not_contact_reason TEXT CHECK (do_not_contact_reason IS NULL OR do_not_contact_reason IN (
                        'unsubscribed', 'hard_bounce', 'complaint',
                        'privacy_request', 'manual', 'other'
                      )),

  -- ---- Provenance -------------------------------------------------------
  -- Where this contact came from. 'manual_verification' is the org-checking
  -- pass being done by hand; that pass is the highest-trust source in the set.
  source              TEXT NOT NULL DEFAULT 'manual_verification' CHECK (source IN (
                        'manual_verification', 'website', 'claim', 'import',
                        'inbound_email', 'enrichment', 'referral', 'other'
                      )),
  source_url          TEXT CHECK (source_url IS NULL OR length(source_url) <= 2048),
  -- Free-text confidence is a trap; three tiers matching programs.pcd_confidence.
  confidence          TEXT NOT NULL DEFAULT 'medium' CHECK (confidence IN ('high', 'medium', 'low')),

  verified_by         TEXT,            -- admin email who confirmed it
  verified_at         TEXT,            -- ISO 8601
  verification_method TEXT CHECK (verification_method IS NULL OR verification_method IN (
                        'website', 'phone_call', 'email_reply', 'claim', 'in_person', 'other'
                      )),

  notes               TEXT CHECK (notes IS NULL OR length(notes) <= 4000),

  -- ---- CRM sync ---------------------------------------------------------
  -- Field-level ownership, not a merge. PCD owns everything above this block:
  -- identity, channels, provenance, verification. The CRM owns everything in
  -- this block and writes nothing else. Because the two sides write disjoint
  -- column sets, "bidirectional" needs no conflict resolution -- each side
  -- pushes its own columns and takes the other's as read-only.
  crm_external_id     TEXT,            -- the CRM's own id for this contact
  crm_synced_at       TEXT,            -- last time PCD pushed to the CRM
  crm_updated_at      TEXT,            -- last time the CRM wrote back here
  crm_status          TEXT,            -- CRM-owned pipeline state
  crm_owner           TEXT,            -- CRM-owned assignee
  crm_last_touch_at   TEXT,            -- CRM-owned last outreach timestamp

  -- Change detection for sync. Hash of the PCD-owned fields only, so a CRM
  -- write-back does not look like a PCD change and bounce back out again.
  content_hash        TEXT,

  -- ---- Lifecycle --------------------------------------------------------
  -- Soft delete. A hard DELETE is invisible to a downstream sync; a tombstone
  -- is not. Every consumer must filter `deleted_at IS NULL`.
  deleted_at          TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now')),

  -- Table-level constraint. Must come after every column definition: SQLite
  -- stops accepting column definitions once the first table constraint appears.
  -- A row with neither a name nor any channel is noise. Reject it here rather
  -- than discovering it at export time.
  CHECK (full_name IS NOT NULL OR email IS NOT NULL OR phone IS NOT NULL)
);

-- Primary lookup: all live contacts for one org.
CREATE INDEX IF NOT EXISTS idx_org_contacts_org
  ON org_contacts(organization_id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_org_contacts_program
  ON org_contacts(program_id) WHERE program_id IS NOT NULL AND deleted_at IS NULL;

-- Exactly one primary contact per live org.
CREATE UNIQUE INDEX IF NOT EXISTS idx_org_contacts_one_primary
  ON org_contacts(organization_id) WHERE is_primary = 1 AND deleted_at IS NULL;

-- Same person, same org, entered twice is the most likely dedupe failure.
CREATE UNIQUE INDEX IF NOT EXISTS idx_org_contacts_org_email
  ON org_contacts(organization_id, email) WHERE email IS NOT NULL AND deleted_at IS NULL;

-- CRM sync: find by the CRM's id, and find what needs pushing.
CREATE UNIQUE INDEX IF NOT EXISTS idx_org_contacts_crm_id
  ON org_contacts(crm_external_id) WHERE crm_external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_org_contacts_sync
  ON org_contacts(crm_synced_at, updated_at);

-- Suppression checks before any send.
CREATE INDEX IF NOT EXISTS idx_org_contacts_dnc
  ON org_contacts(do_not_contact) WHERE do_not_contact = 1;

-- The syndication query: public channels only.
CREATE INDEX IF NOT EXISTS idx_org_contacts_public
  ON org_contacts(organization_id, is_public) WHERE is_public = 1 AND deleted_at IS NULL;
