-- Provider-neutral editorial opportunity, evidence, and approval lifecycle
-- substrate. This migration stores no raw search queries, no child or family
-- identifying data, no requester PII, and no secrets. Opportunity rows carry
-- only bounded, already-aggregated signal summaries -- never a verbatim query
-- string or a support-case transcript. It activates no intake collector, no
-- publish action, and no automatic deletion, redirect, or retirement.

CREATE TABLE editorial_opportunities (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL CHECK(source IN (
    'search','no_result','gsc','camp_gap','affiliate_gap','seasonal',
    'newsletter','support','correction','competitor','emerging_trend'
  )),
  signal_summary TEXT NOT NULL CHECK(length(signal_summary) BETWEEN 1 AND 500),
  signal_ref TEXT,
  content_type TEXT CHECK(content_type IS NULL OR content_type IN (
    'pillar','guide','article','directory','comparison','newsletter','correction'
  )),
  target_keyword TEXT CHECK(target_keyword IS NULL OR length(target_keyword) <= 200),
  score INTEGER CHECK(score IS NULL OR score BETWEEN 0 AND 100),
  status TEXT NOT NULL CHECK(status IN (
    'opportunity_discovered','scored','classified','briefed','researching',
    'sourced','outlined','drafting','claims_validated','editorial_review',
    'seo_review','relationship_mapped','approval_ready','approved','published',
    'monitoring','maintenance_due','update_proposed','consolidation_proposed','retired',
    'insufficient_evidence'
  )),
  cannibalization_decision TEXT CHECK(cannibalization_decision IS NULL OR cannibalization_decision IN (
    'update_existing','consolidate','structured_directory','new_url','insufficient_evidence'
  )),
  existing_match_route TEXT,
  decision_reason TEXT CHECK(decision_reason IS NULL OR length(decision_reason) <= 1000),
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  scored_at TEXT,
  classified_at TEXT,
  briefed_at TEXT,
  CHECK(status = 'opportunity_discovered' OR scored_at IS NOT NULL)
);

CREATE INDEX idx_editorial_opportunities_status ON editorial_opportunities(status, score DESC);
CREATE INDEX idx_editorial_opportunities_source ON editorial_opportunities(source, created_at DESC);

-- Append-only lifecycle history for every governed entity type in this file.
CREATE TABLE editorial_lifecycle_events (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK(entity_type IN (
    'opportunity','brief','claim','review','relationship','approval','maintenance_proposal'
  )),
  entity_id TEXT NOT NULL,
  from_state TEXT,
  to_state TEXT NOT NULL,
  reason_code TEXT NOT NULL,
  evidence_ref TEXT,
  actor_type TEXT NOT NULL CHECK(actor_type IN ('staff','system')),
  actor_ref TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE
);

CREATE INDEX idx_editorial_lifecycle_events_entity ON editorial_lifecycle_events(entity_type, entity_id, occurred_at DESC);

