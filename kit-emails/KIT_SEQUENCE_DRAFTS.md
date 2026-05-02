# Kit free-tier welcome sequence — six drafts

Six emails over four weeks. No automation set up yet — paste each one into Kit when ready, set the trigger, do not send live until you've reviewed.

Voice: warm, mom-friendly, declarative-but-soft. Same rules as `EDITORIAL_STANDARDS.md`. Keep emails short. Each one ends with a single clear next step.

Sender: `Parent Coach Playbook Editorial <parentcoachplaybook@gmail.com>`. From-name option: "PCP Editorial" — friendlier than the full byline.

---

## EMAIL 1 — Day 0 (instant on signup)

**Subject:** Your free playbook is here. Plus what comes next.

**Preview text:** A short note, the playbook PDF, and what to expect.

**Body:**

```
Hi friend,

Welcome. You signed up, which means you're a parent in the middle of it — youth sports, dance, theater, whatever this season looks like.

Here's the Drive Home Playbook, on us.
[Download the PDF →] (link to /the-drive-home-playbook.pdf)

Read it when you have ten minutes. It covers what to say after a hard game, by sport, by age. We use it. The parents we talk to use it. Hopefully you'll find a version of yourself in it.

Over the next four weeks, we'll send a few more notes. Specific ones. The kind of read you can do at the kitchen counter while the laundry runs.

The next one lands Wednesday. It's about the first ninety seconds after a tough game. Most parents accidentally make those ninety seconds the hardest part of the week. We have a different approach.

Glad you're here.

— The Editorial Team
Parent Coach Playbook
```

**Trigger:** subscribe to free tier.
**Personalization:** none required. Optional: `{{first_name}}` in salutation.
**Asset:** attach or link the existing `/public/the-drive-home-playbook.pdf`.

---

## EMAIL 2 — Day 2

**Subject:** The first 90 seconds after a hard game

**Preview text:** What you say at minute one matters more than what you say at minute thirty.

**Body:**

```
Hi friend,

A kid went 0 for 4 last Saturday. The drive home took 25 minutes. The parent in the front seat said the wrong thing in the first ninety seconds. The whole next week was tense.

Most of us get this wrong on at least one Saturday a season.

The full piece is here.
[Read: What you say in the first 90 seconds →]
(link to /drive-home/the-90-second-rule/)

The short version:
- Don't replay the game.
- Don't ask "what happened on that pitch?"
- Don't fill the silence.
- Pick a specific moment your kid had agency in. Mention it briefly. Then talk about something else.

That's the whole rule. The longer version on the site has the language by sport.

If you find yourself in the car this Saturday with a kid who didn't have a great game, this is the one to remember.

Talk soon.

— PCP Editorial
```

**Trigger:** 2 days after Email 1.

---

## EMAIL 3 — Day 7

**Subject:** A practice plan parents (and kids) can actually read

**Preview text:** The plan we wish someone had handed us in our first season.

**Body:**

```
Hi friend,

A practice plan for an eight-year-old does not have to be complicated. Most coaches over-engineer it. The simplest plan is the one parents and kids can both read on the way to the field.

We put a clean template together. Download it, print it, modify it. It works for any sport.

[Get the practice plan template →]
(link to /resources/practice-plan-template/)

What's in it:
- One page, big type
- Two clear objectives per practice (max)
- Warm-up, two skill blocks, scrimmage, close
- A built-in line for the parent-facing recap text

If you're a coach, this is the whole job. If you're a parent, hand it to your kid's coach the next time they look stressed.

Either way, it'll save you twenty minutes Tuesday afternoon.

— PCP Editorial
```

**Trigger:** 7 days after Email 1.

---

## EMAIL 4 — Day 14

**Subject:** Three things I didn't know in my first season

**Preview text:** Real lessons. Specific scenes. The stuff parenting books leave out.

**Body:**

```
Hi friend,

Three things we learned the hard way. None of them are in the parenting books.

ONE — The carpool spreadsheet saves marriages. We tried to handle four-family carpool by text for one season. We failed. The next season, one shared sheet did the work of fifty texts. We have a template if you want it.

TWO — The first ninety seconds after a game is the whole game. You already know that one if you read last week's email. It bears repeating.

THREE — Most parent fights with coaches are about feeling unseen, not about playing time. The conversation that works is "what is my kid working on right now and how can I help at home." Not "why isn't he playing more."

The full read is on the site.
[Three things I didn't know →]
(link to a future article or to the manifesto piece)

Pick the one that feels relevant to your week. Skip the others. We won't know.

— PCP Editorial
```

**Trigger:** 14 days after Email 1.

---

## EMAIL 5 — Day 21

**Subject:** Picking a summer camp? Read this first.

**Preview text:** Ten minutes. Eight questions. The way to evaluate a camp without spending Saturday on it.

**Body:**

```
Hi friend,

It's that season. The camp emails are landing in your inbox. The friends are signing up. The brochures all look the same.

We wrote a way to evaluate a summer camp in ten minutes. Eight questions. Pick the four that matter most for your kid.

[Read: How to evaluate a summer camp →]
(link to /drive-there/how-to-evaluate-a-summer-camp/)

If you want camps near you, the directory is searchable.
[Browse camps by state and sport →]
(link to /camps/)

One more thing. The most important question is the one most parents skip — the safety vetting question. We wrote a separate piece on that one.

[How to vet a camp for safety →]
(link to /drive-there/how-to-vet-a-camp-for-safety/)

Your kid focuses on the fun. You focus on the questions. That's the deal.

— PCP Editorial
```

**Trigger:** 21 days after Email 1.

---

## EMAIL 6 — Day 28

**Subject:** What's been your hardest moment?

**Preview text:** Tell us. We read every reply.

**Body:**

```
Hi friend,

Twenty-eight days in. By now you've gotten the playbook, the practice plan, a few reads, and the camp guide.

We have one favor.

We're trying to figure out what to write next. The best way for us to do that is to hear from you directly.

Hit reply and tell us:
- What's been your hardest moment as a youth-sports parent in the last six months?
- What's a question you wish someone had answered before you got there?

We read every reply. We don't share them. We don't quote names. We use them to plan what to write next.

A real reply, even one sentence, makes us a better resource for everyone.

Thanks for being here.

— PCP Editorial

P.S. From here you'll start getting our weekly Friday-morning note. One short read a week. Easy unsubscribe anytime.
```

**Trigger:** 28 days after Email 1.

---

## After the sequence

Subscriber rolls into the **weekly Friday-morning newsletter**. That's the regular cadence going forward. The sequence above is one-time onboarding.

## Tracking

Tag every link in the emails with UTM params so we can see which emails drive engagement. Format:

```
?utm_source=kit&utm_medium=email&utm_campaign=welcome-sequence&utm_content=email-1
```

Increment `email-1` through `email-6`.

## To do before sending live

1. Confirm the playbook PDF link works at production URL.
2. Confirm the article links work for any post that hasn't published yet (Email 4's "Three things I didn't know" — pick an existing piece if needed).
3. Test from-name and subject preview on iOS and Gmail.
4. Send a test of all six to your own inbox to QA.
5. Set the automation triggers correctly (Email 1 on signup, then +2, +7, +14, +21, +28 days).

Don't blast all six until tested end-to-end. Better to delay a week than to send a broken sequence to your first 100 subscribers.
