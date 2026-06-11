// Single source of truth for nav, footer, and brand metadata.
// Update here, the change propagates everywhere.

export const SITE = {
  name: 'Parent Coach Desk',
  tagline: 'Sideline notes for parents in the middle of it.',
  shortPitch: 'Sideline notes from the editorial desk for parents who coach, organize, drive, and supervise the snack rotation.',
  url: 'https://parentcoachdesk.com',
  description:
    'Sideline notes for parents who are deep in their kid\'s youth sports, theater, band, or whatever else is on the schedule this week. Short, honest, occasionally funny.',
  byline: 'the Parent Coach Desk',
  bylineShort: 'PCD',
  email: 'parentcoachplaybook@gmail.com',
};

// Single editorial voice. Used for byline rendering on cards, articles, and feeds.
// The site is intentionally anonymous. The byline is the team, not any one person.
export const EDITORIAL = {
  byline: 'the Parent Coach Desk',
  short: 'PCD',
  // Mark color used wherever a small accent dot or pill renders.
  accent: '#C5713D',
  accentBg: '#F2E2D5',
};

// ---------------------------------------------------------------------------
// AUTHOR REVEAL SWITCH
// ---------------------------------------------------------------------------
// Set AUTHOR_REVEALED = true on the November face-reveal date and every
// Article / HowTo / About schema starts emitting Person instead of
// Organization. No other code changes needed — every schema goes through
// authorEntity() / personSchema() below.
//
// Until then we ship Organization-as-author so Jeff's identity stays out of
// public-facing JSON-LD. The AUTHOR object stays populated so the switch is
// truly one-line on the day.
// ---------------------------------------------------------------------------

export const AUTHOR_REVEALED = false;

export const AUTHOR = {
  name: 'Jeff Thomas',
  jobTitle: 'Head Coach, Football',
  worksFor: 'University of Puget Sound',
  worksForUrl: 'https://athletics.pugetsound.edu',
  description:
    'Head coach with two decades inside the youth-to-college athletics pipeline. Writes Parent Coach Desk for the parents on the other side of the field.',
  url: 'https://parentcoachdesk.com/about/',
  // External profiles that confirm identity. Add LinkedIn, school staff page,
  // podcast appearances here as they go live (post-reveal).
  sameAs: [] as string[],
  knowsAbout: [
    'Youth sports',
    'College athletics recruiting',
    'Youth coaching',
    'Parent education',
    'Sports parenting',
  ],
};

// authorEntity() is what every JSON-LD `author:` field should call.
// Returns Organization while AUTHOR_REVEALED is false, Person after the flip.
export function authorEntity(): Record<string, unknown> {
  if (!AUTHOR_REVEALED) {
    return {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    };
  }
  return {
    '@type': 'Person',
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    description: AUTHOR.description,
    url: AUTHOR.url,
    worksFor: {
      '@type': 'Organization',
      name: AUTHOR.worksFor,
      url: AUTHOR.worksForUrl,
    },
    knowsAbout: AUTHOR.knowsAbout,
    ...(AUTHOR.sameAs.length ? { sameAs: AUTHOR.sameAs } : {}),
  };
}

// personSchema() is the standalone Person JSON-LD that lives on /about/.
// Returns null until the reveal so /about/ stays org-only pre-November.
export function personSchema(): Record<string, unknown> | null {
  if (!AUTHOR_REVEALED) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    description: AUTHOR.description,
    url: AUTHOR.url,
    worksFor: {
      '@type': 'Organization',
      name: AUTHOR.worksFor,
      url: AUTHOR.worksForUrl,
    },
    knowsAbout: AUTHOR.knowsAbout,
    ...(AUTHOR.sameAs.length ? { sameAs: AUTHOR.sameAs } : {}),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': AUTHOR.url,
    },
  };
}

