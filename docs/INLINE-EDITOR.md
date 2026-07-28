# Inline Editor

Click any highlighted text on the homepage, edit it, save. It is live immediately. No PR, no build, no deploy approval.

Built 2026-07-28. Scope decisions are Jeff's, recorded below so nobody relitigates them by accident.

## How to use it

1. Sign in through Cloudflare Access as you would for `/admin`.
2. Go to the homepage. A dark toolbar appears bottom-left. Public visitors never see it, and never receive the editor script.
3. `Alt+E` or click **Edit page**. Editable text picks up a dashed outline.
4. Click the text, type.
5. `Cmd+S` (or `Ctrl+S`) saves. `Esc` discards. `Cmd+Shift+R` reverts that region to the version in git.

The status chip tells you what happened. It says **"Saved. Live now."** only when the server confirmed the write. Every other outcome says something else, on purpose.

## What is editable and what is not

**Editable (KV overlay, instant).** Homepage hero eyebrow, headline, headline accent, subhead, both buttons, and the three section eyebrow labels. Listed in `src/lib/editable-regions.ts`, which is the allowlist.

**Not editable, deliberately:**

- **Meta titles and descriptions.** Jeff's call. An unreviewed meta tag has a bigger SEO blast radius than the convenience is worth. They stay in git.
- **Article, guide, pillar, news and coachingTips bodies.** Those keep markdown-in-git, Penny's review gate, and their `factCheckGoodThrough` stamps.
- **Anything on the other 1,851 pages.** See the routing constraint below.

Two tests in `tests/overlay-route-coverage.test.ts` fail the build if someone adds a meta or long-form key to the manifest.

## The routing constraint (read this before adding a page)

The site is `output: 'static'`. Pages are prerendered at build time and served from Cloudflare's edge without the Worker running. The overlay is applied by `HTMLRewriter` **inside the Worker**, so a page only picks up overlay values if it is in `assets.run_worker_first`.

A region on a page that is not Worker-routed looks editable, saves successfully, and never changes the live page. That failure is silent, which is why it is a build-time assertion instead of a runtime check.

**To make another page editable, all three, or none:**

1. Add the path to `OVERLAY_ROUTES` in `src/lib/overlay-rewriter.ts`
2. Add the path to `assets.run_worker_first` in **both** `wrangler.jsonc` and `wrangler.production.jsonc`
3. Add its regions to `src/lib/editable-regions.ts`

`tests/overlay-route-coverage.test.ts` enforces the pairing.

There is deliberately no `'*'` route. Nav and footer are not inline-editable, because they render on 1,852 pages and only one of them is Worker-routed. Chrome changes go through a normal deploy.

Each route added to `run_worker_first` stops being a pure edge asset hit. Keep the list short.

## Why HTMLRewriter and not the obvious alternatives

| Approach | Why not |
|---|---|
| Client-side DOM swap | Flash of old copy, and crawlers mostly see the fallback. Bad for a headline. |
| Flip pages to SSR | Correct, but pays render cost across 1,852 pages. |
| **HTMLRewriter at the edge** | **Streaming, no flash, final text is in the HTML source, article pages stay pure static.** |

## Fail-open, by design

Every editable region ships an in-repo fallback string. If KV is empty, cold, misconfigured, unreachable, or switched off, the page renders exactly as it does today from that fallback.

Nothing in the read path throws. A KV read failure is a miss, not an error. This property is what makes the kill switch a real one-variable rollback rather than an outage.

## Rollback, cheapest first

1. **Per-region revert.** `Cmd+Shift+R` on a focused region, or `DELETE /admin/api/content/:key`. Deletes the override; the page returns to its git fallback.
2. **Snapshot.** `node scripts/overlay-snapshot.mjs` dumps every stored value to `backups/overlay/`. Read-only, safe to run any time.
3. **Kill switch.** Set `CONTENT_OVERLAY_ENABLED=false` in `wrangler.production.jsonc` and redeploy. Every region falls through to its repo fallback. One variable, no code change.

## Drift

Overlay values silently diverging from git is the main long-term risk of this design.

`node scripts/overlay-snapshot.mjs --drift-only` reports how many regions differ from their in-repo fallback and how long they have. Run it periodically. When a region has been overridden for a while and the wording is settled, copy it back into the `fallback` prop so git stays the eventual record.

## Security model

- **Auth.** Reuses `src/lib/admin-auth.ts` with no new system: RS256 Access JWT verified against the Access team's published keys, `iss` / `aud` / `exp` checked, email matched against `ADMIN_EMAILS`. A spoofed `Cf-Access-Authenticated-User-Email` header gets nowhere, because the email comes from verified claims.
- **No client-side KV.** Every write goes through `/admin/api/content/:key`. The browser never touches the namespace.
- **Allowlist, not denylist.** An unregistered key is rejected before any parsing. That is what keeps the endpoint from being an arbitrary KV write.
- **Server-side validation always.** `sanitize()` runs on the Worker regardless of what the client did. `text` regions are escaped whole. `richInline` allows `<strong>`, `<em>`, and `<a href>` pointing at a site-relative path or an `https` URL. Nothing else survives, and unbalanced tags are rejected rather than quietly fixed.
- **CSRF.** `requireSameOrigin` on every mutation.
- **No shared caching of admin responses.** A page carrying the editor is returned `private, no-store`.

`tests/overlay-sanitize.test.ts` covers 18 adversarial payloads including script tags, event handlers, `javascript:` and `data:` URLs, protocol-relative links, and a canary check that raw input never appears in an error message.

## Receipts (Pillar 13 item 3)

An inline content edit is an admin mutation on production copy, so it emits a receipt. `content_overlay_receipts` in `PCD_OPS_DB`:

- **Append-only**, enforced by `BEFORE UPDATE` and `BEFORE DELETE` triggers, not convention.
- **Hash-chained.** Each row stores the previous row's hash. Modified, deleted or reordered rows break the chain and `verifyChain()` names the first broken link.
- **Redacted.** SHA-256 digest of the email, never the address. Domain kept for triage. Before/after values bounded at 200 characters.
- **Complete.** Rejected, conflicted and failed attempts are recorded too. A log of successes only cannot answer "who tried what".

**If the receipt cannot be written, the edit is rolled back and reported as failed.** A protected mutation never stands without a record of it.

`tests/overlay-receipts.test.ts` proves tamper detection for all four cases.

## Concurrency

Each region carries a revision. The editor sends the revision it loaded with; a mismatch returns 409 and the editor shows the other person's version instead of clobbering it.

## Known gaps

- **No staging-promote step.** Jeff's call: instant is the point. If unreviewed production copy becomes a problem, the drift report and the existing article-refresh pass are the backstop, and a promote step can be added later.
- **Nightly snapshot is not scheduled yet.** The script exists; wiring it to the existing PCD backup job is open.
- **Not yet extracted for the other four sites.** PCD-first was the deliberate choice. Extract after this has run in production for a while.
- **Lighthouse re-check pending.** Needs a real mobile run against the deployed homepage to confirm LCP and CLS are unchanged.
