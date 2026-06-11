globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The first step out of the blocks determines sprinting momentum. This drill teaches young athletes the mechanics of driving out of the blocks with power.</p>\n<p><strong>Equipment needed:</strong> 2 starting blocks, 1 track (or marked 60-yard straightaway).</p>\n<p><strong>Setup:</strong> Two athletes line up in starting blocks on a straightaway. Use a curved section if available so they don’t run straight downfield.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Athletes get in the blocks: front foot placement, back foot placement, hands at shoulders, weight in the blocks.</li>\n<li>Coach or starter says “Get set.” Athletes shift weight forward, ready to drive.</li>\n<li>Coach says “Go” and athletes explode out of the blocks, driving the first 10 yards hard.</li>\n<li>Focus is on the first 5 steps: powerful, low, driving out.</li>\n<li>Do 4 reps per athlete, rest between reps.</li>\n</ol>\n<p><strong>What to look for:</strong></p>\n<p>The front leg should drive hard at the first step, not reach. If an athlete is reaching with the front leg, they’re losing power. The back leg should follow quickly. The first few steps should feel like the athlete is driving downward and forward, not upward. If an athlete is standing up too early, the acceleration phase is lost.</p>\n<p><strong>Variation:</strong> Remove the blocks and teach block start mechanics without blocks. Athletes get in a 3-point stance and practice the explosive first step. This teaches muscle memory for the motion.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/xc-trainers-youth/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth running trainers →</a> — everyday training shoe for track and XC.</p>\n<p><a href=\"/what-to-buy/track-field/\">Full track field gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Block Start","summary":"Teach the mechanics of an effective explosive start from the blocks. 10 minutes.","sport":"track-field","ages":["13-14"],"focus":"fundamentals","layer":"foundations","fundamental":"starts","progression":"refine","illustrationBrief":"Starting block acceleration technique","publishedAt":"2026-04-09T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":true,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Block start mechanics; sensitive due to explosive-start injury risk."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/track-block-start-ages-13-14.md";
				const url = undefined;
				function rawContent() {
					return "\nThe first step out of the blocks determines sprinting momentum. This drill teaches young athletes the mechanics of driving out of the blocks with power.\n\n**Equipment needed:** 2 starting blocks, 1 track (or marked 60-yard straightaway).\n\n**Setup:** Two athletes line up in starting blocks on a straightaway. Use a curved section if available so they don't run straight downfield.\n\n**How to run it:**\n\n1. Athletes get in the blocks: front foot placement, back foot placement, hands at shoulders, weight in the blocks.\n2. Coach or starter says \"Get set.\" Athletes shift weight forward, ready to drive.\n3. Coach says \"Go\" and athletes explode out of the blocks, driving the first 10 yards hard.\n4. Focus is on the first 5 steps: powerful, low, driving out.\n5. Do 4 reps per athlete, rest between reps.\n\n**What to look for:**\n\nThe front leg should drive hard at the first step, not reach. If an athlete is reaching with the front leg, they're losing power. The back leg should follow quickly. The first few steps should feel like the athlete is driving downward and forward, not upward. If an athlete is standing up too early, the acceleration phase is lost.\n\n**Variation:** Remove the blocks and teach block start mechanics without blocks. Athletes get in a 3-point stance and practice the explosive first step. This teaches muscle memory for the motion.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth running trainers →](/go/xc-trainers-youth/) — everyday training shoe for track and XC.\n\n[Full track field gear guide →](/what-to-buy/track-field/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
