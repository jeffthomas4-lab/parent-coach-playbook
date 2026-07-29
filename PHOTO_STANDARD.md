# Photo Standard — Parent Coach Desk

**Status: authoritative as of 2026-07-28.** This file supersedes the style
sections of `IMAGE_NEEDS.md` and `ILLUSTRATION_PROMPTS.md`, both of which
describe an editorial-illustration direction that was never shipped. The 77
assets already in `public/illustrations/` are photographs, not illustrations.
Those two files are kept only for their page-by-page inventory of *where*
images are needed, not for *how* they should look.

---

## 1. The look

Photorealistic documentary photography. Natural available light. Shallow
depth of field. The register is a moment observed, not a moment performed —
the viewer should feel like they walked in on something ordinary and true.

Warm, slightly desaturated color. Late afternoon and early evening light
wherever the scene allows. Grain is acceptable. Perfection is not the goal.

**Never:** stock-photo gloss, staged smiles, anyone looking at the camera,
motion-blur action heroics, trophy-and-confetti moments, ring-light lighting,
HDR, or anything that reads as advertising.

## 2. Children — the hard rule

This site publishes AI-generated imagery on a parenting property. Kids appear
constantly. The rule is strict and it is not negotiable per-image:

**No clearly identifiable child face.** Achieve this with composition, not
blurring:

- shot from behind or over the shoulder
- profile or three-quarter turned away
- backlit into silhouette
- cropped at the shoulders, hands, or feet
- far enough away that features do not resolve
- face fallen out of focus behind foreground gear

Adults may be identifiable. Adults should still rarely face the camera.

A scene with no people in it at all — gear on a bench, an empty gym, a
kitchen table at 6am — is often the strongest option. Reach for it.

## 3. Brands and marks

**No readable logos, wordmarks, sponsor signage, or team names.** No CCM, no
Bauer, no Nike swoosh, no league banners. Equipment is generic. Jerseys carry
plain numbers or none. Scoreboards are blank or illegible.

This is both an IP rule and a longevity rule — an unbranded photo does not
date or imply an endorsement that was never bought.

## 4. No text in the image

The layout supplies the headline. Generated images containing lettering get
rejected and regenerated. This includes signage, scoreboards with numbers,
and clipboard writing.

## 5. Composition

- **3:2 landscape**, generated at 1536×1024, matching the 40 existing assets.
- Keep the emotional subject off-center; leave breathing room.
- The hero renders at up to 480px tall on desktop and is cropped to roughly
  220px on mobile. **Keep the subject in the horizontal middle band** so the
  mobile crop does not decapitate it.

## 6. File spec

- Format: WebP, quality 82
- Path: `public/illustrations/<slug>.webp`
- Target under 200KB; hard ceiling 300KB
- Filename is lowercase kebab-case and describes the scene, not the article,
  because library images are reused across many articles

## 7. Alt text

`heroAlt` is schema-required whenever `hero` is set (15–280 chars). Describe
what is literally in the frame for a reader who cannot see it. Do not restate
the headline and do not editorialize.

Good: `A child's cleats and shin guards sitting by the back door in early
morning light.`

Bad: `An image representing the challenges of youth soccer parenting.`

## 8. The prompt scaffold

Every generation appends this block:

> Photorealistic documentary photograph, natural available light, shallow
> depth of field, warm and slightly desaturated color, fine film grain.
> Candid and observed, never posed. No one looks at the camera. No child's
> face is identifiable — faces are turned away, in profile, backlit, cropped
> out of frame, or out of focus. No readable logos, brand names, sponsor
> signage, or team names on any equipment or clothing. No text, lettering,
> or numerals anywhere in the image. No stock-photo gloss, no staged smiles,
> no motion blur, no trophy celebrations. 3:2 landscape composition with the
> subject in the horizontal middle band.

## 9. Review gate

Before an image ships, check it against five questions:

1. Can I identify a child's face?
2. Can I read any logo, brand, or word?
3. Does anyone look at the camera or smile on cue?
4. Would the subject survive a center crop to 3:1?
5. Does it look like an ad?

Any yes on 1, 2, 3, or 5 means regenerate. A no on 4 means recompose.