// Primary nav: 5 items + search button. Scripts fold into Reads (linked from
// the Reads landing). Camps and Team Parent fold into Tools and Reads
// respectively. Search promoted from utility nav into the main bar.
export const NAV = [
  { label: 'Start here', href: '/start-here/' },
  { label: 'Reads', href: '/reads/' },
  { label: 'Camps', href: '/camps/' },
  { label: 'Drills', href: '/coaching-tips/' },
  { label: 'Gear Files', href: '/what-to-buy/', hasDropdown: 'buying-guides' },
  { label: 'The Drawer', href: '/tools/', hasDropdown: 'tools' },
];

// Items inside the Tools nav dropdown. Six items, organized by what parents are doing.
// Body & Safety hub now lives under /reads/ as a top-line tile, not in Tools. The
// body collection still owns /body/ as its URL home; only the navigation parent moved.
// Adaptive, Recruiting, Rules, Camps, Governing bodies still live but moved
// to footer or accessed via Tools landing page. Decisions and Scripts live in /reads/ flow.
export const TOOLS_NAV = [
  { slug: 'cost-calculator',  label: 'Cost calculator',   href: '/cost-calculator/',  blurb: 'Real annual cost of any sport. Pre-filled, edit any line, share the result.' },
  { slug: 'sports',           label: 'By sport',          href: '/sports/',           blurb: 'Every read, drill, calendar, and tool grouped by sport. The fastest entry point.' },
  { slug: 'season-calendar',  label: 'Season calendar',   href: '/season-calendar/',  blurb: 'Twelve months by sport and level. Tryouts, peaks, off-season.' },
  { slug: 'pathways',         label: 'Age pathways',      href: '/pathways/',         blurb: 'What "good" looks like at 7, 10, 13, 15, by sport.' },
  { slug: 'pendulum',         label: 'The pendulum',      href: '/youth-sports-pendulum/', blurb: 'Where is your family on the fun-to-performance spectrum right now?' },
  { slug: 'recruiting',       label: 'Recruiting',        href: '/recruiting/',       blurb: 'College recruiting honestly, by sport and level. What parents actually need to know.' },
] as const;

export type ToolsNavSlug = (typeof TOOLS_NAV)[number]['slug'];

// Utility nav: Newsletter and About sit on the right side of the header bar.
// Search has been promoted into the main nav as an icon button (handled in
// NavBar.astro), so it's no longer a utility item.
export const UTILITY_NAV = [
  { label: 'Friday Letter', href: '/newsletter/' },
  { label: 'About', href: '/about/' },
];

// Phase taxonomy is preserved as light metadata so existing URLs keep working.
// We no longer brand the site around three drives. The phase shows up only on article frontmatter.
export const PILLARS = {
  'drive-there': {
    slug: 'drive-there',
    label: 'Before the game',
    eyebrow: 'Before',
    accent: '#8FA68C',
    accentBg: '#EAEFE7',
    blurb: 'The conversation on the way to practice. The night before tryouts. What gets done before anyone steps on the field.',
  },
  game: {
    slug: 'game',
    label: 'In the game',
    eyebrow: 'During',
    accent: '#C5713D',
    accentBg: '#F2E2D5',
    blurb: 'Coaching execution, in-the-moment decisions, and the strange job of coaching your own kid in front of the team.',
  },
  'drive-home': {
    slug: 'drive-home',
    label: 'After the game',
    eyebrow: 'After',
    accent: '#D4AB6A',
    accentBg: '#F5E9D2',
    blurb: 'The post-game conversation, the car ride, the dinner table. The relationship aftermath.',
  },
} as const;

// Topic taxonomy: the new homepage organization. Replaces three-drives as the front-door grid.
export const TOPICS = [
  { slug: 'communication',  label: 'Communication',     blurb: 'Group chats, hard parent emails, the script you wish you had.' },
  { slug: 'tryouts',        label: 'Tryouts and teams', blurb: 'Making the team, not making it, what to say either way.' },
  { slug: 'game-day',       label: 'Game day',          blurb: 'Lineups, rotations, what to say in the first ninety seconds after.' },
  { slug: 'the-hard-stuff', label: 'The hard moments',  blurb: 'Quitting. Losing. Riding the bench. The parent on the team you cannot stand.' },
  { slug: 'season-ops',     label: 'Season operations', blurb: 'Practice plans, snack signups, the tournament weekend.' },
  { slug: 'equipment',      label: 'Equipment',         blurb: 'What to buy, what to skip, where to find it used.' },
  { slug: 'rec-vs-travel',  label: 'Rec vs travel',     blurb: 'The honest comparison. The politics. The reality at fourteen.' },
  { slug: 'rules-of-play',  label: 'Rules of play',     blurb: 'Why youth sports exists, what it is for, what it is not.' },
  { slug: 'summer-camps',   label: 'Summer camps',      blurb: 'How to pick one. What to pack. What to ask. When to stay home.' },
] as const;

