// Tests for src/lib/admin-receipts.ts and the 0029_admin_action_receipts.sql
// migration together, against a real SQLite engine (Node's built-in
// node:sqlite, experimental but stable enough for a test-only in-memory DB —
// see the sandbox smoke test that motivated this approach). D1 *is* SQLite,
// so running the actual migration DDL here, not a hand-rolled mock schema,
// is what lets these tests prove the append-only triggers and CHECK
// constraints really fire, not just that the TypeScript wrapper believes
// they would. Pillar 13 (Protect-the-App Controls) requires exactly this:
// tests that prove update/delete tampering fails and that missing/modified/
// reordered events are detected, not a happy-path assertion alone.

import { describe, it, expect, beforeEach } from 'vitest';
import { DatabaseSync, type StatementSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  recordAdminReceipt,
  verifyReceiptChain,
  digestActorEmail,
  computeRowHash,
  withAdminReceipt,
  GENESIS_HASH,
  type AdminReceiptRow,
  type MutationOutcome,
} from '../src/lib/admin-receipts';

const MIGRATION_PATH = resolve(__dirname, '../migrations-pcd-ops/0029_admin_action_receipts.sql');

/** Minimal D1Database adapter over node:sqlite, just the surface admin-receipts.ts calls. */
function wrapAsD1(db: DatabaseSync): D1Database {
  return {
    prepare(sql: string) {
      const stmt: StatementSync = db.prepare(sql);
      let bound: unknown[] = [];
      const chain = {
        bind(...params: unknown[]) {
          bound = params;
          return chain;
        },
        async first<T = unknown>(): Promise<T | null> {
          const row = stmt.get(...(bound as never[]));
          return (row as T) ?? null;
        },
        async all<T = unknown>(): Promise<{ results: T[] }> {
          const rows = stmt.all(...(bound as never[]));
          return { results: rows as T[] };
        },
        async run() {
          const info = stmt.run(...(bound as never[]));
          return { meta: { last_row_id: Number(info.lastInsertRowid) } };
        },
      };
      return chain as unknown as D1PreparedStatement;
    },
  } as unknown as D1Database;
}

function freshDb(): { raw: DatabaseSync; d1: D1Database } {
  const raw = new DatabaseSync(':memory:');
  raw.exec(readFileSync(MIGRATION_PATH, 'utf8'));
  return { raw, d1: wrapAsD1(raw) };
}

describe('0029_admin_action_receipts.sql — append-only enforcement (real SQLite)', () => {
  it('blocks UPDATE against an existing receipt', () => {
    const { raw, d1 } = freshDb();
    void d1;
    raw.exec(
      `INSERT INTO admin_action_receipts
         (schema_version, environment, actor_email_digest, actor_email_domain, action, resource_type,
          resource_id, request_id, authorization_context, result, reason, before_summary, after_summary,
          prev_hash, row_hash, created_at)
       VALUES (1, 'test', '${'a'.repeat(64)}', 'example.com', 'camp.approve', 'camp', 'camp_1', 'req1',
               'ctx', 'success', NULL, 'before', 'after', '${GENESIS_HASH}', '${'b'.repeat(64)}', '2026-07-30T00:00:00.000Z')`,
    );
    expect(() => raw.exec("UPDATE admin_action_receipts SET reason = 'tampered' WHERE id = 1")).toThrow(
      /append-only.*UPDATE is forbidden/,
    );
  });

  it('blocks DELETE against an existing receipt', () => {
    const { raw } = freshDb();
    raw.exec(
      `INSERT INTO admin_action_receipts
         (schema_version, environment, actor_email_digest, actor_email_domain, action, resource_type,
          resource_id, request_id, authorization_context, result, reason, before_summary, after_summary,
          prev_hash, row_hash, created_at)
       VALUES (1, 'test', '${'a'.repeat(64)}', 'example.com', 'camp.reject', 'camp', 'camp_2', 'req2',
               'ctx', 'success', NULL, NULL, NULL, '${GENESIS_HASH}', '${'c'.repeat(64)}', '2026-07-30T00:00:00.000Z')`,
    );
    expect(() => raw.exec('DELETE FROM admin_action_receipts WHERE id = 1')).toThrow(
      /append-only.*DELETE is forbidden/,
    );
  });

  it('rejects a row_hash collision via the unique index', () => {
    const { raw } = freshDb();
    const insert = () =>
      raw.exec(
        `INSERT INTO admin_action_receipts
           (schema_version, environment, actor_email_digest, actor_email_domain, action, resource_type,
            resource_id, request_id, authorization_context, result, reason, before_summary, after_summary,
            prev_hash, row_hash, created_at)
         VALUES (1, 'test', '${'a'.repeat(64)}', 'example.com', 'camp.approve', 'camp', 'camp_3', 'req3',
                 'ctx', 'success', NULL, NULL, NULL, '${GENESIS_HASH}', '${'d'.repeat(64)}', '2026-07-30T00:00:00.000Z')`,
      );
    insert();
    expect(insert).toThrow(/UNIQUE constraint failed/);
  });
});

