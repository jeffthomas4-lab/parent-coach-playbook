import csv, json, sys
WL='worklist-CO-2026-07-11.csv'
rows={x['seq']:x for x in csv.DictReader(open(WL))}
dec=sys.argv[1]; out=[]
for line in open(dec):
    line=line.rstrip('\n')
    if not line.strip(): continue
    p=line.split('|')
    seq=p[0].strip(); w=rows[seq]
    conf=p[3].strip()
    out.append({"org_id":w['org_id'],"name":w['name'],"city":w['city'],"state":w['state'],
      "engine":w['engine'],"query":w['query'],"website_url":p[1].strip(),
      "website_domain":p[2].strip(),"website_confidence":int(conf) if conf else 0,
      "website_discovery_reason":p[6].strip() if len(p)>6 else "",
      "social_url":p[5].strip() if len(p)>5 else "",
      "needs_review": p[4].strip() in ('1','true','True')})
with open('results.jsonl','a') as f:
    for r in out: f.write(json.dumps(r,ensure_ascii=False)+'\n')
print('appended',len(out))
