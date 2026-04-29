import { getCollection } from 'astro:content';
import { SITE, SPORTS } from '../data/site';
import type { APIContext } from 'astro';

export async function GET(_ctx: APIContext) {
  const articles = await getCollection('articles', ({ data }) => !data.draft);

  const staticUrls = [
    '/',
    '/drive-there/',
    '/game/',
    '/drive-home/',
    '/gear/',
    '/newsletter/',
    '/about/',
    '/resources/',
    '/resources/drive-home-playbook/',
    '/search/',
    ...SPORTS.map(s => `/gear/${s.slug}/`),
  ];

  const articleUrls = articles.map(a => ({
    loc: `/${a.data.phase}/${a.slug}/`,
    lastmod: a.data.publishedAt.toISOString(),
  }));

  const today = new Date().toISOString();

  const urls = [
    ...staticUrls.map(loc => ({ loc, lastmod: today })),
    ...articleUrls,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    u => `  <url>
    <loc>${SITE.url}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
