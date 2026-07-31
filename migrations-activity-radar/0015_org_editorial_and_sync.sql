-- Migration: 0015_org_editorial_and_sync
-- Gives ORGANIZATIONS the two things it lacks: an editorial/verification audit
-- trail, and the stable identifiers a downstream consumer needs to syndicate.
--
-- WHY
--
-- Migration 0013 built a full editorial layer on `programs` (pcd_status,
-- verified, reviewed_by, reviewed_at, review_notes, last_edited_at/by,
-- pcd_confidence). `organizations` got three columns: claim_paid_until,
-- logo_key, gallery_keys. So the org-checking pass being done by hand has no
-- org-level place to land. `organizations` has `record_status` and
-- `last_verified_at` and nothing else -- no reviewer, no notes, no reason code,
-- no way to tell a human verification apart from a script touching a timestamp.
--
-- The second half is syndication. SightSmash's public directory read model
-- (SightSmash `app/packages/db/src/migrations/214_directory_public_read_model.sql`)
-- ingests through `directory_source_records`, which keys on
-- (source_provider, source_record_key) and tracks `content_hash`,
-- `observed_at`, and `confidence`. To feed it, PCD needs to expose a stable
-- per-org key that survives a slug or name change, a content hash so unchanged
-- rows are skipped, and a publication state that maps onto the directory's
-- `publication_state` enum. None of those exist today.
--
-- PII BOUNDARY (ADR-046 / D-046)
--
-- No column added here holds a person. Named contacts -- full_name, title,
-- direct email, direct phone -- live in `org_contacts` in PCD_OPS_DB
-- (migration 0028 there), never in this database. `public_contact_label` below
-- is constrained by convention to non-personal role labels only. Keeping this
-- database free of human-mapped rows is what lets the whole graph syndicate
-- without a per-row privacy review.
--
-- Apply to remote (only after approval):
--   npx wrangler d1 execute activity-radar --remote --file=./migrations-activity-radar/0015_org_editorial_and_sync.sql

-- =====================================================================
-- organizations — editorial workflow, mirroring the 0013 program layer
-- =====================================================================

-- Org-level editorial status. Distinct from record_status (ActivityRadar
-- lifecycle) and from programs.pcd_status (per-offering review). An org can be
-- approved while one of its programs is still pending, and vice versa.
ALTER TABLE organizations ADD COLUMN pcd_status TEXT NOT NULL DEFAULT 'pending';
  -- 'pending' | 'approved' | 'rejected' | 'needs_info'

-- Manual verification flag. Set to 1 only when a human has confirmed the org is
-- real and its details are current. A script must never set this.
ALTER TABLE organizations ADD COLUMN verified INTEGER NOT NULL DEFAULT 0;

ALTER TABLE organizations ADD COLUMN reviewed_by TEXT;
ALTER TABLE organizations ADD COLUMN reviewed_at TEXT;
ALTER TABLE organizations ADD COLUMN review_notes TEXT;
ALTER TABLE organizations ADD COLUMN reject_reason_code TEXT;
  -- 'duplicate' | 'defunct' | 'dead-url' | 'unverifiable-address'
  -- | 'out-of-scope' | 'aggregator-source' | 'low-confidence' | 'spam' | 'other'

-- How the org was verified, so a later pass knows what evidence already exists.
ALTER TABLE organizations ADD COLUMN verification_method TEXT;
  -- 'website' | 'phone_call' | 'email_reply' | 'claim' | 'in_person' | 'other'

-- Admin edit audit trail. Mirrors programs.last_edited_at / last_edited_by,
-- which until now had no org-level counterpart, so org edits were untraceable.
ALTER TABLE organizations ADD COLUMN last_edited_at TEXT;
ALTER TABLE organizations ADD COLUMN last_edited_by TEXT;

-- Three-tier confidence label, matching programs.pcd_confidence. The existing
-- confidence_score (0-100 int) stays for ActivityRadar scoring; both coexist.
ALTER TABLE organizations ADD COLUMN pcd_confidence TEXT NOT NULL DEFAULT 'medium';
  -- 'high' | 'medium' | 'low'

-- Non-personal public contact label ONLY. "Camp Registrar", "Front Desk",
-- "Main Office". Never a person's name -- names live in org_contacts in
-- PCD_OPS_DB. This exists so a public listing can label the general org
-- email/phone without pulling PII into this database.
ALTER TABLE organizations ADD COLUMN public_contact_label TEXT;

-- =====================================================================
-- organizations — syndication and sync identifiers
-- =====================================================================

-- Stable external key for downstream consumers. Unlike `slug` (renamed when a
-- name changes) and unlike the internal `id` (an implementation detail), this
-- is the value published as `directory_source_records.source_record_key` on the
-- SightSmash side. Once assigned it never changes. Backfill with a generated
-- opaque value; do not derive it from the name.
ALTER TABLE organizations ADD COLUMN external_key TEXT;

-- Hash of the syndicated field set only. Lets an export skip unchanged rows and
-- lets the consumer compare against its stored content_hash. Excludes editorial
-- and sync columns so an internal review note does not look like a public change.
ALTER TABLE organizations ADD COLUMN content_hash TEXT;

-- Publication state for the public directory. Maps 1:1 onto
-- directory_organizations.publication_state ('draft','published','suspended',
-- 'retired'), with 'private' as the local-only default meaning "never exported".
-- Nothing syndicates until this is moved off 'private' deliberately.
ALTER TABLE organizations ADD COLUMN syndication_status TEXT NOT NULL DEFAULT 'private';
  -- 'private' | 'ready' | 'published' | 'suspended' | 'retired'

ALTER TABLE organizations ADD COLUMN syndicated_at TEXT;

-- CRM linkage, org side. Same field-ownership rule as org_contacts: PCD owns
-- identity and directory fields, the CRM owns relationship fields, and the two
-- write disjoint column sets so no merge conflict is possible.
ALTER TABLE organizations ADD COLUMN crm_external_id TEXT;
ALTER TABLE organizations ADD COLUMN crm_synced_at TEXT;

-- Soft delete. A hard DELETE is invisible to a downstream sync; a tombstone is
-- not. Consumers filter `deleted_at IS NULL`; the exporter emits a retraction.
ALTER TABLE organizations ADD COLUMN deleted_at TEXT;

-- =====================================================================
-- Indexes
-- =====================================================================

CREATE INDEX IF NOT EXISTS idx_org_pcd_status   ON organizations(pcd_status);
CREATE INDEX IF NOT EXISTS idx_org_verified     ON organizations(verified);
CREATE INDEX IF NOT EXISTS idx_org_reviewed_at  ON organizations(reviewed_at);

-- external_key must be unique where present. Added as an index, not as a column
-- constraint, because SQLite's ALTER TABLE ADD COLUMN cannot take UNIQUE.
CREATE UNIQUE INDEX IF NOT EXISTS idx_org_external_key
  ON organizations(external_key) WHERE external_key IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_org_crm_id
  ON organizations(crm_external_id) WHERE crm_external_id IS NOT NULL;

-- The export query: what is ready to syndicate, and what changed since.
CREATE INDEX IF NOT EXISTS idx_org_syndication
  ON organizations(syndication_status, updated_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_org_deleted_at
  ON organizations(deleted_at) WHERE deleted_at IS NOT NULL;
