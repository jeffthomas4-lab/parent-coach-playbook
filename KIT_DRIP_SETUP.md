# What to Say When drip series: Kit setup spec

> **Status 2026-07-15 (distribution lane): this tag-gated design is v2, not what ships first.** The tag it depends on (`drive-home-playbook-downloaded`) is applied by nothing, because the site runs one form for every signup (see `kit-emails/KIT-WIRING-CHECKLIST.md`, step 0). V1 ships as a universal welcome sequence attached to that one form, copy in `kit-emails/WELCOME-SEQUENCE-FINAL.md`, runbook in `reports/DISTRIBUTION-LANE-2026-07-15.md`. Come back to this spec when a second, magnet-specific form exists.

Single doc covering the form-to-sequence wiring in Kit. Email content is yours
to write. This file specifies the plumbing.

> **Renamed from "Drive-Home Playbook" → "What to Say When" (May 2026).**
> Kit subscriber tag `drive-home-playbook-downloaded` is preserved as-is to
> avoid orphaning existing subscribers. Rename the tag in Kit only when you're
> ready to migrate the audience over.

---

## What we're building

A 5-email sequence that sends every 3 days after a reader downloads the
What to Say When field guide. Anchored on the three windows (before / after /
hard moments) plus two longer-arc themes. The point: turn a one-PDF download
into a regular reader.

Sequence map:

| Step | Day | Theme | Working title (yours to rewrite) |
|------|-----|-------|----------------------------------|
| 0    | 0   | Welcome + deliver the PDF | "The field guide is yours" |
| 1    | 3   | Before the game | "Before the game starts" |
| 2    | 6   | The game itself | "What happens in the middle" |
| 3    | 9   | After the game | "The first 90 seconds" |
| 4    | 12  | The parent on the team you can't stand | "The other parent" |
| 5    | 15  | The long view | "Why this is worth it" |

---

## In Kit

### 1. The form (already exists)

Form ID: the existing lead-magnet form Kit is wired to. The lead-magnet
component on the site posts to:

- `/resources/what-to-say-when/`
- `LeadMagnetCTA.astro` component
- Form action lives in the component's HTML

No change required if the form already collects email and tags subscribers.

### 2. The tag

The existing Kit subscriber tag is `drive-home-playbook-downloaded`. We're
keeping it as-is so existing subscribers stay attached to the same automation.
If you want to rename it to `field-guide-downloaded` for cleanliness, do the
migration in Kit (rename + reattach automation triggers) and then update the
references below.

Apply this tag automatically when a subscriber submits the lead-magnet form.
This is the trigger for the sequence. In Kit's form settings:

- Go to the lead-magnet form
- Settings → Incentive: confirm the PDF is the incentive (already wired)
- Settings → Tags: auto-apply `drive-home-playbook-downloaded` on subscribe

### 3. The sequence

Create a new Kit Sequence called `What to Say When Drip`.

Six emails (the welcome + the five themed). Day offsets:

| Email | Days after subscribe |
|-------|---------------------|
| 0     | Immediate           |
| 1     | +3 days             |
| 2     | +6 days             |
| 3     | +9 days             |
| 4     | +12 days            |
| 5     | +15 days            |

Each email's subject line, preview text, and body is yours to write. Voice
rules from `About Me/About Me.txt` and `About Me/Anti AI Writing.txt` apply.

### 4. The automation

Create a new Kit Automation called `What to Say When Drip on Download`.

- Trigger: tag added → `drive-home-playbook-downloaded`
- Action: subscribe to sequence → `What to Say When Drip`

That's the whole wiring.

### 5. The exit

After email 5, the subscriber should land on the regular newsletter list. Kit
handles this automatically if the sequence's "Once a subscriber completes this
sequence" setting is `Continue receiving the newsletter`. Confirm that's set.

---

## Voice and structure (for when you write)

- Subject line: under 50 chars. Lowercase first word. No emoji.
- Preview text: one-liner, complete sentence, treats inbox as a peer-to-peer
  channel. Avoid "Don't miss this" / "You won't believe."
- Body: 200-400 words per email. Three short paragraphs minimum. End on a
  link to one specific read that builds on the theme.
- No em dashes.
- One CTA per email. Pick the strongest read for the theme; resist the urge
  to also link to the cost calculator and the manifesto and the newsletter
  archive in the same email.

---

## What to link to from each email

Suggestions, not requirements. Pick the read that best fits whatever angle
you take in the email body.

- **Email 0 (welcome):** PDF download link (already in Kit incentive). Brief
  pointer to `/start-here/`.
- **Email 1 (drive there):** `/drive-there/night-before-tryouts/` or
  `/drive-there/the-summer-break-conversation/`.
- **Email 2 (the game):** `/game/the-real-job-of-youth-sports/` or
  `/game/the-missing-rec-layer/`.
- **Email 3 (drive home):** `/drive-home/the-90-second-rule/` or
  `/drive-home/what-my-kid-said-in-the-car/`.
- **Email 4 (the other parent):** Pick whichever read in the archive lands
  the "parent on the team you can't stand" angle hardest. If none does
  yet, this email is a brief and a promise, plus a link to the newsletter
  archive so the reader can poke around.
- **Email 5 (the long view):** `/manifesto/` once the manifesto page is
  shipped, or `/about/` for now. The point: zoom out. Why this matters
  past the season.

---

## QA checklist before turning the automation on

1. Subscribe yourself to the form with a test email. Confirm:
   - The PDF arrives (incentive delivery).
   - The tag `drive-home-playbook-downloaded` is on your test subscriber.
   - The sequence shows you in step 0.
2. Trigger the day-3 email manually (Kit lets you advance a subscriber). Read
   it on a phone. Click the link. Confirm the destination URL is live.
3. Repeat for each email. Catch broken links and bad subject lines before
   real readers see them.
4. Turn the automation on.

---

## Future iterations

Once the drip is running, watch:

- **Open rate per email.** If email 4 ("the other parent") drops sharply,
  that's a subject-line problem or an audience-mismatch problem.
- **Click-through to the linked read.** If email 3 lands a 30% CTR to the
  90-second-rule piece, that's the strongest signal in the whole sequence.
  Use it to inform what the next 5-email arc should be.
- **Unsubscribe rate per step.** Above 1.5% on any single email is a tell.
  Re-read that one and ask whether it earned its place.

The sequence is not static. Rewrite emails when the underlying read gets
revised or when reader feedback says a different angle would land harder.
