// SportsGravy fingerprint definition.
//
// Research method (2026-08-06): curl (raw HTML + response headers, not a
// rendered/summarized fetch) against sportsgravy.com, app.sportsgravy.com
// and demo.sportsgravy.com — SportsGravy's own marketing site, product
// login SPA, and demo-booking site. Every pattern's `note` states exactly
// what was observed and when. No real customer (a third-party youth sports
// org actually running SportsGravy) could be located to crawl directly —
// the product appears to be early-stage — so several patterns are
// necessarily structural guesses about how a customer page would look,
// marked "UNVERIFIED:" in the note and kept at weight <= 15 per the brief.
//
// Two things worth flagging for whoever reconciles this against real
// traffic data later:
//  1. sportsgravy.com's own marketing/demo pages are built on "Lovable"
//     (<meta name="author" content="Lovable">), a generic third-party AI
//     site builder used by countless unrelated companies. That tag is
//     deliberately NOT used as a positive signal here — it would false-
//     positive on every other Lovable-built site on the internet.
//  2. SportsGravy's own copy says registration/inquiry forms are "native
//     to the page, not an iframe" — so this definition does not assume a
//     customer page embeds an iframe or widget script pointing back at
//     sportsgravy.com for registration. That assumption would likely be
//     wrong and was deliberately avoided.

import type { CompetitorDefinition } from '../fingerprints';

