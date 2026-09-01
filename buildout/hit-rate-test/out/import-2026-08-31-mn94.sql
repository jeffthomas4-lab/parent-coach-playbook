-- import-2026-08-31-mn94.sql
-- Individual-search lane, manual pass (Cowork session, org-discovery-daily-worklist scheduled run).
-- Applied statement-by-statement through the D1 MCP against activity-radar (8cc3694a-26f8-4a56-b131-d5d3a68c49ef).
-- Every write is fill-blank-only and unclaimed-only; pre-write SELECT confirmed website_url IS NULL and is_claimed=0
-- for all twenty target ids before any UPDATE ran (verified 8/31).
-- State worked: MN, priority-94 (priority-96 pool already exhausted 2026-08-28/30, 0 additional writes possible).
-- Worklist: worklist-MN-2026-08-31.csv, 41 rows. 20 written, 3 held for review, 2 rejected on city mismatch
-- (known-pattern near-matches, same failure mode as the 2026-08-27 probe traps), 5 social-only, 11 not-found.

UPDATE organizations SET website_url='https://www.swmnvb.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-9c036df7-678c-50c1-a9d4-9375418543d7' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.nbvikingsjovolleyball.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-bca91fc9-bf01-5340-a9d1-19ebbf1a2708' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.twincitieselitevb.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-1fc5d9a1-90fa-5cd5-bccd-522ab09e943c' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://red-wing-youth-volleyball-association.sportngin.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-90b01dba-a119-5d08-9b78-24382bcae0f3' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.defenderssports.org/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-fb3db24d-094a-57fa-badd-5b799dfe33e8' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.rochesteryouthvolleyball.org/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-6de98e1f-b420-5219-b14b-8b73e9fd2d17' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.rayva.org/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-2d588f36-4734-5b60-b811-488d03abe929' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.rogersboysvolleyball.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-ab3eeac6-fdc4-5173-a9c8-bfd68799cc93' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.sportsengine.com/org/saint-charles-heat-youth-volleyball', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-3c7994c5-5b44-5c60-bf76-d73f11ff24b5' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.mnboyshighschoolvolleyball.com/mbvca', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-3d16594d-342f-5e7b-9447-5ff1cbd99b04' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.shakopeevolleyballassociation.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-33bca937-180e-5157-8d46-567f5a37a842' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.avbfire.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-d7966610-b6d7-55b7-a98a-e934a67c9caf' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://stpeterjovolleyball.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-47a37309-f0f2-539b-9d45-a945edbc1a1b' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://whitebearvolleyball.org/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-cee121e5-15e2-53e7-a02e-fa0ea7139d5a' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://highvoltagevc.org/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-acb57057-bcb8-5e0c-83b9-588260d64969' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.mncorevball.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-92455f22-5b55-5459-b71d-9167b1d5f1d4' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.mahtomedivolleyball.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-1cb10f42-f0d4-560a-9d27-3bc9ad25e73b' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://mnwarriorsvball.com/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-d8206530-75bf-5781-8913-ab6c9c54f17e' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.kms.k12.mn.us/kms-volleyball-association/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-a4142d99-6801-5145-8c9c-aba3d6d78027' AND (website_url IS NULL OR website_url='') AND is_claimed=0;
UPDATE organizations SET website_url='https://www.mnvbca.org/', last_enriched_at=datetime('now'), updated_at=datetime('now') WHERE id='org-40b0e774-fdf6-5a32-83af-30b05d863e97' AND (website_url IS NULL OR website_url='') AND is_claimed=0;

INSERT OR IGNORE INTO camp_scan_queue (id, org_id, website_url, status, created_at)
SELECT 'csq-'||id, id, website_url, 'pending', datetime('now') FROM organizations
WHERE id IN ('org-9c036df7-678c-50c1-a9d4-9375418543d7','org-bca91fc9-bf01-5340-a9d1-19ebbf1a2708','org-1fc5d9a1-90fa-5cd5-bccd-522ab09e943c','org-90b01dba-a119-5d08-9b78-24382bcae0f3','org-fb3db24d-094a-57fa-badd-5b799dfe33e8','org-6de98e1f-b420-5219-b14b-8b73e9fd2d17','org-2d588f36-4734-5b60-b811-488d03abe929','org-ab3eeac6-fdc4-5173-a9c8-bfd68799cc93','org-3c7994c5-5b44-5c60-bf76-d73f11ff24b5','org-3d16594d-342f-5e7b-9447-5ff1cbd99b04','org-33bca937-180e-5157-8d46-567f5a37a842','org-d7966610-b6d7-55b7-a98a-e934a67c9caf','org-47a37309-f0f2-539b-9d45-a945edbc1a1b','org-cee121e5-15e2-53e7-a02e-fa0ea7139d5a','org-acb57057-bcb8-5e0c-83b9-588260d64969','org-92455f22-5b55-5459-b71d-9167b1d5f1d4','org-1cb10f42-f0d4-560a-9d27-3bc9ad25e73b','org-d8206530-75bf-5781-8913-ab6c9c54f17e','org-a4142d99-6801-5145-8c9c-aba3d6d78027','org-40b0e774-fdf6-5a32-83af-30b05d863e97');

-- Rollback reference: to reverse, set website_url and last_enriched_at back to NULL for the twenty ids above
-- and delete the matching 'csq-org-...' rows from camp_scan_queue. No other field was touched.
