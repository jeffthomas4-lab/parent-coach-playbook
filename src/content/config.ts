import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      dek: z.string().optional(),
      author: z.enum(['PCP Editors', 'Jeff Thomas']).default('PCP Editors'),
      issue: z.number().optional(),
      hero: image().optional(),
      heroAlt: z.string().optional(),

      // Tagging
      sport: z
        .enum([
          'baseball',
          'softball',
          'soccer',
          'basketball',
          'football',
          'hockey',
          'lacrosse',
          'volleyball',
          'multi-sport',
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
      affiliateSlug: z.string(), // resolves through /go/[slug]
      priceRange: z.string().optional(),

      sport: z
        .enum([
          'baseball',
          'softball',
          'soccer',
          'basketball',
          'football',
          'hockey',
          'lacrosse',
          'volleyball',
          'all-sports',
        ])
        .optional(),
      age: z
        .enum(['5-7', '8-10', '11-12', '13-14', '15-plus', 'all-ages'])
        .optional(),
      featured: z.boolean().default(false),
    }),
});

export const collections = { articles, gear };
