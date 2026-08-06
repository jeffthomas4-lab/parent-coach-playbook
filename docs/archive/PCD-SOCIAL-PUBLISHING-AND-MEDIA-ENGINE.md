# PCD Social Publishing & Media Engine — Spec of Record

*Parent Coach Desk. Captured 2026-07-23 from Jeff's ChatGPT planning session (2026-07-23, 7:48 AM and 10:33 AM threads). Preserved here so the plan lives next to `PCD-remodel-and-pipeline-proposal.md`. This is the source spec for the daily social posting system, the publishing-intelligence layer, the anti-slop quality gates, the image-generation system, and the ElevenLabs voice/avatar roadmap.*

---

## 1. The core decision

Claude creates and prepares posts; a social-platform API or scheduling service publishes them. Browser automation is a temporary bridge only, never the permanent infrastructure (layouts change, MFA interrupts runs, confirmation screens create duplicate-post risk, weak transaction logging). Phase 1 runs as a Claude Cowork scheduled task generating a daily approval package; Phase 2 moves the identical workflow to Cloudflare.

Design principle: not "one article per day" but **one content engine feeding multiple publishing schedules**. The question each morning is not "what do we post today?" but "what content inventory do we have, and what should each platform publish today?"

## 2. Daily workflow

Every morning: find the article designated for today → confirm published and publicly accessible → extract title, URL, featured image, summary, audience, category, related products/camps → generate platform-specific posts → validate link and image → duplicate-check → send for approval (or auto-publish once proven) → record in the social-post ledger.

Platform-native, never identical: Facebook gets a longer conversational intro (70–160 words, 0–3 hashtags); Instagram gets visual formatting, hook + 2–4 points, "link in bio" (never claim a caption link is clickable), 5–10 hashtags, alt text, image headline ≤8 words — with **parentcoachdesk.com/today** as a permanent redirect to the current featured article so the bio link never changes; X gets the shortest treatment, ≤2 hashtags, optional 3-post thread when material supports it.

## 3. The daily scheduled-task prompt (operational artifact — use as written)

> You are the Parent Coach Desk Social Publishing Agent. Run once each morning and promote the Parent Coach Desk article scheduled for today.
>
> **OBJECTIVE.** Create an accurate, useful and platform-native social package for Facebook, Instagram and X. Initially, do not publish without approval unless the operating configuration explicitly sets auto_publish=true.
>
> **SOURCE OF TRUTH.** Use the PCD editorial calendar and published website as authoritative. Find the article assigned to today's date. Confirm: the article is published; the public URL returns successfully; the title matches the editorial calendar; the featured image is available; the article has not already been promoted on the same platform; the article contains no placeholders, broken links or incomplete sections. If no article is scheduled or the article is not ready, do not invent one and do not publish — create an exception report.
>
> **CONTENT EXTRACTION.** Capture: title, canonical URL, publication date, author, category, primary parent audience, main problem addressed, 3–5 useful takeaways, primary CTA, featured-image URL, required affiliate disclosures, any time-sensitive facts needing verification.
>
> **FACEBOOK.** 70–160 words, parent-centered: strong non-clickbait opening; the problem the article solves; 2–3 concrete takeaways; natural invitation to read; direct URL; affiliate disclosure when applicable; 0–3 hashtags only when genuinely relevant.
>
> **INSTAGRAM.** Caption with strong opening sentence; 2–4 useful points; CTA to the link in bio (parentcoachdesk.com/today unless configured otherwise); 5–10 focused hashtags; image alt text; suggested image headline ≤8 words. Do not claim a caption link is clickable.
>
> **X.** One primary post within character limits; article URL; ≤2 hashtags; optional 3-post thread when the article has enough material. Do not duplicate Facebook language.
>
> **QUALITY AND SAFETY.** Never invent facts, statistics, quotes, prices, dates or recommendations. No medical, legal or child-safety guarantees. Do not describe an organization as verified unless the PCD verification record supports it. Disclose affiliate relationships. Avoid fear-based parenting language, engagement bait, generic AI phrases. Use PCD's practical, supportive, family-centered voice. Do not use em dashes. Check spelling, grammar, link accuracy, image availability. Do not expose private notes or unpublished information.
>
> **DUPLICATE CONTROL.** Before publishing, check the ledger for matching article_id + platform + campaign_type + publication date. Never publish the same article twice to the same platform on the same day unless an authorized retry is recorded.
>
> **OUTPUT.** Daily social package: article info; Facebook post; Instagram caption, image headline, alt text; X post; optional thread; link-validation result; disclosure status; duplicate-check result; recommended publication times; approval status; warnings.
>
> **PUBLISHING.** auto_publish=false: save to the approval queue as PENDING_APPROVAL, do not publish. auto_publish=true: publish only after every validation passes. After each attempt record: article_id, platform, exact copy, media asset, scheduled time, actual time, platform post ID, public URL, status, error response, retry count, approval identity, prompt/workflow version. Retry only per configured policy; never resubmit without confirming whether the first attempt succeeded. Finish with a concise run report: prepared, published, skipped, escalated.

