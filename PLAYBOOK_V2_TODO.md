# Drive-Home Playbook v2 — regeneration note

The current PDF at `public/the-drive-home-playbook.pdf` is stale.

## Issues to fix in v2

1. **Page count mismatch.** The cover and front matter both say "12 PAGES" but the actual PDF is 10 pages. Either (a) regenerate to 12 pages by adding two pages of content, or (b) update the cover, intro paragraph, and footer copy on the site to read "10 PAGES" everywhere.

2. **Pocket card uses old "Three drives" tagline.** The pocket-card insert (page 9 in current PDF) references the old framing. Update to match the current Three Drives language used everywhere else on the site:
   - Drive 1 — Connection
   - Drive 2 — Confidence
   - Drive 3 — Composure

3. **Sources page.** Add a final-page sources list referencing the current Project Play and AAP citations rather than the older sources used in v1. Use the same URLs that the new dead-link checker tracks.

4. **Affiliate notice.** Add the standard "As an Amazon Associate we earn from qualifying purchases." footer to the resources/gear pages of the PDF if any are referenced.

## Where it's referenced on the site

Run `grep -r "the-drive-home-playbook" src/` before regenerating to find every link that mentions page count or contents — those copy strings need to match the new PDF.

## When to regenerate

Low priority — the existing PDF still works. Bundle this with the next playbook content refresh rather than as a one-off task.