export const SPORTS = [
  {
    slug: 'baseball',
    label: 'Baseball',
    seoTitle: 'Baseball Parent Guide: Gear, Drills and What to Expect',
    seoDescription: 'Gear picks by age, drills for every position, season calendar, rules explainer, and recruiting notes — everything a baseball parent needs in one place.',
  },
  {
    slug: 'softball',
    label: 'Softball',
    seoTitle: 'Softball Parent Guide: Gear, Drills and Season Prep',
    seoDescription: 'What to buy, drills that work at each age, the season calendar, and recruiting notes for softball parents who want to stay ahead of it.',
  },
  {
    slug: 'soccer',
    label: 'Soccer',
    seoTitle: 'Soccer Parent Guide: Gear, Drills, Recruiting and More',
    seoDescription: 'Gear by age, drills for every skill level, the full season calendar, rules parents actually ask about, and what recruiting looks like for youth soccer.',
  },
  {
    slug: 'basketball',
    label: 'Basketball',
    seoTitle: 'Basketball Parent Guide: Gear, Drills and Season Help',
    seoDescription: 'Gear that holds up, drills for home practice, the season timeline, and recruiting basics — all the basketball parent resources gathered in one spot.',
  },
  {
    slug: 'flag-football',
    label: 'Football — Flag',
    seoTitle: 'Flag Football Parent Guide: Rules, Drills and Gear',
    seoDescription: 'Flag football explained for parents: rules, gear worth buying, drills to run in the backyard, and what to expect through each age and skill level.',
  },
  {
    slug: 'football-7v7',
    label: 'Football — 7v7',
    seoTitle: '7v7 Football Parent Guide: What Parents Need to Know',
    seoDescription: 'What 7v7 football actually is, whether it is worth the cost, gear to bring, and how it fits into the full tackle football pathway for your kid.',
  },
  {
    slug: 'football',
    label: 'Football — Tackle',
    seoTitle: 'Tackle Football Parent Guide: Safety, Gear and Recruiting',
    seoDescription: 'Gear by position and age, safety questions answered straight, season calendar, rules for parents, and what college recruiting actually looks like in football.',
  },
  {
    slug: 'hockey',
    label: 'Hockey',
    seoTitle: 'Hockey Parent Guide: Gear, Ice Time and Recruiting',
    seoDescription: 'Full gear breakdown by age, what ice time to expect at each level, season calendar, rules parents need to know, and the hockey recruiting path explained.',
  },
  {
    slug: 'lacrosse-boys',
    label: 'Lacrosse — Boys',
    seoTitle: 'Boys Lacrosse Parent Guide: Gear, Drills and Recruiting',
    seoDescription: 'Gear that fits youth to high school, drills by position, the boys lacrosse season timeline, and recruiting notes from parents who have been through it.',
  },
  {
    slug: 'lacrosse-girls',
    label: 'Lacrosse — Girls',
    seoTitle: 'Girls Lacrosse Parent Guide: Gear, Drills and Recruiting',
    seoDescription: 'Gear picks for every age, drills to work on between practices, the girls lacrosse season calendar, and straight talk on what college recruiting takes.',
  },
  {
    slug: 'volleyball',
    label: 'Volleyball',
    seoTitle: 'Volleyball Parent Guide: Club, Gear, Drills and Recruiting',
    seoDescription: 'Club vs. school ball explained, gear picks by age, drills for home practice, the full season timeline, and volleyball recruiting notes in one place.',
  },
  {
    slug: 'swimming',
    label: 'Swimming',
    seoTitle: 'Swimming Parent Guide: Gear, Meets and Youth Swim Clubs',
    seoDescription: 'What gear to buy, how swim meets work, what to expect from a youth club, the season calendar, and recruiting info for swimming parents.',
  },
  {
    slug: 'track-field',
    label: 'Track and field',
    seoTitle: 'Track and Field Parent Guide: Events, Gear and Recruiting',
    seoDescription: 'Event breakdown for parents, gear worth buying, training tips by age, the season calendar, and what track recruiting looks like at the college level.',
  },
  {
    slug: 'cross-country',
    label: 'Cross country',
    seoTitle: 'Cross Country Parent Guide: Training, Gear and Meets',
    seoDescription: 'What cross country training looks like week to week, gear that works, how meets are scored, the season calendar, and recruiting notes for XC parents.',
  },
  {
    slug: 'tennis',
    label: 'Tennis',
    seoTitle: 'Tennis Parent Guide: Gear, Lessons and Junior Recruiting',
    seoDescription: 'Racket picks by age, how junior tournament tennis works, practice tips, the season timeline, and what tennis recruiting at the college level actually involves.',
  },
  {
    slug: 'golf',
    label: 'Golf',
    seoTitle: 'Golf Parent Guide: Junior Golf, Gear and College Recruiting',
    seoDescription: 'Club fitting by age, junior golf programs explained, tournament prep, the season calendar, and straight talk on what college golf recruiting requires.',
  },
  {
    slug: 'crew',
    label: 'Crew',
    seoTitle: 'Crew Rowing Parent Guide: Gear, Regattas and Recruiting',
    seoDescription: 'What youth rowing actually costs, gear to have, how regattas work, the season calendar, and what college crew recruiting looks like for new parents.',
  },
  {
    slug: 'martial-arts',
    label: 'Martial arts',
    seoTitle: 'Martial Arts Parent Guide: Gear, Styles and What to Expect',
    seoDescription: 'How to pick a school, gear for every style, belt progression explained, competition prep, and what youth martial arts looks like from first class to black belt.',
  },
  {
    slug: 'gymnastics',
    label: 'Gymnastics',
    seoTitle: 'Gymnastics Parent Guide: Levels, Gear and What It Costs',
    seoDescription: 'USAG levels explained, gear by age, what training hours look like at each level, the competition season calendar, and recruiting notes for gymnastics parents.',
  },
  {
    slug: 'cheer',
    label: 'Cheerleading',
    seoTitle: 'Cheerleading Parent Guide: Gear, All-Star and School Cheer',
    seoDescription: 'All-star vs. school cheerleading explained, gear to buy, what competition season looks like, safety basics, and recruiting info for cheer parents.',
  },
  {
    slug: 'stunt',
    label: 'Stunt and tumbling',
    seoTitle: 'STUNT Parent Guide: Rules, Gear and What to Expect',
    seoDescription: 'What STUNT sport actually is, how it differs from cheer, gear to have, the competition format, and what parents need to know going into their first season.',
  },
  {
    slug: 'theater',
    label: 'Theater',
    seoTitle: 'Theater Parent Guide: Auditions, Rehearsals and What Helps',
    seoDescription: 'How auditions work, what rehearsal schedules look like, how to support your kid without hovering, gear and supplies, and the youth theater pathway explained.',
  },
  {
    slug: 'band',
    label: 'Band',
    seoTitle: 'Band Parent Guide: Instruments, Marching Band and Booster Life',
    seoDescription: 'Instrument rental vs. buying explained, what marching band season demands, how to be a useful band parent, the competition calendar, and college music notes.',
  },
  {
    slug: 'choir',
    label: 'Choir',
    seoTitle: 'Choir Parent Guide: Auditions, Competitions and Vocal Health',
    seoDescription: 'How youth choir auditions work, what competition season looks like, vocal health basics for parents, gear to have, and the path from school choir to college music.',
  },
  {
    slug: 'dance',
    label: 'Dance',
    seoTitle: 'Dance Parent Guide: Studios, Competitions and What It Costs',
    seoDescription: 'How to pick a studio, what competition dance season looks like, recital prep, gear by style, and what parents of competitive dancers need to know going in.',
  },
  {
    slug: 'ballet',
    label: 'Ballet',
    seoTitle: 'Ballet Parent Guide: Gear, Training Levels and What to Expect',
    seoDescription: 'Gear by age and level, how ballet training levels and intensives work, what to look for in a school, and the path from first class to pre-professional ballet.',
  },
] as const;

