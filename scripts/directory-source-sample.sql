-- READ ONLY. Deterministic release sample across source domains.
-- Never add contact, submitter, or private review fields to this query.
WITH ranked AS (
  SELECT p.id, p.slug, p.name, p.activity_category,
    p.age_min, p.age_max, p.session_start_date, p.session_end_date,
    p.price_text, p.registration_url, p.source_domain,
    p.reviewed_at, p.url_last_checked_at, o.city, o.state,
    ROW_NUMBER() OVER (PARTITION BY p.source_domain ORDER BY p.id) AS source_rank
  FROM programs p
  JOIN organizations o ON o.id = p.organization_id
  WHERE p.pcd_status = 'approved'
    AND p.session_end_date >= date('now')
    AND p.registration_url LIKE 'https://%'
    AND p.age_min IS NOT NULL AND p.age_max IS NOT NULL
    AND p.session_start_date IS NOT NULL AND p.session_end_date IS NOT NULL
    AND p.source_domain IS NOT NULL
)
SELECT id, slug, name, activity_category, age_min, age_max,
  session_start_date, session_end_date, price_text, registration_url,
  source_domain, reviewed_at, url_last_checked_at, city, state
FROM ranked
WHERE source_rank = 1
ORDER BY source_domain
LIMIT 12;
