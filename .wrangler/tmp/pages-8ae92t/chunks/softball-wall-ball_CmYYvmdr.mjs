globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Wall ball teaches reaction time and foot movement. The ball bounces back unpredictably, forcing the kid to move and adjust. It’s faster than tossing drills.</p>\n<p><strong>What you need:</strong> 5 softballs (11”), a glove, a fence or wall.</p>\n<p><strong>Setup:</strong> Stand 8 feet from a wall or fence. Kid has a glove on.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Kid throws the ball underhand at the wall from 8 feet away.</li>\n<li>The ball bounces back. They catch it using Eyes, Hands, Squeeze, Pull.</li>\n<li>Do 10 throws and catches.</li>\n<li>Move back to 10 feet from the wall. Do 10 more.</li>\n<li>Move back to 12 feet. Do 10 more. Track how many they catch cleanly.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they moving their feet to the ball? Or reaching stiffly? Feet move first, hands follow.</p>\n<p><strong>If they’re struggling:</strong> Stay at 8 feet. Throw harder at the wall so it bounces closer. Use a softer ball.</p>\n<p><strong>If they’ve got it:</strong> Move to 15 feet. Throw at an angle so the rebound comes back unpredictably. Add a second ball for rapid throws.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/softball-glove-11in/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Youth softball glove →</a> — 11-inch fielder’s glove for new players.</p>\n<p><a href=\"/what-to-buy/softball/\">Full softball gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Wall Ball","summary":"Catch a ball off a wall or fence. 10 minutes. Ages 5-7 and 8-10.","sport":"softball","ages":["5-7","8-10"],"fundamental":"catching","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Child throwing a softball underhand at a wall and catching the rebound, glove ready.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Wall-rebound reaction drill; ball term fixed."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/softball-wall-ball.md";
				const url = undefined;
				function rawContent() {
					return "\nWall ball teaches reaction time and foot movement. The ball bounces back unpredictably, forcing the kid to move and adjust. It's faster than tossing drills.\n\n**What you need:** 5 softballs (11\"), a glove, a fence or wall.\n\n**Setup:** Stand 8 feet from a wall or fence. Kid has a glove on.\n\n**How to run it:**\n\n1. Kid throws the ball underhand at the wall from 8 feet away.\n2. The ball bounces back. They catch it using Eyes, Hands, Squeeze, Pull.\n3. Do 10 throws and catches.\n4. Move back to 10 feet from the wall. Do 10 more.\n5. Move back to 12 feet. Do 10 more. Track how many they catch cleanly.\n\n**What to watch:** Are they moving their feet to the ball? Or reaching stiffly? Feet move first, hands follow.\n\n**If they're struggling:** Stay at 8 feet. Throw harder at the wall so it bounces closer. Use a softer ball.\n\n**If they've got it:** Move to 15 feet. Throw at an angle so the rebound comes back unpredictably. Add a second ball for rapid throws.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Youth softball glove →](/go/softball-glove-11in/) — 11-inch fielder's glove for new players.\n\n[Full softball gear guide →](/what-to-buy/softball/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
