-- Bound historical CRM projection by the immutable creation-time keyset.
-- The expression matches the adapter query exactly so rows created after the
-- activation boundary cannot turn a small page into an unbounded source scan.
CREATE INDEX idx_organizations_crm_backfill_created
  ON organizations(unixepoch(created_at), id);
