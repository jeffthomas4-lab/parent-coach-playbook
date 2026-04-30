# AI workflow for The Parent-Coach Playbook

How to keep the site updated with weekly posts using AI as the drafter and you as the editor. The point is to make publishing fast enough to be sustainable.

## The cadence

| When | What | Who |
|------|------|-----|
| Monday morning | Pick the week's two short reads + check if a longer essay is due | You |
| Monday + Tuesday | AI generates two drafts in Maren's or Dan's voice | Claude |
| Wednesday | You edit. ~20 min per post. Read aloud once. | You |
| Thursday | Push to GitHub. Cloudflare auto-deploys. | You |
| Friday morning | Newsletter goes out via Kit. Two posts linked. | You / Kit |

**Minimum viable cadence: 2 short reads + 1 essay per month.** Realistic upper bound: 2 short reads per week.

## The three voices

Voice and content rules are baked into prompts. Use them every time.

### Maren Bell — lead writer (mom voice)

- 200–500 words per post
- First person. Specific kids and ages.
- Warm, slightly tired, observational, occasionally funny
- Drinks too much coffee, doesn't yell from the sidelines
- Has a 9-year-old soccer kid and a 13-year-old who plays viola and basketball
- Voice tics: "OK." as a sentence. Sentence fragments. Specific sensory detail (cleats, parking lot, kitchen counter)
- Signs posts: `— Maren`

### Dan Kowalski — contributor (dad voice)

- 250–500 words per post
- Drier than Maren, more analytical, self-deprecating
- Software engineer. Coaches twin 11-year-olds in baseball. Has a 7-year-old in soccer.
- Best on coaching-your-own-kid + partnership-with-your-spouse beats
- Voice tics: lists. Short crisp paragraphs. "Here is what I almost did and what I actually did."
- Signs posts: `— Dan`

### Jeff Thomas — founder (real you)

- 600–1200 words per post (cornerstone essays)
- Real college-football coaching credibility threaded in
- Bigger frame: youth-to-college, methodology, why the framework holds
- Once a month, max
- Signs nothing — your real byline is enough

---

## The prompt template (copy/paste into Claude or ChatGPT)

```
Write a short post for The Parent-Coach Playbook in Maren's voice.

Background on Maren:
- Mom of two: 9-year-old soccer kid, 13-year-old who plays viola and basketball
- Former college lacrosse player, ex middle-school English teacher
- Warm, slightly tired, funny, observational, drinks too much coffee
- Does not yell from the sidelines
- Has been a team mom, snack parent, assistant coach
- Signs posts: "— Maren"

Hard rules (no exceptions):
- 200 to 500 words
- No em dashes, ever
- No banned words: delve, leverage, robust, seamless, pivotal, navigate, embark, unlock, unveil, foster, cultivate, elevate, empower, transform, showcase, harness, holistic, ecosystem, journey, multifaceted, intricate, sophisticated, dynamic, vibrant, compelling, meaningful, impactful, transformative, ever-evolving, fast-paced, bespoke, curated, myriad, profound, essential, crucial, vital, realm, landscape, paradigm, cornerstone, bedrock
- No banned phrases: delve into, dive deep, deep dive, at the end of the day, it's worth noting, when it comes to, in the realm of, at its core, the crux of, testament to, in today's world, paint a picture, whether you're X or Y, not only X but also Y, straightforward
- No reframe pattern ("not just X, but Y")
- No fake-wisdom triplets ("it's about X, about Y, about Z")
- No empowerment closes ("the future is yours to shape")
- No throat-clearing openings ("let me explain", "here's the thing")
- No summary closes ("so what does this mean?")
- Paragraphs: 3 sentences max
- Use sentence fragments. Use "And" and "But" to start sentences sometimes.
- Specific names, numbers, places. Real moments. No abstractions.
- Italicize one phrase per headline (the conceptual hinge), wrap with single asterisks: *real game*

Topic: [INSERT TOPIC HERE]

Filed in: [drive-there | game | drive-home]
Sport: [baseball | softball | soccer | basketball | football | hockey | lacrosse | volleyball | multi-sport | theater | band | choir | dance]
Age band: [5-7 | 8-10 | 11-12 | 13-14 | 15-plus | all-ages]

Output format: Astro markdown frontmatter + body. Use this exact structure:

---
title: "Headline with *italicized phrase*"
contributor: "maren-bell"
format: "note"
issue: [next number]
phase: "[drive-there | game | drive-home]"
sport: "[from list above]"
age: "[from list above]"
seasonPhase: "[pre-season | early | mid | playoffs | off-season]"
publishedAt: [today's date YYYY-MM-DD]
---

[body in markdown, 200-500 words, signed at the end with "— Maren"]
```

For Dan, swap the bio paragraph and the contributor slug to `dan-kowalski`.

For Jeff, use the same hard rules but allow 600-1200 words and use `jeff-thomas` as the contributor slug, format `essay`.

---

## 50 topic ideas (rotate through these)

### Drive There (pre-game)
1. The night before tryouts, what to do and what not to do
2. The pre-game breakfast that won't sit in their stomach
3. What to say in the parking lot before they get out of the car
4. Pre-game playlists (the music that keeps you both calm)
5. The "one job today" sentence and how to write it for your kid
6. What to do if your kid is throwing up before the game
7. How to handle the in-laws who came to watch
8. The Saturday morning when nobody can find the cleats
9. Pre-game snacks: ranked
10. When your kid says they don't want to go

