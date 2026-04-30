import { getCollection } from 'astro:content';
import { SITE, BUYING_GUIDES } from '../data/site';
import type { APIContext } from 'astro';

export async function GET(_ctx: APIContext) {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  const guides = await getCollection('guides', ({ data }) => !data.draft);
  const resources = await getCollection('resources', ({ data }) => !data.draft && data.type !== 'external');

  const staticUrls = [
    '/',
    '/drive-there/',
    '/game/',
    '/drive-home/',
    '/what-to-buy/',
    '/team-parent/',
    '/newsletter/',
    '/about/',
    '/contributors/',
    '/resources/',
    '/resources/drive-home-playbook/',
    '/search/',
    ...BUYING_GUIDES.map(g => `/what-to-buy/${g.slug}/`),
  ];

  const resourceUrls = resources.map(r => ({
    loc: `/team-parent/${r.slug}/`,
    lastmod: r.data.publishedAt.toISOString(),
  }));

  const articleUrls = articles.map(a => ({
    loc: `/${a.data.phase}/${a.slug}/`,
    lastmod: a.data.publishedAt.toISOString(),
  }));

  const guideUrls = guides.map(g => ({
    loc: `/what-to-buy/${g.data.slug}/`,
    lastmod: (g.data.updatedAt ?? g.data.publishedAt).toISOString(),
  }));

  const today = new Date().toISOString();

  const urls = [
    ...staticUrls.map(loc => ({ loc, lastmod: today })),
    ...articleUrls,
    ...guideUrls,
    ...resourceUrls,
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
