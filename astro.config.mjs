import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

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
