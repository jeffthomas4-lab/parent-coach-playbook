// Legacy-domain redirect worker for parentcoachplaybook.com (and its www).
//
// Why this exists: the 2026-07 organic-search audit found the old domain
// still resolves (DNS is live, TLS works) but serves an empty response —
// not a 301 to the new domain. Google's Change of Address tool needs live,
// page-to-page 301s on the OLD domain's URLs to pass link equity forward.
// Without them, any age/links/rankings parentcoachplaybook.com had are
// thrown away instead of inherited by parentcoachdesk.com.
//
// This worker is intentionally tiny and stateless: every request, on every
// path, 301s to the same path on the new bare domain. The old site's URL
// structure carried over 1:1 to the new domain (same routes, same slugs), so
// a path-preserving redirect is a real page-to-page redirect, not a blanket
// redirect-everything-to-the-homepage shortcut.
//
// Deploy target: a NEW Cloudflare Worker (not the parent-coach-desk Pages
// project). It only becomes live once parentcoachplaybook.com (and www) are
// attached to this worker as Custom Domains in the Cloudflare dashboard —
// that attachment is a one-time manual step this session could not do via
// the available tools (no zone/custom-domain API exposed here). Everything
// else below is ready to deploy as-is.

const NEW_HOST = 'parentcoachdesk.com';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    url.protocol = 'https:';
    url.hostname = NEW_HOST;
    url.port = '';
    return Response.redirect(url.toString(), 301);
  },
};
