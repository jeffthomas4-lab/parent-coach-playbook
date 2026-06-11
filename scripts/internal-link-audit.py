#!/usr/bin/env python3
"""
internal-link-audit.py
----------------------
Scans all article, decision, and script content files.
For each piece, identifies other pieces it COULD link to but doesn't.
Outputs a ranked CSV of cross-link candidates.

Usage:
    python scripts/internal-link-audit.py
    python scripts/internal-link-audit.py --min-score 3
    python scripts/internal-link-audit.py --collection articles
    python scripts/internal-link-audit.py --top 20

Output: internal-link-candidates.csv in the project root.

Scoring:
    +3  same sport tag
    +3  same topic tag
    +2  same age band
    +2  keyword from candidate title found verbatim in source body
    +1  keyword from candidate slug found (hyphen-split words) in source body
    -10 link already exists in source body (excluded from output)

Only candidates with score >= 2 are included. Results sorted by score desc.
"""

import os
import re
import sys
import csv
import argparse
from pathlib import Path

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

CONTENT_ROOT = Path(__file__).parent.parent / "src" / "content"

COLLECTIONS = {
    "articles":  {"dir": CONTENT_ROOT / "articles",   "url_prefix": None},   # uses phase from frontmatter
    "decisions": {"dir": CONTENT_ROOT / "decisions",  "url_prefix": "/decisions/"},
    "scripts":   {"dir": CONTENT_ROOT / "scripts",    "url_prefix": "/scripts/"},
}

STOP_WORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "your", "my", "our", "their", "its",
    "is", "are", "was", "were", "be", "been", "being", "have", "has",
    "had", "do", "does", "did", "will", "would", "could", "should",
    "may", "might", "can", "this", "that", "these", "those", "what",
    "when", "where", "how", "why", "who", "which", "it", "not", "no",
    "if", "so", "as", "up", "out", "about", "after", "before", "than",
    "then", "just", "more", "all", "any", "some", "most", "own", "too",
    "very", "re", "s", "t", "won", "ll", "ve", "d", "m",
}

MIN_KEYWORD_LEN = 4

# ---------------------------------------------------------------------------
# Frontmatter parser (no dependencies)
# ---------------------------------------------------------------------------

def parse_frontmatter(text: str) -> tuple[dict, str]:
    """Return (frontmatter_dict, body_text). Handles YAML scalars only."""
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end == -1:
        return {}, text
    yaml_block = text[3:end].strip()
    body = text[end + 4:].strip()
    fm: dict = {}
    for line in yaml_block.splitlines():
        m = re.match(r'^(\w[\w-]*):\s*(.*)$', line)
        if not m:
            continue
        key, val = m.group(1), m.group(2).strip()
        # strip surrounding quotes
        if (val.startswith('"') and val.endswith('"')) or \
           (val.startswith("'") and val.endswith("'")):
            val = val[1:-1]
        fm[key] = val
    return fm, body


# ---------------------------------------------------------------------------
# Content loading
# ---------------------------------------------------------------------------

def load_collection(name: str, cfg: dict) -> list[dict]:
    d = cfg["dir"]
    if not d.exists():
        return []
    items = []
    for f in sorted(d.glob("*.md")):
        text = f.read_text(encoding="utf-8")
        fm, body = parse_frontmatter(text)
        if fm.get("draft", "false").lower() == "true":
            continue
        slug = f.stem
        phase = fm.get("phase", "")
        if cfg["url_prefix"]:
            url = f"{cfg['url_prefix']}{slug}/"
        elif phase:
            url = f"/{phase}/{slug}/"
        else:
            continue  # can't build URL
        items.append({
            "collection": name,
            "slug": slug,
            "url": url,
            "title": fm.get("title", slug).replace("*", ""),
            "dek": fm.get("dek", ""),
            "sport": fm.get("sport", ""),
            "topic": fm.get("topic", ""),
            "age": fm.get("age", ""),
            "phase": phase,
            "body": body,
        })
    return items


def load_all(collections: list[str]) -> list[dict]:
    items = []
    for name in collections:
        if name in COLLECTIONS:
            items.extend(load_collection(name, COLLECTIONS[name]))
    return items


# ---------------------------------------------------------------------------
# Keyword extraction
# ---------------------------------------------------------------------------

def keywords_from_text(text: str) -> set[str]:
    words = re.findall(r"[a-z0-9]+", text.lower())
    return {w for w in words if len(w) >= MIN_KEYWORD_LEN and w not in STOP_WORDS}


def keywords_from_slug(slug: str) -> set[str]:
    words = slug.replace("-", " ").split()
    return {w for w in words if len(w) >= MIN_KEYWORD_LEN and w not in STOP_WORDS}


