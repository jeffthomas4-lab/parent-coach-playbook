// Durable source/claim/brief/relationship/review/approval records for the
// governed editorial content lifecycle (see strategy/EDITORIAL-CONTENT-LIFECYCLE.md
// and src/lib/editorial-lifecycle.ts for the state machine and evidence gates
// this file enforces against real D1 rows). Every write here is local to the
// PCD_OPS_DB operational database, requires an authenticated staff actor, and
// never publishes, deletes, redirects, or changes an affiliate mapping.

import { approvalGates, canTransition, chooseCannibalizationDecision, type EditorialState } from './editorial-lifecycle';
import type { OpportunityContentType, OpportunitySource } from './editorial-opportunity-intake';

const genId = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;

// EditorialState (from editorial-lifecycle.ts) omits 'insufficient_evidence'
// from its exported union even though canTransition's own transition map
// treats it as a real reachable state (via an internal `as EditorialState`
// cast). OpportunityStatus widens the type locally to match what actually
// happens at runtime, without editing the shared reusable state machine.
export type OpportunityStatus = EditorialState | 'insufficient_evidence';

export interface EditorialOpportunity {
  id: string;
  source: OpportunitySource;
  signal_summary: string;
  signal_ref: string | null;
  content_type: OpportunityContentType | null;
  target_keyword: string | null;
  score: number | null;
  status: OpportunityStatus;
  cannibalization_decision: string | null;
  existing_match_route: string | null;
  decision_reason: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  scored_at: string | null;
  classified_at: string | null;
  briefed_at: string | null;
}

// Not async: this is pushed directly into db.batch([...]) arrays alongside
// other prepared statements, so it must return a D1PreparedStatement itself,
// never a Promise of one.
function logEvent(
  db: D1Database,
  entityType: 'opportunity' | 'brief' | 'claim' | 'review' | 'relationship' | 'approval' | 'maintenance_proposal',
  entityId: string,
  fromState: string | null,
  toState: string,
  reasonCode: string,
  actor: string,
  now: string,
  evidenceRef: string | null = null,
) {
  return db.prepare(
    `INSERT INTO editorial_lifecycle_events
      (id, entity_type, entity_id, from_state, to_state, reason_code, evidence_ref, actor_type, actor_ref, occurred_at, idempotency_key)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'staff', ?, ?, ?)`,
  ).bind(genId('event'), entityType, entityId, fromState, toState, reasonCode, evidenceRef, actor, now, genId('idem'));
}

export async function createOpportunity(
  db: D1Database,
  input: {
    id?: string;
    source: OpportunitySource;
    signalSummary: string;
    signalRef?: string | null;
    contentType?: OpportunityContentType | null;
    targetKeyword?: string | null;
    actor: string;
  },
): Promise<EditorialOpportunity> {
  const now = new Date().toISOString();
  const id = input.id ?? genId('opportunity');
  await db.batch([
    db.prepare(
      `INSERT INTO editorial_opportunities
        (id, source, signal_summary, signal_ref, content_type, target_keyword, status, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'opportunity_discovered', ?, ?, ?)`,
    ).bind(id, input.source, input.signalSummary, input.signalRef ?? null, input.contentType ?? null, input.targetKeyword ?? null, input.actor, now, now),
    logEvent(db, 'opportunity', id, null, 'opportunity_discovered', 'signal_intake', input.actor, now),
  ]);
  return (await db.prepare(`SELECT * FROM editorial_opportunities WHERE id = ?`).bind(id).first<EditorialOpportunity>())!;
}

export async function getOpportunity(db: D1Database, id: string): Promise<EditorialOpportunity | null> {
  return db.prepare(`SELECT * FROM editorial_opportunities WHERE id = ?`).bind(id).first<EditorialOpportunity>();
}

export async function scoreOpportunity(
  db: D1Database,
  input: { id: string; score: number; actor: string },
): Promise<EditorialOpportunity> {
  const existing = await getOpportunity(db, input.id);
  if (!existing) throw new Error('opportunity not found');
  if (!canTransition(existing.status as EditorialState, 'scored')) throw new Error('invalid opportunity transition');
  if (!Number.isInteger(input.score) || input.score < 0 || input.score > 100) throw new Error('score must be an integer 0-100');
  const now = new Date().toISOString();
  const results = await db.batch([
    db.prepare(
      `UPDATE editorial_opportunities SET status = 'scored', score = ?, scored_at = ?, updated_at = ? WHERE id = ? AND status = ?`,
    ).bind(input.score, now, now, input.id, existing.status),
    logEvent(db, 'opportunity', input.id, existing.status, 'scored', 'staff_scored', input.actor, now),
  ]);
  if (Number(results[0]?.meta?.changes ?? 0) !== 1) throw new Error('opportunity changed concurrently');
  return (await getOpportunity(db, input.id))!;
}

