globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>This drill combines stopping and passing. Young kids need to stop the ball before they can pass it. Once it’s still, passing is easy.</p>\n<p><strong>What you need:</strong> 1 soccer ball. Open space.</p>\n<p><strong>Setup:</strong> Adult and child 12 feet apart on grass.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Adult rolls the ball slowly to the child.</li>\n<li>Child stops the ball using the sole of their foot. Pause for 1 second.</li>\n<li>Child passes the ball back to the adult using the inside of their foot.</li>\n<li>Do 8 passes total.</li>\n<li>Switch roles so the child rolls to you.</li>\n</ol>\n<p><strong>What to watch:</strong> Can they stop the ball cleanly? If it squirts away, work on that before the pass.</p>\n<p><strong>If they’re struggling:</strong> Reduce distance to 8 feet. Roll slower.</p>\n<p><strong>If they’ve got it:</strong> Increase distance to 15 feet. Remove the pause between stopping and passing. Flow continuous.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size3/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 3 soccer ball →</a> — right size for ages 5–7.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Stop the Ball Pass","summary":"Partner rolls the ball, child stops it, then passes it back. 8 minutes. Ages 5-7.","sport":"soccer","ages":["5-7"],"fundamental":"passing","progression":"intro","focus":"fundamentals","layer":"foundations","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Child stopping a rolling ball with the sole of their foot, then passing it back to an adult.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Good sequencing: stop first, pass second."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-stop-the-ball-pass.md";
				const url = undefined;
				function rawContent() {
					return "\nThis drill combines stopping and passing. Young kids need to stop the ball before they can pass it. Once it's still, passing is easy.\n\n**What you need:** 1 soccer ball. Open space.\n\n**Setup:** Adult and child 12 feet apart on grass.\n\n**How to run it:**\n\n1. Adult rolls the ball slowly to the child.\n2. Child stops the ball using the sole of their foot. Pause for 1 second.\n3. Child passes the ball back to the adult using the inside of their foot.\n4. Do 8 passes total.\n5. Switch roles so the child rolls to you.\n\n**What to watch:** Can they stop the ball cleanly? If it squirts away, work on that before the pass.\n\n**If they're struggling:** Reduce distance to 8 feet. Roll slower.\n\n**If they've got it:** Increase distance to 15 feet. Remove the pause between stopping and passing. Flow continuous.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 3 soccer ball →](/go/soccer-ball-size3/) — right size for ages 5–7.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
