import { defineCollection, z } from 'astro:content';

const SPORT_ENUM = [
  'baseball','softball','soccer','basketball',
  'flag-football','football','football-7v7','hockey','lacrosse','lacrosse-boys','lacrosse-girls','volleyball',
  'swimming','track-field','cross-country','tennis','golf','crew',
  'martial-arts','gymnastics','cheer','stunt',
  'theater','band','choir','dance','ballet',
  'multi-sport','multi-activity','performing-arts',
] as const;

const AGE_ENUM = ['t-ball', '5-7', '8-10', '11-12', '13-14', '15-plus', 'all-ages'] as const;

const FUNDAMENTAL_ENUM = [
  // Common across sports
  'warm-up','conditioning','situational','scrimmage','positioning',
  // Defense (multi-sport)
  'defending','blocking','tackling','flag-pulling','rebounding',
  'goaltending','goalkeeping',
  // Offensive ball/object skills (multi-sport)
  'dribbling','passing','receiving','shooting','serving','setting',
  'spiking','finishing','route-running','ball-carrying',
  // Throw/catch family
  'throwing','catching',
  // Baseball/softball
  'hitting','fielding','base-running','pitching',
  // Hockey
  'skating','stick-handling',
  // Lacrosse
  'cradling','ground-balls',
  // Soccer
  'heading','set-pieces',
  // Football specific
  'stance',
  // Tennis
  'forehand','backhand','volley','match-play',
  // Track and field
  'running-form','starts','pacing','intervals','jumping',
  // Swimming
  'freestyle','backstroke','breaststroke','butterfly','turns','breathing',
  // Misc movement
  'footwork',
] as const;

const PROGRESSION_ENUM = ['intro', 'build', 'refine'] as const;

// Shared editorial-review fields. Attach to every collection so each piece carries its
// own quality/integrity/approval state. The /admin/editorial dashboard reads from these.
//
// Workflow: I (Claude) write a piece → run a skeptical review pass and fill in qualityGrade,
// originalityGrade, voiceGrade, flags, citationCheckPassed, set status='claude-reviewed' and
// claudeReviewedAt. Jeff reads, edits if needed, then sets jeffReviewedAt and status='jeff-approved'.
//
// See REVIEW.md at the project root for the full operator manual.
const editorialField = {
  editorial: z.object({
    qualityGrade:               z.number().min(1).max(10).optional(),     // skeptical reader's "is this actually good"
    originalityGrade:           z.number().min(1).max(10).optional(),     // is this Jeff's take or a rephrase of what's everywhere
    voiceGrade:                 z.number().min(1).max(10).optional(),     // does it sound like Jeff
    flagInappropriateness:      z.boolean().default(false),               // culture-war, political bias, off-brand
    flagIpRisk:                 z.boolean().default(false),               // paraphrased without attribution, suspect product claims
    flagSensitiveTopic:         z.boolean().default(false),               // mental health, body image, injury, divorce — extra care
    citationCheckPassed:        z.boolean().default(false),               // sources cited where claims are made
    affiliateDisclosurePresent: z.boolean().default(false),               // FTC requires when affiliate links present
    claudeReviewedAt:           z.coerce.date().optional(),
    jeffReviewedAt:             z.coerce.date().optional(),
    status:                     z.enum(['draft','claude-reviewed','jeff-approved','published','needs-revision']).default('draft'),
    reviewerNotes:              z.string().optional(),
    factCheckGoodThrough:       z.coerce.date().optional(),               // for evergreen content with date-sensitive facts
  }).optional(),
};

const articles = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      dek: z.string().optional(),
      topic: z
        .enum(['communication','tryouts','game-day','the-hard-stuff','season-ops','equipment','rec-vs-travel','rules-of-play','summer-camps'])
        .optional(),
      teamParentTopic: z
        .enum(['logistics','communication','money','picture-day','conflict','tools'])
        .optional(),
      issue: z.number().optional(),
      hero: z.string().optional(),
      heroAlt: z.string().optional(),
      ogImage: z.string().optional(),
      format: z.enum(['note', 'essay']).default('note'),
      sport: z.enum(SPORT_ENUM).optional(),
      age: z.enum(AGE_ENUM).optional(),
      phase: z.enum(['drive-there', 'game', 'drive-home', 'team-parent']),
      seasonPhase: z
        .enum(['pre-season', 'early', 'mid', 'playoffs', 'off-season'])
        .optional(),
      publishedAt: z.coerce.date(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      ...editorialField,
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
      ...editorialField,
    }),
});

const guides = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      activity: z.string(),
      category: z.enum(['sport', 'activity', 'essentials']),
      sortOrder: z.number().default(99),
      lede: z.string(),
      costSummary: z.string(),
      seasonNote: z.string().optional(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      ...editorialField,
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
      ...editorialField,
    }),
});

const coachingTips = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      sport: z.enum(SPORT_ENUM).optional(),
      age: z.enum(AGE_ENUM).optional(),
      ages: z.array(z.enum(AGE_ENUM)).optional(),
      fundamental: z.enum(FUNDAMENTAL_ENUM).optional(),
      progression: z.enum(PROGRESSION_ENUM).optional(),
      focus: z
        .enum(['warm-up','fundamentals','situational','scrimmage','culture','game-management'])
        .optional(),
      layer: z
        .enum(['foundations','skills','situational'])
        .optional(),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      illustrationBrief: z.string().optional(),
      publishedAt: z.coerce.date(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      ...editorialField,
    }),
});

