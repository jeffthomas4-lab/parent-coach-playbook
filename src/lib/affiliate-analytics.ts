const AFFILIATE_SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/;

export function affiliateSlugFromHref(href: string, siteOrigin: string): string | null {
  let url: URL;
  try { url = new URL(href, siteOrigin); } catch { return null; }
  if (url.origin !== siteOrigin) return null;
  const match = /^\/go\/([^/]+)\/?$/.exec(url.pathname);
  if (!match || url.search || url.hash) return null;
  let slug: string;
  try { slug = decodeURIComponent(match[1]); } catch { return null; }
  return AFFILIATE_SLUG.test(slug) ? slug : null;
}

export function affiliateClickEvent(slug: string) {
  if (!AFFILIATE_SLUG.test(slug)) return null;
  return {
    name: 'affiliate_outbound_click',
    parameters: { affiliate_slug: slug, transport_type: 'beacon' },
  } as const;
}
