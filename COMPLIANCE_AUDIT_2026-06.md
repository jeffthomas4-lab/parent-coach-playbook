# Compliance audit: June 10, 2026

Scope: affiliate (FTC + Amazon Associates), privacy, email, children's content, health content, UGC, claims accuracy, anonymity, site policies. Audited source files and the rendered build in `dist/`. The sandbox could not reach parentcoachdesk.com directly, so live-site checks ran against the current `dist/` output, which is what Direct Upload deploys. Anything marked FIXED is already changed in source and ships with the next deploy.

I am not your lawyer. Items marked LAWYER need real legal review. Everything else is standard-practice compliance work.

---

## Critical

### 1. No affiliate disclosure above the links on articles and drills. FIXED.
- **Files:** `src/layouts/ArticleLayout.astro`, `src/pages/coaching-tips/[slug].astro`
- **Rule:** FTC 16 CFR Part 255 requires disclosure that is clear, conspicuous, and placed before the first affiliate link. A footer note after the links does not count.
- **What was wrong:** Articles (car-kit, 5-year-old-glove) disclosed only in the bottom "About this piece" box, after the links. The drills template had no disclosure at all, with 18 `/go/` links across 14 drill pages. Gear guides and recruiting pages were already correct.
- **Fix applied:** ArticleLayout now renders the standard disclosure box above the body whenever the article contains a `/go/` link, and the bottom note only renders when links are actually present. The drills template got the same treatment.

### 2. UTM parameters appended to Amazon Special Links. FIXED.
- **File:** `src/pages/go/[slug].astro`
- **Rule:** The Amazon Associates Operating Agreement requires Special Links to be used as provided. Appending parameters modifies the link and risks breaking tag attribution on the amzn.to shortlinks. All 71 affiliate entries are Amazon.
- **What was wrong:** Every `/go/` page redirected to `amzn.to/...?utm_source=parentcoachdesk&utm_medium=affiliate&utm_campaign=...`. Those params land on Amazon's side and never reach your analytics, so they carried risk and returned nothing.
- **Fix applied:** Amazon destinations (amzn.to, amazon.com) now pass through untouched. Non-Amazon retailers still get UTMs. The live `/go/` pages keep the old behavior until this deploys, so ship it.

### 3. No terms of use, and the camps directory now needs one. LAWYER.
- **Files:** `public/_redirects` (`/terms` 301s to `/disclosure/`), no terms page exists
- **Rule:** No law forces a terms page on a content site. But the camps directory accepts user submissions and reviews, hosts camp photos, and sells a $79/year listing claim. A paid service plus UGC with no terms means no content license from submitters, no takedown framework, no warranty disclaimer, no liability cap, and no refund terms on the $79.
- **Fix needed:** A real `/terms/` page covering: UGC license and representations (submitter owns the content and has consent for any photos, including photos of minors), moderation and removal rights, the claim service terms (what $79 buys, renewal, refund, termination), disclaimers, and governing law. This one is worth an hour of a real lawyer's time. Do not ship a template I write as if it were reviewed.

---

## Should fix

### 4. 57 affiliate links missing rel="sponsored". FIXED.
- **Files:** `src/content/guides/first-aid-kit.md` (17), `season-essentials.md` (23), `sideline-kit.md` (17), `src/pages/body/[slug].astro` (gear list link)
- **Rule:** Google's spam policies want paid links marked `rel="sponsored"`. Not a legal requirement, but the site's own standard is `rel="sponsored nofollow noopener"` and these links skipped it.
- **Fix applied:** All HTML `/go/` anchors in content and templates now carry the full rel set.

### 5. Disclosure page contradicted the camps claim business. FIXED.
- **Files:** `src/pages/disclosure.astro`, `src/pages/about.astro`
- **Rule:** FTC truth-in-advertising. "We do not accept payment to feature a product, a camp, a service, or a person" sat on the same site as a $79/year paid listing claim. A regulator or an annoyed camp owner reads that as a false statement.
- **Fix applied:** Both pages now state the claim service exists, what the fee buys (self-service editing, logo, photos, registration link), and what it does not buy (placement, ranking, ratings, reviews). Read the new wording and confirm it matches how claims actually behave in ranking code. If claimed camps get any visibility boost anywhere, the wording has to change.

### 6. Body-page gear links disclosed after the links. FIXED.
- **File:** `src/pages/body/[slug].astro`
- **Rule:** Same FTC placement rule as item 1.
- **Fix applied:** The disclosure line moved above the "Gear that helps" list and now includes the commission sentence. The duplicate line below the list was removed.