describe('digestActorEmail', () => {
  it('never returns the raw email and always returns a 64-hex digest', async () => {
    const { digest, domain } = await digestActorEmail('Jeff.Thomas@PugetSound.edu');
    expect(digest).toMatch(/^[0-9a-f]{64}$/);
    expect(domain).toBe('pugetsound.edu');
    expect(digest).not.toContain('jeff');
    expect(digest).not.toContain('pugetsound');
  });

  it('is stable for the same email and different for a different one', async () => {
    const a = await digestActorEmail('admin@example.com');
    const b = await digestActorEmail('admin@example.com');
    const c = await digestActorEmail('other-admin@example.com');
    expect(a.digest).toBe(b.digest);
    expect(a.digest).not.toBe(c.digest);
  });
});

describe('recordAdminReceipt + verifyReceiptChain (real SQLite via the D1 adapter)', () => {
  it('writes a receipt with no raw email anywhere in the stored row', async () => {
    const { raw, d1 } = freshDb();
    const result = await recordAdminReceipt(d1, {
      environment: 'https://parentcoachdesk.com',
      actorEmail: 'jeffthomas@pugetsound.edu',
      action: 'camp.approve',
      resourceType: 'camp',
      resourceId: 'camp_42',
      requestId: 'req-42',
      authorizationContext: 'cloudflare-access-jwt:admin-allowlist',
      result: 'success',
      beforeSummary: 'pcd_status!=approved',
      afterSummary: 'pcd_status=approved',
    });
    expect(result.ok).toBe(true);
    const row = raw.prepare('SELECT * FROM admin_action_receipts WHERE id = ?').get(result.id) as Record<string, unknown>;
    const serialized = JSON.stringify(row);
    expect(serialized).not.toContain('jeffthomas@pugetsound.edu');
    expect(row.actor_email_digest).toMatch(/^[0-9a-f]{64}$/);
    expect(row.actor_email_domain).toBe('pugetsound.edu');
    expect(row.prev_hash).toBe(GENESIS_HASH);
  });

  it('chains each new receipt to the previous row_hash, genesis for the first', async () => {
    const { d1 } = freshDb();
    const first = await recordAdminReceipt(d1, {
      environment: 'test', actorEmail: 'a@example.com', action: 'camp.approve',
      resourceType: 'camp', resourceId: 'camp_1', requestId: 'r1',
      authorizationContext: 'ctx', result: 'success',
    });
    const second = await recordAdminReceipt(d1, {
      environment: 'test', actorEmail: 'a@example.com', action: 'camp.reject',
      resourceType: 'camp', resourceId: 'camp_2', requestId: 'r2',
      authorizationContext: 'ctx', result: 'success',
    });
    expect(first.ok && second.ok).toBe(true);
    expect(second.rowHash).not.toBe(first.rowHash);

    const chain = await verifyReceiptChain(d1);
    expect(chain).toEqual({ ok: true, rowsChecked: 2 });
  });

  it('truncates reason/before/after to the 200-char bound', async () => {
    const { raw, d1 } = freshDb();
    const long = 'x'.repeat(500);
    const result = await recordAdminReceipt(d1, {
      environment: 'test', actorEmail: 'a@example.com', action: 'camp.update',
      resourceType: 'camp', resourceId: 'camp_1', requestId: 'r1',
      authorizationContext: 'ctx', result: 'success', reason: long, beforeSummary: long, afterSummary: long,
    });
    const row = raw.prepare('SELECT reason, before_summary, after_summary FROM admin_action_receipts WHERE id = ?')
      .get(result.id) as Record<string, string>;
    expect(row.reason.length).toBeLessThanOrEqual(200);
    expect(row.before_summary.length).toBeLessThanOrEqual(200);
    expect(row.after_summary.length).toBeLessThanOrEqual(200);
  });

  it('detects a modified row (content changed, chain no longer verifies)', async () => {
    const { raw, d1 } = freshDb();
    const r1 = await recordAdminReceipt(d1, {
      environment: 'test', actorEmail: 'a@example.com', action: 'camp.approve',
      resourceType: 'camp', resourceId: 'camp_1', requestId: 'r1', authorizationContext: 'ctx', result: 'success',
    });
    await recordAdminReceipt(d1, {
      environment: 'test', actorEmail: 'a@example.com', action: 'camp.reject',
      resourceType: 'camp', resourceId: 'camp_2', requestId: 'r2', authorizationContext: 'ctx', result: 'success',
    });

    // Simulate an attacker with raw file access bypassing the Worker (and
    // the trigger, since the trigger only guards SQL issued through this
    // same connection's normal statement path — a raw file edit or a
    // dropped trigger both model "outside the app's own write path").
    raw.exec('DROP TRIGGER trg_admin_receipts_no_update');
    raw.exec(`UPDATE admin_action_receipts SET resource_id = 'camp_HACKED' WHERE id = ${r1.id}`);

    const chain = await verifyReceiptChain(d1);
    expect(chain.ok).toBe(false);
    expect(chain.brokenAtId).toBe(r1.id);
    expect(chain.reason).toMatch(/does not match its own content/);
  });

  it('detects a missing row (deleted out from under the chain)', async () => {
    const { raw, d1 } = freshDb();
    await recordAdminReceipt(d1, {
      environment: 'test', actorEmail: 'a@example.com', action: 'camp.approve',
      resourceType: 'camp', resourceId: 'camp_1', requestId: 'r1', authorizationContext: 'ctx', result: 'success',
    });
    const r2 = await recordAdminReceipt(d1, {
      environment: 'test', actorEmail: 'a@example.com', action: 'camp.reject',
      resourceType: 'camp', resourceId: 'camp_2', requestId: 'r2', authorizationContext: 'ctx', result: 'success',
    });
    await recordAdminReceipt(d1, {
      environment: 'test', actorEmail: 'a@example.com', action: 'camp.verify',
      resourceType: 'camp', resourceId: 'camp_3', requestId: 'r3', authorizationContext: 'ctx', result: 'success',
    });

    raw.exec('DROP TRIGGER trg_admin_receipts_no_delete');
    raw.exec(`DELETE FROM admin_action_receipts WHERE id = ${r2.id}`);

    const chain = await verifyReceiptChain(d1);
    expect(chain.ok).toBe(false);
    expect(chain.reason).toMatch(/prev_hash does not chain/);
  });

  it('detects reordered rows (two receipts with swapped resource_id, unrecomputed hashes)', async () => {
    const { raw, d1 } = freshDb();
    const r1 = await recordAdminReceipt(d1, {
      environment: 'test', actorEmail: 'a@example.com', action: 'camp.approve',
      resourceType: 'camp', resourceId: 'camp_A', requestId: 'r1', authorizationContext: 'ctx', result: 'success',
    });
    const r2 = await recordAdminReceipt(d1, {
      environment: 'test', actorEmail: 'a@example.com', action: 'camp.approve',
      resourceType: 'camp', resourceId: 'camp_B', requestId: 'r2', authorizationContext: 'ctx', result: 'success',
    });

    raw.exec('DROP TRIGGER trg_admin_receipts_no_update');
    // Swap the resource_id values without recomputing row_hash for either —
    // exactly what "reordering" the underlying facts looks like at the row
    // level, since the receipts table has no natural row-to-row ordering
    // other than the hash chain itself.
    raw.exec(`UPDATE admin_action_receipts SET resource_id = 'camp_B' WHERE id = ${r1.id}`);
    raw.exec(`UPDATE admin_action_receipts SET resource_id = 'camp_A' WHERE id = ${r2.id}`);

    const chain = await verifyReceiptChain(d1);
    expect(chain.ok).toBe(false);
  });
});