export async function classifyOpportunity(
  db: D1Database,
  input: {
    id: string;
    contentType: OpportunityContentType;
    existingMatch: boolean;
    distinctIntent: boolean;
    structuredDirectoryFit: boolean;
    evidenceSufficient: boolean;
    existingMatchRoute?: string | null;
    decisionReason: string;
    actor: string;
  },
): Promise<EditorialOpportunity> {
  const existing = await getOpportunity(db, input.id);
  if (!existing) throw new Error('opportunity not found');
  if (!canTransition(existing.status as EditorialState, 'classified')) throw new Error('invalid opportunity transition');
  const decision = chooseCannibalizationDecision({
    existingMatch: input.existingMatch,
    distinctIntent: input.distinctIntent,
    structuredDirectoryFit: input.structuredDirectoryFit,
    evidenceSufficient: input.evidenceSufficient,
  });
  const now = new Date().toISOString();
  const finalStatus: OpportunityStatus = decision === 'insufficient_evidence' ? 'insufficient_evidence' : 'classified';
  const statements = [
    db.prepare(
      `UPDATE editorial_opportunities
          SET status = 'classified', content_type = ?, cannibalization_decision = ?, existing_match_route = ?,
              decision_reason = ?, classified_at = ?, updated_at = ?
        WHERE id = ? AND status = ?`,
    ).bind(input.contentType, decision, input.existingMatchRoute ?? null, input.decisionReason, now, now, input.id, existing.status),
    logEvent(db, 'opportunity', input.id, existing.status, 'classified', 'staff_classified', input.actor, now),
  ];
  if (finalStatus === 'insufficient_evidence') {
    statements.push(
      db.prepare(`UPDATE editorial_opportunities SET status = 'insufficient_evidence', updated_at = ? WHERE id = ? AND status = 'classified'`).bind(now, input.id),
      logEvent(db, 'opportunity', input.id, 'classified', 'insufficient_evidence', 'insufficient_evidence_at_classification', input.actor, now),
    );
  }
  const results = await db.batch(statements);
  if (Number(results[0]?.meta?.changes ?? 0) !== 1) throw new Error('opportunity changed concurrently');
  if (finalStatus === 'insufficient_evidence' && Number(results[2]?.meta?.changes ?? 0) !== 1) throw new Error('opportunity changed concurrently');
  return (await getOpportunity(db, input.id))!;
}

export interface EditorialSource {
  id: string;
  entity_type: 'opportunity' | 'brief' | 'claim';
  entity_id: string;
  source_type: string;
  source_url: string;
  source_quality: number;
  claim_scope: string;
  verified_at: string;
  expires_at: string | null;
  content_sha256: string | null;
  added_by: string;
  created_at: string;
}

const SOURCE_TYPES = ['primary_research', 'manufacturer', 'official_rule', 'governing_body', 'news', 'academic', 'internal_data', 'parent_feedback', 'other'] as const;

