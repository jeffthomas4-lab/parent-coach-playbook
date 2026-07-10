import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://activityradar.com',
  // Hybrid: SEO landing pages prerender (static); search + org/program pages
  // run server-side at the edge with D1 access (export const prerender = false).
  output: 'hybrid',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  build: { format: 'directory' },
});
