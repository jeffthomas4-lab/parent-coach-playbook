# Social: the one channel and the draft-and-stage pattern

**Written:** 2026-07-15, distribution lane. No accounts exist and this file creates none. Everything here is draft and stage. Jeff opens the account, Jeff posts.

---

## The channel: Pinterest

Pinterest, and only Pinterest. The audience is mid-30s to mid-40s parents, mostly moms, and Pinterest is the one platform where that exact reader goes looking for "tryout packing list" and "what to say after a bad game" on purpose. A pin keeps pulling traffic for months, which means a season's worth can be staged in July and left to run through November while the head coach coaches. Facebook is where team parents organize, but organic page reach is dead and groups only work with daily personal presence, which is exactly the hour that doesn't exist in season. Instagram wants native images and daily engagement; the queue the seasonal scheduler produces is text and links, and text and links die there. X is the wrong audience, and TikTok and YouTube are video production jobs, not a staging pattern. Pinterest is the only channel where the assets PCD already owns (checklists, PDFs, seasonal articles) are the native format, and where zero community management is a feature instead of a failure.

One number worth holding: the site had zero organic Google clicks two weeks running per the July audit. Pinterest is a second search engine with a fraction of the competition for this niche. Same SEO muscle, different index.

---

## The pattern

Three steps, two files, one human.

**1. Queue (already produced, now with a home).** The monthly `pcd-seasonal-content-scheduler` task already builds a social queue nothing reads. From its next run, it writes that queue to `reports/social/QUEUE-YYYY-MM.md`. One row per seasonal moment: date window, moment, destination URL, one-line angle. That is a one-line change to the scheduled task's prompt, flagged for the agent-roster lane; until it lands, whoever stages can pull moments straight from `src/content/seasonCalendars/` the way Frida does.

**2. Stage (writing, no account).** Weekly, alongside the Friday Letter rhythm, convert the top 5 queue rows into paste-ready pins in `reports/social/STAGED-YYYY-MM-DD.md`. Each pin carries exactly five fields:

- **Board:** which Pinterest board it files under.
- **Title:** 100 characters max, front-load the search phrase a parent types.
- **Description:** 500 characters max, search-shaped, ends with the site name. No hashtag spam; two or three at most.
- **Link:** the destination URL with `?utm_source=pinterest&utm_medium=social&utm_campaign=seasonal-queue`.
- **Image:** 2:3 vertical, 1000x1500. Either the article's existing hero re-cropped, or an imagegen prompt included with the pin. Text overlay carries the title phrase, big type, site colors (ink/paper/rust).

**3. Post (Jeff, the human gate).** Jeff pastes staged pins into Pinterest. Pinterest's native scheduler queues pins up to 30 days out for free, so one 20-minute sitting before September can carry a month of the season. Nothing in this pattern auto-posts, calls an API, or holds credentials. That line does not move without a spec revision.

Cadence: 5 pins a week in the active season, staged in weekly batches. During maintenance mode (August through November) staging pauses with everything else; the July move is to stage August and September in bulk now and load Pinterest's scheduler before camp opens.

Starter boards, three, no more: **Tryout Season**, **What to Say to Your Kid**, **Team Parent Checklists**.

---

## Staged batch No. 1 (paste-ready when the account exists)

Every link verified HTTP 200 on 2026-07-15. Timing: tryouts are four weeks out, which is exactly when Pinterest search for tryout terms climbs.

### Pin 1
- **Board:** Tryout Season
- **Title:** The night before tryouts: what to say and what to skip
- **Description:** The question almost every parent asks the night before tryouts makes the nerves worse. What works instead: normal routine, normal bedtime, no pep talk. A short read for sports parents from Parent Coach Desk.
- **Link:** https://parentcoachdesk.com/drive-there/night-before-tryouts/?utm_source=pinterest&utm_medium=social&utm_campaign=seasonal-queue
- **Image:** imagegen prompt: "Flat vector illustration, warm paper background, a kid's packed sports bag by a front door at night, hallway light on. Text overlay in bold display type: THE NIGHT BEFORE TRYOUTS. Rust and ink palette, 1000x1500 vertical."

### Pin 2
- **Board:** What to Say to Your Kid
- **Title:** The 24-hour rule after your kid gets cut from the team
- **Description:** Don't email the coach. Don't switch leagues. Don't buy anything to compensate. Wait one day. The 24-hour rule for the worst afternoon of the season, from Parent Coach Desk.
- **Link:** https://parentcoachdesk.com/drive-home/after-the-cut-the-24-hour-rule/?utm_source=pinterest&utm_medium=social&utm_campaign=seasonal-queue
- **Image:** imagegen prompt: "Flat vector illustration, a phone face-down on a kitchen counter next to car keys, evening light. Text overlay: AFTER THE CUT: THE 24-HOUR RULE. Rust and ink palette, 1000x1500 vertical."