export const sportsGravy: CompetitorDefinition = {
  id: 'sportsgravy',
  displayName: 'SportsGravy',
  canonicalDomain: 'sportsgravy.com',
  category: 'club_management',
  migrationDifficulty: 'medium',
  patterns: [
    {
      id: 'sportsgravy.link.app-portal',
      type: 'link_href',
      category: 'club_management',
      match: { kind: 'substring', value: 'app.sportsgravy.com' },
      weight: 45,
      note:
        'Verified 2026-08-06 via curl: app.sportsgravy.com is SportsGravy\'s real multi-tenant product ' +
        'SPA — distinct from the sportsgravy.com marketing site (separate GTM container GTM-KXW239NW, ' +
        'served from AmazonS3/CloudFront, bundle assets named /assets/SGLogo-<hash>.svg and ' +
        '/assets/index-<hash>.js). Observed as the literal "Sign in" href in sportsgravy.com\'s own nav. ' +
        'The link\'s destination on a third-party customer page is inferred, not directly confirmed on a ' +
        'live customer site: SportsGravy ships one shared login SPA for every tenant rather than a ' +
        'per-org subdomain, so an org\'s own "Parent/Coach Portal" or "Sign in" link plausibly points here.',
    },
    {
      id: 'sportsgravy.link.appstore-ios',
      type: 'link_href',
      category: 'club_management',
      match: { kind: 'substring', value: 'apps.apple.com/us/app/sportsgravy/id1509169282' },
      weight: 55,
      note:
        'Verified 2026-08-06 via curl on both sportsgravy.com and demo.sportsgravy.com: exact App Store ' +
        'listing id for the SportsGravy consumer app. SportsGravy ships one shared parent/coach/athlete ' +
        'app across every customer org rather than white-labeled per-org apps, so a "Download our app" ' +
        'link on an org\'s own site pointing at this exact numeric app id is near impossible to hit by ' +
        'coincidence — an unrelated org has no reason to link this specific id.',
    },
    {
      id: 'sportsgravy.link.playstore-android',
      type: 'link_href',
      category: 'club_management',
      match: { kind: 'substring', value: 'play.google.com/store/apps/details?id=com.sportsgravy' },
      weight: 55,
      note:
        'Verified 2026-08-06 via curl: same reasoning as the App Store pattern above — ' +
        'com.sportsgravy is SportsGravy\'s one shared Android package id across every customer org.',
    },
    {
      id: 'sportsgravy.html.powered-by',
      type: 'html_text',
      category: 'website',
      match: { kind: 'regex', value: 'powered\\s+by\\s+sportsgravy', flags: 'i' },
      weight: 15,
      note:
        'UNVERIFIED: no live SportsGravy customer page could be found to confirm real footer wording. ' +
        'sportsgravy.com\'s own site carries no "Powered by" badge of its own (it is self-built on ' +
        'Lovable, not on SportsGravy\'s own club-website product). Included at low weight because a ' +
        '"Powered by <platform>" footer badge is the conventional attribution pattern for this class of ' +
        'website builder (TeamSnap, SportsEngine, Wix and others all do it) — a reasonable structural ' +
        'guess, not observed evidence.',
    },
    {
      id: 'sportsgravy.meta.generator',
      type: 'meta',
      category: 'website',
      match: { kind: 'substring', value: 'sportsgravy' },
      weight: 10,
      note:
        'UNVERIFIED: guessing SportsGravy\'s club-website builder may emit ' +
        '<meta name="generator" content="SportsGravy"> on generated customer sites, mirroring the common ' +
        'CMS convention (WordPress, Wix, Squarespace all self-identify this way). Not confirmed against a ' +
        'live customer page — sportsgravy.com\'s own marketing pages instead emit ' +
        '<meta name="author" content="Lovable">, which is exactly why that tag is not used as a positive ' +
        'signal here (Lovable is a generic third-party builder used by unrelated sites everywhere).',
    },
    {
      id: 'sportsgravy.script.asset-domain',
      type: 'script_src',
      category: 'website',
      match: { kind: 'substring', value: 'sportsgravy.com' },
      weight: 15,
      note:
        'UNVERIFIED: no live customer page found to confirm whether the website builder loads a shared ' +
        'JS bundle from a sportsgravy.com-owned host on customer-owned domains. Kept as a low-weight ' +
        'structural guess: the product is pitched as keeping "rosters and schedules fresh on its own" ' +
        'and pulling "live platform components" onto the page, which usually implies a live script, not ' +
        'static HTML — but this was not observed directly.',
    },
    {
      id: 'sportsgravy.html.brand-mention',
      type: 'html_text',
      category: 'website',
      match: { kind: 'substring', value: 'sportsgravy' },
      weight: 12,
      note:
        'Verified 2026-08-06: "sportsgravy" (case-insensitive) is the exact brand spelling used ' +
        'throughout sportsgravy.com\'s own markup. Deliberately weak: a bare brand mention shows up in ' +
        'blog posts, "alternatives to" articles and comparison copy about as often as on an actual ' +
        'customer page, so on its own it should never be enough to call a detection. Paired with the ' +
        'sportsgravy.neg.editorial-mention negative pattern below, which knocks a bare mention back to ' +
        'zero when the surrounding copy reads like an article about SportsGravy rather than a site ' +
        'running it.',
    },
  ],
  negativePatterns: [
    {
      id: 'sportsgravy.neg.self-property',
      type: 'url_pattern',
      category: 'website',
      match: { kind: 'regex', value: '^https?:\\/\\/([a-z0-9-]+\\.)?sportsgravy\\.com', flags: 'i' },
      weight: 80,
      note:
        'Verified 2026-08-06 via curl: sportsgravy.com, app.sportsgravy.com and demo.sportsgravy.com are ' +
        'SportsGravy\'s own properties (marketing site, product login SPA, and demo-booking site, ' +
        'respectively). Without this, crawling SportsGravy\'s own domains would self-report as a ' +
        'SportsGravy customer, which is nonsensical — high weight so it fully suppresses any positive ' +
        'hits whenever the crawled page is on a sportsgravy.com host.',
    },
    {
      id: 'sportsgravy.neg.editorial-mention',
      type: 'html_text',
      category: 'website',
      match: {
        kind: 'regex',
        value: '(sportsgravy\\s+(alternative|review|vs\\.?|competitor|comparison)|(alternative|review|comparison)\\s+to\\s+sportsgravy|compar(e|ing)\\s+sportsgravy)',
        flags: 'i',
      },
      weight: 20,
      note:
        'UNVERIFIED as an exhaustive phrase list — a structural guess at common comparison/review-article ' +
        'phrasing ("SportsGravy alternative", "SportsGravy review", "compare SportsGravy"), the class the ' +
        'brief calls out explicitly: a page that mentions SportsGravy only inside a news article, ' +
        'comparison, or blog post is not a customer. Weighted above sportsgravy.html.brand-mention (12) ' +
        'on purpose, so a bare mention inside obvious comparison copy nets to zero instead of a false ' +
        'positive.',
    },
  ],
};