Schedule ~7:00 AM Pacific; posting times stored separately.

## 4. Cloudflare production architecture (Phase 2)

Cron Trigger → Social Orchestrator Worker → find today's approved article → social-generation job → Claude API (or deterministic template) → policy/quality validator → approval queue or auto-publish gate → platform adapters (Facebook / Instagram / X) → D1 publication ledger → analytics + retry workflow.

- **D1:** articles, campaigns, generated posts, approvals, publication attempts, platform post IDs, post URLs, errors, engagement snapshots, prompt versions, idempotency keys.
- **R2:** featured images, Instagram cards, resized variants, archived packages, publishing receipts.
- **Workers:** separate modules for article selection, generation, validation, approval, per-platform publishing, analytics.
- **Queues:** cron enqueues per-platform jobs (article:1842 → facebook / instagram / x) so failures retry independently — if X fails, Facebook and Instagram must not repost. Cloudflare Workflows as the durable-step option later.
- **Idempotency (critical):** key like `pcd:article-1842:instagram:primary:2026-07-23`, checked in D1 before any platform call, permanently bound to the post ID on success. Prevents double-posting from timeouts, Worker retries, browser uncertainty, late API responses, or manual reruns.
- **Claude is not the system of record.** D1/editorial DB decides which article is today's, approval state, prior posting, enabled platforms, posting time, affiliate flags, auto-publish permission. Deterministic, not "search around and guess."
- **Article fields:** article_id, title, slug, canonical_url, publication_status, publication_date, featured_image_url, social_status, facebook_enabled, instagram_enabled, x_enabled, affiliate_disclosure_required, social_auto_publish, social_approved_at, social_approved_by, campaign_priority, last_socialized_at.

**Subscription note:** a Cloudflare Worker cannot trigger the Claude Max subscription; the permanent implementation needs an Anthropic API arrangement or deterministic non-LLM templates for some posts. X's developer platform bills consumption-based — treat its cost separately.

## 5. Rollout

Weeks 1–2 draft-only (Claude creates, Jeff approves/edits; edits are recorded to improve brand instructions). Weeks 3–4 approval-assisted (one approval button per package). Then controlled auto-publish for ordinary evergreen only — approval always required for: affiliate buying guides, medical/safety topics, articles naming specific organizations, negative reviews, sponsored content, sensitive youth-sports stories, time-sensitive or controversial topics.

## 6. Publishing Strategy Agent + cadence

Insert a Publishing Strategy Agent between Content Manager and Social Strategist (pipeline: Content Manager → Publishing Strategy Agent → Social Strategist → Publisher → Auditor). It decides: light vs heavy day; which evergreen to resurface; which sport is in season; overused posts; historically best times; question vs link; carousel vs static.

| Platform | Cadence | Goal |
|---|---|---|
| Facebook | 1–2/day | Traffic + community discussion |
| Instagram feed | 3–5/week | Brand awareness and trust |
| Instagram Stories | Daily (1–5 frames) | Top-of-mind |
| X | 2–5/day | Reach, conversation, distribution |
| Pinterest (eventually) | 5–15 pins/day | Evergreen traffic |
| LinkedIn (later) | 2–3/week | Directors, coaches, partnerships |
| Newsletter | Weekly | Owned audience |

