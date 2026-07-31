# Emotional Design Audit: parentcoachdesk.com

**Date:** 2026-07-31
**Pillar:** 11, Website Build Standard. Source doc: `Outputs/_system/Build Quality Prompts/EMOTIONAL-DESIGN-PROMPT.md`.
**Scope:** public, family-facing content and tools site. This row is live, no waiver.

## Finding zero: this site has no persona documentation

Checked `qa/personas.md` (does not exist), `EDITORIAL_VOICE.md`, `strategy/*.md`, and `BUSINESS_PLAN_24MO.md`. None of them name a reader persona. `EDITORIAL_VOICE.md` describes a writer's-voice persona ("a small group of parents who have done youth sports across many seasons"), and `BUSINESS_PLAN_24MO.md` explicitly says the site "doesn't expand the editorial voice to multiple personas... already consolidated to single Editorial byline." That is a voice decision, not a reader-persona map. Per this pillar's own instruction, the first finding is the gap itself.

Rather than invent readers from nothing, the four personas below are built from what the repo actually states about who uses the site: `SITE.description` ("For every parent driving a kid to practice, rehearsal, or the meet"), the four content phases the site is structured around (`drive-there`, `game`, `drive-home`, `team-parent`), the `team-parent` resource categories (logistics, communication, money, picture-day, conflict, tools), and the camp-claim flow's stated audience (camp owners/staff). One structural echo of SightSmash's Maria persona (multi-team parent, hates setup before value) is folded into P1 since it is the closest sibling-product persona for the same job: a parent under time pressure looking for a camp. **Recommend Jeff write a real `qa/personas.md` for PCD** the next time reader interviews run (`BUSINESS_PLAN_24MO.md` already schedules 5 parent-coach interviews a month) so future emotional-design passes stop reconstructing personas from inference.

## The four personas

**P1 — The Camp-Search Parent.** Three weeks before summer, needs to fill a week her kid is otherwise home alone. Has done this search on five other sites this month and is tired of fake "limited spots!" urgency and pages that make her create an account to see a phone number.

**P2 — The Newly-Volunteered Team Parent.** Got voted into the "team parent" role at the first practice because nobody else raised a hand. Does not know what the job actually is yet. Googling "team parent duties" at 9pm.

**P3 — The Drive-Home Parent.** Just watched her kid's team lose, or watched her kid ride the bench, or watched her kid make an error and take it personally. Has four minutes in the car before the kid gets in, and whatever she says in those four minutes matters more than the game did.

**P4 — The Camp Director.** Runs a real camp, sees it listed on PCD with data pulled from somewhere else, wants to fix the listing and knows exactly nothing about this site's process or trustworthiness yet.

---

## Journey maps

### P1 — The Camp-Search Parent, `/camps/`

**Before:** mildly dreading another 20-tab search, expects paywalls and fake scarcity.
**Core task:** filter by region/sport, open a listing, decide if it's real and worth a call.
**The turn:** `Listed price: $XXX · confirm with provider` and `Verified ✓ · read the verification methodology` on the card. The page admits what it doesn't know instead of oversolds what it does. That's the moment trust starts, not the search results themselves.
**After:** has a short, real list to call. Not resolved (she still has to call and book), but the work of finding candidates is done and she believes the list.

### P2 — The Newly-Volunteered Team Parent, `/team-parent/`, article read, Friday Letter

**Before:** mildly anxious, doesn't know the scope of the job she just accepted.
**Core task:** reads one team-parent article (money/logistics/conflict), maybe signs up for the Friday Letter.
**The turn:** the article answers the literal question she typed into Google, in the `bluf` (bottom-line-up-front) callout, inside the first screen. No scrolling through a life story to get to the answer.
**After:** feels like she has a plan for one specific thing (e.g. the money conversation), not the whole job. The Friday Letter signup is a real forward-momentum move ("I'll get more of this weekly") — but it hands off entirely to Kit's hosted page, so PCD gets no credit for what happens next in her head; the relief is real, the loop back to PCD is thin.

### P3 — The Drive-Home Parent, `/scripts/[slug]/`

**Before:** replaying the moment, unsure what to say, aware the next four minutes matter.
**Core task:** find the right script, read what to say / what not to say / the rule, before the kid gets in the car.
**The turn:** the "Pin this" save block at the bottom — a short, scannable, screenshot-shaped distillation of the whole page. It is designed for exactly the moment this persona is in: not enough time to reread the article, needs the takeaway now.
**After:** walks to the car with three sentences instead of zero. This is the single clearest "tension named, tension relieved" workflow on the site — the schema itself (`whatTheyAreFeeling` → `whatToSay` → `whatNotToSay` → `theRule`) is built around the three tests, not retrofitted onto them.
**Gap:** the save block has no actual save/share affordance (no copy button, no "text this to yourself," no add-to-home-screen prompt) — she has to manually screenshot. The content nails the moment; the mechanism doesn't help her leave with it.

### P4 — The Camp Director, `/camps/[slug]/` → claim form

**Before:** slightly defensive — a stranger's site has data about their camp.
**Core task:** find the claim link, understand what claiming buys them, submit.
**The turn:** the claim panel states the payoff up front — "self-edit info, add a logo, post a photo gallery, embed a registration link. Free." — before asking for anything. That's an honest value-first pitch, not a wall.
**After — and this is the real gap:** submitting returns `"Claim request received."` Plain text, form doesn't reset into anything, no reference number, no stated timeline beyond "varies with the evidence and dispute queue," no visible next action. The director completed a real action and got back nothing to hold onto. Same pattern, same wording style, on `/camps/submit/`: `"Submitted. We will review and follow up if needed."` Neither trips the one rule (nothing here makes the director feel worse than before), but both are the textbook definition of "a completed step with no next action," which this pillar calls out by name as a fail condition on its own.

