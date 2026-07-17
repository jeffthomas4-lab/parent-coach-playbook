import type { D1Database, D1Result } from '@cloudflare/workers-types';
import { mayGrantEntitlement } from './commerce-lifecycle';

function changes(result: D1Result<unknown> | undefined): number {
  return Number(result?.meta?.changes ?? 0);
}

export async function recordVerifiedCommerceEvent(db: D1Database, input: {
  id: string;
  providerCode: string;
  providerEventId: string;
  payloadSha256: string;
  eventType: string;
  signatureVerifiedAt: string;
  receivedAt: string;
}): Promise<'created' | 'replay' | 'payload_conflict'> {
  const inserted = await db.prepare(
    `INSERT OR IGNORE INTO commerce_payment_events
       (id, provider_code, provider_event_id, payload_sha256, event_type,
        signature_verified_at, received_at, processing_state)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'received')`,
  ).bind(input.id, input.providerCode, input.providerEventId, input.payloadSha256,
    input.eventType, input.signatureVerifiedAt, input.receivedAt).run();
  if (changes(inserted) === 1) return 'created';

  const existing = await db.prepare(
    `SELECT payload_sha256 FROM commerce_payment_events
      WHERE provider_code = ?1 AND provider_event_id = ?2`,
  ).bind(input.providerCode, input.providerEventId).first<{ payload_sha256: string }>();
  if (existing?.payload_sha256 === input.payloadSha256) return 'replay';
  await db.prepare(
    `UPDATE commerce_payment_events SET processing_state='conflict', error_code='payload_conflict'
      WHERE provider_code=?1 AND provider_event_id=?2 AND payload_sha256<>?3`,
  ).bind(input.providerCode, input.providerEventId, input.payloadSha256).run();
  return 'payload_conflict';
}

/** Records a verified payment against one pending order. The caller must have
 * already verified the provider signature; this function never handles raw
 * payment payloads or customer payment details. */
export async function reconcileVerifiedPayment(db: D1Database, input: {
  orderId: string;
  paymentEventId: string;
  providerCode: string;
  providerEventId: string;
  paidAt: string;
  auditEventId: string;
  idempotencyKey: string;
}): Promise<'processed' | 'replay' | 'denied'> {
  const event = await db.prepare(
    `UPDATE commerce_payment_events SET processing_state='processed', processed_at=?1
      WHERE id=?2 AND provider_code=?3 AND provider_event_id=?4 AND processing_state='received'`,
  ).bind(input.paidAt, input.paymentEventId, input.providerCode, input.providerEventId);
  const order = db.prepare(
    `UPDATE commerce_orders SET state='paid', paid_at=?1
      WHERE id=?2 AND provider_code=?3 AND state='pending'`,
  ).bind(input.paidAt, input.orderId, input.providerCode);
  const audit = db.prepare(
    `INSERT OR IGNORE INTO commerce_events (id, organization_id, order_id, event_type, actor_type,
      actor_ref, outcome, occurred_at, idempotency_key)
     SELECT ?1, organization_id, id, 'payment_reconciled', 'provider', ?2, 'reconciled', ?3, ?4
       FROM commerce_orders WHERE id=?5 AND state='paid'`,
  ).bind(input.auditEventId, `${input.providerCode}:${input.providerEventId}`, input.paidAt,
    input.idempotencyKey, input.orderId);
  const results = await db.batch([event, order, audit]);
  const [eventChanges, orderChanges, auditChanges] = results.map(changes);
  if (eventChanges === 1 && orderChanges === 1 && auditChanges === 1) return 'processed';
  if (eventChanges === 0 && orderChanges === 0 && auditChanges === 0) return 'replay';
  throw new Error('commerce payment reconciliation invariant violated');
}

