import { contentSitemapGroups, renderUrlset } from '../lib/sitemap-content-urls';

// Legacy union of every content URL. Kept serving for any GSC property that still has it submitted; the index at /sitemap.xml now lists the split files instead.
// Prerendered at build time, so the content store never ships in the runtime worker.
export async function GET() {
  const g = await contentSitemapGroups();
  return renderUrlset([...g.pages, ...g.articles, ...g.tips]);
}
