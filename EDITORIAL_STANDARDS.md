# Editorial Standards for Parent-Coach Playbook

These four standards protect the playbook from controversy and ensure the voice stays welcoming to our audience (mid-30s to mid-40s moms, all family structures).

---

## 1. No Gendered Defaults

**The Rule:** Use inclusive language. Avoid "he" and "she" as defaults for kids, parents, or coaches.

**What we changed:**
- "your kid is getting stronger and faster. The bat he used..." → "...The bat they used..."
- "A five-year-old doesn't have the body for travel. She doesn't have the focus..." → "...They don't have the focus..."
- "your job is to understand the rule and let the coach do his job" → "...let the coach do their job"

**Why it matters:** Gendered language makes parents of other kids feel excluded. The playbook is for all families. Use they/their consistently, or use neutral constructions like "your kid" or "the kid."

**Found in 15+ articles; all corrected.**

---

## 2. No Class Assumptions

**The Rule:** Don't assume family income, schedule flexibility, or material goods are available.

**What we flagged (but kept with context):**
- "$70-100 for a glove" — equipment articles name prices to help parents decide. This is appropriate guidance, not assumption.
- "2-4k/year for serious travel" — actual cost transparency, needed for parent decisions.

**What to avoid:**
- "Obviously you have time for three tournaments" (assumes flexible work)
- "Just buy new cleats every season" (assumes replaceable income)
- Naming expensive brands as "standard" without acknowledging cost

**Why it matters:** Rec ball is where families of all incomes start. Travel ball creates class divisions. The playbook should help parents make informed choices, not assume affluence.

**No articles removed; cost information kept as necessary context.**

---

## 3. No Moral Verdicts on Parenting Choices

**The Rule:** Don't declare whether rec vs travel, public vs private school, working vs SAH is "right." State tradeoffs; let parents decide.

**What we kept:**
- "Travel has real costs: money, time, stress. Some families thrive there. Some can't." (neutral)
- "If your kid doesn't make the A team, don't treat it like failure. That's placement." (reframed as opportunity, not judgment)

**What we avoid:**
- "Parents who keep kids in rec ball are underinvesting" (moral judgment)
- "Good parents move their kids to travel at 11" (judgment disguised as advice)

**Why it matters:** Families make different choices for real reasons. The playbook supports all of them. Our job is to help parents think through tradeoffs, not to shame them.

**Articles on rec vs travel softened to be more invitational; no moral frames remain.**

---

## 4. No Identity-Based Generalizations or Stereotypes

**The Rule:** Don't make claims about what kids of particular races, religions, body types, family structures, or neuro profiles do or need.

**What we check for:**
- Gendered defaults (covered above)
- "Immigrant families tend to..." (stereotype)
- "Kids with ADHD can't focus in large groups" (false generalization)
- "Divorced families struggle with..." (assumption)
- "Black athletes are naturally athletic" (stereotype)

**What's safe:**
- "Some kids are ready at 8. Most aren't ready until 11." (developmental, individual variation)
- "Every family has different priorities." (acknowledges diversity without assuming)
- "Some kids thrive in rec. Some kids thrive in travel." (individual, not identity-based)

**Why it matters:** These articles are read by families of all backgrounds. Stereotypes divide audience; individual variation includes everyone.

**No articles contained identity-based generalizations. All use individual framing.**

---

## 5. BLUF on every read

**The Rule:** Every new article gets a `bluf` field in the frontmatter. 30-50 words. Plain text, no markdown. Answer-first. Match the language a parent would actually type into Google.

The BLUF renders as a styled box at the top of the article and feeds the JSON-LD `Article` description. It's what Google pulls into a featured snippet.

**The pattern:**
- Sentence 1: the direct answer to the implied question
- Sentence 2-3: the rule or the why
- Sentence 4: the trade-off, the watch-out, or the next step

**Examples that work:**
- "Coach the team, keep the kid. In the dugout your child is a player. You correct them the same way you'd correct any nine-year-old, same words, same tone, same length. In the car after, they are your kid again, not a learning opportunity."
- "Don't make any decisions in the first 24 hours after a cut. Don't email the coach. Don't switch leagues. Don't promise private lessons. Sit. Wait. Talk in the morning."

**Anti-patterns:**
- Restating the dek in different words. The dek is voice. The BLUF is search.
- Paragraph form with multiple ideas. Snippet boxes are short. Pick one answer.
- Hedging ("it can be helpful to consider..."). Direct or skip the BLUF.

**Backfilled so far (May 6, 2026):** 10 flagship pieces. The pattern is in place; new pieces should ship with a BLUF from day one.

---

## 6. Anchor text discipline

**The Rule:** In-prose links use search-query-shaped anchors, not titles.

The audit caught that most internal links read like article titles ("Three drives, one relationship") instead of the queries parents actually search ("what to say after a bad game"). Title-shaped anchors are good for tone but weak for SEO. Query-shaped anchors stack topical authority on the linked page.

**Bad:** "See [Three drives, one relationship] for the framework."
**Good:** "See [why what you say in the car matters more than the game itself] for the framework."

**Bad:** "Read [The 90-Second Rule]."
**Good:** "Read [what to say to your kid in the first 90 seconds after a bad game]."

The pillar nav and footer can keep title-shaped anchors. In-prose links should match search intent for the destination page.

---

## Implementation

**For future writing:**
1. Default to they/their for kids, parents, coaches unless a specific named person.
2. When naming costs, be transparent. When naming values (best, right, smart), add context. "This works for families with X constraints..."
3. Talk about tradeoffs, not verdicts. "If you do X, you lose Y and gain Z."
4. If you're about to write "Parents of [identity] tend to...", stop. Write about individual variation instead: "Some parents..." or "Kids who..."

**For editing:**
- Search for gendered pronouns (he, she, his, her for non-specific kids/parents). Replace with they/their.
- Search for "always," "never," "should," "best," "right" in context of parenting choices. Soften to invitational language.
- Search for stereotypes (check against rubric above). Rewrite as individual variation.
- Read titles of articles about sensitive topics (bullying, quitting, mental health). Ensure they don't contain gendered defaults or stereotypes in the URL or headline.
