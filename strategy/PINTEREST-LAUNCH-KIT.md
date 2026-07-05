# Pinterest launch kit

Prep only, per the ground rules. Nothing here touches an actual Pinterest account. Everything below is what to paste in once the account exists and is claimed/verified for parentcoachdesk.com.

All 30 destination URLs are checked against live content as of 2026-07-05.

---

## Image specs

Pinterest's own standard: **1000 x 1500px (2:3 ratio)**, PNG or JPG, under 20MB. Anything else gets cropped unpredictably in the feed.

Brand system to match (pulled from `src/styles/pcd-tokens.mjs`, this is the same palette the live site uses, nothing invented):

- Background: Cream Paper `#FAF6EE` or warm cream `#F2EAD9`
- Text: Warm Ink `#2D2520` for headlines, Walnut `#5F5448` for body-weight text
- Accent: Terracotta `#C5713D` for the CTA line or an underline/highlight
- Secondary accent: Honey `#D4AB6A`, used sparingly, same role it plays sitewide (highlight, not background)
- Headline font: Fraunces (serif, the site's display font)
- Body/label font: Mulish

Layout that works on Pinterest and matches the site's own editorial look: photo or illustration on the top two-thirds, headline in Fraunces on a cream card at the bottom third, one short line of supporting text in Mulish underneath it. The site's existing hero illustrations (`public/illustrations/`) are landscape, not 2:3, so treat them as a crop source or mood reference, not a drop-in asset. Several existing illustrations are close enough to reuse as a base crop: `the-90-second-rule.webp`, `night-before-tryouts-bedroom.webp`, `cost-calculator-kitchen-table.webp`, `travel-vs-rec-diptych.webp`, `family-season-calendar.webp`.

Every pin needs a text overlay. Pinterest users scroll fast; the pin has to make its point without a click.

---

## Board 1: Sideline Scripts (what to say, when)

Board description: *Word-for-word scripts for the moments youth sports parents don't get a rehearsal for. The car ride home, the night before tryouts, the text you don't know how to answer.*

**Pin 1.1** — Title: "The 90 seconds after a bad game decide the whole week"
Description: The first 90 seconds after your kid's game sets the tone for the next seven days. Here's what actually works, by a head coach who gets it wrong most Saturdays too.
Destination: `/drive-home/the-90-second-rule/`
Image concept: dashboard clock at 4:47, kid's silhouette in the rearview mirror. Overlay: "What to say in the first 90 seconds."

**Pin 1.2** — Title: "Don't ask this the night before tryouts"
Description: The question that feels supportive and does the opposite, the night before your kid tries out for the team.
Destination: `/drive-there/night-before-tryouts/`
Image concept: bedroom at night, cleats and jersey laid out on a chair. Overlay: "The night before tryouts is for presence. Not pep talks."

**Pin 1.3** — Title: "My kid said he's not a good player. Here's what I said back."
Description: The wrong move sounds supportive. The right move takes a longer pause than feels comfortable.
Destination: `/drive-home/what-my-kid-said-in-the-car/`
Image concept: back-seat car window view, kid looking out. Overlay: "He didn't need me to disagree. He needed me to take him seriously."

---

## Board 2: Youth Sports Cost Breakdowns

Board description: *Real numbers on what youth sports actually costs, by sport and by level. Rec, club, and travel, broken down honestly.*

**Pin 2.1** — Title: "What travel ball actually costs in a year"
Description: The real annual number for travel baseball, tournament weekends included, not the number the club quotes you in March.
Destination: `/drive-home/the-cost-of-travel-ball/`
Image concept: kitchen table flatlay, calculator and a stack of tournament flyers. Overlay: "The real cost of travel ball."

**Pin 2.2** — Title: "AAU basketball: the real all-in cost"
Description: Mid-tier AAU programs quote $1,500 to $3,500 in fees. The real number once travel weekends do their work lands much higher. Here's the math.
Destination: `/drive-there/how-much-does-aau-basketball-cost/`
Image concept: basketball on a kitchen counter next to a receipt stack. Overlay: "$1,500 quoted. Here's what it actually costs."

**Pin 2.3** — Title: "Youth hockey cost breakdown, gear to ice time"
Description: Skates, pads, ice time, travel. The full-season number for youth hockey, broken down by age.
Destination: `/drive-there/youth-hockey-cost-breakdown/`
Image concept: hockey gear laid out for sizing, parent's hands helping a kid into pads. Overlay: "What youth hockey actually costs."

---

## Board 3: Gear Guides by Sport

Board description: *What to buy, what to skip, by sport and by age. No sponsored picks, just what holds up.*

**Pin 3.1** — Title: "Baseball gear guide: what to buy by age"
Description: Glove, bat, helmet, cleats. What's worth buying new and what to buy used, tee-ball through middle school.
Destination: `/what-to-buy/baseball/`
Image concept: baseball glove and bat flatlay on grass. Overlay: "Baseball gear, by age. What to buy, what to skip."

**Pin 3.2** — Title: "Youth hockey gear: the real starter list"
Description: Skates, helmet, stick, full pads. Plan for serious investment, here's where to actually spend it.
Destination: `/what-to-buy/hockey/`
Image concept: hockey gear bag, half-packed. Overlay: "Hockey gear guide: what's worth it, what isn't."

**Pin 3.3** — Title: "Gymnastics gear: what a beginner actually needs"
Description: What to buy before your kid's first competitive gymnastics season, and what to wait on.
Destination: `/what-to-buy/gymnastics/`
Image concept: leotard and grips flatlay. Overlay: "What to buy for gymnastics, by level."

---

## Board 4: Camps & Summer Planning

Board description: *Picking, vetting, and packing for summer camp. Sports camps, day camps, overnight camps, all in one place.*

**Pin 4.1** — Title: "The camp safety question most parents skip"
Description: Eight questions to ask before you register your kid for any camp. The one most parents skip is the most important one.
Destination: `/drive-there/how-to-vet-a-camp-for-safety/`
Image concept: camp brochures fanned out on a table. Overlay: "The safety question most parents forget to ask."

**Pin 4.2** — Title: "Browse youth sports camps by state and sport"
Description: A searchable directory of youth sports camps, filterable by sport, age, and location.
Destination: `/camps/`
Image concept: map-style graphic or a stack of camp gear (duffel, water bottle, sunscreen). Overlay: "Find a camp by sport and state."

**Pin 4.3** — Title: "The first overnight camp at 9: what to actually pack"
Description: Sending your kid to overnight camp for the first time. What to pack, what to skip, what to tell them before you leave.
Destination: `/drive-there/the-first-overnight-camp-at-9/`
Image concept: packed duffel bag on a bed, name tags visible. Overlay: "First overnight camp: the real packing list."

---

## Board 5: Big Decisions Every Sports Parent Faces

Board description: *Rec or travel. Specialize or stay multi-sport. Quit or push through. The honest version of these decisions, not the Instagram version.*

**Pin 5.1** — Title: "Should my kid play travel sports?"
Description: The honest framework for the travel-or-rec decision, without the guilt trip either way.
Destination: `/decisions/should-my-kid-play-travel-sports/`
Image concept: split image, rec-league field vs. travel tournament banner. Overlay: "Travel or rec? The honest framework."

**Pin 5.2** — Title: "When should a kid specialize in one sport?"
Description: The age where specializing starts to make sense, and the age where it's still too early no matter how good they are.
Destination: `/decisions/when-to-specialize/`
Image concept: a kid's bag with two different sports' gear mixed together. Overlay: "When (and if) to specialize."

**Pin 5.3** — Title: "Should my kid quit the team?"
Description: How to tell the difference between a kid who needs to push through a hard patch and a kid who needs to be done.
Destination: `/decisions/should-my-kid-quit-sports/`
Image concept: empty bench, single water bottle. Overlay: "Push through, or let them quit? Here's how to tell."

---

## Board 6: Recruiting Reality Check

Board description: *What college recruiting actually looks like, the real odds, and what to do instead of panicking in 8th grade.*

**Pin 6.1** — Title: "The real odds of playing college sports"
Description: About 7% of high school athletes play any college sport. About 2% play Division I. The honest math, by sport.
Destination: `/recruiting/scholarship-odds-the-honest-math/`
Image concept: stadium seats, mostly empty, one spotlighted seat. Overlay: "The real odds. Not the ones your club tells you."

**Pin 6.2** — Title: "How college recruiting actually works"
Description: The real process, from first contact to signing day, without the myths.
Destination: `/recruiting/how-recruiting-actually-works/`
Image concept: recruiting letter on a kitchen counter. Overlay: "How recruiting actually works, step by step."

**Pin 6.3** — Title: "The recruiting timeline, by grade"
Description: What actually needs to happen freshman year versus junior year. Most families are stressed about the wrong grade.
Destination: `/recruiting/recruiting-timeline-by-grade/`
Image concept: calendar with grade levels marked. Overlay: "Recruiting timeline, by grade. What matters when."

---

## Board 7: Coaching Your Own Kid

Board description: *For the parent who's also the coach. The dugout, the bench, the drive home, and how to do all three without breaking the relationship.*

**Pin 7.1** — Title: "Coaching your own kid, fairly"
Description: The parent-coach's hardest job: making sure your own kid gets treated exactly like everyone else's, and the team can tell.
Destination: `/drive-home/coaching-your-own-kid-fairly/`
Image concept: coach's clipboard, one jersey number circled then uncircled. Overlay: "Coach the team. Parent the kid. Different jobs."

**Pin 7.2** — Title: "Coaching your kid in front of the whole team"
Description: What to do when the lineup decision about your own kid is being watched by every parent in the stands.
Destination: `/game/coaching-your-own-kid-in-front-of-the-team/`
Image concept: coach mid-lineup-card, bleachers visible behind. Overlay: "Every parent in the stands is watching this decision."

**Pin 7.3** — Title: "A practice plan parents and kids can both read"
Description: One page, big type, two objectives max. The plan we wish someone had handed us in year one.
Destination: `/resources/practice-plan-template/`
Image concept: clipboard flatlay with a simple one-page practice plan. Overlay: "The practice plan template that actually gets used."

---

## Board 8: The Parent Sideline Survival Guide

Board description: *What to do (and not do) on the sideline, by sport. For the parent who wants to be there without being that parent.*

**Pin 8.1** — Title: "Soccer sideline behavior: what actually helps"
Description: What to say, what to skip, and where to stand during your kid's soccer game.
Destination: `/game/soccer-parent-sideline-behavior/`
Image concept: sideline chairs, parent watching quietly. Overlay: "Sideline behavior that actually helps your kid."

**Pin 8.2** — Title: "Football sideline behavior for parents"
Description: The line between supportive and embarrassing on a football sideline, and how to stay on the right side of it.
Destination: `/game/football-parent-sideline-behavior/`
Image concept: stadium bleachers, quiet crowd. Overlay: "What to do (and skip) on the football sideline."

**Pin 8.3** — Title: "Basketball sideline behavior for parents"
Description: Gym acoustics carry every word. What to actually say from the stands during your kid's basketball game.
Destination: `/game/basketball-parent-sideline-behavior/`
Image concept: gym bleachers, parent silhouette. Overlay: "The gym hears everything. Here's what to actually say."

---

## Board 9: Season Calendars & Age Pathways

Board description: *What "good" looks like at every age, by sport. Season calendars, tryout windows, and the honest pathway from 7 to 18.*

**Pin 9.1** — Title: "Baseball pathway: what good looks like by age"
Description: From tee-ball to varsity, the age-by-age map of what to expect and when to worry less.
Destination: `/pathways/baseball/`
Image concept: baseball diamond overlay with age markers. Overlay: "The baseball pathway, age 5 to 18."

**Pin 9.2** — Title: "Basketball pathway: rec, school, club, AAU"
Description: When each level makes sense, and why levels are tools, not rankings of parental commitment.
Destination: `/pathways/basketball/`
Image concept: basketball hoop, kids of visibly different ages. Overlay: "Rec, school, club, AAU: when each one fits."

**Pin 9.3** — Title: "High school football season calendar"
Description: The full fall football calendar, two-a-days through playoffs, so nothing catches your family off guard.
Destination: `/season-calendar/hs-football-fall-pnw/`
Image concept: wall calendar with football-season blocks marked. Overlay: "The high school football calendar, month by month."

---

## Board 10: Team Parent Toolkit

Board description: *Snack schedules, banquet planning, parent meetings, group chats. The unglamorous logistics that make a season run.*

**Pin 10.1** — Title: "The team-parent job system, start to finish"
Description: Snack signups, carpool, team gifts, banquet. One system that runs the whole season without one parent doing it all.
Destination: `/team-parent/team-jobs-system-complete-guide/`
Image concept: clipboard with a simple job-assignment sheet. Overlay: "The team job system that actually works."

**Pin 10.2** — Title: "The end-of-season banquet, without the stress"
Description: A full toolkit for the end-of-season banquet: what to plan, what to skip, how to write the speech.
Destination: `/team-parent/end-of-season-banquet-toolkit/`
Image concept: simple banquet table setup, trophies in soft focus. Overlay: "The banquet toolkit that saves you a week."

**Pin 10.3** — Title: "The parent kickoff meeting every team should hold"
Description: A 10-minute season-opening meeting that answers 90% of the questions parents would otherwise text the coach all season.
Destination: `/drive-there/parent-kickoff-meeting/`
Image concept: parents seated in a semicircle, coach with a one-page agenda. Overlay: "One 10-minute meeting. A season of fewer texts."

---

## Posting cadence

Pinterest rewards steady, not bursty. Suggested launch pace:

- Week 1: create all 10 boards with descriptions, pin 3 pins total (one per board, spread across boards 1, 2, 3) to seed the account.
- Weeks 2 through 10: 3 new pins per week, one board at a time, in the order above. By week 10, all 30 are live.
- After week 10: 2 to 3 re-pins per week of the strongest performers (by saves), rotated, rather than only pushing new content.

## Before going live

1. Claim and verify the domain in Pinterest business settings (Settings → Claimed accounts → parentcoachdesk.com). Unclaimed domains don't get the rich-pin treatment or site analytics.
2. Enable Rich Pins for articles (requires the Open Graph tags already on the site, confirmed present via `og-default.webp` and per-article `hero`/`heroAlt` fields).
3. Design all 30 pin images before the first post, using the specs above, so the visual system is consistent from day one instead of drifting pin to pin.
4. Add UTM params to every destination URL so traffic is attributable: `?utm_source=pinterest&utm_medium=social&utm_campaign=launch&utm_content=board-{n}-pin-{n}`.
