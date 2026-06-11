globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const $$Astro = createAstro("https://parentcoachdesk.com");
const $$NewsletterSignup = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$NewsletterSignup;
  const {
    variant = "inline",
    headline = "The Friday Letter",
    blurb = "One short read every Friday from the Parent Coach Desk. Easy unsubscribe.",
    buttonLabel = "Get the Friday Letter"
  } = Astro2.props;
  const KIT_HOSTED_URL = "https://parent-coach-playbook.kit.com/4b28f916b5";
  const isCard = variant === "card";
  const isCompact = variant === "compact";
  return renderTemplate`${isCompact ? renderTemplate`${maybeRenderHead()}<aside class="border border-bone bg-paper-warm rounded-lg p-5"><p class="font-display italic text-rust mb-1 font-medium" style="font-size: 0.95rem;">
The Friday Letter
</p><h3 class="font-display text-ink text-xl leading-tight font-medium">${headline}</h3><p class="font-display text-ink-soft text-sm mt-2 leading-snug">${blurb}</p><a${addAttribute(KIT_HOSTED_URL, "href")} class="btn-soft mt-4 inline-block">${buttonLabel}</a><p class="font-display italic text-ink-soft text-xs mt-3">
Easy unsubscribe. By subscribing you agree to receive emails from
      Parent Coach Desk and to our <a href="/disclosure/" class="text-rust hover:underline">privacy notice</a>.
</p></aside>` : renderTemplate`<section${addAttribute(`${isCard ? "border border-ink bg-ink text-paper overflow-hidden" : "border-t border-b border-bone py-14"}`, "class")}>${isCard && renderTemplate`<figure class="border-b border-paper-warm/20"><img src="/illustrations/newsletter-banner.webp" alt="A rural mailbox at sunset with a folded copy of The Parent Coach Desk newspaper inside. A driveway leads to a small lit house in the distance." class="w-full h-48 md:h-64 object-cover" loading="lazy" decoding="async"></figure>`}<div${addAttribute(`${isCard ? "p-10" : "container-px"} grid md:grid-cols-12 gap-8 items-end`, "class")}><div class="md:col-span-6"><p class="font-display italic mb-3"${addAttribute(`font-weight: 500; color: ${isCard ? "#D4AB6A" : "#C5713D"};`, "style")}>
The Friday Letter
</p><h3${addAttribute(`font-display text-3xl md:text-[2.5rem] leading-[1.07] font-medium ${isCard ? "text-paper" : "text-ink"}`, "class")}>${headline}</h3><p${addAttribute(`font-display mt-3 leading-snug ${isCard ? "text-paper-warm" : "text-ink-soft"}`, "class")}>${blurb}</p></div><div class="md:col-span-6"><a${addAttribute(KIT_HOSTED_URL, "href")}${addAttribute(`btn-soft inline-block ${isCard ? "" : ""}`, "class")}>${buttonLabel}</a><p${addAttribute(`font-display italic text-xs mt-3 ${isCard ? "text-paper-warm" : "text-ink-soft"}`, "class")}>
We won't send you spam. Unsubscribe whenever. By subscribing you
          agree to our <a href="/disclosure/"${addAttribute(`underline ${isCard ? "text-paper" : "text-rust"} hover:opacity-80`, "class")}>privacy notice</a>.
</p></div></div></section>`}`;
}, "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/components/NewsletterSignup.astro", void 0);

export { $$NewsletterSignup as $ };
