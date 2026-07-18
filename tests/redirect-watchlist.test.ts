import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import {
  loadWatchlistFile,
  normalizeWatchlistText,
  parseSitemapUrls,
  redirectReportFileName,
  requiredSitemapFailures,
} from '../automation/agents/nora/tools/redirect-watchlist.mjs';

describe('redirect fixer watchlist ingestion', () => {
  it('accepts paths and same-origin absolute URLs from GSC-style CSV', () => {
    const urls = normalizeWatchlistText(`\uFEFFURL,Last crawled
"https://parentcoachdesk.com/old,quoted/",2026-07-01
/missing-page/,2026-07-02
https://parentcoachdesk.com/missing-page/#fragment,duplicate
`, 'https://parentcoachdesk.com');

    expect(urls).toEqual([
      'https://parentcoachdesk.com/old,quoted/',
      'https://parentcoachdesk.com/missing-page/',
    ]);
  });

  it('rejects external, executable, empty, and summary rows', () => {
    const urls = normalizeWatchlistText(`Page
https://evil.example/phish
javascript:alert(1)
not a url

`, 'https://parentcoachdesk.com');
    expect(urls).toEqual([]);
  });

  it('refuses watchlist paths outside the repository', () => {
    expect(() => loadWatchlistFile('../outside.csv', 'C:/project', 'https://parentcoachdesk.com'))
      .toThrow('watchlist path must stay inside the project');
  });
});

describe('redirect audit sitemap coverage', () => {
  it('parses sitemap URLs and rejects false-green empty surfaces', () => {
    expect(parseSitemapUrls('<urlset><url><loc>https://example.com/a/</loc></url></urlset>'))
      .toEqual(['https://example.com/a/']);
    expect(requiredSitemapFailures([
      { path: '/content.xml', status: 200, urls: ['https://example.com/a/'] },
      { path: '/camps.xml', status: 200, urls: [] },
      { path: '/missing.xml', status: 503, urls: [] },
    ])).toEqual(['/camps.xml: 0 URLs', '/missing.xml: HTTP 503']);
  });

  it('keeps the confirmed SERA 404 mapped to the stable directory landing page', async () => {
    const config = await readFile(new URL('../astro.config.mjs', import.meta.url), 'utf8');
    expect(config).toContain("'/camps/soccer-camp-full-day-at-sera-sports-complex': '/camps/'");
  });

  it('keeps full and sampled evidence in distinct report files', () => {
    expect(redirectReportFileName('2026-07-18', 'full', 1971)).toBe('redirect-candidates-2026-07-18-full.md');
    expect(redirectReportFileName('2026-07-18', 'sample', 1)).toBe('redirect-candidates-2026-07-18-sample-1.md');
  });
});
