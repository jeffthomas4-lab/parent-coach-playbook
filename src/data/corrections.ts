// Single source of truth for the public corrections log (/about/corrections/).
//
// WHY THIS FILE EXISTS
// Every time we change a published piece in a way a reader should know about,
// the change has to show up on the corrections page. Keeping the entries in a
// data file (not inline in the page) makes logging a correction a one-object
// edit and keeps the "last updated" date honest — it is derived from the
// newest entry below, never hand-maintained.
//
// HOW TO LOG A CORRECTION
// 1. Make the fix in the piece itself.
// 2. If the change is substantive (see the three categories on the page:
//    factual fix, source replacement, substantive rewrite), prepend a new
//    object to the TOP of `corrections` below. Typos and non-substantive copy
//    edits are NOT logged.
// 3. Add the on-page correction note at the bottom of the piece for anything
//    substantive, then ship. The page re-sorts by date and updates its
//    "Last updated" line automatically.
//
// Newest entries can go anywhere in the array — the page sorts by date — but
// prepending keeps diffs readable.

export type Correction = {
  date: string;   // ISO YYYY-MM-DD — the day the fix shipped
  piece: string;  // Display title of the piece
  url: string;    // Path on site to the corrected piece
  change: string; // What was fixed, in plain language
  reason: string; // Where the correction came from (reader, governing-body update, internal review)
};

export const corrections: Correction[] = [
  // The first batch documents the May 5 audit pass.
  {
    date: '2026-05-05',
    piece: 'The ACL prevention warm-up',
    url: '/body/acl-prevention-warmup/',
    change: 'Replaced a dead Santa Monica Sports Medicine Foundation link with the Gilchrist et al. 2008 PEP study on PubMed Central. The original SMSMF domain had been taken over by an unrelated site after the foundation closed.',
    reason: 'Internal link-health audit.',
  },
  {
    date: '2026-05-05',
    piece: 'AAU Basketball entries (cost calculator and governing-bodies finder)',
    url: '/governing-bodies/',
    change: 'Switched the AAU Basketball link from aaubasketball.org to aau.com/sports/basketball. The old subdomain had started 302-redirecting to a survey-spam site.',
    reason: 'Internal link-health audit.',
  },
  {
    date: '2026-05-05',
    piece: 'CDC HEADS UP references (multiple body topics and the governing-bodies finder)',
    url: '/body/concussion-protocol-basics/',
    change: 'Updated CDC HEADS UP URLs from /headsup/* to /heads-up/. CDC restructured the program domain.',
    reason: 'Internal link-health audit.',
  },
  {
    date: '2026-05-05',
    piece: 'Several recruiting reads (NCAA references)',
    url: '/recruiting/',
    change: 'NCAA reorganized the /sports/yyyy/ knowledge-base structure. Replaced deep-link URLs that 404 with the NCAA Eligibility Center root and the NCAA research page on probability of competing beyond high school.',
    reason: 'Internal link-health audit.',
  },
  {
    date: '2026-05-05',
    piece: 'Adaptive Sports USA reference (governing-bodies finder)',
    url: '/governing-bodies/',
    change: 'Replaced a dead adaptivesportsusa.org link with Move United, which is the active national adaptive-sports network.',
    reason: 'Internal link-health audit.',
  },
];

// Corrections sorted newest-first, for display.
export const correctionsSorted: Correction[] = [...corrections].sort((a, b) =>
  b.date.localeCompare(a.date),
);

// ISO date of the most recent correction, or null when the log is empty.
export const lastCorrectionISO: string | null = correctionsSorted[0]?.date ?? null;
