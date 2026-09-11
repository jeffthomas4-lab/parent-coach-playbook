// Redirect shim for BabyLoveGrowth's self-generated cross-links.
//
// WHY THIS EXISTS (2026-09-11). BabyLoveGrowth writes its own internal
// cross-links using whatever URL it has on file for the target article. Until
// the webhook response started returning `link` (see babyLoveArticleUrl in
// src/lib/babylove-growth.ts), that URL was always its own fallback guess,
// https://blog.parentcoachdesk.com/blog/<slug>/ — a subdomain this site has
// never served. sanitizeExternalMarkdown rewrites those links at ingest time
// to this route, /blog/<slug>/, because the true canonical route needs the
// target article's `phase`, and the ingest-time sanitizer only has a slug: it
// is rewriting one already-imported article's body without loading every
// other article's frontmatter. This route does that lookup at request time
// and 301s to the real address.
//
// Articles ingested going forward should carry the true route directly once
// BabyLoveGrowth starts consuming the `link` field back. This route stays as
// a permanent fallback for any body text already shipped, and for anything
// this sanitizer missed.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isLive } from '../../lib/publishFilter';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug) return new Response('Not found', { status: 404 });

  const articles = await getCollection('articles', ({ id, data }) => id === slug && isLive(data));
  const article = articles[0];
  if (!article) return new Response('Not found', { status: 404 });

  return new Response(null, {
    status: 301,
    headers: {
      Location: `/${article.data.phase}/${article.id}/`,
      'Cache-Control': 'no-store',
    },
  });
};