---

## Emotional scores by feature

| Feature | Score | Why |
|---|---|---|
| Scripts ("what to say" pages + save block) | 9 | Built around tension relief by construction, not decoration. The clearest identity reinforcement on the site: "I am the parent who knew what to say." |
| Cost calculator | 8 | No signup wall, pre-filled with real medians, editable, honest ("estimates," not promises), durable in the sense that the number itself is the artifact. Genuine "pay the first person before anything else" design. |
| Camp finder (`/camps/`) | 7 | Honest price/verification language builds real trust; the artifact (a short real list) is durable and usable off-page. Docked for the mobile scale problem logged separately under Pillar 14/7 (1,300+ camps server-rendered with no windowing) — a parent on a slow connection pays a real tax to get the artifact. |
| Article reading (bluf callout, related content) | 7 | Answer-first content respects the reader's actual question; related-content rails give a next step without feeling like an upsell. |
| Camp submit / claim completion | 4 | Honest expectations going in, but a flat, artifact-free ending. Completed action, no receipt, no next action, no way to check status later. Scores low on purpose per this pillar's rule. |
| Friday Letter signup | 5 | Clear, honest copy, no dark patterns — but it's a link out to a hosted third-party form with zero in-page confirmation of what happens after the click, and no visible payoff before the click (no "here's what last week's letter looked like"). Functional, not felt. |
| Reviews (camp listings) | 8 (trust-only) | "We do not pay for reviews... a camp claiming its listing has no effect on its reviews" is a real trust statement placed exactly where a skeptical reader would ask the question. Not a workflow with its own journey, but a strong trust surface wherever it appears. |

---

## Wow moments

1. **The "Pin this" save block on scripts.** The one place on the site where the format itself is the emotional design, not a feature bolted onto content. A parent would genuinely screenshot this and text it to a co-parent.
2. **Honest price/verification language on camp cards.** "Listed price — confirm with provider" instead of a fake-precise number is the kind of restraint that reads as trustworthy specifically because every competitor oversells certainty it doesn't have.
3. **The cost calculator asking nothing before it gives something.** No email gate before the number. That's rare enough in this category to be a genuine wow, not just table stakes.

If a fourth is needed: the camp reviews trust statement ("we do not pay for reviews... claiming has no effect on reviews") is the kind of line a skeptical parent remembers and repeats to a friend.

---

## AI relief opportunities

The site does not surface AI to the reader anywhere in these five workflows (the AI is all backstage — content drafting, camp enrichment). That's a legitimate choice, not a gap by default; per this pillar, AI only earns credit for making a *user* feel supported, and none of these workflows expose AI to the user today. Two places where AI-as-relief (not AI-as-automation) would plausibly lift a flat score:

- **Camp claim confirmation.** A one-line, personalized summary of what was submitted and roughly when to expect a decision would turn the flat "Claim request received" into something that feels read and understood, without needing a live agent behind it — a templated confirmation referencing the camp name and submitted fields already does most of this without AI.
- **Cost calculator "what this means for us."** The calculator is honest with numbers; a single generated sentence translating the total into a decision frame ("a travel season here runs about what two rec seasons do") would be the kind of AI-as-relief this pillar rewards — but only if it's clearly derived from the calculator's own numbers, never invented certainty.

Neither is urgent; the site's discipline about not fabricating certainty (verification labels, price disclaimers, no fake reviews) is worth protecting more than it's worth rushing an AI feature into.

---

## Change list, ranked by emotional impact against build cost

1. **Give the submit/claim completion an artifact.** Low cost, real impact: show what was submitted (echoed back), a rough timeline, and — if feasible — a status-check link or reference id. This is the single clearest "completed step, no next action" fail on the site and it's a template/copy change, not new infrastructure.
2. **Add a real save/share affordance to the scripts save block.** Low cost: a "Copy" button on the save-block text, or a `mailto:`/SMS share link. The content already does the hard work; this just removes the manual-screenshot tax.
3. **Give unique OG images to the non-`articles` collections** (scripts, decisions, body — see the Pillar 10 finding on shared `og-default.jpg`). This is an SEO fix with an emotional-design side effect: the scripts save-block content is exactly what gets shared in a text thread, and a generic social card undersells it at the moment it would spread.
4. **Newsletter signup: show a payoff before the click.** A one-line excerpt or subject-line sample from a recent Friday Letter, next to the signup CTA, so P2 knows what she's opting into before she leaves the site for Kit's hosted form.
5. **A lightweight post-submit confirmation page** for camp submit/claim, replacing the inline status text, would let the director bookmark or return to a URL rather than trusting an ephemeral in-page message — higher cost than #1, worth it only if #1's copy fix isn't enough on its own.

None of these are launch-blocking. The one rule (a screen leaving the user worse or unchanged) is not tripped anywhere in these five workflows — the worst finding is flat, not harmful.

---

## Why users will love this

"I typed 'what to say after a bad game' into Google at a stoplight and the answer was right there, no story to scroll through first, and there was a little list at the bottom I could screenshot before he got in the car. I didn't feel like I was being sold anything the whole time I was reading it — even the camp listings tell me when they're not sure about the price instead of just making one up. That's the first sports site that's felt like it was written by someone who's actually done this and not just trying to get me to click something."

---

## Pillar 11 one-line pass/fail (for STANDARD-AUDIT.md)

**Scored, no launch-blocking fail.** No core workflow trips the one rule. Strongest workflow: scripts/save-block (9/10, genuine tension relief by design). Weakest: camp submit/claim completion (4/10, completed action with no artifact or next action — a real finding, not a blocker). Persona documentation does not exist for this site and should be written from real reader interviews, not reconstructed by a future audit.