describe('computeRowHash', () => {
  it('is deterministic for identical input and changes when any field changes', async () => {
    const base: AdminReceiptRow = {
      schema_version: 1, environment: 'test', actor_email_digest: 'a'.repeat(64), actor_email_domain: 'example.com',
      action: 'camp.approve', resource_type: 'camp', resource_id: 'camp_1', request_id: 'r1',
      authorization_context: 'ctx', result: 'success', reason: null, before_summary: null, after_summary: null,
      prev_hash: GENESIS_HASH, created_at: '2026-07-30T00:00:00.000Z',
    };
    const h1 = await computeRowHash(base);
    const h2 = await computeRowHash({ ...base });
    const h3 = await computeRowHash({ ...base, resource_id: 'camp_2' });
    expect(h1).toBe(h2);
    expect(h1).not.toBe(h3);
  });
});

describe('withAdminReceipt', () => {
  function env(d1: D1Database) {
    return { PCD_OPS_DB: d1 };
  }

  it('returns the mutation value when the mutation and the receipt both succeed', async () => {
    const { d1 } = freshDb();
    const outcome = await withAdminReceipt(
      {
        env: env(d1), environment: 'test', actorEmail: 'a@example.com', action: 'camp.approve',
        resourceType: 'camp', resourceId: 'camp_1', requestId: 'r1', authorizationContext: 'ctx',
      },
      async (): Promise<MutationOutcome<{ ok: true }>> => ({ outcome: 'success', value: { ok: true } }),
    );
    expect('value' in outcome && outcome.value.ok).toBe(true);
    const chain = await verifyReceiptChain(d1);
    expect(chain).toEqual({ ok: true, rowsChecked: 1 });
  });

  it('passes through a blocked mutation response and still writes a receipt', async () => {
    const { d1 } = freshDb();
    const blockedResponse = new Response(JSON.stringify({ ok: false, error: 'blocked' }), { status: 409 });
    const outcome = await withAdminReceipt(
      {
        env: env(d1), environment: 'test', actorEmail: 'a@example.com', action: 'camp.verify',
        resourceType: 'camp', resourceId: 'camp_1', requestId: 'r1', authorizationContext: 'ctx',
      },
      async (): Promise<MutationOutcome<never>> => ({ outcome: 'blocked', reason: 'not_eligible', response: blockedResponse }),
    );
    expect('response' in outcome && outcome.response.status).toBe(409);
    const chain = await verifyReceiptChain(d1);
    expect(chain.rowsChecked).toBe(1);
  });

  it('never reports success when the receipt write fails — mutation succeeded but the caller sees RECEIPT_WRITE_FAILED', async () => {
    // A D1 stand-in whose prepare() throws on every call, modeling PCD_OPS_DB
    // being unreachable at the exact moment the receipt would be written.
    const brokenDb = {
      prepare() {
        throw new Error('simulated D1 outage');
      },
    } as unknown as D1Database;

    let mutationRan = false;
    const outcome = await withAdminReceipt(
      {
        env: { PCD_OPS_DB: brokenDb }, environment: 'test', actorEmail: 'a@example.com', action: 'camp.approve',
        resourceType: 'camp', resourceId: 'camp_1', requestId: 'r1', authorizationContext: 'ctx',
      },
      async (): Promise<MutationOutcome<{ ok: true }>> => {
        mutationRan = true;
        return { outcome: 'success', value: { ok: true } };
      },
    );

    // The mutation itself really did run and "succeed" from its own point of
    // view — this proves the failure is specifically in the receipt layer,
    // not a mutation bug — but the caller must never see ok:true for it.
    expect(mutationRan).toBe(true);
    expect('response' in outcome).toBe(true);
    if ('response' in outcome) {
      expect(outcome.response.status).toBe(500);
      const body = await outcome.response.clone().json();
      expect(body.code).toBe('RECEIPT_WRITE_FAILED');
      expect(body.ok).toBe(false);
    }
  });

  it('refuses to report success with no PCD_OPS_DB bound at all', async () => {
    const outcome = await withAdminReceipt(
      {
        env: {}, environment: 'test', actorEmail: 'a@example.com', action: 'camp.approve',
        resourceType: 'camp', resourceId: 'camp_1', requestId: 'r1', authorizationContext: 'ctx',
      },
      async (): Promise<MutationOutcome<{ ok: true }>> => ({ outcome: 'success', value: { ok: true } }),
    );
    expect('response' in outcome).toBe(true);
    if ('response' in outcome) {
      expect(outcome.response.status).toBe(500);
      const body = await outcome.response.clone().json();
      expect(body.code).toBe('RECEIPT_WRITE_FAILED');
    }
  });
});
