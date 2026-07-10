# DATA-MAP — ActivityRadar

Pillar 2 (Privacy) of the Website Build Standard. Every piece of personal data this app touches, where it lives, who it goes to, how long it is kept, and how it gets deleted. The privacy policy at `/privacy` is written from this file.

Last updated: 2026-06-27

---

## Data home

| Store | Binding | What |
|-------|---------|------|
| D1 `activity-radar` (id: 8cc3694a, shared with parent-coach-desk) | `DB` | org_claims, org_suggestions, search_events |
| R2 `activityradar-photos` | `PHOTOS` | Org logos and program photos |
| Cloudflare Web Analytics | dashboard only | Aggregate page views |

D1 and R2 are never bound to or reachable from the browser. All reads and writes go through Workers/Pages Functions.

---

## Personal data collected

| Data | Source | Table / Store | Retention |
|------|--------|--------------|-----------|
| Claimant name | `/claim` form | `org_claims` | Until claim resolved + 12 months |
| Claimant email | `/claim` form | `org_claims` | Until claim resolved + 12 months |
| Claimant role (optional) | `/claim` form | `org_claims` | Until claim resolved + 12 months |
| Claim evidence text (optional) | `/claim` form | `org_claims` | Until claim resolved + 12 months |
| Suggestion submitter email (optional) | `/suggest` form | `org_suggestions` | Until reviewed + 12 months |
| Search queries and filters | All search page loads | `search_events` | 90 days |
| Click-through org IDs | Org card clicks | `search_events.clicked_org_ids` | 90 days (org IDs only, no user ID) |
| Page views, referrer, country | All requests | Cloudflare Web Analytics (aggregate, no cookies) | 30 days (Cloudflare) |
| IP addresses, request logs | All requests | Cloudflare edge (not stored by us) | Cloudflare default |

We do not collect: user accounts, passwords, payment data, device fingerprints, advertising IDs, or cross-site tracking.

---

## Third-party data flows

| Vendor | What they see | Sells data? |
|--------|-------------|-------------|
| Cloudflare (Pages, D1, R2, Workers) | All requests, stored data | No |
| Cloudflare Web Analytics | Aggregate page views | No |
| Cloudflare Turnstile | Bot-check token (no cookies, no cross-site tracking) | No |

No other third parties receive data from this site.

---

## Deletion pipeline

**Claim records:** `DELETE FROM org_claims WHERE id = ?` via `wrangler d1 execute activity-radar`. No cascading data. Backups rotate with D1's managed backup window.

**Suggestion records:** `DELETE FROM org_suggestions WHERE id = ?` via same.

**Search events:** No PII (no user ID, no name, no email in any row). No deletion path needed.

**Cloudflare Web Analytics:** Aggregate only, cannot be traced to individuals. No deletion path.

**R2 photos:** Org-submitted logos. If an org requests deletion, run `wrangler r2 object delete activityradar-photos <key>`.

---

## Children

ActivityRadar is a directory of youth activity organizations, used by parents. We do not knowingly collect information from children under 13. The claim and suggest forms require an adult organizational contact.
