export interface PublicRateLimiter {
  limit(input: { key: string }): Promise<{ success: boolean }>;
}

const hex = (bytes: ArrayBuffer) =>
  [...new Uint8Array(bytes)].map((value) => value.toString(16).padStart(2, '0')).join('');

export async function enforcePublicWriteRateLimit(
  limiter: PublicRateLimiter | undefined,
  request: Request,
  routeKey: string,
  verifiedOrClaimedIdentity?: string | null,
): Promise<Response | null> {
  // An enabled public write must not silently become unlimited because a
  // binding drifted or was omitted. Feature-off routes return before reaching
  // this helper; active routes fail closed until the risk-class limiter exists.
  if (!limiter) {
    return new Response(JSON.stringify({ ok: false, error: 'rate limit unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  const actor = verifiedOrClaimedIdentity?.trim().toLowerCase()
    || request.headers.get('cf-connecting-ip')?.trim()
    || 'anonymous';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${routeKey}\n${actor}`));
  const { success } = await limiter.limit({ key: `${routeKey}:${hex(digest)}` });
  if (success) return null;

  return new Response(JSON.stringify({ ok: false, error: 'too many requests; try again later' }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Retry-After': '60',
      'Cache-Control': 'no-store',
    },
  });
}
