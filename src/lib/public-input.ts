const PRIVATE_V4 = [
  /^0\./,
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^224\./,
  /^2(?:2[5-9]|3\d|4\d|5[0-5])\./,
];

export function normalizeExternalHttpUrl(value: string | undefined, maxLength = 2048): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (trimmed.length > maxLength) throw new Error('URL is too long');

  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error('URL is invalid');
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('URL must use http or https');
  if (url.username || url.password) throw new Error('URL credentials are not allowed');

  const host = url.hostname.toLowerCase().replace(/\.$/, '');
  if (!host || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.includes(':')) {
    throw new Error('URL host is not public');
  }
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) && PRIVATE_V4.some((pattern) => pattern.test(host))) {
    throw new Error('URL host is not public');
  }

  return candidate;
}

export function firstOversizedField(
  payload: Record<string, unknown>,
  limits: Record<string, number>,
): string | null {
  for (const [field, max] of Object.entries(limits)) {
    const value = payload[field];
    if (typeof value === 'string' && value.length > max) return field;
  }
  return null;
}

export async function enforcePublicRequestBoundary(
  request: Request,
  maxBytes = 16_384,
): Promise<Response | null> {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  const origin = request.headers.get('origin');
  const fetchSite = request.headers.get('sec-fetch-site')?.toLowerCase();
  let expectedOrigin: string;
  try { expectedOrigin = new URL(request.url).origin; }
  catch { return new Response(JSON.stringify({ ok: false, error: 'invalid request' }), { status: 400, headers }); }
  if ((origin && origin !== expectedOrigin) || fetchSite === 'cross-site') {
    return new Response(JSON.stringify({ ok: false, error: 'origin not allowed' }), { status: 403, headers });
  }

  const declared = Number.parseInt(request.headers.get('content-length') ?? '', 10);
  if (Number.isFinite(declared) && declared > maxBytes) {
    return new Response(JSON.stringify({ ok: false, error: 'payload too large' }), { status: 413, headers });
  }
  try {
    const bytes = await request.clone().arrayBuffer();
    if (bytes.byteLength > maxBytes) {
      return new Response(JSON.stringify({ ok: false, error: 'payload too large' }), { status: 413, headers });
    }
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid request' }), { status: 400, headers });
  }
  return null;
}
