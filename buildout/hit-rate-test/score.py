#!/usr/bin/env python3
"""
score.py - step 3 of the website-resolution hit-rate gate.
Spec: ActivityRadar/buildout/WEBSITE-RESOLUTION-HIT-RATE-TEST-2026-06-15.md

Reads raw_results.jsonl, applies the match-confidence rules, and writes:
  scorecard.csv  one row per org with the spec's exact columns
  report.json    the five headline numbers, overall + by NTEE group + by commonness
  spotcheck.csv  a random 200 of the auto-classified rows for the human check

No network. Pure scoring. All thresholds come from config.json so they can be
tuned after eyeballing the first 200 rows, never hand-tuned per org.

Buckets:
  resolved_correct  name >= accept AND geography matches AND own site
  social_only       best usable return is a social or registration-platform URL
  review            strong name but geography silent, OR geography ok with mid name
  no_result         nothing clears the review floor, or only a directory/news page
  wrong_match       strong name but a DIFFERENT state shows (national parent etc.)

Usage:
  python score.py
  python score.py --raw out/raw_results.jsonl --out-dir out
"""

import argparse
import csv
import difflib
import json
import os
import random
import re
import sys
from urllib.parse import urlparse

HERE = os.path.dirname(__file__)
BUCKETS = ["resolved_correct", "social_only", "review", "no_result", "wrong_match"]


def load_config(path):
    if path and os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return {}


def tokenize(s, stopwords, suffixes):
    toks = re.findall(r"[a-z0-9]+", (s or "").lower())
    drop = set(stopwords) | set(suffixes)
    return [t for t in toks if t not in drop and len(t) > 1]


def _ratio(a, b):
    return int(round(difflib.SequenceMatcher(None, a, b).ratio() * 100))


def token_set_ratio(a_tokens, b_tokens):
    """Stdlib port of fuzzywuzzy token_set_ratio."""
    if not a_tokens or not b_tokens:
        return 0
    sa, sb = set(a_tokens), set(b_tokens)
    inter = sorted(sa & sb)
    diff_a = sorted(sa - sb)
    diff_b = sorted(sb - sa)
    t0 = " ".join(inter).strip()
    t1 = (" ".join(inter) + " " + " ".join(diff_a)).strip()
    t2 = (" ".join(inter) + " " + " ".join(diff_b)).strip()
    if not t0:
        return _ratio(" ".join(sorted(sa)), " ".join(sorted(sb)))
    return max(_ratio(t0, t1), _ratio(t0, t2), _ratio(t1, t2))


def domain_class(domain, sc):
    d = (domain or "").lower()
    if not d:
        return "empty"

    def hit(group):
        items = sc.get(group, [])
        return any(d == x or d.endswith("." + x) or x in d for x in items)

    if hit("directory_domains"):
        return "directory"
    if hit("social_domains"):
        return "social"
    if hit("registration_platforms"):
        return "registration"
    if any(h in d for h in sc.get("news_tld_hints", [])):
        return "news"
    if d.endswith(".gov"):
        return "gov"
    return "own"


def city_in_text(city, *texts):
    if not city:
        return False
    c = city.lower().strip()
    if len(c) < 3:
        return False
    blob = " ".join(t.lower() for t in texts if t)
    return c in blob


US_STATES = {
    "AL": "alabama", "AK": "alaska", "AZ": "arizona", "AR": "arkansas",
    "CA": "california", "CO": "colorado", "CT": "connecticut", "DE": "delaware",
    "FL": "florida", "GA": "georgia", "HI": "hawaii", "ID": "idaho",
    "IL": "illinois", "IN": "indiana", "IA": "iowa", "KS": "kansas",
    "KY": "kentucky", "LA": "louisiana", "ME": "maine", "MD": "maryland",
    "MA": "massachusetts", "MI": "michigan", "MN": "minnesota", "MS": "mississippi",
    "MO": "missouri", "MT": "montana", "NE": "nebraska", "NV": "nevada",
    "NH": "new hampshire", "NJ": "new jersey", "NM": "new mexico", "NY": "new york",
    "NC": "north carolina", "ND": "north dakota", "OH": "ohio", "OK": "oklahoma",
    "OR": "oregon", "PA": "pennsylvania", "RI": "rhode island", "SC": "south carolina",
    "SD": "south dakota", "TN": "tennessee", "TX": "texas", "UT": "utah",
    "VT": "vermont", "VA": "virginia", "WA": "washington", "WV": "west virginia",
    "WI": "wisconsin", "WY": "wyoming",
}


