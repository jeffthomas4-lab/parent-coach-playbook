import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { emitEvent, emitEventSafely } from '../src/lib/events';
import { makeFakeD1 } from './helpers/d1';

// The event bus is best-effort by design: migration 0025 is deliberately
// unapplied, so every production call site can hit a missing table. That makes
// the failure paths the important ones — a bug here shows up as a caller's real
// work (publishing a draft, flipping a status) breaking on a log write that was
// never supposed to be able to break anything.

const validInput = {
  eventType: 'pcd.editorial.draft_ready',
  entityType: 'editorial_draft',
  entityRef: 'articles/some-slug',
  actorType: 'agent' as const,
  actorRef: 'ed',
};

describe('emitEvent', () => {
  it('writes one row with every value bound, never string-built', async () => {
    const d1 = makeFakeD1();
    await emitEvent(d1.db, { ...validInput, payload: { a: 1 }, idempotencyKey: 'k1', occurredAt: '2026-07-30T00:00:00Z' });

    expect(d1.calls).toHaveLength(1);
    const [call] = d1.calls;
    expect(call.sql).toContain('INSERT INTO events');
    expect(call.sql).toContain('ON CONFLICT(idempotency_key) DO NOTHING');
    // id, event_type, entity_type, entity_ref, payload, actor_type, actor_ref,
    // idempotency_key, created_at
    expect(call.params).toHaveLength(9);
    expect(call.params[1]).toBe('pcd.editorial.draft_ready');
    expect(call.params[4]).toBe('{"a":1}');
    expect(call.params[7]).toBe('k1');
    expect(call.params[8]).toBe('2026-07-30T00:00:00Z');
  });

  it('defaults the optional columns rather than binding undefined', async () => {
    const d1 = makeFakeD1();
    await emitEvent(d1.db, validInput);

    const [call] = d1.calls;
    expect(call.params[4]).toBe('{}');       // no payload
    expect(call.params[7]).toBeNull();        // no idempotency key
    expect(typeof call.params[8]).toBe('string');
    expect(Number.isFinite(Date.parse(call.params[8] as string))).toBe(true);
  });

  it('refuses an event type that is not namespaced pcd.<domain>.<event>', async () => {
    const d1 = makeFakeD1();
    const bad = [
      'draft_ready',
      'pcd.editorial',
      'pcd..draft_ready',
      'PCD.editorial.draft_ready',
      'pcd.editorial.draft-ready',
      'other.editorial.draft_ready',
      `pcd.editorial.${'x'.repeat(200)}`,
    ];
    for (const eventType of bad) {
      await expect(emitEvent(d1.db, { ...validInput, eventType })).rejects.toThrow(/not namespaced/);
    }
    expect(d1.calls).toHaveLength(0);
  });

  it('bounds an oversized payload to a marker instead of writing half a structure', async () => {
    const d1 = makeFakeD1();
    await emitEvent(d1.db, { ...validInput, payload: { blob: 'x'.repeat(9000) } });

    const payload = JSON.parse(d1.calls[0].params[4] as string);
    expect(payload.truncated).toBe(true);
    expect(payload.originalLength).toBeGreaterThan(8000);
    expect(() => JSON.parse(d1.calls[0].params[4] as string)).not.toThrow();
  });

  it('falls back to an empty object when the payload cannot be stringified', async () => {
    const d1 = makeFakeD1();
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    await emitEvent(d1.db, { ...validInput, payload: circular });
    expect(d1.calls[0].params[4]).toBe('{}');

    await emitEvent(d1.db, { ...validInput, payload: null });
    expect(d1.calls[1].params[4]).toBe('{}');
  });

  it('surfaces a D1 error to the caller', async () => {
    const d1 = makeFakeD1({ throwOn: /INSERT INTO events/ });
    await expect(emitEvent(d1.db, validInput)).rejects.toThrow('d1 exploded');
  });
});

describe('emitEventSafely', () => {
  let errorSpy: any;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('returns true once the row is written', async () => {
    const d1 = makeFakeD1();
    await expect(emitEventSafely({ PCD_OPS_DB: d1.db }, validInput)).resolves.toBe(true);
    expect(d1.calls).toHaveLength(1);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('returns false without throwing when the binding is absent', async () => {
    await expect(emitEventSafely(undefined, validInput)).resolves.toBe(false);
    await expect(emitEventSafely({}, validInput)).resolves.toBe(false);
    await expect(emitEventSafely({ PCD_OPS_DB: undefined }, validInput)).resolves.toBe(false);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  // events.ts logs its failure path through src/lib/log.ts (Pillar 8's
  // structured logger) now instead of a hand-rolled
  // console.error(JSON.stringify({event, event_type, code})). The three
  // assertions below moved to the logger's field names rather than the old
  // ad hoc ones, because the underlying information is still on the line:
  // `event` -> `action` (still 'pcd_event_emit_failed'), `event_type` ->
  // `eventType` (still the namespaced event type), `code` -> `errorMessage`
  // (still the failure reason, now taken from Error.message rather than a
  // hand-picked string). Nothing here got dropped in the rollout.

  it('swallows an unmigrated table and logs the reason instead of breaking the caller', async () => {
    const d1 = makeFakeD1({ throwOn: /INSERT INTO events/ });
    await expect(emitEventSafely({ PCD_OPS_DB: d1.db }, validInput)).resolves.toBe(false);

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const logged = JSON.parse(errorSpy.mock.calls[0][0] as string);
    expect(logged.action).toBe('pcd_event_emit_failed');
    expect(logged.eventType).toBe('pcd.editorial.draft_ready');
    expect(logged.errorMessage).toBe('d1 exploded');
  });

  it('swallows a bad event type the same way, and logs it', async () => {
    const d1 = makeFakeD1();
    await expect(
      emitEventSafely({ PCD_OPS_DB: d1.db }, { ...validInput, eventType: 'nope' }),
    ).resolves.toBe(false);
    expect(d1.calls).toHaveLength(0);
    expect(JSON.parse(errorSpy.mock.calls[0][0] as string).errorMessage).toMatch(/not namespaced/);
  });

  it('reports a non-Error throw without leaking it', async () => {
    const db: any = {
      prepare() {
        throw 'a string, not an Error';
      },
    };
    await expect(emitEventSafely({ PCD_OPS_DB: db }, validInput)).resolves.toBe(false);
    // The old hand-rolled logger collapsed any non-Error throw to a generic
    // 'unknown_error' marker. src/lib/log.ts's errorFields() does not: for a
    // non-Error value it String()s whatever was actually thrown, so the real
    // value reaches the server-side log line instead of being discarded.
    // That's strictly more information for whoever reads the Worker logs,
    // not a leak to the caller or the customer — emitEventSafely still just
    // returns false either way.
    const logged = JSON.parse(errorSpy.mock.calls[0][0] as string);
    expect(logged.errorMessage).toBe('a string, not an Error');
    expect(logged.errorName).toBeUndefined();
  });
});
