import { getCollection } from 'astro:content';
import { collections } from '../content.config';
import { SITE, BUYING_GUIDES, SPORTS } from '../data/site';
import { isLive } from '../lib/publishFilter';

// Prerendered at build time. Holds every content-collection URL plus the static
// pages. Because it is prerendered, getCollection runs during the build and the
// content store is NOT bundled into the runtime Cloudflare worker. Camps live in
// /sitemap-camps.xml (SSR, D1-backed) so this file never touches D1.
//
// Drift guard (2026-07-31, closes open item #32 for real): this file used to
// enumerate collections purely by hand, which is exactly how `pillar` went
// missing for weeks and all 17 Ultimate Parent Guides were live and invisible
// to Google. COLLECTION_URL_BUILDERS below is still a hand-written map
// (each collection's URL shape is genuinely different, so a fully generic
// loop isn't possible), but the enumeration itself is now validated against
// `collections` exported from content.config.ts — the actual source of
// truth for what collections exist — every build. Add a collection to
// content.config.ts and forget to wire it in here, and the sitemap route
// throws instead of silently shipping an invisible collection.
type SitemapUrl = { loc: string; lastmod: string };

const COLLECTION_URL_BUILDERS: Record<string, () => Promise<SitemapUrl[]>> = {
  articles: async () => (await getCollection('articles', ({ data }) => isLive(data)))
    .map(a => ({ loc: `/${a.data.phase}/${a.id}/`, lastmod: a.data.publishedAt.toISOString() })),
  guides: async () => (await getCollection('guides', ({ data }) => isLive(data)))
    .map(g => ({ loc: `/what-to-buy/${g.id}/`, lastmod: (g.data.updatedAt ?? g.data.publishedAt).toISOString() })),
  resources: async () => (await getCollection('resources', ({ data }) => isLive(data) && data.type !== 'external'))
    .map(r => ({ loc: `/team-parent/${r.id}/`, lastmod: r.data.publishedAt.toISOString() })),
  coachingTips: async () => (await getCollection('coachingTips', ({ data }) => isLive(data)))
    .map(t => ({ loc: `/coaching-tips/${t.id}/`, lastmod: t.data.publishedAt.toISOString() })),
  seasonCalendars: async () => (await getCollection('seasonCalendars', ({ data }) => isLive(data)))
    .map(c => ({ loc: `/season-calendar/${c.id}/`, lastmod: (c.data.updatedAt ?? c.data.publishedAt).toISOString() })),
  body: async () => (await getCollection('body', ({ data }) => isLive(data)))
    .map(t => ({ loc: `/body/${t.id}/`, lastmod: t.data.publishedAt.toISOString() })),
  pathways: async () => (await getCollection('pathways', ({ data }) => isLive(data)))
    .map(p => ({ loc: `/pathways/${p.data.sport}/`, lastmod: p.data.publishedAt.toISOString() })),
  recruiting: async () => (await getCollection('recruiting', ({ data }) => isLive(data)))
    .map(r => ({ loc: `/recruiting/${r.id}/`, lastmod: r.data.publishedAt.toISOString() })),
  adaptive: async () => (await getCollection('adaptive', ({ data }) => isLive(data)))
    .map(a => ({ loc: `/adaptive/${a.id}/`, lastmod: a.data.publishedAt.toISOString() })),
  rules: async () => (await getCollection('rules', ({ data }) => isLive(data)))
    .map(r => ({ loc: `/rules/${r.data.sport}/`, lastmod: r.data.publishedAt.toISOString() })),
  scripts: async () => (await getCollection('scripts', ({ data }) => isLive(data)))
    .map(s => ({ loc: `/scripts/${s.id}/`, lastmod: s.data.publishedAt.toISOString() })),
  decisions: async () => (await getCollection('decisions', ({ data }) => isLive(data)))
    .map(d => ({ loc: `/decisions/${d.id}/`, lastmod: d.data.publishedAt.toISOString() })),
  news: async () => (await getCollection('news', ({ data }) => !data.draft))
    .map(n => ({ loc: `/news/${n.id}/`, lastmod: n.data.publishedAt.toISOString() })),
  // Canonical route is /pillar/, not /guides/. /guides/<slug>/ renders the
  // same entry and carries a canonical pointing here, so only this one is
  // listed. Listing both would be self-inflicted duplicate content.
  pillar: async () => (await getCollection('pillar', ({ data }) => isLive(data)))
    .map(p => ({ loc: `/pillar/${p.id}/`, lastmod: p.data.publishedAt.toISOString() })),
};

function assertNoCollectionDrift() {
  const configKeys = Object.keys(collections).sort();
  const wiredKeys = Object.keys(COLLECTION_URL_BUILDERS).sort();
  const missing = configKeys.filter(k => !wiredKeys.includes(k));
  if (missing.length > 0) {
    throw new Error(
      `sitemap-content.xml.ts: content.config.ts declares collection(s) [${missing.join(', ')}] with ` +
      `no matching entry in COLLECTION_URL_BUILDERS. Wire the collection's URL shape in before ` +
      `deploying, or its canonical pages ship live and invisible to crawlers (this is exactly how ` +
      `all 17 Ultimate Parent Guides went missing — see open item #32 in STANDARD-AUDIT.md).`
    );
  }
}

export async function GET() {
  assertNoCollectionDrift();

  const collectionUrls = (
    await Promise.all(Object.values(COLLECTION_URL_BUILDERS).map(build => build()))
  ).flat();

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
    '/parent-coach-approved/': '2026-07-18',
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
    '/about/corrections/', '/parent-coach-approved/', '/news/',
    ...BUYING_GUIDES.map(g => `/what-to-buy/${g.slug}/`),
    ...BUYING_GUIDES.map(g => `/what-to-buy/${g.slug}/sizing/`),
    ...SPORTS.map(s => `/sports/${s.slug}/`),
  ];

  const STATIC_FALLBACK = '2026-05-01';

  const urls = [
    ...staticUrls.map(loc => ({ loc, lastmod: STATIC_LASTMOD[loc] ?? STATIC_FALLBACK })),
    ...collectionUrls,
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
