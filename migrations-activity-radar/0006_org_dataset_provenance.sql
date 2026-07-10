-- Migration: 0006_org_dataset_provenance
-- Adds EIN and dataset provenance to organizations so bulk public-data imports
-- (IRS EO BMF first) can be deduplicated and traced back to their source.
--
-- ein            : IRS Employer Identification Number. Unique per nonprofit.
--                  The dedup/merge key for IRS-sourced orgs.
-- source_dataset : which bulk dataset an org came from, e.g. 'irs_eo_bmf'.
--                  NULL for camp-migrated and claimed orgs.
--
-- record_source already exists ('scraped'|'claimed'|'manual'); imports use the
-- value 'import' to keep the government-dataset coverage layer distinct from
-- web-scraped records (cleaner legal provenance, per OS 05-09).

ALTER TABLE organizations ADD COLUMN ein TEXT;
ALTER TABLE organizations ADD COLUMN source_dataset TEXT;

CREATE INDEX idx_org_ein            ON organizations(ein);
CREATE INDEX idx_org_source_dataset ON organizations(source_dataset);
