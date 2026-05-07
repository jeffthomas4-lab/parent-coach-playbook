// Single source of truth for nav, footer, and brand metadata.
// Update here, the change propagates everywhere.

export const SITE = {
  name: 'Parent Coach Playbook',
  tagline: 'Sideline notes for parents in the middle of it.',
  shortPitch: 'Sideline notes from the editorial desk for parents who coach, organize, drive, and supervise the snack rotation.',
  url: 'https://parentcoachplaybook.com',
  description:
    'Sideline notes for parents who are deep in their kid\'s youth sports, theater, band, or whatever else is on the schedule this week. Short, honest, occasionally funny.',
  byline: 'Parent Coach Playbook Editorial',
  bylineShort: 'PCP Editorial',
  email: 'parentcoachplaybook@gmail.com',
};

// Single editorial voice. Used for byline rendering on cards, articles, and feeds.
// The site is intentionally anonymous. The byline is the team, not any one person.
export const EDITORIAL = {
  byline: 'Parent Coach Playbook Editorial',
  short: 'PCP Editorial',
  // Mark color used wherever a small accent dot or pill renders.
  accent: '#C5713D',
  accentBg: '#F2E2D5',
};

// Primary nav: 5 items + search button. Scripts fold into Reads (linked from
// the Reads landing). Camps and Team Parent fold into Tools and Reads
// respectively. Search promoted from utility nav into the main bar.
export const NAV = [
  { label: 'Start here', href: '/start-here/' },
  { label: 'Reads', href: '/reads/' },
  { label: 'Camps', href: '/camps/' },
  { label: 'Drills', href: '/coaching-tips/' },
  { label: 'What to Buy', href: '/what-to-buy/', hasDropdown: 'buying-guides' },
  { label: 'Tools', href: '/tools/', hasDropdown: 'tools' },
];

// Items inside the Tools nav dropdown. Six items, organized by what parents are doing.
// Body and Mental Skills consolidated under "Body and mind" (linked sub-pages from the
// Body hub). Adaptive, Recruiting, Rules, Camps, Governing bodies still live but moved
// to footer or accessed via Tools landing page. Decisions and Scripts live in /reads/ flow.
export const TOOLS_NAV = [
  { slug: 'cost-calculator',  label: 'Cost calculator',   href: '/cost-calculator/',  blurb: 'Real annual cost of any sport. Pre-filled, edit any line, share the result.' },
  { slug: 'sports',           label: 'By sport',          href: '/sports/',           blurb: 'Every read, drill, calendar, and tool grouped by sport. The fastest entry point.' },
  { slug: 'season-calendar',  label: 'Season calendar',   href: '/season-calendar/',  blurb: 'Twelve months by sport and level. Tryouts, peaks, off-season.' },
  { slug: 'pathways',         label: 'Age pathways',      href: '/pathways/',         blurb: 'What "good" looks like at 7, 10, 13, 15, by sport.' },
  { slug: 'body',             label: 'Body and mind',     href: '/body/',             blurb: 'Concussion, arm care, sleep, mental skills. What to know, what to ask the doc.' },
  { slug: 'pendulum',         label: 'The pendulum',      href: '/youth-sports-pendulum/', blurb: 'Where is your family on the fun-to-performance spectrum right now?' },
  { slug: 'recruiting',       label: 'Recruiting',        href: '/recruiting/',       blurb: 'College recruiting honestly, by sport and level. What parents actually need to know.' },
] as const;

export type ToolsNavSlug = (typeof TOOLS_NAV)[number]['slug'];

// Utility nav: Newsletter and About sit on the right side of the header bar.
// Search has been promoted into the main nav as an icon button (handled in
// NavBar.astro), so it's no longer a utility item.
export const UTILITY_NAV = [
  { label: 'Newsletter', href: '/newsletter/' },
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
  { slug: 'baseball',     label: 'Baseball' },
  { slug: 'softball',     label: 'Softball' },
  { slug: 'soccer',       label: 'Soccer' },
  { slug: 'basketball',   label: 'Basketball' },
  // Football variants. Three lanes that group together alphabetically as "Football — *".
  // Slugs preserved for URL backwards compatibility. Display labels group them visually.
  { slug: 'flag-football', label: 'Football — Flag' },
  { slug: 'football-7v7',  label: 'Football — 7v7' },
  { slug: 'football',      label: 'Football — Tackle' },
  { slug: 'hockey',       label: 'Hockey' },
  { slug: 'lacrosse-boys',  label: 'Lacrosse — Boys' },
  { slug: 'lacrosse-girls', label: 'Lacrosse — Girls' },
  { slug: 'volleyball',   label: 'Volleyball' },
  { slug: 'swimming',     label: 'Swimming' },
  { slug: 'track-field',  label: 'Track and field' },
  { slug: 'cross-country',label: 'Cross country' },
  { slug: 'tennis',       label: 'Tennis' },
  { slug: 'golf',         label: 'Golf' },
  { slug: 'crew',         label: 'Crew' },
  { slug: 'martial-arts', label: 'Martial arts' },
  { slug: 'gymnastics',   label: 'Gymnastics' },
  { slug: 'cheer',        label: 'Cheerleading' },
  { slug: 'stunt',        label: 'Stunt and tumbling' },
  { slug: 'theater',      label: 'Theater' },
  { slug: 'band',         label: 'Band' },
  { slug: 'choir',        label: 'Choir' },
  { slug: 'dance',        label: 'Dance' },
  { slug: 'ballet',       label: 'Ballet' },
] as const;