### 7. Privacy section did not cover reviews, claims, or user rights. FIXED.
- **File:** `src/pages/disclosure.astro`
- **Rule:** CalOPPA requires a privacy policy that describes what you collect. The policy covered newsletter emails, analytics, and camp submissions, but not review submissions (email stored, display name published) or listing claims (name, email, organization, phone).
- **Fix applied:** Both are now listed, plus a "Your rights" paragraph: access, correction, deletion on request, 30-day handling, and a truthful note that you do not sell personal data. Last-updated date bumped to June 10, 2026.

### 8. CAN-SPAM physical address. VERIFY IN KIT.
- **Where:** Kit account settings, not the repo
- **Rule:** CAN-SPAM requires a valid physical postal address in every commercial email and a working unsubscribe. Kit injects both from account settings, and the repo cannot show what is configured.
- **Fix needed:** Open Kit, Settings, and confirm a mailing address is set. If you do not want your home address in every Friday Letter, use a PO box or a virtual mailbox. Unsubscribe is Kit-native and the drafts in `kit-emails/` reference it, so that half is fine. Also good news: the Friday Letter drafts and all eight public PDFs contain zero Amazon links, which the Operating Agreement prohibits in email and offline documents. Keep it that way.

### 9. No DMCA agent or copyright takedown path.
- **Where:** Nothing in the repo; corrections page covers factual errors only
- **Rule:** DMCA safe harbor for user-posted content (reviews, camp photos) requires a registered agent with the Copyright Office and a posted takedown contact. Registration is online and costs $6 for three years.
- **Fix needed:** Register at dmca.copyright.gov, then add a short copyright section to the future terms page naming the agent email. Until then the site carries the (small) exposure for infringing UGC. Your call on timing; the camps photo gallery makes it worth doing before camp season peaks.

### 10. Camp photos of minors have no consent representation. JUDGMENT + TERMS.
- **Files:** `src/pages/api/admin/camps/[id]/photo.ts`, claim flow in `src/pages/camps/[slug].astro`
- **Rule:** Kids' image rights belong to their parents. The camp uploading the photo bears primary responsibility, but the site republishes. Standard practice: the uploader represents they have rights and any needed consents, in writing, at upload.
- **Fix needed:** One sentence in the claim/upload flow plus a clause in the terms page (item 3). I did not add the upload-flow sentence because the claim UI wording is yours to approve. Suggested line: "By uploading you confirm you own these photos and have written consent from a parent or guardian for any child shown."

### 11. The "editorial team" framing on /about/. YOUR JUDGMENT.
- **File:** `src/pages/about.astro` ("the editorial team includes parents who coach across... Several have worked in collegiate athletics. Several have spent fifteen years...")
- **Rule:** Anonymity is legal. Publishing anonymously while monetizing and covering health topics is legal. Describing a multi-person team that may not exist is a factual claim, and "several" is a count.
- **Fix needed:** If the Desk is functionally you, soften to language that is true of one person with a network ("the Desk draws on parents and coaches across baseball, softball..."). Not changed by me because only you know the facts. Worth fixing before the November author reveal makes the gap visible in hindsight.

### 12. GDPR/EU analytics consent. ACCEPTED RISK OR GEO-GATE.
- **Files:** `src/layouts/BaseLayout.astro` (GA4), `public/_headers` (CSP)
- **Rule:** You are almost certainly under every CCPA threshold. GDPR/ePrivacy technically wants consent before GA cookies for EU visitors. The site honors DNT and Global Privacy Control before loading GA, which is better than most US sites, but it is not EU consent.
- **Fix needed:** Nothing urgent for a US-audience site with no EU targeting. Options if you want it closed: geo-gate GA off for EU visitors at the Cloudflare layer, or swap GA for Cloudflare Analytics alone. Flagging so the choice is deliberate.

---

## Nice to have

### 13. Markdown-syntax affiliate links render without rel attributes.
22 `[text](/go/slug/)` links across 16 files (two articles, fourteen drills) render as bare anchors. Astro can decorate these globally with a small rehype plugin keyed on the `/go/` prefix. SEO hygiene, not law. Exact fix: add `rehype-external-links` (or a 10-line custom plugin) in `astro.config.mjs` setting `rel="sponsored nofollow noopener"` on any href starting with `/go/`.

### 14. Price attributed to Amazon by name. FIXED.
`how-to-net-a-soccer-goal.md` listed "Amazon: $20-40" in a retailer comparison. Reworded to "Online retailers." Everything else uses "Around $X–Y" editorial ranges with no claim of being Amazon's current price, which is the right pattern. Keep prices as ranges, keep "Around," never put a dollar figure and the word Amazon in the same line.

