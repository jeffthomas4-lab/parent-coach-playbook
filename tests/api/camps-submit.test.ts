// Tests for POST /api/camps/submit — the site's main public write route.
// Mocks src/lib/camps-db and src/lib/url-health so these tests exercise the
// route's own validation and control flow, not the D1 layer (which has its
// own coverage need, tracked separately — see STANDARD-AUDIT.md Pillar 9 row).

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, jsonRequest, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  insertCamp: vi.fn().mockResolvedValue(undefined),
  insertCampSubmission: vi.fn().mockResolvedValue(undefined),
  prepareCampInsertStatements: vi.fn().mockReturnValue([{ run: vi.fn() }, { run: vi.fn() }]),
  prepareSubmitterSubmissionUpsert: vi.fn().mockReturnValue({ run: vi.fn() }),
  geocodeCached: vi.fn().mockResolvedValue({ lat: 47.25, lon: -122.44 }),
  generateCampId: vi.fn().mockReturnValue('camp_test123'),
  uniqueSlug: vi.fn().mockResolvedValue('test-camp'),
  upsertSubmitterOnSubmission: vi.fn().mockResolvedValue(undefined),
  shouldAutoApprove: vi.fn().mockResolvedValue(false),
  listCampsAtAddressForSubmit: vi.fn().mockResolvedValue([]),
  upsertDomainQuality: vi.fn().mockResolvedValue(undefined),
  updateUrlHealth: vi.fn().mockResolvedValue(undefined),
  extractDomain: vi.fn().mockReturnValue(null),
  findFuzzyCampMatches: vi.fn().mockResolvedValue([]),
  countRecentSubmissionsByEmail: vi.fn().mockResolvedValue(1),
}));

vi.mock('../../src/lib/url-health', () => ({
  checkUrlHealth: vi.fn().mockResolvedValue({ status: 'live', statusCode: 200, finalUrl: null }),
}));

vi.mock('../../src/lib/public-idempotency', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/lib/public-idempotency')>();
  return { ...actual, executeIdempotentWrite: vi.fn(), lookupIdempotentWrite: vi.fn() };
});

vi.mock('../../src/lib/email', () => ({
  sendSubmissionConfirmation: vi.fn().mockResolvedValue({ status: 'staged' }),
  sendAdminAlert: vi.fn().mockResolvedValue({ status: 'staged' }),
}));

import { POST } from '../../src/pages/api/camps/submit';
import * as idempotency from '../../src/lib/public-idempotency';
import * as email from '../../src/lib/email';
import * as campsDb from '../../src/lib/camps-db';
import * as urlHealth from '../../src/lib/url-health';

const VALID_PAYLOAD = {
  name: 'Test Soccer Camp',
  sport: 'soccer',
  age_min: '8',
  age_max: '12',
  start_date: '2026-08-01',
  end_date: '2026-08-05',
  address: '123 Main St',
  city: 'Tacoma',
  state: 'WA',
  zip: '98402',
  description: 'A soccer camp for kids that runs Monday through Friday each week this summer.',
  submitted_by_email: 'parent@example.com',
  idempotency_key: 'program_default_key_1234',
};

