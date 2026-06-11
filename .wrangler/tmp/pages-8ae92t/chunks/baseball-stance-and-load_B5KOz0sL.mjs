globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Before a kid swings, they have to know how to stand. The Set is the stance. The Load is what the hands and weight do before the swing starts. Most kids skip the Load because nobody taught it. Teach it now.</p>\n<p><strong>What you need:</strong> A bat. No ball today.</p>\n<p><strong>Setup:</strong> Kid stands in the batting box (or wherever you’d put one).</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Cue: Set, Load, Step, Swing. Today the focus is Set and Load.</li>\n<li>Set: feet shoulder-width apart, knees soft, weight even.</li>\n<li>Load: hands move back toward the back shoulder, weight shifts slightly to the back foot. The hands stay back, ready.</li>\n<li>Have them hold the Load position for 3 seconds. Reset. Do 10 reps of Set, Load, hold.</li>\n<li>Last 5: Set, Load, then swing through (no ball). The Load to Swing should feel like a coiled spring releasing.</li>\n</ol>\n<p><strong>What to watch:</strong> The hands during Load. If the hands stay forward by the chest, there’s no power coming. The hands have to go back.</p>\n<p><strong>If they’re struggling:</strong> Skip the Load. Just work on Set. Add Load next session.</p>\n<p><strong>If they’ve got it:</strong> Add a soft toss after the Load. They Set, Load, Step, Swing at a tossed ball.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/go/baseball-bat-28in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">28-inch youth bat →</a> — drop-10 USA-stamped bat for ages 8–10.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stance and Load","summary":"Build the body position before the swing. 8 minutes. T-ball and ages 5-7.","sport":"baseball","ages":["t-ball","5-7"],"fundamental":"hitting","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child in batting stance with feet shoulder-width apart, knees soft, hands held back by the rear shoulder, weight slightly on the back leg.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-stance-and-load.md";
				const url = undefined;
				function rawContent() {
					return "\nBefore a kid swings, they have to know how to stand. The Set is the stance. The Load is what the hands and weight do before the swing starts. Most kids skip the Load because nobody taught it. Teach it now.\n\n**What you need:** A bat. No ball today.\n\n**Setup:** Kid stands in the batting box (or wherever you'd put one).\n\n**How to run it:**\n\n1. Cue: Set, Load, Step, Swing. Today the focus is Set and Load.\n2. Set: feet shoulder-width apart, knees soft, weight even.\n3. Load: hands move back toward the back shoulder, weight shifts slightly to the back foot. The hands stay back, ready.\n4. Have them hold the Load position for 3 seconds. Reset. Do 10 reps of Set, Load, hold.\n5. Last 5: Set, Load, then swing through (no ball). The Load to Swing should feel like a coiled spring releasing.\n\n**What to watch:** The hands during Load. If the hands stay forward by the chest, there's no power coming. The hands have to go back.\n\n**If they're struggling:** Skip the Load. Just work on Set. Add Load next session.\n\n**If they've got it:** Add a soft toss after the Load. They Set, Load, Step, Swing at a tossed ball.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[28-inch youth bat →](/go/baseball-bat-28in/) — drop-10 USA-stamped bat for ages 8–10.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
