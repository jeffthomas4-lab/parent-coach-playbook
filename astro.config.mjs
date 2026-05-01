import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://parentcoachplaybook.com',
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
  image: {
    domains: ['cdn.sanity.io'],
  },
  vite: {
    ssr: {
      noExternal: ['@fontsource/*'],
    },
  },
});