const CAMP_ONLY_SPORTS = [
  { slug: 'multi-sport',    label: 'Multi-sport' },
  { slug: 'football-7v7',   label: 'Football — 7v7' },
  { slug: 'wrestling',      label: 'Wrestling' },
  { slug: 'rugby',          label: 'Rugby' },
  { slug: 'field-hockey',   label: 'Field hockey' },
  { slug: 'climbing',       label: 'Rock climbing' },
  { slug: 'skateboarding',  label: 'Skateboarding' },
  { slug: 'outdoor',        label: 'Outdoor and adventure' },
  { slug: 'stem',           label: 'STEM and coding' },
  { slug: 'arts',           label: 'Arts (visual and performing)' },
  { slug: 'academic',       label: 'Academic enrichment' },
  { slug: 'general',        label: 'General day camp' },
] as const;

export const CAMP_SPORTS = [...SPORTS, ...CAMP_ONLY_SPORTS]
  .slice()
  .sort((a, b) => a.label.localeCompare(b.label));

export const AGE_BANDS = [
  { slug: '5-7', label: '5–7' },
  { slug: '8-10', label: '8–10' },
  { slug: '11-12', label: '11–12' },
  { slug: '13-14', label: '13–14' },
  { slug: '15-plus', label: '15+' },
] as const;

