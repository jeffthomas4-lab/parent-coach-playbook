# Deploy guide

Top to bottom. Don't skip steps. The whole thing takes about 25 minutes.

You will use three accounts:
- **GitHub** (jeffthomas4-lab) — where the code lives
- **Cloudflare** — where the site is served from
- **Cloudflare Registrar or your registrar** — where parentcoachplaybook.com is registered

Optional, can be done later:
- **Sanity** — CMS, see `studio/README.md`
- **Kit (formerly ConvertKit)** — newsletter

---

## 0. Pre-flight check

First, clean up two folders the build sandbox left behind. Open PowerShell in the project folder and run:

```powershell
Remove-Item -Recurse -Force .git, node_modules -ErrorAction SilentlyContinue
```

(Mac/Linux: `rm -rf .git node_modules`)

Then check your tooling:

```bash
node --version    # should be v18+ or v20+
npm --version     # should be 9+
git --version     # any recent version
```

If any are missing, install Node from https://nodejs.org and Git from https://git-scm.com.

---

## 1. Get the code on your machine

If you're reading this from inside the project folder already, you have it.
Confirm by running:

```bash
cd parent-coach-playbook
ls
```

You should see `package.json`, `src/`, `astro.config.mjs`, etc.

Install dependencies and verify the build runs cleanly:

```bash
npm install
npm run build
```

If the build succeeds, you'll see `dist/` appear. Open `dist/index.html` in a browser to confirm the homepage renders.

---

## 2. Initialize git and push to GitHub

From inside the `parent-coach-playbook/` folder:

```bash
git init
git add .
git commit -m "Initial commit: Parent-Coach Playbook v0.1"
git branch -M main
```

Now create the GitHub repo. Two options:

### Option A — GitHub CLI (fastest)

```bash
# install once: brew install gh   (or https://cli.github.com)
gh auth login
gh repo create jeffthomas4-lab/parent-coach-playbook --public --source=. --push
```

### Option B — GitHub web

1. Go to https://github.com/new
2. Repository name: `parent-coach-playbook`
3. Owner: `jeffthomas4-lab`
4. Public. **Don't** initialize with a README (you already have one).
5. Click Create repository
6. Then run, in your terminal:

```bash
git remote add origin https://github.com/jeffthomas4-lab/parent-coach-playbook.git
git push -u origin main
```

You should now see your code at https://github.com/jeffthomas4-lab/parent-coach-playbook.

---

## 3. Connect Cloudflare Pages to the repo

1. Log into Cloudflare → Workers & Pages → Pages tab → **Create application** → **Connect to Git**
2. Select GitHub. Authorize Cloudflare to access `jeffthomas4-lab/parent-coach-playbook`.
3. Pick the repo. Click **Begin setup**.
4. Configure the build:
   - Project name: `parent-coach-playbook`
   - Production branch: `main`
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: leave blank
5. **Environment variables** (click to expand). Add:

   | Name                              | Value                              |
   | --------------------------------- | ---------------------------------- |
   | `PUBLIC_SITE_URL`                 | `https://parentcoachplaybook.com`  |
   | `PUBLIC_KIT_FORM_ID`              | (leave blank for now)              |
   | `PUBLIC_KIT_LEAD_MAGNET_FORM_ID`  | (leave blank for now)              |
   | `NODE_VERSION`                    | `20`                               |

6. Click **Save and Deploy**. The first build takes 60–90 seconds.

When it finishes you'll get a URL like `parent-coach-playbook.pages.dev`.
Open it. Confirm the homepage renders, the three pillar pages work, and you can read all three sample articles.

---

## 4. Hook up the parentcoachplaybook.com domain

1. In Cloudflare Pages → your project → **Custom domains** → **Set up a custom domain**
2. Enter `parentcoachplaybook.com`. Click Continue.

If the domain is registered with Cloudflare Registrar, Cloudflare wires DNS automatically. Done.

