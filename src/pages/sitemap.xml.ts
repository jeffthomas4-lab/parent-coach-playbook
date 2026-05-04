import { getCollection } from 'astro:content';
import { SITE, BUYING_GUIDES } from '../data/site';
import { listAllCampSlugsApproved } from '../lib/camps-db';
import { isLive } from '../lib/publishFilter';
import type { APIContext } from 'astro';

// SSR so we can include approved camps from D1 at request time.
export const prerender = false;

export async function GET(ctx: APIContext) {
  const articles = await getCollection('articles', ({ data }) => isLive(data));
  const guides = await getCollection('guides', ({ data }) => isLive(data));
  const resources = await getCollection('resources', ({ data }) => isLive(data) && data.type !== 'external');
  const tips = await getCollection('coachingTips', ({ data }) => isLive(data));
  const calendars = await getCollection('seasonCalendars', ({ data }) => isLive(data));
  const bodyTopics = await getCollection('body', ({ data }) => isLive(data));
  const pathways = await getCollection('pathways', ({ data }) => isLive(data));
  const recruiting = await getCollection('recruiting', ({ data }) => isLive(data));
  const adaptive = await getCollection('adaptive', ({ data }) => isLive(data));
  const rules = await getCollection('rules', ({ data }) => isLive(data));

  // Camps: pull approved slugs from D1 if the binding is available.
  const env = (ctx.locals as any).runtime?.env as { DB: D1Database } | undefined;
  let campSlugs: string[] = [];
  if (env?.DB) {
    try {
      campSlugs = await listAllCampSlugsApproved(env.DB);
    } catch {
      // ignore — sitemap should still render
    }
  }

  const staticUrls = [
    '/',
    '/start-here/',
    '/reads/',
    '/coaching-tips/',
    '/camps/',
    '/camps/submit/',
    '/drive-there/',
    '/game/',
    '/drive-home/',
    '/what-to-buy/',
    '/team-parent/',
    '/newsletter/',
    '/about/',
    '/disclosure/',
    '/resources/',
    '/resources/drive-home-playbook/',
    '/resources/practice-plan-template/',
    '/resources/national-organizations/',
    '/search/',
    '/tools/',
    '/season-calendar/',
    '/body/',
    '/cost-calculator/',
    '/cost-calculator/methodology/',
    '/pathways/',
    '/recruiting/',
    '/adaptive/',
    '/rules/',
    ...BUYING_GUIDES.map(g => `/what-to-buy/${g.slug}/`),
    ...BUYING_GUIDES.map(g => `/what-to-buy/${g.slug}/sizing/`),
    ...campSlugs.map(slug => `/camps/${slug}/`),
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
    loc: `/what-to-buy/${g.slug}/`,
    lastmod: (g.data.updatedAt ?? g.data.publishedAt).toISOString(),
  }));

  const tipUrls = tips.map(t => ({
    loc: `/coaching-tips/${t.slug}/`,
    lastmod: t.data.publishedAt.toISOString(),
  }));

  const calendarUrls = calendars.map(c => ({
    loc: `/season-calendar/${c.slug}/`,
    lastmod: (c.data.updatedAt ?? c.data.publishedAt).toISOString(),
  }));

  const bodyUrls = bodyTopics.map(t => ({
    loc: `/body/${t.slug}/`,
    lastmod: t.data.publishedAt.toISOString(),
  }));

  const pathwayUrls = pathways.map(p => ({
    loc: `/pathways/${p.data.sport}/`,
    lastmod: p.data.publishedAt.toISOString(),
  }));

  const recruitingUrls = recruiting.map(r => ({
    loc: `/recruiting/${r.slug}/`,
    lastmod: r.data.publishedAt.toISOString(),
  }));

  const adaptiveUrls = adaptive.map(a => ({
    loc: `/adaptive/${a.slug}/`,
    lastmod: a.data.publishedAt.toISOString(),
  }));

  const rulesUrls = rules.map(r => ({
    loc: `/rules/${r.data.sport}/`,
    lastmod: r.data.publishedAt.toISOString(),
  }));

  const today = new Date().toISOString();

  const urls = [
    ...staticUrls.map(loc => ({ loc, lastmod: today })),
    ...articleUrls,
    ...guideUrls,
    ...resourceUrls,
    ...tipUrls,
    ...calendarUrls,
    ...bodyUrls,
    ...pathwayUrls,
    ...recruitingUrls,
    ...adaptiveUrls,
    ...rulesUrls,
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
