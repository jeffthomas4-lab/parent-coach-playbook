"""
Per-article Open Graph image generator.

For every published article in src/content/articles/, render a 1200x630
JPG into public/og/{slug}.jpg. The article layout points at this URL
when the file exists; if a slug has no image, social previews fall
back to /og-default.jpg.

Run after publishing new articles:
    python3 scripts/build-og-images.py

Or via the npm wrapper:
    npm run build:og

Idempotent — skips slugs whose JPG is newer than the source markdown
unless --force is passed.

Design intent: visually consistent with the brand (cream paper, italic
Fraunces, terracotta accent), but each card carries the article title
so social previews aren't all interchangeable.
"""

import os, sys, glob, re, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ARTICLES_DIR = ROOT / 'src' / 'content' / 'articles'
OUT_DIR = ROOT / 'public' / 'og'
OUT_DIR.mkdir(parents=True, exist_ok=True)

FORCE = '--force' in sys.argv

# --- Brand tokens (matched to tailwind config) ---
PAPER       = (250, 246, 238)
PAPER_WARM  = (242, 234, 217)
INK         = (45,  37,  32)
INK_SOFT    = (95,  84,  72)
TERRACOTTA  = (197, 113, 61)
HONEY       = (212, 171, 106)
SAGE        = (143, 166, 140)
LINEN       = (221, 210, 189)
BONE        = (231, 222, 203)

W, H = 1200, 630

# --- Fonts: convert woff2 from @fontsource/fraunces to ttf on demand ---
FRAUNCES_DIR = ROOT / 'node_modules' / '@fontsource' / 'fraunces' / 'files'
JBM_DIR      = ROOT / 'node_modules' / '@fontsource' / 'jetbrains-mono' / 'files'
FONT_CACHE   = Path(tempfile.gettempdir()) / 'pcp-og-fonts'
FONT_CACHE.mkdir(exist_ok=True)


def woff2_to_ttf(woff2_path: Path, ttf_path: Path):
    if ttf_path.exists():
        return ttf_path
    from fontTools.ttLib import TTFont
    f = TTFont(str(woff2_path))
    f.flavor = None
    f.save(str(ttf_path))
    return ttf_path


def load_font(family: str, weight: int, italic: bool):
    style = 'italic' if italic else 'normal'
    woff2 = FRAUNCES_DIR / f'fraunces-latin-{weight}-{style}.woff2'
    if family == 'mono':
        woff2 = JBM_DIR / f'jetbrains-mono-latin-{weight}-{style}.woff2'
    ttf = FONT_CACHE / f'{family}-{weight}-{style}.ttf'
    return woff2_to_ttf(woff2, ttf)


F_ITALIC_500   = load_font('fraunces', 500, italic=True)
F_ITALIC_400   = load_font('fraunces', 400, italic=True)
F_REGULAR_500  = load_font('fraunces', 500, italic=False)
F_REGULAR_700  = load_font('fraunces', 700, italic=False)


def parse_frontmatter(md_path: Path):
    """Pull title / dek / phase / sport from a Markdown frontmatter block."""
    text = md_path.read_text(encoding='utf-8', errors='ignore')
    m = re.match(r'^---\s*\n(.*?)\n---\s*\n', text, re.DOTALL)
    if not m:
        return None
    fm = m.group(1)
    out = {}
    for line in fm.splitlines():
        if not line or line.startswith(' '):
            continue
        if ':' not in line:
            continue
        k, v = line.split(':', 1)
        out[k.strip()] = v.strip().strip('"').strip("'")
    return out


def wrap_text(text: str, font: ImageFont.FreeTypeFont, max_width: int):
    """Greedy word wrap. Returns a list of lines."""
    words = text.split()
    lines, line = [], ''
    dummy = Image.new('RGB', (10, 10))
    d = ImageDraw.Draw(dummy)
    for w in words:
        candidate = (line + ' ' + w).strip()
        b = d.textbbox((0, 0), candidate, font=font)
        if (b[2] - b[0]) > max_width and line:
            lines.append(line)
            line = w
        else:
            line = candidate
    if line:
        lines.append(line)
    return lines


