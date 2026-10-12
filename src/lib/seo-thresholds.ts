// Directory hub indexing threshold (2026-10-12 indexing fix, Jeff-approved).
// A camps state, city, or city+sport hub with fewer live listings than this
// renders normally but carries <meta name="robots" content="noindex, follow">.
// Google was reporting these near-empty hubs as "Crawled - currently not
// indexed"; noindexing them stops them diluting the site's quality signal
// while still letting crawlers reach the camp pages they link to.
export const THIN_HUB_MIN = 3;
