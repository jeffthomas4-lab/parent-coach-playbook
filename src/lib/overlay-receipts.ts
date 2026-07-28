// Inline editor: sensitive-action receipts (Pillar 13 item 3).
//
// Every overlay mutation emits one row, including the ones that were rejected
// or failed. A log that only records successes cannot answer "who tried what".
//
// The chain: row_hash = SHA-256(canonical envelope + prev_hash). Deleting,
// editing or reordering any row breaks every hash after it, and verifyChain()
// reports the first broken link.
//
// FAILURE POLICY, load-bearing: if the receipt cannot be written, the protected
// mutation must not be reported as complete. See writeReceiptOrFail below.

const MAX_SUMMARY = 200;

export type OverlayAction = 'overlay.update' | 'overlay.revert';
export type OverlayResult = 'applied' | 'rejected' | 'conflict' | 'failed';

export interface ReceiptInput {
  environment: string;
  requestId: string;
  actorEmail: string;
  authVerified: boolean;
  action: OverlayAction;
  regionKey: string;
  regionLabel: string;
  revision: number;
  before: string | null;
  after: string | null;
  result: OverlayResult;
  reason?: string;
}

/** SHA-256 hex. Web Crypto is available in workerd. */
async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Digest an email for storage. Lowercased first so casing cannot fork identity. */
export async function digestEmail(email: string): Promise<string> {
  return sha256Hex(email.trim().toLowerCase());
}

/** Domain only. Enough for triage, not enough to identify a person. */
function domainOf(email: string): string | null {
  const at = email.lastIndexOf('@');
  return at === -1 ? null : email.slice(at + 1).toLowerCase();
}

/** Bound a stored summary. Receipts are for review and rollback, not archival. */
function summarize(value: string | null): string | null {
  if (value === null) return null;
  return value.length <= MAX_SUMMARY ? value : `${value.slice(0, MAX_SUMMARY)}…`;
}

/**
 * Canonical serialization. Field order is fixed and must never change for a
 * given schema_version, because the hash chain depends on it.
 */
function canonical(r: Record<string, unknown>, prevHash: string): string {
  return JSON.stringify([
    r.schema_version,
    r.environment,
    r.occurred_at,
    r.request_id,
    r.actor_digest,
    r.actor_domain,
    r.auth_method,
    r.auth_verified,
    r.action,
    r.region_key,
    r.region_label,
    r.revision,
    r.before_summary,
    r.after_summary,
    r.before_length,
    r.after_length,
    r.result,
    r.reason,
    prevHash,
  ]);
}

/**
 * Append one receipt. Throws on failure so the caller cannot accidentally
 * proceed as if the mutation were fully recorded.
 */
export async function writeReceiptOrFail(db: D1Database, input: ReceiptInput): Promise<{ id: number; rowHash: string }> {
  const prev = await db
    .prepare('SELECT row_hash FROM content_overlay_receipts ORDER BY id DESC LIMIT 1')
    .first<{ row_hash: string }>();
  const prevHash = prev?.row_hash ?? '';

  const row = {
    schema_version: 1,
    environment: input.environment,
    occurred_at: new Date().toISOString(),
    request_id: input.requestId,
    actor_digest: await digestEmail(input.actorEmail),
    actor_domain: domainOf(input.actorEmail),
    auth_method: 'cloudflare-access-jwt',
    auth_verified: input.authVerified ? 1 : 0,
    action: input.action,
    region_key: input.regionKey,
    region_label: input.regionLabel,
    revision: input.revision,
    before_summary: summarize(input.before),
    after_summary: summarize(input.after),
    before_length: input.before?.length ?? null,
    after_length: input.after?.length ?? null,
    result: input.result,
    reason: input.reason ? summarize(input.reason) : null,
  };

  const rowHash = await sha256Hex(canonical(row, prevHash));

  const inserted = await db
    .prepare(
      `INSERT INTO content_overlay_receipts (
         schema_version, environment, occurred_at, request_id,
         actor_digest, actor_domain, auth_method, auth_verified,
         action, region_key, region_label, revision,
         before_summary, after_summary, before_length, after_length,
         result, reason, prev_hash, row_hash
       ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
       RETURNING id`,
    )
    .bind(
      row.schema_version, row.environment, row.occurred_at, row.request_id,
      row.actor_digest, row.actor_domain, row.auth_method, row.auth_verified,
      row.action, row.region_key, row.region_label, row.revision,
      row.before_summary, row.after_summary, row.before_length, row.after_length,
      row.result, row.reason, prevHash, rowHash,
    )
    .first<{ id: number }>();

  if (!inserted) throw new Error('receipt insert returned no row');
  return { id: inserted.id, rowHash };
}

export interface ChainVerification {
  ok: boolean;
  checked: number;
  /** id of the first row whose hash does not match, when ok is false. */
  brokenAtId?: number;
  reason?: 'hash_mismatch' | 'prev_hash_mismatch' | 'empty';
}

/**
 * Walk the chain and confirm every row still hashes to what it claims and
 * still points at its predecessor. Run by the ops watch job and by the
 * tamper tests.
 */
export async function verifyChain(db: D1Database, limit = 5000): Promise<ChainVerification> {
  const { results } = await db
    .prepare(
      `SELECT * FROM content_overlay_receipts ORDER BY id ASC LIMIT ?`,
    )
    .bind(limit)
    .all<Record<string, unknown>>();

  if (!results || results.length === 0) return { ok: true, checked: 0, reason: 'empty' };

  let expectedPrev = '';
  let checked = 0;

  for (const row of results) {
    if (String(row.prev_hash ?? '') !== expectedPrev) {
      return { ok: false, checked, brokenAtId: Number(row.id), reason: 'prev_hash_mismatch' };
    }
    const recomputed = await sha256Hex(canonical(row, expectedPrev));
    if (recomputed !== String(row.row_hash)) {
      return { ok: false, checked, brokenAtId: Number(row.id), reason: 'hash_mismatch' };
    }
    expectedPrev = String(row.row_hash);
    checked += 1;
  }

  return { ok: true, checked };
}

/** Most recent receipts for one region. Powers the per-region revert UI. */
export async function recentForRegion(db: D1Database, regionKey: string, limit = 10) {
  const { results } = await db
    .prepare(
      `SELECT id, occurred_at, actor_domain, action, revision,
              before_summary, after_summary, result
         FROM content_overlay_receipts
        WHERE region_key = ? AND result = 'applied'
        ORDER BY id DESC LIMIT ?`,
    )
    .bind(regionKey, limit)
    .all();
  return results ?? [];
}
