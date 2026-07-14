import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Plain Vitest against extracted handlers, per Pillar 9 of the Website Build
// Standard ("plain Vitest against extracted handlers where the app doesn't
// fit @cloudflare/vitest-pool-workers"). This site's API routes import `env`
// from 'cloudflare:workers' (real only inside workerd), so tests call the
// exported POST handler directly with a hand-built context object, and the
// alias below points that import at a mutable test double instead. See
// tests/helpers/context.ts and tests/mocks/cloudflare-workers.ts.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    globals: false,
  },
  resolve: {
    alias: {
      'cloudflare:workers': path.resolve(__dirname, 'tests/mocks/cloudflare-workers.ts'),
    },
  },
});
