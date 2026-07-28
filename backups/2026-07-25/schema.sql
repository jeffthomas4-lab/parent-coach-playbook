-- activity-radar D1 schema dump
-- Database: activity-radar (8cc3694a-26f8-4a56-b131-d5d3a68c49ef)
-- Date: 2026-07-25

CREATE TABLE _cf_KV (
        key TEXT PRIMARY KEY,
        value BLOB
      ) WITHOUT ROWID;

CREATE TABLE accreditations (
  id              TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  body            TEXT NOT NULL,
  identifier      TEXT,
  issued_at       TEXT,
  expires_at      TEXT,
  verified_at     TEXT,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE activity_categories (
  id                 TEXT PRIMARY KEY,
  slug               TEXT NOT NULL UNIQUE,
  name               TEXT NOT NULL,
  parent_category_id TEXT,
  description        TEXT,
  FOREIGN KEY (parent_category_id) REFERENCES activity_categories(id)
);

CREATE TABLE camp_claims (
  id                    TEXT PRIMARY KEY,
  camp_id               TEXT NOT NULL,
  organization_id       TEXT,
  claimant_email        TEXT NOT NULL,
  claimant_name         TEXT,
  organization          TEXT,
  phone                 TEXT,
  notes                 TEXT,
  status                TEXT NOT NULL DEFAULT 'pending',
  payment_amount_cents  INTEGER,
  payment_method        TEXT,
  submitted_at          TEXT NOT NULL,
  reviewed_by           TEXT,
  reviewed_at           TEXT,
  review_notes          TEXT,
  FOREIGN KEY (camp_id) REFERENCES programs(id)
);

CREATE TABLE camp_reviews (
  id                    TEXT PRIMARY KEY,
  camp_id               TEXT NOT NULL,
  reviewer_email        TEXT NOT NULL,
  reviewer_display_name TEXT,
  rating                INTEGER NOT NULL,
  body                  TEXT NOT NULL,
  status                TEXT NOT NULL DEFAULT 'pending',
  submitted_at          TEXT NOT NULL,
  reviewed_by           TEXT,
  reviewed_at           TEXT,
  review_notes          TEXT,
  FOREIGN KEY (camp_id) REFERENCES programs(id)
);

CREATE TABLE camp_scan_queue (
  id          TEXT PRIMARY KEY,
  org_id      TEXT NOT NULL UNIQUE,
  website_url TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending',
  attempts    INTEGER NOT NULL DEFAULT 0,
  camp_detected INTEGER,
  camp_url    TEXT,
  scanned_at  TEXT,
  created_at  TEXT NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE domain_quality (
  domain        TEXT PRIMARY KEY,
  trust_score   INTEGER NOT NULL DEFAULT 50,
  approved_count INTEGER NOT NULL DEFAULT 0,
  rejected_count INTEGER NOT NULL DEFAULT 0,
  blocked       INTEGER NOT NULL DEFAULT 0,
  notes         TEXT,
  updated_at    TEXT NOT NULL,
  submitted_count INTEGER NOT NULL DEFAULT 0,
  high_confidence_count INTEGER NOT NULL DEFAULT 0,
  low_confidence_count INTEGER NOT NULL DEFAULT 0,
  last_seen_at TEXT
);

CREATE TABLE domain_skip_list (
  domain     TEXT PRIMARY KEY,
  reason     TEXT,
  added_by   TEXT,
  added_at   TEXT DEFAULT (datetime('now'))
);

CREATE TABLE enrichment_queue (
  id                TEXT PRIMARY KEY,
  org_id            TEXT NOT NULL UNIQUE,
  priority          INTEGER NOT NULL DEFAULT 0,
  status            TEXT NOT NULL DEFAULT 'pending',
  attempts          INTEGER NOT NULL DEFAULT 0,
  last_attempted_at TEXT,
  enriched_at       TEXT,
  created_at        TEXT NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

CREATE TABLE featured_listings (
  id              TEXT PRIMARY KEY,
  organization_id TEXT,
  program_id      TEXT,
  placement       TEXT NOT NULL,
  starts_at       TEXT NOT NULL,
  ends_at         TEXT NOT NULL,
  active          INTEGER NOT NULL DEFAULT 1,
  created_at      TEXT NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (program_id)      REFERENCES programs(id)
);

CREATE TABLE geocoded_addresses (
  address_key  TEXT PRIMARY KEY,
  latitude     REAL NOT NULL,
  longitude    REAL NOT NULL,
  geocoded_at  TEXT NOT NULL
);

CREATE TABLE link_health (
  url TEXT PRIMARY KEY,
  source_files TEXT,
  last_checked TEXT,
  last_status_code INTEGER,
  final_url TEXT,
  is_broken INTEGER NOT NULL DEFAULT 0,
  is_redirect INTEGER NOT NULL DEFAULT 0,
  redirected_off_host INTEGER NOT NULL DEFAULT 0,
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  last_broken_at TEXT,
  last_ok_at TEXT,
  wayback_snapshot TEXT,
  suggested_search TEXT,
  notes TEXT,
  first_seen TEXT NOT NULL,
  resolved_at TEXT, resolved_by TEXT, suggested_replacement TEXT
);

CREATE TABLE org_claims (
  id              TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  claimant_email  TEXT NOT NULL,
  claimant_name   TEXT,
  claimant_role   TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  evidence        TEXT,
  submitted_at    TEXT NOT NULL,
  reviewed_by     TEXT,
  reviewed_at     TEXT,
  review_notes    TEXT,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE org_suggestions (
  id              TEXT PRIMARY KEY,
  org_name        TEXT NOT NULL,
  org_website     TEXT,
  org_city        TEXT,
  org_state       TEXT,
  activity_type   TEXT,
  submitter_email TEXT,
  notes           TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  submitted_at    TEXT NOT NULL
);

CREATE TABLE organizations (
  id            TEXT PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  aliases       TEXT,
  organization_type TEXT NOT NULL DEFAULT 'other',
  website_url   TEXT,
  email         TEXT,
  phone         TEXT,
  social_urls   TEXT,
  address       TEXT,
  city          TEXT,
  state         TEXT,
  zip           TEXT,
  latitude      REAL,
  longitude     REAL,
  categories    TEXT,
  age_min       INTEGER,
  age_max       INTEGER,
  program_types TEXT,
  description   TEXT,
  logo_url      TEXT,
  years_operating INTEGER,
  record_source TEXT NOT NULL DEFAULT 'scraped',
  record_status TEXT NOT NULL DEFAULT 'active',
  is_claimed    INTEGER NOT NULL DEFAULT 0,
  claimed_by_email TEXT,
  confidence_score INTEGER NOT NULL DEFAULT 0,
  legacy_source_domain TEXT,
  created_at        TEXT NOT NULL,
  last_verified_at  TEXT,
  updated_at        TEXT NOT NULL,
  ein TEXT, source_dataset TEXT, last_enriched_at TEXT, enrichment_confidence REAL NOT NULL DEFAULT 0,
  camp_detected INTEGER NOT NULL DEFAULT 0, camp_url TEXT, claim_paid_until TEXT, logo_key TEXT,
  gallery_keys TEXT, discovery_state TEXT, camp_unlikely INTEGER DEFAULT 0, priority INTEGER DEFAULT 0
);

CREATE TABLE programs (
  id              TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  program_type    TEXT NOT NULL DEFAULT 'camp',
  activity_category TEXT NOT NULL DEFAULT 'other',
  categories      TEXT,
  description     TEXT,
  age_min         INTEGER,
  age_max         INTEGER,
  grade_min       INTEGER,
  grade_max       INTEGER,
  skill_level     TEXT DEFAULT 'all',
  season              TEXT,
  session_start_date  TEXT,
  session_end_date    TEXT,
  days_of_week        TEXT,
  start_time          TEXT,
  end_time            TEXT,
  location_notes      TEXT,
  price       REAL,
  price_type  TEXT,
  price_text  TEXT,
  registration_url     TEXT,
  registration_open    INTEGER NOT NULL DEFAULT 1,
  registration_deadline TEXT,
  availability_status  TEXT NOT NULL DEFAULT 'unknown',
  day_or_overnight    TEXT,
  lunch_included      INTEGER,
  aftercare_available INTEGER,
  schedule_text       TEXT,
  hero_photo_key      TEXT,
  record_source   TEXT NOT NULL DEFAULT 'scraped',
  record_status   TEXT NOT NULL DEFAULT 'active',
  confidence_score INTEGER NOT NULL DEFAULT 0,
  source_domain   TEXT,
  url_health_status TEXT,
  legacy_camp_id  TEXT,
  legacy_slug     TEXT,
  created_at        TEXT NOT NULL,
  last_verified_at  TEXT,
  updated_at        TEXT NOT NULL,
  pcd_status TEXT NOT NULL DEFAULT 'pending', submitted_by_email TEXT, submitted_at TEXT, reviewed_by TEXT,
  reviewed_at TEXT, review_notes TEXT, reject_reason_code TEXT, verified INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0, featured_order INTEGER, featured_until TEXT,
  awaiting_review INTEGER NOT NULL DEFAULT 0, url_last_checked_at TEXT, url_last_status_code INTEGER,
  last_edited_at TEXT, last_edited_by TEXT, pcd_confidence TEXT NOT NULL DEFAULT 'medium',
  contact_email TEXT, contact_phone TEXT, info_requested_at TEXT, info_requested_by TEXT,
  info_request_notes TEXT, info_request_resolved_at TEXT,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE programs_staging (
  id                    TEXT PRIMARY KEY,
  organization_id       TEXT NOT NULL,
  slug                  TEXT NOT NULL,
  name                  TEXT NOT NULL,
  program_type          TEXT NOT NULL DEFAULT 'camp',
  activity_category     TEXT NOT NULL DEFAULT 'other',
  categories            TEXT,
  description           TEXT,
  age_min               INTEGER,
  age_max               INTEGER,
  season                TEXT,
  day_or_overnight      TEXT,
  registration_url      TEXT,
  record_source         TEXT NOT NULL DEFAULT 'evergreen_extract',
  source_domain         TEXT,
  extract_confidence    INTEGER NOT NULL DEFAULT 0,
  extract_needs_review  INTEGER NOT NULL DEFAULT 0,
  extract_notes         TEXT,
  verification_status   TEXT NOT NULL DEFAULT 'unverified',
  verification_notes    TEXT,
  verified_at            TEXT,
  promoted_program_id    TEXT,
  promoted_at            TEXT,
  extracted_at           TEXT NOT NULL,
  created_at             TEXT NOT NULL,
  updated_at             TEXT NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE reviews (
  id              TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  program_id      TEXT,
  rating          INTEGER NOT NULL,
  body            TEXT,
  reviewer_name   TEXT,
  reviewer_email  TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  created_at      TEXT NOT NULL,
  reviewed_at     TEXT,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (program_id)      REFERENCES programs(id)
);

CREATE TABLE search_anchors (
  slug              TEXT PRIMARY KEY,
  city              TEXT NOT NULL,
  radius_miles      INTEGER NOT NULL,
  status            TEXT NOT NULL DEFAULT 'not_started',
  last_batch_at     TEXT,
  next_batch_after  TEXT,
  notes             TEXT,
  ring              INTEGER NOT NULL DEFAULT 1,
  position          INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE search_batches (
  id            TEXT PRIMARY KEY,
  batch_date    TEXT NOT NULL,
  anchor_slug   TEXT NOT NULL REFERENCES search_anchors(slug),
  source_file   TEXT,
  rows_imported INTEGER NOT NULL DEFAULT 0,
  rows_rejected INTEGER NOT NULL DEFAULT 0,
  notes         TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE search_domains (
  domain            TEXT PRIMARY KEY,
  organization      TEXT,
  area_covered      TEXT NOT NULL,
  last_checked      TEXT,
  result            TEXT NOT NULL DEFAULT 'unknown',
  camps_pulled      INTEGER NOT NULL DEFAULT 0,
  next_recheck_after TEXT,
  notes             TEXT,
  permanent_skip    INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE search_events (
  id                  TEXT PRIMARY KEY,
  created_at          TEXT NOT NULL,
  query               TEXT,
  location_searched   TEXT,
  latitude            REAL,
  longitude           REAL,
  radius_miles        INTEGER,
  age_searched        INTEGER,
  categories_searched TEXT,
  price_min           REAL,
  price_max           REAL,
  available_now       INTEGER,
  result_count        INTEGER,
  clicked_org_ids     TEXT,
  source              TEXT NOT NULL DEFAULT 'activityradar'
);

CREATE TABLE sessions (
  id              TEXT PRIMARY KEY,
  program_id      TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  name            TEXT,
  session_date    TEXT,
  start_date      TEXT,
  end_date        TEXT,
  start_time      TEXT,
  end_time        TEXT,
  location        TEXT,
  age_min         INTEGER,
  age_max         INTEGER,
  price           REAL,
  registration_deadline TEXT,
  registration_status   TEXT,
  registration_url      TEXT,
  status          TEXT NOT NULL DEFAULT 'scheduled',
  cancellation_reason TEXT,
  confidence_score INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL,
  last_verified_at  TEXT,
  FOREIGN KEY (program_id)      REFERENCES programs(id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE sqlite_sequence(name,seq);

CREATE TABLE submitters (
  email             TEXT PRIMARY KEY,
  trust_level       TEXT NOT NULL DEFAULT 'new',
  submission_count  INTEGER NOT NULL DEFAULT 0,
  approved_count    INTEGER NOT NULL DEFAULT 0,
  first_submitted_at TEXT NOT NULL,
  last_submitted_at  TEXT NOT NULL,
  notes             TEXT
);

CREATE TABLE trust_signals (
  id              TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  signal_type     TEXT NOT NULL,
  signal_value    TEXT NOT NULL,
  signal_source   TEXT,
  verified_at     TEXT,
  created_at      TEXT NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE zip_centroids (
  zip       TEXT PRIMARY KEY,
  latitude  REAL NOT NULL,
  longitude REAL NOT NULL,
  city      TEXT,
  state     TEXT
);
