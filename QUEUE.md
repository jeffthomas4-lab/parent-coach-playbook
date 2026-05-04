# Post queue

The site publishes itself. You write a post, set a future date, push it. The cron worker rebuilds the site every morning and the post goes live on its date. No button to push.

This file is the operator manual. Read it once.

---

## Queue a post

1. Write the post in `src/content/articles/your-slug.md` like normal.
2. Set `publishedAt` to the date you want it live.
3. Set `draft: false`.
4. Push to GitHub.
5. Run the deploy from `About Me/Deployments.md` once. After that, the cron handles it.

Future-dated posts are excluded from every page that lists articles, the RSS feed, the sitemap, and the search index. They build into `dist/` only when the build runs on or after the date.

```yaml
---
title: "What you say in the *first 90 seconds* shapes the next week"
dek: "Optional subhead."
phase: "drive-home"
sport: "baseball"
age: "8-10"
publishedAt: 2026-06-13     # the day it goes live
draft: false
---
```

A post with `draft: true` never publishes regardless of the date. A post with `publishedAt` in the past goes live on the next build.

---

## How the queue actually works

One file does all the gating: `src/lib/publishFilter.ts`. Every page that lists articles, every static path generator, the RSS feed, and the sitemap calls `isLive(data)`. That function returns true only when `!draft && publishedAt <= now`.

When the daily cron runs, it fires the Cloudflare Pages deploy hook. Pages rebuilds the site. The build runs `now()` and any post whose date has passed gets included this time around.

That means if you queue ten posts at 8am dated for the next ten Mondays, you ship once and the site publishes one a week for ten weeks. You can also queue them to drop daily, or three a week, or whatever rhythm you want. The cron doesn't care. The build picks up whatever is eligible.

---

## Initial setup (do this once)

### 1. Create the Pages deploy hook

Cloudflare dashboard → Pages → `parent-coach-playbook` → Settings → Builds & deployments → Deploy hooks → Add deploy hook.

Name it `scheduled-publish`. Branch: `main`. Copy the URL it gives you. It looks like `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/<long-id>`.

### 2. Deploy the cron worker

`npm install` first, every time. Without a local `node_modules` in `worker-cron`, `npx wrangler` walks up the tree, hits the parent project's Astro Cloudflare adapter, and refuses to deploy with "It looks like you've run a Workers-specific command in a Pages project." Local install fixes it.

```powershell
cd "$HOME\Desktop\Claude Cowork\Outputs\parent-coach-playbook\worker-cron"
npm install
npm run secret:hook
# paste the deploy hook URL when prompted
npm run secret:key
# pick any string, save it in your password manager
npm run deploy
```

The npm scripts pass `--config ./wrangler.toml` explicitly so Wrangler can't get confused about which project it's in.

Confirm:

```powershell
npx wrangler deployments list --config ./wrangler.toml
```

The cron schedule is set in `worker-cron/wrangler.toml`. Default is `0 13 * * *` which is 6am Pacific in summer, 5am Pacific in winter. Change the cron line if you want a different time. Cloudflare uses UTC.

### 3. Test it

Open this URL in a browser, replacing the placeholders:

```
https://parent-coach-playbook-cron.<your-subdomain>.workers.dev/?key=YOUR_MANUAL_TRIGGER_KEY
```

Should return JSON like `{"source":"manual","status":200,"body":"..."}`. If you see a 403, the key is wrong. If you see a 502, the deploy hook URL is wrong.

Watch the Pages dashboard. A new build should start within a few seconds.

---

## Daily operation

You don't operate it. That's the point.

Things to check once a month:

- Cloudflare → Workers & Pages → `parent-coach-playbook-cron` → Logs. You should see one entry per day, all 200s.
- Cloudflare → Pages → deployments. You should see one auto-deploy per day at the cron time. If a build fails, the post stays unpublished and you find out by checking either dashboard.
- Run `git log src/content/articles --since="30 days ago"` to see what got committed but not yet shipped.

---

## Common operations

**Publish a queued post early.** Open the manual trigger URL above. The site rebuilds in ~2 minutes.

**Pull a post out of the queue.** Set `draft: true` and push. Next build, it disappears.

**Slip a post by a week.** Edit `publishedAt`, push.

**Schedule a batch.** Write five posts in one sitting, set `publishedAt` to the next five Fridays, push them all. The site ships one a week with no further action.

**Check what's queued without pushing anything.** From the project root:

```powershell
node -e "const fs=require('fs');const m=require('gray-matter');const dir='src/content/articles';fs.readdirSync(dir).forEach(f=>{const p=dir+'/'+f;const d=m(fs.readFileSync(p,'utf8')).data;if(d.publishedAt&&new Date(d.publishedAt)>new Date()&&!d.draft){console.log(d.publishedAt.toISOString().slice(0,10),'  ',d.title)}});"
```

(That works after `npm install gray-matter` once. Or just look at the files.)

---

## What can go wrong

**"Workers-specific command in a Pages project" error on deploy.** Wrangler walked up from `worker-cron` and detected the parent Astro project as Pages. Run `npm install` inside `worker-cron` first. Then use `npm run deploy` (the npm script passes `--config ./wrangler.toml` explicitly). If you still get the error, you ran `npx wrangler` directly without the explicit config — switch to `npm run deploy`.

**Deploy hook URL changed.** Cloudflare lets you delete hooks. Don't. If you do, regenerate and run `npm run secret:hook` again.

**Cron stopped firing.** Cloudflare requires the worker to be on a paid plan if you exceed the free tier. The free tier is 100k requests/day, far above what one daily ping uses. If billing lapses, the worker pauses. Cloudflare emails about it.

**A post built but didn't appear on the homepage.** The homepage shows the most recent 8 in the feed. The post is probably live at its real URL, just pushed off the front page. Check `/reads/`.

**Two posts dated for the same day.** Both publish. The site doesn't enforce one-a-day spacing. That's deliberate. If you want exactly one per day, space the dates yourself.
