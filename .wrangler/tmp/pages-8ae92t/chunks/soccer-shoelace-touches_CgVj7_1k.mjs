globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Shoelace touches build feel for the ball. The top of the foot has less surface area than the inside, so it forces better control. Kids stay in one spot and just work the ball.</p>\n<p><strong>What you need:</strong> 1 soccer ball per child. Grass or flat ground.</p>\n<p><strong>Setup:</strong> Kids spread out in open space. Each has a ball. Stand facing them 15 feet away.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Kid taps the ball straight up using the shoelaces. Ball goes up 12 inches, comes back down.</li>\n<li>They catch it with the same foot, tapping it up again.</li>\n<li>One touch up, catch it, one touch up. Repeat for 30 seconds.</li>\n<li>Rest. Do two more rounds of 30 seconds.</li>\n<li>Finish: tap it up 10 times in a row without stopping.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the ball bouncing straight up or rolling away? If it rolls, their foot is pushing it instead of tapping straight up.</p>\n<p><strong>If they’re struggling:</strong> Let them hold the ball and practice the foot motion without the ball first. Then add the ball.</p>\n<p><strong>If they’ve got it:</strong> Count how many touches in a row. Make it a friendly competition.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size3/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 3 soccer ball →</a> — right size for ages 5–7.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shoelace Touches","summary":"Small touches on the ball using the laces. 6 minutes. Ages 5-7.","sport":"soccer","ages":["5-7"],"fundamental":"dribbling","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Child's foot making contact with the top of the ball near the shoelaces, standing still in place.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Foot-feel work for 5-7s; coaching point on rolling vs. tapping is sharp."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-shoelace-touches.md";
				const url = undefined;
				function rawContent() {
					return "\nShoelace touches build feel for the ball. The top of the foot has less surface area than the inside, so it forces better control. Kids stay in one spot and just work the ball.\n\n**What you need:** 1 soccer ball per child. Grass or flat ground.\n\n**Setup:** Kids spread out in open space. Each has a ball. Stand facing them 15 feet away.\n\n**How to run it:**\n\n1. Kid taps the ball straight up using the shoelaces. Ball goes up 12 inches, comes back down.\n2. They catch it with the same foot, tapping it up again.\n3. One touch up, catch it, one touch up. Repeat for 30 seconds.\n4. Rest. Do two more rounds of 30 seconds.\n5. Finish: tap it up 10 times in a row without stopping.\n\n**What to watch:** Is the ball bouncing straight up or rolling away? If it rolls, their foot is pushing it instead of tapping straight up.\n\n**If they're struggling:** Let them hold the ball and practice the foot motion without the ball first. Then add the ball.\n\n**If they've got it:** Count how many touches in a row. Make it a friendly competition.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 3 soccer ball →](/go/soccer-ball-size3/) — right size for ages 5–7.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
