# Parent Coach Desk Backlink Execution Plan

**Status:** Draft for Jeff approval
**Date:** 2026-08-03
**Authority:** Execution view of `PARENT-COACH-DESK-BACKLINK-STRATEGY.md` and `BACKLINK-EARNING-STANDARD.md`
**Purpose:** Put every backlink opportunity in the queue owned by the person or system capable of taking its next action.

## 1. The five work categories

These are workflow states. A target may move between them as work is completed.

| Category | Meaning | Who acts next | Exit condition |
|---|---|---|---|
| **Automatic** | A preapproved system can perform the next action without a human decision. | Provider or automation | Evidence is recorded; exceptions move to Pending Review. |
| **Pending Review** | AI can perform the research, verification, scoring, matching, or drafting now. A reviewer must approve the result before an external action. | Nora or Claude; then reviewer | Approved work moves to Human Needed or an approved automation. Rejected work returns for revision, Later, or Spam. |
| **Human Needed** | AI preparation is complete or an account, identity, relationship, interview, send, purchase, or provider action requires Jeff. | Jeff or another named human | The human action and evidence are recorded; monitoring resumes automatically. |
| **Later** | The opportunity is legitimate but currently blocked by a missing product, proof point, identity decision, or disproportionate effort. | Nobody now | A named trigger or review date returns it to Pending Review. |
| **Spam** | The tactic is irrelevant, deceptive, ineligible, low-value, or likely to create harmful link patterns. | Nobody | Terminal unless new evidence materially changes the classification. |

Category rules:

1. `Automatic` never includes outreach sends, account creation, identity verification, purchases, provider-setting changes, interviews, reviews, production publishing, or reciprocal commitments.
2. `Pending Review` must name the deliverable the AI will produce and the reviewer who receives it.
3. `Human Needed` must state one exact action, the destination/account, the estimated human time, and any deadline.
4. `Later` must contain a trigger such as `public tool shipped`, `10 customers`, `author reveal completed`, or a dated recheck. “Someday” is not a valid trigger.
5. `Spam` records the reason so another agent does not rediscover and re-propose the tactic.
6. BabyLoveGrowth provider-network links remain classified separately from independently earned domains even while active.

## 1A. Implemented portfolio foundation

### PF1. Parent Coach Desk and Coach Jeff Thomas contextual cross-links

**Implemented locally:** 2026-08-03  
**Production state:** Pending the normal reviewed deployment of each site  
**Classification:** `portfolio` (useful entity and audience connection; not an independently earned referring domain)

| Source | Destination | Reader purpose | Link treatment |
|---|---|---|---|
| `https://parentcoachdesk.com/about/` | `https://coachjeffthomas.com/about/` | Books, leadership frameworks, and collegiate coaching background | Contextual, canonical, followed |
| `https://coachjeffthomas.com/about/` | `https://parentcoachdesk.com/about/` | Practical youth-sports scripts, tools, and parent guides | Contextual, canonical, followed |

Both placements are inside relevant About-page copy rather than sitewide footers. The local Coach Jeff Thomas production build contains the rendered PCD anchor, the PCD About component compiles with the Coach Jeff Thomas anchor, and both exact-anchor checks reject `nofollow` or `sponsored` qualification. After each deployment, verify HTTP 200, canonical URL, visible context, link attribute, and one-click destination. Record the two links as portfolio connections and exclude them from independent-referring-domain targets.

## 2. Automatic

### A1. BabyLoveGrowth backlink placements

**Current decision:** Active monitored use, approved by Jeff on 2026-08-03.

The provider may continue giving and receiving contextual network links under the current account configuration. No additional backlink-credit purchase is authorized by this plan.

Automatic evidence to capture when access permits:

- given and received source URL;
- destination URL;
- anchor and surrounding text;
- giving/receiving domain;
- placement date;
- visible link relationship attribute;
- direct or indirect reciprocal relationship;
- topical-fit score;
- live verification result;
- first-party referral activity;
- provider-reported versus independently verified state.

