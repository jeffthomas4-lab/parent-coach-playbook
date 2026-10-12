import { contentSitemapGroups, renderUrlset } from '../lib/sitemap-content-urls';

// Editorial content: articles, pillar guides, decisions, scripts, body, recruiting, rules, pathways, adaptive, resources, news, season calendars.
// Prerendered at build time, so the content store never ships in the runtime worker.
export async function GET() {
  const g = await contentSitemapGroups();
  return renderUrlset(g.articles);
}
