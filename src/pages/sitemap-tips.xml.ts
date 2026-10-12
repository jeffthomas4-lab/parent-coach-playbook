import { contentSitemapGroups, renderUrlset } from '../lib/sitemap-content-urls';

// Short coaching-tip drill cards, split out so their indexing can be judged separately from articles.
// Prerendered at build time, so the content store never ships in the runtime worker.
export async function GET() {
  const g = await contentSitemapGroups();
  return renderUrlset(g.tips);
}
