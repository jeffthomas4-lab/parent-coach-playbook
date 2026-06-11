globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>The triangle teaches kids spatial awareness. Each player has a passing option and needs to read who’s closest. It’s simple but it demands constant small decisions.</p>\n<p><strong>What you need:</strong> 1 soccer ball. 3 kids. Open space.</p>\n<p><strong>Setup:</strong> Three kids stand 15 feet apart forming a triangle.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Using Plant, Open, Strike, Follow: one kid passes the ball to a teammate.</li>\n<li>After the pass, that kid moves 2 feet to a new spot to maintain triangle shape.</li>\n<li>The receiver receives using See, Cushion, Settle, Move, then passes to the third kid.</li>\n<li>Continuous motion. Keep the ball moving through all three.</li>\n<li>15 consecutive passes with no errors.</li>\n</ol>\n<p><strong>What to watch:</strong> Are they moving after the pass? Or standing still? Movement maintains spacing.</p>\n<p><strong>If they’re struggling:</strong> Move the triangle to 20 feet per side. Larger space, less pressure.</p>\n<p><strong>If they’ve got it:</strong> Add a time limit. 15 passes in 30 seconds. Make it a speed drill.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Three Player Passing Triangle","summary":"Three kids pass in a moving triangle formation. 10 minutes. Ages 8-10.","sport":"soccer","ages":["8-10"],"fundamental":"passing","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Three players positioned at the corners of a triangle, one passing to another while moving to fill a gap.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Move-after-pass cue is the key teaching point."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-three-player-passing-triangle.md";
				const url = undefined;
				function rawContent() {
					return "\nThe triangle teaches kids spatial awareness. Each player has a passing option and needs to read who's closest. It's simple but it demands constant small decisions.\n\n**What you need:** 1 soccer ball. 3 kids. Open space.\n\n**Setup:** Three kids stand 15 feet apart forming a triangle.\n\n**How to run it:**\n\n1. Using Plant, Open, Strike, Follow: one kid passes the ball to a teammate.\n2. After the pass, that kid moves 2 feet to a new spot to maintain triangle shape.\n3. The receiver receives using See, Cushion, Settle, Move, then passes to the third kid.\n4. Continuous motion. Keep the ball moving through all three.\n5. 15 consecutive passes with no errors.\n\n**What to watch:** Are they moving after the pass? Or standing still? Movement maintains spacing.\n\n**If they're struggling:** Move the triangle to 20 feet per side. Larger space, less pressure.\n\n**If they've got it:** Add a time limit. 15 passes in 30 seconds. Make it a speed drill.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
