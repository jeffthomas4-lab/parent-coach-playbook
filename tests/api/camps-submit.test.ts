// Tests for POST /api/camps/submit — the site's main public write route.
// Mocks src/lib/camps-db and src/lib/url-health so these tests exercise the
// route's own validation and control flow, not the D1 layer (which has its
// own coverage need, tracked separately — see STANDARD-AUDIT.md Pillar 9 row).

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, jsonRequest, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  insertCamp: vi.fn().mockResolvedValue(undefined),
  geocodeCached: vi.fn().mockResolvedValue({ lat: 47.25, lon: -122.44 }),
  generateCampId: vi.fn().mockReturnValue('camp_test123'),
  uniqueSlug: vi.fn().mockResolvedValue('test-camp'),
  upsertSubmitterOnSubmission: vi.fn().mockResolvedValue(undefined),
  shouldAutoApprove: vi.fn().mockResolvedValue(false),
  incrementSubmitterApproved: vi.fn().mockResolvedValue(undefined),
  listCampsAtAddressForSubmit: vi.fn().mockResolvedValue([]),
  upsertDomainQuality: vi.fn().mockResolvedValue(undefined),
  updateUrlHealth: vi.fn().mockResolvedValue(undefined),
  extractDomain: vi.fn().mockReturnValue(null),
  findFuzzyCampMatches: vi.fn().mockResolvedValue([]),
}));

vi.mock('../../src/lib/url-health', () => ({
  checkUrlHealth: vi.fn().mockResolvedValue({ status: 'live', statusCode: 200, finalUrl: null }),
}));

import { POST } from '../../src/pages/api/camps/submit';

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
};

describe('POST /api/camps/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    expect(campsDb.insertCamp).not.toHaveBeenCalled();
  });

  it('refuses to run without a database binding', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/submit', VALID_PAYLOAD);
    const ctx = makeContext({ request: req, env: {} });
    const res = await POST(ctx);
    expect(res.status).toBe(500);
  });
});
