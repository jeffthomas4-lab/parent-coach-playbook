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
