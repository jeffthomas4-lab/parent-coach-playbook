import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const contentRoot = path.join(root, 'src', 'content');
const out = path.join(root, 'reports', 'editorial', 'lifecycle.json');
const files = [];
function walk(dir) { for (const name of fs.readdirSync(dir)) { const p = path.join(dir, name); const s = fs.statSync(p); if (s.isDirectory()) walk(p); else if (/\.(md|mdx)$/.test(name)) files.push(p); } }
walk(contentRoot);
const items = files.map(file => {
  const raw = fs.readFileSync(file, 'utf8'); const fm = raw.match(/^---\s*([\s\S]*?)\s*---/); const h = fm?.[1] ?? '';
  const get = k => (h.match(new RegExp(`^${k}:\\s*(.*)$`, 'm'))?.[1] ?? '').trim().replace(/^['"]|['"]$/g, '');
  const collection = path.relative(contentRoot, file).split(path.sep)[0];
  const draft = get('draft') === 'true'; const status = get('status') || 'legacy';
  return { collection, file: path.relative(root, file).replaceAll('\\','/'), title: get('title'), draft, status, published: Boolean(get('publishedAt')) };
});
const counts = { content_items: items.length, live_items: items.filter(x => !x.draft).length, drafts: items.filter(x => x.draft).length, published: items.filter(x => x.published && !x.draft).length, legacy_items: items.filter(x => x.status === 'legacy').length, approval_ready: 0, research_queue: 0, maintenance_queue: 0, retirement_queue: 0 };
const collection_rollup = Object.entries(Object.groupBy(items, x => x.collection)).map(([collection, rows]) => ({ collection, items: rows.length, live: rows.filter(x => !x.draft).length }));
const report = { schema_version: 1, as_of: new Date().toISOString().slice(0,10), inventory_sha256: crypto.createHash('sha256').update(items.map(x=>x.file).sort().join('\n')).digest('hex'), policy: { auto_publish: false, auto_retire: false, opportunity_intake_requires_signal: true, legacy_corpus_is_not_evidence_complete: true }, counts, collection_rollup, queues: { research_and_briefing: [], claim_validation: [], human_approval: [], maintenance: [], retirement: [] } };
fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n'); console.log(`Wrote ${path.relative(root, out)} (${items.length} items)`);
