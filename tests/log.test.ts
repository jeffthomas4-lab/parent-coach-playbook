// Tests for src/lib/log.ts, the structured logger rolled out across the API
// routes for STANDARD-AUDIT Pillar 8 (Operations & Reliability).

import { describe, it, expect, vi, afterEach } from 'vitest';
import { log, requestIdFrom, createRequestLogger } from '../src/lib/log';

function req(headers: Record<string, string> = {}): Request {
  return new Request('https://parentcoachdesk.com/api/example', { headers });
}

describe('requestIdFrom', () => {
  it('uses cf-ray when the edge set one, so the id matches Cloudflare\'s own logs', () => {
    expect(requestIdFrom(req({ 'cf-ray': '8a1b2c3d4e5f6789-SEA' }))).toBe('8a1b2c3d4e5f6789-SEA');
  });

  it('falls back to a generated id when there is no cf-ray (local dev, a direct unit-test call)', () => {
    const id = requestIdFrom(req());
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(10);
  });
});

describe('log', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('emits one JSON object per line to console.error at error severity, not a plain string', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    log('error', { requestId: 'req-1', action: 'thing_failed', route: 'api/example' });
    expect(spy).toHaveBeenCalledTimes(1);
    const line = spy.mock.calls[0][0] as string;
    const parsed = JSON.parse(line);
    expect(parsed).toMatchObject({ severity: 'error', requestId: 'req-1', action: 'thing_failed', route: 'api/example' });
    expect(typeof parsed.timestamp).toBe('string');
    expect(() => new Date(parsed.timestamp).toISOString()).not.toThrow();
  });

  it('routes warn to console.warn and info/debug to console.log, on purpose per level', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    log('warn', { requestId: 'req-2', action: 'thing_degraded' });
    log('info', { requestId: 'req-2', action: 'thing_happened' });
    log('debug', { requestId: 'req-2', action: 'thing_traced' });
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledTimes(2);
  });

  it('flattens an Error into name/message/stack instead of logging [object Object]', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const err = new Error('boom');
    log('error', { requestId: 'req-3', action: 'thing_failed', error: err });
    const parsed = JSON.parse(spy.mock.calls[0][0] as string);
    expect(parsed.errorMessage).toBe('boom');
    expect(parsed.errorName).toBe('Error');
    expect(typeof parsed.errorStack).toBe('string');
  });

  it('stringifies a non-Error thrown value rather than dropping it', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    log('error', { requestId: 'req-4', action: 'thing_failed', error: 'a string was thrown' });
    const parsed = JSON.parse(spy.mock.calls[0][0] as string);
    expect(parsed.errorMessage).toBe('a string was thrown');
  });

  it('omits error fields entirely when no error was supplied', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    log('error', { requestId: 'req-5', action: 'thing_failed' });
    const parsed = JSON.parse(spy.mock.calls[0][0] as string);
    expect('errorMessage' in parsed).toBe(false);
  });
});

describe('createRequestLogger', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('binds requestId, route, and userId once so every call carries them', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = createRequestLogger(req({ 'cf-ray': 'ray-1' }), { route: 'admin/camps/approve', userId: 'coach@example.com' });
    expect(logger.requestId).toBe('ray-1');
    logger.info('camp_approved', { campId: 'abc' });
    const parsed = JSON.parse(spy.mock.calls[0][0] as string);
    expect(parsed).toMatchObject({
      requestId: 'ray-1',
      route: 'admin/camps/approve',
      userId: 'coach@example.com',
      action: 'camp_approved',
      campId: 'abc',
    });
  });

  it('defaults userId to null for an anonymous public route rather than omitting the field', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const logger = createRequestLogger(req(), { route: 'camps/submit' });
    logger.info('submission_received');
    const parsed = JSON.parse(spy.mock.calls[0][0] as string);
    expect(parsed.userId).toBeNull();
  });

  it('.error() flattens the error onto the bound fields', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logger = createRequestLogger(req({ 'cf-ray': 'ray-2' }), { route: 'camps/submit' });
    logger.error('parse_body_failed', new Error('bad json'), { contentType: 'text/plain' });
    const parsed = JSON.parse(spy.mock.calls[0][0] as string);
    expect(parsed).toMatchObject({
      requestId: 'ray-2',
      route: 'camps/submit',
      action: 'parse_body_failed',
      errorMessage: 'bad json',
      contentType: 'text/plain',
    });
  });
});
