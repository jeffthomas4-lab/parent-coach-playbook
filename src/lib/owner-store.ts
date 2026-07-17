import type { D1Database, D1Result } from '@cloudflare/workers-types';
import { validateProposedPatch } from './owner-workflows';

const OWNER_WRITE_ROLES = "'owner','admin'";
const EDIT_ROLES = "'owner','admin','editor'";

function changes(result: D1Result<unknown> | undefined): number {
  return Number(result?.meta?.changes ?? 0);
}

function requireCoupledResults(results: D1Result<unknown>[], operation: string): 'created' | 'denied' {
  const counts = results.map(changes);
  if (counts.every((count) => count === 1)) return 'created';
  if (counts.every((count) => count === 0)) return 'denied';
  throw new Error(`${operation} transaction invariant violated`);
}

export async function createOwnerClaim(db: D1Database, input: {
  claimId: string;
  eventId: string;
  customerUserId: string;
  customerOrganizationId: string;
  directoryOrganizationRef: string;
  occurredAt: string;
  idempotencyKey: string;
}): Promise<'created' | 'denied'> {
  const insert = db.prepare(
    `INSERT INTO owner_claims
       (id, claimant_customer_user_id, customer_organization_id,
        directory_organization_ref, status, created_at, updated_at, version)
     SELECT ?1, ?2, ?3, ?4, 'draft', ?5, ?5, 1
      WHERE EXISTS (
        SELECT 1 FROM organization_memberships m
        JOIN customer_users u ON u.id = m.customer_user_id
        JOIN customer_organizations o ON o.id = m.organization_id
        WHERE m.customer_user_id = ?2 AND m.organization_id = ?3
          AND m.status = 'active' AND m.role IN (${OWNER_WRITE_ROLES})
          AND u.status = 'active' AND o.status = 'active'
      )`,
  ).bind(input.claimId, input.customerUserId, input.customerOrganizationId,
    input.directoryOrganizationRef, input.occurredAt);
  const event = db.prepare(
    `INSERT INTO owner_claim_events
       (id, owner_claim_id, event_type, actor_type, actor_ref,
        prior_status, next_status, occurred_at, idempotency_key)
     SELECT ?1, id, 'claim_created', 'customer', ?2,
            NULL, 'draft', ?3, ?4
       FROM owner_claims WHERE id = ?5 AND claimant_customer_user_id = ?2`,
  ).bind(input.eventId, input.customerUserId, input.occurredAt, input.idempotencyKey, input.claimId);
  return requireCoupledResults(await db.batch([insert, event]), 'owner claim creation');
}

export async function submitOwnerClaim(db: D1Database, input: {
  claimId: string;
  eventId: string;
  customerUserId: string;
  occurredAt: string;
  idempotencyKey: string;
  expectedFromStatus: 'draft' | 'rejected' | 'evidence_required';
}): Promise<'created' | 'denied'> {
  const update = db.prepare(
    `UPDATE owner_claims
        SET status = 'submitted', submitted_at = ?1, updated_at = ?1,
            version = version + 1
      WHERE id = ?2 AND status = ?4
        AND EXISTS (
          SELECT 1 FROM organization_memberships m
          JOIN customer_users u ON u.id = m.customer_user_id
          JOIN customer_organizations o ON o.id = m.organization_id
          WHERE m.customer_user_id = ?3
            AND m.organization_id = owner_claims.customer_organization_id
            AND m.status = 'active' AND m.role IN (${OWNER_WRITE_ROLES})
            AND u.status = 'active' AND o.status = 'active'
        )`,
  ).bind(input.occurredAt, input.claimId, input.customerUserId, input.expectedFromStatus);
  const event = db.prepare(
    `INSERT INTO owner_claim_events
       (id, owner_claim_id, event_type, actor_type, actor_ref,
        prior_status, next_status, occurred_at, idempotency_key)
     SELECT ?1, id, 'claim_submitted', 'customer', ?2,
            ?6, 'submitted', ?3, ?4
       FROM owner_claims WHERE id = ?5 AND status = 'submitted'
         AND updated_at = ?3`,
  ).bind(input.eventId, input.customerUserId, input.occurredAt, input.idempotencyKey, input.claimId, input.expectedFromStatus);
  return requireCoupledResults(await db.batch([update, event]), 'owner claim submission');
}

