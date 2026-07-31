// Camp card HTML renderer, shared by the server and the browser.
//
// src/pages/camps/index.astro calls this in its frontmatter to render the
// first window of cards for SSR/SEO/no-JS. The same page's client-side
// filter script imports the same functions to render more cards as the user
// filters or clicks "Show more." Both sides must produce byte-identical
// markup from the same camp fields, or a card built on the server and a
// card built in the browser will disagree mid-list and show up as a visible
// style break. Do not fork this logic per side.
//
// Pulled out of camps/index.astro on 2026-07-31 (Pillar 14 fix, open item
// #74): the page used to render all matching cards into the DOM up front so
// the client filter's querySelectorAll('.camp-card') + display:none toggle
// had something to hide. That meant every camp in the directory shipped as
// HTML on every visit. This module is the piece that lets the server render
// a bounded first window and the client render the rest on demand instead.

import {
  campFreshnessLabel,
  campVerificationFreshness,
  formatDateAdded,
  isRecentlyAdded,
} from './camp-freshness';

// How many days old date_added can be and still earn the "New" pill. Owned
// here (not camps/index.astro) because both the server card renderer and the
// client card renderer need the exact same cutoff.
export const RECENTLY_ADDED_WINDOW_DAYS = 30;

export interface SportOption {
  slug: string;
  label: string;
}

// The fields a card actually renders. A superset (the full D1 Camp row on
// the server, or the campsLite record on the client) satisfies this by
// structural typing — neither side needs to narrow its data first.
export interface CardCamp {
  id: string;
  name: string;
  slug: string;
  sport: string;
  age_min: number;
  age_max: number;
  age_known: 0 | 1;
  start_date: string | null;
  end_date: string | null;
  city: string;
  state: string;
  day_or_overnight: string;
  spots_status: string;
  verified: 0 | 1;
  last_verified_at: string | null;
  program_type: string | null;
  hero_photo_key: string | null;
  price_text: string | null;
  date_added: string | null;
}

export const escHtml = (s: unknown): string =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Parse YYYY-MM-DD as a local date (not UTC), so new Date('2026-08-03')
// never renders as Aug 2 in Pacific time.
function fmtDatePart(s: string | null | undefined): { m: number; d: number; y: number } | null {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d || !MONTHS[m - 1]) return null;
  return { m, d, y };
}

export function fmtDateRange(start: string | null | undefined, end: string | null | undefined): string {
  const a = fmtDatePart(start);
  const b = fmtDatePart(end);
  if (a && b) {
    if (a.m === b.m && a.y === b.y) return `${MONTHS[a.m - 1]} ${a.d}–${b.d}, ${a.y}`;
    return `${MONTHS[a.m - 1]} ${a.d} – ${MONTHS[b.m - 1]} ${b.d}, ${b.y}`;
  }
  if (a) return `Starts ${MONTHS[a.m - 1]} ${a.d}, ${a.y}`;
  if (b) return `Through ${MONTHS[b.m - 1]} ${b.d}, ${b.y}`;
  return 'Dates to be announced';
}

