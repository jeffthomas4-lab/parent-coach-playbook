// Tamper-resistant sensitive-action receipts for the admin panel.
// Website Build Standard Pillar 13, row 3 ("Tamper-resistant sensitive-action
// receipts"). Backing table: migrations-pcd-ops/0029_admin_action_receipts.sql
// (binding PCD_OPS_DB), an append-only, hash-chained log enforced by triggers
// at the database layer, not just by this file's own discipline.
//
// Call sites today: src/pages/api/admin/camps/[id]/{approve,reject,verify,
// photo,update}.ts and src/pages/api/admin/reviews/[id]/{approve,reject}.ts.
// Everything else under src/pages/api/admin/** that mutates data (claims
// update, editorial approve, suggestions update, and the rest) does not call
// this yet -- see the 2026-07-30 Pillar 13 audit report for the full open
// list. Add a call site by importing recordAdminReceipt (or the
// withAdminReceipt wrapper below) and following the pattern in approve.ts.
//
// Unlike src/lib/events.ts (best-effort, swallows every failure so a missing
// migration never breaks a caller's real work), a receipt write here is NOT
// best-effort for the caller's response: withAdminReceipt refuses to report
// success to the client unless the receipt itself was durably written. A
// mutation that succeeded but could not be receipted is reported as a
// distinct failure (RECEIPT_WRITE_FAILED), never silently upgraded to
// "saved" -- that is the standard's "receipt failure cannot silently leave
// the protected mutation complete" requirement, applied literally: the
// caller-visible contract is mutation-plus-receipt, not mutation alone.

import { sha256Hex } from './public-idempotency';
import { log } from './log';

/** The first row in a chain has no real predecessor; this fixed value plays that role. */
export const GENESIS_HASH = '0'.repeat(64);

export interface AdminReceiptEnv {
  PCD_OPS_DB?: D1Database;
}

export type AdminReceiptOutcome = 'success' | 'error' | 'blocked';

export interface AdminReceiptFields {
  environment: string;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  requestId: string;
  authorizationContext: string;
  result: AdminReceiptOutcome;
  reason?: string | null;
  beforeSummary?: string | null;
  afterSummary?: string | null;
}

export interface AdminReceiptRow {
  schema_version: number;
  environment: string;
  actor_email_digest: string;
  actor_email_domain: string;
  action: string;
  resource_type: string;
  resource_id: string;
  request_id: string;
  authorization_context: string;
  result: AdminReceiptOutcome;
  reason: string | null;
  before_summary: string | null;
  after_summary: string | null;
  prev_hash: string;
  created_at: string;
}

export interface RecordReceiptResult {
  ok: boolean;
  id?: number;
  rowHash?: string;
  error?: string;
}

/** Clamp free text to a bounded length, matching the 200-char columns in 0029's schema. */
function bounded(value: string | null | undefined, max = 200): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

/**
 * A raw email is excluded from the receipt (Pillar 13's redaction list).
 * A digest plus the bare domain is enough to identify "which admin, which
 * organization" for triage without storing the address itself.
 */
export async function digestActorEmail(email: string): Promise<{ digest: string; domain: string }> {
  const normalized = email.trim().toLowerCase();
  const domain = normalized.split('@')[1] || 'unknown';
  const digest = await sha256Hex(normalized);
  return { digest, domain };
}

function canonicalRowPayload(row: AdminReceiptRow): string {
  // Key order is fixed and explicit (not Object.keys on an arbitrary object)
  // so the canonical string this hashes never silently changes if a field is
  // reordered in a future edit to this file.
  return JSON.stringify([
    row.schema_version,
    row.environment,
    row.actor_email_digest,
    row.actor_email_domain,
    row.action,
    row.resource_type,
    row.resource_id,
    row.request_id,
    row.authorization_context,
    row.result,
    row.reason,
    row.before_summary,
    row.after_summary,
    row.prev_hash,
    row.created_at,
  ]);
}

/** Recompute what row_hash should be for a stored row. Used both to write and to verify. */
export async function computeRowHash(row: AdminReceiptRow): Promise<string> {
  return sha256Hex(canonicalRowPayload(row));
}

/**
 * Append one receipt. Reads the current chain tip, builds the next row,
 * computes its hash, and inserts it. Returns ok:false (never throws) on any
 * failure -- the caller decides what that means for its own response; see
 * withAdminReceipt for the pattern that refuses to report "saved" on a
 * receipt failure.
 */
