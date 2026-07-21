# Admin Moderation UI

## Overview

The admin moderation UI lives at `/admin/camps/queue` and provides a unified dashboard for approving camp submissions, reviews, and claim requests. All actions happen via fetch to existing admin API endpoints—no page reload required.

Gated by Cloudflare Access (`/admin/*`). No auth logic in the page itself; Access headers are verified server-side and at each API endpoint.

## Page sections

### Section A: Pending camp submissions

Lists all camps with `status='pending'`. Each row shows:

- Camp name, sport, age range, format (day/overnight)
- Location (city, state)
- Dates
- Inline-editable fields: website URL, contact email, description
- Submitter email and submission timestamp
- If the fuzzy-duplicate check finds a likely match: a warning box listing the matched camp(s), with a one-click **Reject as duplicate** button

Inline-editable fields save for real. Typing in website URL, contact email, or description shows a **Save edits** button under the description field. Clicking it POSTs only the changed fields to `/api/admin/camps/{id}/update` and shows a success or error message inline. If the admin clicks Approve or Approve & verify while an edit is unsaved, the page saves the edit first and only proceeds to approve if the save succeeds — an unsaved edit is never silently discarded.

Four action buttons:
- **Approve & verified**: POSTs to `/api/admin/camps/{id}/approve` AND `/api/admin/camps/{id}/verify` (sets both status=approved and verified=1)
- **Approve**: POSTs to `/api/admin/camps/{id}/approve` (status=approved only)
- **Reject**: opens the reason-code row (see below)
- **Reject as duplicate** (only shown when the fuzzy-match warning is present): POSTs straight to `/api/admin/camps/{id}/reject` with `reason_code: 'duplicate'`, no extra clicks needed

The **Reject** button opens an inline row with a reason-code dropdown (recorded for source-quality stats) and an optional notes field, plus Confirm reject / Cancel buttons. A reason code is required before Confirm reject will submit.

Photo upload button: file input that POSTs to `/api/admin/camps/{id}/photo` (standard multipart/form-data). Accepts jpg, png, webp up to 5 MB.

After any action, the row fades out and is removed from the page. Status message shows inline (success or error).

Count badge in section header shows current pending count.

### Section B: Pending camp reviews

Lists all reviews with `status='pending'`. Each row shows:

- Camp name and link to camp
- Reviewer email and display name
- Rating (out of 5) and review body
- Submission date

Two action buttons:
- **Approve**: POSTs to `/api/admin/reviews/{id}/approve`
- **Reject**: POSTs to `/api/admin/reviews/{id}/reject`

Same removal + status message pattern as Section A.

### Section C: Pending claim requests

Lists all claims with `status='pending'` (includes verified claims per the query). Each row shows:

- Camp name
- Claimant email, name, organization, phone
- Proof of ownership notes
- Current claim status (pending/verified)
- Submission date

Two action buttons:
- **Mark verified**: POSTs to `/api/admin/claims/{id}/update` with status='verified'
- **Reject**: POSTs to `/api/admin/claims/{id}/update` with status='rejected'

(There is no "Mark paid" button on this page. That was documented here before but never shipped in `queue.astro`.)

Same removal + status message pattern.

## Implementation details

### Server-side (Astro frontmatter)

- Fetches all three queues using `listPendingCamps`, `listPendingReviews`, `listPendingClaims` from `src/lib/camps-db.ts`
- Builds a camp lookup map to hydrate camp names for reviews and claims
- Passes admin email to the template via `getAdminEmailFromRequest(Astro.request)` for display

### Client-side (vanilla JS, `<script is:inline>`)

Plain ES5 JavaScript in DOMContentLoaded event. No TypeScript syntax.

Rows are identified by `data-id` attribute. Each row has action buttons with `data-action` attribute:

- `approve`, `approve-verified`, `reject`, `reject-confirm`, `reject-cancel`, `reject-duplicate`, `save-edits` for camps
- `approve`, `reject` for reviews
- `mark-verified`, `reject` for claims

Camp rows also track dirty state on the three edit inputs (`data-field="website_url"`, `data-field="contact_email"`, `data-field="description"`). Each input's server-rendered value is stashed in a `data-original` attribute on load; an `input` listener flips a per-row `dirty` flag and shows the `save-edits` button. `save-edits` diffs current values against `data-original` and POSTs only the changed keys to `/api/admin/camps/{id}/update`. On success it resets `data-original` and hides the button; on failure it leaves the row dirty and shows the error inline. Clicking `approve` or `approve-verified` while dirty runs the same save first and only proceeds to approve if it succeeds.

On action-button click (approve/reject/mark-verified/reject-duplicate):
1. Prevent default
2. Construct appropriate fetch URL and body
3. POST to `/api/admin/{resource}/{id}/{action}` (or `/api/admin/{resource}/{id}/update` for claims)
4. Parse JSON response
5. Show status message inline (success/error)
6. If successful, fade row to 50% opacity then remove it

Photo upload uses a hidden file input with `data-action="upload-photo"`. FormData is sent to `/api/admin/camps/{id}/photo`.

### Styling

Uses existing brand tokens and classes:
- `border-bone`, `bg-paper`, `bg-paper-warm`, `text-ink`, `text-ink-soft`, `text-rust`
- `border-sage`, `bg-sage-bg` for approve buttons (green)
- `border-paper-warm`, `bg-paper-warm` for verify buttons (tan)
- `font-display`, `font-body`, `italic`, `leading-snug`, `leading-tight`

All buttons are 0.5rem 1rem padding, 0.85rem–1rem font size. Responsive grid layout (sm:grid-cols-2, sm:grid-cols-3, sm:grid-cols-4).

## How Jeff uses it

1. Open `/admin/camps/queue` in a browser (access is gated by Cloudflare Access)
2. Three sections appear: pending camps, reviews, claims
3. For each camp: scan the details, edit any typos/data directly in the form, then click an action button
4. Upload photos inline without leaving the page
5. Rows fade and disappear after action, keeping the queue clean
6. Check the count badges to track what's left
7. When all sections are clear, close the tab

## Legacy page: `/admin/camps/index.astro`

Older, plain-HTML pending list. No JS, forms POST directly and reload. Kept working, not the primary tool.

- Top of page links to `/admin/camps/queue` and tells Jeff to use that instead.
- The reject form now carries a required reason-code `<select>` (same codes as the queue page, from `REJECT_REASON_CODES`) so a reject from this page still records a reason for source-quality stats. The browser blocks submit until a reason is picked.
- Approve stays a plain form POST, no reason code needed there.

## Deployment

- No new dependencies required
- No environment variables needed beyond existing D1 and R2 bindings
- No breaking changes to existing routes (`/admin/camps/index.astro`, `/admin/claims/index.astro`)
- Just deploy the new `src/pages/admin/camps/queue.astro` file

To test locally:
```bash
npm run dev
# Navigate to http://localhost:3000/admin/camps/queue
# Cloudflare Access will be mocked/skipped in dev; real email header check only applies to production/staging
```

## Future enhancements (not in scope)

- Bulk actions (select multiple, approve/reject all)
- Search/filter by camp name, submitter email, date range
- Export queue to CSV
- Undo button (requires soft deletes or a change log)
