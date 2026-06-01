// Single source of truth for "is this content live yet?"
//
// A piece is live when it isn't a draft AND its publishedAt is in the past.
// To queue a post, set publishedAt to a future date in the frontmatter.
// The next site rebuild after that date publishes it.
//
// The Cloudflare Worker in worker-cron/ rebuilds the site daily so the queue
// drains on its own without anyone having to push a button.
//
// See QUEUE.md at the project root for the operator manual.

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
