#!/usr/bin/env node
// Coverage matrix audit. Run with:
//   node scripts/coverage-matrix.mjs
//
// Outputs a matrix of (activity × age) coverage gaps:
//   - Reads (articles tagged that activity at that age)
//   - Buying guide (per activity)
//   - Pathway (per activity)
//   - Calendar (per activity)
//   - Cost calculator default (per activity)
//
// Use this to surface gaps before each editorial cycle.

import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Match the SPORTS list from src/data/site.ts
const SPORTS = [
  'baseball','softball','soccer','basketball',
  'flag-football','football-7v7','football',
  'hockey','lacrosse-boys','lacrosse-girls','volleyball',
  'swimming','track-field','cross-country','tennis','golf','crew',
  'martial-arts','gymnastics','cheer','stunt',
  'theater','band','choir','dance','ballet',
];

const AGES = ['5-7','8-10','11-12','13-14','15-plus'];

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) {
      let val = m[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      data[m[1]] = val;
    }
  }
  return data;
}

function readDir(dir) {
  const fullPath = path.join(root, dir);
  if (!fs.existsSync(fullPath)) return [];
  return fs.readdirSync(fullPath)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const content = fs.readFileSync(path.join(fullPath, f), 'utf8');
      return { slug: f.replace('.md', ''), data: parseFrontmatter(content) };
    });
}

const articles = readDir('src/content/articles');
const guides = readDir('src/content/guides');
const pathways = readDir('src/content/pathways');
const calendars = readDir('src/content/seasonCalendars');
const tips = readDir('src/content/coachingTips');

// Cost calculator defaults — pull from costDefaults.ts file
let costSports = new Set();
const costPath = path.join(root, 'src/data/costDefaults.ts');
if (fs.existsSync(costPath)) {
  const content = fs.readFileSync(costPath, 'utf8');
  const matches = content.matchAll(/sport:\s*['"]([^'"]+)['"]/g);
  for (const m of matches) costSports.add(m[1]);
}

// Build coverage matrix
console.log('\nCoverage matrix — gaps in red\n');
const today = new Date('2026-05-05');

function isLive(d) {
  if (!d) return false;
  if (d.draft === 'true') return false;
  const pd = d.publishedAt ? new Date(d.publishedAt) : null;
  return pd && pd <= today;
}

const liveArticles = articles.filter(a => isLive(a.data));
const liveTips = tips.filter(t => isLive(t.data));

let totalGaps = 0;

console.log('Activity'.padEnd(20),
  'Reads(5-7)'.padEnd(12),
  'Reads(8-10)'.padEnd(12),
  'Reads(11-12)'.padEnd(13),
  'Reads(13-14)'.padEnd(13),
  'Reads(15+)'.padEnd(11),
  'Guide'.padEnd(7),
  'Path'.padEnd(6),
  'Cal'.padEnd(5),
  'Cost'.padEnd(5),
);
console.log('-'.repeat(108));

for (const sport of SPORTS) {
  const readCounts = AGES.map(age =>
    liveArticles.filter(a => a.data.sport === sport && a.data.age === age).length
  );
  const drillCount = liveTips.filter(t => t.data.sport === sport).length;
  const hasGuide = guides.some(g => g.slug === sport);
  const hasPathway = pathways.some(p => p.data.sport === sport);
  const hasCalendar = calendars.some(c => c.data.sport === sport);
  const hasCost = costSports.has(sport);

  const gaps = readCounts.filter(c => c === 0).length
    + (hasGuide ? 0 : 1)
    + (hasPathway ? 0 : 1)
    + (hasCalendar ? 0 : 1)
    + (hasCost ? 0 : 1);
  totalGaps += gaps;

  const row = [
    sport.padEnd(20),
    ...readCounts.map((c, i) => (c === 0 ? `MISS` : String(c)).padEnd(i < 2 ? 12 : i < 4 ? 13 : 11)),
    (hasGuide ? 'OK' : 'MISS').padEnd(7),
    (hasPathway ? 'OK' : 'MISS').padEnd(6),
    (hasCalendar ? 'OK' : 'MISS').padEnd(5),
    (hasCost ? 'OK' : 'MISS').padEnd(5),
  ];
  console.log(row.join(''));
}

console.log('-'.repeat(108));
console.log(`\nTotal gaps across all activities and surfaces: ${totalGaps}`);
console.log(`\nTop 10 priority gaps (most-popular activities first):`);

const popularOrder = ['soccer','basketball','baseball','football','softball','volleyball','swimming','tennis','gymnastics','dance'];
let listed = 0;
for (const sport of popularOrder) {
  if (listed >= 10) break;
  const readCounts = AGES.map(age =>
    liveArticles.filter(a => a.data.sport === sport && a.data.age === age).length
  );
  const missingAges = AGES.filter((_, i) => readCounts[i] === 0);
  if (missingAges.length > 0) {
    console.log(`  ${sport}: missing reads at ages ${missingAges.join(', ')}`);
    listed++;
  }
  if (!guides.some(g => g.slug === sport)) {
    console.log(`  ${sport}: missing buying guide`);
    listed++;
  }
  if (!pathways.some(p => p.data.sport === sport)) {
    console.log(`  ${sport}: missing pathway`);
    listed++;
  }
}

console.log('\nRun this monthly. Fill gaps in popularity order.\n');
