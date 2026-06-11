import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// Rehype plugin: decorates links in markdown content at build time.
// - External links (http/https): open in new tab, rel noopener noreferrer
// - Affiliate redirect links (/go/...): open in new tab, rel sponsored nofollow noopener
// HTML anchors already carrying these attributes are overwritten with the same
// values, so the plugin is a no-op for hand-coded cards.
function rehypeAffiliateRel() {
  const walk = (node) => {
    if (node.type === 'element' && node.tagName === 'a') {
      const href = node.properties?.href;
      if (typeof href === 'string') {
        if (href.startsWith('/go/')) {
          node.properties.rel = ['sponsored', 'nofollow', 'noopener'];
          node.properties.target = '_blank';
        } else if (href.startsWith('http://') || href.startsWith('https://')) {
          node.properties.rel = ['noopener', 'noreferrer'];
          node.properties.target = '_blank';
        }
      }
    }
    if (node.children) node.children.forEach(walk);
  };
  return (tree) => walk(tree);
}

// https://astro.build/config
export default defineConfig({
  site: 'https://parentcoachdesk.com',
  // Hybrid: most pages prerender (static). Pages with `export const prerender = false`
  // run server-side at the edge. Used by the camps repo for SSR + D1 access.
  output: 'hybrid',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  build: {
    format: 'directory',
  },
  markdown: {
    rehypePlugins: [rehypeAffiliateRel],
  },
  // Permanent redirects for renamed URLs. Preserves inbound links from emails,
  // social, and articles published before the slug changed.
  redirects: {
    '/resources/drive-home-playbook': '/resources/what-to-say-when',
    '/resources/drive-home-playbook/': '/resources/what-to-say-when/',
  },
  image: {
    domains: ['cdn.sanity.io'],
  },
  vite: {
    ssr: {
      noExternal: ['@fontsource/*'],
    },
  },
});