def title_phrases(title: str) -> list[str]:
    """Multi-word phrases from the title that are worth looking for verbatim."""
    clean = title.lower()
    clean = re.sub(r"[^a-z0-9 ']", " ", clean)
    words = [w for w in clean.split() if w not in STOP_WORDS and len(w) >= MIN_KEYWORD_LEN]
    phrases = list(words)  # single keywords
    # bigrams
    for i in range(len(words) - 1):
        phrases.append(f"{words[i]} {words[i+1]}")
    # trigrams
    for i in range(len(words) - 2):
        phrases.append(f"{words[i]} {words[i+1]} {words[i+2]}")
    return phrases


# ---------------------------------------------------------------------------
# Already-linked URL detection
# ---------------------------------------------------------------------------

def existing_links(body: str) -> set[str]:
    """Return set of URL paths already linked in the markdown body."""
    return set(re.findall(r'\]\((/[^)#]+)', body))


# ---------------------------------------------------------------------------
# Scoring
# ---------------------------------------------------------------------------

def score_candidate(source: dict, candidate: dict) -> tuple[int, list[str]]:
    reasons = []
    score = 0

    # same sport (non-empty, non-multi-sport)
    if (source["sport"] and candidate["sport"]
            and source["sport"] == candidate["sport"]
            and source["sport"] not in ("multi-sport", "multi-activity")):
        score += 3
        reasons.append(f"same sport ({source['sport']})")

    # same topic
    if source["topic"] and candidate["topic"] and source["topic"] == candidate["topic"]:
        score += 3
        reasons.append(f"same topic ({source['topic']})")

    # same age band
    if source["age"] and candidate["age"] and source["age"] == candidate["age"]:
        score += 2
        reasons.append(f"same age ({source['age']})")

    # title phrase verbatim in body
    body_lower = source["body"].lower()
    matched_phrases = []
    for phrase in title_phrases(candidate["title"]):
        if len(phrase) >= MIN_KEYWORD_LEN and phrase in body_lower:
            matched_phrases.append(phrase)
    if matched_phrases:
        # take the longest match
        best = max(matched_phrases, key=len)
        score += 2
        reasons.append(f'title phrase in body: "{best}"')

    # slug keywords in body
    slug_kws = keywords_from_slug(candidate["slug"])
    body_kws = keywords_from_text(source["body"])
    overlap = slug_kws & body_kws
    if overlap and score > 0:  # only count if there's already some relevance signal
        score += 1
        reasons.append(f"slug keywords: {', '.join(sorted(overlap)[:4])}")

    return score, reasons


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Internal link audit for parentcoachdesk.com")
    parser.add_argument("--min-score", type=int, default=2,
                        help="Minimum relevance score to include (default: 2)")
    parser.add_argument("--top", type=int, default=0,
                        help="Limit to top N candidates per source article (0 = unlimited)")
    parser.add_argument("--collection", default="all",
                        choices=["all", "articles", "decisions", "scripts"],
                        help="Which collection to scan as source (default: all)")
    parser.add_argument("--output", default="internal-link-candidates.csv",
                        help="Output CSV filename (default: internal-link-candidates.csv)")
    args = parser.parse_args()

    source_collections = list(COLLECTIONS.keys()) if args.collection == "all" else [args.collection]
    all_collections = list(COLLECTIONS.keys())

    print(f"Loading content...")
    sources = load_all(source_collections)
    candidates = load_all(all_collections)
    print(f"  {len(sources)} source pieces, {len(candidates)} candidate targets")

    rows = []
    for i, source in enumerate(sources):
        if (i + 1) % 50 == 0:
            print(f"  Scoring {i+1}/{len(sources)}...")
        linked = existing_links(source["body"])
        hits = []
        for candidate in candidates:
            # skip self
            if candidate["slug"] == source["slug"] and candidate["collection"] == source["collection"]:
                continue
            # skip already linked
            if candidate["url"] in linked:
                continue
            score, reasons = score_candidate(source, candidate)
            if score >= args.min_score:
                hits.append((score, reasons, candidate))
        # sort by score desc
        hits.sort(key=lambda x: -x[0])
        if args.top:
            hits = hits[:args.top]
        for score, reasons, candidate in hits:
            rows.append({
                "score": score,
                "source_collection": source["collection"],
                "source_slug": source["slug"],
                "source_url": source["url"],
                "source_title": source["title"],
                "candidate_collection": candidate["collection"],
                "candidate_slug": candidate["slug"],
                "candidate_url": candidate["url"],
                "candidate_title": candidate["title"],
                "reasons": " | ".join(reasons),
            })

    # global sort by score desc, then source title
    rows.sort(key=lambda r: (-r["score"], r["source_title"]))

    output_path = Path(__file__).parent.parent / args.output
    fieldnames = [
        "score", "source_collection", "source_slug", "source_url", "source_title",
        "candidate_collection", "candidate_slug", "candidate_url", "candidate_title",
        "reasons",
    ]
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\nDone. {len(rows)} candidates written to {output_path.name}")
    print(f"\nTop 20 by score:")
    for r in rows[:20]:
        print(f"  [{r['score']}] {r['source_slug']} → {r['candidate_slug']}")
        print(f"       {r['reasons']}")


if __name__ == "__main__":
    main()
