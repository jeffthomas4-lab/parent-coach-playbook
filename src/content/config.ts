import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      dek: z.string().optional(),
      contributor: z.enum(['maren-bell', 'dan-kowalski', 'jeff-thomas']).default('maren-bell'),
      issue: z.number().optional(),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      format: z.enum(['note', 'essay']).default('note'),
      sport: z
        .enum([
          'baseball','softball','soccer','basketball','football','hockey','lacrosse','volleyball',
          'theater','band','choir','dance','multi-sport','multi-activity',
        ])
        .optional(),
      age: z
        .enum(['5-7', '8-10', '11-12', '13-14', '15-plus', 'all-ages'])
        .optional(),
      phase: z.enum(['drive-there', 'game', 'drive-home']),
      seasonPhase: z
        .enum(['pre-season', 'early', 'mid', 'playoffs', 'off-season'])
        .optional(),
      publishedAt: z.coerce.date(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const gear = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      ourTake: z.string().optional(),
      hero: image().optional(),
      retailer: z.string(),
      affiliateSlug: z.string(),
      priceRange: z.string().optional(),
      sport: z
        .enum(['baseball','softball','soccer','basketball','football','hockey','lacrosse','volleyball','all-sports'])
        .optional(),
      age: z.enum(['5-7','8-10','11-12','13-14','15-plus','all-ages']).optional(),
      featured: z.boolean().default(false),
    }),
});

const guides = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      activity: z.string(),                                          // "Baseball", "Theater", etc.
      category: z.enum(['sport', 'activity']),
      // NOTE: do not declare a `slug` field. Astro reserves it; the filename
      // (e.g. baseball.md) becomes the slug automatically as `entry.slug`.
      sortOrder: z.number().default(99),
      lede: z.string(),
      costSummary: z.string(),
      seasonNote: z.string().optional(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      contributor: z.enum(['maren-bell', 'dan-kowalski', 'jeff-thomas']).default('maren-bell'),
      draft: z.boolean().default(false),
    }),
});

export const collections = { articles, gear, guides };
