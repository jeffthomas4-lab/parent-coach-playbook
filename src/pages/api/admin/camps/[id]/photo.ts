// POST /api/admin/camps/:id/photo
// Uploads a hero photo to R2 and stores its key on the camp row.
// Multipart form with field "file". Requires Cloudflare Access.

import type { APIRoute } from 'astro';
import { setHeroPhotoKey, getCampById } from '../../../../../lib/camps-db';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';

export const prerender = false;

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env as
    | { DB: D1Database; PHOTOS?: R2Bucket; ADMIN_EMAILS?: string }
    | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);
  if (!env?.PHOTOS) return json({ ok: false, error: 'r2 bucket not bound (PHOTOS)' }, 500);

  const auth = requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const id = params.id;
  if (!id) return json({ ok: false, error: 'missing id' }, 400);

  const camp = await getCampById(env.DB, id);
  if (!camp) return json({ ok: false, error: 'camp not found' }, 404);

  const fd = await request.formData();
  const file = fd.get('file');
  if (!(file instanceof File)) return json({ ok: false, error: 'no file uploaded' }, 400);

  if (file.size > MAX_BYTES) return json({ ok: false, error: 'file too large (5 MB max)' }, 400);
  if (!ALLOWED_TYPES.has(file.type)) {
    return json({ ok: false, error: 'unsupported type. Use jpg, png, or webp.' }, 400);
  }

  const ext = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
  const key = `camps/${camp.slug}/hero-${Date.now()}.${ext}`;

  await env.PHOTOS.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  await setHeroPhotoKey(env.DB, id, key);
  const updated = await getCampById(env.DB, id);
  return json({ ok: true, key, camp: updated });
};
