-- import-2026-08-30.sql
-- Individual-search lane, manual pass (Cowork session, not the daily_discovery.py/import_results.py script).
-- Applied statement-by-statement through the D1 MCP against activity-radar (8cc3694a-26f8-4a56-b131-d5d3a68c49ef).
-- Every write is fill-blank-only and unclaimed-only; pre-write SELECT confirmed website_url IS NULL and is_claimed=0
-- for all seven target ids before any UPDATE ran. State worked: MN. Priority-96 pool re-confirmed (0 writes,
-- matches 2026-08-28 review disposition exactly). Priority-94 pool: 15 rows sampled, 7 written, 1 held on city
-- mismatch, 1 held on ambiguity, 6 not-found/social-only.

UPDATE organizations SET website_url='https://www.blainevolleyball.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-df6f55ef-0611-5f81-85eb-5100c7d720ae' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.byronyouthvolleyball.org/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-1dcbed92-af8b-5ede-a83a-d84f14992aed' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.epvolleyball.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-d661b8ea-2399-580a-839b-b5a5b7553194' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.edinavolleyball.org/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-23ee4574-75d8-5086-ba3c-1d0265d157be' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.elkrivervolleyball.org/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-3edc468d-1d71-537c-bfb4-62df1d52657f' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://farmingtonvolleyballclub.sportngin.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-46e86d9b-565b-5008-a4af-b6e492ec7a72' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://chisagoedgevb.org/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-7b3b97fb-46a4-5ff7-885c-3f2d18ac0a1e' AND (website_url IS NULL OR website_url='') AND is_claimed=0;

INSERT OR IGNORE INTO camp_scan_queue (id, org_id, website_url, status, created_at)
SELECT 'csq-'||id, id, website_url, 'pending', datetime('now') FROM organizations
WHERE id IN ('org-df6f55ef-0611-5f81-85eb-5100c7d720ae','org-1dcbed92-af8b-5ede-a83a-d84f14992aed','org-d661b8ea-2399-580a-839b-b5a5b7553194','org-23ee4574-75d8-5086-ba3c-1d0265d157be','org-3edc468d-1d71-537c-bfb4-62df1d52657f','org-46e86d9b-565b-5008-a4af-b6e492ec7a72','org-7b3b97fb-46a4-5ff7-885c-3f2d18ac0a1e');

-- Rollback reference: to reverse, set website_url back to NULL and remove the seven camp_scan_queue rows
-- (ids csq-org-df6f55ef-..., csq-org-1dcbed92-..., csq-org-d661b8ea-..., csq-org-23ee4574-...,
-- csq-org-3edc468d-..., csq-org-46e86d9b-..., csq-org-7b3b97fb-...). No other field was touched.
