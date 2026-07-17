import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readFile, readdir } from 'node:fs/promises';
import { Miniflare } from 'miniflare';
import type { D1Database } from '@cloudflare/workers-types';
import { acceptCustomerInvitation, listAuthorizedOrganizations, recordIdentityProviderEvent } from '../src/lib/customer-store';
import { createOwnerClaim, createProposedEdit, decideOwnerClaim, submitOwnerClaim, transitionProposedEditByCustomer, transitionProposedEditByStaff } from '../src/lib/owner-store';
import { consumeRecoveryChallenge, recordRecoveryFailure } from '../src/lib/recovery-store';
import { openOwnerDisputeByCustomer, resolveOwnerDisputeByStaff } from '../src/lib/owner-dispute-store';
import { claimPrivacyCascadeExecution, recordPrivacyExportArtifact, settlePrivacyCascadeExecution } from '../src/lib/privacy-execution-store';
import { grantVerifiedEntitlement, reconcileVerifiedPayment, recordVerifiedCommerceEvent, requestRefundByStaff, settleVerifiedRefund } from '../src/lib/commerce-store';

const mf = new Miniflare({
  modules: true,
  script: 'export default { fetch() { return new Response("test only"); } }',
  compatibilityDate: '2026-07-15',
  d1Databases: { DB: '00000000-0000-0000-0000-000000000001' },
});

let db: D1Database;

beforeAll(async () => {
  db = await mf.getD1Database('DB') as unknown as D1Database;
  const directory = new URL('../migrations-pcd-ops/', import.meta.url);
  const migrations = (await readdir(directory)).filter((name) => name.endsWith('.sql')).sort();
  for (const migration of migrations) {
    const sql = (await readFile(new URL(migration, directory), 'utf8')).replace(/^--.*$/gm, '');
    for (const statement of sql.split(';').map((value) => value.trim()).filter(Boolean)) {
      await db.prepare(statement).run();
    }
  }

  await db.batch([
    db.prepare(`INSERT INTO customer_users (id,status,primary_email_normalized,email_verified_at,created_at,updated_at) VALUES (?1,'active',?2,?3,?3,?3)`).bind('user-owner', 'owner@example.com', '2026-07-16T00:00:00Z'),
    db.prepare(`INSERT INTO customer_users (id,status,primary_email_normalized,email_verified_at,created_at,updated_at) VALUES (?1,'active',?2,?3,?3,?3)`).bind('user-invitee', 'editor@example.com', '2026-07-16T00:00:00Z'),
    db.prepare(`INSERT INTO customer_organizations (id,display_name,status,created_by_customer_user_id,created_at,updated_at) VALUES (?1,?2,'active',?3,?4,?4)`).bind('org-1', 'Example Camp', 'user-owner', '2026-07-16T00:00:00Z'),
    db.prepare(`INSERT INTO organization_memberships (id,organization_id,customer_user_id,role,status,granted_by_customer_user_id,granted_at) VALUES (?1,?2,?3,'owner','active',?3,?4)`).bind('membership-owner', 'org-1', 'user-owner', '2026-07-16T00:00:00Z'),
    db.prepare(`INSERT INTO customer_invitations (id,organization_id,invited_email_normalized,proposed_role,token_sha256,invited_by_customer_user_id,status,created_at,expires_at) VALUES (?1,?2,?3,'editor',?4,?5,'pending',?6,?7)`).bind('invitation-1', 'org-1', 'editor@example.com', 'a'.repeat(64), 'user-owner', '2026-07-16T00:00:00Z', '2026-07-17T00:00:00Z'),
    db.prepare(`INSERT INTO customer_recovery_challenges (id,customer_user_id,purpose,token_sha256,status,attempts,max_attempts,created_at,expires_at,request_context_hash) VALUES (?1,?2,'account_recovery',?3,'pending',0,3,?4,?5,?6)`).bind('recovery-1', 'user-owner', '9'.repeat(64), '2026-07-16T00:00:00Z', '2026-07-17T00:00:00Z', '8'.repeat(64)),
    db.prepare(`INSERT INTO privacy_requests (id,idempotency_key,request_fingerprint,request_type,subject_ref,ownership_scope,identity_state,status,received_at,deactivated_at,sessions_revoked_at,created_at,updated_at) VALUES (?1,?2,?3,'deletion',?4,'self','verified','executing',?5,?5,?5,?5,?5)`).bind('privacy-1', 'privacy-key-1', '7'.repeat(64), 'user-owner', '2026-07-16T00:00:00Z'),
    db.prepare(`INSERT INTO privacy_cascade_items (id,request_id,system_code,record_class,authority_code,subject_ref,disposition,hold_state,state,attempt_count,verification_method,created_at,updated_at) VALUES (?1,?2,'identity','customer_identity','pcd','user-owner','delete','clear','pending',0,'provider_receipt',?3,?3)`).bind('cascade-1', 'privacy-1', '2026-07-16T00:00:00Z'),
    db.prepare(`INSERT INTO commerce_products (id,product_code,display_name,status,fulfillment_kind,created_at,updated_at) VALUES (?1,?2,?3,'active','featured_placement',?4,?4)`).bind('product-1', 'featured', 'Featured placement', '2026-07-16T00:00:00Z'),
    db.prepare(`INSERT INTO commerce_prices (id,product_id,currency,amount_minor,status,created_at,updated_at) VALUES (?1,?2,'USD',5000,'active',?3,?3)`).bind('price-1', 'product-1', '2026-07-16T00:00:00Z'),
    db.prepare(`INSERT INTO commerce_checkout_attempts (id,organization_id,customer_user_id,price_id,provider_code,provider_checkout_reference,state,idempotency_key,created_at,completed_at) VALUES (?1,?2,?3,?4,'disposable',?5,'completed',?6,?7,?7)`).bind('checkout-1', 'org-1', 'user-owner', 'price-1', 'checkout:test-1', 'checkout-key-1', '2026-07-16T00:00:00Z'),
    db.prepare(`INSERT INTO commerce_orders (id,organization_id,customer_user_id,checkout_attempt_id,price_id,provider_code,provider_order_reference,amount_minor,currency,state,created_at) VALUES (?1,?2,?3,?4,?5,'disposable',?6,5000,'USD','pending',?7)`).bind('order-1', 'org-1', 'user-owner', 'checkout-1', 'price-1', 'order:test-1', '2026-07-16T00:00:00Z'),
  ]);
});

