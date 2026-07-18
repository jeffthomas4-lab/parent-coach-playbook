// Sentry browser SDK init for parentcoachdesk.com.
//
// Auto-detected by @sentry/astro (client). The DSN is a build-time public
// value supplied via PUBLIC_SENTRY_DSN (Sentry DSNs are safe to embed in the
// browser bundle). With no DSN set, the SDK stays disabled, so builds and
// deploys without Sentry configured are unaffected — nothing is sent.
import * as Sentry from '@sentry/astro';
import { scrubSentryEvent } from './src/lib/sentry-worker';

const dsn = import.meta.env.PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: import.meta.env.PUBLIC_SENTRY_ENVIRONMENT ?? 'production',
  // PCD privacy pillar: never attach PII (IP, cookies, headers) by default.
  sendDefaultPii: false,
  // Conservative performance sampling; raise deliberately if needed.
  tracesSampleRate: 0.1,
  // Same minimization as the server: strip URLs/query strings/headers/cookies/
  // body/user/breadcrumb URLs before anything leaves the browser.
  beforeSend: (event) => scrubSentryEvent(event),
  beforeSendTransaction: (event) => scrubSentryEvent(event),
  // Session Replay intentionally omitted (privacy). Enable explicitly later.
});