export const SEASON_PHASES = [
  { slug: 'pre-season', label: 'Pre-season' },
  { slug: 'early', label: 'Early' },
  { slug: 'mid', label: 'Mid' },
  { slug: 'playoffs', label: 'Playoffs' },
  { slug: 'off-season', label: 'Off-season' },
] as const;

export type PillarSlug = keyof typeof PILLARS;
export type SportSlug = (typeof SPORTS)[number]['slug'];
export type AgeBandSlug = (typeof AGE_BANDS)[number]['slug'];
export type TopicSlug = (typeof TOPICS)[number]['slug'];

export const BUYING_GUIDES = [
  { slug: 'baseball',      label: 'Baseball',         category: 'sport',    group: 'team',       blurb: 'Glove, bat, helmet, cleats. Tee-ball through middle school.' },
  { slug: 'basketball',    label: 'Basketball',       category: 'sport',    group: 'team',       blurb: 'Shoes, ball, athletic gear. Indoor sport, low overhead.' },
  { slug: 'flag-football', label: 'Football — Flag',  category: 'sport',    group: 'team',       blurb: 'Mouthguard, cleats, gloves. No pads, no helmet.' },
  { slug: 'football-7v7',  label: 'Football — 7v7',   category: 'sport',    group: 'team',       blurb: 'Skill-position 7v7. Mouthguard, cleats, gloves, optional skull cap. No tackling, no linemen.' },
  { slug: 'football',      label: 'Football — Tackle',category: 'sport',    group: 'team',       blurb: 'Helmet, full pads, cleats. The most equipment-heavy youth sport.' },
  { slug: 'hockey',        label: 'Hockey',           category: 'sport',    group: 'team',       blurb: 'Skates, helmet, stick, full pads. Plan for serious investment.' },
  { slug: 'lacrosse-boys',  label: 'Lacrosse — Boys',  category: 'sport',   group: 'team',       blurb: 'Contact version. Helmet, gloves, full pads, stick.' },
  { slug: 'lacrosse-girls', label: 'Lacrosse — Girls', category: 'sport',   group: 'team',       blurb: 'Non-contact version. Stick, goggles, mouthpiece.' },
  { slug: 'soccer',        label: 'Soccer',           category: 'sport',    group: 'team',       blurb: 'Cleats, shin guards, ball, water bottle.' },
  { slug: 'softball',      label: 'Softball',         category: 'sport',    group: 'team',       blurb: 'Mostly the same as baseball, with a few specific tweaks.' },
  { slug: 'volleyball',    label: 'Volleyball',       category: 'sport',    group: 'team',       blurb: 'Shoes, knee pads, ball. Indoor and beach variants.' },
  { slug: 'pickleball',    label: 'Pickleball',       category: 'sport',    group: 'team',       blurb: 'Paddle, balls, court shoes. Youth pickleball is growing fast.' },
  { slug: 'rugby',         label: 'Rugby',            category: 'sport',    group: 'team',       blurb: 'Mouthguard, cleats, shoulder pads, scrum cap. Growing fast in youth.' },
  { slug: 'crew',          label: 'Crew',             category: 'sport',    group: 'individual', blurb: 'Most gear is club-provided. What you actually buy: a few specific things.' },
  { slug: 'cross-country', label: 'Cross country',    category: 'sport',    group: 'individual', blurb: 'Trainers, racing flats, layered cold-weather kit.' },
  { slug: 'golf',          label: 'Golf',             category: 'sport',    group: 'individual', blurb: 'A starter set, gloves, balls. Used clubs are fine.' },
  { slug: 'gymnastics',    label: 'Gymnastics',       category: 'sport',    group: 'individual', blurb: 'Leotards, grips, tape. Most apparatus stays at the gym.' },
  { slug: 'martial-arts',  label: 'Martial arts',     category: 'sport',    group: 'individual', blurb: 'Gi, belt, mouthguard. Discipline differs by style.' },
  { slug: 'wrestling',     label: 'Wrestling',        category: 'sport',    group: 'individual', blurb: 'Singlet, headgear, wrestling shoes. Folkstyle through high school.' },
  { slug: 'swimming',      label: 'Swimming',         category: 'sport',    group: 'individual', blurb: 'Suit, cap, goggles. The cheapest sport on the list.' },
  { slug: 'tennis',        label: 'Tennis',           category: 'sport',    group: 'individual', blurb: 'Racket, shoes, balls. Stringing matters more than you think.' },
  { slug: 'track-field',   label: 'Track and field',  category: 'sport',    group: 'individual', blurb: 'Spikes by event. Sprints, distance, hurdles, jumps, throws.' },
  { slug: 'ballet',        label: 'Ballet',           category: 'activity', blurb: 'Slippers, leotard, tights. Pointe later, on the teacher\'s timeline.' },
  { slug: 'band',          label: 'Band',             category: 'activity', blurb: 'Instrument, reeds, accessories. Rent before you buy.' },
  { slug: 'cheer',         label: 'Cheerleading',     category: 'activity', blurb: 'Shoes, bow, practice clothes. Competition uniforms via the team.' },
  { slug: 'choir',         label: 'Choir',            category: 'activity', blurb: 'Almost no equipment. The list is short and cheap.' },
  { slug: 'dance',         label: 'Dance',            category: 'activity', blurb: 'Shoes, leotards, tights, recital costumes. Style-specific.' },
  { slug: 'stunt',         label: 'Stunt and tumbling', category: 'activity', blurb: 'Mat shoes, bracing, athletic tape. The tumbling-track essentials.' },
  { slug: 'theater',       label: 'Theater',          category: 'activity', blurb: 'School plays, community theater. Mostly time, less equipment.' },
  { slug: 'first-aid-kit',      label: 'First aid kit',       category: 'essentials', blurb: 'Bandages, tape, cold packs, and what you use on the sideline every week.' },
  { slug: 'season-essentials',  label: 'Season essentials',    category: 'essentials', blurb: 'Recovery, hydration, travel logistics. The kit that runs the season.' },
  { slug: 'sideline-kit',       label: 'Sideline kit',         category: 'essentials', blurb: 'Chair, cooler, blanket. The gear that makes watching comfortable.' },
  { slug: 'parent-coach-gear',  label: 'Parent-coach gear',    category: 'coach-gear', blurb: 'Clipboard, timer, pennies, bag, whiteboard. The stuff you actually need on the bench.' },
  { slug: 'video-tracking-gear',label: 'Video and tracking',   category: 'coach-gear', blurb: 'Phone tripod, action cam, ball pump. Film practice, inflate everything.' },
  { slug: 'training-gear',      label: 'At-home training gear', category: 'coach-gear', blurb: 'Foam rollers, resistance bands, speed ladders, rebounder. The YouTube rabbit hole, organized.' },
  { slug: 'boosters-gear',      label: 'Boosters and events',  category: 'coach-gear', blurb: 'Folding table, payment box, PA speaker. For the parent running the table.' },
] as const;

