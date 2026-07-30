-- Provider-neutral product recommendation and affiliate lifecycle substrate.
-- This migration stores no secrets, tax records, payment data, customer PII,
-- raw search text, child data, or direct authority to publish recommendations.

CREATE TABLE affiliate_merchants (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  program_name TEXT NOT NULL,
  account_state TEXT NOT NULL CHECK(account_state IN (
    'research_candidate','application_draft','application_submitted','approved',
    'rejected','paused','closed','status_unverified'
  )),
  tracking_mode TEXT NOT NULL CHECK(tracking_mode IN ('preserve_special_link','append_first_party_utm')),
  terms_evidence_ref TEXT,
  terms_verified_at TEXT,
  owner_approval_ref TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK(account_state NOT IN ('application_submitted','approved','rejected','paused','closed') OR owner_approval_ref IS NOT NULL)
);

CREATE TABLE affiliate_merchant_hosts (
  merchant_id TEXT NOT NULL REFERENCES affiliate_merchants(id),
  hostname TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active','review_due','retired')),
  verified_at TEXT NOT NULL,
  PRIMARY KEY(merchant_id, hostname),
  UNIQUE(hostname)
);

CREATE TABLE affiliate_program_terms (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL REFERENCES affiliate_merchants(id),
  effective_at TEXT NOT NULL,
  commission_basis TEXT,
  commission_bps INTEGER CHECK(commission_bps IS NULL OR commission_bps BETWEEN 0 AND 10000),
  cookie_duration_hours INTEGER CHECK(cookie_duration_hours IS NULL OR cookie_duration_hours >= 0),
  restrictions_json TEXT NOT NULL DEFAULT '{}',
  evidence_ref TEXT NOT NULL,
  reviewed_by TEXT NOT NULL,
  reviewed_at TEXT NOT NULL,
  superseded_at TEXT
);

CREATE INDEX idx_affiliate_program_terms_merchant ON affiliate_program_terms(merchant_id, effective_at DESC);

