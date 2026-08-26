#!/usr/bin/env python3
"""Generate the sport landing-page heroes for /sports/<slug>/.

WHY THIS EXISTS. The 33 sport landing pages shipped with no imagery of any
kind — no hero, no thumbnails, nothing. Every other tier on the site has a
picture at the top. This writes the missing ones.

The output filename is `sport-<slug>.webp`, which is deliberately NOT the same
as the buying guide's `guide-<slug>-gear.webp`. A sport page that falls back to
the guide's flat-lay ends up showing the same image twice on one screen, once
in the hero and once in the gear card, so the two need to stay distinct assets.

Everything here follows PHOTO_STANDARD.md: 1536x1024 (3:2), WebP q82, subject
in the horizontal middle band, no people, no logos, no text. Scenes are
deliberately unpopulated — section 2 of the standard says an empty scene is
often the strongest option, and it sidesteps the identifiable-child rule
completely rather than relying on the model to honor a negative instruction.

Usage (PowerShell, from the repo root):

    python scripts/build-sport-heroes.py --proof
    python scripts/build-sport-heroes.py soccer basketball
    python scripts/build-sport-heroes.py --all
    python scripts/build-sport-heroes.py --proof --force   # overwrite existing

Requires the key in the environment. It is never read from a file:

    setx OPENAI_API_KEY "sk-..."     # then reopen the terminal

Requires:  pip install openai Pillow
"""

from __future__ import annotations

import base64
import io
import os
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ILLUSTRATIONS = ROOT / "public" / "illustrations"

SIZE = "1536x1024"
QUALITY = 82
SIZE_CEILING = 300 * 1024   # PHOTO_STANDARD section 6, hard ceiling
SIZE_TARGET = 200 * 1024

# PHOTO_STANDARD section 8. Appended verbatim to every prompt.
# "photograph" is avoided in the subject lines because OpenAI's policy filter
# rejects it; the scaffold carries the photographic direction instead.
SCAFFOLD = (
    "Photo-realistic documentary still, natural available light, shallow depth "
    "of field, warm and slightly desaturated color, fine film grain. Candid and "
    "observed, never posed. No people in frame. No readable logos, brand names, "
    "sponsor signage, or team names on any equipment or clothing. No text, "
    "lettering, or numerals anywhere in the image. No stock-photo gloss, no "
    "motion blur, no trophy celebrations. 3:2 landscape composition with the "
    "subject in the horizontal middle band."
)

# The six revenue sports, generated first so the look can be judged before the
# remaining 27 are committed to.
PROOF = ["soccer", "basketball", "baseball", "softball", "football", "volleyball"]

SCENES: dict[str, str] = {
    "soccer": (
        "A pair of well-worn molded cleats and rolled-up shin guards resting on "
        "the touchline of a grass field at dusk, a scuffed ball just behind them, "
        "empty folding camp chairs far out of focus in the distance."
    ),
    "basketball": (
        "An empty school gymnasium in late afternoon, low sun raking through high "
        "windows across the floor, a ball sitting alone at the free-throw line, "
        "bleachers folded flat against the far wall."
    ),
    "baseball": (
        "A dugout bench at golden hour holding a broken-in glove, a batting helmet "
        "turned on its side, and a half-full water bottle, chain-link fence and "
        "infield dirt soft behind them."
    ),
    # First pass put the bat and glove in the right quarter of the frame, which
    # fails section 5: a 3:1 center crop on mobile cut the actual subject and
    # left nothing but dirt. Rewritten to pin the gear to the middle band.
    "softball": (
        "A bat and an open glove lying together in the dirt at the center of a "
        "freshly chalked infield in early evening light, chalk lines and the "
        "on-deck circle curving away to either side of them."
    ),
    "football": (
        "Shoulder pads and a plain helmet set down on trampled grass beside a "
        "water cooler at the end of practice, faded yard markings receding into "
        "shallow focus."
    ),
    "volleyball": (
        "An indoor court after practice has cleared, a ball and a folded pair of "
        "knee pads on the polished floor near the net post, warm low gym lighting."
    ),
    "hockey": (
        "A worn pair of skates and a stick leaning against the boards of an empty "
        "rink, scarred ice catching cold overhead light."
    ),
    "lacrosse-boys": (
        "A lacrosse stick and plain helmet resting on a bench beside a mesh ball "
        "bag at the edge of a grass field in late light."
    ),
    "lacrosse-girls": (
        "Goggles, a stick, and a mouthguard case set on a wooden bench at the edge "
        "of a field, long evening shadows across the grass."
    ),
    "swimming": (
        "A folded towel, goggles, and a swim cap on wet tile at the edge of an "
        "indoor pool, still water and lane lines stretching out of focus."
    ),
    "track-field": (
        "Spikes with the laces still tied resting in lane two of a weathered "
        "outdoor track, early morning light low across the surface."
    ),
    "cross-country": (
        "Muddy trainers and a folded race bib on the tailgate of a car at the edge "
        "of a wooded course, fog still sitting in the trees."
    ),
    "tennis": (
        "A racquet and a canister of balls leaning against the net post of an empty "
        "hard court in early evening, long shadows across the service boxes."
    ),
    "golf": (
        "A small stand bag with a few irons resting on the fringe of a practice "
        "green at first light, dew still on the grass."
    ),
    "crew": (
        "Oars stacked on a rack beside a boathouse dock at dawn, flat water and "
        "mist beyond them."
    ),
    "martial-arts": (
        "A folded uniform and a worn cloth belt set on the edge of a mat in an "
        "empty studio, warm light from a side window."
    ),
    "gymnastics": (
        "Grips, a chalk bowl, and a folded warmup on the edge of a spring floor in "
        "an empty gym, soft overhead light."
    ),
    "cheer": (
        "Practice shoes and a rolled mat at the edge of an empty gym floor, bows "
        "and a water bottle on the bench behind them."
    ),
    "stunt": (
        "A stack of practice mats and taped wrists' worth of gear on a bench in an "
        "empty training gym, late afternoon light."
    ),
    "theater": (
        "A script with pencil marks and a pair of soft-soled shoes on the lip of an "
        "empty stage, work light glowing from the wings."
    ),
    "band": (
        "An instrument case open on a folding chair in an empty rehearsal room, "
        "music stands scattered and late light through the blinds."
    ),
    "choir": (
        "Folded black folders stacked on a riser in an empty rehearsal room, warm "
        "afternoon light across the floor."
    ),
    "dance": (
        "Worn shoes and a rolled towel on the edge of a studio floor, barre and "
        "mirrors soft in the background."
    ),
    "ballet": (
        "A pair of broken-in pointe shoes with ribbons loose on the floor beside a "
        "barre, morning light through tall studio windows."
    ),
    "wrestling": (
        "Headgear and worn shoes set on the edge of a rolled mat in an empty "
        "practice room, low overhead light."
    ),
    "flag-football": (
        "A belt of flags and a ball resting on trampled grass beside a cone, field "
        "stretching out of focus in evening light."
    ),
    "football-7v7": (
        "A ball, a set of cones, and a water jug on a practice field at dusk, "
        "markings fading into shallow focus."
    ),
    "rugby": (
        "A scuffed ball and a scrum cap on wet grass beside a touchline flag, grey "
        "even light."
    ),
    "field-hockey": (
        "A stick and shin guards resting on the edge of a turf field, low sun "
        "across the surface."
    ),
    "climbing": (
        "A chalk bag, shoes, and a coiled rope on a bouldering mat in an empty "
        "gym, warm side light."
    ),
    "skateboarding": (
        "A well-used board resting deck-down on the lip of an empty concrete bowl "
        "at golden hour."
    ),
    "outdoor": (
        "A daypack, a water bottle, and worn boots on a trailhead log in early "
        "morning light, forest soft behind."
    ),
    "multi-sport": (
        "A mudroom bench stacked with gear from three different sports, cleats and "
        "a ball and a folded uniform, morning light through a side door."
    ),
    "stem": (
        "A partly built robot kit, a notebook, and scattered components on a "
        "classroom table, late afternoon light."
    ),
}


