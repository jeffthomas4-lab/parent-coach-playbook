// Shared helpers for the /admin/link-health/ per-row admin actions:
// recheck now, mark resolved, and save a suggested replacement URL.
//
// The link_health table (worker-link-checker/schema.sql) is populated from a
// manifest built from repo markdown content, not the other way around — a
// link's URL lives in the site's markdown source files, and this table is
// only a status cache the daily worker (worker-link-checker) writes to.
// Writing a "replacement" here therefore can never change the published
// page by itself; see setSuggestedReplacement below.

export interface LinkCheckResult {
  statusCode: number | null;
  finalUrl: string;
  isBroken: boolean;
  isRedirect: boolean;
  redirectedOffHost: boolean;
  notes: string;
}

export interface LinkHealthRow {
  url: string;
  source_files: string | null;
  last_checked: string | null;
  last_status_code: number | null;
  final_url: string | null;
  is_broken: number;
  is_redirect: number;
  redirected_off_host: number;
  consecutive_failures: number;
  last_broken_at: string | null;
  last_ok_at: string | null;
  wayback_snapshot: string | null;
  suggested_search: string | null;
  notes: string | null;
  first_seen: string;
  resolved_at: string | null;
  resolved_by: string | null;
  suggested_replacement: string | null;
}

const USER_AGENT = 'Mozilla/5.0 (compatible; ParentCoachDeskLinkChecker/1.0; +https://parentcoachdesk.com/about/)';
export const RECHECK_TIMEOUT_MS = 10_000;

/**
 * The complete set of strings a failed fetch can put in `notes`. The value is
 * persisted to link_health, handed back in the recheck API response, and
 * rendered on /admin/link-health/, so it has to be a fixed vocabulary rather
 * than whatever text the remote host or the runtime happened to produce.
 * Four buckets, because those are the four an admin acts on differently:
 * the host is slow, the host is unreachable, the certificate is bad, or
 * something else went wrong and the logs have it.
 */
export const FETCH_FAILURE_NOTES = {
  timeout: 'fetch failed: timed out',
  connection: 'fetch failed: dns or connection error',
  tls: 'fetch failed: tls error',
  other: 'fetch failed: unknown error',
} as const;

const TIMEOUT_CODES = new Set(['ETIMEDOUT', 'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_HEADERS_TIMEOUT', 'UND_ERR_BODY_TIMEOUT']);
const CONNECTION_CODES = new Set([
  'ENOTFOUND', 'EAI_AGAIN', 'ECONNREFUSED', 'ECONNRESET', 'EHOSTUNREACH', 'ENETUNREACH', 'EPIPE', 'EPROTO',
]);

/**
 * Buckets a thrown fetch error by its name/code — never by its message, which
 * can carry the remote host's own text. Returns one of FETCH_FAILURE_NOTES.
 */
function classifyFetchFailure(err: unknown): string {
  const e = (err ?? {}) as { name?: string; code?: string; cause?: { name?: string; code?: string } };
  const name = String(e.name ?? e.cause?.name ?? '');
  const code = String(e.code ?? e.cause?.code ?? '');

  if (name === 'TimeoutError' || name === 'AbortError' || TIMEOUT_CODES.has(code)) {
    return FETCH_FAILURE_NOTES.timeout;
  }
  if (code.startsWith('ERR_TLS') || code.startsWith('ERR_SSL') || code.startsWith('CERT_') ||
      code === 'DEPTH_ZERO_SELF_SIGNED_CERT' || code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' ||
      code === 'SELF_SIGNED_CERT_IN_CHAIN' || code === 'HOSTNAME_MISMATCH') {
    return FETCH_FAILURE_NOTES.tls;
  }
  if (CONNECTION_CODES.has(code)) {
    return FETCH_FAILURE_NOTES.connection;
  }
  return FETCH_FAILURE_NOTES.other;
}

/**
 * Server-side fetch of a single URL for the admin "Recheck now" action.
 * HEAD first, falling back to GET when HEAD is rejected or unsupported —
 * mirrors worker-link-checker/src/index.ts's checkLink, on a shorter
 * (10s) timeout since this runs synchronously inside an admin request
 * instead of a scheduled worker's own budget.
 */
