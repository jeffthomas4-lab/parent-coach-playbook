#!/usr/bin/env python3
"""
migrate_camps.py

Transforms the flat parent-coach-playbook `camps` table into the ActivityRadar
org-centric graph (organizations / programs / sessions / trust_signals).

It does NOT touch any live database. It reads a JSON export of the old camps
table and writes a single seed .sql file you apply to the new D1.

WORKFLOW (run from the Windows dev machine):
  1. Export the old camps table to JSON:
       npx wrangler d1 execute parent-coach-playbook --remote --json \
         --command "SELECT * FROM camps WHERE status='approved';" > camps_export.json
  2. Run this script (dry-run first to read the domain report):
       python scripts/migrate_camps.py camps_export.json --dry-run
       python scripts/migrate_camps.py camps_export.json --out seed/0005_seed_from_camps.sql
  3. Apply the seed to the NEW shared D1 (execute --file, NOT migrations apply --
     the seed lives outside migrations/ so the migration runner never re-runs it):
       npx wrangler d1 execute activity-radar --remote --file=./seed/0005_seed_from_camps.sql

DEDUP RULE
  Organizations are deduplicated by registrable website domain, EXCEPT for
  booking/social/website-builder platforms (AGGREGATOR_DOMAINS), which do not
  identify an org and so fall back to normalized name+city+state. Camps that share
  a real org domain collapse into one organization; each camp becomes a program.

SESSIONS
  Migrated camp rows do NOT fabricate session records. A camp row carries only a
  coarse start/end date range, which lives on the program (session_start_date /
  session_end_date). Per OS 07-05, Session rows represent individual meetings and
  are created only when granular schedule data exists.
"""

import argparse
import json
import os
import re
import sys
import uuid
from collections import Counter
from datetime import datetime, timezone

NS = uuid.uuid5(uuid.NAMESPACE_DNS, "activityradar.fieldforge")  # stable namespace for deterministic ids

NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

# --- sport string -> controlled category slug ------------------------------
SPORT_TO_CATEGORY = {
    "soccer": "soccer",
    "basketball": "basketball",
    "swimming": "swimming", "swim": "swimming",
    "gymnastics": "gymnastics",
    "martial arts": "martial_arts", "karate": "martial_arts", "taekwondo": "martial_arts", "judo": "martial_arts",
    "baseball": "baseball_softball", "softball": "baseball_softball", "tball": "baseball_softball", "t-ball": "baseball_softball",
    "volleyball": "volleyball",
    "football": "football", "flag football": "football",
    "tennis": "tennis",
    "track": "track_field", "track and field": "track_field", "cross country": "track_field", "running": "track_field",
    "dance": "dance", "ballet": "dance",
    "art": "arts_crafts", "arts": "arts_crafts", "arts and crafts": "arts_crafts", "crafts": "arts_crafts",
    "music": "music", "band": "music", "choir": "music",
    "theater": "theater", "theatre": "theater", "drama": "theater", "acting": "theater",
    "coding": "coding_stem", "stem": "coding_stem", "robotics": "coding_stem", "science": "coding_stem", "tech": "coding_stem",
    "lacrosse": "other", "hockey": "other", "wrestling": "other", "golf": "other", "cheer": "other",
}

SPORTS_PARENT = {  # leaf slugs that belong to the sports parent (for camp fallback)
    "soccer", "basketball", "swimming", "gymnastics", "martial_arts", "baseball_softball",
    "volleyball", "football", "tennis", "track_field",
}

