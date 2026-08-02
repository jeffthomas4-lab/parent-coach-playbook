// Edge cache wrapper for GET /api/camps/lite (Pillar 8 of the Website Build
// Standard: "A D1 read that repeats across users goes through the Cache API
// or KV with a stated TTL and a stated invalidation path. 'Cached' with no
// answer for how it gets busted is a fail." This closes STANDARD-AUDIT.md
// item #23 ("Camp-listing pages read D1 on every request with no Cache API
// or KV layer in front of them").
//
// Chose the Cache API over KV: this repo has one KV namespace today (SESSION,
// auto-provisioned for Astro's session feature) and no namespace bound for
// general caching. Cache API needs no wrangler binding at all — it's a
// Workers-runtime global (`caches.default`) — so caching this one read adds
// zero infrastructure. KV would be the better choice if this needed to be
// read from outside a Worker (a scheduled job, a different service); nothing
// here does.
//
// STATED TTL: 5 minutes fresh (CAMPS_LITE_CACHE_TTL_SECONDS), then up to 1
// hour stale-while-revalidate (CAMPS_LITE_STALE_WHILE_REVALIDATE_SECONDS)
// before a copy is treated as unusable. Chosen tighter than /camps/'s own
// 10-minute HTML cache: an admin who just approved or edited a camp and
// checks the live page is a more time-sensitive reader than a parent
// browsing, so this endpoint refreshes faster.
//
// STATED INVALIDATION PATH: every admin mutation that can change what this
// endpoint returns (approve, reject, verify, update, photo replace, and the
// camps-sweep cron's stale-archive stage) calls purgeCampsLiteEdgeCache()
// after its write commits. See src/pages/api/admin/camps/[id]/{approve,
// reject,verify,update,photo}.ts and src/pages/api/cron/camps-sweep.ts.
//
// HONEST LIMITATION: Cloudflare's Cache API is per-colo, not global — a
// purge from the colo that handled an admin's request clears that colo's
// copy only, not every edge location worldwide. The TTL above is the real
// cross-edge staleness bound; the purge call is a best-effort optimization
// that usually helps (many admin sessions and many readers route through
// nearby colos) but is not a global-invalidation guarantee. Do not describe
// this as "instant everywhere" — it isn't, and overclaiming it would be a
// worse bug than the staleness itself.

// A stable synthetic key, not a real route — nothing ever fetches this URL
// directly. It exists only so every read/write/delete call agrees on the
// same Cache API entry.
const CAMPS_LITE_CACHE_KEY_URL = 'https://parentcoachdesk.com/__edge-cache/camps-lite-v1';

// Header this module writes on every cache PUT so a cache HIT can report its
// own age. Not a real HTTP standard header — internal to this cache entry.
const STORED_AT_HEADER = 'x-pcd-cache-stored-at';

export const CAMPS_LITE_CACHE_TTL_SECONDS = 300; // 5 minutes
export const CAMPS_LITE_STALE_WHILE_REVALIDATE_SECONDS = 3600; // 1 hour

// Once a cached entry is this old, a cache HIT still serves it instantly but
// also kicks a non-blocking background refresh (see refreshCampsLiteCache in
// src/pages/api/camps/lite.ts), so a fresh copy is usually already in place
// before the entry's TTL fully lapses. This is the "revalidate in the
// background" half of stale-while-revalidate; the HTTP header above is the
// half that governs downstream caches (browsers, any CDN in front of this
// Worker) that read this response directly.
export const CAMPS_LITE_REVALIDATE_AFTER_SECONDS = 240; // 4 minutes

export interface CampsLiteCacheHit {
  response: Response;
  ageSeconds: number;
}

// The Cache API is a Workers-runtime global with no wrangler binding to
// configure. It does not exist under plain Node — this repo's Vitest suite
// runs `environment: 'node'` with no workerd (see vitest.config.ts), and
// neither does `astro dev` outside `wrangler dev`. Every function below
// feature-detects it and falls back to "no cache available" rather than
// throwing, so a cache miss (including "there is no Cache API here") always
// falls through to a normal D1 read. Caching is a speed optimization here,
// never a correctness dependency.
//
// Type note: `caches.default` is a real Cloudflare Workers runtime API
// (https://developers.cloudflare.com/workers/runtime-apis/cache/), but this
// project's tsconfig has no explicit "lib" override, so TypeScript's default
// lib for its target pulls in the DOM lib alongside @cloudflare/workers-types.
// DOM's own Service-Worker-flavored `CacheStorage`/`Cache` types (which have
// no `.default`) shadow the Cloudflare ones for the same global names, so
// referencing the ambient `CacheStorage`/`Cache` types directly fails to
// typecheck even though `.default` exists at runtime. Sidestepped with local
// interfaces describing only the shape this file actually uses, cast through
// `unknown` — a compile-time workaround for a real global-type collision
// (confirmed via an isolated repro against this repo's own tsconfig
// settings), not a runtime behavior change.
interface CloudflareCacheStorage {
  readonly default: CloudflareCache;
}
interface CloudflareCache {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
  delete(request: Request): Promise<boolean>;
}

function edgeCache(): CloudflareCache | undefined {
  return typeof caches !== 'undefined' ? (caches as unknown as CloudflareCacheStorage).default : undefined;
}

function cacheKeyRequest(): Request {
  return new Request(CAMPS_LITE_CACHE_KEY_URL);
}

export async function getCampsLiteFromEdgeCache(): Promise<CampsLiteCacheHit | undefined> {
  const cache = edgeCache();
  if (!cache) return undefined;
  const hit = await cache.match(cacheKeyRequest());
  if (!hit) return undefined;
  const storedAtRaw = hit.headers.get(STORED_AT_HEADER);
  const storedAtMs = storedAtRaw ? Date.parse(storedAtRaw) : NaN;
  // An entry with no parseable stamp (should not happen — this module is the
  // only writer) is treated as already due for a background refresh rather
  // than trusted as fresh.
  const ageSeconds = Number.isFinite(storedAtMs)
    ? Math.max(0, (Date.now() - storedAtMs) / 1000)
    : CAMPS_LITE_REVALIDATE_AFTER_SECONDS;
  return { response: hit, ageSeconds };
}

export async function putCampsLiteInEdgeCache(body: string): Promise<void> {
  const cache = edgeCache();
  if (!cache) return;
  const response = new Response(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Real Cache-Control on the stored entry, not just a code comment: this
      // is what a downstream cache (a browser, any CDN layer in front of this
      // Worker) reads if it fetches this endpoint directly. s-maxage governs
      // shared caches; stale-while-revalidate lets one serve a slightly-stale
      // copy while it refetches, instead of every client blocking on a D1 hit
      // the moment the entry turns 5 minutes old.
      'Cache-Control': `public, s-maxage=${CAMPS_LITE_CACHE_TTL_SECONDS}, stale-while-revalidate=${CAMPS_LITE_STALE_WHILE_REVALIDATE_SECONDS}`,
      [STORED_AT_HEADER]: new Date().toISOString(),
    },
  });
  await cache.put(cacheKeyRequest(), response);
}

// Best-effort, single-colo purge — see the file header's HONEST LIMITATION
// note. Never throws: a failed purge just means this one colo keeps serving
// its existing copy for up to CAMPS_LITE_CACHE_TTL_SECONDS more, which is a
// staleness window, not a correctness bug.
export async function purgeCampsLiteEdgeCache(): Promise<void> {
  const cache = edgeCache();
  if (!cache) return;
  try {
    await cache.delete(cacheKeyRequest());
  } catch {
    // See file header — staleness, not silence about a real failure mode.
  }
}