export async function checkLinkNow(url: string): Promise<LinkCheckResult> {
  const originalHost = (() => {
    try { return new URL(url).hostname; } catch { return ''; }
  })();

  let response: Response | null = null;
  const notes: string[] = [];

  try {
    response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
      signal: AbortSignal.timeout(RECHECK_TIMEOUT_MS),
    });
    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*' },
        signal: AbortSignal.timeout(RECHECK_TIMEOUT_MS),
      });
      notes.push('HEAD not supported; checked via GET');
    }
  } catch (err) {
    // Whatever lands in notes gets stored in D1, echoed by the recheck API and
    // rendered on the dashboard, so only the bucketed reason goes in. The full
    // error stays server-side, where debugging actually happens.
    console.error('[link-health] recheck fetch failed', url, err);
    notes.push(classifyFetchFailure(err));
    return {
      statusCode: null,
      finalUrl: url,
      isBroken: true,
      isRedirect: false,
      redirectedOffHost: false,
      notes: notes.join(' | '),
    };
  }

  const statusCode = response.status;
  const finalUrl = response.url || url;
  const finalHost = (() => {
    try { return new URL(finalUrl).hostname; } catch { return ''; }
  })();

  const isRedirect = finalUrl !== url;
  const redirectedOffHost = isRedirect && originalHost !== finalHost;
  const isBroken = statusCode >= 400 && statusCode < 500;

  if (redirectedOffHost) {
    notes.push(`redirected off-host: ${originalHost} → ${finalHost}`);
  }

  return { statusCode, finalUrl, isBroken, isRedirect, redirectedOffHost, notes: notes.join(' | ') };
}

export async function getLinkHealthByUrl(db: D1Database, url: string): Promise<LinkHealthRow | null> {
  return db.prepare(`SELECT * FROM link_health WHERE url = ?`).bind(url).first<LinkHealthRow>();
}

/**
 * Persists a manual recheck's outcome. Same fields worker-link-checker
 * updates on its daily cron pass, so an admin-triggered recheck and the
 * scheduled worker leave the row in an identical shape either way.
 */
export async function applyLinkCheckResult(db: D1Database, url: string, result: LinkCheckResult): Promise<boolean> {
  const now = new Date().toISOString();
  const res = await db.prepare(
    `UPDATE link_health
     SET last_checked = ?1,
         last_status_code = ?2,
         final_url = ?3,
         is_broken = ?4,
         is_redirect = ?5,
         redirected_off_host = ?6,
         consecutive_failures = CASE WHEN ?4 = 1 THEN consecutive_failures + 1 ELSE 0 END,
         last_broken_at = CASE WHEN ?4 = 1 THEN ?1 ELSE last_broken_at END,
         last_ok_at = CASE WHEN ?4 = 0 THEN ?1 ELSE last_ok_at END,
         notes = ?7
     WHERE url = ?8`,
  ).bind(
    now,
    result.statusCode,
    result.finalUrl,
    result.isBroken ? 1 : 0,
    result.isRedirect ? 1 : 0,
    result.redirectedOffHost ? 1 : 0,
    result.notes,
    url,
  ).run();
  return Number((res as any)?.meta?.changes ?? 0) === 1;
}

/**
 * Marks a link resolved so it drops out of the default broken-links list.
 * Additive-only: nothing here ever deletes the row or its check history.
 */
export async function markLinkResolved(db: D1Database, url: string, resolvedBy: string): Promise<boolean> {
  const now = new Date().toISOString();
  const res = await db.prepare(
    `UPDATE link_health SET resolved_at = ?1, resolved_by = ?2 WHERE url = ?3`,
  ).bind(now, resolvedBy, url).run();
  return Number((res as any)?.meta?.changes ?? 0) === 1;
}

/**
 * Records a suggested replacement URL for a broken/redirected link whose
 * source lives in repo markdown, not this table. Saving here never edits
 * published content — the dashboard renders this value next to the
 * source_files list so the fix is a copy-paste into those files, not an
 * automatic write.
 */
export async function setSuggestedReplacement(db: D1Database, url: string, suggestedReplacement: string): Promise<boolean> {
  const res = await db.prepare(
    `UPDATE link_health SET suggested_replacement = ?1 WHERE url = ?2`,
  ).bind(suggestedReplacement, url).run();
  return Number((res as any)?.meta?.changes ?? 0) === 1;
}
