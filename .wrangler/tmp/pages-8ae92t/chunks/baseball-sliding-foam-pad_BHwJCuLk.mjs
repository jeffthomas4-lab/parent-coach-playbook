globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Sliding on dirt scares most kids. Foam (a yoga mat or a furniture pad) is a soft surface that lets them feel the slide motion without the burn of dirt on the legs. Once they trust the move, they’ll do it on dirt.</p>\n<p><strong>What you need:</strong> A foam mat, yoga mat, or furniture pad. Sliding shorts or sweatpants. A base or a marker at the end of the mat.</p>\n<p><strong>Setup:</strong> Mat on grass. Mark a base at the far end of the mat.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Demonstrate the slide: leg bent underneath (back leg), other leg extended toward the base, body falling backward.</li>\n<li>Kid runs at half speed and slides on the mat.</li>\n<li>Do 5 reps slow.</li>\n<li>Now full speed runs into the slide. 5 reps.</li>\n<li>Last 2: slide on grass next to the mat. Now they know what dirt sliding feels like.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they staying on their feet too long? Sliders go down sooner than they think. The slide should start about 5 feet from the base, not 1 foot.</p>\n<p><strong>If they’re struggling:</strong> Stay on the mat. Don’t move to grass yet.</p>\n<p><strong>If they’ve got it:</strong> Move to a base on dirt. Sliding shorts under the pants prevent rash.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/baseball-glove-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth baseball glove →</a> — the first piece of gear for every new player.</p>\n<p><a href=\"/what-to-buy/baseball/\">Full baseball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Sliding on a Foam Pad","summary":"Practice sliding on a soft surface before doing it on dirt. 10 minutes. Ages 8-10 and 11-12.","sport":"baseball","ages":["8-10","11-12"],"fundamental":"base-running","progression":"intro","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"A child mid-slide on a foam mat or yoga mat, one leg bent under, the other extended toward a base.","editorial":{"qualityGrade":8,"originalityGrade":8,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Sliding safety topic flagged. Drill uses foam progression before dirt; note about sliding shorts is appropriate. No head-first sliding instruction."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/baseball-sliding-foam-pad.md";
				const url = undefined;
				function rawContent() {
					return "\nSliding on dirt scares most kids. Foam (a yoga mat or a furniture pad) is a soft surface that lets them feel the slide motion without the burn of dirt on the legs. Once they trust the move, they'll do it on dirt.\n\n**What you need:** A foam mat, yoga mat, or furniture pad. Sliding shorts or sweatpants. A base or a marker at the end of the mat.\n\n**Setup:** Mat on grass. Mark a base at the far end of the mat.\n\n**How to run it:**\n\n1. Demonstrate the slide: leg bent underneath (back leg), other leg extended toward the base, body falling backward.\n2. Kid runs at half speed and slides on the mat.\n3. Do 5 reps slow.\n4. Now full speed runs into the slide. 5 reps.\n5. Last 2: slide on grass next to the mat. Now they know what dirt sliding feels like.\n\n**What to watch:** Are they staying on their feet too long? Sliders go down sooner than they think. The slide should start about 5 feet from the base, not 1 foot.\n\n**If they're struggling:** Stay on the mat. Don't move to grass yet.\n\n**If they've got it:** Move to a base on dirt. Sliding shorts under the pants prevent rash.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth baseball glove →](/go/baseball-glove-youth/) — the first piece of gear for every new player.\n\n[Full baseball gear guide →](/what-to-buy/baseball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
