# Parent Coach Desk — affiliate revenue & brand: best-practice plan

Written 2026-07-18. Covers the "convert to Parent Coach Desk" rename, the state of
the affiliate-link system (your revenue engine), what was fixed this session, and a
prioritized short- and long-term plan. Affiliate clicks are the whole revenue model,
so this is the money layer and deserves standing attention.

## Brand conversion status — mostly already done

The site source is already "Parent Coach Desk," so the big rename you were worried
about is largely complete:

- `src/data/site.ts` — canonical brand is `name: 'Parent Coach Desk'`.
- `package.json` — `"name": "parent-coach-desk"`.
- Zero occurrences of the brand phrase "Parent Coach Playbook" anywhere in `src/`.

What still said "Playbook" and was fixed this session (brand copy only, per your call):

- `kit-emails/` newsletter drafts — 5 "Parent Coach Playbook" → "Parent Coach Desk"
  replacements across 3 files. Kit account URLs and the Amazon tag were verified
  byte-identical before/after.

Deliberately left as-is because they are load-bearing identifiers, not brand copy
(renaming them breaks things and none are user-visible as a brand):

- **Amazon associate tag `parentcoachpl-20`** — registered in your Amazon Associates
  account; renaming it drops commissions to $0 until re-registered. Change only in
  the Amazon console first, then in code.
- **Bookshop ID `125074`** — your registered Bookshop affiliate account.
- **Kit newsletter URL `parent-coach-playbook.kit.com`** (3 refs in `src`) — your
  ConvertKit form subdomain. Rename inside Kit's dashboard if you want; the code
  just points at wherever the form lives.
- **D1 database, Workers, and GitHub repo** named `parent-coach-playbook` — your own
  architecture notes keep physical names on purpose (same as `activity-radar`).

## Headline finding — the daily link net is not running

The Linda task assumes a daily Cloudflare Worker already sweeps every affiliate link
for hard 404s. It does not exist right now, confirmed three ways: no link-checker
worker is deployed in the account; `worker-link-checker/wrangler.toml` had a
placeholder database id (now filled in — see below); and there is no `link_health`
table in the `parent-coach-playbook` D1 (8336fa9f…) or `activity-radar` (8cc3694a…).
The manifest it would read (`public/link-manifest.json`, 680 links, ~220 Amazon) is
built and committed, but nothing consumes it on a schedule.

So today **Linda is the only thing checking your affiliate links**, weekly on a
~monthly rotation — a dead link outside the week's batch can lose commissions for up
to four weeks. Turning the worker on is the single highest-value fix.

## What's genuinely solid (leave alone)

- Catalog: 245 slugs, one associate tag used consistently, clean
  `{destination, retailer, campaign}` shape.
- Redirect hygiene: `/go/[slug]/` with `rel="sponsored nofollow noopener"`,
  `noindex`, and no UTM appended to Amazon/CJ (correct per Amazon's agreement).
- Compliance: FTC disclosure component above the first affiliate link, footer
  backstop, `/disclosure/` page, and the exact "As an Amazon Associate I earn from
  qualifying purchases" phrase present. No scraped prices. Above average.
- Linda's design: slug-based rotation, two-tier browser verification, Amazon
  throttling, and a Chrome-unavailable fallback. Best practice — kept in the revision.

## Fixed / staged this session (ready for your push)

1. Brand copy in `kit-emails/` (3 files) → Parent Coach Desk.
2. `worker-link-checker/wrangler.toml` → real D1 id `8336fa9f-…` filled in
   (preview id still a flagged TODO). This readies the worker for deploy.
3. (Earlier this session) camps map cluster-centering fix in
   `src/pages/camps/index.astro`.

These are working-tree edits only. Push them through the normal governed flow
(git segfaults in the sandbox, so run git from your own terminal).

## Short term (this week, low bandwidth)

1. **Deploy the link-checker worker.** With the DB id now set, add the preview id or
   remove that line, apply `worker-link-checker/schema.sql` to the
   `parent-coach-playbook` D1, set the `ADMIN_API_KEY` secret, and `wrangler deploy`.
   Restores the daily 404 net so Linda can stay on content degradation.
2. **Wire `build:manifest` into the build** so the link manifest never goes stale
   (it's a script in `package.json` but not called by CI/build today).
3. **Fix the two $0 links** — `photo-book-service` (Shutterfly, untagged) and
   `square-card-reader` (Square, untagged). Either join those programs and tag them,
   or repoint to a tagged Amazon equivalent. Flagged, not auto-changed, because the
   right answer depends on which programs you want to keep.
4. **Adopt the revised Linda task** (delivered alongside this — `LINDA-TASK-REVISED.md`).

## Long term (the revenue system, priority order)

1. **First-party click tracking — the keystone you're missing.** `/go/[slug]` is
   statically generated, so it cannot log clicks; you have no first-party view of
   what gets clicked. Convert it to an SSR/Worker route that writes
   `{slug, ts, referrer, campaign}` to D1 on each redirect. This one change unlocks
   the centralized `/admin/affiliates` dashboard you asked for (clicks by slug and
   campaign, CTR per page, link-health status per row) and lets you grow on data
   instead of guesses.
2. **Monthly reconciliation.** Join Amazon + CJ + Bookshop earnings to first-party
   clicks by campaign, rank slugs by revenue, double down on winners, retire dead
   weight. Growth without adding new networks.
3. **Upgrade the ~30 generic Amazon search links** (`amazon.com/s?k=…`) to specific
   ASINs — better conversion, easier for Linda to verify.
4. **Place the unplaced slugs** — several approved products sit in `affiliates.json`
   with no guide placement, so no clicks. A quarterly placement sweep is pure upside.
5. **Deconflict the three systems** — the 404 worker, Linda (degradation), and the
   governance/lifecycle + reconciler (economics) all touch slugs; give each a written
   lane. (Note: `src/data/affiliate-governance.json` and `reports/affiliate/lifecycle.json`
   referenced by the task were not found where expected — confirm that system is live.)
