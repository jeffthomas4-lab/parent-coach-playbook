import { readFileSync } from 'node:fs';
import path from 'node:path';

function parseCsvRow(line) {
  const cells = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      cells.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }
  cells.push(cell);
  return cells;
}

export function normalizeWatchlistText(text, siteOrigin) {
  const origin = new URL(siteOrigin).origin;
  const urls = [];
  for (const rawLine of text.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const firstCell = parseCsvRow(rawLine)[0]?.trim();
    if (!firstCell || /^(url|page|example)$/i.test(firstCell)) continue;
    if (!firstCell.startsWith('/') && !/^https?:\/\//i.test(firstCell)) continue;
    try {
      const url = new URL(firstCell, origin);
      if (url.origin !== origin || !/^https?:$/.test(url.protocol)) continue;
      url.hash = '';
      urls.push(url.toString());
    } catch {
      // Export rows can contain labels and summary lines. Ignore non-URLs.
    }
  }
  return [...new Set(urls)];
}

export function loadWatchlistFile(inputPath, projectRoot, siteOrigin) {
  const root = path.resolve(projectRoot);
  const absolute = path.resolve(root, inputPath);
  const relative = path.relative(root, absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('watchlist path must stay inside the project');
  }
  return normalizeWatchlistText(readFileSync(absolute, 'utf8'), siteOrigin);
}

export function parseSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

export function requiredSitemapFailures(sitemaps) {
  return sitemaps
    .filter((sitemap) => sitemap.status !== 200 || sitemap.urls.length === 0)
    .map((sitemap) => `${sitemap.path}: ${sitemap.status !== 200 ? `HTTP ${sitemap.status}` : '0 URLs'}`);
}

export function redirectReportFileName(date, mode, checkedCount) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('invalid report date');
  if (mode !== 'full' && mode !== 'sample') throw new Error('invalid report mode');
  if (!Number.isInteger(checkedCount) || checkedCount < 0) throw new Error('invalid checked count');
  return `redirect-candidates-${date}-${mode === 'full' ? 'full' : `sample-${checkedCount}`}.md`;
}
