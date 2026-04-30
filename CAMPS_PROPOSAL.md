# The camps repository — planning doc

## What you said you want

A repository of youth sports camps and activities that is:

- Map-based (visitor sees pins on a map)
- Location, price, dates, description, and other relevant fields
- Open to additions from either humans or AI
- Useful for parents trying to find what's available in their area during a specific window (especially summer)

This is real product work. Not a Markdown blog post.

## Honest difficulty assessment

Building a working v1 takes roughly 15-25 hours of dev work. Here's why.

A camps repo has three pieces:

1. **The data store.** Where camps live as records with structured fields.
2. **The display.** A map view + filter UI on the public site.
3. **The intake.** How camps get added (you, an AI, a community submission).

Each of those has a path that's cheap and a path that's robust. Pick the right combination and the project is a weekend. Pick the wrong combination and it's a six-month rabbit hole.

## Three realistic architectures

### Option A: Markdown files in the repo (cheapest, slowest to scale)

Each camp is a markdown file in `src/content/camps/[slug].md` with frontmatter for the structured fields. The site renders them on a `/camps/` page with a map (Leaflet or MapLibre). Filters are client-side JavaScript.

**Pros.**
- No external dependencies. Lives entirely in git.
- AI can generate camp markdown files by following a template.
- Free forever. No database costs.
- You control everything.

**Cons.**
- Adding a new camp requires a git push.
- Submissions from the public can't be one-click — they'd email you, you'd write the markdown.
- Slow to scale past ~100 camps because the build time grows.
- No "search for camps near my zip code" without extra dev work.

**Effort.** 8-12 hours. About 4 hours for the page + map, 4 hours for the filter UI, 2-4 hours for the submission flow (probably a Google Form that emails you the data).

**Right when.** You expect 30-150 camps total. You're the only person curating. Submissions are rare.

---

### Option B: Airtable + Astro (the practical middle path) ⭐ Recommended

Camps live as rows in an Airtable database. You and any human submitter can use Airtable's free form to add a camp. The Astro site fetches the Airtable data at build time, renders the map and filters, and rebuilds when something changes.

**Pros.**
- Adding a camp is a web form. No git, no push.
- AI can write to Airtable via API if you want to seed bulk data from web research.
- Public submission form is a 5-minute setup.
- Free up to 1,000 records (way more than you'd ever need locally).
- You can add columns whenever you want (photo, contact, age range, capacity, etc.) without touching code.
- Airtable has a built-in map view for your own admin use.

**Cons.**
- One external dependency (Airtable's API).
- You need an Airtable account. Free tier is fine until ~1,000 camps; after that paid.
- Submissions need spam protection (a hidden honeypot field works, or use Cloudflare Turnstile if it gets bad).
- You moderate submissions before they go live.

**Effort.** 12-18 hours. Airtable setup (2 hours), API integration with Astro (4 hours), map + filters (5 hours), submission form (3 hours), moderation flow (3 hours).

**Right when.** You expect to grow past 50 camps and want easy data entry. You like web forms. You want a real product, not a side project.

---

### Option C: Custom database (full engineering, slowest path)

Cloudflare D1 (SQLite-on-edge) or a small Postgres instance. Custom admin UI. Full submission API.

**Pros.**
- Maximum flexibility. Real-time updates without rebuilds.
- Can do "camps within 25 miles of my zip code" with proper geo queries.
- Scales to thousands of camps.

**Cons.**
- 4-6x the dev time of Option B.
- You maintain a database forever.
- No clear advantage over Airtable until you're at 500+ camps.

**Effort.** 30-60 hours.

**Right when.** This becomes a real business unit with paid listings or sponsored placements. Don't start here.

---

## My recommendation

**Start with Option B (Airtable).** Specifically:

1. Set up an Airtable base with the field schema below. Free tier.
2. Build a `/camps/` page on the site that fetches Airtable data and renders a map.
3. Make a public submission form (Airtable provides this for free) and link it from `/camps/submit/`.
4. You moderate new submissions in Airtable before they go live (a "Published" checkbox).

If volume gets serious (say, 500 listings) we revisit Option C. Until then, Airtable is the right answer.

## The field schema (for whichever option you pick)

Required:
- **Name** (text)
- **Sport / activity** (single select: baseball, softball, soccer, basketball, football, hockey, lacrosse, volleyball, theater, band, choir, dance, multi-sport, multi-activity, other)
- **Age range** (text or two number fields: min age, max age)
- **Start date** (date)
- **End date** (date)
- **Address** (text)
- **City** (text)
- **State** (text)
- **Zip code** (text)
- **Latitude, longitude** (auto-derived from address by an Airtable extension or geocoding API; needed for the map)
- **Description** (long text, 50-200 words)

Highly useful:
- **Price** (text — "Free", "$200", "$200-400", "Sliding scale")
- **Day camp or overnight** (single select)
- **Skill level** (single select: beginner, intermediate, advanced, all levels)
- **Spots available** (single select: open, waitlist, full)
- **Contact email or phone** (text)
- **Website URL** (URL)
- **Lunch included?** (checkbox)
- **Aftercare available?** (checkbox)

Operational (you see, public doesn't):
- **Submitted by** (email)
- **Submitted on** (auto date)
- **Reviewed by Jeff** (checkbox)
- **Published** (checkbox — only published camps show on the site)
- **Internal notes** (long text)

That's roughly 18-22 fields. Airtable handles them as columns. The submission form shows only the public ones.

## What about the geographic scope

Three options:

**Pacific Northwest only (your local area).** Smallest, most curated, fastest to launch. ~50-150 camps. You personally know or can verify each one. This is the right v1.

**West Coast + national online.** Adds a tier for online programs (zoom dance camps, virtual coaching). 200-500 camps. Harder to verify, easier to scale.

**National.** 1,000+ camps. Real product. Requires partnerships or scraping. Don't do this in v1.

I'd start Pacific Northwest. Once it works locally, expand by region. The tagline of the launch can be *"Camps in the Pacific Northwest, organized so you can plan your summer in 30 minutes instead of three weekends of Googling."*

## How AI fits in

AI's actual usefulness in this project:

- **Drafting descriptions.** Feed AI a camp's website URL or marketing email, get a 150-word description in your voice.
- **Categorizing.** AI can read a camp's website and tag the right sport, age, skill level.
- **Bulk entry.** If you have a list of 50 known camps, AI can fill out a submission template for each one and you paste the records into Airtable.
- **NOT for verification.** AI cannot confirm a camp exists, has space, or is run by who they say they are. You verify before publish.

## The real gating question

This is a 12-25 hour build (Option B). Before I touch it, you decide:

- Is this a v1-now project, a v2 (after the editorial pillars are denser) project, or a v3 someday-maybe project?
- What's the geographic scope you want to start with?
- Are you willing to moderate every submission before it goes live? (Required to keep spam out.)

Tell me your answers and I'll either start building or shelve it cleanly with a placeholder page that says "Camps directory coming soon, drop your email."

## Quick win: the placeholder

Even if you're not ready to build the full camps repo today, we can ship a `/camps/` placeholder this week. It says:

- "We're building a directory of youth sports camps in the Pacific Northwest."
- "Drop your email to be notified when it ships, or to submit a camp you run / send your kid to."
- A simple email form (uses the same Kit list).

That captures intent and email signups, signals the territory to Google, and gives you a real product page to build into when you're ready.

Want me to ship the placeholder this week?
