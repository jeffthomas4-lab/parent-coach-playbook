# Link-checker Worker status

**Status: paused / not deployable.** This project is retained as a future
link-health option, not an active production service.

Before any deployment, an approved implementation increment must:

1. replace both placeholder D1 identifiers in `wrangler.toml` with the intended
   isolated database binding;
2. apply and verify `schema.sql` against that non-production database;
3. configure `ADMIN_API_KEY` as a Worker secret and use only a bearer
   `Authorization` header for the manual endpoint;
4. run bounded link-check smoke coverage against staging;
5. obtain explicit approval before enabling its cron trigger or a production
   route.

The Worker never receives a browser query-string secret. Its manual endpoint is
`POST /` with `Authorization: Bearer <ADMIN_API_KEY>`.
