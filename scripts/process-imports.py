"""
Process new ChatGPT/Midjourney image exports into brand-spec illustrations.

WORKFLOW
1. Save ChatGPT/MJ images into imports/images to be processed/.
   Filenames don't matter — keep whatever the model named them.
2. Edit imports/manifest.json: for each new image, add a mapping row with:
     match: a unique substring of the source filename (timestamp works)
     out:   the target illustration filename per IMAGE_NEEDS.md
     dims:  [width, height]
3. Run: python3 scripts/process-imports.py
4. Sources move to imports/processed/. Outputs land in public/illustrations/.

A --dry-run flag previews what would happen without touching files.
"""
import json
import sys
import argparse
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMPORTS = ROOT / 'imports' / 'images to be processed'
PROCESSED = ROOT / 'imports' / 'processed'
OUT_DIR = ROOT / 'public' / 'illustrations'
MANIFEST = ROOT / 'imports' / 'manifest.json'

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true', help='Show what would happen without touching files')
    args = ap.parse_args()

    if not MANIFEST.exists():
        print(f'FAIL: {MANIFEST} not found.', file=sys.stderr)
        return 1
    spec = json.loads(MANIFEST.read_text(encoding='utf-8'))
    mappings = [m for m in spec.get('mappings', []) if 'EXAMPLE' not in m.get('match', '')]
    if not mappings:
        print('No active mappings in imports/manifest.json. Add some and re-run.')
        return 0

    if not IMPORTS.exists():
        print(f'No {IMPORTS}/ directory. Nothing to process.')
        return 0

    PROCESSED.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    sources = list(IMPORTS.iterdir())
    if not sources:
        print(f'{IMPORTS}/ is empty. Nothing to process.')
        return 0

    print(f'\nFound {len(sources)} source files, {len(mappings)} mappings.\n')
    matched = []
    unmatched_sources = list(sources)
    unmatched_mappings = list(mappings)

    for m in mappings:
        match_str = m['match']
        out_name = m['out']
        tw, th = m['dims']
        cands = [f for f in sources if match_str in f.name]
        if not cands:
            continue
        src = cands[0]
        matched.append((src, out_name, tw, th))
        if src in unmatched_sources:
            unmatched_sources.remove(src)
        if m in unmatched_mappings:
            unmatched_mappings.remove(m)

    for src, out_name, tw, th in matched:
        out_path = OUT_DIR / out_name
        if args.dry_run:
            print(f'  WOULD process: {src.name}')
            print(f'                 -> {out_path} ({tw}x{th})')
            continue

        is_png = out_name.endswith('.png')
        img = Image.open(src).convert('RGBA' if is_png else 'RGB')
        iw, ih = img.size
        scale = max(tw / iw, th / ih)
        nw, nh = int(iw * scale), int(ih * scale)
        img = img.resize((nw, nh), Image.LANCZOS)
        left = (nw - tw) // 2
        top = (nh - th) // 2
        img = img.crop((left, top, left + tw, top + th))

        if is_png:
            img.save(out_path, 'PNG', optimize=True)
        else:
            img.save(out_path, 'WEBP', quality=88, method=6)

        # Move source to processed
        dest = PROCESSED / src.name
        try:
            src.rename(dest)
        except OSError:
            # cross-filesystem move
            import shutil
            shutil.move(str(src), str(dest))

        print(f'  OK: {src.name}')
        print(f'      -> {out_path.name} ({tw}x{th}, {out_path.stat().st_size:,} bytes)')

    if unmatched_sources:
        print(f'\nUnmatched source files (no mapping in manifest):')
        for f in unmatched_sources:
            print(f'  {f.name}')
        print(f'  -> Add an entry to imports/manifest.json and re-run.')

    if unmatched_mappings:
        print(f'\nUnmatched mappings (no source file containing the substring):')
        for m in unmatched_mappings:
            print(f'  match="{m["match"]}" -> {m["out"]}')

    return 0

if __name__ == '__main__':
    sys.exit(main())
