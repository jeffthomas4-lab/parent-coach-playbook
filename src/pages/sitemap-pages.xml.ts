import { contentSitemapGroups, renderUrlset } from '../lib/sitemap-content-urls';

// Hub and static pages: homepage, section hubs, sport hubs, buying guides, tools.
// Prerendered at build time, so the content store never ships in the runtime worker.
export async function GET() {
  const g = await contentSitemapGroups();
  return renderUrlset(g.pages);
}