One article fuels weeks of content (launch post, discussion question, carousel, Story quiz, X thread, Pinterest infographic, newsletter feature, checklist graphic, seasonal resurfacing — 10+ assets per article). Content inventory includes: today's article, evergreen, parent tips, camp/organization spotlights, buying guides, seasonal reminders, product recommendations, polls, questions, UGC, quotes, statistics, checklists, safety reminders, registration deadlines.

**Seasonal intelligence:** fall soccer, volleyball tryouts, winter basketball, spring baseball, summer camps, registration periods, nationals, school start, holidays, tournament weekends — surface relevant evergreen at the right time. **Cooldowns per asset:** Facebook 120 days, Instagram 180, X 45, Pinterest 365, Newsletter 365. **Long-term:** scored publishing queue (freshness, seasonal relevance, historical performance, traffic/affiliate/newsletter potential, parent value, time sensitivity, diversity, platform fit) filling each platform's daily slots; A/B testing of hooks, images, times, learning toward qualified traffic, signups, affiliate clicks, camp inquiries.

## 7. Anti-slop system (the Human Quality Gate)

Its own system; every piece of content must pass before publication.

**Reject content that:** sounds generic enough to fit any website; doesn't teach something specific; repeats itself; is padded; uses empty motivational language; makes unsupported claims; reads as buzzwords; lacks an actionable takeaway; could have been written without reading the source.

