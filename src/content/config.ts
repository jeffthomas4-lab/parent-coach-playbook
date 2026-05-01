import { defineCollection, z } from 'astro:content';

// All sports + activities supported by the site.
const SPORT_ENUM = [
  'baseball','softball','soccer','basketball',
  'flag-football','football','hockey','lacrosse','volleyball',
  'swimming','track-field','cross-country','tennis','golf','crew',
  'martial-arts','gymnastics','cheer','stunt',
  'theater','band','choir','dance','ballet',
  'multi-sport','multi-activity',
] as const;

const AGE_ENUM = ['5-7', '8-10', '11-12', '13-14', '15-plus', 'all-ages'] as const;

const articles = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      dek: z.string().optional(),
      // Topic groups articles for the new homepage browse-by-topic grid.
      topic: z
        .enum(['communication','tryouts','game-day','the-hard-stuff','season-ops','equipment','rec-vs-travel','rules-of-play'])
        .optional(),
      issue: z.number().optional(),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      format: z.enum(['note', 'essay']).default('note'),
      sport: z.enum(SPORT_ENUM).optional(),
      age: z.enum(AGE_ENUM).optional(),
      // Phase is preserved as light metadata so existing URLs keep working.
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
      sport: z.enum([...SPORT_ENUM, 'all-sports']).optional(),
      age: z.enum(AGE_ENUM).optional(),
      featured: z.boolean().default(false),
    }),
});

const guides = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      activity: z.string(),
      category: z.enum(['sport', 'activity']),
      sortOrder: z.number().default(99),
      lede: z.string(),
      costSummary: z.string(),
      seasonNote: z.string().optional(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    }),
});

const resources = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      summary: z.string(),
      category: z.enum([
        'tech-setup','communication','practice','game-day',
        'photos-events','fundraising','volunteering','travel',
      ]),
      type: z.enum(['article', 'template', 'external']).default('article'),
      externalUrl: z.string().url().optional(),
      publishedAt: z.coerce.date(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

// Coaching tips: searchable drill library at /coaching-tips/.
// Each entry is a single drill or coaching note tagged by sport, age, and focus.
const coachingTips = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      sport: z.enum(SPORT_ENUM).optional(),
      age: z.enum(AGE_ENUM).optional(),
      focus: z
        .enum(['warm-up','fundamentals','situational','scrimmage','culture','game-management'])
        .optional(),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      publishedAt: z.coerce.date(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { articles, gear, guides, resources, coachingTips };
