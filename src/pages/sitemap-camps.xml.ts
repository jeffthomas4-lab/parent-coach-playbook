import { SITE } from '../data/site';
import { listAllCampSlugsApproved } from '../lib/camps-db';
import type { APIContext } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { campSitemapResponseMeta } from '../lib/sitemap-health';
import { createRequestLogger } from '../lib/log';

// SSR (on-demand) so approved camps from D1 appear in the sitemap at request
// time. Deliberately imports NO content collections — keeping the 14 MiB Astro
// content store out of the runtime worker, which must stay under Cloudflare's
// free-plan 3 MiB limit.
export const prerender = false;

export async function GET(ctx: APIContext) {
  const logger = createRequestLogger(ctx.request, { route: 'sitemap-camps.xml', userId: null });
  const env = cfEnv as { DB: D1Database } | undefined;
  let campSlugs: { slug: string; lastmod: string }[] = [];
  if (env?.DB) {
    try {
      campSlugs = await listAllCampSlugsApproved(env.DB);
    } catch (e) {
      // Sitemap still renders even if D1 is unavailable, but log loud —
      // this used to fail silently and the camps sitemap went empty for two
      // weeks before anyone noticed (2026-07-05 incident).
      logger.error('d1_query_failed', e, { effect: 'serving_empty_urlset' });
    }
  } else {
    logger.error('no_d1_binding_on_request', undefined, { effect: 'serving_empty_urlset' });
  }

  if (campSlugs.length === 0) {
    logger.error('sitemap_camps_zero_approved_future', undefined, {
      hint: 'camps queue may be genuinely empty or pcd_status got reset again; check /api/cron/camps-sweep logs and the programs table',
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${campSlugs.map(c => `  <url>
    <loc>${SITE.url}/camps/${c.slug}/</loc>
    <lastmod>${(c.lastmod || '').slice(0, 10)}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  const responseMeta = campSitemapResponseMeta(campSlugs.length);
  return new Response(xml, responseMeta);
}