export async function recordAdminReceipt(
  db: D1Database,
  input: AdminReceiptFields,
): Promise<RecordReceiptResult> {
  try {
    const tip = await db
      .prepare('SELECT row_hash FROM admin_action_receipts ORDER BY id DESC LIMIT 1')
      .first<{ row_hash: string }>();
    const prevHash = tip?.row_hash ?? GENESIS_HASH;

    const { digest, domain } = await digestActorEmail(input.actorEmail);
    const row: AdminReceiptRow = {
      schema_version: 1,
      environment: input.environment,
      actor_email_digest: digest,
      actor_email_domain: domain,
      action: input.action,
      resource_type: input.resourceType,
      resource_id: input.resourceId,
      request_id: input.requestId,
      authorization_context: input.authorizationContext,
      result: input.result,
      reason: bounded(input.reason),
      before_summary: bounded(input.beforeSummary),
      after_summary: bounded(input.afterSummary),
      prev_hash: prevHash,
      created_at: new Date().toISOString(),
    };
    const rowHash = await computeRowHash(row);

    const inserted = await db
      .prepare(
        `INSERT INTO admin_action_receipts
           (schema_version, environment, actor_email_digest, actor_email_domain, action,
            resource_type, resource_id, request_id, authorization_context, result,
            reason, before_summary, after_summary, prev_hash, row_hash, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        row.schema_version,
        row.environment,
        row.actor_email_digest,
        row.actor_email_domain,
        row.action,
        row.resource_type,
        row.resource_id,
        row.request_id,
        row.authorization_context,
        row.result,
        row.reason,
        row.before_summary,
        row.after_summary,
        row.prev_hash,
        rowHash,
        row.created_at,
      )
      .run();

    return { ok: true, id: Number(inserted.meta?.last_row_id ?? 0), rowHash };
  } catch (error) {
    log('error', {
      requestId: input.requestId,
      route: 'lib/admin-receipts',
      action: 'admin_receipt_write_failed',
      mutationAction: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      error,
    });
    return { ok: false, error: error instanceof Error ? error.message : 'unknown_error' };
  }
}

export interface VerifyChainResult {
  ok: boolean;
  rowsChecked: number;
  brokenAtId?: number;
  reason?: string;
}

/**
 * Walk the full chain in id order and prove it is intact: every row's stored
 * row_hash matches a fresh recomputation from its own fields, and every
 * row's prev_hash matches the row_hash of the row immediately before it (or
 * GENESIS_HASH for the first row). A modified field, a deleted row, or two
 * rows swapped all break this in a way that names the first broken id.
 */
export async function verifyReceiptChain(db: D1Database): Promise<VerifyChainResult> {
  const { results } = await db
    .prepare(
      `SELECT id, schema_version, environment, actor_email_digest, actor_email_domain, action,
              resource_type, resource_id, request_id, authorization_context, result,
              reason, before_summary, after_summary, prev_hash, row_hash, created_at
         FROM admin_action_receipts ORDER BY id ASC`,
    )
    .all<AdminReceiptRow & { id: number; row_hash: string }>();

  let expectedPrevHash = GENESIS_HASH;
  let rowsChecked = 0;
  for (const stored of results) {
    rowsChecked += 1;
    const recomputed = await computeRowHash(stored);
    if (recomputed !== stored.row_hash) {
      return { ok: false, rowsChecked, brokenAtId: stored.id, reason: 'stored row_hash does not match its own content' };
    }
    if (stored.prev_hash !== expectedPrevHash) {
      return { ok: false, rowsChecked, brokenAtId: stored.id, reason: 'prev_hash does not chain to the prior row (row missing, reordered, or replaced)' };
    }
    expectedPrevHash = stored.row_hash;
  }
  return { ok: true, rowsChecked };
}

export interface WithAdminReceiptInput {
  env: AdminReceiptEnv;
  environment: string;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  requestId: string;
  authorizationContext: string;
}

export type MutationOutcome<T> =
  | { outcome: 'success'; value: T; beforeSummary?: string | null; afterSummary?: string | null }
  | { outcome: 'blocked'; response: Response; reason: string }
  | { outcome: 'error'; response: Response; reason: string };

/**
 * Run a mutation and receipt it atomically from the caller's point of view:
 * the mutation's own success/blocked/error outcome is always receipted, and
 * if the receipt itself cannot be written, the caller gets a distinct 500
 * (RECEIPT_WRITE_FAILED) instead of the mutation's own success response. A
 * client of this route can then never see "ok: true" for an action this
 * table has no durable record of.
 *
 * D1 has no cross-database transaction (the mutation lives in DB/
 * activity-radar, the receipt lives in PCD_OPS_DB) so this cannot be a
 * single atomic commit across both stores -- the same constraint the photo
 * route already documents for R2-plus-D1. The ordering here (mutate, then
 * receipt, then decide what to tell the caller) is what keeps a failed
 * receipt from ever being reported as a successful save.
 */
export async function withAdminReceipt<T>(
  input: WithAdminReceiptInput,
  run: () => Promise<MutationOutcome<T>>,
): Promise<{ response: Response } | { value: T }> {
  const outcome = await run();

  if (outcome.outcome === 'blocked' || outcome.outcome === 'error') {
    if (input.env.PCD_OPS_DB) {
      await recordAdminReceipt(input.env.PCD_OPS_DB, {
        environment: input.environment,
        actorEmail: input.actorEmail,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        requestId: input.requestId,
        authorizationContext: input.authorizationContext,
        result: outcome.outcome,
        reason: outcome.reason,
      });
    }
    return { response: outcome.response };
  }

  if (!input.env.PCD_OPS_DB) {
    // No ops DB bound in this environment (e.g. a stripped-down preview).
    // Refuse to claim success for a sensitive mutation with no receipt path
    // at all, rather than silently skipping the receipt the way events.ts
    // does for its lower-stakes log.
    return {
      response: new Response(
        JSON.stringify({
          ok: false,
          code: 'RECEIPT_WRITE_FAILED',
          error: 'action completed but could not be receipted (PCD_OPS_DB not bound)',
          request_id: input.requestId,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } },
      ),
    };
  }

  const receipt = await recordAdminReceipt(input.env.PCD_OPS_DB, {
    environment: input.environment,
    actorEmail: input.actorEmail,
    action: input.action,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    requestId: input.requestId,
    authorizationContext: input.authorizationContext,
    result: 'success',
    beforeSummary: outcome.beforeSummary,
    afterSummary: outcome.afterSummary,
  });

  if (!receipt.ok) {
    return {
      response: new Response(
        JSON.stringify({
          ok: false,
          code: 'RECEIPT_WRITE_FAILED',
          error: 'action completed but the receipt failed to write; retry or contact support',
          request_id: input.requestId,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } },
      ),
    };
  }

  return { value: outcome.value };
}
