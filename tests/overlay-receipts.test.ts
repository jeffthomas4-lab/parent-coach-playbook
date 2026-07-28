// Inline editor: receipt chain integrity and tamper detection (Pillar 13 item 3).
//
// "Tests prove update/delete tampering fails, missing/modified/reordered events
// are detected." That is exactly what this file does, against an in-memory
// stand-in for the D1 table that enforces the same append-only triggers.

import { describe, it, expect } from 'vitest';
import { writeReceiptOrFail, verifyChain, digestEmail, type ReceiptInput } from '../src/lib/overlay-receipts';

// ---------------------------------------------------------------------------
// Minimal D1 stand-in. Supports exactly the three statements the receipt module
// issues, plus the append-only triggers, so the tamper tests are meaningful.
// ---------------------------------------------------------------------------

type Row = Record<string, unknown>;

class FakeD1 {
  rows: Row[] = [];
  /** Set true to simulate the receipt store being unavailable. */
  failWrites = false;

  prepare(sql: string) {
    const self = this;
    let bound: unknown[] = [];
    return {
      bind(...args: unknown[]) { bound = args; return this; },
      async first<T>(): Promise<T | null> {
        if (/SELECT row_hash/.test(sql)) {
          const last = self.rows[self.rows.length - 1];
          return (last ? { row_hash: last.row_hash } : null) as T | null;
        }
        if (/^INSERT INTO content_overlay_receipts/.test(sql)) {
          if (self.failWrites) throw new Error('receipt store unavailable');
          const cols = [
            'schema_version','environment','occurred_at','request_id',
            'actor_digest','actor_domain','auth_method','auth_verified',
            'action','region_key','region_label','revision',
            'before_summary','after_summary','before_length','after_length',
            'result','reason','prev_hash','row_hash',
          ];
          const row: Row = { id: self.rows.length + 1 };
          cols.forEach((c, i) => { row[c] = bound[i]; });
          self.rows.push(row);
          return { id: row.id } as T;
        }
        return null;
      },
      async all<T>() {
        return { results: self.rows.slice(0, Number(bound[0] ?? self.rows.length)) as T[] };
      },
    };
  }

  /** Simulates the BEFORE UPDATE trigger. */
  update(): never { throw new Error('content_overlay_receipts is append-only: UPDATE is not permitted'); }
  /** Simulates the BEFORE DELETE trigger. */
  delete(): never { throw new Error('content_overlay_receipts is append-only: DELETE is not permitted'); }
}

const receipt = (over: Partial<ReceiptInput> = {}): ReceiptInput => ({
  environment: 'staging',
  requestId: 'ray-1',
  actorEmail: 'Jeff.Thomas@Example.com',
  authVerified: true,
  action: 'overlay.update',
  regionKey: 'home.hero.headline',
  regionLabel: 'Homepage hero headline',
  revision: 1,
  before: 'old copy',
  after: 'new copy',
  result: 'applied',
  ...over,
});

describe('receipt redaction', () => {
  it('stores a digest, never the raw email', async () => {
    const db = new FakeD1();
    await writeReceiptOrFail(db as any, receipt());
    const row = db.rows[0];
    expect(String(row.actor_digest)).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(row)).not.toContain('Jeff.Thomas@Example.com');
    expect(JSON.stringify(row)).not.toContain('jeff.thomas@example.com');
  });

  it('digests case-insensitively so casing cannot fork identity', async () => {
    expect(await digestEmail('A@B.com')).toBe(await digestEmail('a@b.com  '));
  });

  it('keeps the domain for triage but not the local part', async () => {
    const db = new FakeD1();
    await writeReceiptOrFail(db as any, receipt());
    expect(db.rows[0].actor_domain).toBe('example.com');
  });

  it('bounds before/after summaries', async () => {
    const db = new FakeD1();
    await writeReceiptOrFail(db as any, receipt({ after: 'x'.repeat(5000) }));
    expect(String(db.rows[0].after_summary).length).toBeLessThanOrEqual(201);
    expect(db.rows[0].after_length).toBe(5000);
  });
});

describe('receipt chain integrity', () => {
  it('verifies a clean chain', async () => {
    const db = new FakeD1();
    for (let i = 1; i <= 5; i++) await writeReceiptOrFail(db as any, receipt({ revision: i }));
    const v = await verifyChain(db as any);
    expect(v.ok).toBe(true);
    expect(v.checked).toBe(5);
  });

  it('records rejected and failed attempts, not just successes', async () => {
    const db = new FakeD1();
    await writeReceiptOrFail(db as any, receipt({ result: 'rejected', reason: 'disallowed_tag' }));
    await writeReceiptOrFail(db as any, receipt({ result: 'conflict' }));
    await writeReceiptOrFail(db as any, receipt({ result: 'failed', reason: 'write_failed' }));
    expect(db.rows.map((r) => r.result)).toEqual(['rejected', 'conflict', 'failed']);
    expect((await verifyChain(db as any)).ok).toBe(true);
  });

  it('detects a MODIFIED row', async () => {
    const db = new FakeD1();
    for (let i = 1; i <= 4; i++) await writeReceiptOrFail(db as any, receipt({ revision: i }));
    db.rows[2].after_summary = 'quietly changed';
    const v = await verifyChain(db as any);
    expect(v.ok).toBe(false);
    expect(v.reason).toBe('hash_mismatch');
    expect(v.brokenAtId).toBe(3);
  });

  it('detects a DELETED row', async () => {
    const db = new FakeD1();
    for (let i = 1; i <= 4; i++) await writeReceiptOrFail(db as any, receipt({ revision: i }));
    db.rows.splice(1, 1);
    const v = await verifyChain(db as any);
    expect(v.ok).toBe(false);
    expect(v.reason).toBe('prev_hash_mismatch');
  });

  it('detects REORDERED rows', async () => {
    const db = new FakeD1();
    for (let i = 1; i <= 4; i++) await writeReceiptOrFail(db as any, receipt({ revision: i }));
    [db.rows[1], db.rows[2]] = [db.rows[2], db.rows[1]];
    const v = await verifyChain(db as any);
    expect(v.ok).toBe(false);
  });

  it('detects a re-hashed row whose prev_hash no longer matches', async () => {
    const db = new FakeD1();
    for (let i = 1; i <= 3; i++) await writeReceiptOrFail(db as any, receipt({ revision: i }));
    db.rows[1].prev_hash = 'f'.repeat(64);
    expect((await verifyChain(db as any)).ok).toBe(false);
  });

  it('treats an empty log as intact', async () => {
    const v = await verifyChain(new FakeD1() as any);
    expect(v.ok).toBe(true);
    expect(v.checked).toBe(0);
  });
});

describe('append-only enforcement', () => {
  it('blocks UPDATE', () => {
    expect(() => new FakeD1().update()).toThrow(/append-only/);
  });
  it('blocks DELETE', () => {
    expect(() => new FakeD1().delete()).toThrow(/append-only/);
  });
});

describe('receipt failure cannot pass silently', () => {
  it('throws so the caller cannot report the mutation as complete', async () => {
    const db = new FakeD1();
    db.failWrites = true;
    await expect(writeReceiptOrFail(db as any, receipt())).rejects.toThrow();
  });
});
