# Kit wiring checklist

Two jobs here, do them in this order: fix the architecture gap first, then wire the sequence, then move the domain. All three need your hands in the Kit dashboard, nothing here touches your Kit account.

## 0. Read this before you do anything else

`KIT_SETUP.md` (existing doc) describes the site's actual live setup: one Kit form, ID `9388648`, used everywhere, redirecting every subscriber to `/welcome/` after signup, no automation, because that doc says the free Kit plan doesn't support sequences.

`KIT_DRIP_SETUP.md` (existing doc) specs a tag-triggered sequence on a distinct tag, `drive-home-playbook-downloaded`, applied specifically when someone downloads the What to Say When guide. That assumes two things `KIT_SETUP.md` doesn't confirm: that your Kit plan now supports Sequences and Automations, and that there's a way to tag a subscriber differently depending on which page they signed up from.

Confirm both before wiring anything:

- **Plan check.** Log into Kit, go to your account/billing page. Sequences and Automations are Creator-plan features. If you're still on the free Newsletter plan, the drip below can't run as designed. If you've upgraded since `KIT_SETUP.md` was written, you're clear.
- **Tagging check.** Every "Get the Friday Letter" button sitewide (homepage, footer, every lead-magnet page) currently points to the exact same hosted URL: `https://parent-coach-playbook.kit.com/4b28f916b5`. One form, no per-page distinction. That means Kit has no way today to know a subscriber came from the What to Say When page specifically versus the general newsletter CTA, so it can't apply `drive-home-playbook-downloaded` selectively.

**The fix, pick one:**
- **Option A (simplest):** Build a second Kit form or landing page dedicated to the What to Say When download, with its own hosted URL, and auto-apply the tag on that form only. Point `LeadMagnetCTA.astro` (used on `/resources/what-to-say-when/`) at the new form's URL. Leave the general "Friday Letter" buttons on the original form.
- **Option B:** If Kit's forms support a "redirect to different URL based on tag" or embed-level tag override, use that instead of a second form. Check Kit's current docs, this may have changed since `KIT_SETUP.md` was written.

Don't skip this. Wiring the automation to a tag nothing actually applies means the drip never fires.

## 1. Wire the sequence (once step 0 is resolved)

Follow `KIT_DRIP_SETUP.md` section by section:

1. Create the Sequence: **Kit → Send → Sequences → New Sequence**, name it `What to Say When Drip`.
2. Add all six emails from `WHAT-TO-SAY-WHEN-DRIP-FINAL.md` in this folder, in order, at day offsets 0 / 3 / 6 / 9 / 12 / 15.
3. Create the Automation: **Kit → Send → Automations → New Automation**, name it `What to Say When Drip on Download`. Trigger: tag added → `drive-home-playbook-downloaded` (or whatever tag you land on from step 0). Action: subscribe to sequence → `What to Say When Drip`.
4. Confirm the sequence's end-of-sequence setting is "Continue receiving the newsletter," not "Remove from list."
5. QA per `KIT_DRIP_SETUP.md`'s checklist: subscribe with a test email, confirm the tag lands, manually advance through all six emails, click every link on a phone, confirm each destination is live.
6. Only then, turn the automation on.

## 2. Move off the old domain

The old subdomain, `parent-coach-playbook.kit.com`, is hardcoded in three places in the site's source. None of these should be edited until the new form/URL from step 0 exists and is tested, otherwise you'll break the only working subscribe button on the site.

- `src/components/NewsletterSignup.astro`, line 30: `const KIT_HOSTED_URL = 'https://parent-coach-playbook.kit.com/4b28f916b5';` — drives every use of the shared signup component (compact, inline, and card variants), which is most of the site's subscribe buttons.
- `src/pages/index.astro`, line 134: a hardcoded link to the same URL in the homepage hero, doesn't go through the component.
- `src/pages/newsletter.astro`, lines 51 and 79: two more hardcoded links to the same URL, also don't go through the component.

**When you're ready to move:**
1. In Kit, create or confirm the new form under your current account naming (not tied to the old `parent-coach-playbook` name if you want a clean break, Kit lets you rename the form's slug independent of your account name).
2. Get the new hosted URL.
3. Update the constant in `NewsletterSignup.astro` (one edit, fixes most of the site).
4. Update the two hardcoded links in `index.astro` and `newsletter.astro` to match.
5. Worth doing while you're in there: replace those two hardcoded literals with an import from the same constant so a future domain change is a single edit, not three. Flag this to your next Claude session if you want it done as part of a code change, this file is prep only.
6. Also update `KIT_SETUP.md`'s references to `parentcoachplaybook.com/welcome/`, that redirect target should read `parentcoachdesk.com/welcome/` to match the live domain.

## 3. Related, not required

`kit-emails/KIT_SEQUENCE_DRAFTS.md` already in this folder is a different, older draft: a 6-email general welcome sequence (not the What to Say When drip), still branded "Parent Coach Desk" with the old sender name and old domain throughout. It predates this session's rebrand work. Your call whether to retire it, rebrand it, or fold pieces of it into a future sequence. Not touched here since it's a separate decision from the drip this task was scoped to.
