// Single source of truth for nav, footer, and brand metadata.
// Update here, the change propagates everywhere.

export const SITE = {
  name: 'The Parent-Coach Playbook',
  imprint: 'Field & Forge Press',
  tagline: 'The drive home is the real game.',
  url: 'https://parentcoachplaybook.com',
  description:
    'Editorial reporting and field notes for parents who coach their own kid. Pre-game, in-game, and the conversation that matters most: the drive home.',
  founder: 'Jeff Thomas',
  twitter: '',
  email: 'editors@parentcoachplaybook.com',
};

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