export async function grantVerifiedEntitlement(db: D1Database, input: {
  entitlementId: string;
  orderId: string;
  actorType: 'customer' | 'staff' | 'provider' | 'system';
  actorRef: string;
  providerPaymentVerified: boolean;
  grantedAt: string;
  auditEventId: string;
  idempotencyKey: string;
}): Promise<'granted' | 'replay' | 'denied'> {
  const order = await db.prepare(
    `SELECT o.state, p.product_code FROM commerce_orders o
      JOIN commerce_prices cp ON cp.id=o.price_id JOIN commerce_products p ON p.id=cp.product_id
      WHERE o.id=?1`,
  ).bind(input.orderId).first<{ state: 'pending' | 'paid' | 'fulfillment_pending' | 'fulfilled' | 'cancelled' | 'refunded' | 'disputed'; product_code: string }>();
  if (!order) return 'denied';
  const authorization = mayGrantEntitlement({ orderState: order.state, entitlementState: 'pending', actorType: input.actorType, providerPaymentVerified: input.providerPaymentVerified, productCode: order.product_code });
  if (authorization !== 'authorized') return 'denied';

  const entitlement = db.prepare(
    `INSERT OR IGNORE INTO commerce_entitlements
       (id, organization_id, order_id, product_code, state, starts_at, granted_by, created_at, updated_at)
     SELECT ?1, organization_id, id, ?2, 'active', ?3, ?4, ?3, ?3
       FROM commerce_orders WHERE id=?5 AND state IN ('paid','fulfillment_pending','fulfilled')`,
  ).bind(input.entitlementId, order.product_code, input.grantedAt, input.actorRef, input.orderId);
  const orderUpdate = db.prepare(
    `UPDATE commerce_orders SET state='fulfilled', fulfilled_at=?1
      WHERE id=?2 AND state IN ('paid','fulfillment_pending')`,
  ).bind(input.grantedAt, input.orderId);
  const audit = db.prepare(
    `INSERT OR IGNORE INTO commerce_events (id, organization_id, order_id, event_type, actor_type,
      actor_ref, outcome, occurred_at, idempotency_key)
     SELECT ?1, organization_id, id, 'entitlement_granted', ?2, ?3, 'approved', ?4, ?5
       FROM commerce_orders WHERE id=?6 AND state='fulfilled'`,
  ).bind(input.auditEventId, input.actorType, input.actorRef, input.grantedAt, input.idempotencyKey, input.orderId);
  const results = await db.batch([entitlement, orderUpdate, audit]);
  const [entitlementChanges, orderChanges, auditChanges] = results.map(changes);
  if (entitlementChanges === 1 && orderChanges === 1 && auditChanges === 1) return 'granted';
  if (entitlementChanges === 0 && orderChanges === 0 && auditChanges === 0) return 'replay';
  throw new Error('commerce entitlement grant invariant violated');
}

