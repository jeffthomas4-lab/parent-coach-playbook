globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, d as renderComponent, e as renderSlot, g as renderHead, u as unescapeHTML } from './astro/server_CN5MjrpB.mjs';
/* empty css                          */
import { B as BUYING_GUIDES, N as NAV, d as TEAM_PARENT_CATEGORIES, e as TOOLS_NAV, U as UTILITY_NAV, a as SITE } from './site_7Zy8Bewe.mjs';

const $$Astro$2 = createAstro("https://parentcoachdesk.com");
const $$Logo = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Logo;
  const {
    variant = "dark",
    size = 22,
    ariaLabel = "Parent Coach Desk",
    class: className = ""
  } = Astro2.props;
  const baseColor = variant === "light" ? "#FAF6EE" : "#2D2520";
  const accentColor = variant === "light" ? "#D4AB6A" : variant === "solid" ? "#2D2520" : "#C5713D";
  return renderTemplate`${maybeRenderHead()}<a href="/"${addAttribute(ariaLabel, "aria-label")}${addAttribute(`group inline-flex items-baseline ${className}`, "class")} style="text-decoration: none; white-space: nowrap;"> <span${addAttribute(`
      font-family: 'Fraunces', Georgia, serif;
      font-style: italic;
      font-weight: 500;
      font-size: ${size}px;
      line-height: 1;
      letter-spacing: -0.005em;
      color: ${baseColor};
    `, "style")}>Parent Coach </span><span${addAttribute(`
      font-family: 'Fraunces', Georgia, serif;
      font-style: italic;
      font-weight: 500;
      font-size: ${size}px;
      line-height: 1;
      letter-spacing: -0.005em;
      color: ${accentColor};
    `, "style")}>Desk</span> </a>`;
}, "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/components/Logo.astro", void 0);

