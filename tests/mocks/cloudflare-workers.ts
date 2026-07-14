// Test double for the `cloudflare:workers` module (Node/Vitest can't resolve
// it directly — it's only real inside workerd). Routes import `env` from
// this module in production; here it's a single mutable object that
// tests/helpers/context.ts repopulates before each handler call. See
// vitest.config.ts for the alias that points 'cloudflare:workers' here.
export const env: Record<string, unknown> = {};