Exceptions move to Pending Review when the placement is irrelevant, sensitive, unavailable, misleading, unusually reciprocal, or impossible to verify. Automation recommends a hold but does not change the provider.

### A2. Backlink inventory and verification

Run automatically after the Plan 022 tooling exists:

- daily import of available BabyLoveGrowth placement data;
- weekly Search Console external-link export/diff;
- weekly live check of newly found and previously landed links;
- weekly predecessor/portfolio/provider/independent classification;
- removal and redirect detection;
- duplicate-domain and anchor-concentration detection;
- monthly provider-network quality report;
- monthly destination-page search and referral summary.

Failures create a Pending Review item. They never silently delete records or alter provider state.

### A3. Opportunity research refresh

Automation may recheck public URLs, submission paths, staff pages, resource-page gaps, and target activity. It may rescore a target and draft a proposed change. Material score changes, contact changes, or a move into Spam require review.

### A4. BabyLoveGrowth content-to-asset matching

For each approved BabyLoveGrowth topic, automatically propose:

- destination role;
- one linkable PCD asset;
- internal links;
- possible external resource-page audiences;
- source and freshness requirements;
- post-publish verification checklist.

The proposal moves to Pending Review before publication or outreach.

### A5. Reporting

Generate one compact weekly queue:

- automatic actions completed;
- items awaiting review;
- exact Jeff actions;
- later items whose triggers fired;
- spam items newly detected;
- new independent domains;
- new provider-network domains;
- lost or degraded links;
- referral and conversion evidence.

## 3. Pending Review

AI owns the next work for these queues. It produces a complete review packet; it does not send or submit externally.

### PR1. Finish the five current governing-body and nonprofit targets

| Target | AI work now | Review packet |
|---|---|---|
| WIAA Health and Wellness | Reverify page; find named contact; confirm safety asset readiness; tighten existing pitch. | Source page, contact, destination, score, pitch, risk check. |
| Washington Youth Soccer | Reverify exact gap; select soccer/concussion destination; draft pitch. | Same six-part packet. |
| Special Olympics Washington | Find named program contact; reverify Unified Sports destination and pitch. | Same six-part packet. |
| USA Football Health and Safety | Reverify resource page; source-check football safety destination; draft pitch. | Same six-part packet. |
| Adaptive Sports Northwest | Reverify program scope; select exact adaptive-sports guide; draft inclusion-focused pitch. | Same six-part packet. |

After approval, each moves to Human Needed with one send action.

### PR2. Tacoma and Washington resource batch

AI should research and prepare the next ten in this order:

1. Tacoma Public Schools Unified Sports;
2. Metro Parks Tacoma youth sports;
3. Washington State PTA;
4. ParentMap;
5. Seattle's Child;
6. Pierce County Parks youth sports;
7. Tacoma Public Library;
8. Pierce County Library System;
9. YMCA of Pierce and Kitsap Counties;
10. Boys and Girls Clubs of South Puget Sound.

For each, identify one existing source page, one specific PCD asset, one named contact or official submission path, and one audience benefit. Do not draft a pitch when the asset is not ready; classify it as `asset_gap` instead.

### PR3. National youth-sports resource batch

Work in five-target batches, ordered by direct audience and asset fit:

- Positive Coaching Alliance;
- National Alliance for Youth Sports;
- National Council of Youth Sports;
- Every Kid Sports;
- Project Play;
- Little League;
- AYSO;
- US Youth Soccer;
- USA Volleyball;
- Junior Volleyball Association;
- USA Basketball;
- USA Softball;
- USA Hockey;
- USA Lacrosse;
- USA Track and Field;
- USA Swimming;
- USTA;
- USA Gymnastics;
- USA Wrestling;
- USA Cheer and USASF;
- Special Olympics;
- Women's Sports Foundation;
- Girls on the Run.

The AI must verify exact resource-page fit. A governing-body homepage alone is not enough.

### PR4. Safety and child-welfare batch

Research only after the linked PCD asset passes its source and safety review:

- HealthyChildren from the American Academy of Pediatrics;
- CDC HEADS UP;
- National Athletic Trainers' Association;
- Korey Stringer Institute;
- Safe Kids Worldwide;
- STOP Sports Injuries;
- U.S. Center for SafeSport;
- American Red Cross;
- American Heart Association CPR;
- StopBullying.gov;
- The Jed Foundation.

The pitch must frame PCD as a plain-language parent companion, never as a replacement for clinical, legal, governing-body, or emergency guidance.

### PR5. Expert-source and media-response preparation

AI may monitor and draft suitable responses for:

- Qwoted;
- Source of Sources;
- Featured free opportunities;
- Help a B2B Writer only when Jeff's coaching, leadership, or software experience directly fits.

Every response packet includes the query, deadline, outlet, journalist verification, exact expertise match, 100-to-200-word answer, source support, bio, and whether a link was requested or merely optional. Paid Featured use remains Human Needed and separately gated.

### PR6. Controlled distribution content

AI may prepare:

- Pinterest pin titles, descriptions, image briefs, exact destination URLs, and UTMs;
- Medium canonical-import candidates and post-import verification steps;
- Substack excerpts that are meaningfully distinct from the original;
- useful Reddit and Quora answer drafts matched to real questions;
- genuine GitHub or GitHub Pages methodology/data documentation;
- genuine technical posts for DEV, Hashnode, HackerNoon, or DZone;
- truthful Crunchbase and founder-profile copy;
- Indie Hackers build notes with real evidence.

Each packet remains Pending Review until accuracy, voice, platform rules, and destination fit pass.

### PR7. Linkable assets

AI should prepare one complete brief at a time:

1. cost-calculator methodology and downloadable evidence package;
2. parent-coach conversation card pack;
3. first-season launch kit;
4. youth-sports safety readiness matrix;
5. 2026 Youth Sports Family Cost Index;
6. Parent Pulse survey.

The first asset should be the cost-calculator package because a live calculator already exists and can support the widest immediate outreach set. Original data and safety assets require stronger review before promotion.

## 4. Human Needed

These are actions AI cannot truthfully complete for Jeff.

### H1. Approve and send outreach batches

**Human action:** Review a five-target packet and send the approved pitches from the appropriate identity.

**Estimated time:** 15 to 25 minutes per batch.

The system must present source page, destination, score, contact, pitch, and risk flags together. No hunting through multiple files.

### H2. Resolve the author reveal

Thirteen current media, podcast, and organization pitches rely on the anonymous-to-named author story.

**Human action:** Confirm one author or two, exact reveal date, public byline, bio, headshot, and approved external profiles.

**Estimated time:** 30 to 45 minutes for the decision and approved identity packet.

Until resolved, these remain Human Needed:

- Raising Athletes;
- Parents in Sport Podcast;
- The Pure Athlete Podcast;
- Youth Sports Parenting Tribe;
- Healthy Sports Parents;
- Our Kids Play Hockey;
- Changing the Game Project;
- Project Play;
- John Branch;
- The News Tribune;
- The Seattle Times;
- Fatherly;
- Motherly.

Rob Rossi remains Pending Review because the pitch needs rescoping before a human action is useful. Melissa Isaacson moves to Later unless a current specific angle is found.

### H3. Claim and verify accounts

AI can prepare the copy and asset package. Jeff must sign in, create, claim, or verify:

- Crunchbase;
- GitHub organization/profile if not already controlled;
- Medium publication/profile;
- Substack publication;
- Pinterest business account;
- Product Hunt maker profile when its trigger fires;
- Qwoted, Source of Sources, Featured, and relevant professional profiles;
- any directory requiring identity, email, phone, or organization verification.

**Estimated time:** 5 to 15 minutes per account after the packet is ready.

### H4. Interviews, podcasts, and partner conversations

AI can research, prepare talking points, and draft follow-up material. Jeff must attend and speak for himself.

**Human action:** Accept or decline, schedule, participate, approve quotations when offered, and disclose relationships accurately.

