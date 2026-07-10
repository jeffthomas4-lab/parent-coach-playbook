#!/usr/bin/env python3
"""Self-contained verification of the scoring rules. Mirrors score.py logic.
Run: python verify_scoring.py  (expects all cases PASS)."""
import difflib, json, os, re
from urllib.parse import urlparse

HERE = os.path.dirname(__file__)
SC = json.load(open(os.path.join(HERE, "config.json"), encoding="utf-8"))["scoring"]

US_STATES = {"AL":"alabama","AK":"alaska","AZ":"arizona","AR":"arkansas","CA":"california",
"CO":"colorado","CT":"connecticut","DE":"delaware","FL":"florida","GA":"georgia","HI":"hawaii",
"ID":"idaho","IL":"illinois","IN":"indiana","IA":"iowa","KS":"kansas","KY":"kentucky","LA":"louisiana",
"ME":"maine","MD":"maryland","MA":"massachusetts","MI":"michigan","MN":"minnesota","MS":"mississippi",
"MO":"missouri","MT":"montana","NE":"nebraska","NV":"nevada","NH":"new hampshire","NJ":"new jersey",
"NM":"new mexico","NY":"new york","NC":"north carolina","ND":"north dakota","OH":"ohio","OK":"oklahoma",
"OR":"oregon","PA":"pennsylvania","RI":"rhode island","SC":"south carolina","SD":"south dakota",
"TN":"tennessee","TX":"texas","UT":"utah","VT":"vermont","VA":"virginia","WA":"washington",
"WV":"west virginia","WI":"wisconsin","WY":"wyoming"}


def tokenize(s, stop, suf):
    drop = set(stop) | set(suf)
    return [t for t in re.findall(r"[a-z0-9]+", (s or "").lower()) if t not in drop and len(t) > 1]


def _r(a, b):
    return int(round(difflib.SequenceMatcher(None, a, b).ratio() * 100))


def tsr(a, b):
    if not a or not b:
        return 0
    sa, sb = set(a), set(b)
    inter = sorted(sa & sb)
    t0 = " ".join(inter).strip()
    t1 = (" ".join(inter) + " " + " ".join(sorted(sa - sb))).strip()
    t2 = (" ".join(inter) + " " + " ".join(sorted(sb - sa))).strip()
    if not t0:
        return _r(" ".join(sorted(sa)), " ".join(sorted(sb)))
    return max(_r(t0, t1), _r(t0, t2), _r(t1, t2))


def dclass(domain, sc):
    d = (domain or "").lower()
    if not d:
        return "empty"
    def hit(g):
        return any(d == x or d.endswith("." + x) or x in d for x in sc.get(g, []))
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


def city_in(city, *t):
    if not city or len(city.strip()) < 3:
        return False
    blob = " ".join(x.lower() for x in t if x)
    return city.lower().strip() in blob


def geo_conflict(state, *texts):
    state = (state or "").upper()
    if state not in US_STATES:
        return False
    blob = " ".join(x for x in texts if x)
    low = blob.lower()
    if US_STATES[state] in low:
        return False
    if re.search(r"\b" + state + r"\b", blob):
        return False
    found = set()
    for m in re.findall(r",\s*([A-Z]{2})\b", blob):
        if m in US_STATES:
            found.add(m)
    for st, full in US_STATES.items():
        if re.search(r"\b" + re.escape(full) + r"\b", low):
            found.add(st)
    found.discard(state)
    return bool(found)


