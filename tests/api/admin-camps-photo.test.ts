// Tests for POST /api/admin/camps/:id/photo — three-test minimum: happy path, failure path, auth.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  setHeroPhotoKey: vi.fn(),
  getCampById: vi.fn(),
}));

import { POST } from '../../src/pages/api/admin/camps/[id]/photo';
import * as campsDb from '../../src/lib/camps-db';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const mockCamp = { id: 'camp_1', slug: 'test-camp', name: 'Test Camp' };
const JPEG_BYTES = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);

function fileRequest(opts: { withAuth?: boolean; origin?: string; file?: File | null } = {}) {
  const { withAuth = true, origin = 'https://parentcoachdesk.com', file } = opts;
  const fd = new FormData();
  if (file !== null) {
    fd.set('file', file ?? new File([JPEG_BYTES], 'hero.jpg', { type: 'image/jpeg' }));
  }
  const headers: Record<string, string> = { origin };
  if (withAuth) headers['Cf-Access-Authenticated-User-Email'] = 'jeffthomas@pugetsound.edu';
  return new Request('https://parentcoachdesk.com/api/admin/camps/camp_1/photo', {
    method: 'POST',
    headers,
    body: fd,
  });
}

function makeEnv(extra: Record<string, unknown> = {}) {
  return { DB: {}, PHOTOS: { put: vi.fn().mockResolvedValue(undefined) }, ADMIN_EMAILS, ...extra };
}

describe('POST /api/admin/camps/:id/photo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.getCampById as any).mockResolvedValue(mockCamp);
    (campsDb.setHeroPhotoKey as any).mockResolvedValue(undefined);
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const req = fileRequest({ withAuth: false });
    const ctx = makeContext({ request: req, params: { id: 'camp_1' }, env: makeEnv() });
    const res = await POST(ctx);
    expect(res.status).toBe(401);
    expect(campsDb.setHeroPhotoKey).not.toHaveBeenCalled();
  });

  it('happy path: an allowed admin uploading a valid jpeg succeeds', async () => {
    const env = makeEnv();
    const ctx = makeContext({ request: fileRequest(), params: { id: 'camp_1' }, env });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(env.PHOTOS.put).toHaveBeenCalled();
    expect(campsDb.setHeroPhotoKey).toHaveBeenCalledWith(expect.anything(), 'camp_1', expect.stringContaining('camps/test-camp/hero-'));
  });

  it('failure path: an oversized file is rejected before touching R2 or the DB', async () => {
    const big = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'hero.jpg', { type: 'image/jpeg' });
    const env = makeEnv();
    const ctx = makeContext({ request: fileRequest({ file: big }), params: { id: 'camp_1' }, env });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(env.PHOTOS.put).not.toHaveBeenCalled();
    expect(campsDb.setHeroPhotoKey).not.toHaveBeenCalled();
  });

  it('failure path: an unsupported file type is rejected', async () => {
    const gif = new File([new Uint8Array([1, 2, 3])], 'hero.gif', { type: 'image/gif' });
    const ctx = makeContext({ request: fileRequest({ file: gif }), params: { id: 'camp_1' }, env: makeEnv() });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.error).toMatch(/unsupported type/);
  });

  it('failure path: a spoofed jpeg MIME type is rejected before touching R2 or the DB', async () => {
    const spoofed = new File([new TextEncoder().encode('<script>alert(1)</script>')], 'hero.jpg', { type: 'image/jpeg' });
    const env = makeEnv();
    const ctx = makeContext({ request: fileRequest({ file: spoofed }), params: { id: 'camp_1' }, env });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.error).toMatch(/content does not match/);
    expect(env.PHOTOS.put).not.toHaveBeenCalled();
    expect(campsDb.setHeroPhotoKey).not.toHaveBeenCalled();
  });

  it('failure path: declared image type must match the detected signature', async () => {
    const mismatched = new File([JPEG_BYTES], 'hero.png', { type: 'image/png' });
    const env = makeEnv();
    const ctx = makeContext({ request: fileRequest({ file: mismatched }), params: { id: 'camp_1' }, env });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
    expect(env.PHOTOS.put).not.toHaveBeenCalled();
  });

  it('failure path: a camp id that does not exist returns 404', async () => {
    (campsDb.getCampById as any).mockResolvedValue(null);
    const ctx = makeContext({ request: fileRequest(), params: { id: 'does-not-exist' }, env: makeEnv() });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const ctx = makeContext({
      request: fileRequest({ origin: 'https://evil.example.com' }),
      params: { id: 'camp_1' },
      env: makeEnv(),
    });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(campsDb.setHeroPhotoKey).not.toHaveBeenCalled();
  });
});