### H5. Institutional and relationship-based links

Links from University of Puget Sound, schools, leagues, PTAs, parks departments, nonprofits, and professional associations may require a real relationship or authorized representative.

**Human action:** Make the introduction or confirm that outreach from PCD is appropriate. Do not imply institutional endorsement without permission.

### H6. Provider and purchase decisions

Current BabyLoveGrowth backlink use is approved. Jeff is still required for:

- purchasing additional link credits or changing the subscription;
- changing exchange settings;
- restricting, holding, or disabling the exchange;
- approving removal requests or provider escalation;
- accepting any commercial, sponsored, reciprocal, or co-marketing agreement.

## 5. Later

These are legitimate opportunities with a named activation trigger.

| Opportunity | Trigger that brings it back |
|---|---|
| Product Hunt and BetaList | A polished interactive PCD tool or meaningful software beta is publicly usable. |
| AlternativeTo, Alternative Me, SaaSHub, Toolify AI | PCD has a clearly categorized public software or AI product. |
| TrustRadius and PeerSpot | At least 10 real eligible customers and an honest review process exist. |
| Chrome Web Store | A useful maintained browser extension ships. |
| SourceForge and OSS Gallery | A maintained open-source or downloadable project exists. |
| StackShare | A stable public architecture story is worth maintaining. |
| Gumroad | A real free or paid downloadable product is ready. |
| Goodreads | A real published book and author page exist. |
| Tiny Startups, TinyLaunch, Indie Page, WIP, Milestones | A launch milestone gives their audience something usable. |
| TrustMRR, Latka, Boring Cash Cow, Revenue Memo, Founder Reports | Verifiable revenue or growth evidence supports the profile or story. |
| Starter Story, Failory, Niche Pursuits | A transparent evidence-backed founder, failure, or SEO case study exists. |
| SaaStr, SaaS Club, FounderPass, GrowthMentor, Builder Society | PCD has meaningful SaaS/customer evidence or Jeff has a genuine contribution. |
| Forbes, TechCrunch, VentureBeat, Entrepreneur, The Hustle, First Round Review | Original data, material traction, or a genuinely newsworthy milestone exists. |
| My First Million, Mixergy, Foundr | A strong national business story and verified results exist. |
| Smashing Magazine | PCD produces an exceptional reusable accessibility, design, or web-engineering lesson. |
| AppSumo Blog | A public software/tool launch fits its audience. |
| YourStory and Indie Bites | A current founder angle and geographic/editorial fit are verified. |
| MakerPad | Current activity, ownership, and submission path are verified. |
| Melissa Isaacson rescope | A current girls' or women's youth-sports story directly fits her work. |
| National top-tier press pitches | The Family Cost Index or Parent Pulse has publishable methodology and a real finding. |

Review Later monthly. Only move a row when its trigger is evidenced.

## 6. Spam — do not do

“Spam” classifies the proposed tactic, not necessarily the entire named platform.

### Terminal tactics

- buying followed links or generic backlink packages;
- automated mass-directory submission;
- private blog networks;
- excessive direct or indirect link exchanges;
- comment, forum-signature, profile, or guest-post links created mainly for anchor text;
- fake customer reviews or seeded ratings;
- fake founder, author, business, location, or institutional profiles;
- hidden links, distributed keyword-rich widgets, and sitewide footer exchanges;
- copied, spun, or mass-generated guest articles;
- press releases distributed mainly for optimized links;
- uploading generic images to Imgur, Flickr, Pixabay, or Pexels only to obtain a profile link;
- full-article mirrors on HubPages, Vocal Media, or Blogger without a real audience purpose and verified canonical strategy;
- self-created promotional pages or links on Wikipedia or Fandom;
- creating a Google Business Profile or Yelp listing for an online-only publication without real eligibility;
- irrelevant Privacy Tools or software-directory submissions;
- paying an outlet to preserve ranking credit without `sponsored` or `nofollow` treatment;
- links on health, safety, child-welfare, legal, or trust content inserted without editorial review;
- community answers that do not fully help the reader without clicking the PCD link;
- cross-linking PCD and SightSmash merely to simulate independent authority;
- treating BabyLoveGrowth provider-network links as independently earned citations.

