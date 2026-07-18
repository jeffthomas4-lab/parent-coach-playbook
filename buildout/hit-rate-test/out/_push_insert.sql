INSERT OR IGNORE INTO camp_scan_queue (id, org_id, website_url, status, created_at)
SELECT 'csq-' || v.id, v.id, v.url, 'pending', '2026-07-18 04:21:18'
FROM (SELECT column1 AS id, column2 AS url FROM (VALUES
('org-441e04a0-e012-5ac0-ba8b-1e9a2e41c0bb','https://www.washooting.com'),
('org-906f8f58-3d4b-577f-a6cf-1ff814f37460','https://www.hoops4him.org'),
('org-d72b6cbd-dfe6-543d-8cee-9d2c525ec8ee','https://www.imagodanceacademy.com'),
('org-ada737d2-7d04-5964-a65c-61cb3c03e80a','https://svpball.com'),
('org-d587e3e1-340c-5eb9-8413-e9a17a663dfb','https://www.washingtonlittleguy.com'),
('org-e508a96e-58e2-5dba-bfa5-f2e62cb63713','https://www.soccerinthepark.org'),
('org-4875a29d-8cb7-5e51-9499-1d7f50c9de01','https://www.auburnravens.com'),
('org-c67fa49f-d862-557d-9bd1-2f3df5397c66','https://www.pnwdancefoundation.com'),
('org-e9d4d5ed-e89c-5b8e-8ac6-f34ad9043acc','https://fcoly.com'),
('org-9facd916-9ed4-5205-aba4-5258ae86f057','https://bellevuecricketclub.com'),
('org-1ef4c54b-693a-5210-a0f2-1a50d456843c','https://www.lincoln-lacrosse.com'),
('org-d11c55fa-ab8e-52e3-9182-631ba211da70','https://www.rentonrowingcenter.org'),
('org-54600997-3894-5fd7-85a4-e3daf22ac755','http://swimlsc.com')
)) AS v
WHERE EXISTS (SELECT 1 FROM organizations WHERE organizations.id = v.id);