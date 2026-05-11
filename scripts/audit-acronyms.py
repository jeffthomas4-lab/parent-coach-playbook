#!/usr/bin/env python3
"""
Audit body/ articles for acronyms used without first-use expansion.

Per EDITORIAL_STANDARDS.md section 7: every acronym in body content must
be expanded on first use within the article. This script flags violations
so they get fixed before publish.

Usage:
    python3 scripts/audit-acronyms.py            # report only
    python3 scripts/audit-acronyms.py --strict   # exit 1 if any violations
"""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BODY = ROOT / 'src' / 'content' / 'body'

# Acronyms that must be expanded. Keep in sync with EDITORIAL_STANDARDS.md §7.
MUST_EXPAND = {
    'AED', 'CPR', 'EMS', 'ER', 'TBI', 'ACL', 'RED-S', 'ADHD',
    'AAP', 'CDC', 'NATA', 'NCAA', 'NFHS', 'USADA', 'WADA', 'IOC',
    'NHTSA', 'FMCSA', 'CPSC', 'NCMEC', 'AAAAI', 'AAOS', 'AAFP',
    'COPPA', 'NSCA', 'JED', 'PCA', 'NPVSF', 'FAA', 'TSA',
}

violations = []

for md in sorted(BODY.glob('*.md')):
    text = md.read_text(encoding='utf-8')
    # Strip frontmatter
    fm_match = re.match(r'^---\s*\n.*?\n---\s*\n(.*)$', text, re.DOTALL)
    body = fm_match.group(1) if fm_match else text

    for ac in MUST_EXPAND:
        # Standalone occurrence outside link URL/code
        if not re.search(rf'\b{re.escape(ac)}\b', body):
            continue
        # Has it been expanded? Look for "ACRONYM (" or "(ACRONYM)" — either order
        expanded = bool(re.search(rf'{re.escape(ac)}\s*\(', body)) or \
                   bool(re.search(rf'\([^)]*\b{re.escape(ac)}\b[^)]*\)', body))
        if not expanded:
            violations.append((md.name, ac))

if violations:
    print(f'ACRONYM AUDIT: {len(violations)} violations across {len(set(v[0] for v in violations))} files\n')
    by_file = {}
    for fn, ac in violations:
        by_file.setdefault(fn, []).append(ac)
    for fn in sorted(by_file):
        print(f'  {fn}')
        print(f'    needs expansion on first use: {", ".join(sorted(by_file[fn]))}')
    if '--strict' in sys.argv:
        sys.exit(1)
else:
    print(f'ACRONYM AUDIT: clean. All MUST_EXPAND acronyms expanded on first use across body/.')
