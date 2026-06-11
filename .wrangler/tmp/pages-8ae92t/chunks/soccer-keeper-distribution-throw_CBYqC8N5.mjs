globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>This drill is for kids who want to play goalkeeper. Goalkeepers are the first attacker. They have to throw accurately to start the team’s offense. Range and accuracy matter.</p>\n<p><strong>What you need:</strong> A goal. A soccer ball. 30 feet of space.</p>\n<p><strong>Setup:</strong> Keeper is in the goal. Two receiving targets (teammates or cones) are 15 feet away on either side.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>Keeper holds the ball in both hands at chest height.</li>\n<li>Keeper brings the ball to one ear, loading the throw.</li>\n<li>Keeper steps forward and throws underhand or overhand to one of the targets.</li>\n<li>Ball reaches the target. Count it as a successful throw.</li>\n<li>Do 4 throws to the left, 4 throws to the right.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the throw reach the target? Distance and accuracy matter more than speed.</p>\n<p><strong>If they’re struggling:</strong> Move the targets closer to 12 feet.</p>\n<p><strong>If they’ve got it:</strong> Increase distance to 20 feet. Add movement. The targets run, the keeper throws to space.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/go/soccer-cones-12pk/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Disc cones (50-pack) →</a> — flat cones for gates, grids, and boundary markers.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Keeper Distribution Throw","summary":"Goalkeeper throws the ball to a teammate to start an attack. 10 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"goalkeeping","progression":"build","focus":"fundamentals","layer":"skills","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Goalkeeper in one-handed throwing position, releasing a ball toward a teammate.","editorial":{"qualityGrade":7,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Distribution throw drill. Soccer vocab correct."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-keeper-distribution-throw.md";
				const url = undefined;
				function rawContent() {
					return "\nThis drill is for kids who want to play goalkeeper. Goalkeepers are the first attacker. They have to throw accurately to start the team's offense. Range and accuracy matter.\n\n**What you need:** A goal. A soccer ball. 30 feet of space.\n\n**Setup:** Keeper is in the goal. Two receiving targets (teammates or cones) are 15 feet away on either side.\n\n**How to run it:**\n\n1. Keeper holds the ball in both hands at chest height.\n2. Keeper brings the ball to one ear, loading the throw.\n3. Keeper steps forward and throws underhand or overhand to one of the targets.\n4. Ball reaches the target. Count it as a successful throw.\n5. Do 4 throws to the left, 4 throws to the right.\n\n**What to watch:** Does the throw reach the target? Distance and accuracy matter more than speed.\n\n**If they're struggling:** Move the targets closer to 12 feet.\n\n**If they've got it:** Increase distance to 20 feet. Add movement. The targets run, the keeper throws to space.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Disc cones (50-pack) →](/go/soccer-cones-12pk/) — flat cones for gates, grids, and boundary markers.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
