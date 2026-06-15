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
  let campSlugs: string[] = [];
  if (env?.DB) {
    try {
      campSlugs = await listAllCampSlugsApproved(env.DB);
    } catch {
      // sitemap should still render even if D1 is unavailable
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${campSlugs.map(slug => `  <url>
    <loc>${SITE.url}/camps/${slug}/</loc>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