// Season calendars: canonical month-by-month maps for a given sport + level.
// One file = one shape parents can pick from. Future builder layer will overlay multiple
// calendars on the same twelve-month view.
const seasonCalendars = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),                        // "Club volleyball 14s — National qualifier track"
      sport: z.enum(SPORT_ENUM),
      level: z.enum(['rec', 'school', 'travel', 'elite']),
      region: z.string().optional(),            // "PNW", "National", "Southeast"
      durationLabel: z.string(),                // "Year-round", "Aug–Nov", "Mar–Jun"
      summary: z.string(),
      months: z.array(
        z.object({
          key: z.enum(['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']),
          intensity: z.enum(['off', 'build', 'peak', 'taper', 'rest']),
          events: z.array(z.string()).default([]),
          note: z.string().optional(),
        })
      ),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      ...editorialField,
    }),
});

// Body hub: pediatric sports medicine translated for parents. Strict boundary —
// describe, don't diagnose. Always cite the governing body. Always end with the
// questions to bring to the pediatrician.
const body = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      summary: z.string(),
      category: z.enum([
        'injury-prevention','recovery','sleep','nutrition','hydration',
        'mental-skills','arm-care','concussion','heat','growth-plates','specialization',
      ]),
      sportTags: z.array(z.enum(SPORT_ENUM)).optional(),
      ageBands: z.array(z.enum(AGE_ENUM)).optional(),
      governingBodies: z.array(
        z.object({
          name: z.string(),                     // "USA Baseball Pitch Smart"
          url: z.string().url(),
        })
      ).default([]),
      doctorQuestions: z.array(z.string()).default([]),
      gearPicks: z.array(
        z.object({
          name: z.string(),
          note: z.string().optional(),
          affiliateSlug: z.string().optional(),
        })
      ).default([]),
      publishedAt: z.coerce.date(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      ...editorialField,
    }),
});

// Pathways: per-sport age timeline. What good looks like at 7, 10, 13, 15.
// Same template, sport-specific evidence.
const pathways = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      sport: z.enum(SPORT_ENUM),
      title: z.string(),
      summary: z.string(),
      bands: z.array(
        z.object({
          age: z.enum(AGE_ENUM),
          skillMilestones: z.array(z.string()).default([]),
          practiceShape: z.array(z.string()).default([]),
          socialEmotional: z.array(z.string()).default([]),
          decisionPoints: z.array(z.string()).default([]),
        })
      ),
      notYet: z.array(z.string()).default([]),
      aheadBehind: z.array(z.string()).default([]),
      ltadStage: z.string(),
      publishedAt: z.coerce.date(),
      draft: z.boolean().default(false),
      ...editorialField,
    }),
});

// Recruiting: HS-to-college funnel content. Timeline by grade, NCAA Eligibility Center,
// NIL basics, what verbal commits actually mean. Strict factual, sourced framing.
const recruiting = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      summary: z.string(),
      category: z.enum([
        'overview','sport-specific','timeline','eligibility','nil','commits','showcases','walk-on','transfer-portal','academics','communication',
      ]),
      gradeLevels: z.array(z.enum(['8','9','10','11','12'])).default([]),
      divisions: z.array(z.enum(['d1','d2','d3','naia','juco','all'])).default(['all']),
      sportTags: z.array(z.enum(SPORT_ENUM)).optional(),
      governingBodies: z.array(
        z.object({ name: z.string(), url: z.string().url() })
      ).default([]),
      publishedAt: z.coerce.date(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      ...editorialField,
    }),
});

// Adaptive & neurodivergent athletes. Inclusive sports content. Uses similar structure
// to the body collection but framed for a different audience (parent of an adaptive kid).
const adaptive = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      summary: z.string(),
      category: z.enum([
        'adhd','autism','sensory','physical-disability','unified-sports','intellectual-disability','general','inclusion-rules',
      ]),
      sportTags: z.array(z.enum(SPORT_ENUM)).optional(),
      ageBands: z.array(z.enum(AGE_ENUM)).optional(),
      governingBodies: z.array(
        z.object({ name: z.string(), url: z.string().url() })
      ).default([]),
      publishedAt: z.coerce.date(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      ...editorialField,
    }),
});

// Rules at-a-glance. One file per sport. Five-minute primer parents can scan during
// a tournament or before their first game.
const rules = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      sport: z.enum(SPORT_ENUM),
      title: z.string(),
      summary: z.string(),
      fieldSetup: z.string(),
      gameLength: z.string(),
      scoringBasics: z.array(z.string()).default([]),
      commonCalls: z.array(z.string()).default([]),
      thingsParentsGetWrong: z.array(z.string()).default([]),
      governingBody: z.object({ name: z.string(), url: z.string().url() }),
      ruleBookUrl: z.string().url().optional(),
      publishedAt: z.coerce.date(),
      draft: z.boolean().default(false),
      ...editorialField,
    }),
});

export const collections = { articles, gear, guides, resources, coachingTips, seasonCalendars, body, pathways, recruiting, adaptive, rules };
