# To-do later

Things that are queued but not next. Pick from here once phase 2 ships and there's a reason to ship one of these.

## Camps phase 2 holds

### Approved-camp email to submitter
When admin approves a submission, send the submitter an email saying their listing is live with the URL. Builds goodwill, gets them to share it. Either via Cloudflare Email Workers or a webhook to Kit.

Effort: 1-2 hours. Mostly Email Workers setup.

### Cross-link camps from articles and buying guides
A baseball article shows "5 baseball camps in your region this summer." A sport buying guide shows "Camps offering this sport." Pulls from D1 at request time. Makes camps an integrated section instead of an island.

Effort: 3-4 hours. Add a `<CampsForSport>` Astro component that takes a sport slug, queries D1 for approved camps matching, renders cards. Drop into the article and guide layouts.

## Claim-listing follow-ups

### Stripe payment link integration
Today the admin manually sends a Stripe payment link or invoice after marking a claim "verified." When payment lands, admin marks "paid" in the queue. Future: auto-generate a Stripe Checkout link from the verify endpoint, listen on a webhook for payment success, auto-flip the claim to "paid." Eliminates the manual loop.

Effort: 3-5 hours. Stripe API key + webhook endpoint + signature verification.

### Self-edit page for claimed listings
A claimed camp gets a /camps/manage/[token]/edit page where the owner can update their own description, dates, contact info, registration URL, and upload a logo + gallery photos. Token tied to the claimed_by_email, expires when claim_paid_until lapses. Until this ships, claimed camps still go through the regular admin moderation flow for edits.

Effort: 6-8 hours. Token generation, gated edit form, photo upload to R2 (logo and gallery columns are already in the schema).

### Claim renewal reminder email
30 days before claim_paid_until expires, send the owner a renewal email with a Stripe link. If they don't pay, the listing reverts to is_claimed=0 (their info stays, they just lose self-edit access).

Effort: 2 hours once the email Worker is set up.

### Other monetization (queued)
- Hotel/travel affiliate widget on overnight camps (Booking.com / Hotels.com). 2-3 hours.
- Local services directory as a separate section ($99 one-time listings). 8-12 hours.
- Sponsored category bar (named sponsor for "Baseball camps"). Manual sales until volume justifies automation.

---

Add new items below as they come up.
