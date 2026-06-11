globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>In a boat, balance is currency. This drill teaches the rower to feel a stable platform.</p>\n<p><strong>Equipment needed:</strong> A single, double, or sweep boat. Calm water.</p>\n<p><strong>Setup:</strong> Rowing at low rate, blades feathered.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Take five normal strokes.</li>\n<li>On the sixth recovery, pause halfway up the slide — body forward, knees bent slightly, blades just off the water.</li>\n<li>Hold for three beats. Try not to let the boat tip.</li>\n<li>Resume the stroke. Repeat for ten cycles.</li>\n</ol>\n<p><strong>What to look for:</strong> The boat shouldn’t rock during the pause. If it does, the rower’s body is shifting. Hands stay at the same height through the pause.</p>\n<p><strong>Variation:</strong> Add a balance test — pause and try to tap one blade on the water without the other blade dragging. Reveals which side the rower favors.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/resistance-bands-set/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Resistance band set →</a> — land-based strength and conditioning supplement.</p>\n<p><a href=\"/what-to-buy/crew/\">Full crew gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Balance Pause","summary":"Pause mid-recovery on the slide. Tests boat-set awareness. Ages 13-14.","sport":"crew","age":"13-14","ages":["13-14"],"focus":"fundamentals","layer":"skills","fundamental":"positioning","progression":"build","illustrationBrief":"A young rower in a single scull pausing on the slide, blades feathered just off the water for balance.","publishedAt":"2026-05-12T00:00:00.000Z","featured":false,"editorial":{"qualityGrade":6,"originalityGrade":6,"voiceGrade":7,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-12T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Generated as part of the per-sport content baseline. Voice may need a Jeff pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/crew-balance-pause.md";
				const url = undefined;
				function rawContent() {
					return "\nIn a boat, balance is currency. This drill teaches the rower to feel a stable platform.\n\n**Equipment needed:** A single, double, or sweep boat. Calm water.\n\n**Setup:** Rowing at low rate, blades feathered.\n\n**How to run it:**\n\n1. Take five normal strokes.\n2. On the sixth recovery, pause halfway up the slide — body forward, knees bent slightly, blades just off the water.\n3. Hold for three beats. Try not to let the boat tip.\n4. Resume the stroke. Repeat for ten cycles.\n\n**What to look for:** The boat shouldn't rock during the pause. If it does, the rower's body is shifting. Hands stay at the same height through the pause.\n\n**Variation:** Add a balance test — pause and try to tap one blade on the water without the other blade dragging. Reveals which side the rower favors.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Resistance band set →](/go/resistance-bands-set/) — land-based strength and conditioning supplement.\n\n[Full crew gear guide →](/what-to-buy/crew/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
