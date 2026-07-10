#!/usr/bin/env python3
"""
resolve.py

Step 2 of the website-resolution hit-rate gate.
Spec: ActivityRadar/buildout/WEBSITE-RESOLUTION-HIT-RATE-TEST-2026-06-15.md

Takes sample.csv and, per org, runs ONE search ("{name}" {city} {state}) through a
SERP provider, capturing the top-N organic results (domain, title, snippet) plus the
Google Maps website field when a Maps panel fires. Writes one JSON line per org to
raw_results.jsonl.

SAFE BY DEFAULT. With no --go flag it is a DRY RUN: it prints the queries it would
send and writes nothing. It only calls a provider when you pass --go AND an API key.
That keeps "build the harness" separate from "spend money running it."

Resumable: already-resolved org_ids in the output file are skipped, so a run that
dies at row 1,400 picks up where it left off. Rate-limited per config.

PROVIDERS (pick with --provider or config.provider.name):
  serper      https://google.serper.dev/search   header X-API-KEY        (cheap, clean)
  serpapi     https://serpapi.com/search.json     param  api_key
  outscraper  https://api.outscraper.cloud/google-search-v3  header X-API-KEY

Set the key via env (preferred) or --api-key:
  SERPER_API_KEY / SERPAPI_API_KEY / OUTSCRAPER_API_KEY

USAGE:
  # Dry run, see the first queries:
  python buildout/hit-rate-test/resolve.py --limit 5

  # Real run (spends API credits):
  $env:SERPER_API_KEY = "..."   # PowerShell
  python buildout/hit-rate-test/resolve.py --provider serper --go
"""

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

HERE = os.path.dirname(__file__)


def load_config(path):
    if path and os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return {}


def registrable_domain(url):
    """Best-effort eTLD+1 without external deps. Good enough for scoring buckets."""
    if not url:
        return ""
    try:
        host = urllib.parse.urlparse(url if "://" in url else "http://" + url).netloc.lower()
    except Exception:
        return ""
    host = host.split("@")[-1].split(":")[0]
    if host.startswith("www."):
        host = host[4:]
    parts = host.split(".")
    if len(parts) <= 2:
        return host
    # Handle common two-part public suffixes (co.uk, org.uk, etc.) minimally.
    two_part_suffix = {"co.uk", "org.uk", "ac.uk", "gov.uk", "com.au", "org.au"}
    if ".".join(parts[-2:]) in two_part_suffix and len(parts) >= 3:
        return ".".join(parts[-3:])
    return ".".join(parts[-2:])