// Camp-specific sport options. Camps cover programs that don't fit the canonical SPORTS list:
// traditional day camps, outdoor adventure, STEM/coding, art camps, plus a few real sports
// (wrestling, rugby, etc.) that aren't part of the rest of the site.
//
// CAMP_SPORTS = SPORTS + the camp-only slugs below, sorted by label.
// Both /camps/ and /camps/submit/ should consume CAMP_SPORTS so the filter dropdown and
// the submit form stay in sync.
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

// What to Buy guides. Each one resolves to /what-to-buy/[slug]/ and renders the markdown
// from src/content/guides/[slug].md. Each sport guide also gets a sizing companion at
// /what-to-buy/[slug]/sizing/.
//
// `group` separates field/team sports from individual sports for navigation grouping.
// Don't rely on alphabetical position. Football used to land in "Individual" because
// of slice math. The group field is the source of truth for nav grouping.
export const BUYING_GUIDES = [
  // Field & team sports (alphabetical)
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
  // Individual sports (alphabetical)
  { slug: 'crew',          label: 'Crew',             category: 'sport',    group: 'individual', blurb: 'Most gear is club-provided. What you actually buy: a few specific things.' },
  { slug: 'cross-country', label: 'Cross country',    category: 'sport',    group: 'individual', blurb: 'Trainers, racing flats, layered cold-weather kit.' },
  { slug: 'golf',          label: 'Golf',             category: 'sport',    group: 'individual', blurb: 'A starter set, gloves, balls. Used clubs are fine.' },
  { slug: 'gymnastics',    label: 'Gymnastics',       category: 'sport',    group: 'individual', blurb: 'Leotards, grips, tape. Most apparatus stays at the gym.' },
  { slug: 'martial-arts',  label: 'Martial arts',     category: 'sport',    group: 'individual', blurb: 'Gi, belt, mouthguard. Discipline differs by style.' },
  { slug: 'swimming',      label: 'Swimming',         category: 'sport',    group: 'individual', blurb: 'Suit, cap, goggles. The cheapest sport on the list.' },
  { slug: 'tennis',        label: 'Tennis',           category: 'sport',    group: 'individual', blurb: 'Racket, shoes, balls. Stringing matters more than you think.' },
  { slug: 'track-field',   label: 'Track and field',  category: 'sport',    group: 'individual', blurb: 'Spikes by event. Sprints, distance, hurdles, jumps, throws.' },
  // Performing arts (alphabetical)
  { slug: 'ballet',        label: 'Ballet',           category: 'activity', blurb: 'Slippers, leotard, tights. Pointe later, on the teacher\'s timeline.' },
  { slug: 'band',          label: 'Band',             category: 'activity', blurb: 'Instrument, reeds, accessories. Rent before you buy.' },
  { slug: 'cheer',         label: 'Cheerleading',     category: 'activity', blurb: 'Shoes, bow, practice clothes. Competition uniforms via the team.' },
  { slug: 'choir',         label: 'Choir',            category: 'activity', blurb: 'Almost no equipment. The list is short and cheap.' },
  { slug: 'dance',         label: 'Dance',            category: 'activity', blurb: 'Shoes, leotards, tights, recital costumes. Style-specific.' },
  { slug: 'stunt',         label: 'Stunt and tumbling', category: 'activity', blurb: 'Mat shoes, bracing, athletic tape. The tumbling-track essentials.' },
  { slug: 'theater',       label: 'Theater',          category: 'activity', blurb: 'School plays, community theater. Mostly time, less equipment.' },
  // Essentials (alphabetical)
  { slug: 'first-aid-kit',      label: 'First aid kit',       category: 'essentials', blurb: 'Bandages, tape, cold packs, and what you use on the sideline every week.' },
  { slug: 'season-essentials',  label: 'Season essentials',    category: 'essentials', blurb: 'Recovery, hydration, travel logistics. The kit that runs the season.' },
  { slug: 'sideline-kit',       label: 'Sideline kit',         category: 'essentials', blurb: 'Chair, cooler, blanket. The gear that makes watching comfortable.' },
] as const;

export type BuyingGuideSlug = (typeof BUYING_GUIDES)[number]['slug'];

