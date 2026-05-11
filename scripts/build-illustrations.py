"""
Generate hero illustrations from IMAGE_NEEDS.md using OpenAI DALL-E 3.

Reads IMAGE_NEEDS.md, parses every table row of the form:
    | filename.webp | description |
appends the brand-style block, calls DALL-E 3, downloads the PNG,
resizes to the right dimensions per image type, saves as .webp into
public/illustrations/.

USAGE
    # Estimate cost without spending anything
    python3 scripts/build-illustrations.py --dry-run

    # Generate everything (most expensive: ~$6.64 for 83 images)
    python3 scripts/build-illustrations.py

    # Generate one batch only (e.g. just pillar landings)
    python3 scripts/build-illustrations.py --filter pillar-

    # Force-regenerate even if the .webp already exists
    python3 scripts/build-illustrations.py --force

    # Preview the prompts without calling the API
    python3 scripts/build-illustrations.py --print-prompts

ENV
    OPENAI_API_KEY  required. Set in .env or export OPENAI_API_KEY=...

DEPENDENCIES
    pip install openai pillow requests python-dotenv

OUTPUT
    public/illustrations/{filename}.webp
    A run summary printed to stdout with cost + success/failure list.

NOTES
    DALL-E 3 only outputs 1024x1024, 1024x1792 (portrait), or 1792x1024
    (landscape). We always request 1792x1024, then crop/resize to the
    correct ratio per image type:
        hero        1600x1000 (8:5)   — sport landings, pillar pages, articles
        og-card     1200x630  (1.91)  — share images
        divider     1400x400  (3.5:1) — section separators
    Anything else falls back to 1600x1000.
"""
import os
import re
import sys
import json
import time
import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SPEC = ROOT / 'IMAGE_NEEDS.md'
OUT_DIR = ROOT / 'public' / 'illustrations'
OUT_DIR.mkdir(parents=True, exist_ok=True)

# ---- Brand block: pasted on every prompt for consistency ----
BRAND_PREFIX = """Editorial illustration in the style of warm, painterly American magazine art (Emily Forgot, Sara Andreasson, Kate Pugsley). Soft, slightly textured, calm composition. Cream paper background (#FAF6EE) and warm paper (#F2EAD9). Accents in terracotta (#C5713D), honey (#D4AB6A), sage green (#8FA68C), dark ink (#2D2520). Quiet domestic moments and sideline scenes — never action shots, never stock-photo gloss, never branded equipment, never visible logos. Faces obscured, backlit, or out of frame. Natural light, depth, slight grain. Editorial quality, not cartoonish. Subject:"""

# ---- DALL-E 3 cost per image (May 2026 pricing) ----
COST_STANDARD_LANDSCAPE = 0.080  # 1792x1024 standard quality
COST_STANDARD_SQUARE    = 0.040  # 1024x1024 standard quality

def parse_spec(spec_path: Path):
    """Walk IMAGE_NEEDS.md and extract (section_title, filename, description)
    from every table row whose first column looks like a filename.

    Skips rows where filename is '—' (placeholder for 'reuse from §X')."""
    text = spec_path.read_text(encoding='utf-8')
    # Strip the layout frontmatter if present
    text = re.sub(r'^---\s*\n.*?\n---\s*\n', '', text, count=1, flags=re.DOTALL)

    rows = []
    current_section = 'unknown'
    for line in text.splitlines():
        h = re.match(r'^##\s+(.+)$', line)
        if h:
            current_section = h.group(1).strip()
            continue
        # Match table rows: | something | `filename.ext` | description |
        # Filename is in backticks in column 2 (after location)
        m = re.match(r'^\|\s*([^|]+?)\s*\|\s*`([a-z0-9\-]+\.(?:webp|png|jpg))`\s*\|\s*(.+?)\s*\|', line)
        if m:
            location, fname, desc = m.group(1).strip(), m.group(2).strip(), m.group(3).strip()
            if fname.startswith('—') or 'existing' in desc.lower() and len(desc) < 50:
                continue  # placeholder rows
            rows.append({
                'section': current_section,
                'location': location,
                'filename': fname,
                'description': desc,
            })
    return rows

def target_dims(filename: str):
    """Return (width, height) for the final saved image based on filename hints."""
    if 'og-' in filename or filename.startswith('og'):
        return (1200, 630)
    if 'divider' in filename:
        return (1400, 400)
    if 'apple-touch' in filename:
        return (180, 180)
    return (1600, 1000)  # default hero

