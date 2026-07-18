export const integrationTests = [
  'tests/customer-lifecycle.integration.test.ts',
  'tests/customer-journey-monitor.test.ts',
  'tests/directory-idempotency-rehearsal.test.ts',
  'tests/editorial-records-migration.test.ts',
  'tests/integrated-failure-isolation.test.ts',
  'tests/middleware.test.ts',
  'tests/trust-migration-rehearsal.test.ts',
  'tests/worker-entry-boundary.test.ts',
  'tests/api/admin-trust-delivery-reconcile.test.ts',
  'tests/api/admin-trust-draft-approve.test.ts',
  'tests/api/trust-request.test.ts',
];

// These transport composition roots are exercised by the integration suite.
// They are excluded only from the push-time unit metric, not from testing.
export const integrationOnlySource = [
  'src/worker.ts',
  'src/pages/api/admin/trust/deliveries/[[]attemptId[]]/reconcile.ts',
  'src/pages/api/admin/trust/drafts/[[]draftId[]]/approve.ts',
  'src/pages/api/trust/request.ts',
];