export function sportLabel(slug: string, sportsList: SportOption[]): string {
  const match = sportsList.find((s) => s.slug === slug);
  if (match) return match.label;
  return slug
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const ageLabel = (c: CardCamp) => (c.age_known === 1 ? `ages ${c.age_min}–${c.age_max}` : 'ages not provided');

const verificationLabel = (c: CardCamp) =>
  campFreshnessLabel(campVerificationFreshness(c.verified, c.last_verified_at));

const newPillHtml = (c: CardCamp): string =>
  isRecentlyAdded(c.date_added, RECENTLY_ADDED_WINDOW_DAYS)
    ? `<span class="tag-pill" style="--pill-bg: var(--stripe); --pill-accent: var(--navy);">New</span>`
    : '';

function photoHtml(c: CardCamp): string {
  if (!c.hero_photo_key) return '';
  // camp-card-photo: a hook, not a style. Pillar 14 QA (2026-07-31) found the
  // 16:9 photo is the single largest per-card height contributor at 390px
  // (~179px + margin) and doesn't earn that height on a phone-width first
  // paint. The global stylesheet hides elements with this class below the
  // md breakpoint; nothing here changes on desktop/tablet.
  return `<div class="camp-card-photo mb-3 border border-bone overflow-hidden bg-paper-warm" style="aspect-ratio: 16/9;"><img src="https://parentcoachdesk.com/camp-photos/${escHtml(c.hero_photo_key)}" alt="${escHtml(c.name)}" class="w-full h-full object-cover" loading="lazy" decoding="async" width="800" height="450" /></div>`;
}

function verifiedHtml(c: CardCamp): string {
  if (c.verified !== 1) return '';
  return `<a href="/camps/verification/" class="font-display text-rust text-xs font-medium hover:underline" style="white-space: nowrap" aria-label="Verified listing, ${escHtml(verificationLabel(c))}; read the verification methodology">Verified ✓ · ${escHtml(verificationLabel(c))}</a>`;
}

function priceHtml(c: CardCamp): string {
  if (!c.price_text) return '';
  return `<p class="font-display italic text-rust text-xs mt-2 font-medium">Listed price: ${escHtml(c.price_text)} · confirm with provider</p>`;
}

function addedLineHtml(c: CardCamp): string {
  const added = formatDateAdded(c.date_added);
  return added ? `<p class="font-body text-muted text-xs mt-2">Added ${escHtml(added)}</p>` : '';
}

/** The standard directory card, used in the PNW grid, the National grid, and the Recently Added rail. */
export function renderCardHtml(c: CardCamp, sportsList: SportOption[]): string {
  const dayLabel = c.day_or_overnight === 'day' ? 'Day camp' : 'Overnight';
  const spotsLabel = c.spots_status === 'open' ? 'Open' : c.spots_status === 'waitlist' ? 'Waitlist' : 'Full';
  return `<div class="camp-card card card-hover hover:shadow-cardHover transition-shadow p-5 group" data-camp-id="${escHtml(c.id)}">${photoHtml(c)}<div class="flex items-start justify-between gap-2 mb-1"><p class="font-display italic text-ink-soft text-xs font-medium">${escHtml(sportLabel(c.sport, sportsList))} · ${escHtml(ageLabel(c))} · ${escHtml(fmtDateRange(c.start_date, c.end_date))}</p><div class="flex items-center gap-2">${newPillHtml(c)}${verifiedHtml(c)}</div></div><a href="/camps/${escHtml(c.slug)}/" class="block"><h3 class="t-card-title font-display text-ink mt-1 leading-tight group-hover:text-rust transition-colors font-medium">${escHtml(c.name)}</h3></a><p class="font-display text-ink-soft text-sm mt-1 leading-snug">${escHtml(c.city)}, ${escHtml(c.state)} · ${dayLabel} · ${spotsLabel}</p>${priceHtml(c)}${addedLineHtml(c)}<a href="/camps/${escHtml(c.slug)}/" class="t-cta inline-block mt-3">View</a></div>`;
}

/** The Featured rail's card: same body, a Featured badge instead of the New pill placement. */
export function renderFeaturedCardHtml(c: CardCamp, sportsList: SportOption[]): string {
  const dayLabel = c.day_or_overnight === 'day' ? 'Day camp' : 'Overnight';
  const spotsLabel = c.spots_status === 'open' ? 'Open' : c.spots_status === 'waitlist' ? 'Waitlist' : 'Full';
  const featuredBadge = `<span class="tag-pill" style="--pill-bg: var(--stripe); --pill-accent: var(--navy);">Featured</span>`;
  return `<div class="camp-card card card-hover hover:shadow-cardHover transition-shadow p-5 group" data-camp-id="${escHtml(c.id)}">${photoHtml(c)}<div class="flex items-start justify-between gap-2 mb-1">${featuredBadge}${newPillHtml(c)}</div><div class="flex items-start justify-between gap-2 mb-1"><p class="font-display italic text-ink-soft text-xs font-medium">${escHtml(sportLabel(c.sport, sportsList))} · ${escHtml(ageLabel(c))} · ${escHtml(fmtDateRange(c.start_date, c.end_date))}</p>${verifiedHtml(c)}</div><a href="/camps/${escHtml(c.slug)}/" class="block"><h3 class="t-card-title font-display text-ink mt-1 leading-tight group-hover:text-rust transition-colors font-medium">${escHtml(c.name)}</h3></a><p class="font-display text-ink-soft text-sm mt-1 leading-snug">${escHtml(c.city)}, ${escHtml(c.state)} · ${dayLabel} · ${spotsLabel}</p>${priceHtml(c)}${addedLineHtml(c)}<a href="/camps/${escHtml(c.slug)}/" class="t-cta inline-block mt-3">View</a></div>`;
}
