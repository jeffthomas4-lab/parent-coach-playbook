# Astro 5 upgrade — post-deploy verification checklist

Run through this on **parentcoachdesk.com** to confirm the upgrade held. Hard-refresh first (Ctrl+Shift+R) so you're not looking at a cached page. Anything that fails, paste it into the next conversation.

## 1. Smoke test
- [ ] Homepage loads with no visible breakage.
- [ ] View source → `<meta name="generator" content="Astro v5.x">` (confirms the new build is live, not a cache).
- [ ] Click into 3–4 random article pages from the homepage — they render with images and styling.

## 2. Navigation (the things that broke last time)
- [ ] **Reads**, **Gear Files**, and **Tools** dropdowns open on click (desktop).
- [ ] **Camps** appears in the top nav and links to /camps/.
- [ ] Mobile menu: shrink the window (or use your phone) and the **Menu** button opens the flyout.
- [ ] Dropdown links inside each menu actually navigate.

## 3. Browser console (catches CSP-blocked scripts)
- [ ] Open DevTools → Console on the homepage. No red errors, especially nothing saying *"Refused to execute inline script"* or *"Content Security Policy"*.
- [ ] Same check on a camp detail page (the map page) and the cost calculator page.

## 4. Dynamic / server-rendered pages (the D1-backed parts)
- [ ] /camps/ — the camps directory lists camps (not empty).
- [ ] A single camp page (/camps/<something>/) loads, including the map.
- [ ] /cost-calculator/ — the calculator runs and totals update.
- [ ] /search/ — search returns results.
- [ ] On-page filters work: /reads/the-hard-stuff/, /coaching-tips/, /body/ (the sport/age/topic filters).
- [ ] Newsletter signup form submits without error.

## 5. Sitemaps & SEO
- [ ] /sitemap.xml — loads and is a **sitemap index** pointing to sitemap-content.xml and sitemap-camps.xml.
- [ ] /sitemap-content.xml — loads, lots of URLs.
- [ ] /sitemap-camps.xml — loads and lists your approved camps (this is the live D1 one).
- [ ] /rss.xml — loads.
- [ ] /robots.txt — still points at /sitemap.xml.

## 6. Admin (behind Cloudflare Access)
- [ ] /admin/editorial/ — the dashboard loads after the Access prompt.
- [ ] Click a "preview" link for a draft piece (/admin/preview/...) — it renders. These are now prerendered, so confirm a draft you know exists still shows.

## 7. Content integrity (we restored ~59 files from git during the upgrade)
- [ ] Spot-check a few that had been corrupted: /decisions/should-my-kid-play-travel-sports/, /recruiting/wrestling-recruiting-guide/, /rules/flag-football/, /news/pop-warner-weight-age-matrix-2026/. Each should have a full body, not a stub.

## 8. Worker size headroom (free-plan ceiling)
- [ ] Note from the last deploy: the worker bundles to **0.59 MiB / ~158 KiB gzipped**, far under the 3 MiB free limit. If a future deploy ever fails with a 3 MiB error again, it means a new `prerender = false` page started importing `astro:content` and pulled the content store back into the worker — check that first.

## 9. Loose end to decide
- [ ] `src/pages/what-to-buy/[slug].astro.WIP-backup-2026-06-15.txt` — your unfinished "fallback category" edit, saved aside during the upgrade. Decide whether to resume it or delete it.

---
**If everything above passes, the Astro 5 upgrade is fully clean.** Quick reference for what changed: Astro 4.16 → 5.18, Cloudflare adapter 11 → 12, `output: hybrid` → `static`, sitemap split into static + SSR, admin preview prerendered, bundled scripts forced external (for the CSP), and Camps restored to the nav.
