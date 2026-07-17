import type { D1Database, D1Result } from '@cloudflare/workers-types';

function changes(result: D1Result<unknown> | undefined): number {
  return Number(result?.meta?.changes ?? 0);
}

function coupled(results: D1Result<unknown>[], operation: string): 'completed' | 'denied' {
  const counts = results.map(changes);
  if (counts.every((count) => count === 1)) return 'completed';
  if (counts.every((count) => count === 0)) return 'denied';
  throw new Error(`${operation} transaction invariant violated`);
}

export async function openOwnerDisputeByCustomer(db: D1Database, input: {
  disputeId: string;
  eventId: string;
  claimEventId: string;
  ownerClaimId: string;
  customerUserId: string;
  reasonCode: string;
  occurredAt: string;
  idempotencyKey: string;
}): Promise<'completed' | 'denied'> {
  if (!input.reasonCode.trim()) return 'denied';
  const dispute = db.prepare(
    `INSERT INTO owner_disputes
       (id, owner_claim_id, opened_by_type, opened_by_ref, reason_code,
        status, opened_at)
     SELECT ?1, c.id, 'customer', ?2, ?3, 'open', ?4
       FROM owner_claims c
      WHERE c.id = ?5 AND c.status IN ('verified','suspended')
        AND EXISTS (
          SELECT 1 FROM organization_memberships m
          JOIN customer_users u ON u.id = m.customer_user_id
          JOIN customer_organizations o ON o.id = m.organization_id
          WHERE m.customer_user_id = ?2
            AND m.organization_id = c.customer_organization_id
            AND m.status = 'active' AND m.role IN ('owner','admin')
            AND u.status = 'active' AND o.status = 'active'
        )`,
  ).bind(input.disputeId, input.customerUserId, input.reasonCode,
    input.occurredAt, input.ownerClaimId);
  const claim = db.prepare(
    `UPDATE owner_claims SET status = 'disputed', updated_at = ?1,
       version = version + 1 WHERE id = ?2 AND status IN ('verified','suspended')
       AND EXISTS (SELECT 1 FROM owner_disputes d WHERE d.id = ?3 AND d.status = 'open')`,
  ).bind(input.occurredAt, input.ownerClaimId, input.disputeId);
  const disputeEvent = db.prepare(
    `INSERT INTO owner_dispute_events
       (id, owner_dispute_id, owner_claim_id, event_type, actor_type,
        actor_ref, prior_status, next_status, reason_code, occurred_at, idempotency_key)
     SELECT ?1, d.id, d.owner_claim_id, 'dispute_opened', 'customer', ?2,
            NULL, 'open', d.reason_code, ?3, ?4
       FROM owner_disputes d WHERE d.id = ?5 AND d.status = 'open'`,
  ).bind(input.eventId, input.customerUserId, input.occurredAt,
    input.idempotencyKey, input.disputeId);
  const claimEvent = db.prepare(
    `INSERT INTO owner_claim_events
       (id, owner_claim_id, event_type, actor_type, actor_ref, prior_status,
        next_status, reason_code, occurred_at, idempotency_key)
     SELECT ?1, c.id, 'claim_disputed', 'customer', ?2, 'verified',
            'disputed', ?3, ?4, ?5
       FROM owner_claims c WHERE c.id = ?6 AND c.status = 'disputed'
         AND c.updated_at = ?4`,
  ).bind(input.claimEventId, input.customerUserId, input.reasonCode,
    input.occurredAt, `${input.idempotencyKey}:claim`, input.ownerClaimId);
  return coupled(await db.batch([dispute, claim, disputeEvent, claimEvent]), 'dispute opening');
}

export async function resolveOwnerDisputeByStaff(db: D1Database, input: {
  disputeId: string;
  eventId: string;
  claimEventId: string;
  verifiedStaffRef: string;
  resolution: 'resolved_upheld' | 'resolved_revoked' | 'closed_no_action';
  reasonCode: string;
  occurredAt: string;
  idempotencyKey: string;
}): Promise<'completed' | 'denied'> {
  if (!input.verifiedStaffRef.trim() || !input.reasonCode.trim()) return 'denied';
  const nextClaimStatus = input.resolution === 'resolved_upheld' ? 'verified' : 'suspended';
  const dispute = db.prepare(
    `UPDATE owner_disputes SET status = ?1, resolved_at = ?2,
       resolved_by_staff_ref = ?3, resolution_reason_code = ?4
     WHERE id = ?5 AND status IN ('open','evidence_required','under_review')`,
  ).bind(input.resolution, input.occurredAt, input.verifiedStaffRef,
    input.reasonCode, input.disputeId);
  const claim = db.prepare(
    `UPDATE owner_claims SET status = ?1, updated_at = ?2, version = version + 1
     WHERE id = (SELECT owner_claim_id FROM owner_disputes WHERE id = ?3 AND status = ?4)
       AND status = 'disputed'`,
  ).bind(nextClaimStatus, input.occurredAt, input.disputeId, input.resolution);
  const disputeEvent = db.prepare(
    `INSERT INTO owner_dispute_events
       (id, owner_dispute_id, owner_claim_id, event_type, actor_type,
        actor_ref, prior_status, next_status, reason_code, occurred_at, idempotency_key)
     SELECT ?1, id, owner_claim_id, 'dispute_resolved', 'staff', ?2,
            'open', ?3, ?4, ?5, ?6 FROM owner_disputes
      WHERE id = ?7 AND status = ?3 AND resolved_at = ?5`,
  ).bind(input.eventId, input.verifiedStaffRef, input.resolution,
    input.reasonCode, input.occurredAt, input.idempotencyKey, input.disputeId);
  const claimEvent = db.prepare(
    `INSERT INTO owner_claim_events
       (id, owner_claim_id, event_type, actor_type, actor_ref, prior_status,
        next_status, reason_code, occurred_at, idempotency_key)
     SELECT ?1, c.id, 'claim_dispute_resolved', 'staff', ?2, 'disputed',
            ?3, ?4, ?5, ?6 FROM owner_claims c
       JOIN owner_disputes d ON d.owner_claim_id = c.id
      WHERE d.id = ?7 AND d.status = ?8 AND c.status = ?3 AND c.updated_at = ?5`,
  ).bind(input.claimEventId, input.verifiedStaffRef, nextClaimStatus,
    input.reasonCode, input.occurredAt, `${input.idempotencyKey}:claim`,
    input.disputeId, input.resolution);
  return coupled(await db.batch([dispute, claim, disputeEvent, claimEvent]), 'dispute resolution');
}
