export const prerender = true;
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, EDITORIAL } from '../data/site';
import { isLive } from '../lib/publishFilter';
import type { APIContext } from 'astro';

// Dedicated feed for coaching tips, so volume in /rss.xml (which is shared
// across articles, tips, and gear guides) never crowds these out. See
// rss.xml.ts for the full explanation.
const MAX_ITEMS = 150;

export async function GET(context: APIContext) {
  const items = (await getCollection('coachingTips', ({ data }) => isLive(data)))
    .map((t) => ({
      title: t.data.title.replace(/\*/g, ''),
      pubDate: t.data.publishedAt,
      description: t.data.summary ?? '',
      author: EDITORIAL.byline,
      link: `/coaching-tips/${t.slug}/`,
      categories: ['Drill'],
    }))
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, MAX_ITEMS);

  return rss({
    title: `${SITE.name} — Coaching Tips`,
    description: 'Short, specific coaching tips from Parent Coach Desk.',
    site: context.site ?? SITE.url,
    items,
    customData: '<language>en-us</language>',
  });
}
