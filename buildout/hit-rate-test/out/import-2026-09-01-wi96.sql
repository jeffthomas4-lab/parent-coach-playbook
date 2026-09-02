-- import-2026-09-01-wi96.sql
-- Individual-search lane, manual pass (Cowork session, org-discovery-daily-worklist scheduled run).
-- Applied statement-by-statement through the D1 MCP against activity-radar (8cc3694a-26f8-4a56-b131-d5d3a68c49ef).
-- Every write is fill-blank-only and unclaimed-only; pre-write SELECT confirmed website_url IS NULL and is_claimed=0
-- for all fourteen target ids before any UPDATE ran (verified 9/1).
-- State worked: MN closed out (priority-96 fully attempted 2026-08-28/30 all held; priority-94 fully attempted
-- 2026-08-31, 21 rows remain blank as held/social/not_found dead-ends). Moved to next state in the worst-first
-- queue: WI. Worklist: worklist-WI-2026-09-01.csv, 20 rows, priority 96. 14 written, 1 held for review
-- (name-variance ambiguity), 3 rejected on city mismatch (same failure mode as the 2026-08-27 MN probe traps),
-- 2 social-only.

UPDATE organizations SET website_url='https://www.ozaukeevolleyballclub.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-7a86fe99-acfa-5c1f-a4a9-535bf6cf7006' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='http://westsideslamvolleyball.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-faa88bd8-4b70-5f65-a512-0cd38d03277d' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.lakecountryboysvbc.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-0115c1a8-6079-5a9d-8a46-5d3f9b848c90' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://elkhornvolleyballclub.sportngin.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-bd519319-42e0-5bef-a39a-b222b71a5c31' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.iamvolleyball.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-f7cb2de7-a2f7-5b82-8ff9-d3f522bc4627' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://howardsuamicoinfernovbc.sport/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-c6b8abeb-f387-5575-8841-c58c60961697' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.heatvbc.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-d5386775-e1f7-560a-970c-5d6d319774ce' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.stcroixselect.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-ffc3ac18-535f-5527-9706-137547ce2cd6' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.hartfordvbc.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-0f976e41-0b32-537f-ab07-9db9c99f4506' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.rockvbc.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-66ddac65-ed41-51f3-8034-e2d5db87ed54' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.starlings.org/madison', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-a556aff0-901f-5ca6-849a-54079f824701' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.lakeshorestormvolleyball.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-399c78df-9aa5-5314-a227-7f134dfb5469' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.centralwvbc.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-ac8d8d6f-5660-5e2d-96a2-4d8b4b4ad0a2' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.milwaukeesting.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-ea2c4387-5fe4-57d1-a154-0e8ce2777b17' AND (website_url IS NULL OR website_url='') AND is_claimed=0;

INSERT OR IGNORE INTO camp_scan_queue (id, org_id, website_url, status, created_at)
SELECT 'csq-'||id, id, website_url, 'pending', datetime('now') FROM organizations
WHERE id IN ('org-7a86fe99-acfa-5c1f-a4a9-535bf6cf7006','org-faa88bd8-4b70-5f65-a512-0cd38d03277d','org-0115c1a8-6079-5a9d-8a46-5d3f9b848c90','org-bd519319-42e0-5bef-a39a-b222b71a5c31','org-f7cb2de7-a2f7-5b82-8ff9-d3f522bc4627','org-c6b8abeb-f387-5575-8841-c58c60961697','org-d5386775-e1f7-560a-970c-5d6d319774ce','org-ffc3ac18-535f-5527-9706-137547ce2cd6','org-0f976e41-0b32-537f-ab07-9db9c99f4506','org-66ddac65-ed41-51f3-8034-e2d5db87ed54','org-a556aff0-901f-5ca6-849a-54079f824701','org-399c78df-9aa5-5314-a227-7f134dfb5469','org-ac8d8d6f-5660-5e2d-96a2-4d8b4b4ad0a2','org-ea2c4387-5fe4-57d1-a154-0e8ce2777b17');

-- Rollback reference: to reverse, set website_url and last_enriched_at back to NULL for the fourteen ids above
-- and delete the matching 'csq-org-...' rows from camp_scan_queue. No other field was touched.