# Map phase slug → (eyebrow label, accent color)
PHASE_META = {
    'drive-there': ('Before the game',   TERRACOTTA),
    'game':        ('In the game',       SAGE),
    'drive-home':  ('After the game',    HONEY),
    'parent-coach':('For the parent-coach', TERRACOTTA),
    'team-parent': ('Team parent',       SAGE),
}


def render_card(title: str, eyebrow: str, accent, out_path: Path):
    img = Image.new('RGB', (W, H), PAPER)
    draw = ImageDraw.Draw(img)

    PAD_X = 80
    PAD_Y = 70

    # Top hairline
    draw.line([(PAD_X, PAD_Y), (W - PAD_X, PAD_Y)], fill=INK, width=2)

    # Top-left site mark (uppercase)
    site_font = ImageFont.truetype(str(F_REGULAR_500), 18)
    draw.text((PAD_X, PAD_Y + 18), 'PARENTCOACHPLAYBOOK.COM', font=site_font, fill=INK)

    # Top-right eyebrow (the article phase)
    eyebrow_text = eyebrow.upper()
    eb_font = ImageFont.truetype(str(F_REGULAR_500), 18)
    bb = draw.textbbox((0, 0), eyebrow_text, font=eb_font)
    ebw = bb[2] - bb[0]
    draw.text((W - PAD_X - ebw, PAD_Y + 18), eyebrow_text, font=eb_font, fill=accent)

    # Strip out the markdown emphasis markers from the title before render
    clean_title = title.replace('*', '').strip()

    # Pick a title size that lets us fit in 4 lines max
    max_w = W - 2 * PAD_X
    for size in (88, 80, 72, 64, 56, 50):
        t_font = ImageFont.truetype(str(F_REGULAR_700), size)
        lines = wrap_text(clean_title, t_font, max_w)
        if len(lines) <= 4:
            break

    # Vertically center the title block
    line_height = int(size * 1.05)
    block_h = line_height * len(lines)
    y0 = (H - block_h) // 2 - 20
    for i, ln in enumerate(lines):
        draw.text((PAD_X, y0 + i * line_height), ln, font=t_font, fill=INK)

    # Three accent dots above the bottom rule
    dots_y = H - PAD_Y - 36
    dot_r = 8
    dot_gap = 28
    for i, c in enumerate([SAGE, accent, HONEY]):
        x = PAD_X + i * dot_gap
        draw.ellipse([(x, dots_y - dot_r), (x + 2 * dot_r, dots_y + dot_r)], fill=c)

    # Caption beside the dots
    cap_font = ImageFont.truetype(str(F_ITALIC_400), 22)
    draw.text((PAD_X + 3 * dot_gap + 14, dots_y - 14),
              'Sideline notes for parents in the middle of it.',
              font=cap_font, fill=INK_SOFT)

    # Bottom hairline
    draw.line([(PAD_X, H - PAD_Y), (W - PAD_X, H - PAD_Y)], fill=LINEN, width=1)

    img.save(str(out_path), 'JPEG', quality=88, optimize=True, progressive=True)


def main():
    md_files = sorted(ARTICLES_DIR.glob('*.md'))
    written = skipped = errors = 0
    for md in md_files:
        slug = md.stem
        out_path = OUT_DIR / f'{slug}.jpg'

        if not FORCE and out_path.exists() and out_path.stat().st_mtime >= md.stat().st_mtime:
            skipped += 1
            continue

        fm = parse_frontmatter(md)
        if not fm or 'title' not in fm:
            errors += 1
            print(f'  skip (no title): {md.name}')
            continue

        title = fm.get('title', md.stem)
        phase = fm.get('phase', 'drive-there')
        eyebrow, accent = PHASE_META.get(phase, ('Parent Coach Playbook', TERRACOTTA))
        try:
            render_card(title=title, eyebrow=eyebrow, accent=accent, out_path=out_path)
            written += 1
        except Exception as e:
            errors += 1
            print(f'  error: {md.name}: {e}')

    print(f'OG images: {written} written, {skipped} unchanged, {errors} errors → public/og/')


if __name__ == '__main__':
    main()
