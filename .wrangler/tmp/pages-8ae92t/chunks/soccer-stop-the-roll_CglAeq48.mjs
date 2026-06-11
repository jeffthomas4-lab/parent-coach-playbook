globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Before a five-year-old can pass or shoot, they need to stop the ball. Stopping is harder than it looks. The sole of the foot is the brake.</p>\n<p><strong>What you need:</strong> 1 soccer ball. Open grass.</p>\n<p><strong>Setup:</strong> Adult and child 8 feet apart. Adult has the ball.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Adult rolls the ball slowly toward the child.</li>\n<li>Child watches the ball come toward them.</li>\n<li>Child steps forward and presses the sole of their foot down on top of the ball.</li>\n<li>Ball stops. They pause for 1 second.</li>\n<li>Adult rolls the next one.</li>\n<li>Do 10 rolls.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the ball stop cleanly under their foot? Or does it squirt away to the side? Clean stops mean control.</p>\n<p><strong>If they’re struggling:</strong> Roll slower. Move closer to 5 feet.</p>\n<p><strong>If they’ve got it:</strong> Roll from different angles. Not straight at them. Slightly to the side.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size3/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 3 soccer ball →</a> — right size for ages 5–7.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stop the Roll","summary":"Receive a rolling ball and stop it cleanly using the sole of the foot. 6 minutes. Ages 5-7.","sport":"soccer","ages":["5-7"],"fundamental":"receiving","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Child's sole of the foot pressing down on a rolling soccer ball to stop it completely.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Tight, focused 5-7 receiving drill; sole-stop fundamentals."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-stop-the-roll.md";
				const url = undefined;
				function rawContent() {
					return "\nBefore a five-year-old can pass or shoot, they need to stop the ball. Stopping is harder than it looks. The sole of the foot is the brake.\n\n**What you need:** 1 soccer ball. Open grass.\n\n**Setup:** Adult and child 8 feet apart. Adult has the ball.\n\n**How to run it:**\n\n1. Adult rolls the ball slowly toward the child.\n2. Child watches the ball come toward them.\n3. Child steps forward and presses the sole of their foot down on top of the ball.\n4. Ball stops. They pause for 1 second.\n5. Adult rolls the next one.\n6. Do 10 rolls.\n\n**What to watch:** Does the ball stop cleanly under their foot? Or does it squirt away to the side? Clean stops mean control.\n\n**If they're struggling:** Roll slower. Move closer to 5 feet.\n\n**If they've got it:** Roll from different angles. Not straight at them. Slightly to the side.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 3 soccer ball →](/go/soccer-ball-size3/) — right size for ages 5–7.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
