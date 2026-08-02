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
    // These two suites each own a real Miniflare/workerd native process
    // (see tests/helpers/disposable-ops-db.ts). This default config has no
    // pool/parallelism limits, so under `npm test` they can end up running
    // concurrently with each other, and customer-lifecycle even holds two
    // live Miniflare instances at once inside a single test. That native
    // process contention is what crashes the vitest worker fork ("Worker
    // exited unexpectedly"), not a test assertion failure. They already
    // belong to, and correctly run in, `npm run test:integration`
    // (vitest.integration.config.ts pins pool: 'threads', maxWorkers: 1,
    // fileParallelism: false for exactly this reason), which CI runs as the
    // "Integration paths" step in .github/workflows/ci.yml. Excluding them
    // here does not stop them running; it routes them to the config that
    // isolates native runtimes correctly.
    exclude: [
      'tests/customer-lifecycle.integration.test.ts',
      'tests/editorial-records-migration.test.ts',
    ],
    globals: false,
  },
  resolve: {
    alias: {
      'cloudflare:workers': path.resolve(__dirname, 'tests/mocks/cloudflare-workers.ts'),
    },
  },
});