CREATE TABLE affiliate_products (
  id TEXT PRIMARY KEY,
  canonical_name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  version TEXT,
  category TEXT NOT NULL,
  lifecycle_state TEXT NOT NULL CHECK(lifecycle_state IN (
    'need_discovered','intent_qualified','researching','candidate','evaluating',
    'editorial_review','approved','integrated','published','monitoring',
    'maintenance_due','update_proposed','retired'
  )),
  age_min INTEGER CHECK(age_min IS NULL OR age_min >= 0),
  age_max INTEGER CHECK(age_max IS NULL OR age_max >= age_min),
  attributes_json TEXT NOT NULL DEFAULT '{}',
  discontinued_at TEXT,
  replacement_product_id TEXT REFERENCES affiliate_products(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_affiliate_products_state_category ON affiliate_products(lifecycle_state, category);

CREATE TABLE affiliate_product_identifiers (
  product_id TEXT NOT NULL REFERENCES affiliate_products(id),
  identifier_type TEXT NOT NULL CHECK(identifier_type IN ('asin','upc','ean','isbn','manufacturer_sku','other')),
  identifier_value TEXT NOT NULL,
  merchant_id TEXT REFERENCES affiliate_merchants(id),
  verified_at TEXT NOT NULL,
  evidence_ref TEXT NOT NULL,
  PRIMARY KEY(product_id, identifier_type, identifier_value),
  UNIQUE(identifier_type, identifier_value, merchant_id)
);

CREATE TABLE affiliate_product_sources (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES affiliate_products(id),
  source_type TEXT NOT NULL CHECK(source_type IN (
    'manufacturer','manual','certification','recall','merchant','editorial_test','parent_feedback','other'
  )),
  source_url TEXT NOT NULL CHECK(source_url LIKE 'https://%'),
  source_quality INTEGER NOT NULL CHECK(source_quality BETWEEN 0 AND 100),
  claim_scope TEXT NOT NULL,
  verified_at TEXT NOT NULL,
  expires_at TEXT,
  content_sha256 TEXT CHECK(content_sha256 IS NULL OR length(content_sha256) = 64),
  created_at TEXT NOT NULL
);

CREATE INDEX idx_affiliate_product_sources_product ON affiliate_product_sources(product_id, verified_at DESC);

CREATE TABLE affiliate_offers (
  id TEXT PRIMARY KEY,
  offer_slug TEXT NOT NULL UNIQUE,
  product_id TEXT REFERENCES affiliate_products(id),
  merchant_id TEXT NOT NULL REFERENCES affiliate_merchants(id),
  destination_url TEXT NOT NULL CHECK(destination_url LIKE 'https://%'),
  campaign_code TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'US' CHECK(length(country_code) = 2),
  availability_state TEXT NOT NULL CHECK(availability_state IN ('available','limited','unavailable','unknown')),
  status TEXT NOT NULL CHECK(status IN ('candidate','approved','active','paused','retired')),
  approved_by TEXT,
  approved_at TEXT,
  last_verified_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK(status NOT IN ('approved','active') OR (approved_by IS NOT NULL AND approved_at IS NOT NULL))
);

CREATE INDEX idx_affiliate_offers_product_status ON affiliate_offers(product_id, status);
CREATE INDEX idx_affiliate_offers_merchant_status ON affiliate_offers(merchant_id, status);

CREATE TABLE affiliate_offer_observations (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL REFERENCES affiliate_offers(id),
  observed_at TEXT NOT NULL,
  availability_state TEXT NOT NULL CHECK(availability_state IN ('available','limited','unavailable','unknown')),
  http_status INTEGER CHECK(http_status IS NULL OR http_status BETWEEN 100 AND 599),
  price_minor INTEGER CHECK(price_minor IS NULL OR price_minor >= 0),
  currency TEXT CHECK(currency IS NULL OR length(currency) = 3),
  rating_value REAL CHECK(rating_value IS NULL OR rating_value BETWEEN 0 AND 5),
  rating_count INTEGER CHECK(rating_count IS NULL OR rating_count >= 0),
  observation_source TEXT NOT NULL CHECK(observation_source IN ('approved_api','manual','link_health','merchant_statement')),
  evidence_ref TEXT NOT NULL,
  CHECK((price_minor IS NULL AND currency IS NULL) OR (price_minor IS NOT NULL AND currency IS NOT NULL))
);

CREATE INDEX idx_affiliate_offer_observations_offer ON affiliate_offer_observations(offer_id, observed_at DESC);

CREATE TABLE affiliate_buying_intents (
  id TEXT PRIMARY KEY,
  intent_key TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  sport TEXT,
  activity TEXT,
  age_band TEXT,
  season TEXT,
  urgency TEXT CHECK(urgency IN ('low','normal','high','time_bound')),
  evidence_summary TEXT NOT NULL,
  aggregate_signal_count INTEGER NOT NULL DEFAULT 0 CHECK(aggregate_signal_count >= 0),
  confidence INTEGER NOT NULL CHECK(confidence BETWEEN 0 AND 100),
  state TEXT NOT NULL CHECK(state IN ('candidate','qualified','planned','in_research','covered','retired')),
  discovered_at TEXT NOT NULL,
  reviewed_at TEXT,
  reviewed_by TEXT
);

CREATE INDEX idx_affiliate_buying_intents_state ON affiliate_buying_intents(state, confidence DESC);

CREATE TABLE affiliate_recommendations (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES affiliate_products(id),
  intent_id TEXT REFERENCES affiliate_buying_intents(id),
  recommendation_role TEXT NOT NULL CHECK(recommendation_role IN (
    'best_overall','best_value','budget','premium','beginner','travel','alternative','avoid','category_skip'
  )),
  audience_scope TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  strengths TEXT NOT NULL,
  weaknesses TEXT NOT NULL,
  wrong_for TEXT NOT NULL,
  confidence INTEGER NOT NULL CHECK(confidence BETWEEN 0 AND 100),
  trust_score INTEGER NOT NULL CHECK(trust_score BETWEEN 0 AND 100),
  status TEXT NOT NULL CHECK(status IN ('draft','editorial_review','approved','published','maintenance_due','retired')),
  approved_by TEXT,
  approved_at TEXT,
  published_at TEXT,
  next_review_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK(status NOT IN ('approved','published','maintenance_due') OR (approved_by IS NOT NULL AND approved_at IS NOT NULL)),
  CHECK(status <> 'published' OR published_at IS NOT NULL)
);

CREATE INDEX idx_affiliate_recommendations_review ON affiliate_recommendations(status, next_review_at);
CREATE INDEX idx_affiliate_recommendations_product ON affiliate_recommendations(product_id, status);

CREATE TABLE affiliate_recommendation_evidence (
  recommendation_id TEXT NOT NULL REFERENCES affiliate_recommendations(id),
  product_source_id TEXT NOT NULL REFERENCES affiliate_product_sources(id),
  supports_claim TEXT NOT NULL,
  added_by TEXT NOT NULL,
  added_at TEXT NOT NULL,
  PRIMARY KEY(recommendation_id, product_source_id, supports_claim)
);

CREATE TABLE affiliate_guide_placements (
  id TEXT PRIMARY KEY,
  guide_route TEXT NOT NULL,
  recommendation_id TEXT NOT NULL REFERENCES affiliate_recommendations(id),
  offer_id TEXT REFERENCES affiliate_offers(id),
  placement_role TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('draft','approved','published','paused','retired')),
  disclosure_verified_at TEXT,
  editorial_approved_by TEXT,
  editorial_approved_at TEXT,
  published_at TEXT,
  UNIQUE(guide_route, recommendation_id, placement_role),
  CHECK(status NOT IN ('approved','published') OR (editorial_approved_by IS NOT NULL AND editorial_approved_at IS NOT NULL)),
  CHECK(status <> 'published' OR (published_at IS NOT NULL AND disclosure_verified_at IS NOT NULL))
);

CREATE INDEX idx_affiliate_guide_placements_route ON affiliate_guide_placements(guide_route, status);

CREATE TABLE affiliate_lifecycle_events (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK(entity_type IN ('intent','product','offer','recommendation','placement','merchant')),
  entity_id TEXT NOT NULL,
  from_state TEXT,
  to_state TEXT NOT NULL,
  reason_code TEXT NOT NULL,
  evidence_ref TEXT,
  actor_type TEXT NOT NULL CHECK(actor_type IN ('staff','system','provider')),
  actor_ref TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE
);

CREATE INDEX idx_affiliate_lifecycle_events_entity ON affiliate_lifecycle_events(entity_type, entity_id, occurred_at DESC);

CREATE TABLE affiliate_health_checks (
  id TEXT PRIMARY KEY,
  offer_id TEXT REFERENCES affiliate_offers(id),
  product_id TEXT REFERENCES affiliate_products(id),
  check_type TEXT NOT NULL CHECK(check_type IN ('link','availability','identifier','terms','recall','replacement','recommendation_freshness')),
  outcome TEXT NOT NULL CHECK(outcome IN ('pass','warning','fail','unknown')),
  reason_code TEXT NOT NULL,
  evidence_ref TEXT,
  checked_at TEXT NOT NULL,
  next_check_at TEXT NOT NULL,
  CHECK(offer_id IS NOT NULL OR product_id IS NOT NULL)
);

CREATE INDEX idx_affiliate_health_checks_due ON affiliate_health_checks(next_check_at, outcome);

CREATE TABLE affiliate_incidents (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK(entity_type IN ('merchant','product','offer','recommendation','guide')),
  entity_id TEXT NOT NULL,
  incident_type TEXT NOT NULL CHECK(incident_type IN (
    'broken_link','tracking_failure','unavailable','discontinued','recall','terms_change',
    'unsupported_claim','stale_evidence','revenue_mismatch','disclosure_failure','correction'
  )),
  severity TEXT NOT NULL CHECK(severity IN ('low','medium','high','critical')),
  state TEXT NOT NULL CHECK(state IN ('open','triaged','action_proposed','resolved','dismissed')),
  summary TEXT NOT NULL,
  opened_at TEXT NOT NULL,
  due_at TEXT NOT NULL,
  resolved_at TEXT,
  resolution_summary TEXT,
  CHECK(state <> 'resolved' OR (resolved_at IS NOT NULL AND resolution_summary IS NOT NULL))
);

CREATE INDEX idx_affiliate_incidents_queue ON affiliate_incidents(state, severity, due_at);

CREATE TABLE affiliate_revenue_statements (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL REFERENCES affiliate_merchants(id),
  statement_period_start TEXT NOT NULL,
  statement_period_end TEXT NOT NULL,
  currency TEXT NOT NULL CHECK(length(currency) = 3),
  gross_revenue_minor INTEGER NOT NULL DEFAULT 0,
  returns_minor INTEGER NOT NULL DEFAULT 0,
  adjustments_minor INTEGER NOT NULL DEFAULT 0,
  net_revenue_minor INTEGER NOT NULL DEFAULT 0,
  statement_evidence_ref TEXT NOT NULL,
  statement_sha256 TEXT NOT NULL CHECK(length(statement_sha256) = 64),
  imported_at TEXT NOT NULL,
  reconciled_by TEXT,
  reconciled_at TEXT,
  UNIQUE(merchant_id, statement_period_start, statement_period_end, statement_sha256),
  CHECK(statement_period_end >= statement_period_start)
);

CREATE INDEX idx_affiliate_revenue_statements_period ON affiliate_revenue_statements(statement_period_end DESC, merchant_id);

CREATE TABLE affiliate_revenue_lines (
  id TEXT PRIMARY KEY,
  statement_id TEXT NOT NULL REFERENCES affiliate_revenue_statements(id),
  offer_id TEXT REFERENCES affiliate_offers(id),
  product_id TEXT REFERENCES affiliate_products(id),
  guide_route TEXT,
  campaign_code TEXT,
  channel TEXT,
  clicks INTEGER CHECK(clicks IS NULL OR clicks >= 0),
  orders INTEGER CHECK(orders IS NULL OR orders >= 0),
  returned_orders INTEGER CHECK(returned_orders IS NULL OR returned_orders >= 0),
  net_revenue_minor INTEGER NOT NULL,
  attribution_quality TEXT NOT NULL CHECK(attribution_quality IN ('exact','provider_aggregate','estimated','unattributed')),
  CHECK(offer_id IS NOT NULL OR product_id IS NOT NULL OR guide_route IS NOT NULL OR campaign_code IS NOT NULL OR attribution_quality = 'unattributed')
);

CREATE INDEX idx_affiliate_revenue_lines_statement ON affiliate_revenue_lines(statement_id);
CREATE INDEX idx_affiliate_revenue_lines_offer ON affiliate_revenue_lines(offer_id);
CREATE INDEX idx_affiliate_revenue_lines_product ON affiliate_revenue_lines(product_id);

CREATE TABLE equipment_requirements (
  id TEXT PRIMARY KEY,
  requirement_key TEXT NOT NULL UNIQUE,
  sport TEXT,
  activity TEXT,
  camp_id TEXT,
  organization_id TEXT,
  age_band TEXT,
  item_category TEXT NOT NULL,
  requirement_level TEXT NOT NULL CHECK(requirement_level IN ('required','recommended','optional','provided','prohibited')),
  source_url TEXT NOT NULL CHECK(source_url LIKE 'https://%'),
  source_verified_at TEXT NOT NULL,
  valid_from TEXT,
  valid_until TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK(camp_id IS NOT NULL OR organization_id IS NOT NULL OR sport IS NOT NULL OR activity IS NOT NULL)
);

CREATE INDEX idx_equipment_requirements_scope ON equipment_requirements(camp_id, organization_id, sport, activity, item_category);

CREATE TABLE equipment_recommendation_links (
  requirement_id TEXT NOT NULL REFERENCES equipment_requirements(id),
  recommendation_id TEXT NOT NULL REFERENCES affiliate_recommendations(id),
  status TEXT NOT NULL CHECK(status IN ('candidate','approved','retired')),
  approved_by TEXT,
  approved_at TEXT,
  PRIMARY KEY(requirement_id, recommendation_id),
  CHECK(status <> 'approved' OR (approved_by IS NOT NULL AND approved_at IS NOT NULL))
);
