// Single source of truth for "is this content live yet?"
//
// A piece is live when it isn't a draft AND its publishedAt is in the past.
// To queue a post, set publishedAt to a future date in the frontmatter.
// The next site rebuild after that date publishes it.
//
// WARNING, corrected 2026-07-28: this comment used to claim "the Cloudflare
// Worker in worker-cron/ rebuilds the site daily so the queue drains on its own
// without anyone having to push a button." That is FALSE. The Pages deploy hook
// that did the daily rebuild was removed in the Pages-to-Workers cutover and
// nothing replaced it (see worker-cron/src/index.ts, which now only fires the
// camps sweep). Nothing rebuilds this site on a schedule.
//
// So future-dating is a FILTER, not a SCHEDULER. It means "not before this
// date", not "on this date". A build only runs on a deploy, and a deploy only
// happens when a human merges to main and approves the protected production
// environment. A post dated for next Friday appears whenever the next build
// after next Friday happens, which could be never.
//
// See QUEUE.md at the project root for the operator manual, and
// scripts/check-publish-queue-drift.mjs to find content that is eligible
// locally but missing from the live site.

type LiveCheckable = {
  draft?: boolean;
  publishedAt: Date;
};

export function isLive(data: LiveCheckable, now: Date = new Date()): boolean {
  if (data.draft) return false;
  return data.publishedAt.getTime() <= now.getTime();
}

// Effective freshness date for sorting + card display.
// Falls back to publishedAt when no editorial review date exists, and ignores
// future review dates (the queue can't promote tomorrow's work today).
type FreshCheckable = {
  publishedAt: Date;
  editorial?: {
    jeffReviewedAt?: Date;
    claudeReviewedAt?: Date;
  };
};

export function freshnessDate(data: FreshCheckable, now: Date = new Date()): Date {
  const reviewed = data.editorial?.jeffReviewedAt ?? data.editorial?.claudeReviewedAt;
  if (!reviewed) return data.publishedAt;
  const r = reviewed instanceof Date ? reviewed : new Date(reviewed);
  if (r.getTime() > now.getTime()) return data.publishedAt;
  return r.getTime() > data.publishedAt.getTime() ? r : data.publishedAt;
}

// True when the displayed date should read "Updated" instead of the original publish date.
export function wasUpdated(data: FreshCheckable, now: Date = new Date()): boolean {
  const fresh = freshnessDate(data, now);
  return fresh.getTime() !== data.publishedAt.getTime();
}
