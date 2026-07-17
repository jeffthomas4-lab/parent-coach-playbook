import { describe, expect, it } from 'vitest';
import { deleteExpiredIdempotencyRecords, executeIdempotentWrite, suppliedIdempotencyKey } from '../../src/lib/public-idempotency';
import { makeFakeD1 } from '../helpers/d1';

describe('public write idempotency', () => {
  it('atomically reserves the result with the domain statement', async () => {
    const fake = makeFakeD1();
    fake.queueFirst(null);
    const domain = fake.db.prepare('INSERT INTO org_suggestions (id) VALUES (?)').bind('s1');
    const result = await executeIdempotentWrite({
      db: fake.db, scope: 'directory.organization.suggest.v1', key: 'retry_key_1234567890', payloadHash: 'payload',
      resourceId: 's1', status: 200, body: { ok: true, id: 's1' }, now: '2026-07-16T00:00:00Z',
      expiresAt: '2026-08-15T00:00:00Z', domainStatements: [domain],
    });
    expect(result.outcome).toBe('created');
    expect(fake.calls.some((call) => call.sql.includes('INSERT INTO public_write_idempotency'))).toBe(true);
    expect(fake.calls.some((call) => call.sql.includes('INSERT INTO org_suggestions'))).toBe(true);
  });

  it('replays a matching durable result without running domain statements', async () => {
    const fake = makeFakeD1();
    fake.queueFirst({ payload_hash: 'payload', resource_id: 'original', response_status: 200, response_json: '{"ok":true,"id":"original"}' });
    const domain = fake.db.prepare('INSERT INTO org_suggestions (id) VALUES (?)').bind('new');
    const result = await executeIdempotentWrite({
      db: fake.db, scope: 'directory.organization.suggest.v1', key: 'retry_key_1234567890', payloadHash: 'payload',
      resourceId: 'new', status: 200, body: { ok: true, id: 'new' }, now: '2026-07-16T00:00:00Z',
      expiresAt: '2026-08-15T00:00:00Z', domainStatements: [domain],
    });
    expect(result).toEqual({ outcome: 'replayed', resourceId: 'original', status: 200, body: { ok: true, id: 'original' } });
    expect(fake.calls.some((call) => call.sql.includes('INSERT INTO org_suggestions'))).toBe(false);
  });

  it('fails closed when the same key is bound to another payload', async () => {
    const fake = makeFakeD1();
    fake.queueFirst({ payload_hash: 'other', resource_id: 'original', response_status: 200, response_json: '{}' });
    const result = await executeIdempotentWrite({
      db: fake.db, scope: 'directory.organization.suggest.v1', key: 'retry_key_1234567890', payloadHash: 'payload',
      resourceId: 'new', status: 200, body: {}, now: '2026-07-16T00:00:00Z', expiresAt: '2026-08-15T00:00:00Z', domainStatements: [],
    });
    expect(result).toEqual({ outcome: 'conflict' });
  });

  it('rejects malformed and disagreeing keys', () => {
    expect(suppliedIdempotencyKey(new Request('https://example.com', { headers: { 'Idempotency-Key': 'short' } })).error).toBeTruthy();
    expect(suppliedIdempotencyKey(new Request('https://example.com', { headers: { 'Idempotency-Key': 'retry_key_1234567890' } }), 'different_key_12345678').error).toBeTruthy();
  });

  it('cleans up only a bounded, deterministic expired batch', async () => {
    const fake = makeFakeD1();
    fake.queueRun({ meta: { changes: 25 } });
    expect(await deleteExpiredIdempotencyRecords(fake.db, '2026-08-16T00:00:00Z', 25)).toBe(25);
    const call = fake.calls[0];
    expect(call.sql).toContain('WHERE expires_at < ?');
    expect(call.sql).toContain('ORDER BY expires_at ASC, route_scope ASC, key_hash ASC');
    expect(call.sql).toContain('LIMIT ?');
    expect(call.params).toEqual(['2026-08-16T00:00:00Z', 25]);
  });

  it('rejects unbounded cleanup limits', async () => {
    await expect(deleteExpiredIdempotencyRecords(makeFakeD1().db, '2026-08-16T00:00:00Z', 501)).rejects.toThrow('1-500');
  });
});
