export const prerender = true;
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, EDITORIAL } from '../data/site';
import { isLive } from '../lib/publishFilter';
import type { APIContext } from 'astro';

// Feed is capped to the most recent items so the XML stays a reasonable size
// and readers aren't asked to pull years of back-catalog on every poll.
const MAX_ITEMS = 100;

export async function GET(context: APIContext) {
  const articles = (await getCollection('articles', ({ data }) => isLive(data)))
    .map((a) => ({
      title: a.data.title.replace(/\*/g, ''),
      pubDate: a.data.publishedAt,
      description: a.data.dek ?? '',
      author: EDITORIAL.byline,
      link: `/${a.data.phase}/${a.slug}/`,
      categories: ['Read'],
    }));

  const coachingTips = (await getCollection('coachingTips', ({ data }) => isLive(data)))
    .map((t) => ({
      title: t.data.title.replace(/\*/g, ''),
      pubDate: t.data.publishedAt,
      description: t.data.summary ?? '',
      author: EDITORIAL.byline,
      link: `/coaching-tips/${t.slug}/`,
      categories: ['Drill'],
    }));

  const guides = (await getCollection('guides', ({ data }) => isLive(data)))
    .map((g) => ({
      title: g.data.activity ?? '',
      pubDate: g.data.publishedAt,
      description: g.data.lede ?? '',
      author: EDITORIAL.byline,
      link: `/what-to-buy/${g.slug}/`,
      categories: ['Gear guide'],
    }));

  const items = [...articles, ...coachingTips, ...guides]
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, MAX_ITEMS);

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    customData: '<language>en-us</language>',
  });
}