export type BuyingGuideSlug = (typeof BUYING_GUIDES)[number]['slug'];

export const TEAM_PARENT_TOPICS = [
  { slug: 'logistics',        label: 'Logistics',         blurb: 'Snacks, carpools, calendar management. The operational stuff.' },
  { slug: 'communication',    label: 'Communication',     blurb: 'Emails to coaches, group chat rules, the hard-parent conversation.' },
  { slug: 'money',            label: 'Money',             blurb: 'Fundraising, registration costs, the money talk with your kid.' },
  { slug: 'picture-day',      label: 'Picture day & events', blurb: 'Photos, banquets, end-of-season celebrations.' },
  { slug: 'conflict',         label: 'Conflict resolution', blurb: 'When things go sideways. Parent to parent, parent to coach.' },
  { slug: 'tools',            label: 'Tools & templates', blurb: 'Apps, spreadsheets, checklists. What actually works.' },
] as const;

export type TeamParentTopicSlug = (typeof TEAM_PARENT_TOPICS)[number]['slug'];

export const TRACK_EVENTS = [
  { slug: 'sprints',   label: 'Sprints',           blurb: '100m, 200m, 400m. Sprint spikes, blocks if your team uses them.' },
  { slug: 'distance',  label: 'Distance',          blurb: '800m, 1500m, mile, 3200m. Trainers and a pair of racing flats.' },
  { slug: 'hurdles',   label: 'Hurdles',           blurb: 'Sprint spike with a slightly longer pin set, drill bands.' },
  { slug: 'jumps',     label: 'Jumps',             blurb: 'Long, triple, high. Jump spikes, takeoff tape, a measuring tape.' },
  { slug: 'throws',    label: 'Throws and javelin',blurb: 'Shot, discus, javelin. Footwear, a thrower\'s shoe, towel, chalk.' },
] as const;

