export const IDEMPOTENCY_KEY_RE = /^[A-Za-z0-9_-]{16,128}$/;

export interface StoredIdempotentResult {
  payload_hash: string;
  resource_id: string;
  response_status: number;
  response_json: string;
}

export type IdempotentWriteResult =
  | { outcome: 'created' | 'replayed'; resourceId: string; status: number; body: unknown }
  | { outcome: 'conflict' };

export function suppliedIdempotencyKey(request: Request, bodyKey?: unknown): { key: string | null; error?: string } {
  const header = request.headers.get('Idempotency-Key')?.trim() || null;
  const body = typeof bodyKey === 'string' && bodyKey.trim() ? bodyKey.trim() : null;
  if (header && body && header !== body) return { key: null, error: 'Idempotency-Key header and body disagree' };
  const key = header || body;
  if (key && !IDEMPOTENCY_KEY_RE.test(key)) return { key: null, error: 'invalid Idempotency-Key' };
  return { key };
}

export async function sha256Hex(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(typeof value === 'string' ? value : JSON.stringify(value));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function executeIdempotentWrite(input: {
  db: D1Database;
  scope: string;
  key: string;
  payloadHash: string;
  resourceId: string;
  status: number;
  body: unknown;
  now: string;
  expiresAt: string;
  domainStatements: D1PreparedStatement[];
}): Promise<IdempotentWriteResult> {
  const keyHash = await sha256Hex(input.key);
  const find = () => input.db.prepare(
    `SELECT payload_hash, resource_id, response_status, response_json
       FROM public_write_idempotency WHERE route_scope = ? AND key_hash = ?`,
  ).bind(input.scope, keyHash).first<StoredIdempotentResult>();
  const replay = (stored: StoredIdempotentResult): IdempotentWriteResult => {
    if (stored.payload_hash !== input.payloadHash) return { outcome: 'conflict' };
    return { outcome: 'replayed', resourceId: stored.resource_id, status: stored.response_status, body: JSON.parse(stored.response_json) };
  };

  const existing = await find();
  if (existing) return replay(existing);

  const responseJson = JSON.stringify(input.body);
  const reserve = input.db.prepare(
    `INSERT INTO public_write_idempotency
       (route_scope, key_hash, payload_hash, resource_id, response_status, response_json, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(input.scope, keyHash, input.payloadHash, input.resourceId, input.status, responseJson, input.now, input.expiresAt);
  try {
    await input.db.batch([reserve, ...input.domainStatements]);
    return { outcome: 'created', resourceId: input.resourceId, status: input.status, body: input.body };
  } catch (error) {
    const raced = await find();
    if (raced) return replay(raced);
    throw error;
  }
}

export async function lookupIdempotentWrite(
  db: D1Database,
  scope: string,
  key: string,
  payloadHash: string,
): Promise<IdempotentWriteResult | null> {
  const stored = await db.prepare(
    `SELECT payload_hash, resource_id, response_status, response_json
       FROM public_write_idempotency WHERE route_scope = ? AND key_hash = ?`,
  ).bind(scope, await sha256Hex(key)).first<StoredIdempotentResult>();
  if (!stored) return null;
  if (stored.payload_hash !== payloadHash) return { outcome: 'conflict' };
  return { outcome: 'replayed', resourceId: stored.resource_id, status: stored.response_status, body: JSON.parse(stored.response_json) };
}

export async function deleteExpiredIdempotencyRecords(
  db: D1Database,
  now: string,
  limit = 100,
): Promise<number> {
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) throw new Error('idempotency cleanup limit must be 1-500');
  const result = await db.prepare(
    `DELETE FROM public_write_idempotency
       WHERE rowid IN (
         SELECT rowid FROM public_write_idempotency
          WHERE expires_at < ?
          ORDER BY expires_at ASC, route_scope ASC, key_hash ASC
          LIMIT ?
       )`,
  ).bind(now, limit).run();
  return Number(result.meta?.changes ?? 0);
}
