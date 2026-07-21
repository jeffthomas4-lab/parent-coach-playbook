// Tests for POST /api/admin/source-quality/skip — add/remove a domain from
// the skip-list (migrations/0017_domain_skip_list.sql), plus auth.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/domain-skip-list', () => ({
  addDomainToSkipList: vi.fn().mockResolvedValue(undefined),
  removeDomainFromSkipList: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from '../../src/pages/api/admin/source-quality/skip';
import * as domainSkipList from '../../src/lib/domain-skip-list';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';

function adminRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/source-quality/skip', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://parentcoachdesk.com',
      'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/admin/source-quality/skip', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/source-quality/skip', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: JSON.stringify({ domain: 'bad.example.com', action: 'add', reason: 'aggregator' }),
    });
    const ctx = makeContext({ request: req, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(401);
    expect(domainSkipList.addDomainToSkipList).not.toHaveBeenCalled();
  });

  it('happy path: adding a domain with a reason skip-lists it', async () => {
    const ctx = makeContext({
      request: adminRequest({ domain: 'Bad.Example.com', action: 'add', reason: 'Aggregator, stale listings' }),
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.skip_listed).toBe(true);
    expect(domainSkipList.addDomainToSkipList).toHaveBeenCalledWith(
      expect.anything(),
      'bad.example.com',
      'Aggregator, stale listings',
      'jeffthomas@pugetsound.edu',
    );
  });

  it('happy path: removing (unskip) a domain deletes the entry', async () => {
    const ctx = makeContext({
      request: adminRequest({ domain: 'bad.example.com', action: 'remove' }),
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.skip_listed).toBe(false);
    expect(domainSkipList.removeDomainFromSkipList).toHaveBeenCalledWith(expect.anything(), 'bad.example.com');
  });

  it('failure path: adding a domain without a reason is rejected', async () => {
    const ctx = makeContext({
      request: adminRequest({ domain: 'bad.example.com', action: 'add' }),
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(domainSkipList.addDomainToSkipList).not.toHaveBeenCalled();
  });

  it('failure path: a missing domain is rejected', async () => {
    const ctx = makeContext({
      request: adminRequest({ action: 'add', reason: 'test' }),
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
  });

  it('failure path: an invalid action value is rejected', async () => {
    const ctx = makeContext({
      request: adminRequest({ domain: 'bad.example.com', action: 'bogus' }),
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
    expect(domainSkipList.addDomainToSkipList).not.toHaveBeenCalled();
    expect(domainSkipList.removeDomainFromSkipList).not.toHaveBeenCalled();
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const req = adminRequest({ domain: 'bad.example.com', action: 'add', reason: 'test' }, { origin: 'https://evil.example.com' });
    const ctx = makeContext({ request: req, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(domainSkipList.addDomainToSkipList).not.toHaveBeenCalled();
  });
});
