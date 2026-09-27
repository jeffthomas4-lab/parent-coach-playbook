// Client SDK injection is disabled in astro.config.mjs so the heavy Sentry
// browser bundle is not part of critical page JS. Boot lives in
// src/lib/sentry-browser.ts and is deferred from BaseLayout after idle.
//
// Kept as a stub so docs/scripts that look for sentry.client.config.ts still
// find it, and so re-enabling auto-injection has an obvious place to land.
export {};
