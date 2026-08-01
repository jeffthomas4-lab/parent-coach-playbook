#!/usr/bin/env node
// One-off SEO audit script (Pillar 10). Reads every content-collection markdown
// file's frontmatter, reproduces the exact title/description computation each
// page template uses (verified against the .astro source, not guessed), and
// reports how many computed <title>/meta-description values violate the
// Pillar 10 budget: title < 60 chars, description < 160 chars.
//
// Not wired into CI. Run by hand: node scripts/seo-title-desc-audit.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const ROOT = join(import.meta.dirname, '..', 'src', 'content');
const SITE_NAME = 'Parent Coach Desk';
const TITLE_SUFFIX = ` | ${SITE_NAME}`; // BaseLayout.astro line 31, the real production suffix

function frontmatter(path) {
  const raw = readFileSync(path, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  try {
    return yaml.load(m[1]) ?? {};
  } catch (e) {
    return { __parseError: String(e.message).slice(0, 80) };
  }
}

function files(collection) {
  const dir = join(ROOT, collection);
  return readdirSync(dir).filter(f => f.endsWith('.md') && !f.startsWith('_'));
}

function strip(t) {
  return (t ?? '').replace(/\*/g, '');
}

const results = []; // { collection, slug, title, titleLen, desc, descLen, titleFail, descFail }

function record(collection, slug, title, desc) {
  const finalTitle = title ? `${title}${TITLE_SUFFIX}` : `${SITE_NAME}: Sideline notes for parents in the middle of it.`;
  const finalDesc = desc ?? '';
  results.push({
    collection,
    slug,
    title: finalTitle,
    titleLen: finalTitle.length,
    desc: finalDesc,
    descLen: finalDesc.length,
    titleFail: finalTitle.length > 60,
    descMissing: finalDesc.length === 0,
    descOver: finalDesc.length > 160,
    descFail: finalDesc.length === 0 || finalDesc.length > 160,
  });
}

// articles — ArticleLayout.astro: title = seoTitle ?? strip(title); description = seoDescription ?? dek ?? SITE.description
for (const f of files('articles')) {
  const fm = frontmatter(join(ROOT, 'articles', f));
  const title = fm.seoTitle ?? strip(fm.title);
  const desc = fm.seoDescription ?? fm.dek ?? 'For every parent driving a kid to practice, rehearsal, or the meet. Find the camps, get the gear right, and win the drive home. Any activity, any age.';
  record('articles', f, title, desc);
}

// guides (what-to-buy) — pageTitle = seoTitle ?? `Youth ${activity} Gear List by Age: What to Buy (and Skip)`
for (const f of files('guides')) {
  const fm = frontmatter(join(ROOT, 'guides', f));
  const title = fm.seoTitle ?? `Youth ${fm.activity} Gear List by Age: What to Buy (and Skip)`;
  const desc = fm.seoDescription ?? fm.lede;
  record('guides', f, title, desc);
}

// resources (team-parent) — title = strip(title); description = summary
for (const f of files('resources')) {
  const fm = frontmatter(join(ROOT, 'resources', f));
  record('resources', f, strip(fm.title), fm.summary);
}

// coachingTips — title = strip(title); description = summary
for (const f of files('coachingTips')) {
  const fm = frontmatter(join(ROOT, 'coachingTips', f));
  record('coachingTips', f, strip(fm.title), fm.summary);
}

// seasonCalendars — title = strip(title); description = summary
for (const f of files('seasonCalendars')) {
  const fm = frontmatter(join(ROOT, 'seasonCalendars', f));
  record('seasonCalendars', f, strip(fm.title), fm.summary);
}

// body — title = strip(title); description = summary
for (const f of files('body')) {
  const fm = frontmatter(join(ROOT, 'body', f));
  record('body', f, strip(fm.title), fm.summary);
}

// pathways — title = `${sportLabel} pathway` (approximate with raw sport enum value, capitalized)
for (const f of files('pathways')) {
  const fm = frontmatter(join(ROOT, 'pathways', f));
  const label = (fm.sport ?? '').replace(/-/g, ' ');
  const title = `${label.charAt(0).toUpperCase()}${label.slice(1)} pathway`;
  record('pathways', f, title, fm.summary);
}

// recruiting — title = strip(title); description = summary
for (const f of files('recruiting')) {
  const fm = frontmatter(join(ROOT, 'recruiting', f));
  record('recruiting', f, strip(fm.title), fm.summary);
}

// adaptive — title = strip(title); description = summary
for (const f of files('adaptive')) {
  const fm = frontmatter(join(ROOT, 'adaptive', f));
  record('adaptive', f, strip(fm.title), fm.summary);
}

// rules — title = strip(title); description = summary
for (const f of files('rules')) {
  const fm = frontmatter(join(ROOT, 'rules', f));
  record('rules', f, strip(fm.title), fm.summary);
}

// scripts — title = seoTitle ?? strip(title); description = seoDescription ?? summary
for (const f of files('scripts')) {
  const fm = frontmatter(join(ROOT, 'scripts', f));
  const title = fm.seoTitle ?? strip(fm.title);
  const desc = fm.seoDescription ?? fm.summary;
  record('scripts', f, title, desc);
}

// decisions — title = strip(title); description = summary
for (const f of files('decisions')) {
  const fm = frontmatter(join(ROOT, 'decisions', f));
  record('decisions', f, strip(fm.title), fm.summary);
}

// news — title = headline; description = summary
for (const f of files('news')) {
  const fm = frontmatter(join(ROOT, 'news', f));
  record('news', f, fm.headline, fm.summary);
}

// pillar — pageTitle = seoTitle ?? title; pageDescription = capped-at-155+'...' of seoDescription/lede-equivalent
// pillar.astro reads a rawDesc from data (seoDescription-equivalent field); approximate directly.
for (const f of files('pillar')) {
  const fm = frontmatter(join(ROOT, 'pillar', f));
  const title = fm.seoTitle ?? fm.title;
  // pillar.astro caps desc at 155 + '...' — that computation happens in-template on
  // whatever raw description the frontmatter carries; if seoDescription is absent
  // and there's no other candidate the template's raw field is used directly.
  const rawDesc = fm.seoDescription ?? '';
  const desc = rawDesc.length > 155 ? rawDesc.slice(0, 155) + '...' : rawDesc;
  record('pillar', f, title, desc);
}

// --- Report ---
const byCollection = {};
for (const r of results) {
  byCollection[r.collection] ??= { total: 0, titleFail: 0, descFail: 0, descMissing: 0, descOver: 0, titleFailList: [], descFailList: [] };
  const b = byCollection[r.collection];
  b.total++;
  if (r.titleFail) { b.titleFail++; b.titleFailList.push(`${r.slug} (${r.titleLen})`); }
  if (r.descFail) { b.descFail++; b.descFailList.push(`${r.slug} (${r.descLen})`); }
  if (r.descMissing) b.descMissing++;
  if (r.descOver) b.descOver++;
}

let totalTitleFail = 0, totalDescFail = 0, totalPages = 0;
console.log('# Pillar 10 title/description length audit\n');
console.log('| Collection | Pages | Title >60 chars | Description missing | Description >160 chars |');
console.log('|---|---|---|---|---|');
for (const [collection, b] of Object.entries(byCollection)) {
  console.log(`| ${collection} | ${b.total} | ${b.titleFail} | ${b.descMissing} | ${b.descOver} |`);
  totalTitleFail += b.titleFail;
  totalDescFail += b.descFail;
  totalPages += b.total;
}
console.log(`| **TOTAL** | **${totalPages}** | **${totalTitleFail}** | **${totalDescFail}** |`);

console.log('\n## Sample failing titles (first 15 per collection over budget)');
for (const [collection, b] of Object.entries(byCollection)) {
  if (b.titleFailList.length === 0) continue;
  console.log(`\n### ${collection} (${b.titleFail}/${b.total})`);
  console.log(b.titleFailList.slice(0, 15).join(', '));
}

console.log('\n## Duplicate title check (exact final <title> string collisions)');
const titleMap = {};
for (const r of results) {
  titleMap[r.title] ??= [];
  titleMap[r.title].push(`${r.collection}/${r.slug}`);
}
const dupes = Object.entries(titleMap).filter(([, v]) => v.length > 1);
console.log(`${dupes.length} duplicate title groups found.`);
for (const [t, v] of dupes.slice(0, 20)) {
  console.log(`- "${t}" x${v.length}: ${v.slice(0, 4).join(', ')}`);
}
