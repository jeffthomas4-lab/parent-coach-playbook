import csv,json,sys
WL='out/worklist-WA-2026-07-17.csv'
bySeq={r['seq']:r for r in csv.DictReader(open(WL))}
# stdin: seq|~|url|~|domain|~|conf|~|reason|~|social
for line in sys.stdin:
    line=line.rstrip('\n')
    if not line: continue
    p=line.split('|~|')
    while len(p)<6: p.append('')
    seq,url,dom,conf,reason,social=p[0],p[1],p[2],p[3],p[4],p[5]
    r=bySeq.get(seq)
    if not r: sys.stderr.write('NO SEQ: '+seq+'\n'); continue
    conf=int(conf or 0); nr=not(url and conf>=75)
    o={"org_id":r['org_id'],"name":r['name'],"city":r['city'],"state":r['state'],
       "engine":r['engine'],"website_url":url,"website_domain":dom,
       "website_confidence":conf,"website_discovery_reason":reason,
       "social_url":social,"needs_review":nr}
    open('out/results.jsonl','a').write(json.dumps(o)+'\n')
    print('OK',seq,r['org_id'],r['name'],'nr=',nr)
