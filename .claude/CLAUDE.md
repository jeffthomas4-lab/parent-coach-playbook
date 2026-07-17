# parentcoachdesk.com — Project Instructions

This is the source repo for parentcoachdesk.com: an Astro hybrid site on Cloudflare Pages serving parents of youth athletes.

## Stack

- Astro hybrid (static + SSR) on Cloudflare Pages
- Cloudflare D1 for camps database
- TypeScript, Tailwind
- Content collections: `src/content/articles/`, `src/content/coaching-tips/`, `src/content/gear/`
- Affiliate data: `src/data/affiliates.json`
- Site config and SPORTS array: `src/data/site.ts`
- Workers: `worker-cron/`, `worker-link-checker/`

## Writing standards

Apply these on every piece of writing without being asked:

**Voice:** Direct, peer-to-peer, coach-adjacent. Jeff is a D3 head football coach. Write like a coach talking to a parent, not like a content agency.

**Banned words (partial list):** delve, tapestry, leverage, robust, seamless, pivotal, transformative, foster, empower, innovative, journey, elevate, harness, unlock, comprehensive, streamline, dynamic. No reframe patterns. No fake wisdom triplets. No em dashes. 3-sentence paragraph max.

**Editorial standards:**
- Use they/their for generic kids, parents, coaches — never he/she as defaults
- No class assumptions (don't assume schedule flexibility or budget)
- State tradeoffs, not moral verdicts on parenting choices
- No identity-based generalizations
- Every new article needs a `bluf` field: 30-50 words, plain text, answer-first
- Anchor text: query-shaped, not title-shaped
- Acronyms expanded on first use in body copy

## Corrections log

When you change an already-published piece in a way a returning reader should know about, log it. The public log is /about/corrections/ and its single source of truth is `src/data/corrections.ts`.

- What gets logged: factual fixes, source/link replacements that carried real weight (a citation, not a "see also"), and substantive rewrites that change the argument or recommendation.
- What does NOT get logged: typos, copy edits, and rewrites that don't change the substance.
- How: add one `Correction` object (`date`, `piece`, `url`, `change`, `reason`) to the top of the array in `src/data/corrections.ts`, and add the on-page correction note at the bottom of the piece. The page re-sorts and refreshes its "last updated" date on its own — do not hand-edit dates in the page.

## Affiliate rules

- Amazon Associates tag: `parentcoachpl-20` — every Amazon URL needs `?tag=parentcoachpl-20`
- Never use raw Amazon URLs in markdown — always use `/go/[slug]/` via `affiliates.json`
- No amzn.to short links

## Deploy commands

Every session that changes a file in this repo ends with this PowerShell block:

```powershell
npm run build
git add -A
git commit -m "ONE-LINE SUMMARY"
npx wrangler pages deploy dist --project-name parent-coach-playbook --branch main
git push
```

Build before commit. Commit before deploy. Specific commit message, not "update files."

## Agents and commands available

**Agents** (invoked automatically when relevant):
- `growth-marketing` — SEO, internal linking, affiliate revenue
- `security-engineer` — security audits, JWT gap, CSP, affiliate redirect safety
- `qa-human-tester` — parent/operator flow testing
- `product-manager` — backlog prioritization against 2026 success metrics
- `billing-finance` — affiliate tag integrity, link health, FTC compliance
- `engineering-manager` — build one backlog task at a time
- `customer-success` — reader feedback, content gaps, escalation triage
- `data-acquisition` — validate bulk imports before they go live
- `data-quality` — content integrity sweep
- `jarvis-orchestrator` — coordinates all agents for GO/NO-GO decisions

**Commands:**
- `/site-check` — full quarterly readiness check
- `/launch-check [section]` — GO/NO-GO before launching a major section
- `/preflight` — fast pre-deploy gate
- `/security-check` — full security audit
- `/red-team [scope]` — attack simulation
- `/billing-check` — affiliate revenue audit
- `/human-test [persona]` — parent/operator flow testing
- `/build-task [n]` — build one task from SITE_IMPROVEMENTS.md
- `/content-audit [scope]` — content integrity sweep
- `/data-import-check [file]` — validate bulk import before it goes live
- `/backlog-update` — update SITE_IMPROVEMENTS.md after a session

## Priority order

Work from SITE_IMPROVEMENTS.md. Tier 1 before Tier 2. Claude-executable before Jeff-required. Affiliate revenue items before pure SEO.

The two 2026 success metrics: Chain Reaction manuscript complete, UPS football finishes 4th in conference. Site work that doesn't fund or free time for those goes to the bottom of the list.
