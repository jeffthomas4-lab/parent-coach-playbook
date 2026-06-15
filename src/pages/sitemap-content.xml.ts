import { getCollection } from 'astro:content';
import { SITE, BUYING_GUIDES, SPORTS } from '../data/site';
import { isLive } from '../lib/publishFilter';

// Prerendered at build time. Holds every content-collection URL plus the static
// pages. Because it is prerendered, getCollection runs during the build and the
// content store is NOT bundled into the runtime Cloudflare worker. Camps live in
// /sitemap-camps.xml (SSR, D1-backed) so this file never touches D1.
export async function GET() {
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
  const scripts = await getCollection('scripts', ({ data }) => isLive(data));
  const decisions = await getCollection('decisions', ({ data }) => isLive(data));
  const news = await getCollection('news', ({ data }) => !data.draft);

  const STATIC_LASTMOD: Record<string, string> = {
    '/': '2026-06-11',
    '/start-here/': '2026-05-01',
    '/reads/': '2026-06-01',
    '/coaching-tips/': '2026-05-01',
    '/camps/': '2026-06-01',
    '/camps/submit/': '2026-05-01',
    '/drive-there/': '2026-05-01',
    '/game/': '2026-05-01',
    '/drive-home/': '2026-05-01',
    '/what-to-buy/': '2026-05-01',
    '/team-parent/': '2026-05-01',
    '/newsletter/': '2026-05-01',
    '/about/': '2026-05-01',
    '/disclosure/': '2026-04-01',
    '/terms/': '2026-04-01',
    '/resources/': '2026-05-01',
    '/resources/what-to-say-when/': '2026-05-01',
    '/resources/practice-plan-template/': '2026-05-01',
    '/resources/national-organizations/': '2026-05-01',
    '/search/': '2026-05-01',
    '/tools/': '2026-05-01',
    '/season-calendar/': '2026-05-01',
    '/body/': '2026-05-01',
    '/cost-calculator/': '2026-05-15',
    '/cost-calculator/methodology/': '2026-05-15',
    '/pathways/': '2026-05-01',
    '/recruiting/': '2026-05-01',
    '/adaptive/': '2026-05-01',
    '/rules/': '2026-05-01',
    '/scripts/': '2026-05-01',
    '/decisions/': '2026-05-01',
    '/youth-sports-pendulum/': '2026-05-01',
    '/mental-skills/': '2026-05-01',
    '/governing-bodies/': '2026-05-01',
    '/why-we-exist/': '2026-05-01',
    '/parent-coach/': '2026-05-01',
    '/sports/': '2026-05-01',
    '/about/sources/': '2026-05-01',
    '/about/corrections/': '2026-05-01',
    '/news/': '2026-06-04',
  };

  const staticUrls = [
    '/', '/start-here/', '/reads/', '/coaching-tips/', '/camps/', '/camps/submit/',
    '/drive-there/', '/game/', '/drive-home/', '/what-to-buy/', '/team-parent/',
    '/newsletter/', '/about/', '/disclosure/', '/terms/', '/resources/',
    '/resources/what-to-say-when/', '/resources/practice-plan-template/',
    '/resources/national-organizations/', '/search/', '/tools/', '/season-calendar/',
    '/body/', '/cost-calculator/', '/cost-calculator/methodology/', '/pathways/',
    '/recruiting/', '/adaptive/', '/rules/', '/scripts/', '/decisions/',
    '/youth-sports-pendulum/', '/mental-skills/', '/governing-bodies/',
    '/why-we-exist/', '/parent-coach/', '/sports/', '/about/sources/',
    '/about/corrections/', '/news/',
    ...BUYING_GUIDES.map(g => `/what-to-buy/${g.slug}/`),
    ...BUYING_GUIDES.map(g => `/what-to-buy/${g.slug}/sizing/`),
    ...SPORTS.map(s => `/sports/${s.slug}/`),
  ];

  const STATIC_FALLBACK = '2026-05-01';

  const urls = [
    ...staticUrls.map(loc => ({ loc, lastmod: STATIC_LASTMOD[loc] ?? STATIC_FALLBACK })),
    ...articles.map(a => ({ loc: `/${a.data.phase}/${a.slug}/`, lastmod: a.data.publishedAt.toISOString() })),
    ...guides.map(g => ({ loc: `/what-to-buy/${g.slug}/`, lastmod: (g.data.updatedAt ?? g.data.publishedAt).toISOString() })),
    ...resources.map(r => ({ loc: `/team-parent/${r.slug}/`, lastmod: r.data.publishedAt.toISOString() })),
    ...tips.map(t => ({ loc: `/coaching-tips/${t.slug}/`, lastmod: t.data.publishedAt.toISOString() })),
    ...calendars.map(c => ({ loc: `/season-calendar/${c.slug}/`, lastmod: (c.data.updatedAt ?? c.data.publishedAt).toISOString() })),
    ...bodyTopics.map(t => ({ loc: `/body/${t.slug}/`, lastmod: t.data.publishedAt.toISOString() })),
    ...pathways.map(p => ({ loc: `/pathways/${p.data.sport}/`, lastmod: p.data.publishedAt.toISOString() })),
    ...recruiting.map(r => ({ loc: `/recruiting/${r.slug}/`, lastmod: r.data.publishedAt.toISOString() })),
    ...adaptive.map(a => ({ loc: `/adaptive/${a.slug}/`, lastmod: a.data.publishedAt.toISOString() })),
    ...rules.map(r => ({ loc: `/rules/${r.data.sport}/`, lastmod: r.data.publishedAt.toISOString() })),
    ...scripts.map(s => ({ loc: `/scripts/${s.slug}/`, lastmod: s.data.publishedAt.toISOString() })),
    ...decisions.map(d => ({ loc: `/decisions/${d.slug}/`, lastmod: d.data.publishedAt.toISOString() })),
    ...news.map(n => ({ loc: `/news/${n.slug}/`, lastmod: n.data.publishedAt.toISOString() })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE.url}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
