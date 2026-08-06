import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { integrationTests } from './test-classification';

// Agent pre-flight suite.
//
// WHY THIS EXISTS (2026-08-06). Alfred runs a test pass before staging affiliate
// swaps and is instructed to abort on red. That rule is correct — an agent must
// never stage a change on top of a broken build. But it silently turned into
// "Alfred never runs at all", because the unit suite carried failures no agent
// can fix:
//
//   - Three workflow-contract tests read .github/workflows/*.yml, deleted with
//     GitHub Actions on 2026-08-05. (Fixed; those tests now assert the local
//     deploy path instead.)
//   - The Access evidence gates below, which are red because the protected-route
//     contract grew from 59 to 69 routes and the recorded probe evidence has not
//     caught up. Refreshing it needs two live authenticated browser sessions
//     against production, per coordination/GATE-READINESS-authenticated-access-probe.md.
//     An unattended agent cannot produce that, and must never fabricate it.
//
// So the pre-flight excludes exactly the gates that require a human at a browser,
// and nothing else. Everything an agent's own change could plausibly break still
// runs, and a red pre-flight still means stop.
//
// This is deliberately NOT the release gate. `npm run test:unit` and
// `npm run ci:release` still run the full suite, Access gates included. If you
// find yourself wanting to add a file to the list below, ask first whether the
// test is genuinely un-runnable without a human, or just inconvenient.
export const humanEvidenceGates = [
  'tests/access-evidence.test.ts',
  'tests/access-evidence-cli.test.ts',
  'tests/anonymous-admin-probe.test.ts',
];

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: [...integrationTests, ...humanEvidenceGates],
    globals: false,
  },
  resolve: {
    alias: {
      'cloudflare:workers': path.resolve(__dirname, 'tests/mocks/cloudflare-workers.ts'),
    },
  },
});
