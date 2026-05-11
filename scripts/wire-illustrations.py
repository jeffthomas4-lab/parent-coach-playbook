"""
Auto-wire newly-generated illustrations into the right page templates.

Scans public/illustrations/ for image files. For any whose filename matches
a known wiring pattern AND that isn't already referenced anywhere in src/,
inserts the right <img> tag into the right page.

WIRING PATTERNS RECOGNIZED
    pillar-drive-there.webp        -> PillarLayout (drive-there block)
    pillar-drive-home.webp         -> PillarLayout (drive-home block)
    pillar-game-day.webp           -> PillarLayout (game block)
    pillar-parent-coach.webp       -> src/pages/parent-coach.astro
    pillar-team-parent.webp        -> src/pages/team-parent/index.astro
    pillar-body-safety.webp        -> src/pages/body/index.astro
    pillar-season-calendar.webp    -> src/pages/season-calendar/index.astro
    pillar-recruiting.webp         -> src/pages/recruiting/index.astro
    pillar-scripts.webp            -> src/pages/scripts/index.astro
    pillar-decisions.webp          -> src/pages/decisions/index.astro
    pillar-rules.webp              -> src/pages/rules/index.astro
    pillar-sports-grid.webp        -> src/pages/sports/index.astro
    pillar-what-to-buy.webp        -> src/pages/what-to-buy/index.astro
    pillar-governing-bodies.webp   -> src/pages/governing-bodies.astro
    pillar-tools.webp              -> src/pages/tools/index.astro
    about-*.webp                   -> src/pages/about.astro
    why-we-exist-*.webp            -> src/pages/why-we-exist.astro
    start-here-*.webp              -> src/pages/start-here.astro
    contributors-*.webp            -> src/pages/contributors.astro
    welcome-*.webp                 -> src/pages/welcome/index.astro
    accessibility-*.webp           -> src/pages/accessibility.astro
    disclosure-*.webp              -> src/pages/disclosure.astro
    methodology-*.webp             -> src/pages/cost-calculator/methodology.astro
    newsletter-*.webp              -> src/components/NewsletterSignup.astro

USAGE
    python3 scripts/wire-illustrations.py            # apply wirings
    python3 scripts/wire-illustrations.py --dry-run  # show what would be wired

NOTES
    Idempotent: skips files already referenced in src/ (so re-running is safe).
    Article-specific heroes (matching an article slug in src/content/articles/)
    are NOT auto-wired — those go into the article's frontmatter and need
    editorial review of the alt text. The script will list them as a
    follow-up todo at the end.
"""
import sys
import re
import argparse
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ILL_DIR = ROOT / 'public' / 'illustrations'
SRC_DIR = ROOT / 'src'

def is_already_referenced(filename: str) -> bool:
    """Check if any file in src/ already references this illustration."""
    try:
        result = subprocess.run(
            ['grep', '-rl', f'/illustrations/{filename}', str(SRC_DIR)],
            capture_output=True, text=True, timeout=10,
        )
        return bool(result.stdout.strip())
    except Exception:
        return False

def make_alt(filename: str) -> str:
    """Generate a passable alt text from the filename. User can refine later."""
    stem = filename.rsplit('.', 1)[0]
    parts = stem.replace('pillar-', '').replace('-', ' ').split()
    # Capitalize first word, leave rest lowercase
    if parts:
        parts[0] = parts[0].capitalize()
    return ' '.join(parts) + ' — illustration.'

def fig_block(filename: str, alt: str, max_width_class: str = 'max-w-3xl', extra_class: str = '') -> str:
    """Standard <figure> markup matching the rest of the site."""
    return f'''      <figure class="mt-10 {max_width_class} {extra_class}".strip()>
        <img
          src="/illustrations/{filename}"
          alt="{alt}"
          class="w-full border border-bone"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
      </figure>'''

# Wiring rules: each is (filename, target_file, anchor_substring, insertion_template, max_width)
# We'll build inline rather than a giant table.

def wire_pillar_layout_game(dry_run, log):
    """Add game-day image to PillarLayout when pillar==='game'."""
    fn = 'pillar-game-day.webp'
    if not (ILL_DIR / fn).exists() or is_already_referenced(fn):
        return
    target = SRC_DIR / 'layouts' / 'PillarLayout.astro'
    text = target.read_text(encoding='utf-8')
    anchor = """        {pillar === 'drive-home' && ("""
    if anchor not in text:
        log.append(f'  SKIP {fn} — anchor not found in PillarLayout')
        return
    insert = """        {pillar === 'game' && (
          <figure class="mt-10">
            <img
              src="/illustrations/pillar-game-day.webp"
              alt="A youth field at golden hour — goal posts and chalked sideline visible, empty bleachers behind, calm before the game."
              class="w-full max-w-2xl border border-bone"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          </figure>
        )}
"""
    new_text = text.replace(anchor, insert + anchor, 1)
    if not dry_run:
        target.write_text(new_text, encoding='utf-8', newline='')
    log.append(f'  WIRED {fn} -> PillarLayout (game pillar)')

def wire_into_landing(dry_run, log, fn, target_path, anchor_text, after=True):
    """Insert a figure after (or before) anchor_text in target page."""
    if not (ILL_DIR / fn).exists() or is_already_referenced(fn):
        return
    target = SRC_DIR / target_path
    if not target.exists():
        log.append(f'  SKIP {fn} — target {target_path} not found')
        return
    text = target.read_text(encoding='utf-8')
    if anchor_text not in text:
        log.append(f'  SKIP {fn} — anchor not found in {target_path}')
        return
    figure = f'''      <figure class="mt-10 max-w-3xl">
        <img
          src="/illustrations/{fn}"
          alt="{make_alt(fn)}"
          class="w-full border border-bone"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
      </figure>
'''
    if after:
        new_text = text.replace(anchor_text, anchor_text + '\n' + figure, 1)
    else:
        new_text = text.replace(anchor_text, figure + '\n' + anchor_text, 1)
    if not dry_run:
        target.write_text(new_text, encoding='utf-8', newline='')
    log.append(f'  WIRED {fn} -> {target_path}')

