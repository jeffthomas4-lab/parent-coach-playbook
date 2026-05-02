// GET /camp-photos/<key...>
// Serves R2-stored hero photos. Public. Cached at the edge.

import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  const env = (locals as any).runtime?.env as { PHOTOS?: R2Bucket } | undefined;
  if (!env?.PHOTOS) return new Response('R2 not bound', { status: 500 });

  const keyParam = params.key;
  const key = Array.isArray(keyParam) ? keyParam.join('/') : keyParam;
  if (!key) return new Response('Missing key', { status: 400 });

  const obj = await env.PHOTOS.get(key);
  if (!obj) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('etag', obj.httpEtag);
  return new Response(obj.body, { headers });
};
