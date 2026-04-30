// Single source of truth for nav, footer, and brand metadata.
// Update here, the change propagates everywhere.

export const SITE = {
  name: 'The Parent-Coach Playbook',
  tagline: 'The drive home is the real game.',
  shortPitch: 'Sideline notes from parents who coach, organize, drive, and supervise the snack rotation. Mostly short reads. Sometimes longer ones.',
  url: 'https://parentcoachplaybook.com',
  description:
    'Sideline notes for parents who are deep in their kid\'s youth sports, theater, band, or whatever else is on the schedule this week. Short, honest, occasionally funny.',
  founder: 'Jeff Thomas',
  twitter: '',
  email: 'parentcoachplaybook@gmail.com',
};

// Contributors. Maren and Dan are composite voices drawn from interviews with
// parent-coaches in the network. Jeff writes under his real name on cornerstones.
// Disclosure lives on the About page.
export const CONTRIBUTORS = {
  'maren-bell': {
    slug: 'maren-bell',
    name: 'Maren Bell',
    role: 'Lead writer',
    short: 'Mom of two. Ex-college lacrosse. Writes most things here.',
    bio: 'Maren is a mom of two — a 9-year-old soccer kid and a 13-year-old who plays viola and basketball. She played lacrosse at Bates, taught middle-school English for six years, and has been a team mom, snack parent, assistant coach, and the parent who texts everyone the field change. She writes most posts on this site. She drinks too much coffee and does not yell from the sidelines.',
    accent: '#C5713D', // terracotta
    accentBg: '#F2E2D5',
    avatarLetter: 'M',
  },
  'dan-kowalski': {
    slug: 'dan-kowalski',
    name: 'Dan Kowalski',
    role: 'Contributor',
    short: 'Dad of three. Has coached his twins\' baseball for five seasons. Writes a couple of times a month.',
    bio: 'Dan is a dad of three: twin 11-year-olds (one in baseball, one in theater) and a 7-year-old soccer kid. He works in software and has coached his twins\' tee-ball, coach-pitch, and little league for five years running. He writes here when he has been thinking about something long enough to be useful. Mostly that means he is thinking about coaching his own kid in front of the team.',
    accent: '#5C7459', // deeper sage
    accentBg: '#EAEFE7',
    avatarLetter: 'D',
  },
  'jeff-thomas': {
    slug: 'jeff-thomas',
    name: 'Jeff Thomas',
    role: 'Founder',
    short: 'College football coach. Dad of two. Started this site.',
    bio: 'Jeff is the head football coach at the University of Puget Sound, a former interim athletic director, and a parent who watched two kids move through eight sports, two theater productions, and an orchestra. He started The Parent-Coach Playbook because most of what he learned about coaching kids he learned from being one of two parents in a minivan. He writes occasional cornerstone pieces here.',
    accent: '#B0894A', // honey deeper
    accentBg: '#F5E9D2',
    avatarLetter: 'JT',
  },
} as const;

export type ContributorSlug = keyof typeof CONTRIBUTORS;

export const NAV = [
  { label: 'The Drive There', href: '/drive-there/', eyebrow: '01' },
  { label: 'The Game', href: '/game/', eyebrow: '02' },
  { label: 'The Drive Home', href: '/drive-home/', eyebrow: '03' },
  { label: 'Gear', href: '/gear/' },
  { label: 'Newsletter', href: '/newsletter/' },
];

export const UTILITY_NAV = [
  { label: 'Resources', href: '/resources/' },
  { label: 'About', href: '/about/' },
];

export const PILLARS = {
  'drive-there': {
    slug: 'drive-there',
    label: 'The Drive There',
    eyebrow: '01 / Pre-game',
    accent: '#8FA68C',         // sage — calm, prep, morning
    accentBg: '#EAEFE7',
    blurb:
      'Pre-game preparation, mindset, and the conversation on the way to practice. The work that gets done before anyone steps on the field.',
  },
  game: {
    slug: 'game',
    label: 'The Game',
    eyebrow: '02 / In the moment',
    accent: '#C5713D',         // terracotta — action, focus
    accentBg: '#F2E2D5',
    blurb:
      'Coaching execution, in-the-moment decisions, and the strange job of coaching your own kid in front of the team.',
  },
  'drive-home': {
    slug: 'drive-home',
    label: 'The Drive Home',
    eyebrow: '03 / Post-game',
    accent: '#D4AB6A',         // honey — warmth, return, dinner table
    accentBg: '#F5E9D2',
    blurb:
      'The post-game conversation, the car ride, the dinner table. The relationship aftermath, which is the real game.',
  },
} as const;

export const SPORTS = [
  { slug: 'baseball', label: 'Baseball' },
  { slug: 'softball', label: 'Softball' },
  { slug: 'soccer', label: 'Soccer' },
  { slug: 'basketball', label: 'Basketball' },
  { slug: 'football', label: 'Football' },
  { slug: 'hockey', label: 'Hockey' },
  { slug: 'lacrosse', label: 'Lacrosse' },
  { slug: 'volleyball', label: 'Volleyball' },
] as const;

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