def _http_post_json(url, payload, headers, timeout):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def _http_get_json(url, timeout):
    req = urllib.request.Request(url, headers={"User-Agent": "activityradar-hitrate/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


# --- provider adapters: each returns normalized dict ---
# {"organic": [{"domain","title","snippet","link"} ...], "maps_website": "" or url}

def call_serper(query, key, top_n, timeout):
    raw = _http_post_json(
        "https://google.serper.dev/search",
        {"q": query, "num": max(top_n, 10), "gl": "us"},
        {"X-API-KEY": key, "Content-Type": "application/json"},
        timeout,
    )
    organic = []
    for item in (raw.get("organic") or [])[:top_n]:
        link = item.get("link", "")
        organic.append({
            "domain": registrable_domain(link),
            "title": item.get("title", ""),
            "snippet": item.get("snippet", ""),
            "link": link,
        })
    maps_website = ""
    kg = raw.get("knowledgeGraph") or {}
    if isinstance(kg, dict):
        maps_website = kg.get("website", "") or ""
    if not maps_website and raw.get("places"):
        p0 = raw["places"][0] if raw["places"] else {}
        maps_website = p0.get("website", "") or ""
    return {"organic": organic, "maps_website": maps_website, "_raw_keys": list(raw.keys())}


def call_serpapi(query, key, top_n, timeout):
    qs = urllib.parse.urlencode({"q": query, "engine": "google", "api_key": key, "num": max(top_n, 10), "gl": "us"})
    raw = _http_get_json("https://serpapi.com/search.json?" + qs, timeout)
    organic = []
    for item in (raw.get("organic_results") or [])[:top_n]:
        link = item.get("link", "")
        organic.append({
            "domain": registrable_domain(link),
            "title": item.get("title", ""),
            "snippet": item.get("snippet", ""),
            "link": link,
        })
    maps_website = ""
    kg = raw.get("knowledge_graph") or {}
    if isinstance(kg, dict):
        maps_website = kg.get("website", "") or ""
    if not maps_website and raw.get("local_results"):
        places = raw["local_results"].get("places") if isinstance(raw["local_results"], dict) else raw["local_results"]
        if places:
            maps_website = (places[0] or {}).get("website", "") or ""
    return {"organic": organic, "maps_website": maps_website, "_raw_keys": list(raw.keys())}


def call_outscraper(query, key, top_n, timeout):
    qs = urllib.parse.urlencode({"query": query, "pagesPerQuery": 1})
    raw = _http_get_json("https://api.outscraper.cloud/google-search-v3?" + qs, timeout)
    # Outscraper returns {"data": [[ {organic...} ]]} shapes; be defensive.
    organic = []
    maps_website = ""
    try:
        block = raw["data"][0]
        results = block.get("organic_results") or block.get("organic") or []
        for item in results[:top_n]:
            link = item.get("link") or item.get("url") or ""
            organic.append({
                "domain": registrable_domain(link),
                "title": item.get("title", ""),
                "snippet": item.get("snippet") or item.get("description", ""),
                "link": link,
            })
    except Exception:
        pass
    return {"organic": organic, "maps_website": maps_website, "_raw_keys": list(raw.keys()) if isinstance(raw, dict) else []}


PROVIDERS = {"serper": call_serper, "serpapi": call_serpapi, "outscraper": call_outscraper}
KEY_ENV = {"serper": "SERPER_API_KEY", "serpapi": "SERPAPI_API_KEY", "outscraper": "OUTSCRAPER_API_KEY"}


def read_sample(path):
    import csv
    with open(path, encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def already_done(path):
    done = set()
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    done.add(json.loads(line)["org_id"])
                except Exception:
                    pass
    return done


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", default=os.path.join(HERE, "config.json"))
    ap.add_argument("--sample", default=os.path.join(HERE, "out", "sample.csv"))
    ap.add_argument("--out", default=os.path.join(HERE, "out", "raw_results.jsonl"))
    ap.add_argument("--provider", help="override config.provider.name")
    ap.add_argument("--api-key", help="override env key")
    ap.add_argument("--limit", type=int, default=0, help="cap rows (0 = all). Useful for a small paid pilot.")
    ap.add_argument("--go", action="store_true", help="actually call the provider. Without this, dry run.")
    args = ap.parse_args()

    cfg = load_config(args.config)
    pcfg = cfg.get("provider", {})
    provider = (args.provider or pcfg.get("name", "serper")).lower()
    if provider not in PROVIDERS:
        print(f"Unknown provider '{provider}'. Options: {list(PROVIDERS)}", file=sys.stderr)
        sys.exit(1)
    top_n = int(cfg.get("search", {}).get("top_n_results", 3))
    rpm = int(pcfg.get("requests_per_minute", 60))
    timeout = int(pcfg.get("timeout_seconds", 20))
    max_retries = int(pcfg.get("max_retries", 3))
    delay = 60.0 / max(rpm, 1)

    if not os.path.exists(args.sample):
        print(f"Sample not found: {args.sample}. Run sample_orgs.py first.", file=sys.stderr)
        sys.exit(1)
    rows = read_sample(args.sample)
    if args.limit:
        rows = rows[: args.limit]

    if not args.go:
        print(f"DRY RUN ({provider}). {len(rows)} orgs queued. No calls made, nothing written.\n", file=sys.stderr)
        for r in rows[:10]:
            print("  " + r["query"], file=sys.stderr)
        if len(rows) > 10:
            print(f"  ... and {len(rows) - 10} more", file=sys.stderr)
        print("\nAdd --go and set the API key env to run for real.", file=sys.stderr)
        return

    key = args.api_key or os.environ.get(KEY_ENV[provider], "")
    if not key:
        print(f"No API key. Set {KEY_ENV[provider]} or pass --api-key.", file=sys.stderr)
        sys.exit(1)

    done = already_done(args.out)
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    fn = PROVIDERS[provider]
    written = skipped = errors = 0

    with open(args.out, "a", encoding="utf-8") as out:
        for i, r in enumerate(rows, 1):
            if r["org_id"] in done:
                skipped += 1
                continue
            rec = {
                "org_id": r["org_id"], "name": r["name"], "city": r["city"], "state": r["state"],
                "ntee_group": r.get("ntee_group", ""), "name_commonness": r.get("name_commonness", ""),
                "query": r["query"], "provider": provider,
            }
            attempt = 0
            while True:
                attempt += 1
                try:
                    res = fn(r["query"], key, top_n, timeout)
                    rec.update({"organic": res["organic"], "maps_website": res.get("maps_website", ""), "error": ""})
                    written += 1
                    break
                except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, ValueError) as e:
                    if attempt >= max_retries:
                        rec.update({"organic": [], "maps_website": "", "error": f"{type(e).__name__}: {e}"})
                        errors += 1
                        break
                    time.sleep(delay * attempt)
            out.write(json.dumps(rec, ensure_ascii=False) + "\n")
            out.flush()
            if i % 100 == 0:
                print(f"  {i}/{len(rows)}  written={written} skipped={skipped} errors={errors}", file=sys.stderr)
            time.sleep(delay)

    print(f"Done. written={written} skipped={skipped} errors={errors} -> {args.out}", file=sys.stderr)


if __name__ == "__main__":
    main()
