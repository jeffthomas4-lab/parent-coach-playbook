# Distribution lane report — 2026-07-15

Scope: audit items P1.5 (Kit welcome automation + Friday Letter #1) and P2.12 (one social channel, draft-and-stage). HUMAN GATE held throughout: nothing sent, no accounts created, no Kit API touched. All copy is staged and waiting for Jeff's hands.

---

## 1. The lead magnet: it exists, verified

The promised asset is real. `public/what-to-say-when.pdf`, 28 pages, matching the "28 pages" claim on the resource page, the welcome page, and the LeadMagnetCTA blurb. It is live right now at https://parentcoachdesk.com/what-to-say-when.pdf (HTTP 200, application/pdf, 46KB, checked 2026-07-15). The practice plan template is live too.

So the debt is not a missing asset. The debt is that Kit never delivers it: no incentive email, no welcome sequence, and no confirmation that the form's post-subscribe redirect ever got set. A subscriber who used the Kit form and closed the tab got nothing, ever. Two fixes below pay it: the incentive email covers every future subscriber, and Friday Letter No. 1 hand-delivers the PDF link to everyone already on the list.

One related finding: `KIT_DRIP_SETUP.md`'s tag-gated drip depends on a tag (`drive-home-playbook-downloaded`) that nothing applies, because the whole site runs one Kit form. The welcome sequence written today attaches to that one form directly, so the gap closes without building a second form. The drip spec is marked v2.

## 2. What got written (all staged, nothing sent)

- `kit-emails/WELCOME-SEQUENCE-FINAL.md`. The incentive-email copy plus six sequence emails (day 0/3/6/9/12/15). Delivers the guide in the confirmation email and again in email 0, points to `/welcome/` for the rest of the downloads, then walks the five moments: night before, the game, the 90 seconds after, the other parent, the long view. Mined from `WHAT-TO-SAY-WHEN-DRIP-FINAL.md`, which was the strongest copy in the folder; one voice fix (email 3 was first-person singular, now editorial "we"). Zero Amazon links; every URL verified HTTP 200 today.
- `kit-emails/FRIDAY-LETTER-001-2026-07-17.md`. Issue No. 1, paste-ready, with primary subject plus two alternates. Owns the silent months in one line, delivers the PDF link in the lead, then rides the two clocks that are actually running this week: the World Cup final on Sunday and fall tryouts four weeks out. Archive resurface: After the Cut, the 24-hour rule. The unsent 2026-07-10 draft's recruiting-math spine is banked for issue 2 or 3, when tryouts peak. A copy sits at `reports/friday-letters/FRIDAY_LETTER_2026-07-17.md` so Frida's 8-week repeat check sees it.
- `reports/social/SOCIAL-STAGE-PATTERN.md`. The channel call, the queue-to-stage-to-post pattern, and staged batch No. 1: five paste-ready Pinterest pins with titles, descriptions, UTM links, and imagegen prompts, all pointing at verified-live pages.
- Doc drift fixed in-lane: `KIT_SETUP.md` (dead `parentcoachplaybook.com` URLs corrected, stale free-plan claim corrected), status banners on `KIT_DRIP_SETUP.md`, `kit-emails/KIT_SEQUENCE_DRAFTS.md` (superseded), and `kit-emails/WHAT-TO-SAY-WHEN-DRIP-FINAL.md` (folded in).

## 3. The social call: Pinterest

Pinterest, and only Pinterest. The audience is mid-30s to mid-40s parents, mostly moms, and Pinterest is the one platform where that exact reader searches "tryout packing list" and "what to say after a bad game" on purpose. A pin pulls traffic for months, so a season can be staged in July and left running through November while Jeff coaches. Facebook is where team parents organize, but organic page reach is dead and groups demand daily personal presence, the exact hour that doesn't exist in season. Instagram wants native images and daily engagement, and the scheduler's queue is text and links, which die there. X is the wrong audience; TikTok and YouTube are video production jobs, not a staging pattern. Pinterest is the only channel where PCD's existing assets (checklists, PDFs, seasonal articles) are already the native format and zero community management is a feature.

The pattern honors the gate: the seasonal scheduler's queue gets a file home (`reports/social/QUEUE-YYYY-MM.md`), a weekly staging pass turns queue rows into paste-ready pins, and Jeff posts them, optionally through Pinterest's free native 30-day scheduler. No API, no credentials, no auto-posting.

## 4. Out of my lane, flagged for the owners

- `src/pages/newsletter.astro`: after issue No. 1 sends, the "We haven't sent an issue yet" empty state needs replacing with the issue listing. Site lane.
- `src/components/NewsletterSignup.astro` line 30, `src/pages/index.astro` line 134, `src/pages/newsletter.astro` lines 51 and 79: the hosted Kit URL `parent-coach-playbook.kit.com/4b28f916b5` is hardcoded in four spots. Works today; consolidate to one constant whenever the site lane touches those files. Do not change until any new Kit form is live and tested.
- `pcd-seasonal-content-scheduler`: one-line prompt change so its social queue writes to `reports/social/QUEUE-YYYY-MM.md`. Agent-roster lane.
- Sender identity (step 7 below) may need Cloudflare Email Routing for the reply address. Infra lane, only if Jeff picks a domain sender.

---

## HANDOFF: what Jeff does in Kit, in order

Total hands-on time: roughly 60 to 90 minutes, then 5 minutes Friday morning. Steps 1 through 5 today or tomorrow, step 8 Friday.

1. **Plan check.** Sign in at https://app.kit.com, open Billing. Note which plan is active and whether Send → Sequences and Automations are available. Kit's free plan has included limited sequence support; if Sequences are locked on your account, steps 2, 3, and 8 still work on any plan, and the sequence (steps 4-5) is the one thing that would need the Creator plan. Decide then, with the price in front of you.

2. **Turn on the incentive email.** Grow → Forms → the form ending in `/forms/9388648` → Settings → Incentive. Enable the incentive email, set the download to `what-to-say-when.pdf` (upload it, or link https://parentcoachdesk.com/what-to-say-when.pdf). Subject and body copy: top of `kit-emails/WELCOME-SEQUENCE-FINAL.md`. This is the single highest-value click in this whole runbook: every future subscriber gets the guide in their inbox, on any plan.

3. **Set the post-subscribe redirect.** Same form, Settings → after-subscribe behavior → Redirect to URL → `https://parentcoachdesk.com/welcome/`. (Note the domain. The old doc said parentcoachplaybook.com, which is wrong.)

4. **Create the welcome sequence.** Send → Sequences → New Sequence, name it `PCD Welcome`. Add the six emails from `kit-emails/WELCOME-SEQUENCE-FINAL.md` at offsets 0 / 3 / 6 / 9 / 12 / 15 days. Add the UTM params noted in that file to each link as you paste. Set end-of-sequence behavior to keep receiving broadcasts, not remove from list.

5. **Create the automation.** Automations → New Automation, name it `Welcome on Subscribe`. Trigger: joins form `9388648`. Action: subscribe to sequence `PCD Welcome`. Do not bulk-add existing subscribers to the sequence; they get the guide via Friday Letter No. 1 instead.

6. **QA before anything goes live.** Subscribe with a test email. Confirm the incentive email arrives with a working PDF, the redirect lands on `/welcome/`, and the test subscriber shows in the sequence at step 0. Advance the test subscriber through all six emails, read each on your phone, click every link. Then, and only then, set the automation live.

7. **Sender identity (strongly recommended before Friday).** Settings → sending. If the from-address is still a gmail address, Gmail and Yahoo bulk-sender rules will start eating deliverability as the list grows. Verify the parentcoachdesk.com domain in Kit (it walks you through the DNS records; they go in the Cloudflare dashboard) and send from something like `desk@parentcoachdesk.com`. If that address needs to receive replies, Cloudflare Email Routing forwards it free; flag the infra lane.

8. **Send Friday Letter No. 1, Friday 2026-07-17 morning.** Send → Broadcasts → New Broadcast, to the full list. Paste from `kit-emails/FRIDAY-LETTER-001-2026-07-17.md`: pick a subject (primary plus two alternates are in the file), set the preview text, paste the body, send yourself a test, read it on your phone, then send. This is the send that pays every existing subscriber what they were owed.

9. **After the send.** Tell the site lane to update `/newsletter/` with issue No. 1. Check opens and replies over the weekend; reply personally to anyone who writes back, that's the retention engine working. Next Wednesday, Frida's draft picks up the weekly rhythm, and the recruiting-math letter is banked as issue 2 or 3.

10. **Pinterest, when there's a spare half hour (not before Friday).** Create the free Pinterest business account, make the three boards named in `reports/social/SOCIAL-STAGE-PATTERN.md`, generate the five pin images with the imagegen prompts in that file, and load staged batch No. 1 into Pinterest's native scheduler. Tryout search volume peaks in the next six weeks; the batch is timed for it.
