import { SITE } from '../data/site';

// Prerendered sitemap index. Keeps the canonical /sitemap.xml URL (referenced in
// robots.txt) and points crawlers at the static content sitemap and the SSR
// camps sitemap. Prerendered so it never imports the content store at runtime.
export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE.url}/sitemap-content.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${SITE.url}/sitemap-camps.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