def write_webp(png_bytes: bytes, dest: Path) -> int:
    """Encode to WebP, stepping quality down if the file blows the ceiling."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(io.BytesIO(png_bytes)) as im:
        im = im.convert("RGB")
        for q in (QUALITY, 76, 70, 64):
            buf = io.BytesIO()
            im.save(buf, "WEBP", quality=q, method=6)
            data = buf.getvalue()
            if len(data) <= SIZE_CEILING:
                dest.write_bytes(data)
                if len(data) > SIZE_TARGET:
                    print(f"    note: {len(data)//1024}KB at q{q}, over the 200KB target")
                return len(data)
        dest.write_bytes(data)
        print(f"    WARNING: {len(data)//1024}KB still over the 300KB ceiling")
        return len(data)


def main(argv: list[str]) -> int:
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        print(
            "OPENAI_API_KEY is not set in this shell.\n"
            '  setx OPENAI_API_KEY "sk-..."   then close and reopen the terminal.\n'
            "Never paste the key into a file, a prompt, or this script.",
            file=sys.stderr,
        )
        return 2

    force = "--force" in argv
    if "--proof" in argv:
        slugs = list(PROOF)
    elif "--all" in argv:
        slugs = list(SCENES)
    else:
        slugs = [a for a in argv if not a.startswith("--")]

    if not slugs:
        print(__doc__)
        return 2

    unknown = [s for s in slugs if s not in SCENES]
    if unknown:
        print(f"No scene written for: {', '.join(unknown)}", file=sys.stderr)
        print("Add one to SCENES rather than letting the model invent it.", file=sys.stderr)
        return 2

    import openai
    client = openai.OpenAI(api_key=key)

    written: list[Path] = []
    failed: list[str] = []

    for slug in slugs:
        dest = ILLUSTRATIONS / f"sport-{slug}.webp"
        if dest.exists() and not force:
            print(f"skip  {dest.name} (exists; --force to replace)")
            continue

        print(f"gen   {slug} ...", flush=True)
        prompt = f"{SCENES[slug]} {SCAFFOLD}"
        try:
            resp = client.images.generate(
                model="gpt-image-1", prompt=prompt, size=SIZE, n=1
            )
            png = base64.b64decode(resp.data[0].b64_json)
            size = write_webp(png, dest)
            if not dest.exists() or dest.stat().st_size == 0:
                raise RuntimeError("wrote a zero-byte file")
            print(f"  ok  {dest.relative_to(ROOT)}  {size//1024}KB")
            written.append(dest)
        except Exception as exc:                        # noqa: BLE001
            print(f"  FAIL {slug}: {exc}", file=sys.stderr)
            failed.append(slug)

    if written:
        print("\nbuilding 480/960 variants ...")
        subprocess.run(
            [sys.executable, str(ROOT / "scripts" / "build-illustration-variants.py"),
             *[p.name for p in written]],
            cwd=ROOT, check=False,
        )

    print(f"\n{len(written)} written, {len(failed)} failed")
    if failed:
        print("failed: " + ", ".join(failed))
        print("Nothing was committed. Re-run the failures before reporting success.")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
