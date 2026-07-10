import { defineConfig } from 'vitest/config';

// Plain Vitest against extracted handlers, per Pillar 9 of the Website Build
// Standard ("plain Vitest against extracted handlers where the app doesn't
// fit @cloudflare/vitest-pool-workers"). This site's API routes are Astro
// endpoints that read env off `locals.runtime.env`, so tests call the
// exported POST handler directly with a hand-built context object instead of
// running a full Workers runtime. See tests/helpers/context.ts.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globals: false,
  },
});
