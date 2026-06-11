globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from './astro/server_CN5MjrpB.mjs';

const html = "<p>In games, shooters don’t have time to set up. They dribble, they see an opening, they shoot. This drill teaches timing and composure. Shoot before the defender arrives.</p>\n<p><strong>What you need:</strong> 1 soccer ball, 2 kids, a goal, 20 feet of space.</p>\n<p><strong>Setup:</strong> Attacker starts 20 feet from goal with the ball. Defender lines up 5 feet behind the attacker.</p>\n<p><strong>How to run it:</strong></p>\n<ol>\n<li>You call “Go.” Attacker dribbles forward using Touch, Look, Push, Go. Small touches, eyes up, push into space, accelerate.</li>\n<li>Defender closes from behind, not yet tackling.</li>\n<li>Attacker sees the space and shoots before the defender arrives, using Plant, Lock, Strike, Finish.</li>\n<li>If the attacker gets a shot off, that’s a win. If the defender tackles first, they win.</li>\n<li>Do 4 attempts, then switch.</li>\n</ol>\n<p><strong>What to watch:</strong> Does the attacker shoot too early (low xG) or wait too long (defender arrives)? Timing is the key.</p>\n<p><strong>If they’re struggling:</strong> Start defender farther back. Give the attacker more space.</p>\n<p><strong>If they’ve got it:</strong> Defender can now start beside the attacker. That’s a harder angle to beat.</p>\n<hr>\n<p><strong>Gear for this drill</strong> (affiliate)</p>\n<p><a href=\"/go/soccer-ball-size4/\" rel=\"sponsored nofollow noopener\" target=\"_blank\">Size 4 soccer ball →</a> — right size for ages 8–12.</p>\n<p><a href=\"/what-to-buy/soccer/\">Full soccer gear guide →</a> — all picks by age, sport, and level.</p>\n<p><em>As an Amazon Associate we earn from qualifying purchases.</em></p>";

				const frontmatter = {"title":"Shoot from the Dribble","summary":"Dribble toward goal and take a shot before a defender catches up. 10 minutes. Ages 11-12.","sport":"soccer","ages":["11-12"],"fundamental":"shooting","progression":"refine","focus":"fundamentals","layer":"situational","publishedAt":"2026-05-02T00:00:00.000Z","featured":false,"illustrationBrief":"Player dribbling at speed toward goal with a defender closing in from behind, taking a shot.","editorial":{"qualityGrade":8,"originalityGrade":7,"voiceGrade":8,"flagInappropriateness":false,"flagIpRisk":false,"flagSensitiveTopic":false,"citationCheckPassed":true,"sportLanguageCheckPassed":true,"affiliateDisclosurePresent":true,"claudeReviewedAt":"2026-05-09T00:00:00.000Z","status":"claude-reviewed","reviewerNotes":"Good timing-vs-composure framing; xG mention may be too jargon-y for some parents."}};
				const file = "C:/Users/jeffthomas/Desktop/Claude Cowork/Outputs/parent-coach-playbook/src/content/coachingTips/soccer-shoot-from-the-dribble.md";
				const url = undefined;
				function rawContent() {
					return "\nIn games, shooters don't have time to set up. They dribble, they see an opening, they shoot. This drill teaches timing and composure. Shoot before the defender arrives.\n\n**What you need:** 1 soccer ball, 2 kids, a goal, 20 feet of space.\n\n**Setup:** Attacker starts 20 feet from goal with the ball. Defender lines up 5 feet behind the attacker.\n\n**How to run it:**\n\n1. You call \"Go.\" Attacker dribbles forward using Touch, Look, Push, Go. Small touches, eyes up, push into space, accelerate.\n2. Defender closes from behind, not yet tackling.\n3. Attacker sees the space and shoots before the defender arrives, using Plant, Lock, Strike, Finish.\n4. If the attacker gets a shot off, that's a win. If the defender tackles first, they win.\n5. Do 4 attempts, then switch.\n\n**What to watch:** Does the attacker shoot too early (low xG) or wait too long (defender arrives)? Timing is the key.\n\n**If they're struggling:** Start defender farther back. Give the attacker more space.\n\n**If they've got it:** Defender can now start beside the attacker. That's a harder angle to beat.\n\n---\n\n**Gear for this drill** (affiliate)\n\n[Size 4 soccer ball →](/go/soccer-ball-size4/) — right size for ages 8–12.\n\n[Full soccer gear guide →](/what-to-buy/soccer/) — all picks by age, sport, and level.\n\n*As an Amazon Associate we earn from qualifying purchases.*\n";
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
