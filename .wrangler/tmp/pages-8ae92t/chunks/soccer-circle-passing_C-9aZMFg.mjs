globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The circle is the simplest structure for group passing. Every kid gets a touch. No waiting. No confusion about where the ball goes next.</p>\n<p><strong>What you need:</strong> 1 soccer ball. Enough space for a circle 12 feet in diameter.</p>\n<p><strong>Setup:</strong> 5-6 kids stand in a circle. One has the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Kid with the ball passes it to the kid on their right using the inside of their foot.</li>\n<li>That kid stops the ball, then passes to the next kid.</li>\n<li>Continue around the circle. No skipping. Strict order.</li>\n<li>After 5 full rotations, pass the ball the opposite direction.</li>\n<li>Do 10 rotations total.</li>\n</ol>\n<p><strong>What to watch:</strong> Are the passes reaching the target? Or going wide? Accuracy matters more than power at this age.</p>\n<p><strong>If they’re struggling:</strong> Make the circle bigger. Reduce the number of kids to 4 so distances are shorter.</p>\n<p><strong>If they’ve got it:</strong> Make the circle smaller. 10 feet diameter instead of 12. Passes have to be more accurate.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size3/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 3 soccer ball →</a> — right size for ages 5–7.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Circle Passing","summary":"Kids stand in a circle and pass the ball around. 10 minutes. Ages 5-7, 8-10.","sport":"soccer","ages":["5-7","8-10"],"fundamental":"passing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"5 children standing in a circle facing inward, one passing a soccer ball to the child to their right.","editorial":{"qualityGrade":7,"originalityGrade":6,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"needs-revision","reviewerNotes":"Drill is functional but generic; originality below 7. Could add named coaching cue or specific rotation variant to lift it."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-circle-passing.md";
				const url = undefined;
				function rawContent() {
					return "\nThe circle is the simplest structure for group passing. Every kid gets a touch. No waiting. No confusion about where the ball goes next.\n\n**What you need:** 1 soccer ball. Enough space for a circle 12 feet in diameter.\n\n**Setup:** 5-6 kids stand in a circle. One has the ball.\n\n**How to run it:**\n\n1. Kid with the ball passes it to the kid on their right using the inside of their foot.\n2. That kid stops the ball, then passes to the next kid.\n3. Continue around the circle. No skipping. Strict order.\n4. After 5 full rotations, pass the ball the opposite direction.\n5. Do 10 rotations total.\n\n**What to watch:** Are the passes reaching the target? Or going wide? Accuracy matters more than power at this age.\n\n**If they're struggling:** Make the circle bigger. Reduce the number of kids to 4 so distances are shorter.\n\n**If they've got it:** Make the circle smaller. 10 feet diameter instead of 12. Passes have to be more accurate.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 3 soccer ball →](/go/soccer-ball-size3/) — right size for ages 5–7.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