// Team Parent article topics: resources for managing team logistics, communication, conflict.
// Separate from TOPICS (which is for Reads articles). Used for /team-parent/[topic] archive pages.
export const TEAM_PARENT_TOPICS = [
  { slug: 'logistics',        label: 'Logistics',         blurb: 'Snacks, carpools, calendar management. The operational stuff.' },
  { slug: 'communication',    label: 'Communication',     blurb: 'Emails to coaches, group chat rules, the hard-parent conversation.' },
  { slug: 'money',            label: 'Money',             blurb: 'Fundraising, registration costs, the money talk with your kid.' },
  { slug: 'picture-day',      label: 'Picture day & events', blurb: 'Photos, banquets, end-of-season celebrations.' },
  { slug: 'conflict',         label: 'Conflict resolution', blurb: 'When things go sideways. Parent to parent, parent to coach.' },
  { slug: 'tools',            label: 'Tools & templates', blurb: 'Apps, spreadsheets, checklists. What actually works.' },
] as const;

export type TeamParentTopicSlug = (typeof TEAM_PARENT_TOPICS)[number]['slug'];

// Track and field events get sub-pages at /what-to-buy/track-field/[event]/
export const TRACK_EVENTS = [
  { slug: 'sprints',   label: 'Sprints',           blurb: '100m, 200m, 400m. Sprint spikes, blocks if your team uses them.' },
  { slug: 'distance',  label: 'Distance',          blurb: '800m, 1500m, mile, 3200m. Trainers and a pair of racing flats.' },
  { slug: 'hurdles',   label: 'Hurdles',           blurb: 'Sprint spike with a slightly longer pin set, drill bands.' },
  { slug: 'jumps',     label: 'Jumps',             blurb: 'Long, triple, high. Jump spikes, takeoff tape, a measuring tape.' },
  { slug: 'throws',    label: 'Throws and javelin',blurb: 'Shot, discus, javelin. Footwear, a thrower\'s shoe, towel, chalk.' },
] as const;

export type TrackEventSlug = (typeof TRACK_EVENTS)[number]['slug'];

// Team Parent toolkit: practical resources organized by category.
// Each category becomes a section on /team-parent/.
// Individual resources live in src/content/resources/[slug].md.
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

// ----------------------------------------------------------------------------
// Theme registry. One source of truth for the per-section accent colors that
// drive tag pills, hero tints, and topic chips. Keyed by URL section slug or
// the article `topic` enum so any component can call themeFor(slug) and get
// a consistent {accent, accentBg} pair without re-deriving it locally.
// ----------------------------------------------------------------------------

export interface Theme {
  accent: string;     // foreground / border / text accent
  accentBg: string;   // soft tinted background
  label?: string;     // human label for tag pills
}

// Section themes keyed by top-level URL segment. Mirror the PILLARS palette
// for the three drives so existing pillar pages keep their look. Other
// sections get their own color so /body/ doesn't look like /recruiting/.
export const SECTION_THEMES: Record<string, Theme> = {
  // The three drives (phase taxonomy)
  'drive-there':     { accent: '#8FA68C', accentBg: '#EAEFE7', label: 'Before the game' },
  'game':            { accent: '#C5713D', accentBg: '#F2E2D5', label: 'In the game' },
  'drive-home':      { accent: '#D4AB6A', accentBg: '#F5E9D2', label: 'After the game' },
  // Topic landing pages
  'body':            { accent: '#7C9E94', accentBg: '#E5EFEB', label: 'Body and mind' },
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
  'tools':           { accent: '#5C7459', accentBg: '#E3EAE2', label: 'Tools' },
  'what-to-buy':     { accent: '#C5713D', accentBg: '#F2E2D5', label: 'What to buy' },
  'sports':          { accent: '#2D2520', accentBg: '#F2EAD9', label: 'By sport' },
  'camps':           { accent: '#7C9E5E', accentBg: '#E8EFE0', label: 'Summer camps' },
  'cost-calculator': { accent: '#9C7A4A', accentBg: '#F0E5D2', label: 'Cost calculator' },
  'adaptive':        { accent: '#8E7AA8', accentBg: '#E8E1F0', label: 'Adaptive' },
};

// Topic themes keyed by the article `topic` enum. Lets ArticleCard tint a
// topic chip even when the section landing page lives under a different URL.
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

// Default theme for anything outside the registry.
const DEFAULT_THEME: Theme = { accent: '#C5713D', accentBg: '#F2E2D5' };

// Look up a theme by section slug or topic slug. Falls back to the editorial
// rust accent if nothing matches, so callers never need null checks.
export function themeFor(slug: string | undefined | null): Theme {
  if (!slug) return DEFAULT_THEME;
  return SECTION_THEMES[slug] ?? (TOPIC_THEMES as Record<string, Theme>)[slug] ?? DEFAULT_THEME;
}
