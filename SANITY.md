# Sanity in this project (currently inactive)

A plain explanation of what Sanity is, what role it plays here, and when (if ever) to turn it on.

## Status

**Sanity is scaffolded but disconnected.** The website does not query it. All content lives in markdown files in `src/content/articles/`. The `studio/` folder holds the admin-panel scaffold and seven schemas, ready to deploy if we ever activate it.

A free Sanity cloud project exists with project ID `oasnvt90`. It contains zero documents.

## What Sanity is

A headless CMS. Three pieces:

1. **A web admin panel** ("Sanity Studio") where you log in to write and edit content in a form-based UI. Lives at a URL like `parent-coach-playbook.sanity.studio` once deployed.
2. **A cloud database** that stores what you write. Hosted by Sanity. Free tier covers our needs.
3. **An API** the website queries to display content. Read or write requests against the database.

Think of it as the "write-stuff-on-the-internet" half of WordPress, separated from the website itself. WordPress bundles editor + database + frontend. Sanity unbundles them: editor and database are theirs, frontend is yours (Astro).

## Why the original project setup recommended it

The first brief said: *"CMS: Sanity.io (headless, free tier covers our needs, lets me edit content without touching code)."*

That was the right call before we landed on the AI-driven workflow. Two real reasons:

1. **Non-technical editing.** Sanity lets a person who doesn't know git or markdown write a post in a browser. Click publish. Done.
2. **Structured content.** Articles, gear items, lead magnets, contributor bios are all different shapes. Sanity schemas let you build a form for each shape with validation.

The schemas in `studio/schemas/` are exactly that: forms-as-code for the seven content types this site uses.

## Why it's currently turned off

Once we landed on AI as the drafter and Jeff as the editor, the math changed. Markdown beats Sanity for this workflow because:

- AI tools output markdown natively. Sanity would require an extra "paste this into the browser" step.
- Save → git push → deploy is three commands. Sanity adds: log in → write → publish → trigger rebuild.
- Git history shows exactly what changed and lets you roll back. Sanity history is in their cloud and harder to diff.
- No login required for Claude or for Jeff at the terminal.

For a solo writer with AI assistance, markdown is faster and simpler. Sanity is overkill.

## When to flip the switch

Activate Sanity when one of these becomes true:

1. **A non-technical contributor joins.** Your sister-in-law writes one column a month and has never opened a terminal. Give her a Sanity login.
2. **Content gets image-heavy.** If gear posts start including 5+ images each with captions, a CMS is friendlier than maintaining file paths in markdown.
3. **You want to edit from your phone.** Sanity Studio works in mobile browsers. Markdown editing on a phone is painful.
4. **The team grows.** Three or more writers. Editorial workflow with drafts and reviews. Sanity has built-in roles.

If none of those become true, never flip it. The scaffold can sit there unused indefinitely. Costs nothing.

## How to actually turn it on (if you ever want to)

This is the future-you guide. Don't run these now.

1. **Set up the Studio:**
   ```bash
   cd studio
   npm install
   npm run dev   # local studio at http://localhost:3333
   ```
2. **Deploy the Studio (free, hosted by Sanity):**
   ```bash
   npm run deploy
   # pick hostname: parent-coach-playbook
   # studio is now live at parent-coach-playbook.sanity.studio
   ```
3. **Migrate the markdown articles into Sanity.** Sanity ships an `import` CLI that reads NDJSON. There's a small conversion step from markdown frontmatter → Sanity documents. ~1 hour of work.
4. **Update the website to read from Sanity.** Change `getCollection('articles')` calls in `src/pages/` to query Sanity via `@sanity/client`. About 6 files to touch.
5. **Set up a Cloudflare webhook.** Sanity → publish triggers a Cloudflare Pages rebuild via webhook URL. Otherwise the site won't refresh when you publish.
6. **Update the env vars** in Cloudflare:
   - `PUBLIC_SANITY_PROJECT_ID=oasnvt90`
   - `PUBLIC_SANITY_DATASET=production`

After all that, Jeff (or anyone) can write posts at `parent-coach-playbook.sanity.studio`, hit publish, and the website updates within a minute.

## Cost

Sanity free tier:
- 3 users
- 10,000 documents
- 2 datasets
- 100GB API bandwidth per month

We will never hit those limits on this brand. If we ever do, it costs $99/month for the next tier. We can re-evaluate at that point.

## What to delete if you want it gone

If you decide you'll never use Sanity:

```bash
# Delete the studio folder
rm -rf studio

# Remove from .gitignore
# (search for 'sanity' lines and delete)

# Remove from .env
# (remove PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_API_TOKEN)

# Delete the cloud project
# Go to sanity.io/manage, find the parent-coach-playbook project, delete it
```

The website keeps running on markdown. Nothing breaks. The repo gets ~50KB lighter.

## Summary

We set up Sanity as a Phase 2 option. The Phase 1 reality is markdown + AI + git, which is simpler and faster. Sanity sits in the repo as scaffolding for a future that may or may not come.

You are not currently using Sanity for anything. That is fine.