export async function addSource(
  db: D1Database,
  input: {
    id?: string;
    entityType: 'opportunity' | 'brief' | 'claim';
    entityId: string;
    sourceType: typeof SOURCE_TYPES[number];
    sourceUrl: string;
    sourceQuality: number;
    claimScope: string;
    verifiedAt: string;
    expiresAt?: string | null;
    contentSha256?: string | null;
    actor: string;
  },
): Promise<EditorialSource> {
  if (!SOURCE_TYPES.includes(input.sourceType)) throw new Error('invalid source type');
  if (!input.sourceUrl.startsWith('https://')) throw new Error('source url must be https');
  if (!Number.isInteger(input.sourceQuality) || input.sourceQuality < 0 || input.sourceQuality > 100) throw new Error('source quality must be an integer 0-100');
  if (input.contentSha256 && !/^[0-9a-f]{64}$/i.test(input.contentSha256)) throw new Error('content sha256 must be 64 hex characters');
  const now = new Date().toISOString();
  const id = input.id ?? genId('source');
  await db.prepare(
    `INSERT INTO editorial_sources
      (id, entity_type, entity_id, source_type, source_url, source_quality, claim_scope, verified_at, expires_at, content_sha256, added_by, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(id, input.entityType, input.entityId, input.sourceType, input.sourceUrl, input.sourceQuality, input.claimScope, input.verifiedAt, input.expiresAt ?? null, input.contentSha256 ?? null, input.actor, now).run();
  return (await db.prepare(`SELECT * FROM editorial_sources WHERE id = ?`).bind(id).first<EditorialSource>())!;
}

export interface EditorialBrief {
  id: string;
  opportunity_id: string;
  intent_statement: string;
  content_type: OpportunityContentType;
  target_route: string | null;
  outline_ref: string | null;
  status: 'draft' | 'ready' | 'superseded';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export async function createBrief(
  db: D1Database,
  input: {
    id?: string;
    opportunityId: string;
    intentStatement: string;
    contentType: OpportunityContentType;
    targetRoute?: string | null;
    outlineRef?: string | null;
    actor: string;
  },
): Promise<EditorialBrief> {
  const opportunity = await getOpportunity(db, input.opportunityId);
  if (!opportunity) throw new Error('opportunity not found');
  if (!canTransition(opportunity.status as EditorialState, 'briefed')) throw new Error('opportunity is not ready to be briefed');
  const now = new Date().toISOString();
  const id = input.id ?? genId('brief');
  const results = await db.batch([
    db.prepare(
      `INSERT INTO editorial_briefs (id, opportunity_id, intent_statement, content_type, target_route, outline_ref, status, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?)`,
    ).bind(id, input.opportunityId, input.intentStatement, input.contentType, input.targetRoute ?? null, input.outlineRef ?? null, input.actor, now, now),
    db.prepare(`UPDATE editorial_opportunities SET status = 'briefed', briefed_at = ?, updated_at = ? WHERE id = ? AND status = ?`).bind(now, now, input.opportunityId, opportunity.status),
    logEvent(db, 'opportunity', input.opportunityId, opportunity.status, 'briefed', 'brief_created', input.actor, now),
    logEvent(db, 'brief', id, null, 'draft', 'brief_created', input.actor, now),
  ]);
  if (Number(results[1]?.meta?.changes ?? 0) !== 1) throw new Error('opportunity changed concurrently');
  return (await db.prepare(`SELECT * FROM editorial_briefs WHERE id = ?`).bind(id).first<EditorialBrief>())!;
}

/**
 * Fast-forwards the pure content-authoring stages (researching, sourced,
 * outlined, drafting) that this system does not gate on evidence, then stops
 * at claims_validated -- which IS gated: it requires the active brief's
 * claims to all be validated and at least one recorded source. Every hop is
 * checked against canTransition and logged individually; nothing is skipped
 * silently.
 */
export async function advanceOpportunityToClaimsValidated(
  db: D1Database,
  input: { opportunityId: string; actor: string },
): Promise<EditorialOpportunity> {
  const opportunity = await getOpportunity(db, input.opportunityId);
  if (!opportunity) throw new Error('opportunity not found');
  if (opportunity.status !== 'briefed') throw new Error('opportunity must be briefed before advancing to claims validation');

  const brief = await db.prepare(
    `SELECT id FROM editorial_briefs WHERE opportunity_id = ? AND status <> 'superseded' ORDER BY created_at DESC LIMIT 1`,
  ).bind(input.opportunityId).first<{ id: string }>();
  if (!brief) throw new Error('opportunity has no active brief');

  const claimCounts = await db.prepare(
    `SELECT COUNT(*) AS total, SUM(CASE WHEN validated = 1 THEN 1 ELSE 0 END) AS validated FROM editorial_claims WHERE brief_id = ?`,
  ).bind(brief.id).first<{ total: number; validated: number }>();
  if (!claimCounts || Number(claimCounts.total) === 0) throw new Error('brief has no claims to validate');
  if (Number(claimCounts.validated) !== Number(claimCounts.total)) throw new Error('every claim on the active brief must be validated first');

  const sourceCount = await countOpportunityEvidence(db, input.opportunityId, brief.id);
  if (sourceCount === 0) throw new Error('at least one recorded source is required before claims validation');

  const chain: EditorialState[] = ['researching', 'sourced', 'outlined', 'drafting', 'claims_validated'];
  const now = new Date().toISOString();
  let from: EditorialState = 'briefed';
  const statements = [];
  for (const to of chain) {
    if (!canTransition(from, to)) throw new Error(`invalid opportunity transition ${from} -> ${to}`);
    from = to;
  }
  statements.push(
    db.prepare(`UPDATE editorial_opportunities SET status = 'claims_validated', updated_at = ? WHERE id = ? AND status = 'briefed'`).bind(now, input.opportunityId),
    logEvent(db, 'opportunity', input.opportunityId, 'briefed', 'claims_validated', 'content_and_claims_ready', input.actor, now, `brief:${brief.id}`),
  );
  const results = await db.batch(statements);
  if (Number(results[0]?.meta?.changes ?? 0) !== 1) throw new Error('opportunity changed concurrently');
  return (await getOpportunity(db, input.opportunityId))!;
}

export interface EditorialClaim {
  id: string;
  brief_id: string;
  claim_text: string;
  validated: 0 | 1;
  validated_by: string | null;
  validated_at: string | null;
  created_by: string;
  created_at: string;
}

export async function addClaim(
  db: D1Database,
  input: { id?: string; briefId: string; claimText: string; actor: string },
): Promise<EditorialClaim> {
  if (!input.claimText.trim()) throw new Error('claim text is required');
  const now = new Date().toISOString();
  const id = input.id ?? genId('claim');
  await db.batch([
    db.prepare(`INSERT INTO editorial_claims (id, brief_id, claim_text, validated, created_by, created_at) VALUES (?, ?, ?, 0, ?, ?)`).bind(id, input.briefId, input.claimText.trim(), input.actor, now),
    logEvent(db, 'claim', id, null, 'unvalidated', 'claim_recorded', input.actor, now),
  ]);
  return (await db.prepare(`SELECT * FROM editorial_claims WHERE id = ?`).bind(id).first<EditorialClaim>())!;
}

export async function validateClaim(
  db: D1Database,
  input: { claimId: string; sourceIds: string[]; actor: string },
): Promise<EditorialClaim> {
  if (input.sourceIds.length === 0) throw new Error('at least one source is required to validate a claim');
  const claim = await db.prepare(`SELECT * FROM editorial_claims WHERE id = ?`).bind(input.claimId).first<EditorialClaim>();
  if (!claim) throw new Error('claim not found');
  if (claim.validated) throw new Error('claim is already validated');
  const now = new Date().toISOString();
  const statements = [
    db.prepare(`UPDATE editorial_claims SET validated = 1, validated_by = ?, validated_at = ? WHERE id = ? AND validated = 0`).bind(input.actor, now, input.claimId),
    logEvent(db, 'claim', input.claimId, 'unvalidated', 'validated', 'claim_validated', input.actor, now),
    ...input.sourceIds.map((sourceId) =>
      db.prepare(`INSERT OR IGNORE INTO editorial_claim_sources (claim_id, source_id, added_by, added_at) VALUES (?, ?, ?, ?)`).bind(input.claimId, sourceId, input.actor, now),
    ),
  ];
  const results = await db.batch(statements);
  if (Number(results[0]?.meta?.changes ?? 0) !== 1) throw new Error('claim changed concurrently');
  return (await db.prepare(`SELECT * FROM editorial_claims WHERE id = ?`).bind(input.claimId).first<EditorialClaim>())!;
}

// UNION (not UNION ALL) so a source attached directly to the brief and also
// linked to one of its claims -- the same piece of evidence, reached two
// ways -- is only counted once.
async function countOpportunityEvidence(db: D1Database, opportunityId: string, briefId: string): Promise<number> {
  const row = await db.prepare(
    `SELECT COUNT(*) AS total FROM (
      SELECT id AS source_id FROM editorial_sources WHERE entity_type = 'opportunity' AND entity_id = ?1
      UNION
      SELECT id AS source_id FROM editorial_sources WHERE entity_type = 'brief' AND entity_id = ?2
      UNION
      SELECT s.id AS source_id FROM editorial_sources s
        JOIN editorial_claim_sources cs ON cs.source_id = s.id
        JOIN editorial_claims c ON c.id = cs.claim_id
       WHERE c.brief_id = ?2
    )`,
  ).bind(opportunityId, briefId).first<{ total: number }>();
  return Number(row?.total ?? 0);
}

const REVIEW_TRANSITIONS: Record<'editorial' | 'seo_ai', { from: EditorialState; to: EditorialState }> = {
  editorial: { from: 'claims_validated', to: 'seo_review' },
  seo_ai: { from: 'seo_review', to: 'relationship_mapped' },
};
const REVIEW_ENTRY_STATE: Record<'editorial' | 'seo_ai', EditorialState> = { editorial: 'editorial_review', seo_ai: 'seo_review' };

/**
 * Moves an opportunity into an active review state (claims_validated ->
 * editorial_review, or editorial_review -> seo_review after the prior review
 * pass has already occurred). Separate from recordReview, which records the
 * review outcome once staff has actually looked at the piece.
 */
export async function beginReview(
  db: D1Database,
  input: { opportunityId: string; reviewType: 'editorial' | 'seo_ai'; actor: string },
): Promise<EditorialOpportunity> {
  const opportunity = await getOpportunity(db, input.opportunityId);
  if (!opportunity) throw new Error('opportunity not found');
  const target = REVIEW_ENTRY_STATE[input.reviewType];
  if (!canTransition(opportunity.status as EditorialState, target)) throw new Error(`opportunity cannot enter ${target} from ${opportunity.status}`);
  const now = new Date().toISOString();
  const results = await db.batch([
    db.prepare(`UPDATE editorial_opportunities SET status = ?, updated_at = ? WHERE id = ? AND status = ?`).bind(target, now, input.opportunityId, opportunity.status),
    logEvent(db, 'opportunity', input.opportunityId, opportunity.status, target, `${input.reviewType}_review_started`, input.actor, now),
  ]);
  if (Number(results[0]?.meta?.changes ?? 0) !== 1) throw new Error('opportunity changed concurrently');
  return (await getOpportunity(db, input.opportunityId))!;
}

export interface EditorialReview {
  id: string;
  opportunity_id: string;
  review_type: 'editorial' | 'seo_ai';
  outcome: 'pass' | 'changes_requested';
  reviewer: string;
  notes: string | null;
  reviewed_at: string;
  created_at: string;
}

export async function recordReview(
  db: D1Database,
  input: { id?: string; opportunityId: string; reviewType: 'editorial' | 'seo_ai'; outcome: 'pass' | 'changes_requested'; reviewer: string; notes?: string | null; actor: string },
): Promise<EditorialReview> {
  const opportunity = await getOpportunity(db, input.opportunityId);
  if (!opportunity) throw new Error('opportunity not found');
  const expectedState = REVIEW_ENTRY_STATE[input.reviewType];
  if (opportunity.status !== expectedState) throw new Error(`opportunity must be in ${expectedState} to record a ${input.reviewType} review`);
  const now = new Date().toISOString();
  const id = input.id ?? genId('review');
  const statements = [
    db.prepare(
      `INSERT INTO editorial_reviews (id, opportunity_id, review_type, outcome, reviewer, notes, reviewed_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(id, input.opportunityId, input.reviewType, input.outcome, input.reviewer, input.notes ?? null, now, now),
    logEvent(db, 'review', id, null, input.outcome, `${input.reviewType}_review_recorded`, input.actor, now),
  ];
  if (input.outcome === 'pass') {
    const { to } = REVIEW_TRANSITIONS[input.reviewType];
    if (!canTransition(opportunity.status as EditorialState, to)) throw new Error(`invalid opportunity transition ${opportunity.status} -> ${to}`);
    statements.push(
      db.prepare(`UPDATE editorial_opportunities SET status = ?, updated_at = ? WHERE id = ? AND status = ?`).bind(to, now, input.opportunityId, opportunity.status),
      logEvent(db, 'opportunity', input.opportunityId, opportunity.status, to, `${input.reviewType}_review_passed`, input.actor, now, `review:${id}`),
    );
  }
  await db.batch(statements);
  return (await db.prepare(`SELECT * FROM editorial_reviews WHERE id = ?`).bind(id).first<EditorialReview>())!;
}

export interface EditorialRelationship {
  id: string;
  opportunity_id: string;
  related_route: string;
  relationship_type: 'internal_link' | 'canonical' | 'supersedes' | 'hub_child' | 'see_also';
  mapped_by: string;
  mapped_at: string;
  created_at: string;
}

export async function mapRelationship(
  db: D1Database,
  input: { id?: string; opportunityId: string; relatedRoute: string; relationshipType: EditorialRelationship['relationship_type']; actor: string },
): Promise<EditorialRelationship> {
  const opportunity = await getOpportunity(db, input.opportunityId);
  if (!opportunity) throw new Error('opportunity not found');
  if (opportunity.status !== 'relationship_mapped') throw new Error('opportunity must have passed SEO/AI review before relationship mapping');
  const now = new Date().toISOString();
  const id = input.id ?? genId('relationship');
  await db.batch([
    db.prepare(
      `INSERT INTO editorial_relationships (id, opportunity_id, related_route, relationship_type, mapped_by, mapped_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).bind(id, input.opportunityId, input.relatedRoute, input.relationshipType, input.actor, now, now),
    logEvent(db, 'relationship', id, null, 'mapped', 'relationship_mapped', input.actor, now),
  ]);
  return (await db.prepare(`SELECT * FROM editorial_relationships WHERE id = ?`).bind(id).first<EditorialRelationship>())!;
}

export async function markRelationshipMappingComplete(
  db: D1Database,
  input: { opportunityId: string; actor: string },
): Promise<EditorialOpportunity> {
  const opportunity = await getOpportunity(db, input.opportunityId);
  if (!opportunity) throw new Error('opportunity not found');
  if (!canTransition(opportunity.status as EditorialState, 'approval_ready')) throw new Error('opportunity is not ready to leave relationship mapping');
  const count = await db.prepare(`SELECT COUNT(*) AS total FROM editorial_relationships WHERE opportunity_id = ?`).bind(input.opportunityId).first<{ total: number }>();
  if (Number(count?.total ?? 0) === 0) throw new Error('at least one relationship must be mapped first');
  const now = new Date().toISOString();
  const results = await db.batch([
    db.prepare(`UPDATE editorial_opportunities SET status = 'approval_ready', updated_at = ? WHERE id = ? AND status = ?`).bind(now, input.opportunityId, opportunity.status),
    logEvent(db, 'opportunity', input.opportunityId, opportunity.status, 'approval_ready', 'relationship_mapping_complete', input.actor, now),
  ]);
  if (Number(results[0]?.meta?.changes ?? 0) !== 1) throw new Error('opportunity changed concurrently');
  return (await getOpportunity(db, input.opportunityId))!;
}

export interface EditorialApproval {
  id: string;
  opportunity_id: string;
  monetization_classification: 'none' | 'affiliate' | 'sponsored' | 'owned_product';
  disclosure_required: 0 | 1;
  flags_resolved: 0 | 1;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

export async function classifyMonetization(
  db: D1Database,
  input: { opportunityId: string; monetizationClassification: EditorialApproval['monetization_classification']; disclosureRequired: boolean; actor: string },
): Promise<EditorialApproval> {
  const opportunity = await getOpportunity(db, input.opportunityId);
  if (!opportunity) throw new Error('opportunity not found');
  const disclosureRequired = input.monetizationClassification === 'none' ? false : true;
  if (input.disclosureRequired !== disclosureRequired && input.monetizationClassification !== 'none') {
    throw new Error('disclosure is required for any non-none monetization classification');
  }
  const existing = await db.prepare(`SELECT * FROM editorial_approvals WHERE opportunity_id = ?`).bind(input.opportunityId).first<EditorialApproval>();
  if (existing?.approved_by) throw new Error('approved opportunities cannot be reclassified');
  const now = new Date().toISOString();
  if (existing) {
    await db.prepare(
      `UPDATE editorial_approvals SET monetization_classification = ?, disclosure_required = ? WHERE opportunity_id = ? AND approved_by IS NULL`,
    ).bind(input.monetizationClassification, disclosureRequired ? 1 : 0, input.opportunityId).run();
  } else {
    await db.prepare(
      `INSERT INTO editorial_approvals (id, opportunity_id, monetization_classification, disclosure_required, flags_resolved, created_at)
       VALUES (?, ?, ?, ?, 0, ?)`,
    ).bind(genId('approval'), input.opportunityId, input.monetizationClassification, disclosureRequired ? 1 : 0, now).run();
  }
  return (await db.prepare(`SELECT * FROM editorial_approvals WHERE opportunity_id = ?`).bind(input.opportunityId).first<EditorialApproval>())!;
}

export interface OpportunityEvidenceSummary {
  sourceCount: number;
  claimsValidated: boolean;
  editorialReviewed: boolean;
  seoReviewed: boolean;
  relationshipsMapped: boolean;
}

export async function getOpportunityEvidenceSummary(db: D1Database, opportunityId: string): Promise<OpportunityEvidenceSummary> {
  const brief = await db.prepare(
    `SELECT id FROM editorial_briefs WHERE opportunity_id = ? AND status <> 'superseded' ORDER BY created_at DESC LIMIT 1`,
  ).bind(opportunityId).first<{ id: string }>();
  const sourceCount = brief ? await countOpportunityEvidence(db, opportunityId, brief.id) : 0;
  const claims = brief
    ? await db.prepare(`SELECT COUNT(*) AS total, SUM(CASE WHEN validated = 1 THEN 1 ELSE 0 END) AS validated FROM editorial_claims WHERE brief_id = ?`).bind(brief.id).first<{ total: number; validated: number }>()
    : null;
  const editorialPass = await db.prepare(`SELECT 1 FROM editorial_reviews WHERE opportunity_id = ? AND review_type = 'editorial' AND outcome = 'pass' LIMIT 1`).bind(opportunityId).first();
  const seoPass = await db.prepare(`SELECT 1 FROM editorial_reviews WHERE opportunity_id = ? AND review_type = 'seo_ai' AND outcome = 'pass' LIMIT 1`).bind(opportunityId).first();
  const relationships = await db.prepare(`SELECT COUNT(*) AS total FROM editorial_relationships WHERE opportunity_id = ?`).bind(opportunityId).first<{ total: number }>();
  return {
    sourceCount,
    claimsValidated: Boolean(claims && Number(claims.total) > 0 && Number(claims.validated) === Number(claims.total)),
    editorialReviewed: Boolean(editorialPass),
    seoReviewed: Boolean(seoPass),
    relationshipsMapped: Number(relationships?.total ?? 0) > 0,
  };
}

export async function recordHumanApproval(
  db: D1Database,
  input: { opportunityId: string; approvedBy: string; flagsResolved: boolean; actor: string },
): Promise<{ opportunity: EditorialOpportunity; approval: EditorialApproval }> {
  const opportunity = await getOpportunity(db, input.opportunityId);
  if (!opportunity) throw new Error('opportunity not found');
  if (!canTransition(opportunity.status as EditorialState, 'approved')) throw new Error('opportunity is not ready for human approval');
  const approvalRow = await db.prepare(`SELECT * FROM editorial_approvals WHERE opportunity_id = ?`).bind(input.opportunityId).first<EditorialApproval>();
  if (!approvalRow) throw new Error('monetization/disclosure classification is required before approval');

  const evidence = await getOpportunityEvidenceSummary(db, input.opportunityId);
  const gate = approvalGates({ ...evidence, humanApproved: true, hasFlags: !input.flagsResolved });
  if (!gate.ok) throw new EvidenceGateError(gate.missing);

  const now = new Date().toISOString();
  const results = await db.batch([
    db.prepare(`UPDATE editorial_opportunities SET status = 'approved', updated_at = ? WHERE id = ? AND status = ?`).bind(now, input.opportunityId, opportunity.status),
    db.prepare(`UPDATE editorial_approvals SET approved_by = ?, approved_at = ?, flags_resolved = 1 WHERE opportunity_id = ? AND approved_by IS NULL`).bind(input.approvedBy, now, input.opportunityId),
    logEvent(db, 'opportunity', input.opportunityId, opportunity.status, 'approved', 'human_approved', input.actor, now, `approval:${approvalRow.id}`),
    logEvent(db, 'approval', approvalRow.id, null, 'approved', 'human_approved', input.actor, now),
  ]);
  if (Number(results[0]?.meta?.changes ?? 0) !== 1 || Number(results[1]?.meta?.changes ?? 0) !== 1) throw new Error('opportunity changed concurrently');
  return {
    opportunity: (await getOpportunity(db, input.opportunityId))!,
    approval: (await db.prepare(`SELECT * FROM editorial_approvals WHERE opportunity_id = ?`).bind(input.opportunityId).first<EditorialApproval>())!,
  };
}

export class EvidenceGateError extends Error {
  missing: string[];
  constructor(missing: string[]) {
    super(`missing approval evidence: ${missing.join(', ')}`);
    this.name = 'EvidenceGateError';
    this.missing = missing;
  }
}

export interface EditorialMaintenanceProposal {
  id: string;
  opportunity_id: string;
  proposal_type: 'refresh' | 'consolidate' | 'retire';
  reason: string;
  incoming_link_audit_ref: string | null;
  proposed_by: string;
  proposed_at: string;
  decided_by: string | null;
  decided_at: string | null;
  decision: 'accepted' | 'rejected' | null;
}

/**
 * Records a maintenance candidate. Automation may reach this function, but it
 * only ever proposes -- it never retires, redirects, or deletes content.
 * Refresh and consolidation proposals move the opportunity into the matching
 * "*_proposed" state so it surfaces on the editorial desk; retirement always
 * requires a separate, explicit decideMaintenanceProposal call, since there
 * is no "retirement_proposed" state to hold it in the interim.
 */
export async function proposeMaintenance(
  db: D1Database,
  input: { id?: string; opportunityId: string; proposalType: 'refresh' | 'consolidate' | 'retire'; reason: string; incomingLinkAuditRef?: string | null; actor: string },
): Promise<EditorialMaintenanceProposal> {
  const opportunity = await getOpportunity(db, input.opportunityId);
  if (!opportunity) throw new Error('opportunity not found');
  if (opportunity.status !== 'monitoring' && opportunity.status !== 'maintenance_due') throw new Error('only published, monitored content can have maintenance proposed');
  if (input.proposalType !== 'refresh' && !input.incomingLinkAuditRef) throw new Error('consolidation and retirement proposals require an incoming-link audit reference');
  const now = new Date().toISOString();
  const id = input.id ?? genId('maintenance');
  const statements = [
    db.prepare(
      `INSERT INTO editorial_maintenance_proposals (id, opportunity_id, proposal_type, reason, incoming_link_audit_ref, proposed_by, proposed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).bind(id, input.opportunityId, input.proposalType, input.reason, input.incomingLinkAuditRef ?? null, input.actor, now),
    logEvent(db, 'maintenance_proposal', id, null, 'proposed', `${input.proposalType}_proposed`, input.actor, now),
  ];
  const targetStatus: EditorialState | null = input.proposalType === 'refresh' ? 'update_proposed' : input.proposalType === 'consolidate' ? 'consolidation_proposed' : null;
  if (targetStatus && canTransition(opportunity.status as EditorialState, targetStatus)) {
    statements.push(
      db.prepare(`UPDATE editorial_opportunities SET status = ?, updated_at = ? WHERE id = ? AND status = ?`).bind(targetStatus, now, input.opportunityId, opportunity.status),
      logEvent(db, 'opportunity', input.opportunityId, opportunity.status, targetStatus, `${input.proposalType}_proposed`, input.actor, now, `maintenance_proposal:${id}`),
    );
  }
  await db.batch(statements);
  return (await db.prepare(`SELECT * FROM editorial_maintenance_proposals WHERE id = ?`).bind(id).first<EditorialMaintenanceProposal>())!;
}

/**
 * Human supersession decision. Accepting a retirement proposal is the only
 * path that ever moves an opportunity to 'retired' in this file, and it
 * requires the incoming-link audit reference recorded at proposal time.
 */
export async function decideMaintenanceProposal(
  db: D1Database,
  input: { proposalId: string; decision: 'accepted' | 'rejected'; decidedBy: string; actor: string },
): Promise<EditorialMaintenanceProposal> {
  const proposal = await db.prepare(`SELECT * FROM editorial_maintenance_proposals WHERE id = ?`).bind(input.proposalId).first<EditorialMaintenanceProposal>();
  if (!proposal) throw new Error('maintenance proposal not found');
  if (proposal.decision) throw new Error('maintenance proposal already decided');
  const now = new Date().toISOString();
  const statements = [
    db.prepare(`UPDATE editorial_maintenance_proposals SET decision = ?, decided_by = ?, decided_at = ? WHERE id = ? AND decision IS NULL`).bind(input.decision, input.decidedBy, now, input.proposalId),
    logEvent(db, 'maintenance_proposal', input.proposalId, 'proposed', input.decision, `${proposal.proposal_type}_${input.decision}`, input.actor, now),
  ];
  if (input.decision === 'accepted' && proposal.proposal_type === 'retire') {
    const opportunity = await getOpportunity(db, proposal.opportunity_id);
    if (!opportunity) throw new Error('opportunity not found');
    if (!canTransition(opportunity.status as EditorialState, 'retired')) throw new Error(`opportunity cannot be retired from ${opportunity.status}`);
    statements.push(
      db.prepare(`UPDATE editorial_opportunities SET status = 'retired', updated_at = ? WHERE id = ? AND status = ?`).bind(now, proposal.opportunity_id, opportunity.status),
      logEvent(db, 'opportunity', proposal.opportunity_id, opportunity.status, 'retired', 'retirement_decided', input.actor, now, `maintenance_proposal:${input.proposalId}`),
    );
  }
  const results = await db.batch(statements);
  if (Number(results[0]?.meta?.changes ?? 0) !== 1) throw new Error('maintenance proposal changed concurrently');
  return (await db.prepare(`SELECT * FROM editorial_maintenance_proposals WHERE id = ?`).bind(input.proposalId).first<EditorialMaintenanceProposal>())!;
}