const $$Astro$1 = createAstro("https://parentcoachdesk.com");
const $$NavBar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$NavBar;
  const path = Astro2.url.pathname;
  const isActive = (href) => href === "/" ? path === "/" : path === href || path.startsWith(href);
  const teamSportGuides = BUYING_GUIDES.filter((g) => g.category === "sport" && g.group === "team");
  const individualSportGuides = BUYING_GUIDES.filter((g) => g.category === "sport" && g.group === "individual");
  const activityGuides = BUYING_GUIDES.filter((g) => g.category === "activity");
  return renderTemplate`${maybeRenderHead()}<header class="border-b border-bone sticky top-0 z-50 bg-paper"> <div class="container-px flex items-center justify-between py-5 gap-6"> ${renderComponent($$result, "Logo", $$Logo, { "size": 22 })} <nav class="hidden lg:flex items-center gap-7" aria-label="Primary"> ${NAV.map((item) => item.hasDropdown ? renderTemplate`<div class="relative" data-dropdown-root> <button type="button" class="font-display italic text-[1.05rem] hover:text-rust transition-colors inline-flex items-center gap-1"${addAttribute(`font-weight: 500; color: ${isActive(item.href) ? "#C5713D" : "#2D2520"};`, "style")} data-dropdown-trigger aria-haspopup="true" aria-expanded="false"> ${item.label} <span aria-hidden="true" style="font-size: 0.7em; line-height: 1;">▾</span> </button> ${item.hasDropdown === "buying-guides" && renderTemplate`<div class="absolute left-1/2 -translate-x-1/2 top-full w-[720px] bg-paper border border-bone hidden" style="padding: 1.25rem; box-shadow: 0 1px 0 rgba(45,37,32,0.08);" data-dropdown-panel> <div class="grid grid-cols-3 gap-x-6 gap-y-1"> <div> <p class="font-display italic text-rust mb-2 text-sm font-medium">Field & team sports</p> <ul class="grid gap-1"> ${teamSportGuides.map((g) => renderTemplate`<li> <a${addAttribute(`/what-to-buy/${g.slug}/`, "href")} class="font-display text-ink hover:text-rust block py-1 text-sm font-medium">${g.label}</a> </li>`)} </ul> </div> <div> <p class="font-display italic text-rust mb-2 text-sm font-medium">Individual sports</p> <ul class="grid gap-1"> ${individualSportGuides.map((g) => renderTemplate`<li> <a${addAttribute(`/what-to-buy/${g.slug}/`, "href")} class="font-display text-ink hover:text-rust block py-1 text-sm font-medium">${g.label}</a> </li>`)} </ul> </div> <div> <p class="font-display italic text-rust mb-2 text-sm font-medium">Performing arts</p> <ul class="grid gap-1"> ${activityGuides.map((g) => renderTemplate`<li> <a${addAttribute(`/what-to-buy/${g.slug}/`, "href")} class="font-display text-ink hover:text-rust block py-1 text-sm font-medium">${g.label}</a> </li>`)} </ul> </div> </div> <div class="mt-4 pt-3 border-t border-bone"> <a href="/what-to-buy/" class="t-cta">See all guides →</a> </div> </div>`} ${item.hasDropdown === "team-parent" && renderTemplate`<div class="absolute left-1/2 -translate-x-1/2 top-full w-[600px] bg-paper border border-bone hidden" style="padding: 1.25rem; box-shadow: 0 1px 0 rgba(45,37,32,0.08);" data-dropdown-panel> <p class="font-display italic text-rust mb-3 text-sm font-medium">Toolkit by category</p> <div class="grid grid-cols-2 gap-x-8 gap-y-1"> ${TEAM_PARENT_CATEGORIES.map((c) => renderTemplate`<a${addAttribute(`/team-parent/#${c.slug}`, "href")} class="font-display text-ink hover:text-rust block py-1 font-medium"> ${c.label} <span class="block font-display italic text-ink-soft text-xs mt-0.5" style="font-weight: 400;">${c.blurb}</span> </a>`)} </div> <div class="mt-4 pt-3 border-t border-bone"> <a href="/team-parent/" class="t-cta">See all resources →</a> </div> </div>`} ${item.hasDropdown === "tools" && renderTemplate`<div class="absolute left-1/2 -translate-x-1/2 top-full w-[520px] bg-paper border border-bone hidden" style="padding: 1.25rem; box-shadow: 0 1px 0 rgba(45,37,32,0.08);" data-dropdown-panel> <p class="font-display italic text-rust mb-3 text-sm font-medium">Reference tools</p> <div class="grid grid-cols-1 gap-y-1"> ${TOOLS_NAV.map((t) => renderTemplate`<a${addAttribute(t.href, "href")} class="font-display text-ink hover:text-rust block py-1.5 font-medium"> ${t.label} <span class="block font-display italic text-ink-soft text-xs mt-0.5" style="font-weight: 400;">${t.blurb}</span> </a>`)} </div> </div>`} </div>` : renderTemplate`<a${addAttribute(item.href, "href")} class="font-display italic text-[1.05rem] hover:text-rust transition-colors"${addAttribute(`font-weight: 500; color: ${isActive(item.href) ? "#C5713D" : "#2D2520"};`, "style")}> ${item.label} </a>`)} </nav> <div class="flex items-center gap-5"> <a href="/search/" class="hidden md:inline-flex items-center gap-1 font-display italic text-ink hover:text-rust transition-colors font-medium" style="font-size: 0.95rem" aria-label="Search the site"> <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"> <circle cx="9" cy="9" r="6"></circle> <line x1="13.5" y1="13.5" x2="18" y2="18" stroke-linecap="round"></line> </svg> <span>Search</span> </a> ${UTILITY_NAV.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="hidden md:inline font-display italic text-ink hover:text-rust transition-colors font-medium" style="font-size: 0.95rem">${item.label}</a>`)} <button type="button" class="lg:hidden font-display italic text-ink font-medium" style="font-size: 0.95rem" aria-label="Toggle menu" data-menu-toggle>Menu</button> </div> </div> <div class="lg:hidden hidden border-b border-bone bg-paper-warm" data-mobile-menu> <div class="container-px py-6 grid gap-4">  ${NAV.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="font-display italic text-ink hover:text-rust block py-2 font-medium">${item.label}</a>`)} <a href="/search/" class="font-display italic text-ink hover:text-rust block py-2 font-medium">Search</a> ${UTILITY_NAV.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="font-display italic text-ink hover:text-rust font-medium">${item.label}</a>`)} </div> </div> </header> `;
}, "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/components/NavBar.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="mt-24 border-t border-bone bg-paper"> <div class="container-px py-16 grid gap-12 md:grid-cols-12"> <div class="md:col-span-5"> ${renderComponent($$result, "Logo", $$Logo, { "size": 32 })} <p class="font-display text-ink-soft text-lg mt-6 max-w-md leading-snug"> <em class="text-rust italic">${SITE.tagline}</em> </p> <p class="font-display text-ink-soft mt-3 max-w-md leading-snug"> ${SITE.shortPitch} </p> </div> <div class="md:col-span-2"> <ul class="grid gap-2.5 font-display text-ink-soft"> <li><a href="/start-here/" class="hover:text-rust">Start here</a></li> <li><a href="/reads/" class="hover:text-rust">Reads</a></li> <li><a href="/parent-coach/" class="hover:text-rust">Parent-coach</a></li> <li><a href="/coaching-tips/" class="hover:text-rust">Drills</a></li> <li><a href="/what-to-buy/" class="hover:text-rust">What to buy</a></li> <li><a href="/team-parent/" class="hover:text-rust">Team parent</a></li> </ul> </div> <div class="md:col-span-2"> <ul class="grid gap-2.5 font-display text-ink-soft"> <li><a href="/cost-calculator/" class="hover:text-rust">Cost calculator</a></li> <li><a href="/sports/" class="hover:text-rust">By sport</a></li> <li><a href="/season-calendar/" class="hover:text-rust">Season calendar</a></li> <li><a href="/pathways/" class="hover:text-rust">Age pathways</a></li> <li><a href="/recruiting/" class="hover:text-rust">Recruiting</a></li> <li><a href="/rules/" class="hover:text-rust">Rules at-a-glance</a></li> <li><a href="/camps/" class="hover:text-rust">Camps and leagues</a></li> <li><a href="/governing-bodies/" class="hover:text-rust">Governing bodies</a></li> </ul> </div> <div class="md:col-span-3"> <div class="t-section mb-3">More</div> <ul class="grid gap-2.5 font-display text-ink-soft"> <li><a href="/about/" class="hover:text-rust">About</a></li> <li><a href="/newsletter/" class="hover:text-rust">Newsletter</a></li> <li><a href="/search/" class="hover:text-rust">Search</a></li> <li><a href="/disclosure/" class="hover:text-rust">Privacy and disclosure</a></li> <li><a href="/terms/" class="hover:text-rust">Terms of use</a></li> <li><a href="/accessibility/" class="hover:text-rust">Accessibility</a></li> <li><a href="/about/sources/" class="hover:text-rust">Sources</a></li> <li><a href="/about/corrections/" class="hover:text-rust">Corrections</a></li> <li><a href="/rss.xml" class="hover:text-rust">RSS feed</a></li> <li><a${addAttribute(`mailto:${SITE.email}`, "href")} class="hover:text-rust break-words">${SITE.email}</a></li> </ul> </div> </div> <div class="border-t border-bone"> <div class="container-px py-6 grid gap-3 md:flex md:justify-between md:items-center"> <div class="font-display italic text-ink-soft text-sm">
© ${year} ${SITE.name}.
</div> <div class="font-display italic text-ink-soft text-sm md:text-right max-w-md">
Some links pay us when you buy. We only recommend things we use. As an Amazon Associate we earn from qualifying purchases.
</div> <div class="font-display italic text-ink-soft text-sm md:text-right">
Written by ${SITE.byline}.
</div> </div> </div> </footer>`;
}, "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/components/Footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://parentcoachdesk.com");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title,
    description = SITE.description,
    ogImage = "/og-default.jpg",
    ogType = "website",
    canonical,
    publishedAt,
    modifiedAt,
    noindex = false
  } = Astro2.props;
  const pageTitle = title ? `${title} | ${SITE.name}` : `${SITE.name}: ${SITE.tagline}`;
  const canonicalUrl = canonical ?? new URL(Astro2.url.pathname, SITE.url).toString();
  const ogImageUrl = new URL(ogImage, SITE.url).toString();
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"', `><meta name="impact-site-verification" value="04a8c1e8-b026-4996-926e-bf13ca8bba02"><meta name="fo-verify" content="f7446405-2866-493b-a08d-5c5f098a5c34"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png"><link rel="alternate icon" href="/favicon.ico"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest"><meta name="theme-color" content="#FAF6EE"><!-- Google Analytics 4 (gtag.js).
         - is:inline keeps Astro from bundling so the snippet ships exactly
           as Google specifies.
         - Honors Global Privacy Control and Do-Not-Track by skipping load
           entirely when either is set. Disclosure page promises this.
         - EU/EEA/UK/CH visitors never get GA. Cloudflare's /cdn-cgi/trace
           endpoint (same-origin, answered at the edge) reports the visitor
           country; gtag.js is only injected for countries outside GDPR/
           ePrivacy scope. If the trace lookup fails we load GA (fail-open:
           US-audience site, and DNT/GPC are already honored above).
         - window.gtag is stubbed synchronously so the Web Vitals module
           below can queue events; if GA never loads, the queue goes nowhere
           and nothing is sent to Google.
         - anonymize_ip + Google Signals/ad features are disabled.
         - CSP in public/_headers whitelists googletagmanager.com and the
           GA4 collection endpoints. /cdn-cgi/trace is same-origin ('self'). --><script>
      (function () {
        var gpc = (navigator.globalPrivacyControl === true);
        var dnt = (navigator.doNotTrack === '1' || window.doNotTrack === '1');
        if (gpc || dnt) return;
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-BY35JP5EN8', {
          anonymize_ip: true,
          allow_google_signals: false,
          allow_ad_personalization_signals: false
        });
        var EU = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'];
        function loadGA() {
          var s = document.createElement('script');
          s.async = true;
          s.src = 'https://www.googletagmanager.com/gtag/js?id=G-BY35JP5EN8';
          document.head.appendChild(s);
        }
        fetch('/cdn-cgi/trace')
          .then(function (r) { return r.text(); })
          .then(function (t) {
            var m = t.match(/^loc=([A-Z]{2})$/m);
            if (m && EU.indexOf(m[1]) !== -1) return;
            loadGA();
          })
          .catch(loadGA);
      })();
    <\/script><!-- Web Vitals (LCP, INP, CLS, FCP, TTFB) -> GA4 events. --><script type="module">
      if (window.gtag) {
        import('https://cdn.jsdelivr.net/npm/web-vitals@4/dist/web-vitals.attribution.js')
          .then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
            function send(metric) {
              gtag('event', metric.name, {
                value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                metric_id: metric.id,
                metric_value: metric.value,
                metric_delta: metric.delta,
                metric_rating: metric.rating,
                non_interaction: true
              });
            }
            onCLS(send); onINP(send); onLCP(send); onFCP(send); onTTFB(send);
          })
          .catch(() => {});
      }
    <\/script><link rel="canonical"`, ">", "<title>", '</title><meta name="description"', '><!-- Open Graph --><meta property="og:type"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:url"', '><meta property="og:image"', '><meta property="og:site_name"', ">", "", '<!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><!-- RSS --><link rel="alternate" type="application/rss+xml"', ' href="/rss.xml"><!-- JSON-LD: Organization --><script type="application/ld+json">', "<\/script>", "", '</head> <body> <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:text-paper focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-label">Skip to content</a> ', ' <main id="main"> ', " </main> ", " </body></html>"])), addAttribute(Astro2.generator, "content"), addAttribute(canonicalUrl, "href"), noindex && renderTemplate`<meta name="robots" content="noindex, nofollow">`, pageTitle, addAttribute(description, "content"), addAttribute(ogType, "content"), addAttribute(pageTitle, "content"), addAttribute(description, "content"), addAttribute(canonicalUrl, "content"), addAttribute(ogImageUrl, "content"), addAttribute(SITE.name, "content"), publishedAt && renderTemplate`<meta property="article:published_time"${addAttribute(publishedAt, "content")}>`, modifiedAt && renderTemplate`<meta property="article:modified_time"${addAttribute(modifiedAt, "content")}>`, addAttribute(pageTitle, "content"), addAttribute(description, "content"), addAttribute(ogImageUrl, "content"), addAttribute(SITE.name, "title"), unescapeHTML(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publishingPrinciples: SITE.url + "/disclosure/"
  })), renderSlot($$result, $$slots["head"]), renderHead(), renderComponent($$result, "NavBar", $$NavBar, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
