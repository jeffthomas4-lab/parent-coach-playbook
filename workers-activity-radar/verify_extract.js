#!/usr/bin/env node
// Mirror of the worker's camp-extraction core, runnable in plain Node (no Cloudflare,
// no API). Verifies that a page yields ALL its camps, not just one.
// Run: node verify_extract.js

function decodeEntities(s){return (s||'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();}
function stripTags(s){return decodeEntities((s||'').replace(/<[^>]+>/g,' '));}
const MONTH_MAP={january:'01',february:'02',march:'03',april:'04',may:'05',june:'06',july:'07',august:'08',september:'09',october:'10',november:'11',december:'12'};
const MONTH_PAT=Object.keys(MONTH_MAP).join('|');
function resolveUrl(href,base){try{const u=new URL(href,base);if(u.origin!==new URL(base).origin)return null;return u.href;}catch{return null;}}
function extractSeason(h){if(/\bsummer\b/i.test(h))return 'summer';if(/\bspring\b/i.test(h))return 'spring';if(/\bfall\b|\bautumn\b/i.test(h))return 'fall';if(/\bwinter\b/i.test(h))return 'winter';return null;}

const CAMP_TYPES=/^(event|educationevent|sportsevent|businessevent|childrensevent|course|festival)$/i;
function collectNodes(obj,out){if(!obj||typeof obj!=='object')return;if(Array.isArray(obj)){for(const x of obj)collectNodes(x,out);return;}if(obj['@graph'])collectNodes(obj['@graph'],out);const t=obj['@type'];const types=Array.isArray(t)?t:[t];if(types.some(x=>typeof x==='string'&&CAMP_TYPES.test(x)))out.push(obj);for(const k of Object.keys(obj)){if(k!=='@graph'&&obj[k]&&typeof obj[k]==='object')collectNodes(obj[k],out);}}
function priceFromOffers(offers){if(!offers)return{price:null};const o=Array.isArray(offers)?offers[0]:offers;const raw=o&&(o.price??o.lowPrice);if(raw==null)return{price:null};const num=typeof raw==='number'?raw:parseFloat(String(raw).replace(/[^\d.]/g,''));if(!isFinite(num)||num<5||num>15000)return{price:null};return{price:num};}
function campsFromJsonLd(html,baseUrl){const out=[];const re=/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;let m;const nodes=[];while((m=re.exec(html))!==null){let p;try{p=JSON.parse(m[1].trim());}catch{continue;}collectNodes(p,nodes);}for(const n of nodes){const name=decodeEntities(String(n.name??'')).slice(0,200);if(!name)continue;const start=n.startDate?String(n.startDate).slice(0,10):null;const end=n.endDate?String(n.endDate).slice(0,10):null;const {price}=priceFromOffers(n.offers);const regUrl=(Array.isArray(n.offers)?n.offers[0]&&n.offers[0].url:n.offers&&n.offers.url)??n.url??null;out.push({name,sessionStart:start&&/^\d{4}-\d{2}-\d{2}$/.test(start)?start:null,sessionEnd:end&&/^\d{4}-\d{2}-\d{2}$/.test(end)?end:null,price,registrationUrl:regUrl?(resolveUrl(String(regUrl),baseUrl)??String(regUrl)):null});}return out;}

const NAME_WORD=/(camp|clinic|session|academy|class|program|league|workshop|intensive)/i;
function fieldsFromChunk(name,chunkHtml){const text=stripTags(chunkHtml);const pm=/\$\s*([\d,]+(?:\.\d{2})?)/.exec(text);const price=pm?parseFloat(pm[1].replace(/,/g,'')):null;return{name:name||'Camp',price:(price&&price>=5&&price<=15000)?price:null,season:extractSeason(text),sessionStart:null};}
function campsFromBlocks(html,baseUrl){const out=[];const seen=new Set();const blockRe=/<(h[1-4]|li|article|section|div)[^>]*>([\s\S]*?)(?=<(?:h[1-4]|li|article|section)\b|$)/gi;let m;while((m=blockRe.exec(html))!==null){const chunk=m[0];const text=stripTags(chunk);if(text.length<12||text.length>4000)continue;if(!NAME_WORD.test(text))continue;const hasDate=new RegExp(`(${MONTH_PAT})\\s+\\d{1,2}|20\\d{2}`,'i').test(text);const hasPrice=/\$\s*\d/.test(text);if(!hasDate&&!hasPrice)continue;let name='';const h=/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/i.exec(chunk);if(h)name=stripTags(h[1]).slice(0,200);if(!name){const s=text.split(/[.!?]/).find(x=>NAME_WORD.test(x));name=(s??text).trim().slice(0,120);}const key=name.toLowerCase().replace(/\s+/g,' ');if(!name||seen.has(key))continue;seen.add(key);out.push(fieldsFromChunk(name,chunk));if(out.length>=50)break;}return out;}
function hasCampSignal(html){const l=html.toLowerCase();if(!/\bcamp(s)?\b/.test(l))return false;const r=/register|sign.?up|enroll|apply now|get started|book now/i.test(l);const d=/\b(january|february|march|april|may|june|july|august|september|october|november|december|20\d{2})\b/i.test(l);const p=/\$\s*\d+|\d+\s*(per|\/)\s*(day|week|session)/i.test(l);return r||d||p;}
function extractAllCamps(html,baseUrl,orgName){const ld=campsFromJsonLd(html,baseUrl);if(ld.length)return ld;const b=campsFromBlocks(html,baseUrl);if(b.length)return b;if(hasCampSignal(html))return [fieldsFromChunk(orgName+' Camp',html)];return [];}

// ---- test fixtures ----
const JSONLD_PAGE=`<html><head>
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[
 {"@type":"Event","name":"Summer Soccer Camp - Week 1","startDate":"2026-06-22","endDate":"2026-06-26","offers":{"@type":"Offer","price":"325","url":"https://reg.example.org/soccer-w1"}},
 {"@type":"Event","name":"Summer Soccer Camp - Week 2","startDate":"2026-07-06","endDate":"2026-07-10","offers":{"price":350,"url":"https://reg.example.org/soccer-w2"}}
]}</script></head><body>Camps</body></html>`;

const BLOCK_PAGE=`<html><body><h2>Our Summer Camps</h2>
<ul>
 <li><h3>Basketball Camp</h3> June 16-20, 2026. Ages 8-12. $200 per week. <a href="/register-bball">Register</a></li>
 <li><h3>Tennis Clinic</h3> July 7-11, 2026. $180. <a href="/register-tennis">Sign up</a></li>
 <li><h3>Art Workshop</h3> August 4, 2026. $90. <a href="/register-art">Enroll</a></li>
 <li>About our coaches and facilities, no dates here.</li>
</ul></body></html>`;

const SINGLE_PAGE=`<html><body><p>Join our summer camp! Register now. Runs July 2026, $150 per week.</p></body></html>`;
const NONE_PAGE=`<html><body><p>We are a youth chess club that meets weekly. Membership info here.</p></body></html>`;

let fails=0;
function check(label,got,want){const ok=got===want;if(!ok)fails++;console.log(`[${ok?'PASS':'FAIL'}] ${label}: got ${got}, want ${want}`);}

const a=extractAllCamps(JSONLD_PAGE,'https://example.org','Example');
check('JSON-LD: two camps',a.length,2);
check('JSON-LD: names kept',a[0].name.includes('Week 1')&&a[1].name.includes('Week 2'),true);
check('JSON-LD: dates kept',a[0].sessionStart==='2026-06-22'&&a[1].sessionStart==='2026-07-06',true);
check('JSON-LD: prices kept',a[0].price===325&&a[1].price===350,true);

const b=extractAllCamps(BLOCK_PAGE,'https://example.org','Example');
check('blocks: three camps (no-date li dropped)',b.length,3);
check('blocks: names',b.map(c=>c.name).join(',').toLowerCase().includes('basketball'),true);

const c=extractAllCamps(SINGLE_PAGE,'https://example.org','Example');
check('single fallback: one camp',c.length,1);

const d=extractAllCamps(NONE_PAGE,'https://example.org','Example');
check('no camp signal: zero',d.length,0);

console.log(fails?`\n${fails} FAILED.`:`\nAll extraction checks passed.`);
process.exit(fails?1:0);
