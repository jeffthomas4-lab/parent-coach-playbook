import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/editorial-records', () => ({ addClaim: vi.fn(), validateClaim: vi.fn() }));
import { POST as createClaim } from '../../src/pages/api/admin/editorial/claims/create';
import { POST as validateClaimRoute } from '../../src/pages/api/admin/editorial/claims/[id]/validate';
import * as records from '../../src/lib/editorial-records';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const request = (url: string, body: unknown, origin = 'https://parentcoachdesk.com', auth = true) =>
  new Request(url, {
    method: 'POST', body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', origin, ...(auth ? { 'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu' } : {}) },
  });

describe('POST /api/admin/editorial/claims/create', () => {
  beforeEach(() => vi.clearAllMocks());
  const url = 'https://parentcoachdesk.com/api/admin/editorial/claims/create';

  it('requires Cloudflare Access identity and same-origin', async () => {
    expect((await createClaim(makeContext({ request: request(url, { brief_id: 'brief_1', claim_text: 'x' }, undefined, false), env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } }))).status).toBe(401);
    expect((await createClaim(makeContext({ request: request(url, { brief_id: 'brief_1', claim_text: 'x' }, 'https://evil.example'), env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } }))).status).toBe(403);
    expect(records.addClaim).not.toHaveBeenCalled();
  });

  it('rejects an empty claim_text', async () => {
    const res = await createClaim(makeContext({ request: request(url, { brief_id: 'brief_1', claim_text: '   ' }), env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } }));
    expect(res.status).toBe(400);
  });

  it('creates a claim with the authenticated actor recorded', async () => {
    (records.addClaim as any).mockResolvedValue({ id: 'claim_1', validated: 0 });
    const res = await createClaim(makeContext({ request: request(url, { brief_id: 'brief_1', claim_text: 'Most divisions cap at age 12.' }), env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } }));
    const body = await readJson(res);
    expect(res.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(records.addClaim).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ actor: 'jeffthomas@pugetsound.edu' }));
  });
});

describe('POST /api/admin/editorial/claims/:id/validate', () => {
  beforeEach(() => vi.clearAllMocks());
  const url = 'https://parentcoachdesk.com/api/admin/editorial/claims/claim_1/validate';

  it('requires Cloudflare Access identity and same-origin', async () => {
    expect((await validateClaimRoute(makeContext({ request: request(url, { source_ids: ['source_1'] }, undefined, false), params: { id: 'claim_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } }))).status).toBe(401);
    expect((await validateClaimRoute(makeContext({ request: request(url, { source_ids: ['source_1'] }, 'https://evil.example'), params: { id: 'claim_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } }))).status).toBe(403);
    expect(records.validateClaim).not.toHaveBeenCalled();
  });

  it('requires at least one source id', async () => {
    const res = await validateClaimRoute(makeContext({ request: request(url, { source_ids: [] }), params: { id: 'claim_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } }));
    expect(res.status).toBe(400);
    expect(records.validateClaim).not.toHaveBeenCalled();
  });

  it('validates a claim against its recorded sources', async () => {
    (records.validateClaim as any).mockResolvedValue({ id: 'claim_1', validated: 1 });
    const res = await validateClaimRoute(makeContext({ request: request(url, { source_ids: ['source_1', 'source_2'] }), params: { id: 'claim_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } }));
    expect(res.status).toBe(200);
    expect(records.validateClaim).toHaveBeenCalledWith(expect.anything(), { claimId: 'claim_1', sourceIds: ['source_1', 'source_2'], actor: 'jeffthomas@pugetsound.edu' });
  });
});
