import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { integrationTests } from './test-classification';

export default defineConfig({
  test: {
    environment: 'node',
    include: integrationTests,
    globals: false,
    // The disposable D1 suite owns a Miniflare runtime. Keep the integration
    // boundary in one fork so native workerd failures cannot take down the
    // Vitest coordinator or be reported as a successful partial run on Windows.
    pool: 'forks',
    maxWorkers: 1,
    fileParallelism: false,
    // Explicit, generous bounds so a hung hook or test (e.g. a workerd
    // process that never returns from dispose()) surfaces as a real timeout
    // failure instead of blocking the run indefinitely with no signal. The
    // vitest defaults (5s test / 10s hook) are too tight for this suite's own
    // per-test overrides (up to 30s); these are the outer bound, not a
    // replacement for those overrides.
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
  resolve: {
    alias: {
      'cloudflare:workers': path.resolve(__dirname, 'tests/mocks/cloudflare-workers.ts'),
    },
  },
});