def geo_conflict(org_state, *texts):
    """True if the text names a US state other than the org's and not the org's own.
    Catches national parents and out-of-state chapters."""
    org_state = (org_state or "").upper()
    if org_state not in US_STATES:
        return False
    own_name = US_STATES[org_state]
    blob = " ".join(t for t in texts if t)
    low = blob.lower()
    if own_name in low:
        return False
    if re.search(r"\b" + org_state + r"\b", blob):
        return False
    found = set()
    for m in re.findall(r",\s*([A-Z]{2})\b", blob):
        if m in US_STATES:
            found.add(m)
    for st, full in US_STATES.items():
        if re.search(r"\b" + re.escape(full) + r"\b", low):
            found.add(st)
    found.discard(org_state)
    return bool(found)


def score_org(rec, sc):
    """Return (classification, best_name_score, geo_match, chosen_result)."""
    accept = sc["name_accept_min"]
    review_min = sc["name_review_min"]
    stop = sc.get("stopwords", [])
    suf = sc.get("drop_corporate_suffixes", [])
    name_tokens = tokenize(rec.get("name", ""), stop, suf)
    city = rec.get("city", "")

    candidates = list(rec.get("organic") or [])
    maps_site = rec.get("maps_website") or ""
    if maps_site:
        host = urlparse(maps_site if "://" in maps_site else "http://" + maps_site).netloc.lower()
        if host.startswith("www."):
            host = host[4:]
        candidates.insert(0, {
            "domain": host, "title": rec.get("name", ""), "snippet": "",
            "link": maps_site, "_maps": True,
        })

    if not candidates:
        return "no_result", 0, False, {}

    best = None
    best_score = -1
    for cand in candidates:
        title_tokens = tokenize(cand.get("title", ""), stop, suf)
        dom_clean = (cand.get("domain", "") or "").replace(".", " ")
        dom_tokens = tokenize(dom_clean, stop, suf)
        s = max(token_set_ratio(name_tokens, title_tokens),
                token_set_ratio(name_tokens, dom_tokens))
        cand = dict(cand, _name_score=s)
        cand["_dclass"] = domain_class(cand.get("domain", ""), sc)
        cand["_geo"] = bool(cand.get("_maps")) or city_in_text(
            city, cand.get("title", ""), cand.get("snippet", ""))
        if s > best_score:
            best_score, best = s, cand

    dclass = best["_dclass"]
    geo = best["_geo"]
    name_score = best["_name_score"]

    if dclass in ("social", "registration"):
        return "social_only", name_score, geo, best
    if dclass in ("directory", "news", "gov"):
        return "no_result", name_score, geo, best

    if name_score >= accept and geo:
        return "resolved_correct", name_score, geo, best
    if name_score >= accept and not geo:
        if geo_conflict(rec.get("state", ""), best.get("title", ""), best.get("snippet", "")):
            return "wrong_match", name_score, geo, best
        return "review", name_score, geo, best
    if review_min <= name_score < accept and geo:
        return "review", name_score, geo, best
    if name_score < review_min:
        return "no_result", name_score, geo, best
    return "review", name_score, geo, best


def pct(n, d):
    return round(100.0 * n / d, 1) if d else 0.0


def breakdown(rows, key):
    out = {}
    for r in rows:
        g = r.get(key) or "unknown"
        b = out.setdefault(g, {})
        b[r["classification"]] = b.get(r["classification"], 0) + 1
    rep = {}
    for g, counts in sorted(out.items()):
        tot = sum(counts.values())
        rates = {k: pct(counts.get(k, 0), tot) for k in BUCKETS}
        rep[g] = {"n": tot, "rates": rates}
    return rep