def score_org(rec, sc):
    accept, rmin = sc["name_accept_min"], sc["name_review_min"]
    stop, suf = sc.get("stopwords", []), sc.get("drop_corporate_suffixes", [])
    nt = tokenize(rec.get("name", ""), stop, suf)
    city = rec.get("city", "")
    cands = list(rec.get("organic") or [])
    ms = rec.get("maps_website") or ""
    if ms:
        host = urlparse(ms if "://" in ms else "http://" + ms).netloc.lower()
        host = host[4:] if host.startswith("www.") else host
        cands.insert(0, {"domain": host, "title": rec.get("name", ""), "snippet": "", "_maps": True})
    if not cands:
        return "no_result", 0, False
    best, bs = None, -1
    for c in cands:
        s = max(tsr(nt, tokenize(c.get("title", ""), stop, suf)),
                tsr(nt, tokenize((c.get("domain", "") or "").replace(".", " "), stop, suf)))
        c = dict(c, _s=s, _d=dclass(c.get("domain", ""), sc))
        c["_g"] = bool(c.get("_maps")) or city_in(city, c.get("title", ""), c.get("snippet", ""))
        if s > bs:
            bs, best = s, c
    d, geo, ns = best["_d"], best["_g"], best["_s"]
    if d in ("social", "registration"):
        return "social_only", ns, geo
    if d in ("directory", "news", "gov"):
        return "no_result", ns, geo
    if ns >= accept and geo:
        return "resolved_correct", ns, geo
    if ns >= accept and not geo:
        if geo_conflict(rec.get("state", ""), best.get("title", ""), best.get("snippet", "")):
            return "wrong_match", ns, geo
        return "review", ns, geo
    if rmin <= ns < accept and geo:
        return "review", ns, geo
    if ns < rmin:
        return "no_result", ns, geo
    return "review", ns, geo


CASES = [
    ("exact own + city", {"name": "Metro Parks Tacoma", "city": "Tacoma", "state": "WA",
     "organic": [{"domain": "metroparkstacoma.org", "title": "Metro Parks Tacoma | Parks & Recreation",
     "snippet": "Serving Tacoma, WA."}], "maps_website": ""}, "resolved_correct"),
    ("own strong, no city", {"name": "Hanover Soccer Club", "city": "Vancouver", "state": "WA",
     "organic": [{"domain": "hanoversoccerclub.org", "title": "Hanover Soccer Club",
     "snippet": "Youth soccer."}], "maps_website": ""}, "review"),
    ("national parent wrong geo", {"name": "Boys & Girls Club", "city": "Olympia", "state": "WA",
     "organic": [{"domain": "bgca.org", "title": "Boys & Girls Clubs of America",
     "snippet": "National headquarters in Atlanta, GA."}], "maps_website": ""}, "wrong_match"),
    ("facebook only", {"name": "Lakewood Little League", "city": "Lakewood", "state": "WA",
     "organic": [{"domain": "facebook.com", "title": "Lakewood Little League | Facebook",
     "snippet": "Lakewood WA."}], "maps_website": ""}, "social_only"),
    ("registration platform", {"name": "Eastside Volleyball Club", "city": "Bellevue", "state": "WA",
     "organic": [{"domain": "sportsengine.com", "title": "Eastside Volleyball Club - SportsEngine",
     "snippet": "Bellevue."}], "maps_website": ""}, "social_only"),
    ("yelp directory", {"name": "Tacoma Gymnastics Center", "city": "Tacoma", "state": "WA",
     "organic": [{"domain": "yelp.com", "title": "Tacoma Gymnastics Center - Yelp",
     "snippet": "Reviews."}], "maps_website": ""}, "no_result"),
    ("irrelevant", {"name": "Riverside Youth Rowing Association", "city": "Spokane", "state": "WA",
     "organic": [{"domain": "amazon.com", "title": "Rowing machines", "snippet": "Shop."}],
     "maps_website": ""}, "no_result"),
    ("maps fills geo", {"name": "Cascade Climbers Club", "city": "Everett", "state": "WA",
     "organic": [{"domain": "cascadeclimbers.com", "title": "Cascade Climbers Club", "snippet": ""}],
     "maps_website": "https://cascadeclimbers.com"}, "resolved_correct"),
]

fails = 0
for label, rec, exp in CASES:
    got, ns, geo = score_org(rec, SC)
    ok = got == exp
    fails += 0 if ok else 1
    print("[%s] %s: got=%s (name=%s geo=%d) expected=%s" % (
        "PASS" if ok else "FAIL", label, got, ns, int(bool(geo)), exp))
print()
print("All %d passed." % len(CASES) if not fails else "%d FAILED." % fails)
