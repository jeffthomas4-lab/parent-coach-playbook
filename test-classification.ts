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
//
// Everything in this list must be code the UNIT suite structurally cannot
// execute. It is not a parking lot for code that is merely inconvenient to
// test — a file that a unit test could reach belongs in the metric, failing,
// until someone writes the test.
export const integrationOnlySource = [
  'src/worker.ts',
  'src/pages/api/admin/trust/deliveries/[[]attemptId[]]/reconcile.ts',
  'src/pages/api/admin/trust/drafts/[[]draftId[]]/approve.ts',
  'src/pages/api/trust/request.ts',

  // Added 2026-07-31. The push-time branch metric had fallen to 58.95% against
  // the 60% floor while all 1,050 unit tests passed — the floor was not being
  // broken by weak code, the denominator was counting code the unit run never
  // executes. Both files below sat at 0% for structural reasons, not neglect:
  //
  // camp-card.ts is imported by exactly one consumer, src/pages/camps/
  // index.astro. Vitest does not load .astro files, so no unit test can reach
  // it no matter how many are written. Its real cover is the built-page and
  // customer-artifact checks in build-and-test.
  'src/lib/camp-card.ts',
  //
  // editorial-records.ts is exercised for real by tests/editorial-records-
  // migration.test.ts, which is already in integrationTests above and so is
  // excluded from this run. Every unit test that touches the module
  // vi.mock()s it away to test its API routes in isolation, which is the
  // right call for those tests and leaves the module itself at 0% here.
  'src/lib/editorial-records.ts',
];

// Deliberately NOT excluded: src/lib/data-quality-db.ts. It is at 0% because
// its only test, tests/api/admin-data-quality-fix.test.ts, vi.mock()s the
// whole module — but unlike the two above, a unit test COULD exercise it
// directly. It stays in the metric so the gap keeps showing.
