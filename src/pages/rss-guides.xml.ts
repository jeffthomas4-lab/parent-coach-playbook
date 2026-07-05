export const prerender = true;
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, EDITORIAL } from '../data/site';
import { isLive } from '../lib/publishFilter';
import type { APIContext } from 'astro';

// Dedicated feed for gear guides. Only 37 exist today, so this feed is small,
// but it's still its own feed rather than folded into /rss.xml — see
// rss.xml.ts for why a shared feed starves low-volume content types.
const MAX_ITEMS = 100;

export async function GET(context: APIContext) {
  const items = (await getCollection('guides', ({ data }) => isLive(data)))
    .map((g) => ({
      title: g.data.activity ?? '',
      pubDate: g.data.publishedAt,
      description: g.data.lede ?? '',
      author: EDITORIAL.byline,
      link: `/what-to-buy/${g.slug}/`,
      categories: ['Gear guide'],
    }))
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, MAX_ITEMS);

  return rss({
    title: `${SITE.name} — Gear Guides`,
    description: 'What to buy, from a parent coach who has actually used it.',
    site: context.site ?? SITE.url,
    items,
    customData: '<language>en-us</language>',
  });
}
