import { describe, expect, it } from 'vitest';
import { classifyBabyLoveRelease } from '../scripts/classify-babylove-release.mjs';

const article = `---
title: "A useful article for parents"
phase: "game"
draft: false
externalSource:
  provider: "babylovegrowth"
  articleId: "674264"
editorial:
  status: published
---

Useful body.
`;

const eligible = {
  deployMessage: 'chore: normalize BabyLove editorial evidence',
  parentMessage: 'Publish BabyLoveGrowth article 674264: youth-sports-costs',
  changes: [
    { status: 'A', path: 'src/content/articles/youth-sports-costs.md' },
    { status: 'M', path: 'reports/editorial/editorial-refresh-queue.json' },
  ],
  articleMarkdown: article,
};

describe('BabyLove content-only release classifier', () => {
  it('authorizes exactly one normalized provider article and its governed evidence', () => {
    expect(classifyBabyLoveRelease(eligible)).toEqual({
      eligible: true,
      reason: 'eligible_content_only_babylove_release',
      articleId: '674264',
      slug: 'youth-sports-costs',
      route: '/game/youth-sports-costs/',
    });
  });

  it.each([
    ['non-normalization commit', { deployMessage: 'feat: application code' }, 'not_normalization_commit'],
    ['non-provider parent', { parentMessage: 'Editorial update' }, 'parent_not_babylove_publish'],
    ['extra application file', { changes: [...eligible.changes, { status: 'M', path: 'src/worker.ts' }] }, 'unexpected_change_count'],
    ['renamed article', { changes: [{ status: 'R100', path: eligible.changes[0].path }, eligible.changes[1]] }, 'unsupported_change_status'],
    ['wrong slug', { parentMessage: 'Publish BabyLoveGrowth article 674264: another-slug' }, 'slug_mismatch'],
    ['wrong provider', { articleMarkdown: article.replace('provider: "babylovegrowth"', 'provider: "other"') }, 'provider_mismatch'],
    ['wrong article id', { articleMarkdown: article.replace('articleId: "674264"', 'articleId: "9"') }, 'article_id_mismatch'],
    ['draft article', { articleMarkdown: article.replace('draft: false', 'draft: true') }, 'article_not_published'],
  ])('fails closed for %s', (_label, override, reason) => {
    expect(classifyBabyLoveRelease({ ...eligible, ...override })).toMatchObject({ eligible: false, reason });
  });
});
