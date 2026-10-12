import { defineMiddleware } from 'astro:middleware';
import { SITE } from './data/site';
import { withWorkerSecurityHeaders } from './lib/security-headers';
import { getCollection } from 'astro:content';
import { isLive } from './lib/publishFilter';

// Wrong-section article URLs (2026-10-12 indexing fix). Articles move between
// sections (phase) over time and old internal links, BabyLoveGrowth cross-links,
// and Google's crawl history keep the old section prefix, e.g.
// /drive-home/the-post-tryouts-wait/ after the article moved, or the retired
// /coaches/ and /dm-parent/ prefixes. GSC counted 121 of these as 404s. When a
// request under one of these prefixes 404s and the slug is a live article, 301
// to the real address. Only runs on the 404 path, so normal pages pay nothing.
const ARTICLE_PREFIX_RE = /^\/(drive-home|drive-there|game|team-parent|coaches|dm-parent|reads)\/([a-z0-9-]+)\/?$/;

async function articleRedirect(pathname: string): Promise<string | null> {
  const m = ARTICLE_PREFIX_RE.exec(pathname);
  if (!m) return null;
  const slug = m[2];
  const found = await getCollection('articles', ({ id, data }) => id === slug && isLive(data));
  const a = found[0];
  if (!a) return null;
  const dest = `/${a.data.phase}/${a.id}/`;
  return dest === (pathname.endsWith('/') ? pathname : `${pathname}/`) ? null : dest;
}

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

  const response = await next();
  if (response.status === 404) {
    try {
      const dest = await articleRedirect(url.pathname);
      if (dest) return withWorkerSecurityHeaders(context.redirect(dest + url.search, 301), url.pathname);
    } catch (e) {
      console.error('article_redirect_lookup_failed', e);
    }
  }
  return withWorkerSecurityHeaders(response, url.pathname);
});
