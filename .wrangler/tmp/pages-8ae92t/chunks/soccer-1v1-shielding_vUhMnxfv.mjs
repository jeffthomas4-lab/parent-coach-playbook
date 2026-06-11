globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>Shielding teaches the dribbler to protect the ball with their body. They’re not muscling the defender. They’re positioning themselves between the ball and the opponent.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 4 cones to mark a 10x10 grid.</p>\n<p><strong>Setup:</strong> Two kids inside the grid. One with the ball. One defending. You watch from the side.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Dribbler moves around the grid using Touch, Look, Push, Go. Small touches, eyes up, push when there’s space, accelerate.</li>\n<li>When the defender gets close, the dribbler shields by turning their hips sideways and keeping the ball on the far side.</li>\n<li>Defender tries to poke the ball away but cannot push or pull.</li>\n<li>Play for 30 seconds. Then switch.</li>\n<li>Do 3 rounds each.</li>\n</ol>\n<p><strong>What to watch:</strong> Is the dribbler using their body smartly or just running? Smart shielding means angling the hips and using an arm for balance, not for contact.</p>\n<p><strong>If they’re struggling:</strong> Make the grid bigger (12x12). Give the dribbler more space.</p>\n<p><strong>If they’ve got it:</strong> Shrink the grid to 8x8. Add a second ball later.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"1v1 Shielding","summary":"Dribbler shields the ball from a defender in a small grid. 10 minutes. Ages 8-10, 11-12.","sport":"soccer","ages":["8-10","11-12"],"fundamental":"dribbling","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Dribbler with hips turned to the side, arm extended (not pushing), keeping the ball on the far side away from the defender.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Clean pass."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-1v1-shielding.md";
				const url = undefined;
				function rawContent() {
					return "\nShielding teaches the dribbler to protect the ball with their body. They're not muscling the defender. They're positioning themselves between the ball and the opponent.\n\n**What you need:** 1 soccer ball, 4 cones to mark a 10x10 grid.\n\n**Setup:** Two kids inside the grid. One with the ball. One defending. You watch from the side.\n\n**How to run it:**\n\n1. Dribbler moves around the grid using Touch, Look, Push, Go. Small touches, eyes up, push when there's space, accelerate.\n2. When the defender gets close, the dribbler shields by turning their hips sideways and keeping the ball on the far side.\n3. Defender tries to poke the ball away but cannot push or pull.\n4. Play for 30 seconds. Then switch.\n5. Do 3 rounds each.\n\n**What to watch:** Is the dribbler using their body smartly or just running? Smart shielding means angling the hips and using an arm for balance, not for contact.\n\n**If they're struggling:** Make the grid bigger (12x12). Give the dribbler more space.\n\n**If they've got it:** Shrink the grid to 8x8. Add a second ball later.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
