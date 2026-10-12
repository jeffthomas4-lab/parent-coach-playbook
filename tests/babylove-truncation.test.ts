import { describe, expect, it } from 'vitest';
import { buildBabyLoveArticleMarkdown, clipToSentences, looksTruncated, parseBabyLoveArticle } from '../src/lib/babylove-growth';
import { checkArticle } from '../scripts/check-truncated-summaries.mjs';

// Shape of the 2026-10-12 switching-teams import: the opening paragraph runs
// past the bluf cap, and the excerpt runs past the dek cap.
const OPENING = "Switching teams is usually the right call when the current environment is hurting your child's enjoyment, development, or safety, not just when results are disappointing. Before you act, confirm three things: whether league or club rules allow a move right now, whether any medical clearance is pending, and what the cost and logistics of a transfer actually look like. Below, we walk through the checklist, the scripts, and a realistic timeline for families who want to get this right the first time around.";

const PAYLOAD = {
  id: '957020',
  title: 'Switching Youth Volleyball Teams',
  slug: 'switching-teams-youth-sports',
  content_markdown: `${OPENING}\n\n## Next\n\nMore body text that is long enough to count as a real paragraph for the opening finder.`,
  meta_description: 'Decide when youth volleyball players should switch teams with a checklist, coach scripts, and a timeline covering rules, safety, costs, and fit.',
  excerpt: OPENING,
  language_code: 'en-US',
  created_at: '2026-10-12T03:00:00.000Z',
};

const field = (md: string, key: string) => JSON.parse(md.match(new RegExp(`^${key}: (".*")$`, 'm'))?.[1] ?? '""') as string;

describe('BabyLove dek/bluf never ship a mid-sentence cut', () => {
  it('clipToSentences keeps whole sentences only', () => {
    expect(clipToSentences('One. Two is longer. Three is the longest of all.', 25)).toBe('One. Two is longer.');
    expect(clipToSentences('A single sentence that is far too long for the cap.', 20)).toBe('');
    expect(clipToSentences('Short enough', 50)).toBe('Short enough.');
  });

  it('looksTruncated spots a period added to a cut', () => {
    expect(looksTruncated('the scripts, and a realistic.', 'the scripts, and a realistic timeline.')).toBe(true);
    expect(looksTruncated('First sentence.', 'First sentence. Second one.')).toBe(false);
  });

  it('builds a dek and bluf that end on real sentence boundaries', async () => {
    const article = parseBabyLoveArticle(PAYLOAD);
    const md = buildBabyLoveArticleMarkdown(article, 'sha', '2026-10-12T03:00:42.311Z');
    const dek = field(md, 'dek');
    const bluf = field(md, 'bluf');
    expect(dek.length).toBeGreaterThanOrEqual(20);
    expect(dek.length).toBeLessThanOrEqual(240);
    expect(bluf.length).toBeGreaterThanOrEqual(80);
    expect(bluf.length).toBeLessThanOrEqual(500);
    expect(bluf).not.toMatch(/a realistic\.$/);
    expect(looksTruncated(dek, OPENING)).toBe(false);
    expect(looksTruncated(bluf, OPENING)).toBe(false);
    expect(checkArticle(md)).toEqual([]);
  });

  it('the guard flags the shape that shipped', () => {
    const bad = `---\ndek: "Before you act, confirm three things."\nbluf: "Before you act, confirm three things: rules, clearance, and cost. Below, we walk through the checklist, the scripts, and a realistic."\n---\n\nBefore you act, confirm three things: rules, clearance, and cost. Below, we walk through the checklist, the scripts, and a realistic timeline.\n`;
    const issues = checkArticle(bad);
    expect(issues.join(' ')).toMatch(/dek is a mid-sentence cut of bluf/);
    expect(issues.join(' ')).toMatch(/bluf is a mid-sentence cut of the body/);
  });
});
