#!/usr/bin/env node
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ARTICLE_DIR = 'src/content/articles';
const DEFAULT_REPORT = 'reports/editorial/editorial-refresh-queue.json';

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  }));
  return nested.flat();
}

function frontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(text);
  if (!match) throw new Error('missing frontmatter');
  const scalar = (name) => {
    const found = new RegExp(`^\\s*${name}:\\s*(.+?)\\s*$`, 'm').exec(match[1]);
    return found?.[1]?.replace(/^(['"])(.*)\1$/, '$2');
  };
  return { block: match[1], body: text.slice(match[0].length), scalar };
}

function isoDate(value, field, source) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) throw new Error(`${source}: invalid ${field}`);
  return date;
}

function addMonths(date, months) {
  const result = new Date(date);
  result.setUTCMonth(result.getUTCMonth() + months);
  return result;
}

function countOccurrences(text, value) {
  return text.split(value).length - 1;
}

export async function buildEditorialRefreshQueue({ root = process.cwd(), asOf = new Date() } = {}) {
  const observedAt = asOf instanceof Date ? asOf : new Date(asOf);
  if (Number.isNaN(observedAt.getTime())) throw new Error('asOf must be a valid date');
  const articleRoot = resolve(root, ARTICLE_DIR);
  const articleFiles = (await filesUnder(articleRoot)).filter((file) => extname(file) === '.md').sort();
  const sourceFiles = (await filesUnder(resolve(root, 'src'))).filter((file) => ['.md', '.astro', '.ts'].includes(extname(file))).sort();
  const sourceBodies = await Promise.all(sourceFiles.map(async (file) => ({ file, text: await readFile(file, 'utf8') })));
  const inventory = [];

  for (const file of articleFiles) {
    const text = await readFile(file, 'utf8');
    const meta = frontmatter(text);
    if (meta.scalar('draft') === 'true') continue;
    const publishedAt = isoDate(meta.scalar('publishedAt'), 'publishedAt', file);
    if (!publishedAt) throw new Error(`${file}: publishedAt is required`);
    if (publishedAt > observedAt) continue;
    const phase = meta.scalar('phase');
    if (!['drive-there', 'game', 'drive-home', 'team-parent'].includes(phase)) throw new Error(`${file}: invalid phase`);
    const slug = basename(file, '.md');
    const route = `/${phase}/${slug}/`;
    const dueAt = addMonths(publishedAt, 18);
    const factCheckAt = isoDate(meta.scalar('factCheckGoodThrough'), 'factCheckGoodThrough', file);
    const incomingLinks = sourceBodies.reduce((sum, source) => source.file === file ? sum : sum + countOccurrences(source.text, route), 0);
    const refreshDue = dueAt <= observedAt;
    const factCheckDue = factCheckAt !== null && factCheckAt <= observedAt;
    inventory.push({
      route,
      source: relative(root, file).replaceAll('\\', '/'),
      title: meta.scalar('title') ?? slug,
      published_at: publishedAt.toISOString().slice(0, 10),
      refresh_due_at: dueAt.toISOString().slice(0, 10),
      fact_check_good_through: factCheckAt?.toISOString().slice(0, 10) ?? null,
      explicit_source_references: incomingLinks,
      contains_affiliate_redirect: /\/go\/[a-z0-9-]+\/?/i.test(meta.body),
      state: factCheckDue ? 'fact_check_due' : refreshDue ? 'refresh_due' : 'current',
    });
  }
  inventory.sort((a, b) => a.refresh_due_at.localeCompare(b.refresh_due_at) || a.route.localeCompare(b.route));
  const count = (state) => inventory.filter((item) => item.state === state).length;
  const actionable = inventory.filter((item) => item.state !== 'current');
  return {
    schema_version: 1,
    as_of: observedAt.toISOString().slice(0, 10),
    inventory_sha256: createHash('sha256').update(JSON.stringify(inventory)).digest('hex'),
    policy: {
      refresh_months: 18,
      source_reference_scope: 'literal contextual references only; generated hub links require emitted-artifact evidence',
      automatic_redirects: false,
      automatic_deletions: false,
      traffic_data_included: false,
      decommission_requires: ['live traffic below reviewed threshold', 'emitted incoming-link audit', 'human supersession review'],
    },
    summary: {
      live_articles: inventory.length,
      refresh_due: count('refresh_due'),
      fact_check_due: count('fact_check_due'),
      refresh_due_without_explicit_source_reference: inventory.filter((item) => item.state === 'refresh_due' && item.explicit_source_references === 0).length,
      affiliate_link_review: inventory.filter((item) => item.contains_affiliate_redirect).length,
    },
    items: actionable,
    next_refreshes: inventory.filter((item) => item.state === 'current').slice(0, 25).map((item) => ({
      route: item.route,
      refresh_due_at: item.refresh_due_at,
      contains_affiliate_redirect: item.contains_affiliate_redirect,
    })),
  };
}

async function main() {
  const args = process.argv.slice(2);
  const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
  const output = value('--output') ?? DEFAULT_REPORT;
  if (args.includes('--check')) {
    const committed = JSON.parse(await readFile(output, 'utf8'));
    const current = await buildEditorialRefreshQueue({ asOf: `${committed.as_of}T00:00:00Z` });
    if (JSON.stringify(current) !== JSON.stringify(committed)) throw new Error(`editorial refresh queue is stale; regenerate ${output}`);
    console.log(`Editorial refresh queue passed: ${current.summary.live_articles} live articles, ${current.summary.refresh_due} refresh due, ${current.summary.refresh_due_without_explicit_source_reference} due without explicit source reference.`);
    return;
  }
  const asOf = value('--as-of') ? new Date(`${value('--as-of')}T00:00:00Z`) : new Date();
  const report = await buildEditorialRefreshQueue({ asOf });
  await mkdir(dirname(resolve(output)), { recursive: true });
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`Editorial refresh queue written: ${report.summary.live_articles} live articles.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