### Pin 3
- **Board:** What to Say to Your Kid
- **Title:** What to say in the first 90 seconds after a bad game
- **Description:** The first 90 seconds in the car decide what the week looks like at home. Three moves, in order, that keep the ride home from becoming the hardest part of youth sports. From Parent Coach Desk.
- **Link:** https://parentcoachdesk.com/drive-home/the-90-second-rule/?utm_source=pinterest&utm_medium=social&utm_campaign=seasonal-queue
- **Image:** imagegen prompt: "Flat vector illustration, view from a car back seat, kid with a duffel bag looking out the window, parent's eyes in the rearview mirror. Text overlay: THE FIRST 90 SECONDS. Rust and ink palette, 1000x1500 vertical."

### Pin 4
- **Board:** Team Parent Checklists
- **Title:** Free 28-page guide: 23 scripts for sports parents, by age
- **Description:** What to Say When is a free 28-page field guide for youth sports parents. Twenty-three scripts for before the game, after the game, and the hard moments in between, organized by age. Free download from Parent Coach Desk.
- **Link:** https://parentcoachdesk.com/resources/what-to-say-when/?utm_source=pinterest&utm_medium=social&utm_campaign=seasonal-queue
- **Image:** imagegen prompt: "Flat vector mockup of a printed field-guide booklet on a kitchen table next to a water bottle and cleats. Text overlay: WHAT TO SAY WHEN, FREE 28-PAGE GUIDE. Rust and ink palette, 1000x1500 vertical."
- **Note:** this pin points at the gated resource page, not the raw PDF, so Pinterest traffic feeds the email list.

### Pin 5
- **Board:** Tryout Season
- **Title:** When the cuts list goes up and your kid isn't on it
- **Description:** The cuts list moment, from the parent side: what your kid needs in the first hour, what can wait until morning, and the one thing not to do in the parking lot. From Parent Coach Desk.
- **Link:** https://parentcoachdesk.com/drive-home/when-the-cuts-list-goes-up/?utm_source=pinterest&utm_medium=social&utm_campaign=seasonal-queue
- **Image:** imagegen prompt: "Flat vector illustration, a printed roster sheet taped to a gym door, one parent and kid seen from behind. Text overlay: WHEN THE CUTS LIST GOES UP. Rust and ink palette, 1000x1500 vertical."

### Pin 6
- **Board:** What to Say to Your Kid
- **Title:** When your kid doesn't make varsity: what to say in the car
- **Description:** The ride home after the cut is the hard part. This is what tends to help in the first hour, what can wait until morning, and the sentence that makes it worse. Written for sports parents by Parent Coach Desk.
- **Link:** https://parentcoachdesk.com/drive-home/on-not-making-varsity/?utm_source=pinterest&utm_medium=social&utm_campaign=seasonal-queue
- **Image:** imagegen prompt: "Flat vector illustration, a parent and teenager in a parked car seen from behind, gym in the background. Text overlay: DIDN'T MAKE VARSITY, WHAT TO SAY. Rust and ink palette, 1000x1500 vertical."

### Pin 7
- **Board:** Team Parent Checklists
- **Title:** A practice plan another parent can run without calling you
- **Description:** The plan that works is the one a substitute adult can read and run cold. Warmups, three stations, water breaks, and a clear end. Free template from Parent Coach Desk.
- **Link:** https://parentcoachdesk.com/resources/practice-plan-template/?utm_source=pinterest&utm_medium=social&utm_campaign=seasonal-queue
- **Image:** imagegen prompt: "Flat vector mockup of a one-page printed practice plan on a clipboard beside a whistle and cones. Text overlay: PRACTICE PLAN, ONE PAGE. Rust and ink palette, 1000x1500 vertical."

### Pin 8
- **Board:** Team Parent Checklists
- **Title:** What one season actually costs, before you sign up
- **Description:** Registration is the small number. The real total is fees, gear, travel, and the tournaments nobody mentions in March. Add it up first with the free cost calculator from Parent Coach Desk.
- **Link:** https://parentcoachdesk.com/cost-calculator/?utm_source=pinterest&utm_medium=social&utm_campaign=seasonal-queue
- **Image:** imagegen prompt: "Flat vector illustration, a receipt curling off a table next to cleats and a gym bag. Text overlay: WHAT A SEASON REALLY COSTS. Rust and ink palette, 1000x1500 vertical."

---

## What this pattern never does

No account creation, no API keys, no auto-posting, no scheduling on Jeff's behalf. Staged files are inert markdown until a human pastes them. Same HUMAN GATE as the Friday Letter, same reasoning.