def decide(resolved, gate):
    if resolved >= gate.get("go_full_enrichment_at", 60):
        return "GO: buy full-file enrichment."
    if resolved >= gate.get("go_scoped_band_low", 40):
        return "GO SCOPED: enrich only the bands that cleared the go threshold."
    return "NO-GO on IRS-first: prioritize the municipal-platform crawl."


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", default=os.path.join(HERE, "config.json"))
    ap.add_argument("--raw", default=os.path.join(HERE, "out", "raw_results.jsonl"))
    ap.add_argument("--out-dir", default=os.path.join(HERE, "out"))
    args = ap.parse_args()

    cfg = load_config(args.config)
    sc = cfg.get("scoring", {})
    gate = cfg.get("gate", {})
    seed = int(cfg.get("sample", {}).get("random_seed", 615))

    if not os.path.exists(args.raw):
        print("No raw results at %s. Run resolve.py --go first." % args.raw, file=sys.stderr)
        sys.exit(1)

    scored = []
    with open(args.raw, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            rec = json.loads(line)
            cls, nscore, geo, best = score_org(rec, sc)
            scored.append({
                "org_id": rec.get("org_id", ""),
                "name": rec.get("name", ""),
                "city": rec.get("city", ""),
                "state": rec.get("state", ""),
                "ntee_group": rec.get("ntee_group", ""),
                "name_commonness": rec.get("name_commonness", ""),
                "query": rec.get("query", ""),
                "top_domain": best.get("domain", ""),
                "top_title": best.get("title", ""),
                "top_snippet": best.get("snippet", ""),
                "name_score": nscore,
                "geo_match": 1 if geo else 0,
                "classification": cls,
            })

    os.makedirs(args.out_dir, exist_ok=True)
    cols = ["org_id", "name", "city", "state", "ntee_group", "name_commonness",
            "query", "top_domain", "top_title", "top_snippet", "name_score",
            "geo_match", "classification"]
    card_path = os.path.join(args.out_dir, "scorecard.csv")
    with open(card_path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for r in scored:
            w.writerow({c: r.get(c, "") for c in cols})

    n = len(scored)
    counts = {k: sum(1 for r in scored if r["classification"] == k) for k in BUCKETS}
    headline = {k: pct(counts[k], n) for k in BUCKETS}
    resolved = headline["resolved_correct"]
    decision = decide(resolved, gate)

    report = {
        "n_scored": n,
        "headline_rates": headline,
        "headline_counts": counts,
        "decision": decision,
        "gate_thresholds": gate,
        "by_ntee_group": breakdown(scored, "ntee_group"),
        "by_name_commonness": breakdown(scored, "name_commonness"),
    }
    with open(os.path.join(args.out_dir, "report.json"), "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    random.seed(seed)
    spot_n = int(gate.get("classifier_spotcheck_size", 200))
    resolved_rows = [r for r in scored if r["classification"] == "resolved_correct"]
    other_rows = [r for r in scored if r["classification"] != "resolved_correct"]
    take_resolved = min(len(resolved_rows), int(spot_n * 0.6))
    take_other = min(len(other_rows), spot_n - take_resolved)
    spot = random.sample(resolved_rows, take_resolved) + random.sample(other_rows, take_other)
    random.shuffle(spot)
    spot_path = os.path.join(args.out_dir, "spotcheck.csv")
    with open(spot_path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols + ["human_verdict"])
        w.writeheader()
        for r in spot:
            row = {c: r.get(c, "") for c in cols}
            row["human_verdict"] = ""
            w.writerow(row)

    print(json.dumps(report, indent=2))
    print("\nHEADLINE resolved-correct: %s%%  ->  %s" % (resolved, decision), file=sys.stderr)


if __name__ == "__main__":
    main()
