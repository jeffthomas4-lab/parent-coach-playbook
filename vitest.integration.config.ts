import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { integrationTests } from './test-classification';

export default defineConfig({
  test: {
    environment: 'node',
    include: integrationTests,
    globals: false,
    // The disposable D1 suite owns a Miniflare runtime. Keep the integration
    // boundary in one thread so a worker-process crash cannot be reported as
    // a successful partial run on Windows.
    pool: 'threads',
    maxWorkers: 1,
    fileParallelism: false,
  },
  resolve: {
    alias: {
      'cloudflare:workers': path.resolve(__dirname, 'tests/mocks/cloudflare-workers.ts'),
    },
  },
});
