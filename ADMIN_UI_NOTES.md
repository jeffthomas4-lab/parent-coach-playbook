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

Three action buttons:
- **Approve & verified**: POSTs to `/api/admin/camps/{id}/approve` AND `/api/admin/camps/{id}/verify` (sets both status=approved and verified=1)
- **Approve**: POSTs to `/api/admin/camps/{id}/approve` (status=approved only)
- **Reject**: POSTs to `/api/admin/camps/{id}/reject`

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

Three action buttons:
- **Mark verified**: POSTs to `/api/admin/claims/{id}/update` with status='verified'
- **Mark paid**: POSTs to `/api/admin/claims/{id}/update` with status='paid' (also activates camp's claimed flag and sets paid-until date)
- **Reject**: POSTs to `/api/admin/claims/{id}/update` with status='rejected'

Same removal + status message pattern.

## Implementation details

### Server-side (Astro frontmatter)

- Fetches all three queues using `listPendingCamps`, `listPendingReviews`, `listPendingClaims` from `src/lib/camps-db.ts`
- Builds a camp lookup map to hydrate camp names for reviews and claims
- Passes admin email to the template via `getAdminEmailFromRequest(Astro.request)` for display

### Client-side (vanilla JS, `<script is:inline>`)

Plain ES5 JavaScript in DOMContentLoaded event. No TypeScript syntax.

Rows are identified by `data-id` attribute. Each row has action buttons with `data-action` attribute:

- `approve`, `approve-verified`, `reject` for camps
- `approve`, `reject` for reviews
- `mark-verified`, `mark-paid`, `reject` for claims

On button click:
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
- Inline edit save (currently fields are read-only for display; edit happens in the detail page)
- Search/filter by camp name, submitter email, date range
- Export queue to CSV
- Undo button (requires soft deletes or a change log)