afterAll(async () => mf.dispose());

describe('disposable D1 customer lifecycle', () => {
  it('atomically accepts a matching invitation and denies replay', async () => {
    const input = {
      invitationId: 'invitation-1', tokenSha256: 'a'.repeat(64),
      authenticatedCustomerUserId: 'user-invitee', authenticatedEmailNormalized: 'editor@example.com',
      membershipId: 'membership-invitee', acceptedAt: '2026-07-16T01:00:00Z',
    };
    await expect(acceptCustomerInvitation(db, input)).resolves.toBe('accepted');
    const stored = await db.prepare(`SELECT status, accepted_by_customer_user_id FROM customer_invitations WHERE id = ?1`).bind('invitation-1').first();
    expect(stored).toEqual(expect.objectContaining({ status: 'accepted', accepted_by_customer_user_id: 'user-invitee' }));
    await expect(acceptCustomerInvitation(db, { ...input, membershipId: 'membership-replay' })).resolves.toBe('not_eligible');
  });

  it('returns only the authenticated user active internal memberships', async () => {
    await expect(listAuthorizedOrganizations(db, 'user-invitee')).resolves.toEqual([
      { organizationId: 'org-1', displayName: 'Example Camp', role: 'editor' },
    ]);
    await expect(listAuthorizedOrganizations(db, 'unknown-user')).resolves.toEqual([]);
    await db.prepare(`UPDATE organization_memberships SET status = 'suspended' WHERE id = ?1`).bind('membership-invitee').run();
    await expect(listAuthorizedOrganizations(db, 'user-invitee')).resolves.toEqual([]);
  });

  it('deduplicates signed-provider event storage and detects payload conflicts', async () => {
    const event = { id: 'event-1', providerCode: 'disposable', providerEventId: 'provider-event-1', eventType: 'user.updated', payloadSha256: 'b'.repeat(64), signatureVerifiedAt: '2026-07-16T02:00:00Z', receivedAt: '2026-07-16T02:00:00Z' };
    await expect(recordIdentityProviderEvent(db, event)).resolves.toBe('created');
    await expect(recordIdentityProviderEvent(db, { ...event, id: 'event-replay' })).resolves.toBe('replay');
    await expect(recordIdentityProviderEvent(db, { ...event, id: 'event-conflict', payloadSha256: 'c'.repeat(64) })).resolves.toBe('payload_conflict');
  });

  it('keeps owner claims and proposals tenant-authorized, reviewed, and auditable', async () => {
    await expect(createOwnerClaim(db, {
      claimId: 'claim-1', eventId: 'claim-event-1', customerUserId: 'user-owner',
      customerOrganizationId: 'org-1', directoryOrganizationRef: 'directory-org-1',
      occurredAt: '2026-07-16T03:00:00Z', idempotencyKey: 'claim-create-1',
    })).resolves.toBe('created');
    await expect(createOwnerClaim(db, {
      claimId: 'claim-denied', eventId: 'claim-event-denied', customerUserId: 'user-invitee',
      customerOrganizationId: 'org-1', directoryOrganizationRef: 'directory-org-denied',
      occurredAt: '2026-07-16T03:00:00Z', idempotencyKey: 'claim-create-denied',
    })).resolves.toBe('denied');
    await expect(submitOwnerClaim(db, {
      claimId: 'claim-1', eventId: 'claim-event-2', customerUserId: 'user-owner',
      occurredAt: '2026-07-16T03:05:00Z', idempotencyKey: 'claim-submit-1', expectedFromStatus: 'draft',
    })).resolves.toBe('created');

    const beforeVerification = await createProposedEdit(db, {
      proposedEditId: 'edit-before', eventId: 'edit-event-before', customerUserId: 'user-owner',
      customerOrganizationId: 'org-1', directoryOrganizationRef: 'directory-org-1',
      baseRecordSha256: 'd'.repeat(64), proposedPatch: { display_name: 'Updated Camp' },
      proposedPatchSha256: 'e'.repeat(64), occurredAt: '2026-07-16T03:06:00Z',
      idempotencyKey: 'edit-before', allowedFields: new Set(['display_name']), immutableFields: new Set(['paid_status']),
    });
    expect(beforeVerification).toBe('denied');

    await db.batch([
      db.prepare(`INSERT INTO owner_claim_evidence (id,owner_claim_id,evidence_type,evidence_ref,evidence_sha256,contains_personal_data,retention_review_at,submitted_by_customer_user_id,submitted_at,review_status,reviewed_by_staff_ref,reviewed_at,review_reason_code) VALUES (?1,?2,'domain_control',?3,?4,0,?5,?6,?7,'accepted',?8,?9,?10)`).bind('evidence-1', 'claim-1', 'evidence:test', 'f'.repeat(64), '2027-07-16T00:00:00Z', 'user-owner', '2026-07-16T03:06:00Z', 'staff:test', '2026-07-16T03:09:00Z', 'domain_control'),
      db.prepare(`UPDATE owner_claims SET status='under_review', updated_at=?1 WHERE id=?2 AND status='submitted'`).bind('2026-07-16T03:09:00Z', 'claim-1'),
    ]);
    await expect(decideOwnerClaim(db, {
      claimId: 'claim-1', eventId: 'claim-event-3', verifiedStaffRef: 'staff:test',
      expectedFromStatus: 'under_review', decision: 'verified', reasonCode: 'domain_control',
      occurredAt: '2026-07-16T03:10:00Z', idempotencyKey: 'claim-decision-1',
    })).resolves.toBe('created');
    await expect(createProposedEdit(db, {
      proposedEditId: 'edit-1', eventId: 'edit-event-1', customerUserId: 'user-owner',
      customerOrganizationId: 'org-1', directoryOrganizationRef: 'directory-org-1',
      baseRecordSha256: 'd'.repeat(64), proposedPatch: { display_name: 'Updated Camp' },
      proposedPatchSha256: 'e'.repeat(64), occurredAt: '2026-07-16T03:11:00Z',
      idempotencyKey: 'edit-create-1', allowedFields: new Set(['display_name']), immutableFields: new Set(['paid_status']),
    })).resolves.toBe('created');

    await expect(transitionProposedEditByCustomer(db, { proposedEditId: 'edit-1', eventId: 'edit-event-2', customerUserId: 'user-owner', expectedFromStatus: 'draft', nextStatus: 'submitted', occurredAt: '2026-07-16T03:12:00Z', idempotencyKey: 'edit-submit-1' })).resolves.toBe('created');
    await expect(transitionProposedEditByStaff(db, { proposedEditId: 'edit-1', eventId: 'edit-event-3', verifiedStaffRef: 'staff:test', expectedFromStatus: 'submitted', nextStatus: 'under_review', occurredAt: '2026-07-16T03:13:00Z', idempotencyKey: 'edit-review-1' })).resolves.toBe('created');
    await expect(transitionProposedEditByStaff(db, { proposedEditId: 'edit-1', eventId: 'edit-event-4', verifiedStaffRef: 'staff:test', expectedFromStatus: 'under_review', nextStatus: 'approved', reasonCode: 'source_supported', occurredAt: '2026-07-16T03:14:00Z', idempotencyKey: 'edit-approve-1' })).resolves.toBe('created');

    const counts = await db.prepare(`SELECT
      (SELECT COUNT(*) FROM owner_claim_events WHERE owner_claim_id='claim-1') AS claim_events,
      (SELECT COUNT(*) FROM owner_proposed_edit_events WHERE proposed_edit_id='edit-1') AS edit_events`).first();
    expect(counts).toEqual(expect.objectContaining({ claim_events: 3, edit_events: 4 }));
  });

  it('rehearses failed recovery, successful one-time recovery, and all-session revocation', async () => {
    await expect(recordRecoveryFailure(db, { challengeId: 'recovery-1', expectedAttempts: 0, occurredAt: '2026-07-16T04:00:00Z', securityEventId: 'security-failure-1', idempotencyKey: 'recovery-failure-1', reasonCode: 'context_mismatch' })).resolves.toBe('completed');
    await expect(consumeRecoveryChallenge(db, { challengeId: 'recovery-1', tokenSha256: '9'.repeat(64), requestContextHash: '8'.repeat(64), expectedAttempts: 1, occurredAt: '2026-07-16T04:01:00Z', providerCode: 'disposable', revocationId: 'revocation-1', securityEventId: 'security-success-1', idempotencyKey: 'recovery-success-1' })).resolves.toBe('completed');
    await expect(consumeRecoveryChallenge(db, { challengeId: 'recovery-1', tokenSha256: '9'.repeat(64), requestContextHash: '8'.repeat(64), expectedAttempts: 1, occurredAt: '2026-07-16T04:02:00Z', providerCode: 'disposable', revocationId: 'revocation-replay', securityEventId: 'security-replay', idempotencyKey: 'recovery-replay' })).resolves.toBe('denied');
    const recovery = await db.prepare(`SELECT c.status, c.attempts, r.scope, r.reason_code FROM customer_recovery_challenges c JOIN customer_session_revocations r ON r.customer_user_id=c.customer_user_id WHERE c.id=?1`).bind('recovery-1').first();
    expect(recovery).toEqual(expect.objectContaining({ status: 'consumed', attempts: 1, scope: 'all_user_sessions', reason_code: 'recovery' }));
  });

  it('opens and resolves an ownership dispute without granting directory or commerce authority', async () => {
    await expect(openOwnerDisputeByCustomer(db, { disputeId: 'dispute-1', eventId: 'dispute-event-1', claimEventId: 'claim-dispute-event-1', ownerClaimId: 'claim-1', customerUserId: 'user-owner', reasonCode: 'ownership_contested', occurredAt: '2026-07-16T05:00:00Z', idempotencyKey: 'dispute-open-1' })).resolves.toBe('completed');
    await expect(createProposedEdit(db, { proposedEditId: 'edit-during-dispute', eventId: 'edit-during-dispute-event', customerUserId: 'user-owner', customerOrganizationId: 'org-1', directoryOrganizationRef: 'directory-org-1', baseRecordSha256: '1'.repeat(64), proposedPatch: { display_name: 'Should not pass' }, proposedPatchSha256: '2'.repeat(64), occurredAt: '2026-07-16T05:01:00Z', idempotencyKey: 'edit-during-dispute', allowedFields: new Set(['display_name']), immutableFields: new Set(['paid_status']) })).resolves.toBe('denied');
    await expect(resolveOwnerDisputeByStaff(db, { disputeId: 'dispute-1', eventId: 'dispute-event-2', claimEventId: 'claim-dispute-event-2', verifiedStaffRef: 'staff:test', resolution: 'resolved_upheld', reasonCode: 'evidence_confirmed', occurredAt: '2026-07-16T05:02:00Z', idempotencyKey: 'dispute-resolve-1' })).resolves.toBe('completed');
    const result = await db.prepare(`SELECT d.status AS dispute_status, c.status AS claim_status FROM owner_disputes d JOIN owner_claims c ON c.id=d.owner_claim_id WHERE d.id=?1`).bind('dispute-1').first();
    expect(result).toEqual(expect.objectContaining({ dispute_status: 'resolved_upheld', claim_status: 'verified' }));
  });

  it('claims, verifies, and receipts privacy cascade work alongside paired export artifacts', async () => {
    await expect(claimPrivacyCascadeExecution(db, { attemptId: 'privacy-attempt-1', cascadeItemId: 'cascade-1', executorRef: 'disposable-worker', idempotencyKey: 'cascade-1:1', claimedAt: '2026-07-16T06:00:00Z' })).resolves.toBe('completed');
    await expect(settlePrivacyCascadeExecution(db, { attemptId: 'privacy-attempt-1', cascadeItemId: 'cascade-1', settledAt: '2026-07-16T06:01:00Z', outcome: 'verified', providerCode: 'disposable', providerReference: 'provider-delete-1', verificationReference: 'verified-delete-1' })).resolves.toBe('completed');
    await expect(recordPrivacyExportArtifact(db, { artifactId: 'export-machine-1', requestId: 'privacy-1', format: 'machine_readable', version: 1, storageReference: 'exports/privacy-1.json', contentSha256: '3'.repeat(64), generatedAt: '2026-07-16T06:02:00Z', expiresAt: '2026-07-17T06:02:00Z', verifiedBy: 'staff:test' })).resolves.toBe('completed');
    await expect(recordPrivacyExportArtifact(db, { artifactId: 'export-human-1', requestId: 'privacy-1', format: 'human_readable', version: 1, storageReference: 'exports/privacy-1.txt', contentSha256: '4'.repeat(64), generatedAt: '2026-07-16T06:02:00Z', expiresAt: '2026-07-17T06:02:00Z', verifiedBy: 'staff:test' })).resolves.toBe('completed');
    const evidence = await db.prepare(`SELECT i.state, i.verification_ref, a.status AS attempt_status, r.state AS receipt_state, (SELECT COUNT(*) FROM privacy_export_artifacts WHERE request_id='privacy-1') AS exports FROM privacy_cascade_items i JOIN privacy_cascade_execution_attempts a ON a.cascade_item_id=i.id JOIN privacy_provider_receipts r ON r.cascade_item_id=i.id WHERE i.id=?1`).bind('cascade-1').first();
    expect(evidence).toEqual(expect.objectContaining({ state: 'verified', verification_ref: 'verified-delete-1', attempt_status: 'verified', receipt_state: 'confirmed', exports: 2 }));
  });

  it('reconciles a verified test payment, grants no customer authority, and reverses entitlement only after a verified refund', async () => {
    const paymentEvent = { id: 'commerce-payment-event-1', providerCode: 'disposable', providerEventId: 'payment:test-1', payloadSha256: '5'.repeat(64), eventType: 'payment.succeeded', signatureVerifiedAt: '2026-07-16T07:00:00Z', receivedAt: '2026-07-16T07:00:00Z' };
    await expect(recordVerifiedCommerceEvent(db, paymentEvent)).resolves.toBe('created');
    await expect(recordVerifiedCommerceEvent(db, { ...paymentEvent, id: 'commerce-payment-event-replay' })).resolves.toBe('replay');
    await expect(recordVerifiedCommerceEvent(db, { ...paymentEvent, id: 'commerce-payment-event-conflict', payloadSha256: '6'.repeat(64) })).resolves.toBe('payload_conflict');
    // A conflict is visible for reconciliation; a separate verified event is used for the valid order.
    const reconciled = { ...paymentEvent, id: 'commerce-payment-event-2', providerEventId: 'payment:test-2', payloadSha256: '7'.repeat(64) };
    await expect(recordVerifiedCommerceEvent(db, reconciled)).resolves.toBe('created');
    const reconciliation = { orderId: 'order-1', paymentEventId: reconciled.id, providerCode: 'disposable', providerEventId: reconciled.providerEventId, paidAt: '2026-07-16T07:01:00Z', auditEventId: 'commerce-audit-payment-1', idempotencyKey: 'commerce-payment-1' };
    await expect(reconcileVerifiedPayment(db, reconciliation)).resolves.toBe('processed');
    await expect(reconcileVerifiedPayment(db, reconciliation)).resolves.toBe('replay');

    await expect(grantVerifiedEntitlement(db, { entitlementId: 'entitlement-denied', orderId: 'order-1', actorType: 'customer', actorRef: 'user-owner', providerPaymentVerified: true, grantedAt: '2026-07-16T07:02:00Z', auditEventId: 'commerce-audit-denied', idempotencyKey: 'commerce-entitlement-denied' })).resolves.toBe('denied');
    const grant = { entitlementId: 'entitlement-1', orderId: 'order-1', actorType: 'system' as const, actorRef: 'test-fulfillment', providerPaymentVerified: true, grantedAt: '2026-07-16T07:03:00Z', auditEventId: 'commerce-audit-entitlement-1', idempotencyKey: 'commerce-entitlement-1' };
    await expect(grantVerifiedEntitlement(db, grant)).resolves.toBe('granted');
    await expect(grantVerifiedEntitlement(db, grant)).resolves.toBe('replay');

    const refund = { refundId: 'refund-1', orderId: 'order-1', providerCode: 'disposable', providerRequestReference: 'refund-request:test-1', amountMinor: 5000, reasonCode: 'test_refund', staffRef: 'staff:test', requestedAt: '2026-07-16T07:04:00Z', auditEventId: 'commerce-audit-refund-request-1', idempotencyKey: 'commerce-refund-request-1' };
    await expect(requestRefundByStaff(db, refund)).resolves.toBe('requested');
    await expect(requestRefundByStaff(db, refund)).resolves.toBe('replay');
    const settlement = { refundId: 'refund-1', providerRefundReference: 'refund:test-1', settledAt: '2026-07-16T07:05:00Z', auditEventId: 'commerce-audit-refund-settled-1', idempotencyKey: 'commerce-refund-settled-1' };
    await expect(settleVerifiedRefund(db, settlement)).resolves.toBe('settled');
    await expect(settleVerifiedRefund(db, settlement)).resolves.toBe('replay');
    const evidence = await db.prepare(`SELECT o.state AS order_state, e.state AS entitlement_state, r.state AS refund_state, r.provider_refund_reference FROM commerce_orders o JOIN commerce_entitlements e ON e.order_id=o.id JOIN commerce_refunds r ON r.order_id=o.id WHERE o.id=?1`).bind('order-1').first();
    expect(evidence).toEqual(expect.objectContaining({ order_state: 'refunded', entitlement_state: 'revoked', refund_state: 'succeeded', provider_refund_reference: 'refund:test-1' }));
  });
});
