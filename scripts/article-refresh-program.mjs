#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ARTICLE_DIR = 'src/content/articles';
const DEFAULT_REPORT = 'reports/editorial/article-refresh-100.json';
export const DEFAULT_AS_OF = '2026-08-02';
const PROGRAM_SIZE = 100;
const BATCH_SIZE = 10;

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const target = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(target) : [target];
  }));
  return nested.flat();
}

function parseFrontmatter(text, source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(text);
  if (!match) throw new Error(`${source}: missing frontmatter`);
  const scalar = (name) => {
    const found = new RegExp(`^${name}:\\s*(.*?)\\s*$`, 'm').exec(match[1]);
    return found?.[1]?.replace(/^(['"])(.*)\1$/, '$2') ?? null;
  };
  const has = (name) => new RegExp(`^${name}:`, 'm').test(match[1]);
  return { block: match[1], body: text.slice(match[0].length), scalar, has };
}

function parseDate(value, field, source) {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) throw new Error(`${source}: invalid ${field}`);
  return parsed;
}

function occurrences(text, needle) {
  return text.split(needle).length - 1;
}

function wordCount(body) {
  return (body.replace(/<[^>]+>/g, ' ').match(/[A-Za-z0-9][A-Za-z0-9'’\-]*/g) ?? []).length;
}

function addScore(breakdown, name, points) {
  if (points > 0) breakdown[name] = points;
}

export function scoreArticle(article) {
  const breakdown = {};
  const title = article.title.toLowerCase();
  if (article.featured) addScore(breakdown, 'featured', 20);
  if (article.affiliate_links > 0) addScore(breakdown, 'affiliate_bearing', 12);
  addScore(breakdown, 'literal_incoming_links', Math.min(16, article.literal_incoming_links * 4));
  if (/cost|price|afford|equipment|gear|packing|renting vs|buying|used vs/.test(title)) addScore(breakdown, 'commercial_intent', 10);
  if (/tryout|recruit|rules|positions|explained|what parents need|guide|checklist|how to|what age|\bvs\b|versus/.test(title)) addScore(breakdown, 'evergreen_search_intent', 8);
  if (/when your kid|what to say|quit|burnout|bench|bullied|coach|playing time|afraid|cries|confidence/.test(title)) addScore(breakdown, 'parent_moment_intent', 6);
  if (!article.has_bluf) addScore(breakdown, 'missing_bluf', 10);
  if (!article.has_seo_title) addScore(breakdown, 'missing_seo_title', 5);
  if (!article.has_seo_description) addScore(breakdown, 'missing_seo_description', 6);
  if (article.words < 250) addScore(breakdown, 'very_thin_body', 12);
  else if (article.words < 600) addScore(breakdown, 'thin_body', 8);
  else if (article.words < 900) addScore(breakdown, 'short_body', 4);
  if (article.h2_count === 0) addScore(breakdown, 'no_h2_structure', 8);
  else if (article.h2_count < 4) addScore(breakdown, 'limited_h2_structure', 4);
  if (article.contextual_internal_links < 2) addScore(breakdown, 'limited_contextual_internal_links', 6);
  if (['equipment', 'rec-vs-travel', 'tryouts', 'rules-of-play', 'the-hard-stuff'].includes(article.topic)) {
    addScore(breakdown, 'priority_topic', 4);
  }
  return { total: Object.values(breakdown).reduce((sum, value) => sum + value, 0), breakdown };
}

function candidateStatus(updatedAt, programStartedAt) {
  return updatedAt && updatedAt >= programStartedAt ? 'refreshed' : 'pending';
}

function frozenSelection(previousReport) {
  if (!previousReport) return null;
  if (previousReport.schema_version !== 1 || previousReport.program?.size !== PROGRAM_SIZE) {
    throw new Error('existing article refresh report has an unsupported schema or program size');
  }
  const items = previousReport.batches?.flatMap((batch) => batch.items) ?? [];
  if (items.length !== PROGRAM_SIZE) throw new Error('existing article refresh report must contain exactly 100 items');
  return new Map(items.map((item) => [item.source, item]));
}

/**
 * @param {{ root?: string, asOf?: string, previousReport?: any }} [options]
 */
export async function buildArticleRefreshProgram({ root = process.cwd(), asOf = DEFAULT_AS_OF, previousReport = null } = {}) {
  const observedAt = parseDate(asOf, 'asOf', 'article refresh program');
  if (!observedAt) throw new Error('asOf is required');
  const articleRoot = resolve(root, ARTICLE_DIR);
  const files = (await filesUnder(articleRoot)).filter((file) => extname(file) === '.md').sort();
  const sourceRows = [];
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    sourceRows.push({ file, text, meta: parseFrontmatter(text, file) });
  }
  const articleCorpus = sourceRows.map((row) => row.text).join('\n');
  const eligible = [];
  for (const row of sourceRows) {
    const { file, meta } = row;
    if (meta.scalar('draft') === 'true' || meta.has('externalSource')) continue;
    const publishedAt = parseDate(meta.scalar('publishedAt'), 'publishedAt', file);
    if (!publishedAt) throw new Error(`${file}: publishedAt is required`);
    if (publishedAt > observedAt) continue;
    const updatedAt = parseDate(meta.scalar('updatedAt'), 'updatedAt', file);
    const phase = meta.scalar('phase');
    if (!['drive-there', 'game', 'drive-home', 'team-parent'].includes(phase)) throw new Error(`${file}: invalid phase`);
    const source = relative(root, file).replaceAll('\\', '/');
    const slug = basename(file, '.md');
    const route = `/${phase}/${slug}/`;
    const metrics = {
      title: meta.scalar('title') ?? slug,
      source,
      route,
      published_at: publishedAt.toISOString().slice(0, 10),
      updated_at: updatedAt?.toISOString().slice(0, 10) ?? null,
      featured: meta.scalar('featured') === 'true',
      topic: meta.scalar('topic') ?? null,
      sport: meta.scalar('sport') ?? null,
      words: wordCount(meta.body),
      h2_count: (meta.body.match(/^##\s+/gm) ?? []).length,
      affiliate_links: (meta.body.match(/\/go\//g) ?? []).length,
      contextual_internal_links: (meta.body.match(/\]\(\/(?:drive-there|game|drive-home|team-parent|what-to-buy|pathways|rules|body|scripts)\//g) ?? []).length,
      literal_incoming_links: Math.max(0, occurrences(articleCorpus, route) - occurrences(row.text, route)),
      has_bluf: meta.has('bluf'),
      has_seo_title: meta.has('seoTitle'),
      has_seo_description: meta.has('seoDescription'),
    };
    eligible.push(metrics);
  }
  if (eligible.length < PROGRAM_SIZE) throw new Error(`article refresh program requires at least ${PROGRAM_SIZE} eligible articles`);

  const frozen = frozenSelection(previousReport);
  let selected;
  if (frozen) {
    const current = new Map(eligible.map((item) => [item.source, item]));
    selected = [...frozen.values()].sort((a, b) => a.rank - b.rank).map((item) => {
      const live = current.get(item.source);
      if (!live) throw new Error(`${item.source}: frozen refresh candidate is no longer eligible`);
      return {
        ...item,
        status: candidateStatus(live.updated_at, asOf),
        refreshed_at: candidateStatus(live.updated_at, asOf) === 'refreshed' ? live.updated_at : null,
      };
    });
  } else {
    selected = eligible.map((article) => ({ article, score: scoreArticle(article) }))
      .sort((a, b) => b.score.total - a.score.total || a.article.source.localeCompare(b.article.source))
      .slice(0, PROGRAM_SIZE)
      .map(({ article, score }, index) => ({
        rank: index + 1,
        source: article.source,
        route: article.route,
        title: article.title,
        sport: article.sport,
        topic: article.topic,
        score: score.total,
        score_breakdown: score.breakdown,
        baseline_metrics: {
          words: article.words,
          h2_count: article.h2_count,
          affiliate_links: article.affiliate_links,
          contextual_internal_links: article.contextual_internal_links,
          literal_incoming_links: article.literal_incoming_links,
          has_bluf: article.has_bluf,
          has_seo_title: article.has_seo_title,
          has_seo_description: article.has_seo_description,
        },
        status: candidateStatus(article.updated_at, asOf),
        refreshed_at: candidateStatus(article.updated_at, asOf) === 'refreshed' ? article.updated_at : null,
      }));
  }
  const selectionSha256 = createHash('sha256').update(JSON.stringify(selected.map(({ status, refreshed_at, ...item }) => item))).digest('hex');
  const batches = Array.from({ length: PROGRAM_SIZE / BATCH_SIZE }, (_, index) => {
    const items = selected.slice(index * BATCH_SIZE, (index + 1) * BATCH_SIZE);
    return {
      batch: index + 1,
      status: items.every((item) => item.status === 'refreshed') ? 'refreshed' : items.some((item) => item.status === 'refreshed') ? 'in_progress' : 'pending',
      items,
    };
  });
  const refreshed = selected.filter((item) => item.status === 'refreshed').length;
  return {
    schema_version: 1,
    as_of: asOf,
    selection_sha256: selectionSha256,
    program: {
      name: 'highest-value refresh opportunities',
      size: PROGRAM_SIZE,
      batch_size: BATCH_SIZE,
      batch_count: PROGRAM_SIZE / BATCH_SIZE,
      program_started_at: asOf,
      selection_frozen: true,
    },
    policy: {
      traffic_data_included: false,
      traffic_claim: 'This is not a top-traffic list. Repository traffic data is too sparse to rank articles reliably.',
      eligible_scope: 'published, non-draft article collection entries on or before as_of, excluding externalSource BabyLoveGrowth imports',
      ordering: 'score descending, then source path ascending; selection remains frozen after initialization',
      completion_marker: 'top-level article frontmatter updatedAt on or after program_started_at',
      cannibalization_check_required: true,
      automatic_redirects: false,
      automatic_deletions: false,
      scoring: {
        featured: 20,
        affiliate_bearing: 12,
        literal_incoming_links: '4 each, capped at 16',
        commercial_intent: 10,
        evergreen_search_intent: 8,
        parent_moment_intent: 6,
        missing_bluf: 10,
        missing_seo_title: 5,
        missing_seo_description: 6,
        very_thin_body_under_250_words: 12,
        thin_body_under_600_words: 8,
        short_body_under_900_words: 4,
        no_h2_structure: 8,
        limited_h2_structure: 4,
        limited_contextual_internal_links: 6,
        priority_topic: 4,
      },
    },
    summary: {
      eligible_articles: eligible.length,
      selected_articles: selected.length,
      refreshed,
      pending: selected.length - refreshed,
    },
    batches,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
  const output = value('--output') ?? DEFAULT_REPORT;
  const asOf = value('--as-of') ?? DEFAULT_AS_OF;
  let committed = null;
  try { committed = JSON.parse(await readFile(output, 'utf8')); } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  const report = await buildArticleRefreshProgram({ asOf, previousReport: committed });
  if (args.includes('--check')) {
    if (!committed) throw new Error(`missing article refresh program: ${output}`);
    if (JSON.stringify(report) !== JSON.stringify(committed)) throw new Error(`article refresh program is stale; regenerate ${output}`);
    console.log(`Article refresh program passed: ${report.summary.selected_articles} selected, ${report.summary.refreshed} refreshed, ${report.summary.pending} pending.`);
    return;
  }
  await mkdir(dirname(resolve(output)), { recursive: true });
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`Article refresh program written: ${report.summary.selected_articles} selected in ${report.program.batch_count} batches.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
