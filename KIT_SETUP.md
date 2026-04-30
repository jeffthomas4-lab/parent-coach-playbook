# Kit (newsletter) setup

How the lead-magnet flow works and the one-time configuration you need to do in Kit.

## The architecture

You have one Kit form (ID `9388648`). It's used everywhere on the site: homepage hero, lead-magnet pages, footer signups. Subscribe once, you're in.

After someone subscribes, Kit can do one thing: redirect them to a single URL or show a single success message. We use the redirect, and we point it at a universal welcome page on your site (`/welcome/`). That page lists every free download and tells them how the newsletter works.

This means: every subscriber, no matter where they signed up, lands on `parentcoachplaybook.com/welcome/` and sees ALL your downloads. You add a new freebie, you update one page, every existing subscriber can come back and grab it. New subscribers see it on day one.

## The one-time setup in Kit

Do this once. After this, every new lead magnet just gets added to the welcome page.

1. Sign in to Kit at https://app.kit.com
2. Go to **Grow → Forms**
3. Click into the form (it should be the only one — name might be "Parent-Coach Playbook" or similar; the URL will end in `/forms/9388648`)
4. Click **Settings** (top of the form editor) and look for **After subscribe** or **Incentive** settings
5. Find the option labeled something like "What happens after subscribe?"
6. Set it to **Redirect to URL** (instead of "Show success message")
7. Paste this URL: `https://parentcoachplaybook.com/welcome/`
8. **Save** the form

That's the entire setup. From now on, anyone who subscribes anywhere on your site lands on `/welcome/` with both PDFs available for download.

## What this fixes

Before this setup, the only way someone got the PDF was clicking a "Direct download" button on the lead magnet page. The Kit form was a separate, non-gated subscribe option. Most people clicked the direct download and never subscribed.

After this setup, the PDF is gated behind the email. Anyone who wants the playbook subscribes. Anyone who subscribes gets the playbook AND the practice plan AND every future download we ship.

## Adding a new lead magnet later

When you ship a new free download, do these three things:

1. Drop the new PDF into `public/` (the file name becomes the URL — e.g. `the-tryouts-rubric.pdf` → reachable at `parentcoachplaybook.com/the-tryouts-rubric.pdf`)
2. Edit `src/pages/welcome/index.astro` — add a new card in the same format as the two that exist
3. Edit `src/pages/resources/index.astro` — add a card so it appears in the public Resources index too

That's it. Existing subscribers can come back and grab it. New subscribers see it the day you ship.

## Optional: send an email when a new lead magnet ships

You can do this manually with a Kit broadcast (free plan):

1. Go to **Send → Broadcasts → New Broadcast**
2. Subject: something like *"New: The Tryouts Rubric"*
3. Body: a 3-sentence note + a link to `https://parentcoachplaybook.com/welcome/` (or directly to the PDF)
4. Send to your full list

Takes about 5 minutes to write. Worth doing every time you ship a new freebie. Re-engages your list and reminds them why they subscribed.

## What this doesn't do (and why that's fine)

It doesn't auto-deliver the PDF to the subscriber's inbox. Kit's free plan doesn't support automated sequences. The subscriber lands on `/welcome/` and clicks the download. That's a reasonable substitute and doesn't cost you $30/month.

If your list grows past 1,000 subscribers and you want fancy email automation (welcome sequences, drip campaigns, segmentation), revisit the paid plan. Until then, this setup is right.