**Banned-phrase library (flag, don't hard-ban):** game changer; unlock your potential; dive into; in today's fast-paced world; it's important to note; delve into; whether you're; navigate the landscape; elevate your; revolutionary; comprehensive guide; ultimate guide; harness the power; embark on; seamless.

**Reward specificity** (what exactly happened, who benefits, when it matters, what an experienced parent would do, what mistake we prevent, concrete examples). **Require original synthesis**, not summary. **Vary sentence rhythm** (short with long, questions, fragments for emphasis, varied paragraphs). **Brand voice before SEO.** **Every article earns its existence:** solves a real parent problem; better than the top five results; bookmarkable; sendable to another parent; ≥1 non-obvious insight — or it doesn't publish.

**Human editing memory:** capture every edit Jeff makes (openings, closings, words removed/added, tone, formatting, CTAs) so the system converges on PCD's voice. **Separate reviewer roles**, feedback-only, never rewriting alone: Accuracy, Brand Voice, Parent Value, Originality, SEO, Compliance.

**The top rule:** never publish because it's grammatically correct — publish only what is useful, specific, trustworthy, and recognizably PCD. Final metric on every report: *"Would an experienced sports parent believe another experienced sports parent wrote this?"* Unqualified yes, or it goes back.

## 8. Visual & video production layer

Built into the Content Manager, not an afterthought. Pipeline: article → platform copy → image concepts → approved images → static posts → short video script → ElevenLabs voice → avatar video → Reels/Stories/FB video/X video/Shorts. OpenAI API (Jeff has access) for image generation now; ElevenLabs as a **replaceable production adapter** (its image/video capability is beta), never hard-coded.

**Visual Creative Agent** receives only approved article facts and produces a structured brief: the single visual idea; realistic scene vs illustration vs checklist vs comparison vs text card; formats needed; whether people appear; misrepresentation risk (real camps/orgs/products/children); generation vs licensed photo vs branded template. Not every post gets a photorealistic AI family — that makes PCD look synthetic.

**Visual source priority (in order):** 1. real PCD-owned photography; 2. organization-provided with documented permission; 3. licensed stock; 4. branded diagrams/checklists/typography cards; 5. AI illustrations/conceptual scenes; 6. AI photorealistic people only when appropriate. Branded checklists likely outperform fake-looking sports-parent photos on trust.

**Asset types:** article heroes (clean, text-overlay-ready); Instagram carousels (question-per-slide); tip cards (controlled templates, not model-generated text); seasonal graphics; buying-guide visuals (never generate fake branded products); Story assets (polls, quizzes, teasers, countdowns).

**Never render important text in the image model.** Generate background/illustration only; the pipeline composes headline, logo, URL, disclosure, brand colors, safe margins deterministically (HTML/SVG/Canvas). Consistent spelling, layout, accessibility.

**PCD visual design system (define before scale):** brand_colors, approved_fonts, logo_variants + clear space, corner_radius, headline_styles, photo_treatment, illustration_style, icon_style, overlay_rules, platform_safe_zones, watermark_rules, prohibited_visuals. Personality: practical, warm, clean, parent-centered, credible, youthful-not-childish, modern-not-startup, helpful-not-promotional. Avoid: hyper-saturated AI color, glow, fake dashboards, unrealistically perfect families, distorted uniforms, crowded text, generic motivational imagery, implied endorsements.

**Visual anti-slop gate — reject when:** scene generic/unrelated; malformed hands/equipment/court lines; unnatural children; fake text; generic AI-ad look; repeated composition (add a visual-similarity check); implies a real event that didn't happen; unauthorized real logos; invented statistics/labels; no informational purpose; violates the design system. Enhanced review for anything with children, realistic people, branded products, org references, or sensitive topics.

**Structured image-prompt package** (never "make an image"): content_id, article_topic, visual_goal, primary_subject, setting, composition, camera_angle, emotional_tone, brand_style, required_negative_space, platform_ratio, people_allowed, minor_safety_rules, prohibited_elements, reference_asset_ids, generation_model, prompt_version. (Worked example in the original session: overhead kitchen-table camp-registration scene; include printed schedule, blank checklist, water bottle, youth shoes, phone face down; warm natural daylight, editorial, no logos, no legible text, no children's faces, no AI glow; background only, negative space upper-left for composed headline.)

**R2 asset ledger — never overwrite, always version:** asset_id, content_id, campaign_id, generation_prompt, negative_prompt, model + version, generation_date, source_assets, dimensions, platform, review_status, reviewer, usage_rights, public_url, hash, parent_asset_id. Auditable: which image ran with which post.

**Cost controls:** daily/monthly generation budgets, max variants per asset, max regenerations, default quality, high-quality-requires-approval, reuse-existing-first. Initial rule: 2 low/medium-cost concepts → select 1 → 1 production version → 1 revision → approval needed beyond that. Master asset + platform crops, not separate unrelated images per platform.

## 9. Voice & avatar roadmap

**Script structure (30s):** 0–3s hook; 3–18s three useful points; 18–25s one caution/overlooked issue; 25–30s CTA. Written for speech, never read from the article. (Good: "Before you register your child for a summer sports camp, ask these three questions…" Bad: "Welcome to Parent Coach Desk. In today's fast-paced world…")

**Avatar anti-slop:** natural contractions, short sentences, specific examples; no fake enthusiasm, exaggerated gestures, or sales cadence; never imply the presenter personally attended/tested something; captions on every video; human review of names/pronunciation; synthetic-media disclosure where a realistic presenter could be mistaken for real. Store voice profile settings (delivery, pronunciation dictionary, emotion) with the asset lineage.

**One recognizable PCD presenter**, not dozens: options are (a) a clearly synthetic PCD guide character (safest), (b) a consented real founder/staff avatar (more trust, needs consent/rights/revocation/security controls), (c) **voiceover over useful visuals** (checklists, screenshots, b-roll, animated text) — often the best and least artificial choice.

**Phases:** 1. static visual system (OpenAI adapter, R2 ledger, prompt templates, brand rules, human approval, crops, deterministic overlays, alt text); 2. voice-only shorts (20–45s scripts, ElevenLabs narration, captions, animated cards); 3. controlled avatar tests on low-risk content only (tips, checklists, seasonal reminders — never medical/safety/injury/legal/critical-org content first); 4. video performance engine (avatar vs voiceover, length tests, hook formats, clicks and saves over views).

**Media approval rule:** an approved article does not auto-approve its media. Each asset independently passes accuracy, brand, quality, rights, safety, and platform-format review before entering the publishing queue.

## 10. The standard

PCD should not look like a website that discovered AI. It should look like a credible parent resource with a disciplined editorial studio that happens to use AI behind the scenes.