If the domain is registered elsewhere, Cloudflare gives you the DNS records to add. Two ways:

**Recommended:** transfer the domain to Cloudflare Registrar. Free at cost. Best DNS performance. Settings → Domain Registration → Transfer Domains.

**Alternative:** keep your registrar but point the nameservers to Cloudflare. Cloudflare walks you through it. Once nameservers propagate (a few hours), the domain attaches to Pages automatically.

3. Add the apex `parentcoachplaybook.com` AND the `www.parentcoachplaybook.com` subdomain. Cloudflare will redirect www → apex.

4. Wait for SSL provisioning. Usually under 5 minutes. You'll see a green check next to the domain in Cloudflare Pages.

5. Visit https://parentcoachplaybook.com. The site should load with HTTPS.

---

## 5. Wire Kit (newsletter)

Skip if you're not using a newsletter yet.

1. Sign in to Kit. Create a new form. Style: **Inline**. Template: **Naked**.
2. Save it. Look at the form URL — it ends in something like `/forms/1234567`. That number is your form ID.
3. Make a second form for the lead magnet ("The Drive Home Playbook"). Set up an automation in Kit so signing up triggers an email with the PDF attached.
4. In Cloudflare Pages → Settings → Environment variables:
   - `PUBLIC_KIT_FORM_ID` = `1234567` (the main one)
   - `PUBLIC_KIT_LEAD_MAGNET_FORM_ID` = `7654321` (the lead magnet one)
5. Redeploy: Cloudflare Pages → Deployments → Retry deployment, or push any small commit.
6. Submit a test email on the live site. Confirm it lands in Kit.

---

## 6. Set up Sanity (optional, for editing without code)

See `studio/README.md`. The 5-minute version:

```bash
cd studio
npm install
npx sanity init --bare        # creates the cloud project, returns a projectId
# paste projectId into studio/sanity.config.ts AND ../.env as PUBLIC_SANITY_PROJECT_ID
npm run dev                   # opens local studio at localhost:3333
npm run deploy                # deploys hosted studio (free)
```

Until you migrate articles into Sanity, the site reads from `src/content/articles/` markdown files. Both can coexist.

---

## 7. Replace the placeholders before launch

These are still placeholders. Don't go wide until they're real:

- [ ] `public/og-default.png` — replace the `.txt` placeholder with a real 1200×630 PNG
- [ ] The lead magnet PDF — wire the actual file in Kit's automation
- [ ] Three sample articles — replace with real launch content
- [ ] About page — confirm bio copy reads how you want it
- [ ] `src/data/affiliates.json` — replace sample destination URLs with your real affiliate-tagged URLs

---

## 8. Workflow from here

Daily writing:

```bash
# from the project folder
git pull
# write a new article in src/content/articles/
git add .
git commit -m "New issue: [topic]"
git push
```

Cloudflare Pages auto-deploys every push to `main`. Build time ~60 seconds.

Branch previews: push to any branch other than `main` and Cloudflare gives you a preview URL. Use this for testing redesigns without breaking production.

---

## Troubleshooting

**Build fails on Cloudflare with "command not found: astro".**
Set `NODE_VERSION=20` in environment variables. Cloudflare defaults to an older Node.

**Fonts look wrong / fall back to Times.**
Hard refresh (Cmd+Shift+R / Ctrl+Shift+R). The @fontsource files are bundled into the build, no CDN.

**404s after deploy.**
Cloudflare Pages serves from `dist/`. Confirm your build output dir is set to `dist` in Cloudflare project settings.

**Custom domain stuck on "Verifying nameservers" for hours.**
Likely a registrar issue. Open a Cloudflare support ticket. Usually a 30-second fix.

---

## Hand-off

If you ever need to hand this off to a developer, point them at:
1. This `DEPLOY.md`
2. The `README.md`
3. The `studio/README.md`

Everything they need is in those three files plus `src/data/site.ts`.
