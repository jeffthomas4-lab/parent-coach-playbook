import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { integrationOnlySource, integrationTests } from './test-classification';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: integrationTests,
    globals: false,
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts', 'src/pages/api/**/*.ts', 'src/worker.ts'],
      exclude: ['**/*.d.ts', ...integrationOnlySource],
      reporter: ['text', 'json-summary'],
      reportsDirectory: 'coverage/unit',
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60,
      },
    },
  },
  resolve: {
    alias: {
      'cloudflare:workers': path.resolve(__dirname, 'tests/mocks/cloudflare-workers.ts'),
    },
  },
});