# Domains that do NOT identify an organization: booking/registration platforms,
# social, website builders, generic hosts. Camps on these dedup by name+city+state
# instead of domain, so unrelated orgs that merely share a platform don't merge.
AGGREGATOR_DOMAINS = {
    "active.com", "eventbrite.com", "signupgenius.com", "teamsnap.com",
    "leagueapps.com", "sportsengine.com", "sportngin.com", "gotsport.com",
    "gotsoccer.com", "demosphere.com", "playmetrics.com", "jumbula.com",
    "regpacks.com", "amilia.com", "campbrain.com", "campwise.com", "daysmart.com",
    "myrec.com", "recdesk.com", "bsbproduction.com", "teamunify.com",
    "facebook.com", "instagram.com", "twitter.com", "x.com", "linktr.ee",
    "google.com", "sites.google.com", "docs.google.com", "forms.gle",
    "wixsite.com", "wix.com", "squarespace.com", "wordpress.com", "weebly.com",
    "godaddysites.com", "godaddy.com", "wordpress.org", "blogspot.com",
    "mailchi.mp", "bit.ly", "linktree.com",
    # National camp hosts and registration platforms: one domain hosts many
    # geographically distinct camps, so the domain does not identify a single org.
    # Their camps dedup by name+city+state into distinct local organizations.
    "ussportscamps.com", "activecommunities.com", "i9sports.com", "rec1.com",
    "hisawyer.com", "totalcamps.com", "breakthroughbasketball.com", "challengersports.com",
}


def det_id(prefix, *parts):
    key = "|".join(str(p or "") for p in parts).lower()
    return f"{prefix}-{uuid.uuid5(NS, key)}"


def norm(s):
    return re.sub(r"\s+", " ", (s or "").strip().lower())


def registrable_domain(url):
    if not url:
        return None
    m = re.search(r"https?://([^/]+)", url.strip(), re.I)
    host = (m.group(1) if m else url.strip()).lower()
    host = host.split(":")[0]
    if host.startswith("www."):
        host = host[4:]
    parts = host.split(".")
    if len(parts) >= 2:
        return ".".join(parts[-2:])
    return host or None


def org_key(camp):
    """Dedup key: registrable domain if it identifies an org, else name+city+state.
    Platform/aggregator domains do not identify an org, so they fall back to name."""
    dom = registrable_domain(camp.get("website_url"))
    if dom and dom not in AGGREGATOR_DOMAINS:
        return ("dom", dom)
    return ("nck", norm(camp.get("name")), norm(camp.get("city")), norm(camp.get("state")))


def slugify(text, fallback):
    s = re.sub(r"[^a-z0-9]+", "-", norm(text)).strip("-")
    return s or fallback


def map_category(camp):
    sport = norm(camp.get("sport"))
    cat = SPORT_TO_CATEGORY.get(sport)
    ptype = norm(camp.get("program_type")) or "camp"
    if cat:
        # a sports-category camp is better tagged as a sports camp
        if ptype == "camp" and cat in SPORTS_PARENT:
            return "camp_sports", cat
        return cat, None
    # no sport match
    if ptype == "camp":
        return "camp_general", None
    return "other", None


PRICE_RE = re.compile(r"\$?\s*([\d,]+(?:\.\d{1,2})?)")
PER_RE = [
    (re.compile(r"per\s*week|/\s*wk|/\s*week|weekly", re.I), "per_session"),
    (re.compile(r"per\s*month|/\s*mo|monthly", re.I), "per_month"),
    (re.compile(r"per\s*season|season", re.I), "per_season"),
    (re.compile(r"per\s*year|/\s*yr|annual", re.I), "per_year"),
    (re.compile(r"free|no cost", re.I), "free"),
]


def parse_price(price_text):
    if not price_text:
        return None, None
    t = price_text.strip()
    if re.search(r"free|no cost", t, re.I):
        return 0.0, "free"
    m = PRICE_RE.search(t.replace(",", ""))
    price = float(m.group(1)) if m else None
    ptype = None
    for rx, val in PER_RE:
        if rx.search(t):
            ptype = val
            break
    if price is not None and ptype is None:
        ptype = "per_session"
    return price, ptype


def map_availability(spots_status):
    s = norm(spots_status)
    return {"open": "open", "waitlist": "waitlist", "full": "full", "closed": "full"}.get(s, "unknown")