export async function createProposedEdit(db: D1Database, input: {
  proposedEditId: string;
  eventId: string;
  customerUserId: string;
  customerOrganizationId: string;
  directoryOrganizationRef: string;
  baseRecordSha256: string;
  proposedPatch: Readonly<Record<string, unknown>>;
  proposedPatchSha256: string;
  occurredAt: string;
  idempotencyKey: string;
  allowedFields: ReadonlySet<string>;
  immutableFields: ReadonlySet<string>;
}): Promise<'created' | 'denied' | 'invalid_patch'> {
  if (!validateProposedPatch({ patch: input.proposedPatch, allowedFields: input.allowedFields, immutableFields: input.immutableFields }).valid) return 'invalid_patch';
  const insert = db.prepare(
    `INSERT INTO owner_proposed_edits
       (id, customer_organization_id, directory_organization_ref,
        proposed_by_customer_user_id, base_record_sha256, proposed_patch_json,
        proposed_patch_sha256, status, created_at, updated_at, version)
     SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7, 'draft', ?8, ?8, 1
      WHERE EXISTS (
        SELECT 1 FROM organization_memberships m
        JOIN customer_users u ON u.id = m.customer_user_id
        JOIN customer_organizations o ON o.id = m.organization_id
        WHERE m.customer_user_id = ?4 AND m.organization_id = ?2
          AND m.status = 'active' AND m.role IN (${EDIT_ROLES})
          AND u.status = 'active' AND o.status = 'active'
      ) AND EXISTS (
        SELECT 1 FROM owner_claims c
        WHERE c.customer_organization_id = ?2
          AND c.directory_organization_ref = ?3 AND c.status = 'verified'
      )`,
  ).bind(input.proposedEditId, input.customerOrganizationId, input.directoryOrganizationRef,
    input.customerUserId, input.baseRecordSha256, JSON.stringify(input.proposedPatch),
    input.proposedPatchSha256, input.occurredAt);
  const event = db.prepare(
    `INSERT INTO owner_proposed_edit_events
       (id, proposed_edit_id, event_type, actor_type, actor_ref,
        prior_status, next_status, occurred_at, idempotency_key)
     SELECT ?1, id, 'edit_created', 'customer', ?2,
            NULL, 'draft', ?3, ?4
       FROM owner_proposed_edits WHERE id = ?5 AND proposed_by_customer_user_id = ?2`,
  ).bind(input.eventId, input.customerUserId, input.occurredAt, input.idempotencyKey, input.proposedEditId);
  return requireCoupledResults(await db.batch([insert, event]), 'proposed edit creation');
}

export async function decideOwnerClaim(db: D1Database, input: {
  claimId: string;
  eventId: string;
  verifiedStaffRef: string;
  expectedFromStatus: 'under_review' | 'disputed' | 'suspended';
  decision: 'verified' | 'rejected' | 'suspended';
  reasonCode: string;
  occurredAt: string;
  idempotencyKey: string;
}): Promise<'created' | 'denied'> {
  if (!input.verifiedStaffRef.trim() || !input.reasonCode.trim()) return 'denied';
  const update = db.prepare(
    `UPDATE owner_claims
        SET status = ?1, decided_at = ?2, decided_by_staff_ref = ?3,
            decision_reason_code = ?4, updated_at = ?2, version = version + 1
      WHERE id = ?5 AND status = ?6
        AND (?1 <> 'verified' OR EXISTS (
          SELECT 1 FROM owner_claim_evidence e
          WHERE e.owner_claim_id = owner_claims.id AND e.review_status = 'accepted'
        ))`,
  ).bind(input.decision, input.occurredAt, input.verifiedStaffRef, input.reasonCode,
    input.claimId, input.expectedFromStatus);
  const event = db.prepare(
    `INSERT INTO owner_claim_events
       (id, owner_claim_id, event_type, actor_type, actor_ref, prior_status,
        next_status, reason_code, occurred_at, idempotency_key)
     SELECT ?1, id, 'claim_decided', 'staff', ?2, ?3, ?4, ?5, ?6, ?7
       FROM owner_claims WHERE id = ?8 AND status = ?4 AND updated_at = ?6`,
  ).bind(input.eventId, input.verifiedStaffRef, input.expectedFromStatus, input.decision,
    input.reasonCode, input.occurredAt, input.idempotencyKey, input.claimId);
  return requireCoupledResults(await db.batch([update, event]), 'owner claim decision');
}

