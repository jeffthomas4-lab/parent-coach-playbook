import { describe, expect, it } from 'vitest';
import { freshnessDate, isLive, wasUpdated } from '../src/lib/publishFilter';

const now = new Date('2026-07-16T12:00:00.000Z');
const publishedAt = new Date('2026-07-01T12:00:00.000Z');

describe('publish filtering', () => {
  it('keeps drafts and future-dated content offline', () => {
    expect(isLive({ draft: true, publishedAt }, now)).toBe(false);
    expect(isLive({ publishedAt: new Date('2026-07-17T00:00:00.000Z') }, now)).toBe(false);
  });

  it('publishes non-drafts at the exact scheduled instant', () => {
    expect(isLive({ draft: false, publishedAt: now }, now)).toBe(true);
  });

  it('falls back to publication when no review exists or the review is in the future', () => {
    expect(freshnessDate({ publishedAt }, now)).toBe(publishedAt);
    expect(
      freshnessDate(
        { publishedAt, editorial: { jeffReviewedAt: new Date('2026-07-17T00:00:00.000Z') } },
        now,
      ),
    ).toBe(publishedAt);
  });

  it('prefers Jeff review, parses stored dates, and ignores older reviews', () => {
    const jeffReviewedAt = new Date('2026-07-10T00:00:00.000Z');
    const claudeReviewedAt = new Date('2026-07-12T00:00:00.000Z');
    expect(
      freshnessDate({ publishedAt, editorial: { jeffReviewedAt, claudeReviewedAt } }, now),
    ).toBe(jeffReviewedAt);

    expect(
      freshnessDate(
        {
          publishedAt,
          editorial: { claudeReviewedAt: '2026-07-09T00:00:00.000Z' as unknown as Date },
        },
        now,
      ).toISOString(),
    ).toBe('2026-07-09T00:00:00.000Z');

    expect(
      freshnessDate(
        { publishedAt, editorial: { jeffReviewedAt: new Date('2026-06-30T00:00:00.000Z') } },
        now,
      ),
    ).toBe(publishedAt);
  });

  it('labels only a later effective freshness date as updated', () => {
    expect(wasUpdated({ publishedAt }, now)).toBe(false);
    expect(
      wasUpdated(
        { publishedAt, editorial: { jeffReviewedAt: new Date('2026-07-10T00:00:00.000Z') } },
        now,
      ),
    ).toBe(true);
  });
});