### Current seed rows classified Spam for the proposed PCD tactic

- Wikipedia self-placement;
- Fandom self-promotion;
- Privacy Tools submission without a privacy product;
- Yelp/local citation without an eligible local operation;
- HubPages, Vocal Media, and Blogger bulk mirroring;
- Imgur, Flickr, Pixabay, and Pexels backlink-only uploads.

These platforms may have legitimate uses in other contexts. The prohibited action is the low-value backlink tactic described above.

## 7. First 30-day operating plan

### Days 1 to 3

Automatic:

- continue BabyLoveGrowth placements;
- capture available given/received link inventory;
- classify provider-network versus independent domains;
- generate the first quality and reciprocity sample.

Pending Review:

- finish PR1's five current governing-body/nonprofit packets;
- inventory the cost calculator as the first pitchable asset;
- prepare the first compact approval packet.

Human Needed:

- none until the packet is complete.

### Days 4 to 10

Pending Review:

- prepare PR2 targets 1 through 5;
- draft the cost-calculator methodology package;
- prepare Pinterest and Medium distribution samples.

Human Needed:

- Jeff reviews and sends the first approved five-target batch;
- Jeff decides whether to complete the author-reveal packet now or retain the November timing.

### Days 11 to 20

Automatic:

- verify sent targets, provider links, Search Console discoveries, and referral events.

Pending Review:

- prepare PR2 targets 6 through 10;
- prepare the first five national youth-sports targets;
- draft up to three suitable expert-source responses when real queries exist.

Human Needed:

- review/send the second batch;
- claim the first approved profiles using AI-prepared copy.

### Days 21 to 30

Automatic:

- issue the first monthly backlink-quality and outcome report.

Pending Review:

- prepare the next national or safety batch based on asset readiness;
- revise pitches using response evidence;
- identify lost, rejected, or asset-gap targets.

Human Needed:

- review/send the third batch;
- approve whether any provider evidence warrants restriction or a later hold.

### Day-30 success evidence

- BabyLoveGrowth continues under monitored classification;
- three complete five-target review packets exist;
- at least two packets have a recorded human decision;
- all sends have evidence and no unauthorized send occurred;
- new links are separated into predecessor, portfolio, provider-network, and independent classes;
- at least one live independent deep link is verified, or the report honestly shows zero and names the next best action;
- no Spam tactic entered the active queue.

## 8. Queue record additions

Add these fields to the canonical ledger during Plan 022 implementation:

- `work_bucket`: `automatic | pending_review | human_needed | later | spam`;
- `next_action`;
- `next_actor`: `automation | ai | jeff | named_external_human | none`;
- `reviewer`;
- `human_minutes_estimate`;
- `blocked_by`;
- `later_trigger` and `recheck_on`;
- `spam_reason`;
- `provider_class`: `none | babylovegrowth | other_network`;
- `independence_class`: `predecessor | portfolio | provider_network | independent | unknown`;
- `approval_ref`;
- `last_transition_at`.

Required validation:

- Automatic rows cannot name an external send, purchase, account, interview, or provider mutation as the next action.
- Human Needed rows require an exact human action and time estimate.
- Later rows require a trigger or date.
- Spam rows require a reason and cannot be selected for drafting.
- Landed provider links cannot be labeled independent.
- AI may propose category changes; only Jeff can approve a move that authorizes an external action.

## 9. Related files

- `strategy/BACKLINK-EARNING-STANDARD.md`
- `strategy/PARENT-COACH-DESK-BACKLINK-STRATEGY.md`
- `strategy/backlink-opportunity-seed.csv`
- `coordination/plans/022-backlink-earning-and-babylove-growth.md`
- `reports/seo/outreach/targets.json`
- `automation/agents/nora/SKILL.md`
