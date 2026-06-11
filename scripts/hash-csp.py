#!/usr/bin/env python3
"""
hash-csp.py
-----------
Scans all .astro source files for is:inline script tags and prints the
SHA-256 hashes needed for the script-src CSP directive in public/_headers.

Run this any time you add, edit, or delete an is:inline script:

    python scripts/hash-csp.py

Then copy the printed hashes into the Content-Security-Policy line in
public/_headers, replacing the old set. The key comment block above the
CSP line documents which hash maps to which script.

Does NOT emit hashes for:
  - <script type="application/ld+json"> (non-executable, exempt from script-src)
  - <script type="application/json">    (non-executable, exempt)
  - <script set:html=...>               (should be refactored away; will warn)
  - <script is:inline define:vars=...>  (should be refactored away; will warn)
  - Regular <script> tags without is:inline (Astro bundles these as /_astro/*.js)
"""

import re
import hashlib
import base64
from pathlib import Path

ROOT = Path(__file__).parent.parent / "src"

INLINE_RE = re.compile(
    r'<script\s+(is:inline)([^>]*)>([\s\S]*?)</script>',
    re.MULTILINE,
)

WARN_DEFINE_VARS_RE = re.compile(r'define:vars\s*=')
WARN_SET_HTML_RE = re.compile(r'set:html\s*=')
SKIP_TYPE_RE = re.compile(r'type=["\']application/(ld\+json|json)["\']')


def sha256_b64(text: str) -> str:
    digest = hashlib.sha256(text.encode("utf-8")).digest()
    return base64.b64encode(digest).decode()


hashes: dict[str, list[str]] = {}  # hash -> [file descriptions]
warnings = []

for path in sorted(ROOT.rglob("*.astro")):
    rel = path.relative_to(ROOT.parent)
    text = path.read_text(encoding="utf-8")

    for m in INLINE_RE.finditer(text):
        attrs = m.group(2)
        content = m.group(3)

        if SKIP_TYPE_RE.search(attrs):
            continue
        if WARN_DEFINE_VARS_RE.search(attrs):
            warnings.append(f"  WARN define:vars still present: {rel}")
            continue
        if WARN_SET_HTML_RE.search(m.group(0)[:50]):
            warnings.append(f"  WARN set:html inline script: {rel}")
            continue

        h = f"'sha256-{sha256_b64(content)}'"
        hashes.setdefault(h, []).append(str(rel))

print("=" * 72)
print("CSP script-src hashes for public/_headers")
print("=" * 72)
print()
print("Paste these into the script-src directive (after 'self' and before the")
print("external domain allowlist):")
print()
for h, files in hashes.items():
    for f in files:
        print(f"  # {f}")
    print(f"  {h}")
    print()

if warnings:
    print("=" * 72)
    print("WARNINGS — these scripts still need refactoring:")
    for w in warnings:
        print(w)
    print()

print(f"Total unique hashes: {len(hashes)}")