### The Game (in-game)
11. How loud is too loud from the sideline
12. What to do when the ref blows a call
13. The other parent who is yelling at his kid
14. When your kid comes off the field crying
15. How to handle a benching (theirs or someone else's)
16. The post-loss locker room walk to the car
17. When to step in and when to let it go
18. The kid on the team who is mean to your kid
19. The play your kid messed up that the team won anyway
20. Coaching from the sideline when you're not the coach

### Drive Home (post-game)
21. What you say in the first 90 seconds (and why)
22. The drive home after a win
23. The drive home after a loss
24. The drive home after they got cut
25. The dinner table conversation, by age
26. Why you stopped asking "did you have fun?"
27. The text from the coach you read at 9 PM
28. The car ride after the bad game where they didn't speak
29. When your kid tells you they want to quit
30. When your kid tells you they want to switch sports

### Multi-activity / orchestration
31. The team mom group chat (rules and etiquette)
32. The carpool rotation that actually works
33. What's in your sideline bag (an honest list)
34. The schedule conflict you can't solve
35. The sibling at every game (and how to make it not boring)
36. Why you're not going to that travel team meeting
37. The volunteer hours requirement, decoded
38. When two activities collide on the same Saturday
39. The team photo day that everyone hates
40. The end-of-season banquet (what to bring, what to wear, what to skip)

### Coaching your own kid (Dan's beat)
41. The first practice you ran for your own kid's team
42. The lineup card at midnight
43. When your kid throws to the wrong base
44. The other parents on your coaching staff
45. The conversation with your spouse the night before tryouts
46. How to give your kid a real correction in the dugout
47. The day your kid figured out you were the coach
48. When you start coaching the team your kid isn't on
49. Quitting the volunteer job (and why it's OK)
50. Co-parenting the season: who does what

---

## Editorial review checklist (5 minutes per post)

Before you push, check each item.

- [ ] Read it aloud. Does it sound like Maren / Dan / Jeff would say it?
- [ ] Search for banned words (Ctrl+F). Top offenders: leverage, robust, seamless, transform, navigate, holistic, journey, paradigm, somewhat, perhaps, arguably.
- [ ] Search for em dashes. Replace all.
- [ ] No reframe patterns ("isn't just X, it's Y")
- [ ] No fake-wisdom triplets
- [ ] No "Did you have fun?" closing if it's a drive-home piece (we are explicitly against this)
- [ ] At least one sentence starts with "And" or "But"
- [ ] At least one sentence fragment
- [ ] At least one specific number, name, or moment (a 9-year-old, the third inning, the kitchen counter)
- [ ] Headline has exactly one italicized phrase wrapped in `*asterisks*`
- [ ] No headers like "What this means" or "The takeaway"
- [ ] Closing isn't a summary or empowerment line
- [ ] Signed `— Maren` or `— Dan` for short reads (Jeff doesn't sign)

If any check fails, fix it. Don't ship until it sounds like a person.

---

## How to publish (the actual mechanics)

1. **Save the markdown file.** Path: `src/content/articles/your-slug-here.md`. Use kebab-case for the slug.

2. **Test locally** (optional but recommended):
   ```powershell
   cd "C:\Users\jeffthomas\Desktop\Claude Cowork\OUTPUTS\parent-coach-playbook"
   npm run dev
   ```
   Open http://localhost:4321 and click through to your new post.

3. **Build to confirm no errors:**
   ```powershell
   npm run build
   ```

4. **Push:**
   ```powershell
   git add -A
   git commit -m "Issue 047: [headline]"
   git push
   ```

Cloudflare auto-deploys in ~90 seconds.

---

## Sending the newsletter (Kit, free plan, manual)

Kit's free plan does not auto-send a sequence with the new post. So:

1. Friday morning, open Kit
2. Click **Broadcasts → New Broadcast**
3. Subject line: the post's headline (italicize the conceptual hinge in plain text)
4. Body: the dek + 1-2 sentences of teaser + the link to parentcoachplaybook.com/[phase]/[slug]
5. Send to your full list

Sample subject line: *What you say in the first 90 seconds*

Sample body:
```
Hey,

Maren has a new short read up. The first 90 seconds after a youth game decide what the next week feels like in your house. She wastes the window almost every Saturday. Here is what she is trying to do instead.

Read it: parentcoachplaybook.com/drive-home/the-90-second-rule

— Jeff
```

15 minutes a week, max.

---

## When NOT to use AI

Some posts must be written by you, by hand, no AI:

1. **Cornerstone essays under your real Jeff Thomas byline.** The credibility is your real coaching career. AI cannot fake that. Write these yourself.

2. **Anything that names a real person.** If a post references a specific kid, parent, or coach you actually know, write it yourself. Composite voices are fine; specific real people are not.

3. **Anything responsive to the news cycle.** A youth-sports incident in the news, a viral parent video, a policy change in the league. Write fast and human.

4. **Apology or correction posts.** If you ever need to walk something back, write it yourself.

For everything else, use the prompt template and the editorial checklist.

---

## How to improve over time

Every quarter, do a 30-minute review:

1. Read three random posts from the last 90 days
2. Note any patterns that drift toward generic AI prose
3. Update the banned word list and the prompt template
4. Add 10 new topic ideas to the rotation

The voice gets sharper the longer you run it. Three months from now this prompt template will be tighter than it is today.
