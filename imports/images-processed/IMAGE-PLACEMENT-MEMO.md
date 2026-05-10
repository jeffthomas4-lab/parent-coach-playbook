# Image plan — Parent Coach Playbook

**What I did**
- Looked at `parentcoachplaybook.com` (homepage). It's **very** text-heavy: the hero, the "three drives" frame, the parent-coach pitch, the "tools not advice columns" grid, the cost calculator block, and the "fresh off the desk" feed are all pure type. There are zero photos on the homepage right now, and the only existing imagery on the site lives in `/public/illustrations/` (article-level WebPs).
- Took the 11 PNGs from `imports/images to be processed/`, resized to **1600px wide**, converted to **WebP @ q82**, and renamed them by subject. Total dropped from ~22 MB to ~1.3 MB (94% smaller).
- Files are in `imports/images-processed/`. When you're ready, copy them to `public/illustrations/` to match the existing convention.

---

## The 11 images — what they are and where to put them

| New filename | What's in it | Best placement |
|---|---|---|
| `sports-family-sideline.webp` | Family of four (mom, dad in cap, son in #7 jersey, daughter) sitting close together on the sideline, all smiling | **HERO image** — top of homepage, above "Every parent is a coach." Or `og-default` social card. |
| `walk-to-the-field.webp` | Dad's arm around son (#14 jersey, gear bag) walking through parking lot toward fields at twilight | **Drive 01 — Before** card in the "Every game is three drives" section. Also reusable for `drive-there-divider.webp`. |
| `coach-setting-cones.webp` | Dad/coach in cap kneeling to place orange cones, kids warming up behind, golden hour | **Drive 02 — During** card in the three-drives section. Also fits `/coaching-tips/` index. |
| `the-car-ride-home.webp` | Cinematic interior shot: dad driving, young son in passenger seat looking down, cleats in foreground, sunset out windshield | **Drive 03 — After** card in the three-drives section. THE iconic shot for `/drive-home/` pages. Also pair with the "Last game car ride" article. |
| `empty-gym-after-practice.webp` | Quiet high school gym, ball on floor, "Teamwork Respect Integrity" banner, American flag, soft afternoon light | **"Coaching your kid's team is its own job"** section. The "lineup at midnight" feeling. Also great for `/parent-coach/` index. |
| `sunset-field-scoreboard.webp` | Riverside Community Field scoreboard at sunset, parents in camping chairs watching | **Cost calculator** block ("What does a year of youth sports actually cost?") — sets the community-scale stakes. Also a strong `/cost-calculator/` page hero. |
| `family-season-calendar.webp` | Illustrated "Johnson Family" wall calendar with color-coded kids, sports, notes — hand-drawn look | **Free downloads / "What to Say When" / newsletter** block. Pairs perfectly with "field guide" + "calendar template" vibe. Also use on `/season-calendar/`. |
| `after-the-game-ice-cream.webp` | Dad and daughter (#7 soccer) laughing over ice cream cones at a stand after the game, ball on table | Reads-card image for **"The summer break conversation"** OR **"Are youth sports worth it?"**. Off-season / "it's still fun" energy. |
| `rain-day-sideline.webp` | Mom in puffy jacket under black umbrella watching kids practice in pouring rain | Reads-card image for **"The hard moments"** category tag, or hero for "The loyalty tax" / dedication-themed pieces. |
| `siblings-homework-bleachers.webp` | Mom and two siblings doing homework on metal bleachers while another kid practices in background | Reads-card image for **"What off-season actually means"** OR `/team-parent/` index OR the "Summer parent meeting" article. Multi-kid reality. |
| `backstage-before-recital.webp` | Mom doing daughter's hair backstage, vanity mirror lights, ballet costume | **Performing-arts coverage signal.** Use on `/reads/` filter chip for theater/ballet/dance, or hero for "Banquet speech that doesn't suck" (performance/ceremony angle). Critical because the site claims to cover dance/theater/band but every existing illustration is field-sport. |

### Quick homepage layout suggestion (one paragraph)

The homepage right now is wall-of-text. The single biggest win is dropping **`sports-family-sideline.webp`** behind the hero headline (with a soft dark overlay so the type stays readable), then turning the **three-drives** section into a 3-up grid with **`walk-to-the-field` / `coach-setting-cones` / `the-car-ride-home`** — those three together visually deliver the whole thesis of the site in one glance. Then **`empty-gym-after-practice`** anchors the parent-coach pitch, **`sunset-field-scoreboard`** sits next to the cost calculator block, and **`family-season-calendar`** illustrates the free-download box. That's 7 of 11 placed on the homepage alone. The remaining 4 (`after-the-game-ice-cream`, `rain-day-sideline`, `siblings-homework-bleachers`, `backstage-before-recital`) become reads-card thumbnails on the "Fresh off the desk" feed.

---

## 16 AI image prompts for the gaps

The 11 you have skew "field sports + warm + cinematic." Here's what's missing — drop these prompts into Midjourney / DALL·E / Ideogram / Flux as-is. Each is written in the same visual register so the library stays cohesive.

**Note on style:** Add this to every prompt to keep the set consistent: *"warm cinematic photography, golden hour or soft natural light, shallow depth of field, candid not posed, color palette of navy, warm beige, soft green, real American suburb aesthetic, no logos, no readable text on jerseys"*.

1. **Night before tryouts** — Kid's bedroom, soft bedside lamp, cleats / shin guards / water bottle laid out at the foot of the bed, jersey on a hanger. Empty room, no people. Quiet anticipation. (Fits: `/drive-there/`, "Night before tryouts" piece.)

2. **The post-cut moment** — Parent and tween sitting side-by-side on front porch steps at dusk, phone face-down on the step between them, no eye contact, neither speaking. Backs toward camera. (Fits: `/scripts/` "post-cut text", "On not making varsity".)

3. **First overnight camp packing list, top-down flat lay** — Open duffel bag photographed straight down, contents arranged: labeled toiletry bag, flashlight, name-stamped water bottle, journal, two pairs of folded socks, sunscreen, a small stuffed animal half-tucked in. On a wood floor. (Fits: "First overnight camp packing list" article.)

4. **The travel-vs-rec decision** — Split composition or diptych: left side, minivan trunk loaded with gear bags and a hotel-style suitcase at 6am, gray light; right side, kid walking alone to a neighborhood rec field with a bike, late afternoon. (Fits: `/decisions/` travel ball vs rec.)

5. **Cost calculator visual** — Aerial flat lay on a kitchen table: a registration form with a few red pen circles, a calculator, a coffee mug, a credit card, a couple of receipts, and a kid's drawing of a soccer field peeking from under the papers. (Fits: `/cost-calculator/` hero, "Are youth sports worth it?")

6. **What to Buy gear flat-lay (generic, for the /what-to-buy/ index)** — Top-down composition on a wood floor: one cleat, one ball (soccer), shin guards, a water bottle, a folded jersey, a mouth guard, neatly arranged with breathing room. Soft window light. (Fits: `/what-to-buy/` landing page.)

7. **Concussion / quiet care** — Tween lying on a couch under a knit blanket with an ice pack on their head, mom sitting on the floor beside the couch with a hand on the kid's shoulder, TV off, late afternoon. (Fits: `/body/` concussion piece.)

8. **Pendulum / fun-to-performance** — Conceptual: a brass pendulum or metronome on a wood desk, with a youth sports field blurred in the background through a window. OR a kid mid-swing on a backyard tire swing, soccer ball in the grass. (Fits: `/youth-sports-pendulum/` page.)

9. **Age pathways at a glance** — Same kid photographed at three ages on the same field (7, 11, 15), composited side-by-side in matching uniforms — or three different kids of those ages, same pose, same goalpost. Wide aspect ratio. (Fits: `/pathways/` page.)

10. **The "you should be assistant coaching" conversation** — End-of-practice scene: head coach and a parent leaning on the chain-link fence, talking, gear bag on the parent's shoulder, kids trickling off the field behind them, evening light. (Fits: "The you should be assistant coaching pressure" article.)

11. **Practice plan, top-down clipboard still life** — Clipboard with a hand-drawn drill diagram on graph paper, a whistle, a Sharpie, a stopwatch, a water bottle, all on green turf. (Fits: "Practice plan template", `/coaching-tips/`.)

12. **Newsletter sign-up scene** — Suburban mailbox at the curb at sunset, a single envelope sticking out marked "Parent Coach Playbook," driveway disappearing into the background. Warm, inviting. (Fits: Newsletter CTA block site-wide.)

13. **The bench moment** — Kid in uniform sitting on the team bench, hands on knees, watching teammates play on the field beyond. Subtle, not sad — just present. Parent in stands visible in soft blur. (Fits: "Coaching your own kid in front of the team", playing-time pieces.)

14. **Team parent / snack table** — Folding table at the edge of a field: orange slices in a baggie, juice boxes, a Gatorade cooler, a roster on a clipboard, hands of a parent setting up. Post-game light. (Fits: `/team-parent/` index, banquet/season-end pieces.)

15. **Football / hockey pad-up moment** — Kid in mudroom or garage wrestling shoulder pads over their head, parent kneeling to help fasten a chin strap, gear bag open on the floor. Real, slightly chaotic. (Fits: `/what-to-buy/football/`, hockey, and "What practice actually costs you in hours" themes.)

16. **Recruiting moment** — High schooler walking out of a gym door alone, phone to ear, coach standing in the gym doorway behind them looking on. Ambiguous emotion — could be good news, could be not. (Fits: `/recruiting/` page hero.)

---

## File checklist (for moving to the site)

```
imports/images-processed/
├── after-the-game-ice-cream.webp     (150 KB)
├── backstage-before-recital.webp     (115 KB)
├── coach-setting-cones.webp          (157 KB)
├── empty-gym-after-practice.webp     (114 KB)
├── family-season-calendar.webp       (128 KB)
├── rain-day-sideline.webp            (81 KB)
├── siblings-homework-bleachers.webp  (101 KB)
├── sports-family-sideline.webp       (131 KB)
├── sunset-field-scoreboard.webp      (189 KB)
├── the-car-ride-home.webp            (65 KB)
└── walk-to-the-field.webp            (97 KB)
```

Move them with:
```bash
cp imports/images-processed/*.webp public/illustrations/
```