### 15. The Friday Letter "marked with a small note" promise.
`/disclosure/` promises non-Amazon affiliate links get marked inline. No CJ links are live yet, so the promise is currently vacuous. When CJ approves, build the marking into the link component on day one so the promise stays true.

---

## What passed

- **Amazon required statement.** "As an Amazon Associate we earn from qualifying purchases" is present verbatim on `/disclosure/`, bolded, with the full program participation sentence. "We" instead of "I" is the accepted form for a branded site.
- **Redirect hygiene.** `/go/` pages are robots-blocked, noindexed, canonical to the destination, and the pages where links actually appear are fully crawlable, so Amazon's compliance crawler can verify context. The interstitial sends your origin as referrer. This setup is standard and fine.
- **PDFs and email.** All eight public PDFs and the Kit sequence drafts contain zero Associate links. The Operating Agreement bans them there; you are clean.
- **COPPA.** Nothing on the site collects from children. Forms are adult-directed (reviewer email, claimant org, submitter email), the audience statement is parents and coaches, and the under-13 disclaimer is posted. The site being about kids does not trigger COPPA; collecting from them would.
- **Health content.** The BodyDisclaimer renders on every body page: not medical advice, talk to your pediatrician, call 911. All 177 body topics carry governingBodies citations in frontmatter. "Questions to bring to the pediatrician" framing routes decisions to clinicians instead of giving personalized advice. This is genuinely well built. The standing disclaimer does not make a lawyer unnecessary if you ever publish return-to-play protocols as instructions rather than information; the current pieces stay on the right side of that line.
- **Review authenticity.** Reviews are pre-moderated, the form discloses moderation and that good and bad both publish, and I added one sentence: no paid reviews, no suppression, claiming a listing has no effect. That aligns with the FTC fake-review rule (16 CFR Part 465). The "your kid attended" eligibility is self-attested, which is normal; do not add incentives for reviews without re-reading Part 465.
- **Cost calculator claims.** The methodology page names Project Play, the parent survey, and the governing bodies per profile, attributes the $1,016 figure to its survey, states the IRS mileage rate, and frames defaults as estimates with an update cadence. SourceNotes render per profile. Nothing presented as fact that is actually an estimate.
- **Accessibility statement.** Claims are specific (WCAG 2.2 AA target, known limitations listed) rather than aspirational boilerplate. Keep the known-limitations list honest as things get fixed.
- **Corrections.** Posted policy, logged changes, reader credit handling. Good.
- **Anonymity.** Publishing as "the Parent Coach Desk" is legal, including with affiliate revenue and health content. FTC rules attach to the claims, not the byline. Two checks: your Amazon Associates account must carry your real information (account-level, not site-level), and when CJ approves, their publisher profile needs real identity too. The JSON-LD Organization-until-reveal switch in `site.ts` is clean.

---

## Fix list shipped in this session

| File | Change |
|---|---|
| `src/layouts/ArticleLayout.astro` | Disclosure above body when `/go/` present; bottom note now conditional |
| `src/pages/coaching-tips/[slug].astro` | Same disclosure, previously none |
| `src/pages/body/[slug].astro` | Disclosure moved above gear links; rel added to gear anchor |
| `src/pages/go/[slug].astro` | No UTM params on Amazon destinations |
| `src/content/guides/first-aid-kit.md`, `season-essentials.md`, `sideline-kit.md` | rel="sponsored nofollow noopener" on all 57 bare `/go/` anchors |
| `src/pages/disclosure.astro` | Camps claim paragraph; reviews + claims in privacy list; rights paragraph; date bump |
| `src/pages/about.astro` | Camps claim fee added to funding section |
| `src/pages/camps/[slug].astro` | No-paid-reviews sentence on the review form |
| `src/content/articles/how-to-net-a-soccer-goal.md` | "Amazon: $20-40" reworded |

## Open items, in order

1. Verify the physical address in Kit settings (item 8). Five minutes.
2. Decide on the /about/ team wording (item 11). Five minutes.
3. Register the DMCA agent (item 9). Fifteen minutes and $6.
4. Photo-upload consent sentence (item 10). Needs your wording approval.
5. Terms of use page (item 3). LAWYER. The single biggest gap on the site.
6. EU analytics posture (item 12). Decide once, low urgency.
7. Rehype plugin for markdown affiliate links (item 13). Next dev session.

The build could not be run in this sandbox. `npm run build` is the first line of the deploy block below and will catch any compile issue before anything ships.
