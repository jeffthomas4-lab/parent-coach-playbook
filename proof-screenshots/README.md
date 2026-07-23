# Proof screenshots

Drop screenshots here. A review comment, a DM, a text, a Google review, anything
that shows real feedback about Parent Coach Desk.

A scheduled intake reads new images in this folder, uses OCR to pull the text
out, and structures each one into a candidate in `src/data/proof-inbox.json`
with `capturedVia: "screenshot"` and `status: "new"`. From there it goes
through the normal review: `node scripts/proof.mjs list --status new`,
`approve`, then `promote`.

The intake never invents a field it cannot read. If a screenshot does not
clearly show a name, a source, or the exact quote, that field stays blank
in the candidate and someone fills it in by hand before approving. No guessed
names, no cleaned-up quotes, no invented sources.

Raw screenshots are not committed to the repo (see `.gitignore`). This folder
and this README stay tracked so the pattern is documented, but the images
themselves are local only.

Once a screenshot has been processed into a candidate, it is safe to delete
from this folder.