export type TrackEventSlug = (typeof TRACK_EVENTS)[number]['slug'];

export const TEAM_PARENT_CATEGORIES = [
  { slug: 'tech-setup',    label: 'Tech setup',         blurb: 'GameChanger, MaxPreps, TeamSnap. What to use, what to skip.', accent: '#5C7459' },
  { slug: 'communication', label: 'Communication',      blurb: 'Group chats. Snack signups. The hard-parent email.',          accent: '#C5713D' },
  { slug: 'practice',      label: 'Practice',           blurb: 'Practice plans. Drills by age. Why parents need to see it.',  accent: '#B0894A' },
  { slug: 'game-day',      label: 'Game day',           blurb: 'Lineup spreadsheets. Fair rotations. Bench management.',      accent: '#5C7459' },
  { slug: 'photos-events', label: 'Photos and events',  blurb: 'Picture day choices. Banquet checklists. Team gifts.',        accent: '#B0894A' },
  { slug: 'fundraising',   label: 'Fundraising',        blurb: 'Sponsor scripts. Snap Raise reality. Pizza-night models.',    accent: '#C5713D' },
  { slug: 'volunteering',  label: 'Volunteering',       blurb: 'Recruiting assistants. Snack signups that actually fill.',     accent: '#5C7459' },
  { slug: 'travel',        label: 'Travel team logistics', blurb: 'Tournament packing. Hotel rotations. Travel budgets.',     accent: '#C5713D' },
] as const;

