import { defineCollection, z } from 'astro:content';

const SPORT_ENUM = [
  'baseball','softball','soccer','basketball',
  'flag-football','football','football-7v7','hockey','field-hockey','lacrosse','lacrosse-boys','lacrosse-girls','volleyball',
  'swimming','track-field','cross-country','tennis','golf','crew',
  'martial-arts','wrestling','gymnastics','cheer','stunt',
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
const editorialField = {
  editorial: z.object({
    qualityGrade:               z.number().min(1).max(10).optional(),
    originalityGrade:           z.number().min(1).max(10).optional(),
    voiceGrade:                 z.number().min(1).max(10).optional(),
    flagInappropriateness:      z.boolean().default(false),
    flagIpRisk:                 z.boolean().default(false),
    flagSensitiveTopic:         z.boolean().default(false),
    citationCheckPassed:        z.boolean().default(false),
    sportLanguageCheckPassed:   z.boolean().default(false),
    affiliateDisclosurePresent: z.boolean().default(false),
    claudeReviewedAt:           z.coerce.date().optional(),
    jeffReviewedAt:             z.coerce.date().optional(),
    status: z.enum(['draft','claude-reviewed','ready-for-jeff','jeff-approved','published','needs-revision']).default('draft'),
    reviewerNotes:              z.string().optional(),
    factCheckGoodThrough:       z.coerce.date().optional(),
  }).optional(),
};

const articles = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      // Min/max enforced so a sloppy frontmatter (12-char title, 1-line dek) can't
      // ship a thin SERP card. Loose ceilings; nothing here clips real editorial work.
      title: z.string().min(8, 'title too short for SERP').max(120, 'title too long for SERP'),
      seoTitle: z.string().min(20).max(70).optional(),
      seoDescription: z.string().min(40).max(180).optional(),
      dek: z.string().min(20).max(240).optional(),
      bluf: z.string().min(80).max(500).optional(),
      topic: z
        .enum(['communication','tryouts','game-day','the-hard-stuff','season-ops','equipment','rec-vs-travel','rules-of-play','summer-camps'])
        .optional(),
      teamParentTopic: z
        .enum(['logistics','communication','money','picture-day','conflict','tools'])
        .optional(),
      issue: z.number().optional(),
      hero: z.string().optional(),
      heroAlt: z.string().min(15).max(280).optional(),
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
    }).superRefine((data, ctx) => {
      if (data.hero && !data.heroAlt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['heroAlt'],
          message: 'heroAlt is required whenever hero is set (a11y + image-search).',
        });
      }
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
      title: z.string().min(4).max(120),  // Drill names like "Rondo" are legit short titles.
      summary: z.string().min(40).max(280),
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
      heroAlt: z.string().min(15).max(280).optional(),
      illustrationBrief: z.string().optional(),
      publishedAt: z.coerce.date(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      ...editorialField,
    }).superRefine((data, ctx) => {
      if (data.hero && !data.heroAlt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['heroAlt'],
          message: 'heroAlt is required whenever hero is set (a11y + image-search).',
        });
      }
    }),
});

const seasonCalendars = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      sport: z.enum(SPORT_ENUM),
      level: z.enum(['rec', 'school', 'travel', 'elite']),
      region: z.string().optional(),
      durationLabel: z.string(),
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

const SAFETY_CATEGORY_ENUM = [
  'weather','coach-vetting','equipment-certification','travel-logistics',
  'emergency-response','conduct','aquatic','cyber','nutrition-substance',
  'crisis-mental-health',
] as const;

const body = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      summary: z.string(),
      subhub: z.enum(['health', 'safety']).default('health'),
      format: z.enum(['topic', 'protocol', 'sport-briefing', 'checklist']).default('topic'),
      category: z.enum([
        'injury-prevention','recovery','sleep','nutrition','hydration',
        'mental-skills','arm-care','concussion','heat','growth-plates','specialization',
      ]).optional(),
      safetyCategory: z.enum(SAFETY_CATEGORY_ENUM).optional(),
      sportTags: z.array(z.enum(SPORT_ENUM)).optional(),
      ageBands: z.array(z.enum(AGE_ENUM)).optional(),
      governingBodies: z.array(
        z.object({
          name: z.string(),
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
      protocolSteps: z.array(z.string()).default([]),
      checklistItems: z.array(z.string()).default([]),
      checklistPdf: z.string().optional(),
      publishedAt: z.coerce.date(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      ...editorialField,
    }).superRefine((data, ctx) => {
      if (data.format === 'sport-briefing') return;
      if (data.subhub === 'health' && !data.category) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'subhub:health requires a category' });
      }
      if (data.subhub === 'safety' && !data.safetyCategory) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'subhub:safety requires a safetyCategory' });
      }
    }),
});

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

const scripts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      moment: z.enum([
        'after-a-bad-game','after-a-win','after-no-playing-time','after-a-mistake',
        'kid-upset','kid-silent','before-game-nerves','after-the-last-game',
        'after-a-loss','tryouts-week','before-a-game','during-a-game',
        'coach-conflict','teammate-conflict','injury','other',
      ]),
      whatTheyAreFeeling: z.array(z.string()).default([]),
      whatToSay:          z.array(z.string()).default([]),
      whatNotToSay:       z.array(z.string()).default([]),
      theRule:            z.string(),
      ifTheyBringItUp:    z.array(z.string()).default([]),
      saveBlockTitle:     z.string().optional(),
      saveBlockBullets:   z.array(z.string()).default([]),
      relatedScripts:     z.array(z.string()).default([]),
      sportTags:          z.array(z.enum(SPORT_ENUM)).optional(),
      ageBands:           z.array(z.enum(AGE_ENUM)).optional(),
      hero:               z.string().optional(),
      heroAlt:            z.string().optional(),
      publishedAt:        z.coerce.date(),
      featured:           z.boolean().default(false),
      draft:              z.boolean().default(false),
      ...editorialField,
    }),
});

const decisions = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      summary: z.string(),
      theQuestion: z.string(),
      benefits:          z.array(z.string()).default([]),
      costs:             z.array(z.string()).default([]),
      signsItsAGoodFit:  z.array(z.string()).default([]),
      signsItsNot:       z.array(z.string()).default([]),
      howToHandleIt:     z.array(z.string()).default([]),
      theRule:           z.string(),
      relatedScripts:    z.array(z.string()).default([]),
      relatedDecisions:  z.array(z.string()).default([]),
      sportTags:         z.array(z.enum(SPORT_ENUM)).optional(),
      ageBands:          z.array(z.enum(AGE_ENUM)).optional(),
      publishedAt:       z.coerce.date(),
      featured:          z.boolean().default(false),
      draft:             z.boolean().default(false),
      ...editorialField,
    }),
});

export const collections = {
  articles,
  guides,
  resources,
  coachingTips,
  seasonCalendars,
  body,
  pathways,
  recruiting,
  adaptive,
  rules,
  scripts,
  decisions,
};
