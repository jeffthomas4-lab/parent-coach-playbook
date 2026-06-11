import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, EDITORIAL } from '../data/site';
import { isLive } from '../lib/publishFilter';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = (await getCollection('articles', ({ data }) => isLive(data)))
    .map((a) => ({
      title: a.data.title.replace(/\*/g, ''),
      pubDate: a.data.publishedAt,
      description: a.data.dek ?? '',
      author: EDITORIAL.byline,
      link: `/${a.data.phase}/${a.slug}/`,
    }));

  const coachingTips = (await getCollection('coachingTips', ({ data }) => isLive(data)))
    .map((t) => ({
      title: t.data.title.replace(/\*/g, ''),
      pubDate: t.data.publishedAt,
      description: t.data.summary ?? '',
      author: EDITORIAL.byline,
      link: `/coaching-tips/${t.slug}/`,
    }));

  const guides = (await getCollection('guides', ({ data }) => isLive(data)))
    .map((g) => ({
      title: g.data.activity ?? '',
      pubDate: g.data.publishedAt,
      description: g.data.lede ?? '',
      author: EDITORIAL.byline,
      link: `/what-to-buy/${g.slug}/`,
    }));

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