async function transitionProposedEditInternal(db: D1Database, input: {
  proposedEditId: string;
  eventId: string;
  actorType: 'customer' | 'staff';
  actorRef: string;
  expectedFromStatus: 'draft' | 'submitted' | 'under_review' | 'conflict';
  nextStatus: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'superseded' | 'withdrawn' | 'conflict';
  reasonCode?: string;
  occurredAt: string;
  idempotencyKey: string;
}): Promise<'created' | 'denied'> {
  const staffOnly = new Set(['under_review', 'approved', 'rejected', 'conflict', 'superseded']);
  if (staffOnly.has(input.nextStatus) && input.actorType !== 'staff') return 'denied';
  if (['approved', 'rejected', 'conflict'].includes(input.nextStatus) && !input.reasonCode?.trim()) return 'denied';
  const update = db.prepare(
    `UPDATE owner_proposed_edits
        SET status = ?1, submitted_at = CASE WHEN ?1 = 'submitted' THEN ?2 ELSE submitted_at END,
            decided_at = CASE WHEN ?1 IN ('approved','rejected') THEN ?2 ELSE decided_at END,
            decided_by_staff_ref = CASE WHEN ?1 IN ('approved','rejected') THEN ?3 ELSE decided_by_staff_ref END,
            decision_reason_code = CASE WHEN ?1 IN ('approved','rejected') THEN ?4 ELSE decision_reason_code END,
            updated_at = ?2, version = version + 1
      WHERE id = ?5 AND status = ?6
        AND (?7 = 'staff' OR (
          proposed_by_customer_user_id = ?3 AND EXISTS (
            SELECT 1 FROM organization_memberships m
            JOIN customer_users u ON u.id = m.customer_user_id
            JOIN customer_organizations o ON o.id = m.organization_id
            WHERE m.customer_user_id = ?3
              AND m.organization_id = owner_proposed_edits.customer_organization_id
              AND m.status = 'active' AND m.role IN (${EDIT_ROLES})
              AND u.status = 'active' AND o.status = 'active'
          )
        ))`,
  ).bind(input.nextStatus, input.occurredAt, input.actorRef, input.reasonCode ?? null,
    input.proposedEditId, input.expectedFromStatus, input.actorType);
  const event = db.prepare(
    `INSERT INTO owner_proposed_edit_events
       (id, proposed_edit_id, event_type, actor_type, actor_ref, prior_status,
        next_status, reason_code, occurred_at, idempotency_key)
     SELECT ?1, id, 'edit_transitioned', ?2, ?3, ?4, ?5, ?6, ?7, ?8
       FROM owner_proposed_edits WHERE id = ?9 AND status = ?5 AND updated_at = ?7`,
  ).bind(input.eventId, input.actorType, input.actorRef, input.expectedFromStatus,
    input.nextStatus, input.reasonCode ?? null, input.occurredAt, input.idempotencyKey,
    input.proposedEditId);
  return requireCoupledResults(await db.batch([update, event]), 'proposed edit transition');
}

export function transitionProposedEditByCustomer(db: D1Database, input: {
  proposedEditId: string;
  eventId: string;
  customerUserId: string;
  expectedFromStatus: 'draft' | 'submitted' | 'conflict';
  nextStatus: 'submitted' | 'withdrawn';
  reasonCode?: string;
  occurredAt: string;
  idempotencyKey: string;
}): Promise<'created' | 'denied'> {
  return transitionProposedEditInternal(db, { ...input, actorType: 'customer', actorRef: input.customerUserId });
}

export function transitionProposedEditByStaff(db: D1Database, input: {
  proposedEditId: string;
  eventId: string;
  verifiedStaffRef: string;
  expectedFromStatus: 'submitted' | 'under_review' | 'conflict';
  nextStatus: 'under_review' | 'approved' | 'rejected' | 'superseded' | 'conflict';
  reasonCode?: string;
  occurredAt: string;
  idempotencyKey: string;
}): Promise<'created' | 'denied'> {
  if (!input.verifiedStaffRef.trim()) return Promise.resolve('denied');
  return transitionProposedEditInternal(db, { ...input, actorType: 'staff', actorRef: input.verifiedStaffRef });
}
