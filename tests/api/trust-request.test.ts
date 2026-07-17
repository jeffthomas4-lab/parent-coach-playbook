import { beforeEach, describe, expect, it, vi } from 'vitest';
import { jsonRequest, makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/trust-cases', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../src/lib/trust-cases')>();
  return {
    ...original,
    findTrustCaseByIntakeKey: vi.fn().mockResolvedValue(null),
    insertTrustCase: vi.fn().mockImplementation(async (_db, value) => ({ outcome: 'created', id: value.id })),
  };
});

import { POST } from '../../src/pages/api/trust/request';
import * as trustCases from '../../src/lib/trust-cases';

const valid = {
  category: 'listing_correction',
  target_url: 'https://parentcoachdesk.com/camps/test-camp/',
  camp_slug: 'test-camp',
  requester_email: 'Parent@Example.com',
  description: 'The listed dates changed and the official registration page has the new dates.',
};

describe('POST /api/trust/request', () => {
  beforeEach(() => vi.clearAllMocks());

  it('accepts a bounded correction as an open case', async () => {
    const res = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', valid),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true' },
    }));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.status).toBe('open');
    expect(trustCases.insertTrustCase).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      category: 'listing_correction', requester_email: 'parent@example.com', status: 'open',
    }));
  });

  it('is unavailable by default and does not write', async () => {
    const res = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', valid),
      env: { PCD_OPS_DB: {} },
    }));
    expect(res.status).toBe(404);
    expect(trustCases.insertTrustCase).not.toHaveBeenCalled();
  });

  it('rejects an unsupported case category', async () => {
    const res = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', { ...valid, category: 'emergency' }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true' },
    }));
    expect(res.status).toBe(400);
    expect(trustCases.insertTrustCase).not.toHaveBeenCalled();
  });

  it('rejects an external target URL', async () => {
    const res = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', { ...valid, target_url: 'https://evil.example/camp' }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true' },
    }));
    expect(res.status).toBe(400);
    expect(trustCases.insertTrustCase).not.toHaveBeenCalled();
  });

  it('rejects short descriptions and invalid email addresses', async () => {
    const res = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', { ...valid, requester_email: 'bad', description: 'wrong' }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true' },
    }));
    expect(res.status).toBe(400);
    expect(trustCases.insertTrustCase).not.toHaveBeenCalled();
  });

  it('honeypot returns success without writing', async () => {
    const res = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', { ...valid, website: 'spam.example' }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true' },
    }));
    expect(res.status).toBe(200);
    expect(trustCases.insertTrustCase).not.toHaveBeenCalled();
  });

  it('binds browser retries to a validated idempotency key and returns the durable case id', async () => {
    vi.mocked(trustCases.findTrustCaseByIntakeKey).mockResolvedValueOnce(null);
    const res = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', valid, {
        headers: { 'Idempotency-Key': '12345678-1234-1234-1234-123456789abc' },
      }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true' },
    }));
    const firstBody = await readJson(res);
    const inserted = vi.mocked(trustCases.insertTrustCase).mock.calls.at(-1)?.[1];
    expect(firstBody.replayed).toBe(false);
    vi.mocked(trustCases.findTrustCaseByIntakeKey).mockResolvedValueOnce({
      id: 'case_original', request_fingerprint: inserted!.request_fingerprint,
    });
    const replay = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', valid, {
        headers: { 'Idempotency-Key': '12345678-1234-1234-1234-123456789abc' },
      }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true' },
    }));
    expect(await readJson(replay)).toMatchObject({ id: 'case_original', replayed: true });
    expect(trustCases.insertTrustCase).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      intake_key: '12345678-1234-1234-1234-123456789abc', request_fingerprint: expect.stringMatching(/^[a-f0-9]{64}$/),
    }));
  });

  it('rejects malformed or payload-conflicting idempotency keys', async () => {
    const malformed = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', valid, { headers: { 'Idempotency-Key': 'short' } }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true' },
    }));
    expect(malformed.status).toBe(400);

    vi.mocked(trustCases.findTrustCaseByIntakeKey).mockResolvedValueOnce({ id: 'case_existing', request_fingerprint: 'b'.repeat(64) });
    const conflict = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', valid, { headers: { 'Idempotency-Key': '12345678-1234-1234-1234-123456789abc' } }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true' },
    }));
    expect(conflict.status).toBe(409);
  });
});
