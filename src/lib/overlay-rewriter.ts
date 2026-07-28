// Inline editor: the edge substitution pass.
//
// WHY THIS EXISTS. parentcoachdesk.com is `output: 'static'`. Public pages are
// prerendered at build time and served from the edge as assets, so an Astro
// component cannot read KV per request. Three ways to get live overlay values
// onto a static page:
//
//   a) client-side DOM swap  -> flash of old copy, and crawlers mostly see the
//                               fallback. Bad for headlines.
//   b) flip pages to SSR     -> correct, but pays render cost on 1,852 pages.
//   c) HTMLRewriter at the   -> streaming, no flash, final text is in the HTML
//      edge (this file)         source, article pages stay pure static.
//
// (c) is what this is. The Worker gets the prerendered asset and streams it
// through HTMLRewriter, replacing the inner HTML of any element carrying
// data-pcd-editable with its overlay value.
//
// FAIL-OPEN, load-bearing. If KV is empty, off, or unreachable, no handler is
// registered and the original asset streams through untouched, rendering its
// in-repo fallbacks. That is the intended behavior, not a degraded mode, and it
// is what makes CONTENT_OVERLAY_ENABLED=false a real one-variable rollback.

import { readAllRegions, overlayEnabled, type OverlayEnv } from './content-overlay';
import { isRegisteredRegion } from './editable-regions';
import { getAdminIdentity, type AdminAuthEnv } from './admin-auth';

/**
 * Routes whose prerendered HTML gets the overlay pass.
 *
 * MUST stay in sync with the `assets.run_worker_first` list in wrangler.jsonc
 * and wrangler.production.jsonc. A route here that is not in run_worker_first
 * never reaches this code and silently serves fallbacks;
 * tests/overlay-route-coverage.test.ts fails the build on drift.
 *
 * Kept narrow on purpose. Each entry stops being a pure edge asset hit and
 * starts executing the Worker. Global chrome (nav, footer) changes rarely
 * enough that article pages keep their repo fallbacks and pick up chrome edits
 * on the next deploy.
 */
export const OVERLAY_ROUTES: readonly string[] = ['/'] as const;

const EDITOR_CSS = '/admin/inline-editor.css';
const EDITOR_JS = '/admin/inline-editor.js';

function normalizePath(pathname: string): string {
  const trimmed = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return trimmed || '/';
}

/** Does this pathname carry editable regions? */
export function isOverlayRoute(pathname: string): boolean {
  return OVERLAY_ROUTES.includes(normalizePath(pathname));
}

/** Only touch HTML. Never run the rewriter over JSON, images or feeds. */
function isHtml(response: Response): boolean {
  return (response.headers.get('content-type') ?? '').toLowerCase().includes('text/html');
}

function parseAllowList(raw: string): Set<string> {
  return new Set(raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean));
}

/**
 * Is this request from a verified admin?
 *
 * Cheap for the public: with no CF_Authorization cookie and no assertion header
 * getAdminIdentity returns immediately without a key fetch, so public homepage
 * requests pay nothing for this check.
 *
 * Deliberately soft. Returning false only means "no editor UI", never an error
 * page. The write endpoint runs the hard gate.
 */
async function isVerifiedAdmin(request: Request, env: AdminAuthEnv & OverlayEnv): Promise<boolean> {
  try {
    const allow = parseAllowList((env as { ADMIN_EMAILS?: string }).ADMIN_EMAILS ?? '');
    if (allow.size === 0) return false;
    const identity = await getAdminIdentity(request, env);
    if (!identity.email || !identity.verified) return false;
    return allow.has(identity.email.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Apply overlay values to a prerendered HTML response, and inject the editor
 * for verified admins.
 *
 * Returns the original response untouched when the overlay is off, the route is
 * not registered, or the response is not HTML.
 */
export async function applyOverlay(
  response: Response,
  pathname: string,
  env: AdminAuthEnv & OverlayEnv,
  request?: Request,
): Promise<Response> {
  if (!isOverlayRoute(pathname)) return response;
  if (!response.ok || !isHtml(response)) return response;

  const enabled = overlayEnabled(env);

  let values = new Map<string, string>();
  let revisions = new Map<string, number>();
  if (enabled) {
    try {
      const entries = await readAllRegions(env);
      values = entries.values;
      revisions = entries.revisions;
    } catch (error) {
      console.warn('[overlay-rewriter] read failed, serving repo values', { error: String(error) });
    }
  }

  const admin = request ? await isVerifiedAdmin(request, env) : false;

  // Nothing to substitute and nobody to edit: hand back the asset as-is.
  if (values.size === 0 && !admin) return response;

  try {
    let rewriter = new HTMLRewriter().on('[data-pcd-editable]', {
      element(el) {
        const key = el.getAttribute('data-pcd-editable');
        if (!key || !isRegisteredRegion(key)) return;

        const value = values.get(key);
        if (value !== undefined) {
          // The stored value already passed sanitize() on write, which escaped
          // everything outside <strong>, <em> and a safe <a href>. This is the
          // only place it is treated as HTML, and only because of that
          // guarantee. Never widen this without widening the sanitizer.
          el.setInnerContent(value, { html: true });
          el.setAttribute('data-pcd-overlaid', 'true');
        }

        // Admins need the current revision to send a correct expectedRevision
        // on save, so a stale tab produces a conflict instead of a clobber.
        if (admin) {
          el.setAttribute('data-pcd-revision', String(revisions.get(key) ?? 0));
        }
      },
    });

    if (admin) {
      // Editor assets live under /admin/, which is Access-protected and
      // admin-gated, so they are unreachable to the public even by direct URL.
      rewriter = rewriter.on('head', {
        element(el) {
          el.append(`<link rel="stylesheet" href="${EDITOR_CSS}">`, { html: true });
        },
      }).on('body', {
        element(el) {
          el.append(`<script src="${EDITOR_JS}" defer></script>`, { html: true });
        },
      });
    }

    const out = rewriter.transform(response);

    // An admin-personalized response must never land in a shared cache.
    if (admin) {
      const headers = new Headers(out.headers);
      headers.set('Cache-Control', 'private, no-store');
      return new Response(out.body, { status: out.status, statusText: out.statusText, headers });
    }
    return out;
  } catch (error) {
    // A rewriter failure must not take the page down. Serve the original.
    console.error('[overlay-rewriter] transform failed, serving unmodified asset', { error: String(error) });
    return response;
  }
}
