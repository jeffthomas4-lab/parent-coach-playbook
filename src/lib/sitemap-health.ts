export interface SitemapResponseMeta {
  status: 200 | 503;
  headers: Record<string, string>;
}

export function campSitemapResponseMeta(urlCount: number): SitemapResponseMeta {
  if (!Number.isInteger(urlCount) || urlCount < 0) throw new Error('invalid sitemap URL count');
  if (urlCount === 0) {
    return {
      status: 503,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-store',
        'Retry-After': '3600',
      },
    };
  }
  return {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  };
}
