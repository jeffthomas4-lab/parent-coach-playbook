import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, CONTRIBUTORS } from '../data/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = (await getCollection('articles', ({ data }) => !data.draft))
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: articles.map((a) => ({
      title: a.data.title.replace(/\*/g, ''),
      pubDate: a.data.publishedAt,
      description: a.data.dek ?? '',
      author: CONTRIBUTORS[a.data.contributor].name,
      link: `/${a.data.phase}/${a.slug}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
