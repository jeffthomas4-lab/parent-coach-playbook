// Wrong-section article URLs -> 301 to the live address (2026-10-12 indexing fix).
//
// Articles move between sections over time, and old internal links, partner
// cross-links, and Google's crawl history keep the old prefix
// (/drive-home/<slug>/ after the piece moved to /game/, or the retired /coaches/
// and /dm-parent/ prefixes). GSC counted these as 404s. Those requests miss the
// static assets and Astro answers with the prerendered 404, which skips
// middleware, so the lookup lives here in the Worker and only runs on a 404.
// The slug -> path map comes from the static sitemap-articles.xml asset and is
// cached per isolate.
const ARTICLE_PREFIX_RE = /^\/(drive-home|drive-there|game|team-parent|decisions|body|coaches|dm-parent|reads|blog)\/([a-z0-9-]+)\/?$/;
const LOC_RE = /<loc>https:\/\/parentcoachdesk\.com(\/[a-z0-9-]+\/([a-z0-9-]+)\/)<\/loc>/g;

let cache: Promise<Map<string, string>> | null = null;

async function loadMap(assets: Fetcher, origin: string): Promise<Map<string, string>> {
  const res = await assets.fetch(new Request(`${origin}/sitemap-articles.xml`));
  if (!res.ok) throw new Error(`sitemap-articles ${res.status}`);
  const xml = await res.text();
  const map = new Map<string, string>();
  for (const m of xml.matchAll(LOC_RE)) if (!map.has(m[2])) map.set(m[2], m[1]);
  return map;
}

export async function articleRedirectFor(url: URL, assets: Fetcher | undefined): Promise<string | null> {
  if (!assets) return null;
  const m = ARTICLE_PREFIX_RE.exec(url.pathname);
  if (!m) return null;
  if (!cache) cache = loadMap(assets, url.origin).catch((e) => { cache = null; throw e; });
  const dest = (await cache).get(m[2]);
  if (!dest) return null;
  const here = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  return dest === here ? null : dest;
}
