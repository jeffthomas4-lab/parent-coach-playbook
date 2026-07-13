import { SITE } from '../data/site';
import { listAllCampSlugsApproved } from '../lib/camps-db';
import type { APIContext } from 'astro';

// SSR (on-demand) so approved camps from D1 appear in the sitemap at request
// time. Deliberately imports NO content collections — keeping the 14 MiB Astro
// content store out of the runtime worker, which must stay under Cloudflare's
// free-plan 3 MiB limit.
export const prerender = false;

export async function GET(ctx: APIContext) {
  const env = (ctx.locals as any).runtime?.env as { DB: D1Database } | undefined;
  let campSlugs: { slug: string; lastmod: string }[] = [];
  if (env?.DB) {
    try {
      campSlugs = await listAllCampSlugsApproved(env.DB);
    } catch (e) {
      // Sitemap still renders even if D1 is unavailable, but log loud —
      // this used to fail silently and the camps sitemap went empty for two
      // weeks before anyone noticed (2026-07-05 incident).
      console.error('[sitemap-camps] D1 query failed, serving empty urlset:', e);
    }
  } else {
    console.error('[sitemap-camps] no D1 binding on request, serving empty urlset');
  }

  if (campSlugs.length === 0) {
    console.error('[sitemap-camps] ALERT: 0 approved+future camps. Either the camps queue is genuinely empty or pcd_status got reset again. Check /api/cron/camps-sweep logs and the programs table.');
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${campSlugs.map(c => `  <url>
    <loc>${SITE.url}/camps/${c.slug}/</loc>
    <lastmod>${(c.lastmod || '').slice(0, 10)}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
