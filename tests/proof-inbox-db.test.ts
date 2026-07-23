// Unit tests for src/lib/proof-inbox-db.ts — the D1 access layer for the
// unmoderated proof_inbox table. Uses the shared FakeD1 double so we assert
// on bound parameters and the idempotent-retry outcomes (created / replayed /
// conflict) without a live database.

import { describe, it, expect } from 'vitest';
import { makeFakeD1 } from './helpers/d1';
import {
  findProofInboxByIntakeKey,
  insertProofInboxRow,
  PROOF_SOURCES,
  type NewProofInboxRow,
} from '../src/lib/proof-inbox-db';

const baseRow: NewProofInboxRow = {
  id: 'proof_1',
  quote: 'q',
  name: 'n',
  context: null,
  source: 'form',
  source_url: null,
  product: null,
  status: 'new',
  created_at: '2026-07-23T00:00:00.000Z',
  intake_key: null,
  request_fingerprint: 'fp1',
};

describe('proof-inbox-db', () => {
  it('PROOF_SOURCES carries the documented set', () => {
    expect(PROOF_SOURCES).toContain('google');
    expect(PROOF_SOURCES).toContain('screenshot');
    expect(PROOF_SOURCES).toContain('form');
  });

  it('findProofInboxByIntakeKey returns the row using a bound parameter', async () => {
    const d1 = makeFakeD1();
    d1.queueFirst({ id: 'proof_9', request_fingerprint: 'fpX' });
    const row = await findProofInboxByIntakeKey(d1.db, 'key-123');
    expect(row).toEqual({ id: 'proof_9', request_fingerprint: 'fpX' });
    expect(d1.calls[0].params).toEqual(['key-123']);
    expect(d1.calls[0].sql).not.toContain('key-123'); // bound, not string-built
  });

  it('findProofInboxByIntakeKey returns null when nothing matches', async () => {
    const d1 = makeFakeD1();
    d1.queueFirst(null);
    expect(await findProofInboxByIntakeKey(d1.db, 'missing')).toBeNull();
  });

  it('an insert with no intake key is always created', async () => {
    const d1 = makeFakeD1();
    const out = await insertProofInboxRow(d1.db, baseRow);
    expect(out).toEqual({ outcome: 'created', id: 'proof_1' });
  });

  it('an insert with a brand-new intake key is created', async () => {
    const d1 = makeFakeD1();
    d1.queueFirst(null); // post-insert lookup finds nothing
    const out = await insertProofInboxRow(d1.db, { ...baseRow, intake_key: 'k1' });
    expect(out).toEqual({ outcome: 'created', id: 'proof_1' });
  });

  it('an insert where this same row already owns the key is created', async () => {
    const d1 = makeFakeD1();
    d1.queueFirst({ id: 'proof_1', request_fingerprint: 'fp1' });
    const out = await insertProofInboxRow(d1.db, { ...baseRow, intake_key: 'k1' });
    expect(out).toEqual({ outcome: 'created', id: 'proof_1' });
  });

  it('same key + same fingerprint on a different row is a replay', async () => {
    const d1 = makeFakeD1();
    d1.queueFirst({ id: 'proof_other', request_fingerprint: 'fp1' });
    const out = await insertProofInboxRow(d1.db, { ...baseRow, intake_key: 'k1' });
    expect(out).toEqual({ outcome: 'replayed', id: 'proof_other' });
  });

  it('same key + different fingerprint is a conflict', async () => {
    const d1 = makeFakeD1();
    d1.queueFirst({ id: 'proof_other', request_fingerprint: 'DIFFERENT' });
    const out = await insertProofInboxRow(d1.db, { ...baseRow, intake_key: 'k1' });
    expect(out).toEqual({ outcome: 'conflict' });
  });
});