def confidence_to_score(v):
    """The camps `confidence` field is categorical ('high'/'medium'/'low'). The
    target confidence_score is a 0-100 INTEGER. Map categories; pass through
    anything already numeric; default 0."""
    if v is None or v == "":
        return 0
    s = str(v).strip().lower()
    mapped = {"verified": 100, "high": 90, "medium": 60, "med": 60, "low": 30, "unverified": 20, "unknown": 0}.get(s)
    if mapped is not None:
        return mapped
    try:
        return max(0, min(100, int(float(s))))
    except (ValueError, TypeError):
        return 0


def record_status_for_program(camp):
    status = norm(camp.get("status"))
    if status == "rejected":
        return "inactive"
    end = camp.get("end_date")
    if end:
        try:
            if datetime.fromisoformat(str(end)[:10]).date() < datetime.now(timezone.utc).date():
                return "inactive"
        except ValueError:
            pass
    return "active"


def sql_str(v):
    if v is None or v == "":
        return "NULL"
    if isinstance(v, bool):
        return "1" if v else "0"
    if isinstance(v, (int, float)):
        return str(v)
    return "'" + str(v).replace("'", "''") + "'"


def load_json_any(path):
    """Read a JSON file regardless of text encoding. Windows PowerShell's `>`
    redirect writes UTF-16; wrangler/other tools may write UTF-8. Detect the
    byte-order mark and decode accordingly so the export reads either way."""
    with open(path, "rb") as f:
        data = f.read()
    if data[:2] in (b"\xff\xfe", b"\xfe\xff"):
        text = data.decode("utf-16")  # codec auto-detects endianness and strips the BOM
    elif data[:3] == b"\xef\xbb\xbf":
        text = data.decode("utf-8-sig")
    else:
        text = data.decode("utf-8")
    return json.loads(text.lstrip("﻿"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("export", help="JSON export of the camps table")
    ap.add_argument("--out", default="seed/0005_seed_from_camps.sql")
    ap.add_argument("--dry-run", action="store_true", help="print stats + domain report, write no file")
    args = ap.parse_args()

    raw = load_json_any(args.export)

    # wrangler --json wraps results as [{"results":[...]}] ; accept either shape
    if isinstance(raw, list) and raw and isinstance(raw[0], dict) and "results" in raw[0]:
        camps = raw[0]["results"]
    elif isinstance(raw, dict) and "results" in raw:
        camps = raw["results"]
    else:
        camps = raw

    orgs = {}        # org_key -> org dict
    programs = []    # program dicts
    trust = []       # (org_id, signal_type, signal_value, signal_source)

    for c in camps:
        k = org_key(c)
        if k not in orgs:
            oid = det_id("org", *k)
            orgs[k] = {
                "id": oid,
                "name": c.get("name"),  # best available; org name often == first camp name
                "website_url": c.get("website_url"),
                "email": c.get("contact_email"),
                "phone": c.get("contact_phone"),
                "address": c.get("address"),
                "city": c.get("city"),
                "state": c.get("state"),
                "zip": c.get("zip"),
                "latitude": c.get("latitude"),
                "longitude": c.get("longitude"),
                "is_claimed": int(c.get("is_claimed") or 0),
                "claimed_by_email": c.get("claimed_by_email"),
                "record_source": "claimed" if c.get("is_claimed") else "scraped",
                "legacy_source_domain": c.get("source_domain") or registrable_domain(c.get("website_url")),
                "_cats": set(),
                "_ptypes": set(),
                "_age_min": None,
                "_age_max": None,
                "_verified": int(c.get("verified") or 0),
            }
        else:
            o = orgs[k]
            src = {"email": "contact_email", "phone": "contact_phone"}
            for fld in ("email", "phone", "address", "city", "state", "zip", "latitude", "longitude", "website_url"):
                if not o.get(fld) and c.get(src.get(fld, fld)):
                    o[fld] = c.get(src.get(fld, fld))
            if c.get("is_claimed"):
                o["is_claimed"] = 1
                o["record_source"] = "claimed"
            o["_verified"] = max(o["_verified"], int(c.get("verified") or 0))

        o = orgs[k]
        cat, secondary = map_category(c)
        o["_cats"].add(cat)
        o["_ptypes"].add(norm(c.get("program_type")) or "camp")
        amin, amax = c.get("age_min"), c.get("age_max")
        if amin is not None:
            o["_age_min"] = amin if o["_age_min"] is None else min(o["_age_min"], amin)
        if amax is not None:
            o["_age_max"] = amax if o["_age_max"] is None else max(o["_age_max"], amax)

        price, price_type = parse_price(c.get("price_text"))
        pid = det_id("prog", o["id"], c.get("id"), c.get("slug"))
        programs.append({
            "id": pid,
            "organization_id": o["id"],
            "slug": (c.get("slug") or slugify(c.get("name"), pid)),
            "name": c.get("name"),
            "program_type": norm(c.get("program_type")) or "camp",
            "activity_category": cat,
            "categories": json.dumps([secondary]) if secondary else None,
            "description": c.get("description"),
            "age_min": c.get("age_min"),
            "age_max": c.get("age_max"),
            "skill_level": c.get("skill_level") or "all",
            "session_start_date": c.get("start_date"),
            "session_end_date": c.get("end_date"),
            "price": price,
            "price_type": price_type,
            "price_text": c.get("price_text"),
            "registration_url": c.get("website_url"),
            "registration_deadline": c.get("registration_deadline"),
            "availability_status": map_availability(c.get("spots_status")),
            "day_or_overnight": c.get("day_or_overnight"),
            "lunch_included": c.get("lunch_included"),
            "aftercare_available": c.get("aftercare_available"),
            "schedule_text": c.get("schedule_text"),
            "hero_photo_key": c.get("hero_photo_key"),
            "record_source": "claimed" if c.get("is_claimed") else "scraped",
            "record_status": record_status_for_program(c),
            "confidence_score": confidence_to_score(c.get("confidence")),
            "source_domain": c.get("source_domain"),
            "url_health_status": c.get("url_health_status"),
            "legacy_camp_id": c.get("id"),
            "legacy_slug": c.get("slug"),
        })

    # build trust signals per org
    for o in orgs.values():
        if o["is_claimed"]:
            trust.append((o["id"], "claimed_status", "true", "self_reported"))
        if o["_verified"]:
            trust.append((o["id"], "verified", "true", "manual"))

    stats = {
        "camps_in": len(camps),
        "organizations": len(orgs),
        "programs": len(programs),
        "trust_signals": len(trust),
        "orgs_collapsed_from_camps": len(camps) - len(orgs),
        "orgs_vs_camps_ratio": round(len(orgs) / max(len(camps), 1), 3),
    }
    print(json.dumps(stats, indent=2), file=sys.stderr)

    # Domain report: how the dedup grouped camps. Lets us spot a platform domain
    # that is wrongly merging unrelated orgs (add it to AGGREGATOR_DOMAINS).
    dom_counts = Counter()
    no_site = 0
    aggregated = 0
    for c in camps:
        d = registrable_domain(c.get("website_url"))
        if not d:
            no_site += 1
        elif d in AGGREGATOR_DOMAINS:
            aggregated += 1
        else:
            dom_counts[d] += 1
    print("\n-- domain report (top 20 org-identifying domains by camp count) --", file=sys.stderr)
    for d, n in dom_counts.most_common(20):
        print(f"  {n:5}  {d}", file=sys.stderr)
    print(f"  camps with no website:            {no_site}", file=sys.stderr)
    print(f"  camps on platform domains:        {aggregated}  (deduped by name+city+state)", file=sys.stderr)
    print(f"  distinct org-identifying domains: {len(dom_counts)}", file=sys.stderr)

    if args.dry_run:
        return

    lines = [
        "-- 0005_seed_from_camps.sql",
        "-- Generated by scripts/migrate_camps.py. Do not hand-edit.",
        f"-- Generated at {NOW}. Source rows: {len(camps)}.",
        "-- Note: no BEGIN/COMMIT wrapper. D1 'execute --file' rejects SQL transactions.",
        "",
    ]

    for o in orgs.values():
        cats = sorted(c for c in o["_cats"] if c)
        ptypes = sorted(p for p in o["_ptypes"] if p)
        lines.append(
            "INSERT INTO organizations (id,slug,name,organization_type,website_url,email,phone,"
            "address,city,state,zip,latitude,longitude,categories,age_min,age_max,program_types,"
            "record_source,record_status,is_claimed,claimed_by_email,confidence_score,"
            "legacy_source_domain,created_at,last_verified_at,updated_at) VALUES ("
            + ",".join([
                sql_str(o["id"]),
                sql_str(slugify(o["name"], o["id"])),
                sql_str(o["name"]),
                sql_str("other"),
                sql_str(o["website_url"]),
                sql_str(o["email"]),
                sql_str(o["phone"]),
                sql_str(o["address"]),
                sql_str(o["city"]),
                sql_str(o["state"]),
                sql_str(o["zip"]),
                sql_str(o["latitude"]),
                sql_str(o["longitude"]),
                sql_str(json.dumps(cats) if cats else None),
                sql_str(o["_age_min"]),
                sql_str(o["_age_max"]),
                sql_str(json.dumps(ptypes) if ptypes else None),
                sql_str(o["record_source"]),
                sql_str("active"),
                sql_str(o["is_claimed"]),
                sql_str(o["claimed_by_email"]),
                sql_str(0),
                sql_str(o["legacy_source_domain"]),
                sql_str(NOW),
                sql_str(NOW),
                sql_str(NOW),
            ]) + ");"
        )

    lines.append("")
    for p in programs:
        lines.append(
            "INSERT INTO programs (id,organization_id,slug,name,program_type,activity_category,categories,"
            "description,age_min,age_max,skill_level,session_start_date,session_end_date,price,price_type,"
            "price_text,registration_url,registration_deadline,availability_status,day_or_overnight,"
            "lunch_included,aftercare_available,schedule_text,hero_photo_key,record_source,record_status,"
            "confidence_score,source_domain,url_health_status,legacy_camp_id,legacy_slug,"
            "created_at,last_verified_at,updated_at) VALUES ("
            + ",".join([
                sql_str(p["id"]), sql_str(p["organization_id"]), sql_str(p["slug"]), sql_str(p["name"]),
                sql_str(p["program_type"]), sql_str(p["activity_category"]), sql_str(p["categories"]),
                sql_str(p["description"]), sql_str(p["age_min"]), sql_str(p["age_max"]), sql_str(p["skill_level"]),
                sql_str(p["session_start_date"]), sql_str(p["session_end_date"]), sql_str(p["price"]),
                sql_str(p["price_type"]), sql_str(p["price_text"]), sql_str(p["registration_url"]),
                sql_str(p["registration_deadline"]), sql_str(p["availability_status"]), sql_str(p["day_or_overnight"]),
                sql_str(p["lunch_included"]), sql_str(p["aftercare_available"]), sql_str(p["schedule_text"]),
                sql_str(p["hero_photo_key"]), sql_str(p["record_source"]), sql_str(p["record_status"]),
                sql_str(p["confidence_score"]), sql_str(p["source_domain"]), sql_str(p["url_health_status"]),
                sql_str(p["legacy_camp_id"]), sql_str(p["legacy_slug"]),
                sql_str(NOW), sql_str(NOW), sql_str(NOW),
            ]) + ");"
        )

    lines.append("")
    for (oid, stype, sval, ssrc) in trust:
        tid = det_id("trust", oid, stype)
        lines.append(
            "INSERT INTO trust_signals (id,organization_id,signal_type,signal_value,signal_source,verified_at,created_at) VALUES ("
            + ",".join([sql_str(tid), sql_str(oid), sql_str(stype), sql_str(sval), sql_str(ssrc), sql_str(NOW), sql_str(NOW)])
            + ");"
        )

    lines.append("")
    out_dir = os.path.dirname(args.out)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Wrote {args.out} ({len(orgs)} orgs, {len(programs)} programs, {len(trust)} trust signals)", file=sys.stderr)


if __name__ == "__main__":
    main()
