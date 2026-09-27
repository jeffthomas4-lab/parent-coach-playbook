// Sentry browser SDK init for parentcoachdesk.com.
//
// Loaded asynchronously after first paint (see BaseLayout). The @sentry/astro
// integration keeps source-map upload and build plumbing, but the client SDK
// is NOT auto-injected into the critical page bundle anymore — that was
// ~50 KiB gzip of marketing JS.
//
// Replay stays omitted (privacy). Error reporting still works once this
// module boots; CSP connect-src already allows the ingest host.
import * as Sentry from '@sentry/astro';
import { scrubSentryEvent } from './sentry-worker';

let booted = false;

export function initBrowserSentry(): void {
  if (booted) return;
  booted = true;

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
}