export type TeamParentCategorySlug = (typeof TEAM_PARENT_CATEGORIES)[number]['slug'];

export interface Theme {
  accent: string;
  accentBg: string;
  label?: string;
}

export const SECTION_THEMES: Record<string, Theme> = {
  'drive-there':     { accent: '#8FA68C', accentBg: '#EAEFE7', label: 'Before the game' },
  'game':            { accent: '#C5713D', accentBg: '#F2E2D5', label: 'In the game' },
  'drive-home':      { accent: '#D4AB6A', accentBg: '#F5E9D2', label: 'After the game' },
  'body':            { accent: '#7C9E94', accentBg: '#E5EFEB', label: 'The Sideline File' },
  'mental-skills':   { accent: '#7C9E94', accentBg: '#E5EFEB', label: 'Mental skills' },
  'recruiting':      { accent: '#A66A8E', accentBg: '#EFE0E8', label: 'Recruiting' },
  'coaching-tips':   { accent: '#C5713D', accentBg: '#F2E2D5', label: 'Drills' },
  'decisions':       { accent: '#6F8AA8', accentBg: '#E2EAF2', label: 'Decisions' },
  'pathways':        { accent: '#B0894A', accentBg: '#F0E5CE', label: 'Age pathways' },
  'reads':           { accent: '#2D2520', accentBg: '#F2EAD9', label: 'Reads' },
  'rules':           { accent: '#6B7B6F', accentBg: '#E8ECE8', label: 'Rules at-a-glance' },
  'scripts':         { accent: '#B8908F', accentBg: '#EDDBD9', label: 'Scripts' },
  'season-calendar': { accent: '#9E7B4E', accentBg: '#EFE3D2', label: 'Season calendar' },
  'team-parent':     { accent: '#8E7AA8', accentBg: '#E8E1F0', label: 'Team parent' },
  'tools':           { accent: '#5C7459', accentBg: '#E3EAE2', label: 'The Drawer' },
  'what-to-buy':     { accent: '#C5713D', accentBg: '#F2E2D5', label: 'The Gear Files' },
  'sports':          { accent: '#2D2520', accentBg: '#F2EAD9', label: 'By sport' },
  'camps':           { accent: '#7C9E5E', accentBg: '#E8EFE0', label: 'Summer camps' },
  'cost-calculator': { accent: '#9C7A4A', accentBg: '#F0E5D2', label: 'Cost calculator' },
  'adaptive':        { accent: '#8E7AA8', accentBg: '#E8E1F0', label: 'Adaptive' },
};

export const TOPIC_THEMES: Record<TopicSlug, Theme> = {
  'communication':  { accent: '#6F8AA8', accentBg: '#E2EAF2', label: 'Communication' },
  'tryouts':        { accent: '#A66A8E', accentBg: '#EFE0E8', label: 'Tryouts and teams' },
  'game-day':       { accent: '#C5713D', accentBg: '#F2E2D5', label: 'Game day' },
  'the-hard-stuff': { accent: '#8E7AA8', accentBg: '#E8E1F0', label: 'The hard moments' },
  'season-ops':     { accent: '#5C7459', accentBg: '#E3EAE2', label: 'Season operations' },
  'equipment':      { accent: '#9E7B4E', accentBg: '#EFE3D2', label: 'Equipment' },
  'rec-vs-travel':  { accent: '#7C9E94', accentBg: '#E5EFEB', label: 'Rec vs travel' },
  'rules-of-play':  { accent: '#6B7B6F', accentBg: '#E8ECE8', label: 'Rules of play' },
  'summer-camps':   { accent: '#7C9E5E', accentBg: '#E8EFE0', label: 'Summer camps' },
};

const DEFAULT_THEME: Theme = { accent: '#C5713D', accentBg: '#F2E2D5' };

export function themeFor(slug: string | undefined | null): Theme {
  if (!slug) return DEFAULT_THEME;
  return SECTION_THEMES[slug] ?? (TOPIC_THEMES as Record<string, Theme>)[slug] ?? DEFAULT_THEME;
}
