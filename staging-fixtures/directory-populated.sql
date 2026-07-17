-- Synthetic, non-production data for the dedicated Parent Coach Desk staging
-- directory. It is intentionally small, fictional, and limited to customer
-- journey coverage. Do not substitute production data or real contact details.

INSERT INTO zip_centroids (zip, latitude, longitude, city, state) VALUES
  ('98101', 47.6101, -122.3344, 'Seattle', 'WA'),
  ('98109', 47.6301, -122.3476, 'Seattle', 'WA'),
  ('98122', 47.6108, -122.3026, 'Seattle', 'WA');

INSERT INTO organizations (
  id, slug, name, organization_type, website_url, email, phone,
  address, city, state, zip, latitude, longitude, description,
  record_source, record_status, confidence_score, created_at, updated_at
) VALUES
  ('fixture-org-soccer', 'fixture-soccer-club', 'PCD Fixture Soccer Club', 'other',
   'https://example.invalid/fixture-soccer', 'fixture-soccer@example.invalid', '206-555-0101',
   '100 Fixture Way', 'Seattle', 'WA', '98101', 47.6101, -122.3344,
   'Fictional organization for staging journey validation only.', 'manual', 'active', 100,
   '2026-07-16T00:00:00.000Z', '2026-07-16T00:00:00.000Z'),
  ('fixture-org-basketball', 'fixture-basketball-club', 'PCD Fixture Basketball Club', 'other',
   'https://example.invalid/fixture-basketball', 'fixture-basketball@example.invalid', '206-555-0102',
   '200 Fixture Way', 'Seattle', 'WA', '98109', 47.6301, -122.3476,
   'Fictional organization for staging journey validation only.', 'manual', 'active', 100,
   '2026-07-16T00:00:00.000Z', '2026-07-16T00:00:00.000Z'),
  ('fixture-org-swim', 'fixture-swim-club', 'PCD Fixture Swim Club', 'other',
   'https://example.invalid/fixture-swim', 'fixture-swim@example.invalid', '206-555-0103',
   '300 Fixture Way', 'Seattle', 'WA', '98122', 47.6108, -122.3026,
   'Fictional organization for staging journey validation only.', 'manual', 'active', 100,
   '2026-07-16T00:00:00.000Z', '2026-07-16T00:00:00.000Z');

INSERT INTO programs (
  id, organization_id, slug, name, program_type, activity_category, description,
  age_min, age_max, skill_level, session_start_date, session_end_date, price_text,
  day_or_overnight, lunch_included, aftercare_available, availability_status,
  registration_url, registration_deadline, schedule_text, contact_email, contact_phone,
  record_source, record_status, confidence_score, source_domain, pcd_status,
  submitted_by_email, submitted_at, reviewed_by, reviewed_at, pcd_confidence,
  awaiting_review, created_at, updated_at
) VALUES
  ('fixture-program-soccer', 'fixture-org-soccer', 'fixture-soccer-summer-camp',
   'PCD Fixture Soccer Summer Camp', 'camp', 'soccer',
   'A fictional open day camp for populated directory and filter testing.', 8, 12, 'all',
   '2026-08-10', '2026-08-14', '$125 fixture price', 'day', 1, 1, 'open',
   'https://example.invalid/fixture-soccer/register', '2026-08-01', 'Mon-Fri 9am-3pm',
   'fixture-soccer@example.invalid', '206-555-0101', 'manual', 'active', 100,
   'example.invalid', 'approved', 'fixture@example.invalid', '2026-07-16T00:00:00.000Z',
   'staging-fixture', '2026-07-16T00:00:00.000Z', 'high', 0,
   '2026-07-16T00:00:00.000Z', '2026-07-16T00:00:00.000Z'),
  ('fixture-program-basketball', 'fixture-org-basketball', 'fixture-basketball-league',
   'PCD Fixture Basketball League', 'league', 'basketball',
   'A fictional full league used to validate the hidden-by-default toggle.', 10, 14, 'intermediate',
   '2026-09-01', '2026-10-31', '$175 fixture price', 'day', 0, 0, 'full',
   'https://example.invalid/fixture-basketball/register', '2026-08-20', 'Tue-Thu 5pm-7pm',
   'fixture-basketball@example.invalid', '206-555-0102', 'manual', 'active', 100,
   'example.invalid', 'approved', 'fixture@example.invalid', '2026-07-16T00:00:00.000Z',
   'staging-fixture', '2026-07-16T00:00:00.000Z', 'high', 0,
   '2026-07-16T00:00:00.000Z', '2026-07-16T00:00:00.000Z'),
  ('fixture-program-swim', 'fixture-org-swim', 'fixture-swim-overnight-camp',
   'PCD Fixture Swim Overnight Camp', 'camp', 'swimming',
   'A fictional overnight camp for date, age, map, and detail-page validation.', 11, 16, 'advanced',
   '2026-08-17', '2026-08-21', '$225 fixture price', 'overnight', 0, 0, 'waitlist',
   'https://example.invalid/fixture-swim/register', '2026-08-05', 'Sun-Fri overnight',
   'fixture-swim@example.invalid', '206-555-0103', 'manual', 'active', 100,
   'example.invalid', 'approved', 'fixture@example.invalid', '2026-07-16T00:00:00.000Z',
   'staging-fixture', '2026-07-16T00:00:00.000Z', 'high', 0,
   '2026-07-16T00:00:00.000Z', '2026-07-16T00:00:00.000Z');