export async function requestRefundByStaff(db: D1Database, input: {
  refundId: string;
  orderId: string;
  providerCode: string;
  providerRequestReference: string;
  amountMinor: number;
  reasonCode: string;
  staffRef: string;
  requestedAt: string;
  auditEventId: string;
  idempotencyKey: string;
}): Promise<'requested' | 'replay' | 'denied'> {
  if (!input.staffRef.trim() || input.amountMinor <= 0 || !input.reasonCode.trim()) return 'denied';
  const existingRefund = await db.prepare(
    `SELECT order_id, provider_code, provider_request_reference, amount_minor, state
       FROM commerce_refunds WHERE id=?1`,
  ).bind(input.refundId).first<{ order_id: string; provider_code: string; provider_request_reference: string; amount_minor: number; state: string }>();
  if (existingRefund) {
    return existingRefund.order_id === input.orderId
      && existingRefund.provider_code === input.providerCode
      && existingRefund.provider_request_reference === input.providerRequestReference
      && existingRefund.amount_minor === input.amountMinor
      && existingRefund.state === 'requested'
      ? 'replay' : 'denied';
  }
  const eligibleOrder = await db.prepare(
    `SELECT amount_minor, state FROM commerce_orders WHERE id=?1`,
  ).bind(input.orderId).first<{ amount_minor: number; state: string }>();
  if (!eligibleOrder || eligibleOrder.amount_minor !== input.amountMinor || !['paid', 'fulfillment_pending', 'fulfilled'].includes(eligibleOrder.state)) return 'denied';
  const refund = db.prepare(
    `INSERT OR IGNORE INTO commerce_refunds (id, order_id, provider_code, provider_request_reference,
     amount_minor, state, reason_code, requested_by_staff_ref, requested_at)
     SELECT ?1, id, ?2, ?3, ?4, 'requested', ?5, ?6, ?7 FROM commerce_orders
      WHERE id=?8 AND amount_minor=?4 AND state IN ('paid','fulfillment_pending','fulfilled')`,
  ).bind(input.refundId, input.providerCode, input.providerRequestReference, input.amountMinor,
    input.reasonCode, input.staffRef, input.requestedAt, input.orderId);
  const order = db.prepare(
    `UPDATE commerce_orders SET state='disputed' WHERE id=?1
      AND state IN ('paid','fulfillment_pending','fulfilled')`,
  ).bind(input.orderId);
  const audit = db.prepare(
    `INSERT OR IGNORE INTO commerce_events (id, organization_id, order_id, event_type, actor_type,
      actor_ref, outcome, reason_code, occurred_at, idempotency_key)
     SELECT ?1, o.organization_id, o.id, 'refund_requested', 'staff', ?2, 'approved', ?3, ?4, ?5
       FROM commerce_orders o JOIN commerce_refunds r ON r.order_id=o.id
      WHERE o.id=?6 AND r.id=?7 AND o.state='disputed'`,
  ).bind(input.auditEventId, input.staffRef, input.reasonCode, input.requestedAt, input.idempotencyKey, input.orderId, input.refundId);
  const results = await db.batch([refund, order, audit]);
  const [refundChanges, orderChanges, auditChanges] = results.map(changes);
  if (refundChanges === 1 && orderChanges === 1 && auditChanges === 1) return 'requested';
  if (refundChanges === 0 && orderChanges === 0 && auditChanges === 0) return 'replay';
  throw new Error('commerce refund request invariant violated');
}

export async function settleVerifiedRefund(db: D1Database, input: {
  refundId: string;
  providerRefundReference: string;
  settledAt: string;
  auditEventId: string;
  idempotencyKey: string;
}): Promise<'settled' | 'replay' | 'denied'> {
  const refund = db.prepare(
    `UPDATE commerce_refunds SET state='succeeded', provider_refund_reference=?1, completed_at=?2
      WHERE id=?3 AND state='requested' AND provider_refund_reference IS NULL`,
  ).bind(input.providerRefundReference, input.settledAt, input.refundId);
  const order = db.prepare(
    `UPDATE commerce_orders SET state='refunded' WHERE id=(SELECT order_id FROM commerce_refunds WHERE id=?1)
      AND state='disputed'`,
  ).bind(input.refundId);
  const entitlement = db.prepare(
    `UPDATE commerce_entitlements SET state='revoked', updated_at=?1
      WHERE order_id=(SELECT order_id FROM commerce_refunds WHERE id=?2) AND state IN ('pending','active','suspended')`,
  ).bind(input.settledAt, input.refundId);
  const audit = db.prepare(
    `INSERT OR IGNORE INTO commerce_events (id, organization_id, order_id, event_type, actor_type,
      actor_ref, outcome, occurred_at, idempotency_key)
     SELECT ?1, o.organization_id, o.id, 'refund_reconciled', 'provider', ?2, 'reconciled', ?3, ?4
       FROM commerce_orders o JOIN commerce_refunds r ON r.order_id=o.id
      WHERE r.id=?5 AND r.state='succeeded'`,
  ).bind(input.auditEventId, input.providerRefundReference, input.settledAt, input.idempotencyKey, input.refundId);
  const results = await db.batch([refund, order, entitlement, audit]);
  const [refundChanges, orderChanges, entitlementChanges, auditChanges] = results.map(changes);
  if (refundChanges === 1 && orderChanges === 1 && auditChanges === 1 && entitlementChanges <= 1) return 'settled';
  if (refundChanges === 0 && orderChanges === 0 && entitlementChanges === 0 && auditChanges === 0) return 'replay';
  throw new Error('commerce refund settlement invariant violated');
}
