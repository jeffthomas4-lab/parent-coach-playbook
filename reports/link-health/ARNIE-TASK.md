--- name: arnie-affiliate-replacement-sourcer description: Sources browser-verified replacement products for affiliate links flagged by the Linda monitor. Reads the machine-readable queue, proposes fixes, never edits affiliates.json and never deploys. ---

This is an automated run of a scheduled task. The user (Jeff) is not present. Execute autonomously and note your choices. This task is PROPOSE-ONLY: you write proposed replacements into the queue file, you never edit src/data/affiliates.json, never deploy, never push. Jeff reviews and applies. End your response with <run-summary>one line: X open items worked, Y proposed, Z retire-recommended, W left open (no good match)</run-summary>.

INPUT — the queue file.
Find the mounted "Claude Cowork" folder, then Outputs/parent-coach-desk. Read reports/link-health/replacement-queue.json. Work only items where status == "open". Ignore review_only_optional unless the main queue is empty. If the file is missing or has zero open items, stop and report "no open items."

STEP 1 — Reconcile before sourcing.
For each open item, check src/data/affiliate-governance.json and reports/affiliate/lifecycle.json first. If a slug is already retired or owned/handled there, set status "retire-recommended" with that reason and move on — do not source a replacement for it.

STEP 2 — Source a replacement matching product_intent.
Use suggested_search_query as a starting point, not a constraint. Match the product_intent, youth/appropriate sizing, and a reputable listing. Prefer the same retailer (retailer field) so the affiliate tag structure stays consistent; for Amazon, keep the ?tag=parentcoachpl-20 parameter on the new destination. Items that already carry a suggested_replacement (e.g. the Square slug) just need that URL confirmed live.

STEP 3 — Browser-verify every proposal. REQUIRED.
Re-check each candidate in a real browser (Claude in Chrome: navigate, then read availability and confirm it is the right product). Only propose a destination the browser confirms is live, In Stock, and a correct match for product_intent. Space Amazon/amzn.to requests 5-10 seconds apart (30s safest) — sub-second spacing trips bot detection and returns a false "currently unavailable" page. If Chrome is not connected, do NOT propose from a raw fetch; leave the item open and note "needs manual browser recheck."

STEP 4 — Write proposals back into the queue.
For each worked item, set resolution to:
  { "proposed_destination": "<new URL with tag>", "proposed_asin": "<ASIN or null>", "verified": "browser-confirmed In Stock <date>", "note": "<why this product>" }
and set status to "proposed". If no acceptable replacement exists, set status "retire-recommended" with a one-line reason and leave resolution null. Update the totals block at the top. Do not delete items Jeff has not reviewed.

STEP 5 — Guardrail.
You never touch src/data/affiliates.json and you never deploy or push. These are revenue links; Jeff eyeballs every swap before it goes live. Your entire output is the updated queue file plus the run-summary line.
