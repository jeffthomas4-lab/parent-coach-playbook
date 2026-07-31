// POST /api/admin/camps/:id/photo
// Uploads a hero photo to R2 and stores its key on the camp row.
// Multipart form with field "file". Requires Cloudflare Access.

import type { APIRoute } from 'astro';
import { setHeroPhotoKey, getCampById, type Camp } from '../../../../../lib/camps-db';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { sniffAllowedImageType, type AllowedImageType } from '../../../../../lib/image-upload';
import { withAdminReceipt, type MutationOutcome } from '../../../../../lib/admin-receipts';
import { createRequestLogger } from '../../../../../lib/log';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set<AllowedImageType>(['image/jpeg', 'image/png', 'image/webp']);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as
    | { DB: D1Database; PHOTOS?: R2Bucket; ADMIN_EMAILS?: string; PCD_OPS_DB?: D1Database; SITE_URL?: string }
    | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);
  if (!env?.PHOTOS) return json({ ok: false, error: 'r2 bucket not bound (PHOTOS)' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const logger = createRequestLogger(request, { route: 'admin/camps/photo', userId: auth.email });

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const id = params.id;
  if (!id) return json({ ok: false, error: 'missing id' }, 400);

  const camp = await getCampById(env.DB, id);
  if (!camp) return json({ ok: false, error: 'camp not found' }, 404);

  const fd = await request.formData();
  const file = fd.get('file');
  if (!(file instanceof File)) return json({ ok: false, error: 'no file uploaded' }, 400);

  // The sibling camps routes detect a browser form post from the content type,
  // because they accept JSON *or* a form. This route is multipart-only, so the
  // content type is always "form" and cannot tell a plain <form> submit apart
  // from a scripted multipart fetch. The admin page's non-JS form therefore
  // declares itself with a hidden field, and only that gets the redirect —
  // otherwise a successful upload dropped the admin on a raw JSON page.
  const isForm = fd.get('form_post') === '1';

  if (file.size > MAX_BYTES) return json({ ok: false, error: 'file too large (5 MB max)' }, 400);
  if (!ALLOWED_TYPES.has(file.type as AllowedImageType)) {
    return json({ ok: false, error: 'unsupported type. Use jpg, png, or webp.' }, 400);
  }

  const detectedType = await sniffAllowedImageType(file);
  if (!detectedType || detectedType !== file.type) {
    return json({ ok: false, error: 'file content does not match an allowed image type' }, 400);
  }

  const ext = detectedType === 'image/jpeg' ? 'jpg' : detectedType === 'image/png' ? 'png' : 'webp';
  const key = `camps/${camp.slug}/hero-${Date.now()}.${ext}`;
  const previousKey = camp.hero_photo_key ?? null;
  const requestId = logger.requestId;

  const receipted = await withAdminReceipt(
    {
      env,
      environment: env.SITE_URL ?? 'unknown',
      actorEmail: auth.email,
      action: 'camp.photo_replace',
      resourceType: 'camp',
      resourceId: id,
      requestId,
      authorizationContext: 'cloudflare-access-jwt:admin-allowlist',
    },
    async (): Promise<MutationOutcome<{ key: string; camp: Camp | null }>> => {
      await env.PHOTOS!.put(key, file.stream(), {
        httpMetadata: { contentType: detectedType, contentDisposition: 'inline' },
      });

      // R2 and D1 are two stores with no shared transaction. If the row never
      // learns about the object, nothing can ever reach it or clean it up, so the
      // write is compensated here instead of leaving a permanent orphan.
      try {
        await setHeroPhotoKey(env.DB, id, key);
      } catch (error) {
        logger.error('hero_photo_key_write_failed', error, { key });
        try {
          await env.PHOTOS!.delete(key);
        } catch (cleanupError) {
          logger.error('orphaned_object_cleanup_failed', cleanupError, { key });
        }
        return {
          outcome: 'error',
          reason: 'hero_photo_key_write_failed',
          response: json({ ok: false, error: 'photo upload failed' }, 500),
        };
      }

      // The row now points at the new object, so the one it replaced is
      // unreachable. Only a key this camp's own hero prefix produced is removed;
      // anything else (including a key written under a previous slug) is left
      // alone rather than risk deleting an object that belongs elsewhere.
      if (previousKey && previousKey !== key && previousKey.startsWith(`camps/${camp.slug}/hero-`)) {
        try {
          await env.PHOTOS!.delete(previousKey);
        } catch (cleanupError) {
          logger.error('replaced_hero_cleanup_failed', cleanupError, { previousKey });
        }
      }

      const updated = await getCampById(env.DB, id);
      return {
        outcome: 'success',
        value: { key, camp: updated },
        beforeSummary: previousKey ? `hero_photo_key=${previousKey}` : 'hero_photo_key=null',
        afterSummary: `hero_photo_key=${key}`,
      };
    },
  );

  if ('response' in receipted) return receipted.response;
  const { key: savedKey, camp: updated } = receipted.value;

  if (isForm) {
    return new Response(null, {
      status: 303,
      headers: { Location: `/admin/camps/${id}/` },
    });
  }

  return json({ ok: true, key: savedKey, camp: updated });
};
