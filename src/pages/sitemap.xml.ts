import { SITE } from '../data/site';

// Prerendered sitemap index (robots.txt points here). Order is priority order:
// hubs, then articles, then drill cards, then live camps (SSR, D1-backed).
// /sitemap-content.xml still serves the full union for older GSC submissions
// but is no longer listed here, so no URL is listed twice.
const CHILDREN = ['sitemap-pages.xml', 'sitemap-articles.xml', 'sitemap-tips.xml', 'sitemap-camps.xml'];

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${CHILDREN.map(c => `  <sitemap>
    <loc>${SITE.url}/${c}</loc>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