describe('POST /api/camps/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (idempotency.executeIdempotentWrite as any).mockResolvedValue({
      outcome: 'created', resourceId: 'camp_test123', status: 200,
      body: { ok: true, id: 'camp_test123', slug: 'test-camp', status: 'pending', awaiting_review: false },
    });
    (idempotency.lookupIdempotentWrite as any).mockResolvedValue(null);
  });

  it('happy path: a complete valid submission is accepted and inserted as pending', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/submit', VALID_PAYLOAD);
    const ctx = makeContext({ request: req, env: { DB: {} } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.status).toBe('pending');
  });

  it('retry safety: atomically binds a supplied key to the program, organization, and submitter write', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/submit', { ...VALID_PAYLOAD, idempotency_key: 'program_retry_key_1234' }, {
      headers: { 'Idempotency-Key': 'program_retry_key_1234' },
    });
    const res = await POST(makeContext({ request: req, env: { DB: {} } }));
    expect(res.status).toBe(200);
    expect(res.headers.get('Idempotency-Replayed')).toBe('false');
    expect(idempotency.executeIdempotentWrite).toHaveBeenCalledWith(expect.objectContaining({
      scope: 'directory.program.submit.v1', key: 'program_retry_key_1234', resourceId: 'camp_test123',
      domainStatements: expect.any(Array),
    }));
  });

  it('retry safety: a replay returns the original result without counters, quality writes, or notifications', async () => {
    (idempotency.lookupIdempotentWrite as any).mockResolvedValue({
      outcome: 'replayed', resourceId: 'camp_original', status: 200,
      body: { ok: true, id: 'camp_original', slug: 'original-camp', status: 'pending', awaiting_review: false },
    });
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/submit', { ...VALID_PAYLOAD, idempotency_key: 'program_retry_key_1234' }, {
      headers: { 'Idempotency-Key': 'program_retry_key_1234' },
    });
    const res = await POST(makeContext({ request: req, env: { DB: {} } }));
    expect((await readJson(res)).id).toBe('camp_original');
    expect(res.headers.get('Idempotency-Replayed')).toBe('true');
    expect(campsDb.upsertDomainQuality).not.toHaveBeenCalled();
    expect(campsDb.listCampsAtAddressForSubmit).not.toHaveBeenCalled();
    expect(campsDb.geocodeCached).not.toHaveBeenCalled();
    expect(urlHealth.checkUrlHealth).not.toHaveBeenCalled();
    expect(email.sendSubmissionConfirmation).not.toHaveBeenCalled();
    expect(email.sendAdminAlert).not.toHaveBeenCalled();
  });

  it('retry safety: conflicting key reuse performs no downstream effect', async () => {
    (idempotency.lookupIdempotentWrite as any).mockResolvedValue({ outcome: 'conflict' });
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/submit', { ...VALID_PAYLOAD, idempotency_key: 'program_retry_key_1234' }, {
      headers: { 'Idempotency-Key': 'program_retry_key_1234' },
    });
    const res = await POST(makeContext({ request: req, env: { DB: {} } }));
    expect(res.status).toBe(409);
    expect(campsDb.upsertDomainQuality).not.toHaveBeenCalled();
    expect(email.sendAdminAlert).not.toHaveBeenCalled();
  });

  it('failure path: missing required fields is rejected with a clean 400', async () => {
    const { name, ...incomplete } = VALID_PAYLOAD;
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/submit', incomplete);
    const ctx = makeContext({ request: req, env: { DB: {} } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.error).toContain('name');
  });

  it('failure path: invalid age range is rejected', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/submit', {
      ...VALID_PAYLOAD,
      age_min: '15',
      age_max: '10',
    });
    const ctx = makeContext({ request: req, env: { DB: {} } });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
  });

  it('bot rejection: a filled honeypot field short-circuits to 200 without inserting', async () => {
    const campsDb = await import('../../src/lib/camps-db');
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/submit', {
      ...VALID_PAYLOAD,
      website: 'http://spam.example.com',
    });
    const ctx = makeContext({ request: req, env: { DB: {} } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(campsDb.insertCampSubmission).not.toHaveBeenCalled();
  });

  it('refuses to run without a database binding', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/submit', VALID_PAYLOAD);
    const ctx = makeContext({ request: req, env: {} });
    const res = await POST(ctx);
    expect(res.status).toBe(500);
  });

  it('security: a public caller cannot auto-approve by impersonating a trusted email', async () => {
    const campsDb = await import('../../src/lib/camps-db');
    (campsDb.shouldAutoApprove as any).mockResolvedValue(true);
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/submit', VALID_PAYLOAD);
    const ctx = makeContext({ request: req, env: { DB: {} } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(body.status).toBe('pending');
    expect(idempotency.executeIdempotentWrite).toHaveBeenCalled();
  });

  it('security: a bulk token copied into the public JSON body cannot bypass moderation', async () => {
    const campsDb = await import('../../src/lib/camps-db');
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/submit', {
      ...VALID_PAYLOAD,
      import_token: 'bulk-secret',
    });
    const ctx = makeContext({ request: req, env: { DB: {}, BULK_IMPORT_TOKEN: 'bulk-secret' } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(body.status).toBe('pending');
    expect(idempotency.executeIdempotentWrite).toHaveBeenCalled();
  });

  it('security: a valid historical bulk bearer credential still cannot bypass moderation', async () => {
    const campsDb = await import('../../src/lib/camps-db');
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/submit', VALID_PAYLOAD, {
      headers: { Authorization: 'Bearer bulk-secret' },
    });
    const ctx = makeContext({ request: req, env: { DB: {}, BULK_IMPORT_TOKEN: 'bulk-secret' } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(body.status).toBe('pending');
    expect(body.awaiting_review).toBe(false);
    expect(idempotency.executeIdempotentWrite).toHaveBeenCalled();
  });

  it('keeps an import pending when the bearer credential is wrong', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/submit', VALID_PAYLOAD, {
      headers: { Authorization: 'Bearer wrong-secret' },
    });
    const ctx = makeContext({ request: req, env: { DB: {}, BULK_IMPORT_TOKEN: 'bulk-secret' } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(body.status).toBe('pending');
    expect(body.awaiting_review).toBe(false);
  });

  it('security: rejects a private-network website URL before fetching or inserting', async () => {
    const campsDb = await import('../../src/lib/camps-db');
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/submit', {
      ...VALID_PAYLOAD,
      website_url: 'http://127.0.0.1/admin',
    });
    const ctx = makeContext({ request: req, env: { DB: {} } });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
    expect(campsDb.insertCampSubmission).not.toHaveBeenCalled();
  });
});
