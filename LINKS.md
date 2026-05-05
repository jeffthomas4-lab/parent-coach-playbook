# Link health

Every external URL on the site is tracked. A daily Cloudflare Worker validates a rolling subset, surfaces broken links to the `/admin/link-health/` dashboard, and tries to find replacements automatically.

This file is the operator manual.

---

## How it works

1. **Build-time manifest.** Every `npm run build` runs `scripts/build-link-manifest.mjs` first. The script walks `src/content/**/*.md` and `src/pages/**/*.astro`, extracts every `https?://` URL, and writes `public/link-manifest.json`. The manifest ships with the site as a static asset.

2. **Cron worker** (`worker-link-checker/`). Runs daily at 09:00 UTC (1am PST / 2am PDT) — off-peak for most external hosts. On each run:
   - Fetches the manifest from the deployed site
   - Upserts new URLs into the D1 `link_health` table
   - Picks the next 50 due links (broken first, then never-checked, then oldest)
   - Checks each one (HEAD with GET fallback, follows redirects, real User-Agent)
   - Writes status to D1
   - For broken links, queries Wayback Machine for the last good snapshot and generates a Google search query string for finding the replacement

3. **Admin dashboard** at `/admin/link-health/`. SSR page that reads from D1. Filter by All / Broken / Redirected / Never-checked. Each broken link shows the Wayback snapshot URL and a Google-search button to find the moved page.

4. **Rolling cadence.** With 50 checks per day and a 180-day rotation target, every link gets checked at least every 4 days at 1,000 URLs total or every 20 days at 5,000 URLs. Adjust `LINKS_PER_RUN` in `worker-link-checker/wrangler.toml` to tune.

---

## What the worker does when a link is broken

Three things, in order:

**1. Follows redirects automatically.** If the host moved cleanly (301/302), the dashboard shows the redirected URL. If the redirect goes to a different host (e.g., USA Lacrosse moving to a new domain), it's flagged as `redirected_off_host`.

**2. Queries Wayback Machine.** Free API, no key required. Returns the most recent Internet Archive snapshot URL. Surfaced in the dashboard as `→ Wayback snapshot`.

**3. Generates a Google search query.** Reconstructs a `site:hostname keyword keyword` query from the URL path. Surfaced as `→ Search for replacement`. You click it, find the new URL, update the source file.

**Not implemented yet but easy to add:** auto-suggest a replacement URL via the Bing or Google Search API. Requires an API key. The current "click the search query" flow is zero-cost and works for most cases.

---

## Initial setup (do this once)

### 1. Create the D1 schema

The link-checker shares the existing `parent-coach-playbook` D1 database with the camps directory. Run the schema migration:

```powershell
cd "$HOME\Desktop\Claude Cowork\Outputs\parent-coach-playbook\worker-link-checker"
npm install
npm run schema
```

That creates the `link_health` table and indexes.

### 2. Get the D1 database ID

```powershell
npx wrangler d1 list
```

Copy the `database_id` for `parent-coach-playbook` and paste it into `worker-link-checker/wrangler.toml` (replace `REPLACE_WITH_YOUR_D1_ID`).

### 3. Set the admin secret

```powershell
npm run secret:admin
# pick any string; this is used to authenticate the manual trigger URL
```

### 4. Deploy the worker

```powershell
npm run deploy
```

### 5. Trigger the first run manually

Open this URL in a browser:

```
https://parent-coach-playbook-link-checker.<your-cloudflare-subdomain>.workers.dev/?key=YOUR_ADMIN_KEY
```

Should return JSON like `{"ok": true, "checked": 50, "broken": 3, "redirected": 1}`. Then visit `/admin/link-health/` on the live site to see the dashboard populated.

---

## Daily operation

You don't operate it. Check the dashboard once a week:

- `/admin/link-health/` — filter by Broken
- For each broken link: click the Wayback snapshot or the Search for replacement, find the new URL
- Update the source file (the dashboard shows which file uses each URL)
- Push to GitHub, redeploy

The dashboard refreshes from D1 on every page load, so updates are live.

---

## What to do when a link breaks

Standard playbook:

1. **Check the Wayback snapshot.** If the original page is archived and the content is what you cited, you can either keep the citation as-is (the host might come back) or update the URL to the Wayback version.

2. **Search for the replacement.** Click the Google search button. Look for the same content on the same host, or a successor URL on a different host (e.g., a re-org).

3. **Update the source file.** The dashboard shows which file(s) use the URL. Edit the file(s), update the URL, push.

4. **If the source moved to a different host.** Update the citation label too if needed (e.g., "US Lacrosse" → "USA Lacrosse").

5. **If the source no longer exists at all.** Replace with a stable equivalent (governing body homepage, Wayback, or a different reputable source). If no equivalent exists, remove the citation and reword the claim.

---

## Edge cases

**Amazon links and other bot-blocked hosts.** The worker rate-limits Amazon, Twitter/X, and LinkedIn at 30 seconds per request and uses a real User-Agent. Even so, ambiguous responses (CAPTCHAs, "are you a robot" pages) get logged as `broken` with notes; treat those as "needs manual review" not "actually broken."

**Transient 5xx errors.** Servers occasionally return 503 for unrelated reasons. The worker treats 5xx as not-broken (broken = 4xx only) and re-checks next cycle. Repeated 5xx for the same URL across multiple cycles is worth a manual look.

**HEAD-rejected hosts.** Some servers return 405 for HEAD. The worker falls back to GET. Note shows `HEAD not supported; checked via GET`.

**Off-host redirects.** When a URL redirects to a different host, the worker still considers it OK (final URL was 2xx) but flags `redirected_off_host = 1` for review. The new host is the new home; update the source citation if you want it to match.

---

## What this doesn't do

- **Doesn't validate content.** A 200 response doesn't mean the page still says what you cited. Stat-based claims need periodic manual review (see the `factCheckGoodThrough` field in the editorial schema).
- **Doesn't catch internal links.** Astro's build step does that.
- **Doesn't email alerts.** Add Resend or Cloudflare Email Routing later if you want notifications.
- **Doesn't auto-replace URLs in source files.** Manual update required — the dashboard surfaces what to change.

---

## Files in this system

- `scripts/build-link-manifest.mjs` — extracts URLs at build time
- `public/link-manifest.json` — the manifest (regenerated each build)
- `worker-link-checker/` — the cron worker package
- `worker-link-checker/schema.sql` — D1 schema
- `worker-link-checker/src/index.ts` — worker logic
- `src/pages/admin/link-health/index.astro` — dashboard
- `LINKS.md` — this file