def main():
    ap = argparse.ArgumentParser(description='Generate hero illustrations from IMAGE_NEEDS.md')
    ap.add_argument('--dry-run', action='store_true', help='Estimate cost without calling the API')
    ap.add_argument('--print-prompts', action='store_true', help='Print prompts to stdout instead of calling the API')
    ap.add_argument('--filter', type=str, default=None, help='Only generate filenames containing this substring')
    ap.add_argument('--force', action='store_true', help='Regenerate even if the .webp already exists')
    ap.add_argument('--quality', choices=['standard', 'hd'], default='standard',
                    help='DALL-E 3 quality (hd is 2x cost)')
    ap.add_argument('--limit', type=int, default=None, help='Stop after N images (useful for test runs)')
    args = ap.parse_args()

    rows = parse_spec(SPEC)
    if args.filter:
        rows = [r for r in rows if args.filter in r['filename']]
    if args.limit:
        rows = rows[:args.limit]

    # Skip what already exists unless --force
    pending = []
    skipped = []
    for r in rows:
        webp_path = OUT_DIR / r['filename']
        # Even if filename ends in .png/.jpg, we always save as .webp
        webp_path = webp_path.with_suffix('.webp')
        if webp_path.exists() and not args.force:
            skipped.append(r['filename'])
        else:
            pending.append(r)

    cost_per = COST_STANDARD_LANDSCAPE * (2 if args.quality == 'hd' else 1)
    total_cost = len(pending) * cost_per
    print(f'\n=== Image Generation Plan ===')
    print(f'  Spec parsed:    {len(rows)} rows')
    if args.filter: print(f'  Filter:         "{args.filter}"')
    print(f'  Already exist:  {len(skipped)}{" (use --force to regenerate)" if skipped else ""}')
    print(f'  To generate:    {len(pending)}')
    print(f'  Quality:        {args.quality}')
    print(f'  Est. cost:      ${total_cost:.2f} ({len(pending)} × ${cost_per:.3f})')
    print()

    if args.dry_run:
        print('Dry run — no API calls made.')
        for r in pending[:10]:
            print(f'  would generate: {r["filename"]} — {r["description"][:80]}')
        if len(pending) > 10:
            print(f'  ... and {len(pending) - 10} more')
        return 0

    if args.print_prompts:
        for r in pending:
            print(f'\n--- {r["filename"]} ---')
            print(f'{BRAND_PREFIX} {r["description"]}')
        return 0

    if not pending:
        print('Nothing to generate. Done.')
        return 0

    # Real generation path — needs deps + API key
    try:
        from openai import OpenAI
    except ImportError:
        print('FAIL: pip install openai pillow requests python-dotenv', file=sys.stderr)
        return 1

    try:
        from dotenv import load_dotenv
        load_dotenv(ROOT / '.env')
    except ImportError:
        pass

    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        print('FAIL: OPENAI_API_KEY not set. Add to .env or export OPENAI_API_KEY=sk-...', file=sys.stderr)
        return 1

    from PIL import Image
    import requests
    from io import BytesIO

    client = OpenAI(api_key=api_key)

    written = []
    failed = []
    actual_cost = 0.0

    for i, r in enumerate(pending, 1):
        webp_path = (OUT_DIR / r['filename']).with_suffix('.webp')
        prompt = f'{BRAND_PREFIX} {r["description"]}'
        print(f'\n[{i}/{len(pending)}] {r["filename"]}')
        print(f'  prompt: {r["description"][:80]}...')
        try:
            resp = client.images.generate(
                model='dall-e-3',
                prompt=prompt,
                n=1,
                size='1792x1024',  # only landscape DALL-E supports for our needs
                quality=args.quality,
                response_format='url',
            )
            url = resp.data[0].url
            img_bytes = requests.get(url, timeout=60).content
            img = Image.open(BytesIO(img_bytes)).convert('RGB')

            tw, th = target_dims(r['filename'])
            # Resize keeping aspect, then center-crop to target
            iw, ih = img.size
            scale = max(tw / iw, th / ih)
            nw, nh = int(iw * scale), int(ih * scale)
            img = img.resize((nw, nh), Image.LANCZOS)
            left = (nw - tw) // 2
            top  = (nh - th) // 2
            img = img.crop((left, top, left + tw, top + th))
            img.save(webp_path, 'WEBP', quality=88, method=6)
            actual_cost += cost_per
            written.append(r['filename'])
            print(f'  -> saved {webp_path.name} ({tw}x{th}) — running total ${actual_cost:.2f}')
            time.sleep(2)  # be polite to the API
        except Exception as e:
            failed.append((r['filename'], str(e)))
            print(f'  -> FAIL: {e}')
            continue

    print(f'\n=== DONE ===')
    print(f'  Generated:  {len(written)}')
    print(f'  Failed:     {len(failed)}')
    print(f'  Total cost: ${actual_cost:.2f}')
    if failed:
        print('\nFailures:')
        for fn, err in failed:
            print(f'  {fn}: {err[:120]}')
    return 0

if __name__ == '__main__':
    sys.exit(main())