# Anchor pattern for landing pages: insert image after the closing </h1> + <p> blurb,
# right before </div></section>. We use a simpler anchor: the closing of the hero blurb.

LANDING_RULES = [
    # (filename pattern, target page, anchor text)
    ('pillar-season-calendar.webp', 'pages/season-calendar/index.astro', None),
    ('pillar-recruiting.webp',      'pages/recruiting/index.astro',      None),
    ('pillar-scripts.webp',         'pages/scripts/index.astro',         None),
    ('pillar-decisions.webp',       'pages/decisions/index.astro',       None),
    ('pillar-rules.webp',           'pages/rules/index.astro',           None),
    ('pillar-sports-grid.webp',     'pages/sports/index.astro',          None),
    ('pillar-what-to-buy.webp',     'pages/what-to-buy/index.astro',     None),
    ('pillar-governing-bodies.webp','pages/governing-bodies.astro',      None),
    ('pillar-tools.webp',           'pages/tools/index.astro',           None),
    ('about-editorial-desk.webp',   'pages/about.astro',                 None),
    ('why-we-exist-empty-bleachers.webp', 'pages/why-we-exist.astro',    None),
    ('start-here-trail-marker.webp','pages/start-here.astro',            None),
    ('contributors-shared-table.webp','pages/contributors.astro',        None),
    ('welcome-mailbox-flag-up.webp','pages/welcome/index.astro',         None),
    ('accessibility-open-door.webp','pages/accessibility.astro',         None),
    ('disclosure-open-ledger.webp', 'pages/disclosure.astro',            None),
    ('methodology-receipts.webp',   'pages/cost-calculator/methodology.astro', None),
    ('og-cost-calculator.webp',     None, None),  # not auto-wired (BaseLayout level)
    ('pillar-body-safety.webp',     None, None),  # already wired
    ('pillar-team-parent.webp',     None, None),  # already wired
    ('pillar-parent-coach.webp',    None, None),  # already wired
]

def find_landing_anchor(text):
    """Find a place to insert the image in a landing page's hero section.

    Pattern: look for `</p>\n    </div>\n  </section>` — the typical end of a
    hero block. Insert the figure between </p> and </div>."""
    # Try most-specific first: end of a hero blurb followed by section close
    for pat in [
        r'(</p>)(\s*\n\s*</div>\s*\n\s*</section>)',  # standard hero close
    ]:
        m = re.search(pat, text)
        if m:
            return m
    return None

def wire_landing_smart(dry_run, log, fn, target_path):
    if not (ILL_DIR / fn).exists():
        return
    if is_already_referenced(fn):
        return
    target = SRC_DIR / target_path
    if not target.exists():
        log.append(f'  SKIP {fn} — target {target_path} not found')
        return
    text = target.read_text(encoding='utf-8')
    m = find_landing_anchor(text)
    if not m:
        log.append(f'  SKIP {fn} — no hero anchor pattern in {target_path}')
        return
    figure = f'''
      <figure class="mt-10 max-w-3xl">
        <img
          src="/illustrations/{fn}"
          alt="{make_alt(fn)}"
          class="w-full border border-bone"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
      </figure>'''
    new_text = text[:m.start(2)] + figure + text[m.start(2):]
    if not dry_run:
        target.write_text(new_text, encoding='utf-8', newline='')
    log.append(f'  WIRED {fn} -> {target_path}')

def detect_article_heroes(log):
    """Find images whose filename matches an article slug — these need
    frontmatter wiring, which we don't auto-do. List them as todos."""
    article_slugs = {p.stem for p in (ROOT / 'src' / 'content' / 'articles').glob('*.md')}
    candidates = []
    for img in ILL_DIR.glob('*.webp'):
        stem = img.stem
        # strip common prefixes
        for prefix in ('hero-', 'article-'):
            if stem.startswith(prefix):
                stem = stem[len(prefix):]
        # Remove descriptive suffixes — keep first 3-4 words then check
        # We're more lenient: if any article slug is a prefix of this filename, flag it
        for slug in article_slugs:
            if stem.startswith(slug + '-') or stem == slug:
                if not is_already_referenced(img.name):
                    candidates.append((img.name, slug))
                break
    return candidates

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    log = []

    # Pillar layout: game block
    wire_pillar_layout_game(args.dry_run, log)

    # All landing pages
    for fn, target, _ in LANDING_RULES:
        if target is None:
            continue
        wire_landing_smart(args.dry_run, log, fn, target)

    # Article heroes (manual followup)
    article_todos = detect_article_heroes(log)

    # Print report
    print(f'\n=== Auto-wiring report{"  (DRY RUN)" if args.dry_run else ""} ===\n')
    if not log:
        print('  Nothing new to wire.')
    else:
        for line in log:
            print(line)

    if article_todos:
        print(f'\n=== Article hero candidates ({len(article_todos)}) ===')
        print('  These need frontmatter editing in the article markdown.')
        print('  Add the following to each article frontmatter:')
        print('    hero: /illustrations/<filename>')
        print('    heroAlt: "..."')
        print()
        for fn, slug in article_todos:
            print(f'  src/content/articles/{slug}.md  +=  hero: /illustrations/{fn}')

    print()
    return 0

if __name__ == '__main__':
    sys.exit(main())