-- Evidence source registry, reusable across opportunities, briefs, and claims.
CREATE TABLE editorial_sources (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK(entity_type IN ('opportunity','brief','claim')),
  entity_id TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK(source_type IN (
    'primary_research','manufacturer','official_rule','governing_body',
    'news','academic','internal_data','parent_feedback','other'
  )),
  source_url TEXT NOT NULL CHECK(source_url LIKE 'https://%'),
  source_quality INTEGER NOT NULL CHECK(source_quality BETWEEN 0 AND 100),
  claim_scope TEXT NOT NULL CHECK(length(claim_scope) BETWEEN 1 AND 500),
  verified_at TEXT NOT NULL,
  expires_at TEXT,
  content_sha256 TEXT CHECK(content_sha256 IS NULL OR length(content_sha256) = 64),
  added_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_editorial_sources_entity ON editorial_sources(entity_type, entity_id, verified_at DESC);

CREATE TABLE editorial_briefs (
  id TEXT PRIMARY KEY,
  opportunity_id TEXT NOT NULL REFERENCES editorial_opportunities(id),
  intent_statement TEXT NOT NULL CHECK(length(intent_statement) BETWEEN 1 AND 1000),
  content_type TEXT NOT NULL CHECK(content_type IN (
    'pillar','guide','article','directory','comparison','newsletter','correction'
  )),
  target_route TEXT,
  outline_ref TEXT,
  status TEXT NOT NULL CHECK(status IN ('draft','ready','superseded')),
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_editorial_briefs_opportunity ON editorial_briefs(opportunity_id, status);
-- Only one active (non-superseded) brief may exist per opportunity at a time.
CREATE UNIQUE INDEX idx_editorial_briefs_active_per_opportunity ON editorial_briefs(opportunity_id) WHERE status <> 'superseded';

CREATE TABLE editorial_claims (
  id TEXT PRIMARY KEY,
  brief_id TEXT NOT NULL REFERENCES editorial_briefs(id),
  claim_text TEXT NOT NULL CHECK(length(claim_text) BETWEEN 1 AND 1000),
  validated INTEGER NOT NULL DEFAULT 0 CHECK(validated IN (0, 1)),
  validated_by TEXT,
  validated_at TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  CHECK(validated = 0 OR (validated_by IS NOT NULL AND validated_at IS NOT NULL))
);

CREATE INDEX idx_editorial_claims_brief ON editorial_claims(brief_id, validated);

CREATE TABLE editorial_claim_sources (
  claim_id TEXT NOT NULL REFERENCES editorial_claims(id),
  source_id TEXT NOT NULL REFERENCES editorial_sources(id),
  added_by TEXT NOT NULL,
  added_at TEXT NOT NULL,
  PRIMARY KEY(claim_id, source_id)
);

CREATE TABLE editorial_relationships (
  id TEXT PRIMARY KEY,
  opportunity_id TEXT NOT NULL REFERENCES editorial_opportunities(id),
  related_route TEXT NOT NULL,
  relationship_type TEXT NOT NULL CHECK(relationship_type IN (
    'internal_link','canonical','supersedes','hub_child','see_also'
  )),
  mapped_by TEXT NOT NULL,
  mapped_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(opportunity_id, related_route, relationship_type)
);

CREATE INDEX idx_editorial_relationships_opportunity ON editorial_relationships(opportunity_id);

CREATE TABLE editorial_reviews (
  id TEXT PRIMARY KEY,
  opportunity_id TEXT NOT NULL REFERENCES editorial_opportunities(id),
  review_type TEXT NOT NULL CHECK(review_type IN ('editorial', 'seo_ai')),
  outcome TEXT NOT NULL CHECK(outcome IN ('pass', 'changes_requested')),
  reviewer TEXT NOT NULL,
  notes TEXT CHECK(notes IS NULL OR length(notes) <= 2000),
  reviewed_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_editorial_reviews_opportunity ON editorial_reviews(opportunity_id, review_type, reviewed_at DESC);

CREATE TABLE editorial_approvals (
  id TEXT PRIMARY KEY,
  opportunity_id TEXT NOT NULL UNIQUE REFERENCES editorial_opportunities(id),
  monetization_classification TEXT NOT NULL CHECK(monetization_classification IN (
    'none','affiliate','sponsored','owned_product'
  )),
  disclosure_required INTEGER NOT NULL CHECK(disclosure_required IN (0, 1)),
  flags_resolved INTEGER NOT NULL DEFAULT 0 CHECK(flags_resolved IN (0, 1)),
  approved_by TEXT,
  approved_at TEXT,
  created_at TEXT NOT NULL,
  CHECK(approved_by IS NULL OR (approved_at IS NOT NULL AND flags_resolved = 1)),
  CHECK(monetization_classification = 'none' OR disclosure_required = 1)
);

CREATE TABLE editorial_maintenance_proposals (
  id TEXT PRIMARY KEY,
  opportunity_id TEXT NOT NULL REFERENCES editorial_opportunities(id),
  proposal_type TEXT NOT NULL CHECK(proposal_type IN ('refresh', 'consolidate', 'retire')),
  reason TEXT NOT NULL CHECK(length(reason) BETWEEN 1 AND 1000),
  incoming_link_audit_ref TEXT,
  proposed_by TEXT NOT NULL,
  proposed_at TEXT NOT NULL,
  decided_by TEXT,
  decided_at TEXT,
  decision TEXT CHECK(decision IS NULL OR decision IN ('accepted', 'rejected')),
  CHECK(decision IS NULL OR (decided_by IS NOT NULL AND decided_at IS NOT NULL)),
  CHECK(proposal_type = 'refresh' OR incoming_link_audit_ref IS NOT NULL)
);

CREATE INDEX idx_editorial_maintenance_proposals_opportunity ON editorial_maintenance_proposals(opportunity_id, decision);
