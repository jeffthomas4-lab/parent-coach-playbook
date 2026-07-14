export const prerender = true;
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, EDITORIAL } from '../data/site';
import { isLive } from '../lib/publishFilter';
import type { APIContext } from 'astro';

// Feed is capped to the most recent items so the XML stays a reasonable size
// and readers aren't asked to pull years of back-catalog on every poll.
//
// Each content type gets its own reserved slice before merging. With 713
// articles and only 100 total slots, a single global sort-then-slice starved
// coaching tips and gear guides out of the feed entirely — they never showed
// up because articles alone filled every slot. Readers who want just tips or
// just guides can also subscribe to /rss-tips.xml or /rss-guides.xml, which
// aren't capped by article volume at all.
const MAX_ARTICLES = 60;
const MAX_TIPS = 25;
const MAX_GUIDES = 15;

export async function GET(context: APIContext) {
  const articles = (await getCollection('articles', ({ data }) => isLive(data)))
    .map((a) => ({
      title: a.data.title.replace(/\*/g, ''),
      pubDate: a.data.publishedAt,
      description: a.data.dek ?? '',
      author: EDITORIAL.byline,
      link: `/${a.data.phase}/${a.id}/`,
      categories: ['Read'],
    }))
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, MAX_ARTICLES);

  const coachingTips = (await getCollection('coachingTips', ({ data }) => isLive(data)))
    .map((t) => ({
      title: t.data.title.replace(/\*/g, ''),
      pubDate: t.data.publishedAt,
      description: t.data.summary ?? '',
      author: EDITORIAL.byline,
      link: `/coaching-tips/${t.id}/`,
      categories: ['Drill'],
    }))
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, MAX_TIPS);

  const guides = (await getCollection('guides', ({ data }) => isLive(data)))
    .map((g) => ({
      title: g.data.activity ?? '',
      pubDate: g.data.publishedAt,
      description: g.data.lede ?? '',
      author: EDITORIAL.byline,
      link: `/what-to-buy/${g.id}/`,
      categories: ['Gear guide'],
    }))
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, MAX_GUIDES);

  const items = [...articles, ...coachingTips, ...guides]
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    customData: '<language>en-us</language>',
  });
}
