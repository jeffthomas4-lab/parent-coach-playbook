// D1 access for proof_inbox (migration 0026, PCD_OPS_DB). Raw, unmoderated
// "share your experience" submissions for the /proof page. This table is
// never read by the published page -- see src/lib/proof.ts and
// src/data/proof.json. A human pulls new rows into src/data/proof-inbox.json
// via `node scripts/proof.mjs pull` and reviews them there.
//
// Same idempotent-retry shape as trust-cases.ts: a caller-supplied
// intake_key with ON CONFLICT DO NOTHING, plus a request_fingerprint so a
// retried submission with the same key but different content comes back as
// a conflict instead of silently being dropped or overwritten.

export const PROOF_SOURCES = [
  'google', 'yelp', 'facebook', 'instagram', 'x',
  'email', 'sms', 'form', 'screenshot', 'other',
] as const;
export type ProofInboxSource = (typeof PROOF_SOURCES)[number];

export interface NewProofInboxRow {
  id: string;
  quote: string;
  name: string;
  context: string | null;
  source: ProofInboxSource;
  source_url: string | null;
  product: string | null;
  status: 'new';
  created_at: string;
  intake_key: string | null;
  request_fingerprint: string;
}

export interface ProofInboxInsertResult {
  outcome: 'created' | 'replayed';
  id: string;
}

export type ProofInboxInsertOutcome = ProofInboxInsertResult | { outcome: 'conflict' };

export async function findProofInboxByIntakeKey(
  db: D1Database,
  intakeKey: string,
): Promise<{ id: string; request_fingerprint: string } | null> {
  const row = await db
    .prepare(`SELECT id, request_fingerprint FROM proof_inbox WHERE intake_key = ?`)
    .bind(intakeKey)
    .first<{ id: string; request_fingerprint: string }>();
  return row ?? null;
}

export async function insertProofInboxRow(
  db: D1Database,
  row: NewProofInboxRow,
): Promise<ProofInboxInsertOutcome> {
  await db
    .prepare(
      `INSERT INTO proof_inbox
         (id, quote, name, context, source, source_url, product, status,
          created_at, intake_key, request_fingerprint)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(intake_key) WHERE intake_key IS NOT NULL DO NOTHING`,
    )
    .bind(
      row.id, row.quote, row.name, row.context, row.source, row.source_url,
      row.product, row.status, row.created_at, row.intake_key, row.request_fingerprint,
    )
    .run();

  if (!row.intake_key) return { outcome: 'created', id: row.id };

  const stored = await findProofInboxByIntakeKey(db, row.intake_key);
  if (!stored) return { outcome: 'created', id: row.id };
  if (stored.id === row.id) return { outcome: 'created', id: row.id };
  // A different row already owns this intake_key -- the INSERT above was a
  // no-op. Compare fingerprints to tell a legitimate replay from a genuine
  // conflict (same key reused for different content).
  if (stored.request_fingerprint !== row.request_fingerprint) return { outcome: 'conflict' };
  return { outcome: 'replayed', id: stored.id };
}
