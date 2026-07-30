#!/usr/bin/env python3
"""Generate 480w and 960w variants for public/illustrations/*.webp.

Every illustration is authored at 1536w. Phones do not need 1536w. Before this
script existed the homepage shipped the full-size hero (134KB) to a 375px
viewport; the 480w variant is 22KB for the same visible result.

The variants are committed to the repo on purpose. This site builds through the
Cloudflare adapter with no image service configured, so there is nothing at
build time that would resize them, and adding one is a bigger change than the
problem warrants.

Usage:
    python scripts/build-illustration-variants.py              # only new/stale
    python scripts/build-illustration-variants.py --all        # rebuild all
    python scripts/build-illustration-variants.py a.webp b.webp

Requires Pillow:  pip install Pillow
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

WIDTHS = (480, 960)
QUALITY = 78
ILLUSTRATIONS = Path(__file__).resolve().parent.parent / "public" / "illustrations"

# A variant is itself a .webp in the same folder, so it has to be excluded from
# the source list or the script would generate variants of variants.
VARIANT_SUFFIXES = tuple(f"-{w}" for w in WIDTHS)


def is_variant(path: Path) -> bool:
    return path.stem.endswith(VARIANT_SUFFIXES)


def build(source: Path, force: bool = False) -> list[str]:
    written: list[str] = []
    with Image.open(source) as im:
        im = im.convert("RGB")
        for width in WIDTHS:
            if im.width <= width:
                continue
            out = source.with_name(f"{source.stem}-{width}.webp")
            if out.exists() and not force and out.stat().st_mtime >= source.stat().st_mtime:
                continue
            height = round(im.height * width / im.width)
            im.resize((width, height), Image.LANCZOS).save(
                out, "WEBP", quality=QUALITY, method=6
            )
            written.append(out.name)
    return written


def main(argv: list[str]) -> int:
    force = "--all" in argv
    named = [a for a in argv if not a.startswith("--")]

    if named:
        sources = [ILLUSTRATIONS / n for n in named]
        missing = [s for s in sources if not s.exists()]
        if missing:
            for m in missing:
                print(f"not found: {m.name}", file=sys.stderr)
            return 1
    else:
        sources = sorted(p for p in ILLUSTRATIONS.glob("*.webp") if not is_variant(p))

    total = 0
    for source in sources:
        for name in build(source, force=force):
            print(f"wrote {name}")
            total += 1

    print(f"{total} variant(s) written from {len(sources)} source image(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
