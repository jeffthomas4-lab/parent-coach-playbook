import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// Rehype plugin: every affiliate redirect link in markdown content
// ([text](/go/slug/)) gets rel="sponsored nofollow noopener". Markdown link
// syntax cannot carry attributes, so this decorates them at build time.
// HTML anchors in content already carry the rel inline; this overwrites with
// the same value, so it is a no-op for those.
function rehypeAffiliateRel() {
  const walk = (node) => {
    if (node.type === 'element' && node.tagName === 'a') {
      const href = node.properties?.href;
      if (typeof href === 'string' && href.startsWith('/go/')) {
        node.properties.rel = ['sponsored', 'nofollow', 'noopener'];
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
