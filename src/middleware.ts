import { defineMiddleware } from 'astro:middleware';
import { SITE } from './data/site';
import { withWorkerSecurityHeaders } from './lib/security-headers';

// Canonical-host redirect. GSC's coverage report was choosing the www host as
// canonical for a chunk of pages ("Duplicate, Google chose different
// canonical") because www.parentcoachdesk.com served every page at 200
// instead of redirecting to the bare domain (2026-07 SEO audit, root cause 5).
// Runs for every request this Function sees. A handful of fully-static routes
// (the homepage, /resources/*, /privacy, /contact — see dist/_routes.json's
// exclude list) are served directly from Cloudflare's edge and never reach
// this Worker, so those still need a host-level Cloudflare Redirect Rule
// (www.parentcoachdesk.com/* -> https://parentcoachdesk.com/$1, dashboard,
// not code) as a companion to this middleware, not a replacement for it.
export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const host = url.hostname;

  if (host === 'www.parentcoachdesk.com') {
    const dest = new URL(SITE.url);
    dest.pathname = url.pathname;
    dest.search = url.search;
    return withWorkerSecurityHeaders(context.redirect(dest.toString(), 301), url.pathname);
  }

  return withWorkerSecurityHeaders(await next(), url.pathname);
});
