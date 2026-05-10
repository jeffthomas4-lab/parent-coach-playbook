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
    sportLanguageCheckPassed:   z.boolean().default(false),               // every action verb and noun in the body uses the correct vocabulary for the tagged sport — see sport-vocab/<sport>.md
    affiliateDisclosurePresent: z.boolean().default(false),               // FTC requires when affiliate links present
    claudeReviewedAt:           z.coerce.date().optional(),
    jeffReviewedAt:             z.coerce.date().optional(),
    status: z.enum(['draft','claude-reviewed','ready-for-jeff','jeff-approved','published','needs-revision']).default('draft'),
    reviewerNotes:              z.string().optional(),
    factCheckGoodThrough:       z.coerce.date().optional(),               // for evergreen content with date-sensitive facts
  }).optional(),
};

const articles = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),                       // The voice H1 (with markdown italics)
      seoTitle: z.string().optional(),         // Optional search-shaped title for the <title> tag and SERP. Falls back to title if missing.
      seoDescription: z.string().optional(),   // Optional search-shaped description override. Falls back to dek.
      dek: z.string().optional(),
      bluf: z.string().optional(),             // Bottom Line Up Front. 30-50 word answer-first paragraph for featured-snippet capture. Renders above the article body in a styled callout. Plain text only, no markdown. Match the language a parent would type into Google.
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

// Body hub: pediatric sports medicine plus the safety canon. Two lenses, one
// collection. Strict boundary — describe, don't diagnose. Always cite the
// governing body. Always end with the questions to bring to the pediatrician.
//
// subhub splits the collection into 'health' (existing pediatric medicine) and
// 'safety' (the institutional, environmental, equipment, conduct canon). See
// SAFETY_PLAN.md at the repo root for the full operator manual.
//
// format picks the page layout. 'topic' is the existing long deep page.
// 'protocol' is the moment-of-need numbered page. 'sport-briefing' is the per-
// sport page. 'checklist' is the print/screenshot artifact.
const SAFETY_CATEGORY_ENUM = [
  'weather',                  // heat, lightning, wildfire smoke / AQI, cold, sun
  'coach-vetting',            // SafeSport, background checks, league questions
  'equipment-certification',  // NOCSAE helmets, bat stamps, mouthguards, used gear
  'travel-logistics',         // rooming, chaperones, transporting other kids
  'emergency-response',       // protocols, sideline kit, AED/CPR, missing kid
  'conduct',                  // bullying, hazing, sideline parents, refs, locker room
  'aquatic',                  // pool/lake/deck rules, shallow-water blackout
  'cyber',                    // team apps, photo policies, recruiting DMs
  'nutrition-substance',      // caffeine, energy drinks, creatine, banned substances, supplements
  'crisis-mental-health',     // deferred mini-launch; schema-ready, not slate-ready
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
      protocolSteps: z.array(z.string()).default([]),       // numbered moment-of-need steps for format: protocol
      checklistItems: z.array(z.string()).default([]),      // line items for format: checklist
      checklistPdf: z.string().optional(),                  // path to printable PDF for format: checklist
      publishedAt: z.coerce.date(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      ...editorialField,
    }).superRefine((data, ctx) => {
      // The pairing rule: health pieces use category; safety pieces use safetyCategory,
      // unless format is 'sport-briefing' which sits above the category dimension.
      if (data.format === 'sport-briefing') return;
      if (data.subhub === 'health' && !data.category) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'subhub:health requires a category' });
      }
      if (data.subhub === 'safety' && !data.safetyCategory) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'subhub:safety requires a safetyCategory' });
      }
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

// Scripts: short, scriptable moment-pages parents read in 30 seconds. The flagship
// format for the relationship-first lane. Six structured sections: what they're feeling,
// what to say, what not to say, the rule, if they bring it up, save block.
//
// Each script lives at /scripts/[slug]/. Hub at /scripts/.
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
      hero:               image().optional(),
      heroAlt:            z.string().optional(),
      publishedAt:        z.coerce.date(),
      featured:           z.boolean().default(false),
      draft:              z.boolean().default(false),
      ...editorialField,
    }),
});

// Decisions: structured pages for the big youth-sports decisions parents face.
// Same pattern as Rules at-a-glance. Question → benefits → costs → signs it fits →
// signs it doesn't → the rule → how to handle it.
const decisions = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),                                  // "Should My Kid Play Travel Sports?"
      summary: z.string(),
      theQuestion: z.string(),                            // user-search-language version of the question
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

export const collections = { articles, guides, resources, coachingTips, seasonCalendars, body, pathways, recruiting, adaptive, rules, scripts, decisions };

