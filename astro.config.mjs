import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://parentcoachplaybook.com',

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

  output: "hybrid",
  adapter: cloudflare()
});