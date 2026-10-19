# Link health - 2026-10-19

**Agent:** Linda (Hal S5) Monday catch-up after DESKTOP offline
**Checked:** 65 oldest/never-checked slugs of 253
**OK:** 53
**Flagged (fetch-level):** 12 — Amazon interstitial flags need browser confirm before queue

## Summary
53 clean. 12 flagged at automated fetch. No replacement-queue upserts this run unless browser-confirmed (skill rule).

## Flags (pending browser confirm)
- `wrestling-shoes-youth`: redirect-to-search — final=https://www.amazon.com/s?k=youth+wrestling+shoes&tag=parentcoachpl-20
- `wrestling-singlet-youth`: redirect-to-search — final=https://www.amazon.com/s?k=youth+wrestling+singlet&tag=parentcoachpl-20
- `book-mindset`: fetch-error: HTTP Error 403: Forbidden — final=None
- `book-range`: fetch-error: HTTP Error 403: Forbidden — final=None
- `music-folder-performance`: redirect-to-search — final=https://www.amazon.com/s?k=black+performance+music+folder+band&tag=parentcoachpl-20
- `music-stand-foldable`: redirect-to-search — final=https://www.amazon.com/s?k=foldable+portable+music+stand+home+practice&tag=parentcoachpl-20
- `gymnastics-grips-youth`: redirect-to-search — final=https://www.amazon.com/s?k=gymnastics+bar+grips+youth&tag=parentcoachpl-20
- `swim-cap-silicone-youth`: redirect-to-search — final=https://www.amazon.com/s?k=silicone+swim+cap+youth+unisex&tag=parentcoachpl-20
- `swimsuit-training-youth`: redirect-to-search — final=https://www.amazon.com/s?k=youth+competitive+training+swimsuit+one+piece&tag=parentcoachpl-20
- `athletic-shorts-black-youth`: redirect-to-search — final=https://www.amazon.com/s?k=youth+black+athletic+shorts+unisex&tag=parentcoachpl-20
- `baseball-bat-teeball`: fetch-error: HTTP Error 400: Bad Request — final=None
- `softball-glove-11in`: fetch-error: HTTP Error 400: Bad Request — final=None

## Queue handoff
No browser-confirmed replace items this run → no `replacement-queue.json` changes.
